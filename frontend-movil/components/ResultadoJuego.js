import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

const COLORS = {
  bodyBg: '#032a30',
  coral: '#FF5B5B',
  sky: '#9CCFFF',
  white: '#FFFFFF',
  cardBg: 'rgba(255, 255, 255, 0.08)',
};

export default function Resultado({ route, navigation }) {
  const { partidaId } = route.params;
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumen();
  }, []);

  const fetchResumen = async () => {
    try {
      const res = await axios.get(`http://192.168.0.68:8080/api/movil/finalizar/${partidaId}`);
      setResumen(res.data);
    } catch (error) {
      console.error("Error al obtener resumen", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <View style={styles.container}><ActivityIndicator size="large" color={COLORS.coral} /></View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <MaterialCommunityIcons name="trophy" size={80} color={COLORS.sky} />
        
        <Text style={styles.titulo}>{resumen?.mensaje}</Text>
        
        <View style={styles.scoreCard}>
          <Text style={styles.scoreText}>{resumen?.puntos} / {resumen?.total}</Text>
          <Text style={styles.subtext}>Aciertos Totales</Text>
        </View>

        <Text style={styles.jugadorText}>Jugador: {resumen?.jugador}</Text>

        <Pressable 
          style={styles.btnVolver} 
          onPress={() => navigation.navigate('Inicio')}
        >
          <Text style={styles.btnText}>VOLVER AL MENÚ</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bodyBg, justifyContent: 'center' },
  content: { alignItems: 'center', padding: 30 },
  titulo: { color: COLORS.white, fontSize: 24, fontWeight: 'bold', marginVertical: 20 },
  scoreCard: { backgroundColor: COLORS.cardBg, padding: 40, borderRadius: 30, alignItems: 'center', width: '100%', borderWidth: 1, borderColor: COLORS.sky },
  scoreText: { color: COLORS.coral, fontSize: 48, fontWeight: '900' },
  subtext: { color: COLORS.sky, fontSize: 16, marginTop: 10 },
  jugadorText: { color: COLORS.white, opacity: 0.6, marginTop: 20 },
  btnVolver: { backgroundColor: COLORS.white, paddingHorizontal: 40, paddingVertical: 15, borderRadius: 15, marginTop: 40 },
  btnText: { color: COLORS.bodyBg, fontWeight: '900', fontSize: 16 }
});