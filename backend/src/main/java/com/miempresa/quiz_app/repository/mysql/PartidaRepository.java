package com.miempresa.quiz_app.repository.mysql;

import com.miempresa.quiz_app.model.mysql.entity.Partida;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartidaRepository extends JpaRepository<Partida, Long> {

    List<Partida> findTop10ByOrderByAciertosDesc();

    List<Partida> findByUsuarioIdOrderByIdDesc(Long usuarioId);
    
    
}