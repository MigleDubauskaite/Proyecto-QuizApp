package com.miempresa.quiz_app.model.mysql.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.miempresa.quiz_app.model.mongo.document.Pregunta;

@Entity
@Table(name = "partidas")
public class Partida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    private int totalPreguntas;
    private int aciertos;
    private int puntos;     

    @ElementCollection
    @CollectionTable(name = "partida_categorias", joinColumns = @JoinColumn(name = "partida_id"))
    @Column(name = "categoria")
    private List<String> categorias = new ArrayList<>();
    
    @ElementCollection
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "partida_tipos", joinColumns = @JoinColumn(name = "partida_id"))
    @Column(name = "tipo")
    private List<Pregunta.TipoPregunta> tipos = new ArrayList<>();

    @ElementCollection  // IDs de preguntas de MongoDB
    @CollectionTable(name = "partida_preguntas", joinColumns = @JoinColumn(name = "partida_id"))
    @Column(name = "pregunta_id")
    private List<String> preguntaIds;
    
    @Column(name = "preguntas_respondidas")
    private int preguntasRespondidas = 0; 

    private LocalDateTime fecha;

    public Partida() {
        this.fecha = LocalDateTime.now();
        this.puntos = 0;
        this.aciertos = 0;
    }

    public int getPreguntasRespondidas() {
    	return preguntasRespondidas;
    }
    
    public void setPreguntasRespondidas(int preguntasRespondidas) {
    	this.preguntasRespondidas = preguntasRespondidas;
    }
    public Long getId() { return id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public int getTotalPreguntas() { return totalPreguntas; }
    public void setTotalPreguntas(int totalPreguntas) { this.totalPreguntas = totalPreguntas; }

    public int getAciertos() { return aciertos; }
    public void setAciertos(int aciertos) { this.aciertos = aciertos; }

    public List<String> getCategorias() { return categorias; }
    public void setCategorias(List<String> categorias) { this.categorias = categorias; }

    public List<Pregunta.TipoPregunta> getTipos() { return tipos; }
    public void setTipos(List<Pregunta.TipoPregunta> tipos) { this.tipos = tipos; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }

    public int getPuntos() { return puntos; }
    public void setPuntos(int puntos) { this.puntos = puntos; }

    public List<String> getPreguntaIds() { return preguntaIds; }
    public void setPreguntaIds(List<String> preguntaIds) { this.preguntaIds = preguntaIds; }
}