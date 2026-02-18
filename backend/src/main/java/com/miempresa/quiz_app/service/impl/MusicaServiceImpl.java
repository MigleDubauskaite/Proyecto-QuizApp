package com.miempresa.quiz_app.service.impl;

import com.miempresa.quiz_app.dto.MusicaDTO;
import com.miempresa.quiz_app.service.MusicaService;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class MusicaServiceImpl implements MusicaService {
    
    // CLIENT ID REAL DE JAMENDO
    private final String CLIENT_ID = "828c080a"; 
    
    private final RestTemplate restTemplate;

    public MusicaServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public MusicaDTO buscarMusicaRandom() {
        // Forzamos el género "calm" o "relax" directamente en la URL
        String generoTranquilo = "calm"; 
        String url = String.format(
            "https://api.jamendo.com/v3.0/tracks/?client_id=%s&format=json&limit=50&fuzzytags=%s&order=popularity_month",
            CLIENT_ID, generoTranquilo
        );

        try {
            Map<String, Object> respuesta = restTemplate.getForObject(url, Map.class);
            List<Map<String, Object>> resultados = (List<Map<String, Object>>) respuesta.get("results");

            if (resultados == null || resultados.isEmpty()) {
                System.out.println("No se encontraron canciones tranquilas.");
                return null;
            }

            // Elegimos una canción aleatoria de las 50 recibidas
            int randomIndex = (int) (Math.random() * resultados.size());
            Map<String, Object> res = resultados.get(randomIndex);

            // Mapeo seguro usando String.valueOf para evitar errores de ClassCastException
            return new MusicaDTO(
                String.valueOf(res.get("id")),
                String.valueOf(res.get("name")),
                String.valueOf(res.get("artist_name")),
                String.valueOf(res.get("audio")),
                String.valueOf(res.get("album_image"))
            );

        } catch (Exception e) {
            System.err.println("Error al llamar a Jamendo: " + e.getMessage());
            return null;
        }
    }
}