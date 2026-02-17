package com.miempresa.quiz_app.service;

import com.miempresa.quiz_app.dto.LoginResponse;
import com.miempresa.quiz_app.model.mysql.entity.Usuario;

public interface UsuarioService {
    
    // Para el flujo de Login (Genera el Token)
    LoginResponse autenticar(String nombre, String password);
    
    // Para el flujo de Registro
    Usuario registrar(String nombre, String password);
    
    // Para recuperar al usuario autenticado desde el Token
    Usuario buscarPorNombre(String nombre);
    
    // Tu login antiguo (opcional, por si lo usas en otro sitio)
    Usuario login(String nombre, String password);
    
    boolean existePorNombre(String nombre);
}