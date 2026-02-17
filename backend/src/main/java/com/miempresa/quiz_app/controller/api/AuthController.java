package com.miempresa.quiz_app.controller.api;

import com.miempresa.quiz_app.dto.LoginRequest;
import com.miempresa.quiz_app.dto.LoginResponse;
import com.miempresa.quiz_app.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Llamamos al nuevo método que crearemos en el servicio
            LoginResponse response = usuarioService.autenticar(request.nombre(), request.password());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody LoginRequest request) {
        try {
            usuarioService.registrar(request.nombre(), request.password());
            return ResponseEntity.ok("Usuario registrado con éxito. Ya puedes hacer login.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
    
    @GetMapping("/exists/{nombre}")
    public ResponseEntity<Boolean> comprobarExistencia(@PathVariable String nombre) {
        return ResponseEntity.ok(usuarioService.existePorNombre(nombre));
    }
}