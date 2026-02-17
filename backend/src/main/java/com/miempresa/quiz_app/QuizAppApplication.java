package com.miempresa.quiz_app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode;

@SpringBootApplication
//Spring gestiona bien la serialización de páginas
@EnableSpringDataWebSupport(pageSerializationMode = PageSerializationMode.VIA_DTO)
public class QuizAppApplication {
	
	public static void main(String[] args) {
		SpringApplication.run(QuizAppApplication.class, args);
	}

}
