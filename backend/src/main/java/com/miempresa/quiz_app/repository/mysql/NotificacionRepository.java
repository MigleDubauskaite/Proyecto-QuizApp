package com.miempresa.quiz_app.repository.mysql;

import org.springframework.data.jpa.repository.JpaRepository;

import com.miempresa.quiz_app.model.mysql.entity.demo.Notificacion;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
	
} 
