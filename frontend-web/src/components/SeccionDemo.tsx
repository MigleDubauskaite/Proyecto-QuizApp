import { useEffect, useState } from 'react';
import axios from 'axios';

// Definimos la interfaz para TypeScript
interface NotificacionEmail {
  id?: number;
  titulo: string;
  email: string;
}

const SeccionDemo = () => {
  const [items, setItems] = useState<NotificacionEmail[]>([]);
  const [mensaje, setMensaje] = useState("");

  const API_URL = "http://localhost:8080/api/demo";

  // Función para obtener los headers con el token JWT
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token"); // Asegúrate de que este es el nombre con el que guardas el JWT
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    };
  };

  const fetchDemo = async () => {
    try {
      const res = await axios.get(API_URL, getAuthHeaders());
      setItems(res.data);
    } catch (err) {
      console.error("Error al cargar la demo:", err);
      setMensaje("Error de autenticación o servidor");
    }
  };

  useEffect(() => {
    fetchDemo();
  }, []);

  const crearElemento = async () => {
    try {
      // Enviamos datos que mapean a la clase hija 'NotificacionEmail' en Java
      const nuevaNotificacion = {
        titulo: `Aviso del sistema ${new Date().toLocaleTimeString()}`,
        email: "admin@empresa.com"
      };
      
      await axios.post(API_URL, nuevaNotificacion, getAuthHeaders());
      setMensaje("¡Insertado en 2 tablas (Padre e Hija)!");
      fetchDemo();
    } catch (err) {
      setMensaje("Error al crear. ¿Tienes rol ADMIN?");
    }
  };

  const borrarElemento = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
      setMensaje(`ID ${id} borrado de ambas tablas.`);
      fetchDemo();
    } catch (err) {
      setMensaje("Error al borrar.");
    }
  };

  return (
    <div style={{
      border: "1px solid #444",
      borderRadius: "10px",
      padding: "25px",
      backgroundColor: "#1e1e1e",
      color: "#eee",
      marginTop: "30px",
      fontFamily: "sans-serif"
    }}>
      <h3 style={{ color: "#00e5ff", marginTop: 0 }}>
        🛡️ Demo Herencia JPA: Estrategia JOINED
      </h3>
      <p style={{ color: "#aaa", fontSize: "14px" }}>
        Prueba técnica: Al eliminar un registro aquí, Hibernate ejecutará dos DELETE 
        en MySQL (tabla <i>notificacion</i> y tabla <i>notificacion_email</i>).
      </p>

      {mensaje && (
        <div style={{ 
          padding: "10px", 
          backgroundColor: "#00e5ff22", 
          color: "#00e5ff", 
          borderRadius: "5px",
          marginBottom: "15px",
          fontSize: "13px"
        }}>
          {mensaje}
        </div>
      )}

      <button 
        onClick={crearElemento}
        style={{
          padding: "10px 20px",
          backgroundColor: "#00e5ff",
          border: "none",
          borderRadius: "5px",
          color: "#000",
          fontWeight: "bold",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        + Crear Notificación (Hija)
      </button>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #444", textAlign: "left" }}>
            <th style={{ padding: "10px" }}>ID (Padre)</th>
            <th style={{ padding: "10px" }}>Título (Padre)</th>
            <th style={{ padding: "10px" }}>Email (Hija)</th>
            <th style={{ padding: "10px" }}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #333" }}>
              <td style={{ padding: "10px" }}>{item.id}</td>
              <td style={{ padding: "10px" }}>{item.titulo}</td>
              <td style={{ padding: "10px", color: "#00e5ff" }}>{item.email}</td>
              <td style={{ padding: "10px" }}>
                <button 
                  onClick={() => borrarElemento(item.id)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#ff4444",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer"
                  }}
                >
                  Borrar Cascada
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SeccionDemo;