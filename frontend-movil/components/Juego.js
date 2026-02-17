import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

const COLORS = {
  bodyBg: '#032a30',
  coral: '#FF5B5B',
  sky: '#9CCFFF',
  cardBg: 'rgba(255, 255, 255, 0.08)',
  white: '#FFFFFF',
  success: '#4CAF50',
  error: '#F44336'
};

// Recibe props directas desde Inicio.js
export default function Juego({ preguntas, partidaId, alTerminar }) {
  const [indice, setIndice] = useState(0);
  const [respondido, setRespondido] = useState(false);
  const [seleccionada, setSeleccionada] = useState(null);
  const [correctas, setCorrectas] = useState([]);

  const preguntaActual = preguntas[indice];
  // USAMOS TU IP ACTUAL
  const API_BASE = "http://192.168.0.55:8080/api/movil";

  const enviarRespuesta = async (opcion) => {
    if (respondido) return;
    setSeleccionada(opcion);

    try {
      const res = await axios.post(`${API_BASE}/responder/${partidaId}/${preguntaActual.id}`, [opcion]);
      
      setCorrectas(res.data.respuestasCorrectas);
      setRespondido(true);

      setTimeout(() => {
        if (res.data.terminada) {
          Alert.alert("¡Fin!", `Partida terminada. Puntos: ${res.data.puntosTotales}`, [
            { text: "VOLVER", onPress: () => alTerminar() }
          ]);
        } else {
          setIndice(indice + 1);
          setRespondido(false);
          setSeleccionada(null);
          setCorrectas([]);
        }
      }, 1500);
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progresoText}>Pregunta {indice + 1} de {preguntas.length}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((indice + 1) / preguntas.length) * 100}%` }]} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.cardPregunta}>
          <Text style={styles.enunciado}>{preguntaActual.enunciado}</Text>
        </View>

        {preguntaActual.opciones.map((opc, i) => {
          let estiloBoton = [styles.botonOpcion];
          if (respondido) {
            if (correctas.includes(opc)) estiloBoton.push(styles.botonCorrecto);
            else if (seleccionada === opc) estiloBoton.push(styles.botonError);
          }

          return (
            <TouchableOpacity 
              key={i} 
              style={estiloBoton} 
              onPress={() => enviarRespuesta(opc)}
              disabled={respondido}
            >
              <Text style={styles.textoOpcion}>{opc}</Text>
              {respondido && correctas.includes(opc) && <MaterialCommunityIcons name="check-circle" size={20} color="white" />}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bodyBg },
  header: { padding: 20 },
  progresoText: { color: COLORS.sky, fontWeight: 'bold', marginBottom: 10 },
  progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3 },
  progressFill: { height: '100%', backgroundColor: COLORS.coral, borderRadius: 3 },
  content: { padding: 20, flex: 1, justifyContent: 'center' },
  cardPregunta: { backgroundColor: COLORS.cardBg, padding: 30, borderRadius: 20, marginBottom: 30, borderHorizontalWidth: 1, borderColor: 'rgba(156,207,255,0.1)' },
  enunciado: { color: COLORS.white, fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  botonOpcion: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 18, borderRadius: 15, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: COLORS.sky },
  botonCorrecto: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  botonError: { backgroundColor: COLORS.error, borderColor: COLORS.error },
  textoOpcion: { color: COLORS.white, fontSize: 16, fontWeight: '600' }
});