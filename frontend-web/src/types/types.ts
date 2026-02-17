// --- DTOs de Autenticación ---

export interface LoginRequest {
  nombre: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  nombre: string;
  rol: string; // 'ROLE_USER' o 'ROLE_ADMIN'
}

// --- DTOs del Juego ---

export interface JuegoRequest {
  nombre: string;
  categorias: string[] | null;
  tipos: string[] | null;
  cantidad: number;
}

export interface OpcionesQuizDTO {
  categorias: string[];
  tipos: ('VF' | 'UNICA' | 'MULTIPLE')[];
  opcionesCantidad: number[];
}

export interface PreguntaDTO {
  id: string;
  enunciado: string;
  tipo: 'VF' | 'UNICA' | 'MULTIPLE';
  categoria: string;
  opciones: string[];
}

export interface PartidaResponse {
  partidaId: number;
  jugadorId: number;
  nombreJugador: string;
  aciertos: number;
  totalPreguntas: number;
  preguntas: PreguntaDTO[];
}

// --- DTOs de Respuestas ---

export interface RespuestaRequest {
  partidaId: number;
  preguntaId: string;
  respuestasUsuario: string[];
}

export interface RespuestaResultadoDTO {
  esCorrecta: boolean;
  respuestasCorrectas: string[];
  puntosObtenidos: number;
  puntosTotales: number;
  aciertosActuales: number;
  totalPreguntas: number;
  terminada: boolean;
}

// --- DTOs de Historial ---

export interface HistorialDTO {
  id: number;
  fecha: string;
  categoria: string;
  puntos: number;
  totalPreguntas: number;
  aciertos: number,
}