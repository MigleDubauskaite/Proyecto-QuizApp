package com.miempresa.quiz_app.service.impl;

import com.miempresa.quiz_app.model.mysql.entity.Partida;
import com.miempresa.quiz_app.repository.mysql.PartidaRepository;
import com.miempresa.quiz_app.service.PartidaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PartidaServiceImpl implements PartidaService {

    @Autowired
    private PartidaRepository partidaRepository;

    @Override
    public Partida guardar(Partida partida) {
        return partidaRepository.save(partida);
    }

    @Override
    public Optional<Partida> getById(Long id) {
        return partidaRepository.findById(id);
    }

    @Override
    public List<Partida> obtenerRankingTop10() {
        // Ordenamos por aciertos descendente y limitamos a 10
        return partidaRepository.findTop10ByOrderByAciertosDesc();
    }

    @Override
    public List<Partida> obtenerPorJugador(Long jugadorId) {
        return partidaRepository.findByUsuarioIdOrderByIdDesc(jugadorId);
    }

    @Override
    public Partida actualizar(Partida partida) {
        // Guardar actualizando la misma entidad
        return partidaRepository.save(partida);
    }
}
