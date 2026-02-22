import React, { useState, useEffect } from 'react';
import { 
  View, Text, ScrollView, StyleSheet, TouchableOpacity, 
  StatusBar, ActivityIndicator, Alert 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'; 
import axios from 'axios';

const COLORS = {
  bodyBg: '#032a30',
  heroBg: '#0d5660',
  coral: '#FF5B5B',
  sky: '#9CCFFF',
  cardBg: 'rgba(255, 255, 255, 0.08)',
  white: '#FFFFFF',
  petrolLight: '#088395'
};

export default function Inicio() {
  const navigation = useNavigation();
  const [opcionesDTO, setOpcionesDTO] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DE SELECCIÓN ---
  const [categoriasSel, setCategoriasSel] = useState([]);
  const [tipoSel, setTipoSel] = useState(null);
  const [cantidad, setCantidad] = useState(null);

  const API_BASE = "http://192.168.0.68:8080/api/movil";

  useEffect(() => {
    fetchOpciones();
  }, []);

  const fetchOpciones = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/opciones-quiz`);
      setOpcionesDTO(response.data);
      if (response.data.opcionesCantidad?.length > 0) setCantidad(response.data.opcionesCantidad[0]);
      if (response.data.tipos?.length > 0) setTipoSel(response.data.tipos[0]);
    } catch (error) {
      Alert.alert("Error de Conexión", "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const iniciarPartida = async () => {
    if (categoriasSel.length === 0) {
      Alert.alert("Atención", "Debes seleccionar al menos un tema.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        categorias: categoriasSel,
        tipo: tipoSel,
        cantidad: cantidad
      };

      const response = await axios.post(`${API_BASE}/iniciar`, payload);
      
      // NAVEGAR A LA OTRA PANTALLA ENVIANDO LOS DATOS
      navigation.navigate('Juego', { 
        preguntas: response.data.preguntas, 
        partidaId: response.data.partidaId 
      });
      
    } catch (error) {
      Alert.alert("Error", "No se pudo iniciar la partida.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const manejarSeleccionCategoria = (cat) => {
    if (categoriasSel.includes(cat)) {
      setCategoriasSel(categoriasSel.filter(item => item !== cat));
    } else {
      setCategoriasSel([...categoriasSel, cat]);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size="large" color={COLORS.coral} />
        <Text style={{color: COLORS.sky, marginTop: 10, textAlign: 'center'}}>Conectando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.navbar}>
        <Text style={styles.navBrand}>Quiz App <Text style={{color: COLORS.coral}}>Pro</Text></Text>
        <TouchableOpacity onPress={fetchOpciones} style={styles.refreshBtn}>
            <MaterialCommunityIcons name="refresh" size={24} color={COLORS.sky} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.mainHeader}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>QUIZ-APP</Text>
          </View>
          <Text style={styles.title}>Prepárate para el Reto</Text>
          <Text style={styles.subtitle}>Selecciona tus preferencias de juego</Text>
        </View>

        {/* PASO 1: CATEGORÍAS */}
        <View style={styles.configCard}>
          <View style={styles.stepHeader}>
            <MaterialCommunityIcons name="tag-multiple" size={24} color={COLORS.sky} />
            <Text style={styles.stepTitle}> Temas</Text>
          </View>
          <View style={styles.optionsGrid}>
            {opcionesDTO?.categorias.map(cat => (
              <TouchableOpacity 
                key={cat} 
                onPress={() => manejarSeleccionCategoria(cat)}
                style={[styles.pill, categoriasSel.includes(cat) && styles.pillSelected]}
              >
                <Text style={[styles.pillText, categoriasSel.includes(cat) && styles.textSelected]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* PASO 2: TIPO DE PREGUNTA */}
        <View style={styles.configCard}>
          <View style={styles.stepHeader}>
            <MaterialCommunityIcons name="help-circle" size={24} color={COLORS.coral} />
            <Text style={styles.stepTitle}> Modo de Juego</Text>
          </View>
          <View style={styles.optionsGrid}>
            {opcionesDTO?.tipos.map(t => (
              <TouchableOpacity 
                key={t} 
                onPress={() => setTipoSel(t)}
                style={[styles.pillCoral, tipoSel === t && styles.pillCoralSelected]}
              >
                <Text style={[styles.pillText, tipoSel === t && styles.textSelected]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* PASO 3: CANTIDAD */}
        <View style={styles.configCard}>
          <View style={styles.stepHeader}>
            <MaterialCommunityIcons name="numeric" size={24} color={COLORS.sky} />
            <Text style={styles.stepTitle}> Preguntas</Text>
          </View>
          <View style={styles.quantityGrid}>
            {opcionesDTO?.opcionesCantidad.map(cant => (
              <TouchableOpacity 
                key={cant} 
                onPress={() => setCantidad(cant)}
                style={[styles.circle, cantidad === cant && styles.circleSelected]}
              >
                <Text style={[styles.circleVal, cantidad === cant && styles.textSelected]}>{cant}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
            style={[styles.btnLaunch, { opacity: (categoriasSel.length > 0) ? 1 : 0.5 }]}
            disabled={categoriasSel.length === 0}
            onPress={iniciarPartida}
        >
          <Text style={styles.btnLaunchText}>¡EMPEZAR AHORA!</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <View style={styles.hr} />
          <Text style={styles.footerText}>© 2026 Quiz App Mobile · TFG</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ... (estilos se mantienen igual)
const styles = StyleSheet.create({ 
    container: { flex: 1, backgroundColor: COLORS.bodyBg },
    navbar: { 
        height: 65, backgroundColor: COLORS.heroBg, flexDirection: 'row', 
        alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20,
        borderBottomWidth: 1, borderBottomColor: 'rgba(156, 207, 255, 0.1)'
    },
    navBrand: { color: COLORS.white, fontSize: 20, fontWeight: '900', letterSpacing: 1 },
    refreshBtn: { padding: 5 },
    scrollContent: { padding: 20 },
    mainHeader: { alignItems: 'center', marginBottom: 30 },
    logoBadge: { backgroundColor: COLORS.coral, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 8 },
    logoText: { color: COLORS.white, fontWeight: '900', fontSize: 18, letterSpacing: 2 },
    title: { fontSize: 28, fontWeight: 'bold', marginTop: 15, textAlign: 'center', color: COLORS.white },
    subtitle: { color: COLORS.sky, marginTop: 5, textAlign: 'center', opacity: 0.8 },
    configCard: { 
        backgroundColor: COLORS.cardBg, borderRadius: 20, padding: 20, marginBottom: 20, 
        borderWidth: 1, borderColor: 'rgba(156, 207, 255, 0.1)' 
    },
    stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
    stepTitle: { fontSize: 18, fontWeight: '800', color: COLORS.white, letterSpacing: 0.5 },
    optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    pill: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, borderWidth: 1, borderColor: COLORS.sky },
    pillSelected: { backgroundColor: COLORS.petrolLight, borderColor: COLORS.sky },
    pillCoral: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, borderWidth: 1, borderColor: COLORS.coral },
    pillCoralSelected: { backgroundColor: COLORS.coral, borderColor: COLORS.coral },
    pillText: { fontWeight: '700', color: COLORS.white, fontSize: 14 },
    textSelected: { color: COLORS.white, fontWeight: 'bold' },
    quantityGrid: { flexDirection: 'row', justifyContent: 'space-around' },
    circle: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: COLORS.sky, justifyContent: 'center', alignItems: 'center' },
    circleSelected: { backgroundColor: COLORS.coral, borderColor: COLORS.coral },
    circleVal: { fontSize: 18, fontWeight: '900', color: COLORS.white },
    btnLaunch: { 
        backgroundColor: COLORS.white, paddingVertical: 18, borderRadius: 15, alignItems: 'center', 
        marginTop: 10, elevation: 8
    },
    btnLaunchText: { color: COLORS.bodyBg, fontSize: 18, fontWeight: '900', letterSpacing: 1 },
    footer: { marginTop: 40, alignItems: 'center', paddingBottom: 20 },
    hr: { height: 1, backgroundColor: 'rgba(156, 207, 255, 0.1)', width: '100%', marginBottom: 15 }
});