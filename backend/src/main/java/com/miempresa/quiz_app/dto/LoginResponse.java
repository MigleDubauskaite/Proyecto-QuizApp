package com.miempresa.quiz_app.dto;

public record LoginResponse(
    String token,
    String nombre,
    String rol
) {}