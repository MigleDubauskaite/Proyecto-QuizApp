package com.miempresa.quiz_app.controller.api;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.miempresa.quiz_app.model.mysql.entity.demo.Notificacion;
import com.miempresa.quiz_app.model.mysql.entity.demo.NotificacionEmail;
import com.miempresa.quiz_app.repository.mysql.NotificacionRepository;

@RestController
@RequestMapping("/api/demo")
@Tag(name = "Vistas Web", description = "Endpoints que devuelven páginas HTML (Thymeleaf).")
public class DemoController {

    @Autowired
    private NotificacionRepository repo;

    @Operation(summary = "Listar notificaciones", description = "Devuelve todas las notificaciones almacenadas")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista obtenida con éxito",
                content = @Content(schema = @Schema(implementation = Notificacion.class)))
    })
    @GetMapping
    public List<Notificacion> listar() {
        return repo.findAll();
    }

    @Operation(summary = "Crear notificación", description = "Crea y almacena una nueva notificación de tipo email")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Notificación creada con éxito",
                content = @Content(schema = @Schema(implementation = Notificacion.class)))
    })
    @PostMapping
    public Notificacion crear(@RequestBody NotificacionEmail n) {
        return repo.save(n);
    }

    @Operation(summary = "Eliminar notificación", description = "Elimina una notificación por su ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Notificación eliminada con éxito"),
        @ApiResponse(responseCode = "404", description = "Notificación no encontrada")
    })
    @DeleteMapping("/{id}")
    public void eliminar(
            @Parameter(description = "ID de la notificación a eliminar", example = "1")
            @PathVariable Long id) {
        repo.deleteById(id);
    }
}