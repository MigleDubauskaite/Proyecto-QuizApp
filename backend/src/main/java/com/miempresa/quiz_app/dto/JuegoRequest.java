package com.miempresa.quiz_app.dto;

import java.util.List;

public record JuegoRequest(
    String nombre,
    List<String> categorias,
    List<String> tipos,
    Integer cantidad
) {}