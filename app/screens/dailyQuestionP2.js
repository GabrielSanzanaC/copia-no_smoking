import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import BackgroundShapes from '../../components/BackgroundShapes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from "../../constants/theme";
import { locations, activities } from "../../components/Emoticons"

export default function DailyQuestionCombined() {
  const [selectedOptionP3, setSelectedOptionP3] = useState(null); // Opción de ubicación
  const [selectedOptionP4, setSelectedOptionP4] = useState(null); // Opción de actividad
  const [isDarkMode, setIsDarkMode] = useState(true);
  const router = useRouter();
  const { emotion, cigarettes } = useLocalSearchParams(); // Recibimos parámetros de pantallas previas

  const handleNext = () => {
    if (selectedOptionP3 && selectedOptionP4) {
      router.push({
        pathname: './dailyQuestionP3',
        params: {
          emotion,
          cigarettes,
          location: selectedOptionP3,
          activity: selectedOptionP4,
        },
      });
    }
  };

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("isDarkMode");
        if (savedTheme !== null) {
          setIsDarkMode(JSON.parse(savedTheme)); // Convertir el valor a booleano
        }
      } catch (error) {
        console.error("Error al cargar el tema:", error);
      }
    };
    loadTheme();
  }, []);

  const handleSelectLocation = (location) => {
    setSelectedOptionP3(location);
  };

  return (
    <View style={[styles.container, isDarkMode ? theme.darkBackground : theme.lightBackground]}>
      {/* Componente de fondo fuera del ScrollView */}
      <BackgroundShapesMemo />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Indicador de pasos */}
        <View style={styles.stepContainer}>
          {['01', '02', '03'].map((step, index) => (
            <View
              key={index}
              style={[styles.stepCircle, index === 1 && styles.activeStepCircle]} // Marca el paso activo
            >
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Título */}
        <Text style={styles.title}>Cuéntanos más sobre tu experiencia:</Text>

        {/* Pregunta: ¿Dónde fumaste? */}
        <View style={{ width: '100%' }}>
          <Text style={styles.subtitle}>¿Dónde fumaste?</Text>
          <View style={styles.optionsContainer}>
            {locations.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedOptionP3 === option.label && styles.selectedOptionButton,
                ]}
                onPress={() => handleSelectLocation(option.label)}
              >
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pregunta: ¿Qué estabas haciendo antes de fumar? */}
        <View style={{ width: '100%' }}>
          <Text style={styles.subtitle}>¿Qué estabas haciendo antes de fumar?</Text>
          <View style={styles.optionsContainer}>
            {activities.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedOptionP4 === option.label && styles.selectedOptionButton,
                ]}
                onPress={() => setSelectedOptionP4(option.label)}
              >
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Botón de siguiente */}
        <TouchableOpacity
          style={[
            styles.nextButton,
            {
              opacity: selectedOptionP3 && selectedOptionP4 ? 1 : 0.5,
            },
          ]}
          onPress={handleNext}
          disabled={!selectedOptionP3 || !selectedOptionP4}
        >
          <Text style={styles.nextButtonText}>Siguiente</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const BackgroundShapesMemo = React.memo(() => {
  return <BackgroundShapes />;
});

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1, // Asegura que ocupe toda la pantalla
    justifyContent: 'flex-start', // Alinea el contenido en la parte superior
    backgroundColor: '#7595BF',
    zIndex: -1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 30,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#072040',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedOptionButton: {
    borderWidth: 2, // Añadido el borde
    borderColor: "yellow", // Color del borde, puedes cambiarlo según tu preferencia
    backgroundColor: '#54DEAF',
  },
  optionEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#FFF',
  },
  nextButton: {
    width: '80%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#059E9E',
    alignItems: 'center',
    elevation: 5,
    boxShadow: "0 2px 3px rgba(0, 0, 0, 0.3)",
  },
  nextButtonText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "600",
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#33334D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  activeStepCircle: {
    backgroundColor: '#4F59FF',
  },
  stepText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    width: '100%',  // Asegura que ocupe todo el ancho
    height: '100%', // Asegura que ocupe toda la altura
  },
  circle: {
    position: "absolute",
    borderRadius: 50,
  },
});
