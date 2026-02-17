package com.miempresa.quiz_app.controller.api;

import com.miempresa.quiz_app.model.mongo.document.Pregunta;
import com.miempresa.quiz_app.service.PreguntaService;
import com.miempresa.quiz_app.service.impl.PreguntaServiceImpl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/preguntas")
public class PreguntaController {

    private final PreguntaService preguntaService;

    public PreguntaController(PreguntaServiceImpl service) {
        this.preguntaService = service;
    }
    
    /*
     * MultipartFile es el objeto estándar para manejar archivos físicos que vienen desde el exterior.
     */
    @PostMapping("/importar")
    public List<Pregunta> importarPreguntas(@RequestParam("archivo") MultipartFile archivo) {
        return preguntaService.importarDesdeArchivo(archivo);
    }
    
    @GetMapping("/paginado")
    public Page<Pregunta> obtenerPaginadas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String enunciado,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String tipo) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        
        return preguntaService.obtenerTodasPaginas(enunciado, categoria, tipo, pageable);
    }
    
    // Obtener todas las preguntas
    @GetMapping
    public List<Pregunta> obtenerTodas() {
        return preguntaService.obtenerTodas();
    }

    // Obtener pregunta por ID
    @GetMapping("/{id}")
    public Optional<Pregunta> obtenerPorId(@PathVariable String id) {
        return preguntaService.obtenerPorId(id);
    }

    // Obtener preguntas por categoría
    @GetMapping("/categoria/{categoria}")
    public List<Pregunta> obtenerPorCategoria(@PathVariable String categoria) {
        return preguntaService.obtenerPorCategoria(categoria);
    }

    // Obtener preguntas por tipo
    @GetMapping("/tipo/{tipo}")
    public List<Pregunta> obtenerPorTipo(@PathVariable Pregunta.TipoPregunta tipo) {
        return preguntaService.obtenerPorTipo(tipo);
    }

    // Guardar una nueva pregunta
    @PostMapping
    public Pregunta guardarPregunta(@RequestBody Pregunta pregunta) {
        return preguntaService.guardarPregunta(pregunta);
    }
    
    @PutMapping("/{id}")
    public Pregunta actualizarPregunta(@PathVariable String id, @RequestBody Pregunta pregunta) {
        pregunta.setId(id);
        return preguntaService.guardarPregunta(pregunta);
    }

    // Eliminar una pregunta por ID
    @DeleteMapping("/{id}")
    public void eliminarPregunta(@PathVariable String id) {
        preguntaService.eliminarPregunta(id);
    }
}
