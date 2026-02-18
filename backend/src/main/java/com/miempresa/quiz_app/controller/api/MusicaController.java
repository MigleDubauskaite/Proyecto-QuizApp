package com.miempresa.quiz_app.controller.api;

import com.miempresa.quiz_app.dto.MusicaDTO;
import com.miempresa.quiz_app.service.MusicaService; // La interfaz
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

    @GetMapping("/buscar")
    public MusicaDTO obtenerMusica() {
        return musicaService.buscarMusicaRandom();
    }
}