package com.miempresa.quiz_app.dto;

import java.util.List;

public record RespuestaResultadoDTO(boolean esCorrecta, List<String> respuestasCorrectas, int puntosObtenidos,
		int puntosTotales, int aciertosActuales, int totalPreguntas, boolean terminada) {
}