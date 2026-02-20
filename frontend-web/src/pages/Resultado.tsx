import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { PartidaResponse, RespuestaResultadoDTO, JuegoRequest } from '../types/types';
import '../css/Resultado.css';

export default function Resultados() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
  
  // Determinar clase del mensaje según el porcentaje
  const messageClass = porcentaje >= 80 ? 'excellent' : porcentaje >= 50 ? 'good' : 'practice';
  const messageText = porcentaje >= 80 
    ? "¡Increíble! Eres un experto " 
    : porcentaje >= 50 
    ? "¡Buen trabajo! Sigue así " 
    : "¡Sigue practicando para mejorar!";

  // Función para iniciar una nueva partida con la misma configuración
  const handleJugarOtraVez = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Recuperar configuración guardada o usar valores por defecto
      const configGuardada = localStorage.getItem('ultimaConfiguracion');
      let juegoData: JuegoRequest;

      if (configGuardada) {
        const config = JSON.parse(configGuardada);
        juegoData = {
          nombre: partida.nombreJugador,
          categorias: config.categorias || null,
          tipos: config.tipos || null,
          cantidad: config.cantidad || 10,
        };
      } else {
        // Si no hay configuración guardada, usar valores por defecto
        juegoData = {
          nombre: partida.nombreJugador,
          categorias: null,
          tipos: null,
          cantidad: 10,
        };
      }

      const gameRes = await axios.post<PartidaResponse>(
        'http://localhost:8080/api/juego/iniciar',
        juegoData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate('/juego', { state: { partida: gameRes.data } });
    } catch (err: any) {
      console.error('Error al iniciar nueva partida:', err);
      alert('Error al iniciar una nueva partida. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resultados-container">
      <div className="resultados-wrapper">
        
        <header className="resultados-header">
          <div className="resultados-logo">¡Partida Terminada!</div>
          <h1 className="resultados-title">Resumen de {partida.nombreJugador}</h1>
          <p className="resultados-subtitle">Tu rendimiento en esta partida</p>
        </header>

        <div className="resultados-card">
          
          {/* Puntuación destacada */}
          <div className="resultados-score">
            <div className="score-display">{resultado.puntosTotales}</div>
            <div className="score-label">Puntos Totales</div>
          </div>

          {/* Barra de progreso visual */}
          <div className="progress-bar-container">
            <div className="progress-bar-wrapper">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${porcentaje}%` }}
              ></div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="resultados-stats">
            <div className="stat-box">
              <div className="stat-value">{resultado.aciertosActuales} / {resultado.totalPreguntas}</div>
              <div className="stat-label">Aciertos</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{porcentaje}%</div>
              <div className="stat-label">Precisión</div>
            </div>
          </div>

          {/* Mensaje motivacional */}
          <div className={`resultados-message ${messageClass}`}>
            <p className="resultados-message-text">{messageText}</p>
          </div>

          {/* Botones de acción */}
          <div className="resultados-actions">
            <button 
              onClick={handleJugarOtraVez}
              disabled={loading}
              className="btn-resultados-primary"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Iniciando...
                </>
              ) : (
                'Jugar Otra Vez'
              )}
            </button>

            <button 
              onClick={() => window.location.href = 'http://localhost:8080/home'} 
              className="btn-resultados-secondary"
            >
              Volver a Configuración
            </button>

            <button 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('nombre');
                localStorage.removeItem('rol');
                navigate('/login');
              }} 
              className="btn-resultados-secondary"
            >
              Cerrar sesión e ir al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}