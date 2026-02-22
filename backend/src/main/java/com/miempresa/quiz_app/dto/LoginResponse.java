package com.miempresa.quiz_app.dto;

// 2: Es la respuesta oficial del servidor tras una autenticación.
// Sirve para entregar las credenciales necesarias para mantener la sesión activa
// Se utiliza en UsuarioService, AuthController
public record LoginResponse(
    String token, // contiene el JWT que el frontend lo almacenará en localStorage
    String nombre,
    String rol
) {}