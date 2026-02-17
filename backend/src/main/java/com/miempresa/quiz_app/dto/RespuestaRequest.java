package com.miempresa.quiz_app.dto;

import java.util.List;

public record RespuestaRequest(Long partidaId, String preguntaId, List<String> respuestasUsuario) {
}