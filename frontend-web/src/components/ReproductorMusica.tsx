import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../App.css';

export default function ReproductorMusica() {
  const [cancion, setCancion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const traerMusicaAleatoria = async () => {
    try {
      // 1. Forzamos una configuración sin Authorization para evitar el 403
      const response = await axios.get('http://localhost:8080/api/movil/musica/buscar', {
        headers: {
          'Authorization': '', // Sobrescribe cualquier token global
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Datos recibidos:", response.data);
      setCancion(response.data);
    } catch (error: any) {
      console.error("Error al obtener música:", error.response?.status, error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    traerMusicaAleatoria();
  }, []);

  const siguienteCancion = () => {
    // No ponemos loading(true) aquí para que el reproductor no desaparezca bruscamente
    traerMusicaAleatoria();
  };

  // 2. Si está cargando y no hay canción, mostramos el estado inicial
  if (loading && !cancion) {
    return (
      <div className="music-player-fixed text-white p-3">
        <div className="spinner-border spinner-border-sm text-sky me-2"></div>
        Buscando música tranquila...
      </div>
    );
  }

  // 3. Si no hay canción después de cargar (error de API), no mostramos nada
  if (!cancion || !cancion.urlAudio) return null;

  return (
    <div className="music-player-fixed animate-fadeIn">
      <div className="history-card p-3 shadow-lg" style={{ width: '350px', border: '1px solid rgba(0,212,255,0.1)' }}>
        <div className="d-flex align-items-center gap-3">
          
          <div className="category-icon-mini" style={{ width: '60px', height: '60px' }}>
            <img 
              src={cancion.urlImagen || 'https://via.placeholder.com/60'} 
              alt="Cover" 
              className="rounded-3 w-100 h-100" 
              style={{ objectFit: 'cover' }} 
            />
          </div>

          <div className="flex-grow-1 overflow-hidden">
            <h4 className="fw-bold text-white mb-0 text-truncate" style={{ fontSize: '0.85rem' }}>
              {cancion.titulo}
            </h4>
            <p className="text-sky mb-2 opacity-75 text-truncate" style={{ fontSize: '0.75rem' }}>
              {cancion.artista}
            </p>
            
            <audio 
              ref={audioRef}
              src={cancion.urlAudio} 
              autoPlay 
              onEnded={siguienteCancion}
              className="w-100"
              style={{ height: '25px' }}
              controls
            />
          </div>

          <button 
            onClick={siguienteCancion} 
            className="btn btn-link text-sky p-0 opacity-75 hover-opacity-100"
            title="Siguiente canción tranquila"
          >
            <span className="material-symbols-rounded" style={{ fontSize: '2rem' }}>skip_next</span>
          </button>
        </div>
      </div>
    </div>
  );
}