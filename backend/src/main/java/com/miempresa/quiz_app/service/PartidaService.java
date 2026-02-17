package com.miempresa.quiz_app.service;

import com.miempresa.quiz_app.model.mysql.entity.Partida;

import java.util.List;
import java.util.Optional;

public interface PartidaService {

    Partida guardar(Partida partida);

    Optional<Partida> getById(Long id);

    List<Partida> obtenerRankingTop10();

    List<Partida> obtenerPorJugador(Long jugadorId);

    Partida actualizar(Partida partida);
    
}

