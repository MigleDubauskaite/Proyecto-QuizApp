package com.miempresa.quiz_app.dto;

import java.util.List;
// Es el DTO de entrada de filtros
// Transporta las elecciones de jugador desde interfaz del usuario hasta el motor del juego en backend
// Se utiliza en JuegoRestController (/iniciar)
public record JuegoRequest(
    String nombre,
    List<String> categorias,
    List<String> tipos,
    Integer cantidad
) {}