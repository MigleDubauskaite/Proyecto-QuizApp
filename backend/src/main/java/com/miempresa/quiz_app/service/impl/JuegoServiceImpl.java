package com.miempresa.quiz_app.service.impl;

import com.miempresa.quiz_app.dto.*;
import com.miempresa.quiz_app.model.mongo.document.Pregunta;
import com.miempresa.quiz_app.model.mysql.entity.Usuario;
import com.miempresa.quiz_app.model.mysql.entity.Partida;
import com.miempresa.quiz_app.repository.mongo.PreguntaRepository;
import com.miempresa.quiz_app.repository.mysql.PartidaRepository;
import com.miempresa.quiz_app.service.JuegoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JuegoServiceImpl implements JuegoService {

    private final PreguntaRepository preguntaRepo;
    private final PartidaRepository partidaRepo;

    public JuegoServiceImpl(PreguntaRepository preguntaRepo, PartidaRepository partidaRepo) {
        this.preguntaRepo = preguntaRepo;
        this.partidaRepo = partidaRepo;
    }

    // =====================================================
    // OPCIONES DEL QUIZ
    // =====================================================
    @Override
    public OpcionesQuizDTO obtenerOpcionesDisponibles() {
        List<String> categorias = preguntaRepo.findAll().stream()
                .map(Pregunta::getCategoria)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        List<Pregunta.TipoPregunta> tipos = Arrays.asList(Pregunta.TipoPregunta.values());
        List<Integer> opcionesCantidad = List.of(10, 15, 20);

        return new OpcionesQuizDTO(categorias, tipos, opcionesCantidad);
    }

    // =====================================================
    // INICIO DE PARTIDA
    // =====================================================
    @Override
    @Transactional
    public PartidaResponse iniciarPartida(Usuario jugador, List<String> categorias, 
                                         List<String> tiposStr, Integer cantidadSeleccionada) {

        List<Integer> opcionesPermitidas = List.of(10, 15, 20);
        int cantidadFinal = (cantidadSeleccionada != null && opcionesPermitidas.contains(cantidadSeleccionada))
                ? cantidadSeleccionada : 10;

        List<Pregunta.TipoPregunta> tipos = convertirTiposStringAEnum(tiposStr);
        List<Pregunta> preguntas = obtenerPreguntasFiltradas(categorias, tipos, cantidadFinal);

        if (preguntas.isEmpty()) {
            throw new RuntimeException("No hay preguntas disponibles para los filtros seleccionados.");
        }

        Partida partida = new Partida();
        partida.setUsuario(jugador);
        partida.setTotalPreguntas(preguntas.size());
        
        // Si no se eligen categorías, guardamos las que realmente salieron en el sorteo
        if (categorias == null || categorias.isEmpty()) {
            partida.setCategorias(preguntas.stream().map(Pregunta::getCategoria).distinct().toList());
        } else {
            partida.setCategorias(categorias);
        }

        partida.setTipos(tipos);
        partida.setAciertos(0);
        partida.setPuntos(0);
        partida.setPreguntaIds(preguntas.stream().map(Pregunta::getId).toList());

        partidaRepo.save(partida);

        return new PartidaResponse(
                partida.getId(),
                jugador.getId(),
                jugador.getNombre(),
                partida.getAciertos(),
                partida.getTotalPreguntas(),
                prepararPreguntasParaFront(preguntas)
        );
    }

    // =====================================================
    // REGISTRO DE RESPUESTAS
    // =====================================================
    @Override
    @Transactional
    public RespuestaResultadoDTO registrarRespuesta(Long partidaId, String preguntaId, List<String> respuestasUsuario) {

        Partida partida = partidaRepo.findById(partidaId)
                .orElseThrow(() -> new IllegalArgumentException("Partida no encontrada"));
        Pregunta pregunta = preguntaRepo.findById(preguntaId)
                .orElseThrow(() -> new IllegalArgumentException("Pregunta no encontrada"));

        List<String> correctas = pregunta.getRespuestasCorrectas();
        boolean esCorrecta = correctas.size() == respuestasUsuario.size() &&
                             new HashSet<>(correctas).equals(new HashSet<>(respuestasUsuario));

        // Actualizamos progreso
        partida.setPreguntasRespondidas(partida.getPreguntasRespondidas() + 1);

        if (esCorrecta) {
            partida.setAciertos(partida.getAciertos() + 1);
        }

        // Calculamos nota normalizada (0-100)
        int puntosNormalizados = calcularPuntajeNormalizado(partida.getAciertos(), partida.getTotalPreguntas());
        partida.setPuntos(puntosNormalizados);

        boolean terminada = partida.getPreguntasRespondidas() >= partida.getTotalPreguntas();
        partidaRepo.save(partida);

        return new RespuestaResultadoDTO(
                esCorrecta,
                correctas,
                esCorrecta ? 10 : 0, // Valor simbólico de la pregunta actual
                partida.getPuntos(), // Nota sobre 100
                partida.getAciertos(),
                partida.getTotalPreguntas(),
                terminada
        );
    }

    // =====================================================
    // CONSULTAS (HISTORIAL Y DETALLE)
    // =====================================================
    @Override
    public List<HistorialDTO> obtenerHistorialPorJugador(Long usuarioId) {
        List<Partida> partidas = partidaRepo.findByUsuarioIdOrderByIdDesc(usuarioId);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        return partidas.stream()
                // Solo mostramos partidas que se han completado
                .filter(p -> p.getPreguntasRespondidas() >= p.getTotalPreguntas())
                .map(p -> new HistorialDTO(
                        p.getId(),
                        p.getFecha() != null ? p.getFecha().format(formatter) : "Reciente",
                        (p.getCategorias() != null && !p.getCategorias().isEmpty()) 
                                ? String.join(", ", p.getCategorias()) : "Multitemática",
                        p.getPuntos(),
                        p.getTotalPreguntas(),
                        p.getAciertos()
                )).collect(Collectors.toList());
    }

    @Override
    public PartidaResponse obtenerPartidaConPreguntas(Long partidaId) {
        Partida partida = partidaRepo.findById(partidaId)
                .orElseThrow(() -> new IllegalArgumentException("Partida no encontrada"));

        List<Pregunta> preguntas = (List<Pregunta>) preguntaRepo.findAllById(partida.getPreguntaIds());

        return new PartidaResponse(
                partida.getId(),
                partida.getUsuario().getId(),
                partida.getUsuario().getNombre(),
                partida.getAciertos(),
                partida.getTotalPreguntas(),
                prepararPreguntasParaFront(preguntas)
        );
    }

    // =====================================================
    // MÉTODOS PRIVADOS AUXILIARES (Lógica de Negocio)
    // =====================================================

    private List<PreguntaDTO> prepararPreguntasParaFront(List<Pregunta> preguntas) {
        return preguntas.stream().map(p -> {
            // Mezclamos las opciones aquí para que el DTO sea puro
            List<String> opcionesMezcladas = new ArrayList<>(p.getOpciones());
            Collections.shuffle(opcionesMezcladas);

            return new PreguntaDTO(
                    p.getId(),
                    p.getEnunciado(),
                    p.getTipo(),
                    p.getCategoria(),
                    opcionesMezcladas
            );
        }).toList();
    }

    private int calcularPuntajeNormalizado(int aciertos, int total) {
        if (total <= 0) return 0;
        return (int) Math.round(((double) aciertos / total) * 100);
    }

    private List<Pregunta.TipoPregunta> convertirTiposStringAEnum(List<String> tiposStr) {
        if (tiposStr == null || tiposStr.isEmpty()) return List.of();
        return tiposStr.stream()
                .map(String::toUpperCase)
                .map(Pregunta.TipoPregunta::valueOf)
                .toList();
    }

    private List<Pregunta> obtenerPreguntasFiltradas(List<String> categorias, List<Pregunta.TipoPregunta> tipos, int cantidad) {
        List<Pregunta> pool = preguntaRepo.findAll().stream()
                .filter(p -> categorias == null || categorias.isEmpty() || categorias.contains(p.getCategoria()))
                .filter(p -> tipos == null || tipos.isEmpty() || tipos.contains(p.getTipo()))
                .collect(Collectors.toList());

        Collections.shuffle(pool);
        return pool.stream().limit(cantidad).toList();
    }
}