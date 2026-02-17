package com.miempresa.quiz_app.service;

import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.miempresa.quiz_app.model.mongo.document.Pregunta;

public interface PreguntaService {

    List<Pregunta> obtenerTodas();
    
    public Page<Pregunta> obtenerTodasPaginas(String enunciado, String categoria, String tipo, Pageable pageable);

    Optional<Pregunta> obtenerPorId(String id);

    List<Pregunta> obtenerPorCategoria(String categoria);

    List<Pregunta> obtenerPorTipo(Pregunta.TipoPregunta tipo);

    Pregunta guardarPregunta(Pregunta pregunta);

    void eliminarPregunta(String id);
    
    public List<Pregunta> importarDesdeArchivo(MultipartFile archivo);
    
}
