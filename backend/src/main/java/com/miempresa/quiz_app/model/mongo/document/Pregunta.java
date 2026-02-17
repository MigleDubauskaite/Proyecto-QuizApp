package com.miempresa.quiz_app.model.mongo.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "preguntas")
public class Pregunta {

    @Id
    private String id;
    private String enunciado;
    private TipoPregunta tipo;
    private String categoria;
    private List<String> opciones;
    private List<String> respuestas;
    private List<String> respuestasCorrectas;
    
    public enum TipoPregunta {
        VF, UNICA, MULTIPLE
    }
    
    public Pregunta() {
	}
	// Getters y Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEnunciado() { return enunciado; }
    public void setEnunciado(String enunciado) { this.enunciado = enunciado; }
    public TipoPregunta getTipo() { return tipo; }
    public void setTipo(TipoPregunta tipo) { this.tipo = tipo; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public List<String> getOpciones() { return opciones; }
    public void setOpciones(List<String> opciones) { this.opciones = opciones; }
    public List<String> getRespuestas() { return respuestas; }
    public void setRespuestas(List<String> respuestas) { this.respuestas = respuestas; }
    public List<String> getRespuestasCorrectas() { return respuestasCorrectas; }
    public void setRespuestasCorrectas(List<String> respuestasCorrectas) { this.respuestasCorrectas = respuestasCorrectas; }
}
