package com.miempresa.quiz_app.dto;

import java.util.List;

// Se utiliza en el momento que el jugador confirma su elección y lo envía al servidor
// Se utiliza en JuegoRestController (/answer), JuegoServiceImpl.registrarRespuesta
public record RespuestaRequest(
		Long partidaId, 
		String preguntaId, 
		List<String> respuestasUsuario) {
}