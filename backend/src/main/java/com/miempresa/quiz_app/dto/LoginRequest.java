package com.miempresa.quiz_app.dto;

// 1: Este DTo es la entrada de seguridad.
// Se utiliza en AuthController para capturar credenciales que el usuario escribe en React o React Native
public record LoginRequest(
    String nombre,
    String password
) {}