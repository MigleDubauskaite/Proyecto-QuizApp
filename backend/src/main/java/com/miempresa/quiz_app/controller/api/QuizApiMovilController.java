package com.miempresa.quiz_app.controller.api;

import com.miempresa.quiz_app.dto.OpcionesQuizDTO;
import com.miempresa.quiz_app.dto.PartidaResponse;
import com.miempresa.quiz_app.dto.RespuestaResultadoDTO;
import com.miempresa.quiz_app.model.mysql.entity.Usuario;
import com.miempresa.quiz_app.model.mysql.entity.Usuario.Rol;
import com.miempresa.quiz_app.repository.mysql.UsuarioRepository;
import com.miempresa.quiz_app.service.JuegoService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movil")
public class QuizApiMovilController {

    private final JuegoService juegoService;
    private final UsuarioRepository usuarioRepo;
    private final BCryptPasswordEncoder passwordEncoder; 

    public QuizApiMovilController(JuegoService juegoService, 
                                 UsuarioRepository usuarioRepo, 
                                 BCryptPasswordEncoder passwordEncoder) {
        this.juegoService = juegoService;
        this.usuarioRepo = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
    }
    
    @GetMapping("/opciones-quiz")
    public OpcionesQuizDTO obtenerOpcionesParaMovil() {
        // Llamamos a tu lógica de negocio que ya hace el .distinct() y saca los enums
        return juegoService.obtenerOpcionesDisponibles();

    }

    // 1. INICIAR: Crea la partida y devuelve las preguntas
    @PostMapping("/iniciar")
    public PartidaResponse iniciarDesdeMovil(@RequestBody Map<String, Object> payload) {
        // Buscamos o creamos el usuario Invitado con password encriptado
        Usuario invitado = usuarioRepo.findByNombre("Invitado_Movil")
                .orElseGet(() -> {
                    Usuario nuevo = new Usuario();
                    nuevo.setNombre("Invitado_Movil");
                    // Encriptamos la clave para que coincida con SecurityConfig
                    nuevo.setPassword(passwordEncoder.encode("1234")); 
                    nuevo.setRol(Rol.USER);
                    return usuarioRepo.save(nuevo);
                });

        // Extracción de datos con valores por defecto
        List<String> categorias = (List<String>) payload.get("categorias");
        String tipoStr = payload.get("tipo") != null ? payload.get("tipo").toString() : "UNICA";
        
        // Casting seguro usando Pattern Matching de Java
        Integer cantidad = 10;
        if (payload.get("cantidad") instanceof Number num) {
            cantidad = num.intValue();
        }

        return juegoService.iniciarPartida(invitado, categorias, List.of(tipoStr), cantidad);
    }

    // 2. REGISTRAR: Se llama cada vez que el usuario marca una opción
    @PostMapping("/responder/{partidaId}/{preguntaId}")
    public RespuestaResultadoDTO registrarRespuesta(
            @PathVariable Long partidaId,
            @PathVariable String preguntaId,
            @RequestBody List<String> respuestas) {
        
        return juegoService.registrarRespuesta(partidaId, preguntaId, respuestas);
    }

    // 3. FINALIZAR: Resumen de puntos al terminar todas las preguntas
    @GetMapping("/finalizar/{partidaId}")
    public Map<String, Object> obtenerResumenFinal(@PathVariable Long partidaId) {
        PartidaResponse partida = juegoService.obtenerPartidaConPreguntas(partidaId);
        
        return Map.of(
            "puntos", partida.aciertos(),
            "total", partida.totalPreguntas(),
            "mensaje", "¡Partida completada con éxito!",
            "jugador", partida.nombreJugador(),
            "idPartida", partidaId
        );
    }
}