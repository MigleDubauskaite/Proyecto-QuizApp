package com.miempresa.quiz_app.dto;

// El DTO de Resumen del Rendimiento
// Se utiliza en el JuegoService (obtenerHistorialPorJugador), JuegoRestController (/historial)
public record HistorialDTO(
	    Long id,
	    String fecha,
	    String categoria,
	    int puntos,
	    int totalPreguntas,
	    int aciertos
	) {}