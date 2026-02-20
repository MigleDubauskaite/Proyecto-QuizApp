import { useLocation } from "react-router-dom";

export function Header() {
  const backendBase = "http://localhost:8080";
  const frontendBase = "http://localhost:5173";
  const location = useLocation();

  // Comprobamos si la ruta actual es /login
  const esLogin = location.pathname === "/login";

  return (
    <header className="bg-dark-quiz mb-5 shadow-sm">
      <div className="header-container px-3">
        {/* Lado izquierdo: Logo */}
        <a href={backendBase + "/home"} className="navbar-brand">
          Quiz App
        </a>

        {/* Lado derecho: Links */}
        <nav className="d-flex align-items-center">
          <a href={backendBase + "/home"} className="nav-link-custom">
            Inicio
          </a>
          
          <a href={backendBase + "/categorias"} className="nav-link-custom">
            Categorías
          </a>
          
          <a href={backendBase + "/acerca"} className="nav-link-custom">
            Acerca de
          </a>
          
          {/* RENDERIZADO CONDICIONAL: 
             Solo mostramos "Mi Perfil" si NO estamos en la página de login 
          */}
          {!esLogin && (
            <a 
              href={frontendBase + "/perfil"} 
              className="nav-link-custom profile-link d-flex align-items-center"
            >
              Mi Perfil
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}