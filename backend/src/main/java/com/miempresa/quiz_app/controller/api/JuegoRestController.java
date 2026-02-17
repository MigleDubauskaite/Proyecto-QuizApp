package com.miempresa.quiz_app.controller.api;

import com.miempresa.quiz_app.dto.*;
import com.miempresa.quiz_app.model.mysql.entity.Usuario;
import com.miempresa.quiz_app.service.JuegoService;
import com.miempresa.quiz_app.service.UsuarioService;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/juego")
@CrossOrigin(origins = "http://localhost:5173")
public class JuegoRestController {

    private final JuegoService juegoService;
    private final UsuarioService usuarioService;

    public JuegoRestController(JuegoService juegoService, UsuarioService usuarioService) {
        this.juegoService = juegoService;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/iniciar")
    public ResponseEntity<?> iniciarPartida(@RequestBody JuegoRequest request) {
        try {
        	System.out.println("DEBUG: JSON recibido - Cantidad: " + request.cantidad());
            System.out.println("DEBUG: JSON recibido - Categorías: " + request.categorias());
            // 1. SACAR AL USUARIO DEL CONTEXTO DE SEGURIDAD
            // Gracias al JwtFilter, el usuario ya está autenticado aquí.
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            
            // 2. BUSCAR AL USUARIO EN LA DB (Solo por nombre, ya no pedimos password)
            Usuario jugador = usuarioService.buscarPorNombre(username); 

            // 3. INICIAR LA PARTIDA
            PartidaResponse partida = juegoService.iniciarPartida(
                jugador, 
                request.categorias(),
                request.tipos(),
                request.cantidad()
            );

            return ResponseEntity.ok(partida);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error al iniciar partida: " + e.getMessage());
        }
    }

    @GetMapping("/partida/{id}")
    public ResponseEntity<?> obtenerPartida(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(juegoService.obtenerPartidaConPreguntas(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Partida no encontrada.");
        }
    }

    @PostMapping("/answer")
    public ResponseEntity<?> responder(@RequestBody RespuestaRequest request) {
        try {
            return ResponseEntity.ok(juegoService.registrarRespuesta(
                request.partidaId(), request.preguntaId(), request.respuestasUsuario()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al procesar la respuesta.");
        }
    }
    
 // --- NUEVO ENDPOINT PARA EL HISTORIAL ---
    @GetMapping("/historial")
    public ResponseEntity<List<HistorialDTO>> obtenerHistorial() {
        try {
            // 1. Obtenemos el nombre del usuario desde el Token (SecurityContext)
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            
            // 2. Buscamos al usuario en la base de datos
            Usuario jugador = usuarioService.buscarPorNombre(username); 

            // 3. Llamamos al servicio para obtener los datos optimizados
            List<HistorialDTO> historial = juegoService.obtenerHistorialPorJugador(jugador.getId());

            return ResponseEntity.ok(historial);
        } catch (Exception e) {
            // Es buena práctica registrar el error o enviar un mensaje para depurar
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    
}