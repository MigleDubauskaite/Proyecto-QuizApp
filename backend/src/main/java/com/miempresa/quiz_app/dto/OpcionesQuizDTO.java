package com.miempresa.quiz_app.dto;

import com.miempresa.quiz_app.model.mongo.document.Pregunta;
import java.util.List;

public record OpcionesQuizDTO(
    List<String> categorias,
    List<Pregunta.TipoPregunta> tipos,
    List<Integer> opcionesCantidad // 10, 15, 20
) {}