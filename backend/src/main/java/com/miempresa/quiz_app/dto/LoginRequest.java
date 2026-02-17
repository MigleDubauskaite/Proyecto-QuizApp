package com.miempresa.quiz_app.dto;

public record LoginRequest(
    String nombre,
    String password
) {}