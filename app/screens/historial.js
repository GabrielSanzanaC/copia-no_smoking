import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, historialStylesheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, getDocs, doc } from 'firebase/firestore';
import { auth, db } from '../../FirebaseConfig'; // Asegúrate de que la ruta sea correcta
import BackgroundShapes from '../../components/BackgroundShapes';
import { historialStyles } from '../../constants/styles';
import { accountStyles } from "../../constants/styles";
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from "../../constants/theme";

const HistoryScreen = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [history, setHistory] = useState({});
  const [showRecords, setShowRecords] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchHistory = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "usuarios", user.uid);
        const cigarettesCollectionRef = collection(userDocRef, "CigaretteHistory");

        const querySnapshot = await getDocs(cigarettesCollectionRef);
        const historyData = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (!historyData[data.fecha]) {
            historyData[data.fecha] = [];
          }
          historyData[data.fecha].push(data);
        });
        setHistory(historyData);
      }
    };

    fetchHistory();
  }, [currentMonth, currentYear]);

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const getDaysArray = (month, year) => {
    const numDays = daysInMonth(month, year);
    const days = [];
    for (let i = 1; i <= numDays; i++) {
      days.push(i);
    }
    return days;
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


  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const renderDay = (day) => {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const isSelected = selectedDate === day;
    const hasRecords = Array.isArray(history[dateKey]) && history[dateKey].length > 0;

    return (
      <TouchableOpacity
        key={day}
        style={[historialStyles.dayContainer, hasRecords && historialStyles.hasRecords]}
        onPress={() => {
          const [year, month, day] = dateKey.split("-").map(Number); // Extraer año, mes y día
          setSelectedDate(new Date(year, month - 1, day)); // Crear fecha correctamente
          setShowRecords(true);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,  // Mantener el uso de driver nativo
          }).start();
          
          Animated.timing(heightAnim, {
            toValue: hasRecords ? 1 : 0, // Animar con scaleY para simular el cambio de altura
            duration: 300,
            useNativeDriver: true,  // Mantener el uso de driver nativo
          }).start();
          
        }}
      >
        {isSelected && <View style={historialStyles.selectedCircle} />}
        <Text style={[historialStyles.dayText, isSelected && historialStyles.selectedDayText]}>{day}</Text>
        <Text style={[historialStyles.dayNameText, isSelected && historialStyles.selectedDayText]}>
          {new Date(currentYear, currentMonth, day).toLocaleString("default", { weekday: "short" })}
        </Text>
        {hasRecords && <View style={historialStyles.recordIndicator} />}
      </TouchableOpacity>
    );
  };

  const renderRecords = () => {
    const dateKey = selectedDate ? selectedDate.toISOString().split("T")[0] : "";
    const dailyRecords = Array.isArray(history[dateKey]) ? history[dateKey] : [];
    const totalCigars = dailyRecords.reduce((total, record) => total + record.cigarettesSmoked, 0);
    
    return (
      <Animated.View 
        style={[
          historialStyles.recordsContainer, 
          { opacity: fadeAnim, transform: [{ scaleY: heightAnim }] } // Using scaleY for height animation
        ]}
      >
        <Text style={historialStyles.totalCigarsText}>Total de cigarros: {totalCigars}</Text>
      </Animated.View>
    );
  };
  

  return (
    <View style={[accountStyles.container, isDarkMode ? theme.darkBackground : theme.lightBackground]}>
      {/* Animated Background */}
      <BackgroundShapesMemo />
      <View style={historialStyles.header}>
        <TouchableOpacity onPress={handlePreviousMonth}>
          <Text style={historialStyles.buttonText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={historialStyles.headerText}>
          {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" }).charAt(0).toUpperCase() +
            new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" }).slice(1)}{" "}
          {currentYear}
        </Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Text style={historialStyles.buttonText}>{">"}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getDaysArray(currentMonth, currentYear)}
        renderItem={({ item }) => renderDay(item)}
        keyExtractor={(item) => item.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={70} // Ajusta este valor al ancho total de cada elemento
        snapToAlignment="start" // Alinea los elementos al inicio
        decelerationRate="fast"
        bounces={false} // Desactiva el rebote para evitar movimientos inesperados
      
        style={historialStyles.list}
      />


      {showRecords && renderRecords()}

      <TouchableOpacity style={historialStyles.scrollToTopButton} onPress={() => router.push("./ProfileScreen")}>
        <Text style={historialStyles.scrollToTopText}>↑</Text>
        <Text style={historialStyles.scrollToTopLabel}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

const BackgroundShapesMemo = React.memo(() => {
  return <BackgroundShapes />;
});

export default HistoryScreen;