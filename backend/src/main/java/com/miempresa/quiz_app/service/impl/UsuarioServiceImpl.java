package com.miempresa.quiz_app.service.impl;

import com.miempresa.quiz_app.dto.LoginResponse;
import com.miempresa.quiz_app.model.mysql.entity.Usuario;
import com.miempresa.quiz_app.repository.mysql.UsuarioRepository;
import com.miempresa.quiz_app.service.UsuarioService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    @Value("${jwt.secret}")
    private String secretKey;

    public UsuarioServiceImpl(UsuarioRepository jugadorRepo, BCryptPasswordEncoder passwordEncoder) {
        this.usuarioRepo = jugadorRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public LoginResponse autenticar(String nombre, String password) {
        Usuario usuario = usuarioRepo.findByNombre(nombre)
                .orElseThrow(() -> new IllegalArgumentException("El usuario no existe."));

        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            throw new IllegalArgumentException("Contraseña incorrecta.");
        }
        
        // Prefijo vital para Spring Security y React
     // Concatenamos "ROLE_" para que sea compatible con .hasRole() y tu JwtFilter
        String rolConPrefijo = "ROLE_" + usuario.getRol().name(); 

        String token = Jwts.builder()
                .setSubject(usuario.getNombre())
                .claim("rol", rolConPrefijo) 
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 3600000))//expira en 1 hora
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();

        return new LoginResponse(token, usuario.getNombre(), rolConPrefijo);
    }

    @Override
    @Transactional
    public Usuario registrar(String nombre, String password) {
        if (usuarioRepo.findByNombre(nombre).isPresent()) {
            throw new IllegalArgumentException("El nombre de usuario ya existe.");
        }
        
        validarFormato(nombre, password);
        Usuario nuevo = new Usuario();
        nuevo.setNombre(nombre);
        nuevo.setPassword(passwordEncoder.encode(password));
        nuevo.setRol(Usuario.Rol.USER); // Asignación por defecto

        return usuarioRepo.save(nuevo);
    }

    @Override
    public Usuario buscarPorNombre(String nombre) {
        return usuarioRepo.findByNombre(nombre)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));
    }

    @Override
    public Usuario login(String nombre, String password) {
        Usuario jugador = buscarPorNombre(nombre);
        if (!passwordEncoder.matches(password, jugador.getPassword())) {
            throw new IllegalArgumentException("Contraseña incorrecta.");
        }
        return jugador;
    }

    private void validarFormato(String nombre, String password) {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre no puede estar vacío.");
        }
        if (nombre.length() < 3) {
            throw new IllegalArgumentException("El nombre debe tener al menos 3 caracteres.");
        }
        if (password == null || password.length() < 6) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres.");
        }
    }
    
    @Override
    public boolean existePorNombre(String nombre) {
        // Esto asume que tienes un UsuarioRepository inyectado
        return usuarioRepo.existsByNombre(nombre);
    }
}