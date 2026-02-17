package com.miempresa.quiz_app.controller.web;

import com.miempresa.quiz_app.dto.OpcionesQuizDTO;
import com.miempresa.quiz_app.service.JuegoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

	@Autowired
	private JuegoService juegoService;

	@GetMapping({ "/", "/home" })
	public String mostrarHome(Model model) {
		OpcionesQuizDTO opciones = juegoService.obtenerOpcionesDisponibles();
		model.addAttribute("mensaje", "Prepárate para el Reto");
		model.addAttribute("categorias", opciones.categorias());
		model.addAttribute("tipos", opciones.tipos());
		model.addAttribute("opcionesCantidad", opciones.opcionesCantidad());
		return "pregunta-home/home";
	}

	@GetMapping("/categorias")
	public String categorias(Model model) {
		OpcionesQuizDTO opciones = juegoService.obtenerOpcionesDisponibles();
		model.addAttribute("categorias", opciones.categorias());
		return "pages/categorias";
	}

	@GetMapping("/acerca")
	public String acerca() {
		return "pages/acerca";
	}

	@GetMapping("/error500-test")
	public String provocarError() {
		throw new RuntimeException("Error de prueba 500");
	}
}