import { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import type { HistorialDTO } from '../types/types';

export default function Perfil() {
  const [historial, setHistorial] = useState<HistorialDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/juego/historial', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistorial(response.data);
      } catch (error) {
        console.error("Error al obtener el historial", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  const totalPuntos = historial.reduce((acc, curr) => acc + curr.puntos, 0);
  const promedio = historial.length > 0 ? (totalPuntos / historial.length).toFixed(1) : 0;

  return (
    <div className="main-wrapper animate-fadeIn">
      {/* TARJETA DE RESUMEN DE ESTADÍSTICAS */}
      <section className="profile-header-card mb-5">
        <div className="d-flex align-items-center gap-3">
          <div className="profile-avatar-wrapper">
            <span className="material-symbols-rounded" style={{ fontSize: '3rem' }}>account_circle</span>
          </div>
          <div>
            <h2 className="mb-0 fw-800 text-white">Mi Perfil</h2>
            <p className="text-sky mb-0 opacity-75">Tu rendimiento global</p>
          </div>
        </div>

        <div className="stats-grid mt-4">
          <div className="stat-item">
            <span className="stat-label">Partidas</span>
            <span className="stat-value">{historial.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Puntos Totales</span>
            <span className="stat-value">{totalPuntos}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Promedio (100)</span>
            <span className="stat-value">{promedio}</span>
          </div>
        </div>
      </section>

      {/* SECCIÓN DEL HISTORIAL */}
      <section className="history-section">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <h3 className="h6 fw-bold text-sky mb-0 text-uppercase opacity-75" style={{ letterSpacing: '2px' }}>
            Partidas Recientes
          </h3>
          <span className="text-white-50" style={{ fontSize: '0.8rem' }}>
            Mostrando {historial.length} resultados
          </span>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-sky" role="status"></div>
            <p className="text-sky mt-3">Cargando historial...</p>
          </div>
        ) : historial.length > 0 ? (
          // Contenedor con un gap definido para separar las tarjetas
          <div className="history-list d-flex flex-column gap-3">
            {historial.map((partida) => (
              <div key={partida.id} className="history-card p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    {/* Icono de categoría con fondo suave */}
                    <div className="category-icon-mini me-3">
                      <span className="material-symbols-rounded text-sky">
                        {partida.puntos >= 70 ? 'military_tech' : 'psychology'}
                      </span>
                    </div>
                    
                    <div>
                      <div className="fw-bold text-white mb-1" style={{ fontSize: '1.05rem' }}>
                        {partida.categoria}
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <small className="text-sky opacity-75 fw-500">
                          {partida.fecha}
                        </small>
                        <span className="text-white-50">•</span>
                        <small className="text-white-50">
                           {partida.aciertos} / {partida.totalPreguntas} aciertos
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="text-end">
                    <div className="badge-points-wrapper">
                      <span className="badge-points px-3 py-2">{partida.puntos} pts</span>
                    </div>
                    {/* Barra de progreso miniatura opcional para visual */}
                    <div className="mt-2 bg-dark rounded-pill overflow-hidden" style={{ height: '4px', width: '80px', marginLeft: 'auto' }}>
                       <div 
                         className="h-100 bg-sky" 
                         style={{ width: `${partida.puntos}%`, opacity: 0.8 }}
                       ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="history-card text-center py-5 opacity-50 border-dashed">
            <span className="material-symbols-rounded d-block mb-2" style={{ fontSize: '2rem' }}>history</span>
            No hay registros. ¡Es hora de empezar tu primera partida!
          </div>
        )}
      </section>
    </div>
  );
}