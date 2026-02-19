import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function ReproductorMusica() {
  const [cancion, setCancion] = useState<any>(null);
  const [estaSilenciado, setEstaSilenciado] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const traerMusicaTranquila = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/movil/musica/buscar', {
        headers: { 'Authorization': '' }
      });
      setCancion(response.data);
    } catch (error) {
      console.error("Error al obtener música:", error);
    }
  };

  useEffect(() => {
    traerMusicaTranquila();
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setEstaSilenciado(audioRef.current.muted);
    }
  };

  if (!cancion) return null;

  return (
    <div className="posicion-altavoz-fijo" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      {/* El audio está oculto, solo queremos su funcionalidad */}
      <audio 
        ref={audioRef}
        src={cancion.urlAudio} 
        autoPlay 
        loop // Para que la música tranquila no pare
        onEnded={traerMusicaTranquila} // Si termina, busca otra
      />

      <button 
        onClick={toggleMute}
        className="btn-musica-minimal"
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          backdropFilter: 'blur(5px)',
          transition: 'all 0.3s ease'
        }}
        title={estaSilenciado ? "Activar música" : "Silenciar música"}
      >
        <span className="material-symbols-rounded" style={{ fontSize: '24px' }}>
          {estaSilenciado ? 'volume_off' : 'volume_up'}
        </span>
      </button>
    </div>
  );
}