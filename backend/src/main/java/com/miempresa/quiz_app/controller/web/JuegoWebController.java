package com.miempresa.quiz_app.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class JuegoWebController {

    @PostMapping("/jugar")
    public String irALoginReact(
            @RequestParam(required = false) List<String> categorias,
            @RequestParam(required = false) List<String> tipos,
            @RequestParam(defaultValue = "10") int cantidad) {

        // 1. Preparamos los parámetros para la URL de React.
        // Convertimos las listas a String separadas por comas para que React las lea fácil.
        String cats = (categorias != null && !categorias.isEmpty()) ? String.join(",", categorias) : "";
        String typs = (tipos != null && !tipos.isEmpty()) ? String.join(",", tipos) : "";

        // 2. Redirigimos al Login de React pasando la "configuración" de la partida.
        // No llamamos al service aquí porque aún no tenemos el NOMBRE del jugador.
        return "redirect:http://localhost:5173/login?categorias=" + cats + 
               "&tipos=" + typs + 
               "&cantidad=" + cantidad;
    }
}