package com.miempresa.quiz_app.controller.api;

import com.miempresa.quiz_app.dto.MusicaDTO;
import com.miempresa.quiz_app.service.MusicaService; // La interfaz

import io.swagger.v3.oas.annotations.Operation;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/movil/musica") // Esta ruta ya es pública por tu SecurityConfig
public class MusicaController {

    private final MusicaService musicaService;

    // Inyectamos la interfaz (Spring usará MusicaServiceImpl automáticamente)
    public MusicaController(MusicaService musicaService) {
        this.musicaService = musicaService;
    }

    @Operation(
    		summary = "Obtener una canción relajante", 
    		description = "Llama a la API de Jamendo, busca 50 temas del género 'calm' y devuelve uno al azar."
    		)
    @GetMapping("/buscar")
    public MusicaDTO obtenerMusica() {
        return musicaService.buscarMusicaRandom();
    }
}