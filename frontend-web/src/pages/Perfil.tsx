import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/App.css';
import type { HistorialDTO } from '../types/types';

export default function Perfil() {
  const [historial, setHistorial] = useState<HistorialDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Datos del usuario desde localStorage
  const nombreUsuario = localStorage.getItem('nombre')?.toUpperCase() || 'Usuario';
  const inicial = nombreUsuario.charAt(0).toUpperCase();

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/juego/historial', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Ordenamos por fecha (más reciente primero) si el backend no lo hace
        const dataOrdenada = response.data.sort((a: any, b: any) => 
            new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        setHistorial(dataOrdenada);
      } catch (error) {
        console.error("Error al obtener el historial", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            localStorage.clear();
            navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const totalPuntos = historial.reduce((acc, curr) => acc + curr.puntos, 0);
  const promedio = historial.length > 0 ? (totalPuntos / historial.length).toFixed(1) : 0;

  return (
    <div className="main-wrapper animate-fadeIn">
      {/* TARJETA DE RESUMEN / DASHBOARD */}
      <section className="profile-header-card mb-5 position-relative">
        <button onClick={handleLogout} className="btn-logout-perfil" title="Cerrar Sesión">
          <span className="material-symbols-rounded" style={{fontSize: '1.1rem'}}>logout</span>
          Logout
        </button>

        <div className="d-flex align-items-center gap-3">
          <div className="profile-avatar-wrapper shadow-sm">
            <span className="fw-800 text-white">{inicial}</span>
          </div>
          <div>
            <h2 className="mb-0 fw-800 text-white" style={{fontSize: '1.8rem'}}>{nombreUsuario}</h2>
            <p className="text-sky mb-0 opacity-75 fw-600">Mi Perfil de Jugador</p>
          </div>
        </div>

        <div className="stats-grid mt-4">
          <div className="stat-item">
            <span className="stat-label">Partidas</span>
            <span className="stat-value">{historial.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Puntos</span>
            <span className="stat-value">{totalPuntos}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Promedio</span>
            <span className="stat-value">{promedio}</span>
          </div>
        </div>
      </section>

      {/* SECCIÓN HISTORIAL ESTILO TIMELINE */}
      <section className="history-section mt-4">
        <div className="d-flex align-items-center gap-2 mb-4 px-2">
          <span className="material-symbols-rounded text-sky">history</span>
          <h3 className="h6 fw-800 text-sky mb-0 text-uppercase" style={{ letterSpacing: '1px' }}>
            Recorrido de Partidas
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-sky" role="status"></div>
          </div>
        ) : historial.length > 0 ? (
          <div className="history-timeline">
            {historial.map((partida) => (
              <div key={partida.id} className="history-item">
                <div className="history-dot"></div>
                <div className="history-content shadow-sm">
                  <div className="history-info-main">
                    <h4 className="history-category">{partida.categoria}</h4>
                    <div className="history-meta">
                      <span>{partida.fecha}</span>
                      <span className="opacity-50">•</span>
                      <span>{partida.aciertos}/{partida.totalPreguntas} aciertos</span>
                    </div>
                  </div>

                  <div className="history-score-wrapper">
                    <span className="history-score-big">{partida.puntos}</span>
                    <span className="history-score-label">Puntos</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="history-empty-card">
            <span className="material-symbols-rounded mb-2" style={{fontSize: '2rem'}}>explore</span>
            <p className="mb-0">Aún no hay registros. ¡Empieza tu primera partida!</p>
          </div>
        )}
      </section>
    </div>
  );
}