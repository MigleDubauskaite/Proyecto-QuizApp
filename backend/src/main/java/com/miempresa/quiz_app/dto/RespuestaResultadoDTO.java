package com.miempresa.quiz_app.dto;

import java.util.List;

// Sirve para dar la respuesta inmediata para el usuario después de terminar una partida
// Se utiliza en JuegoServiceImpl (registrar respuesta), JuegoRestController (POST /api/juego/answer)
public record RespuestaResultadoDTO(
		boolean esCorrecta, 
		List<String> respuestasCorrectas, 
		int puntosObtenidos,
		int puntosTotales, 
		int aciertosActuales, 
		int totalPreguntas, 
		boolean terminada) {
}