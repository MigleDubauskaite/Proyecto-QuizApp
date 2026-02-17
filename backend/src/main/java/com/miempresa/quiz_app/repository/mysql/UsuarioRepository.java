package com.miempresa.quiz_app.repository.mysql;

import com.miempresa.quiz_app.model.mysql.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByNombre(String nombre);
    boolean existsByNombre(String nombre);
}