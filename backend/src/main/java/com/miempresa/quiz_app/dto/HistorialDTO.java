package com.miempresa.quiz_app.dto;

public record HistorialDTO(
	    Long id,
	    String fecha,
	    String categoria,
	    int puntos,
	    int totalPreguntas,
	    int aciertos
	) {}