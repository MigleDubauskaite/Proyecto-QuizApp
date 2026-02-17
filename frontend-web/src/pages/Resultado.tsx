import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import type { PartidaResponse, RespuestaResultadoDTO } from '../types/types';
import '../Login.css'; // Reutilizamos los estilos base

export default function Resultados() {
  const location = useLocation();
  const navigate = useNavigate();

  // Recuperamos los datos que enviamos desde Juego.tsx
  const resultado = location.state?.resultado as RespuestaResultadoDTO;
  const partida = location.state?.partida as PartidaResponse;

  useEffect(() => {
    // Si no hay datos (porque refrescó la página o entró directo), lo mandamos al inicio
    if (!resultado || !partida) {
      navigate('/login');
    }
  }, [resultado, partida, navigate]);

  if (!resultado || !partida) return null;

  // Calculamos el porcentaje de éxito
  const porcentaje = Math.round((resultado.aciertosActuales / resultado.totalPreguntas) * 100);

  return (
    <div className="login-bg d-flex align-items-center justify-content-center p-3">
      <div className="main-wrapper" style={{ maxWidth: '500px', width: '100%' }}>
        
        <header className="text-center mb-4">
          <div className="login-logo mb-2">¡Partida Terminada!</div>
          <h1 className="h3 fw-bold text-white">Resumen de {partida.nombreJugador}</h1>
        </header>

        <div className="login-card p-4 shadow text-center text-white">
          
          <div className="mb-4">
            <div className="display-1 fw-bold text-sky mb-0">
              {resultado.puntosTotales}
            </div>
            <p className="text-uppercase tracking-widest opacity-75">Puntos Totales ✨</p>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-6">
              <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h5 className="mb-0">{resultado.aciertosActuales} / {resultado.totalPreguntas}</h5>
                <small className="opacity-50 text-uppercase">Aciertos</small>
              </div>
            </div>
            <div className="col-6">
              <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h5 className="mb-0">{porcentaje}%</h5>
                <small className="opacity-50 text-uppercase">Precisión</small>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="small opacity-75">
              {porcentaje >= 80 ? "¡Increíble! Eres un experto 🏆" : 
               porcentaje >= 50 ? "¡Buen trabajo! Sigue así 🚀" : 
               "¡Sigue practicando para mejorar! 🧠"}
            </p>
          </div>

          <button 
            onClick={() => window.location.href = 'http://localhost:8080/home'} 
            className="btn-launch-login w-100 mb-3"
          >
            VOLVER A CONFIGURACIÓN
          </button>

          <button 
            onClick={() => navigate('/login')} 
            className="btn btn-link text-sky text-decoration-none small opacity-75"
          >
            Cerrar sesión e ir al inicio
          </button>
        </div>
      </div>
    </div>
  );
}