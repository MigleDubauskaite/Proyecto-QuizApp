package com.miempresa.quiz_app.dto;

import com.miempresa.quiz_app.model.mongo.document.Pregunta;
import java.util.List;

public record PreguntaDTO(String id, String enunciado, Pregunta.TipoPregunta tipo, String categoria,
		List<String> opciones) {
	public PreguntaDTO(Pregunta p) {
		this(p.getId(), p.getEnunciado(), p.getTipo(), p.getCategoria(), p.getOpciones());
	}
}