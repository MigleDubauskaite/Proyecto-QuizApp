package com.miempresa.quiz_app.model.mysql.entity.demo;

import jakarta.persistence.Entity;

@Entity
public class NotificacionEmail extends Notificacion {
    private String email;

    public NotificacionEmail() {}

    // Los de 'id' y 'titulo' ya los hereda del padre
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}