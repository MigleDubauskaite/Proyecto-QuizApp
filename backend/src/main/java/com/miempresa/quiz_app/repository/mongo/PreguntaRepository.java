package com.miempresa.quiz_app.repository.mongo;

import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.miempresa.quiz_app.model.mongo.document.Pregunta;

import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface PreguntaRepository extends MongoRepository<Pregunta, String> {
	
	// Este método buscará por los tres filtros a la vez con paginación
	// Spring Data se encarga de la paginación automáticamente si pasas Pageable
    Page<Pregunta> findByEnunciadoContainingIgnoreCaseAndCategoriaContainingAndTipoContaining(
            String enunciado, 
            String categoria, 
            String tipo, 
            Pageable pageable
    );

    List<Pregunta> findByCategoria(String categoria);
    List<Pregunta> findByTipo(Pregunta.TipoPregunta tipo);
    
    @Query(value = "{}", fields = "{ 'categoria' : 1 }")
    List<Pregunta> findCategorias();
    
}