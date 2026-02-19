package com.miempresa.quiz_app.controller.api;

import com.miempresa.quiz_app.dto.LoginRequest;
import com.miempresa.quiz_app.dto.LoginResponse;
import com.miempresa.quiz_app.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Autenticación", description = "Endpoints para login, registro y comprobación de usuarios")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @Operation(summary = "Iniciar sesión", description = "Autentica a un usuario y devuelve un token de sesión")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Login exitoso",
                content = @Content(schema = @Schema(implementation = LoginResponse.class))),
        @ApiResponse(responseCode = "401", description = "Credenciales incorrectas",
                content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = usuarioService.autenticar(request.nombre(), request.password());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @Operation(summary = "Registrar usuario", description = "Crea una nueva cuenta de usuario en el sistema")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Usuario registrado con éxito",
                content = @Content(schema = @Schema(implementation = String.class))),
        @ApiResponse(responseCode = "400", description = "El usuario ya existe o datos inválidos",
                content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody LoginRequest request) {
        try {
            usuarioService.registrar(request.nombre(), request.password());
            return ResponseEntity.ok("Usuario registrado con éxito. Ya puedes hacer login.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @Operation(summary = "Comprobar existencia de usuario", description = "Verifica si un nombre de usuario ya está registrado")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Comprobación realizada",
                content = @Content(schema = @Schema(implementation = Boolean.class)))
    })
    @GetMapping("/exists/{nombre}")
    public ResponseEntity<Boolean> comprobarExistencia(
            @Parameter(description = "Nombre del usuario a comprobar", example = "pepito123")
            @PathVariable String nombre) {
        return ResponseEntity.ok(usuarioService.existePorNombre(nombre));
    }
}