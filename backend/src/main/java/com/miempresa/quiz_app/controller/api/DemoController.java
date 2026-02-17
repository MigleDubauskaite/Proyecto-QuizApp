package com.miempresa.quiz_app.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.miempresa.quiz_app.model.mysql.entity.demo.Notificacion;
import com.miempresa.quiz_app.model.mysql.entity.demo.NotificacionEmail;
import com.miempresa.quiz_app.repository.mysql.NotificacionRepository;

@RestController
@RequestMapping("/api/demo")
public class DemoController {
    @Autowired 
    private NotificacionRepository repo;

    @GetMapping
    public List<Notificacion> listar() { return repo.findAll(); }

    @PostMapping
    public Notificacion crear(@RequestBody NotificacionEmail n) { return repo.save(n); }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) { 
        // JPA borra en la tabla hija y luego en la padre
        repo.deleteById(id); 
    }
}