import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Animated, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { Easing } from 'react-native-reanimated';
import BackgroundShapes from '../../components/BackgroundShapes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from "../../constants/theme";
import { emotions } from "../../components/Emoticons"

export default function dailyQuestionP1() {
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [cigarettes, setCigarettes] = useState('');
  const [scale] = useState(new Animated.Value(1)); // Animación de escala
  const router = useRouter();

  const handlePress = (emotionId) => {
    setSelectedEmotion(emotionId);
    Animated.timing(scale, {
      toValue: 1.1,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    });
  }

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

  return (
    
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={[styles.container, isDarkMode ? theme.darkBackground : theme.lightBackground]}>
    <BackgroundShapesMemo />
      
        {/* Profile Button */}
        <TouchableOpacity 
          onPress={() => router.push("./ProfileScreen")} 
          style={styles.profileButton}
        >
          <Ionicons name="arrow-back-outline" size={24} color="white" />
          <Text style={styles.profileText}>Inicio</Text>
        </TouchableOpacity>

        <View style={styles.stepContainer}>
          {['01', '02', '03'].map((step, index) => (
            <View
              key={index}
              style={[styles.stepCircle, index === 0 && styles.activeStepCircle]}
            >
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.title}>¿Cómo te sientes hoy?</Text>
        <View style={styles.taskContainer}>
          {emotions.map((emotion) => (
            <TouchableOpacity
              key={emotion.id}
              style={[styles.taskButton, selectedEmotion === emotion.id && styles.selectedTaskButton]}
              onPress={() => handlePress(emotion.id)}
            >
              <Animated.Text
                style={[styles.taskIcon, selectedEmotion === emotion.id && { transform: [{ scale }] }]}
              >
                {emotion.icon}
              </Animated.Text>
              <Text style={styles.taskLabel}>{emotion.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.inputLabel}>¿Cuántos cigarros has fumado hoy?</Text>
        <TextInput
          style={styles.input}
          placeholder="Cantidad de cigarros"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={cigarettes}
          onChangeText={setCigarettes}
        />

        <TouchableOpacity
          style={[styles.nextButton, { opacity: selectedEmotion && cigarettes ? 1 : 0.5 }]}
          onPress={() => {
            if (selectedEmotion && cigarettes) {
              router.push({
                pathname: './dailyQuestionP2',
                params: { emotion: selectedEmotion, cigarettes },
              });
            }
          }}
          disabled={!selectedEmotion || !cigarettes}
        >
          <Text style={styles.nextButtonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const BackgroundShapesMemo = React.memo(() => {
  return <BackgroundShapes />;
});

const styles = StyleSheet.create({
  profileButton: {
    flexDirection: "row", // Para que el ícono y el texto estén en una fila
    alignItems: "center", // Centra verticalmente el ícono y el texto
    marginBottom: 20, // Espacio entre el botón y los otros elementos
    position: 'absolute', // Asegura que el botón esté posicionado de forma absoluta
    left: 20, // Ajusta esta propiedad para mover el botón a la izquierda
    top: 20, // Puedes ajustar esta propiedad para mover el botón verticalmente si es necesario
  },
  profileText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "600",
    fontSize: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7595BF',
    padding: 20,
    zIndex: -1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  taskContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  taskButton: {
    width: 100,
    height: 100,
    backgroundColor: '#072040',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    elevation: 5,
    boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.3)",
  },
  selectedTaskButton: {
    borderWidth: 2, // Añadido el borde
    borderColor: "yellow", // Color del borde, puedes cambiarlo según tu preferencia
    backgroundColor: '#54DEAF',
    transform: [{ scale: 1.1 }],
  },
  taskIcon: {
    fontSize: 28,
    color: '#FFF',
  },
  taskLabel: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 5,
  },
  inputLabel: {
    fontSize: 14,
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'beige',
    color: '#333',
    marginBottom: 20,
  },
  nextButton: {
    width: '80%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#059E9E',
    alignItems: 'center',
    elevation: 5,
    boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.3)"
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
    backgroundColor: '#33334D',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  activeStepCircle: {
    backgroundColor: '#4F59FF',
  },
  stepText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  circle: {
    position: "absolute",
    borderRadius: 50,
  },
});
