import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function ReproductorMusica() {
  const [cancion, setCancion] = useState<any>(null);
  const [estaSilenciado, setEstaSilenciado] = useState(
    localStorage.getItem('musica_mute') === 'true'
  );
  const audioRef = useRef<HTMLAudioElement>(null);

  const traerMusicaTranquila = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/movil/musica/buscar', {
        headers: { 'Authorization': '' }
      });
      const nuevaCancion = response.data;
      setCancion(nuevaCancion);
      
      // Guardamos la nueva canción para que si vuelves a Thymeleaf, sepa cuál es
      localStorage.setItem('musica_url', nuevaCancion.urlAudio);
      localStorage.setItem('musica_titulo', nuevaCancion.titulo); // Opcional para debug
    } catch (error) {
      console.error("Error al obtener música:", error);
    }
  };

  useEffect(() => {
    const urlGuardada = localStorage.getItem('musica_url');
    const tiempoGuardado = localStorage.getItem('musica_tiempo');

    if (urlGuardada) {
      // Si ya hay una canción en el almacenamiento, la cargamos directamente
      setCancion({ urlAudio: urlGuardada });
      
      // Esperamos un microsegundo a que el elemento audio exista para ponerle el tiempo
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = parseFloat(tiempoGuardado || "0");
        }
      }, 100);
    } else {
      // Si no hay nada, pedimos una nueva
      traerMusicaTranquila();
    }

    // Intervalo para guardar el progreso (igual que en JS puro)
    const intervalo = setInterval(() => {
      if (audioRef.current && !audioRef.current.paused) {
        localStorage.setItem('musica_tiempo', audioRef.current.currentTime.toString());
      }
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      const nuevoEstadoMute = !audioRef.current.muted;
      audioRef.current.muted = nuevoEstadoMute;
      setEstaSilenciado(nuevoEstadoMute);
      localStorage.setItem('musica_mute', nuevoEstadoMute.toString());
    }
  };

  if (!cancion) return null;

  return (
    <div className="posicion-altavoz-fijo" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      <audio 
        ref={audioRef}
        src={cancion.urlAudio} 
        autoPlay 
        muted={estaSilenciado}
        onEnded={() => {
          localStorage.removeItem('musica_url');
          traerMusicaTranquila();
        }}
      />

      <button 
        onClick={toggleMute}
        className="btn-musica-minimal"
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%', width: '50px', height: '50px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'white', backdropFilter: 'blur(5px)',
          transition: 'all 0.3s ease'
        }}
      >
        <span className="material-symbols-rounded">
          {estaSilenciado ? 'volume_off' : 'volume_up'}
        </span>
      </button>
    </div>
  );
}