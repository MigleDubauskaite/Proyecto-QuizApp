import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Juego.css';
import '../css/Indicadores.css';
import type { PartidaResponse, PreguntaDTO, RespuestaResultadoDTO } from '../types/types';

export default function Juego() {
  const location = useLocation();
  const navigate = useNavigate();
  const partida = location.state?.partida as PartidaResponse;

  const [preguntaActualIndex, setPreguntaActualIndex] = useState(0);
  const [respuestasSeleccionadas, setRespuestasSeleccionadas] = useState<string[]>([]);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [resultado, setResultado] = useState<RespuestaResultadoDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [historialPasos, setHistorialPasos] = useState<(boolean | null)[]>([]);

  // NUEVO: Estado local para que los puntos se mantengan y sumen visualmente
  const [puntosVisuales, setPuntosVisuales] = useState(0);

  useEffect(() => {
    if (!partida) {
      navigate('/login');
    } else {
      setHistorialPasos(new Array(partida.totalPreguntas).fill(null));
    }
  }, [partida, navigate]);

  if (!partida || !partida.preguntas || !partida.preguntas[preguntaActualIndex]) return null;

  const preguntaActual: PreguntaDTO = partida.preguntas[preguntaActualIndex];
  const esMultiple = preguntaActual.tipo === 'MULTIPLE';

  const handleSeleccion = (opcion: string) => {
    if (mostrarResultado) return;
    if (esMultiple) {
      setRespuestasSeleccionadas(prev =>
        prev.includes(opcion) ? prev.filter(r => r !== opcion) : [...prev, opcion]
      );
    } else {
      setRespuestasSeleccionadas([opcion]);
    }
  };

  const handleResponder = async () => {
    if (respuestasSeleccionadas.length === 0) return;
    setLoading(true);
    try {
      const response = await axios.post<RespuestaResultadoDTO>(
        'http://localhost:8080/api/juego/answer',
        {
          partidaId: Number(partida.partidaId || (partida as any).id),
          preguntaId: preguntaActual.id,
          respuestasUsuario: respuestasSeleccionadas
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setResultado(response.data);
      setMostrarResultado(true);

      // ACTUALIZACIÓN DE PUNTOS: Usamos el valor que viene del backend
      setPuntosVisuales(response.data.puntosTotales);

      setHistorialPasos(prev => {
        const nuevo = [...prev];
        nuevo[preguntaActualIndex] = response.data.esCorrecta;
        return nuevo;
      });
    } catch (err) { alert('Error de conexión'); } finally { setLoading(false); }
  };

  const handleSiguiente = () => {
    if (resultado?.terminada) navigate('/resultados', { state: { resultado, partida } });
    else {
      setPreguntaActualIndex(prev => prev + 1);
      setRespuestasSeleccionadas([]);
      setMostrarResultado(false);
      setResultado(null);
    }
  };

  return (
    <div className="quiz-page-wrapper d-flex flex-column align-items-center min-vh-100">
      <div className="container flex-grow-1 d-flex flex-column justify-content-center py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-7">

            {/* SCORE Y USUARIO */}
            <header className="text-center mb-5">
              <div className="score-center-display mb-4">
                <div className="score-ring">
                  <span className="score-number">{puntosVisuales}</span>
                  <span className="score-text">PUNTOS</span>
                </div>
              </div>
              <h2 className="user-title-caps">{partida.nombreJugador.toUpperCase()}</h2>
              <div className="quiz-info-sub">
                <span className="status-blink"></span>
                PREGUNTA {preguntaActualIndex + 1} DE {partida.totalPreguntas}
              </div>
            </header>

            {/* CARD */}
            <main className="game-card-advanced shadow-lg">
              <div className="card-content-spacing">
                <div className="category-header-minimal">
                  <span className="line-dec"></span>
                  <span className="category-txt">{preguntaActual.categoria?.toUpperCase()}</span>
                  <span className="line-dec"></span>
                </div>

                <h2 className="question-text-main text-center">{preguntaActual.enunciado}</h2>

                <div className="options-vertical-grid">
                  {preguntaActual.opciones.map((opcion, index) => {
                    const isSelected = respuestasSeleccionadas.includes(opcion);
                    const isCorrect = resultado?.respuestasCorrectas?.includes(opcion);
                    let statusClass = isSelected ? "selected" : "";
                    if (mostrarResultado) {
                      if (isCorrect) statusClass = "is-correct";
                      else if (isSelected) statusClass = "is-incorrect";
                      else statusClass = "is-muted";
                    }
                    return (
                      <button key={index} onClick={() => handleSeleccion(opcion)} className={`answer-option-box ${statusClass}`} disabled={mostrarResultado}>
                        <div className="option-id">{String.fromCharCode(65 + index)}</div>
                        <div className="option-label">{opcion}</div>
                        {mostrarResultado && isCorrect && <span className="feedback-icon ms-auto text-success">✔</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <footer className="card-action-footer">
                {!mostrarResultado ? (
                  <button onClick={handleResponder} disabled={loading || respuestasSeleccionadas.length === 0} className="btn-action-hero confirm">
                    {loading ? <div className="spinner-border spinner-border-sm"></div> : 'CONFIRMAR RESPUESTA'}
                  </button>
                ) : (
                  <button onClick={handleSiguiente} className="btn-action-hero next">
                    {resultado?.terminada ? 'VER RESULTADOS' : 'CONTINUAR'}
                  </button>
                )}

                {/* BOLITAS SEPARADAS */}
                <div className="dots-stepper-wrapper mt-5">
                  {historialPasos.map((estado, idx) => {
                    let dotClass = "dot-step";
                    if (idx === preguntaActualIndex) dotClass += " is-active";
                    else if (estado === true) dotClass += " is-true";
                    else if (estado === false) dotClass += " is-false";
                    return <div key={idx} className={dotClass} />;
                  })}
                </div>
              </footer>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}