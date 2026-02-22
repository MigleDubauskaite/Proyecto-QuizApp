package com.miempresa.quiz_app.config.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

//Spring podrá inyectarlo automáticamente en tu SecurityConfig
@Component
//OncePerRequestFilter Es una clase de Spring que garantiza que este filtro se ejecute 
//exactamente una vez por cada 
//petición HTTP que reciba el servidor.
public class JwtFilter extends OncePerRequestFilter {

	// Es la llave para "abrir" los tokens
	@Value("${jwt.secret}")
	private String secretKey; // Mejor en application.properties

	// Se ejecuta cada vez que React hace un fetch o axios a tu backend
	@Override
	protected void doFilterInternal(HttpServletRequest request, // objeto que contiene toda la informacion que viene de
																// React
			HttpServletResponse response, // Es lo que el servidor le devolverá a React.
			FilterChain filterChain) throws ServletException, IOException {

		String header = request.getHeader("Authorization");

		if (header != null && header.startsWith("Bearer ")) {

			String token = header.substring(7);

			try {
				Claims claims = Jwts.parser().setSigningKey(secretKey)// 1. Usas la LLAVE para abrir el sobre
						.parseClaimsJws(token) // 2. Verificas que el sello sea auténtico
						.getBody(); //// 3. Sacas el CONTENIDO (los Claims)

				String username = claims.getSubject();

				String rol = (String) claims.get("rol"); 

				if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
				    // Si por algún motivo el rol es nulo, le asignamos ROLE_USER por defecto para que no explote
				    String finalRol = (rol != null) ? rol : "ROLE_USER";

				    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
				            username, null, List.of(new SimpleGrantedAuthority(finalRol)));

				    SecurityContextHolder.getContext().setAuthentication(authentication);
				}

			} catch (Exception e) {
				SecurityContextHolder.clearContext();
			}
		}

		filterChain.doFilter(request, response);
	}
}