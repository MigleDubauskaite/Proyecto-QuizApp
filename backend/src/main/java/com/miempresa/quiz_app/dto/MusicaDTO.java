package com.miempresa.quiz_app.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Modelo que representa la información de una canción para el reproductor.")
public record MusicaDTO(
    @Schema(description = "ID único de la canción en Jamendo", example = "123456")
    String id,
    
    @Schema(description = "Título de la pista", example = "Deep Meditation")
    String titulo,
    
    @Schema(description = "Nombre del artista o banda", example = "Ambient Master")
    String artista,
    
    @Schema(description = "URL directa del streaming de audio", example = "https://mp3l.jamendo.com/...")
    String urlAudio,
    
    @Schema(description = "URL de la carátula del álbum", example = "https://usercontent.jamendo.com/...")
    String urlImagen
) {}