import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Inicio from './components/Inicio'; 
import Juego from './components/Juego'; 
import Resultado from './components/ResultadoJuego.js';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Inicio" component={Inicio} />
        <Stack.Screen name="Juego" component={Juego} />
        <Stack.Screen name="ResultadoJuego" component={Resultado} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}