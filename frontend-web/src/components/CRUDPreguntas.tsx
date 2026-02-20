import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CrudPreguntas.css";
import SeccionDemo from "./SeccionDemo";

type TipoPregunta = "VF" | "UNICA" | "MULTIPLE";

interface Pregunta {
  id: string;
  enunciado: string;
  tipo: TipoPregunta;
  categoria: string;
  opciones: string[];
  respuestas: string[];
  respuestasCorrectas: string[];
}

interface PreguntaForm {
  enunciado: string;
  tipo: TipoPregunta;
  categoria: string;
  opciones: string[];
  respuestas: string[];
  respuestasCorrectas: string[];
}

function CRUDPreguntas() {
  const BASE_URL = "http://localhost:8080/api/preguntas";
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [preguntaDetalle, setPreguntaDetalle] = useState<Pregunta | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;
  const [search, setSearch] = useState('');
  const [filterTema, setFilterTema] = useState('');
  const [filterTipo, setFilterTipo] = useState('');

  const [archivo, setArchivo] = useState<File | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [formData, setFormData] = useState<PreguntaForm>({
    enunciado: "", tipo: "" as TipoPregunta, categoria: "", opciones: [], respuestas: [], respuestasCorrectas: [],
  });

  const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${token}` } });

  useEffect(() => {
    if (token && rol === "ROLE_ADMIN") {
      findAll(0);
    } else {
      navigate("/login");
    }
  }, [search, filterTema, filterTipo]);

  const findAll = async (page: number) => {
    setError(null);
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: pageSize.toString(),
        enunciado: search,
        categoria: filterTema,
        tipo: filterTipo
      });

      const res = await axios.get(`${BASE_URL}/paginado?${params}`, getAuthHeader());
      
      // Con VIA_DTO, los datos están en res.data.content
      setPreguntas(res.data.content || []);

      // Y los metadatos de paginación están dentro del objeto .page
      if (res.data.page) {
        setTotalPages(res.data.page.totalPages);
        setCurrentPage(res.data.page.number);
      }
      
    } catch (err) {
      setError("Error al cargar datos desde el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData, respuestas: formData.opciones };
      if (editingId) {
        await axios.put(`${BASE_URL}/${editingId}`, dataToSend, getAuthHeader());
      } else {
        await axios.post(BASE_URL, dataToSend, getAuthHeader());
      }
      setEditingId(null);
      setFormData({ enunciado: "", tipo: "VF", categoria: "", opciones: [], respuestas: [], respuestasCorrectas: [] });
      findAll(currentPage);
    } catch { setError("Error al guardar"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar?")) return;
    try {
      await axios.delete(`${BASE_URL}/${id}`, getAuthHeader());
      findAll(currentPage);
    } catch { setError("No se pudo eliminar"); }
  };

  const handleImportar = async () => {
    if (!archivo) return setError("Selecciona un JSON");
    const data = new FormData();
    data.append("archivo", archivo);
    try {
      await axios.post(`${BASE_URL}/importar`, data, {
        headers: { ...getAuthHeader().headers, "Content-Type": "multipart/form-data" }
      });
      setMensaje("Importado con éxito");
      findAll(0);
    } catch { setError("Error en importación"); }
  };

  const categoriasDinámicas = Array.from(new Set(preguntas.map(p => p.categoria))).filter(Boolean);

  return (
    <div className="admin-bg">
      <div className="admin-container">

        <header className="admin-header">
          <h1 className="title-cyan">Quiz Admin Pro {loading && "⏳"}</h1>
          <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="btn-logout">
            Logout
          </button>
        </header>

        {error && <div className="error-banner">⚠️ {error}</div>}

        <div className="admin-grid">

          <aside>
            <div className="admin-sidebar-card">
              <h3 className={editingId ? "text-edit" : "text-new"}>
                {editingId ? "Editar Pregunta" : "Nueva Pregunta"}
              </h3>
              <form onSubmit={handleSave} className="form-crud">
                <input placeholder="Enunciado" value={formData.enunciado} onChange={e => setFormData({ ...formData, enunciado: e.target.value })} required />
                <select value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value as TipoPregunta })}>
                  <option value="">Seleccionar tipo...</option>
                  <option value="VF">V / F</option>
                  <option value="UNICA">Única</option>
                  <option value="MULTIPLE">Múltiple</option>
                </select>
                <input placeholder="Categoría" value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })} required />
                <textarea placeholder="Opciones (coma)" value={formData.opciones.join(", ")}
                  onChange={e => setFormData({ ...formData, opciones: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                  className="textarea-crud"
                />
                <input placeholder="Correctas (coma)" value={formData.respuestasCorrectas.join(", ")}
                  onChange={e => setFormData({ ...formData, respuestasCorrectas: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} 
                />
                <button type="submit" className="btn-save-submit">
                  {editingId ? "ACTUALIZAR" : "CREAR"}
                </button>
              </form>
            </div>
          </aside>

          <main>
            {/* 1. FILTROS */}
            <div className="filters-container">
              <input type="text" placeholder="🔍 Título..." value={search} onChange={e => setSearch(e.target.value)} className="search-input" />
              <select value={filterTema} onChange={e => setFilterTema(e.target.value)}>
                <option value="">Categorías</option>
                {categoriasDinámicas.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)}>
                <option value="">Tipos</option>
                <option value="VF">V/F</option>
                <option value="UNICA">Única</option>
                <option value="MULTIPLE">Múltiple</option>
              </select>
            </div>

            {/* 2. IMPORTACIÓN */}
            <div className="import-section">
              <div className="import-controls">
                <input type="file" accept=".json" onChange={e => setArchivo(e.target.files?.[0] || null)} />
                <button onClick={handleImportar} className="btn-import">Importar JSON</button>
              </div>
              {mensaje && <p className="success-msg">{mensaje}</p>}
            </div>

            {/* 3. TABLA */}
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Enunciado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {preguntas.length > 0 ? preguntas.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div className="enunciado-row">{p.enunciado}</div>
                        <small className="meta-row">{p.categoria} | {p.tipo}</small>
                      </td>
                      <td>
                        <div className="action-group">
                          <button onClick={() => setPreguntaDetalle(p)} className="btn-icon">👁️</button>
                          <button onClick={() => { setEditingId(p.id); setFormData({ ...p }); }} className="btn-icon">✏️</button>
                          <button onClick={() => handleDelete(p.id)} className="btn-icon btn-delete">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={2} className="td-empty">No hay resultados.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* 4. PAGINACIÓN */}
              <div className="pagination-bar">
                <button 
                  className="btn-pagination" 
                  disabled={currentPage === 0} 
                  onClick={() => findAll(currentPage - 1)}
                >
                  Anterior
                </button>
                
                <span className="page-indicator">
                  {currentPage + 1} / {totalPages}
                </span>

                <button 
                  className="btn-pagination" 
                  disabled={currentPage >= totalPages - 1} 
                  onClick={() => findAll(currentPage + 1)}
                >
                  Siguiente
                </button>
              </div>
            </div>
            {/* --- PUNTO HERENCIA: DEMO DE BASE DE DATOS ADICIONAL --- */}
          {/* Lo ponemos al final del main con un separador claro */}
          <div style={{ marginTop: "40px" }}>
             <SeccionDemo />
          </div>
          </main>
        </div>
      </div>

      {/* MODAL DETALLE */}
      {preguntaDetalle && (
        <div className="modal-overlay" onClick={() => setPreguntaDetalle(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2 className="title-cyan">Detalles</h2>
            <p><strong>Pregunta:</strong> {preguntaDetalle.enunciado}</p>
            <p><strong>Correctas:</strong> <span className="text-success">{preguntaDetalle.respuestasCorrectas.join(", ")}</span></p>
            <button onClick={() => setPreguntaDetalle(null)} className="btn-close-modal">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CRUDPreguntas;