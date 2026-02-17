package com.miempresa.quiz_app.service;

import com.miempresa.quiz_app.dto.*;
import com.miempresa.quiz_app.model.mysql.entity.Usuario;
import java.util.List;

public interface JuegoService {

    /**
     * Obtiene las categorías y tipos de preguntas disponibles en la base de datos.
     */
    OpcionesQuizDTO obtenerOpcionesDisponibles();

    /**
     * Inicia una nueva partida para un jugador ya autenticado.
     */
    PartidaResponse iniciarPartida(Usuario jugador, List<String> categorias, 
                                  List<String> tiposStr, Integer cantidadSeleccionada);

    /**
     * Registra la respuesta de un usuario y actualiza el progreso de la partida.
     */
    RespuestaResultadoDTO registrarRespuesta(Long partidaId, String preguntaId, List<String> respuestasUsuario);

    /**
     * Recupera una partida con sus preguntas completas (para reconexión o vista final).
     */
    PartidaResponse obtenerPartidaConPreguntas(Long partidaId);
    
    List<HistorialDTO> obtenerHistorialPorJugador(Long usuarioId);
    
    
}