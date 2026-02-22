package com.miempresa.quiz_app.dto;

import com.miempresa.quiz_app.model.mongo.document.Pregunta;
import java.util.List;

// Este DTO es un objeto de configuración inicial
// Sirve para enviar a frontend las opciones disponibles para que el usuario pueda configurar antes de empezar la partida
// Se utiliza en JuegoService
public record OpcionesQuizDTO(
    List<String> categorias,
    List<Pregunta.TipoPregunta> tipos,
    List<Integer> opcionesCantidad // 10, 15, 20
) {}