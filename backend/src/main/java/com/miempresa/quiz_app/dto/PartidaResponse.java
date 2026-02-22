package com.miempresa.quiz_app.dto;

import java.util.List;

// Sirve como el paquete global que React necesita para renderizar la pantalla de juego.
// Entrega las preguntas, proporciona datos de partida (id, quien juega, progreso actual)
// Se utiliza en JuegoService (creación de partida, recuperación de partidas)
public record PartidaResponse(
		Long partidaId, 
		Long jugadorId, 
		String nombreJugador, 
		int aciertos, 
		int totalPreguntas,
		List<PreguntaDTO> preguntas
		) {
}