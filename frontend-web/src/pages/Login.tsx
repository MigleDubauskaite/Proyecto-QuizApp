import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "../Login.css";
import type {
  JuegoRequest,
  PartidaResponse,
  LoginRequest,
  LoginResponse,
} from "../types/types";

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // --- NUEVO ESTADO PARA DETECCIÓN DE USUARIO ---
  const [existeUsuario, setExisteUsuario] = useState<boolean>(false);

  const categorias = searchParams.get("categorias")?.split(",").filter(Boolean) || [];
  const cantidad = parseInt(searchParams.get("cantidad") || "10");

  // --- EFECTO DE COMPROBACIÓN AUTOMÁTICA ---
  useEffect(() => {
    const verificarExistencia = async () => {
      const nombreLimpio = nombre.trim();
      
      if (nombreLimpio.length < 3 || nombreLimpio.toLowerCase() === 'admin') {
        setExisteUsuario(false);
        return;
      }

      try {
        const res = await axios.get<boolean>(`http://localhost:8080/api/auth/exists/${nombreLimpio}`);
        setExisteUsuario(res.data); 
      } catch (err) {
        setExisteUsuario(false);
      }
    };

    const timeoutId = setTimeout(verificarExistencia, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [nombre]);

  const handleRegister = async () => {
    if (!nombre.trim() || !password.trim()) {
      setError("Completa los campos para registrarte");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:8080/api/auth/register", {
        nombre: nombre.trim(),
        password: password,
      });
      setSuccess('¡Registro completado! Ahora pulsa "ENTRAR"');
      setExisteUsuario(true); // Ocultamos el botón de registro tras éxito
    } catch (err: any) {
      setError(err.response?.data || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const loginData: LoginRequest = { nombre: nombre.trim(), password };
      const authRes = await axios.post<LoginResponse>(
        "http://localhost:8080/api/auth/login",
        loginData,
      );

      const { token, rol } = authRes.data;
      localStorage.setItem("token", token);
      localStorage.setItem("rol", rol);

      if (rol === "ROLE_ADMIN") {
        navigate("/admin/dashboard");
        return;
      }

      const juegoData: JuegoRequest = {
        nombre: nombre.trim(),
        categorias: categorias.length > 0 ? categorias : null,
        tipos: null,
        cantidad,
      };

      const gameRes = await axios.post<PartidaResponse>(
        "http://localhost:8080/api/juego/iniciar",
        juegoData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      navigate("/juego", { state: { partida: gameRes.data } });
    } catch (err: any) {
      setError(err.response?.data || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg d-flex align-items-center justify-content-center p-3">
      <div className="main-wrapper" style={{ maxWidth: "450px", width: "100%" }}>
        <header className="text-center mb-4">
          <div className="login-logo mb-2">Quiz App</div>
          <h1 className="h3 fw-bold text-white">Identificación</h1>
        </header>

        <form onSubmit={handleSubmit} className="login-card p-4 shadow">
          <div className="mb-3 text-start">
            <label className="text-sky small fw-bold mb-1">USUARIO</label>
            <input
              type="text"
              className="form-control input-premium"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              disabled={loading}
            />
          </div>

          <div className="mb-3 text-start">
            <label className="text-sky small fw-bold mb-1">CONTRASEÑA</label>
            <input
              type="password"
              className="form-control input-premium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
            />
          </div>

          {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}
          {success && <div className="alert alert-success py-2 small mb-3">{success}</div>}

          <div className="login-actions">
            {/* BOTÓN PRINCIPAL: Dinámico según existencia */}
            <button type="submit" disabled={loading} className="btn-primary-custom w-100">
              {loading ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : nombre.trim().toLowerCase() === "admin" ? (
                "ACCEDER AL PANEL 🛠️"
              ) : existeUsuario ? (
                "ENTRAR A JUGAR 🚀"
              ) : (
                "IDENTIFICARSE"
              )}
            </button>

            {/* BOTÓN SECUNDARIO: Solo si no es admin y el usuario NO existe */}
            {nombre.trim().toLowerCase() !== "admin" && !existeUsuario && nombre.trim().length >= 3 && (
              <button
                type="button"
                onClick={handleRegister}
                disabled={loading}
                className="btn-secondary-custom w-100"
              >
                CREAR CUENTA NUEVA ✨
              </button>
            )}

            {/* BOTÓN VOLVER */}
            <button
              type="button"
              onClick={() => (window.location.href = "http://localhost:8080/home")}
              className="btn-ghost-custom"
            >
              <span
                className="material-symbols-rounded align-middle me-1"
                style={{ fontSize: "18px" }}
              >
                arrow_back
              </span>
              Volver a configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}