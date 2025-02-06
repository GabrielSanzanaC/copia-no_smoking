import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, BackHandler, Modal, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../../FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, setDoc, updateDoc, doc, getDoc, Timestamp } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import Svg, { Text as SvgText } from "react-native-svg";
import FullMonthChart from "./FullMonthChart";
import moment from "moment";  // Importar moment.js
import loadGif from "../../assets/images/load.gif"; // Importar la imagen de carga
import { profileStyles } from "../../constants/styles";
import theme from "../../constants/theme";


const screenWidth = Dimensions.get("window").width;

const ProfileScreen = () => {
  const router = useRouter();
  const [nombre, setNombre] = useState("Cargando...");
  const [userEmail, setUserEmail] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [timeWithoutSmoking, setTimeWithoutSmoking] = useState(0);
  const [cigarettesSmokedToday, setCigarettesSmokedToday] = useState(null);
  const [streakDays, setStreakDays] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [intervalId, setIntervalId] = useState(null);
  const [isFullMonthChartVisible, setFullMonthChartVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cigarettesData, setCigarettesData] = useState(Array(31).fill(0));
  const [last7DaysData, setLast7DaysData] = useState(Array(7).fill(0));
  
  const handleExitApp = () => {
    setIsModalVisible(true);
  };

  const confirmExit = () => {
    BackHandler.exitApp();
  };

  const cancelExit = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);
        setUserId(user.uid);
        await getUserData(user.uid);
        await getCigarettesForToday(user.uid);
        await getCigarettesData(user.uid);
        await calculateTimeWithoutSmoking(user.uid);
        await updateStreak(user.uid);
      } else {
        setNombre("Usuario invitado");
        setCigarettesSmokedToday(0);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("isDarkMode");
        if (savedTheme !== null) {
          setIsDarkMode(JSON.parse(savedTheme)); // Convertir el valor a booleano
        }
      } catch (error) {}
    };
    loadTheme();
  }, []);

  const getCigarettesData = async (uid) => {
    try {
      const userDocRef = doc(db, "usuarios", uid);
      const cigarettesCollectionRef = collection(userDocRef, "CigaretteHistory");

      const q = query(cigarettesCollectionRef);
      const querySnapshot = await getDocs(q);

      const data = {};
      querySnapshot.forEach((doc) => {
        const date = moment(doc.data().fecha);
        const dayOfMonth = date.date();
        const cigarettesSmoked = doc.data().cigarettesSmoked || 0;

        if (!data[dayOfMonth]) {
          data[dayOfMonth] = 0;
        }
        data[dayOfMonth] += cigarettesSmoked;
      });

      const currentDate = moment();
      const last7Days = Array(7).fill(0);

      for (let i = 0; i < 7; i++) {
        const date = currentDate.clone().subtract(i, 'days');
        const dayOfMonth = date.date();
        if (data[dayOfMonth]) {
          last7Days[6 - i] = data[dayOfMonth];
        }
      }

      setLast7DaysData(last7Days.map(value => Math.trunc(value)));

      const daysInMonth = currentDate.daysInMonth();
      const monthData = Array(daysInMonth).fill(0);

      for (let i = 0; i < daysInMonth; i++) {
        if (data[i + 1]) {
          monthData[i] = data[i + 1];
        }
      }
      setCigarettesData(monthData);
    } catch (error) {}
  };
  
  const updateStreak = async (uid) => {
    const streakRef = doc(db, "usuarios", uid, "racha", "latest");
    const docSnap = await getDoc(streakRef);
  
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0]; // Obtener solo la fecha (yyyy-mm-dd)
  
    if (docSnap.exists()) {
      const data = docSnap.data();
      const lastLogin = data.lastLogin;
  
      if (lastLogin === todayDate) {
        setStreakDays(data.streak);
      } else {
        if (lastLogin === getYesterday(todayDate)) {
          const newStreak = (data.streak || 0) + 1;
          await updateDoc(streakRef, {
            streak: newStreak,
            lastLogin: todayDate,
          });
          setStreakDays(newStreak);  // Actualiza el estado de la racha
        } else {
          await updateDoc(streakRef, {
            streak: 1,
            lastLogin: todayDate,
          });
          setStreakDays(1);  // Reinicia el estado de la racha
        }
      }
    } else {
      await setDoc(streakRef, {
        streak: 1,
        lastLogin: todayDate,
      });
      setStreakDays(1);  // Inicializa la racha
    }
  };
  
  // Función para obtener la fecha del día anterior
  const getYesterday = (date) => {
    const dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() - 1);
    return dateObj.toISOString().split('T')[0]; // Solo la fecha (yyyy-mm-dd)
  };

  const calculateTimeWithoutSmoking = async (uid) => {
    try {
      const userDocRef = doc(db, "usuarios", uid);
      const TiempoSinFumarRef = collection(userDocRef, "TiempoSinFumar");

      // Aquí obtenemos todos los documentos dentro de la colección TiempoSinFumar
      const querySnapshot = await getDocs(TiempoSinFumarRef);

      if (!querySnapshot.empty) {
        // Tomamos el primer documento de la colección
        const tiempoDoc = querySnapshot.docs[0];

        const ultimoRegistro = tiempoDoc.data()?.ultimoRegistro;

        if (ultimoRegistro) {
          const currentTime = Timestamp.now();
          const difference = currentTime.seconds - ultimoRegistro.seconds;
          setTimeWithoutSmoking(difference);

          // Actualizar el cronómetro cada segundo
          const interval = setInterval(() => {
            setTimeWithoutSmoking(prevTime => prevTime + 1);
          }, 1000);
          setIntervalId(interval); // Guardamos el ID del intervalo para poder cancelarlo más tarde
        } else {
          setTimeWithoutSmoking(0);
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    // Limpiar el intervalo cuando el componente se desmonte
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);
  

  const getMonthlySavings = async (uid) => {
    try {
      const currentDate = moment();
      const firstDayOfMonth = currentDate.clone().startOf('month');
      const lastDayOfMonth = currentDate.clone().endOf('month');

      const userDocRef = doc(db, "usuarios", uid);
      const cigarettesCollectionRef = collection(userDocRef, "CigaretteHistory");

      const q = query(
        cigarettesCollectionRef,
        where("fecha", ">=", firstDayOfMonth.format("YYYY-MM-DD")),
        where("fecha", "<=", lastDayOfMonth.format("YYYY-MM-DD"))
      );
      const querySnapshot = await getDocs(q);

      let totalCigarettesSmoked = 0;
      querySnapshot.forEach((doc) => {
        totalCigarettesSmoked += doc.data().cigarettesSmoked || 0;
      });

      const userDoc = await getDocs(query(collection(db, "usuarios"), where("uid", "==", uid)));
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        const cigarrillosPorDía = parseInt(userData.cigarrillosPorDía, 10);
        const cigarrillosPorPaquete = parseInt(userData.cigarrillosPorPaquete, 10);
        const precioPorPaquete = parseFloat(userData.precioPorPaquete);

        const precioPorCigarrillo = precioPorPaquete / cigarrillosPorPaquete;
        const diasEnElMes = lastDayOfMonth.date();
        const totalCigarettesExpected = cigarrillosPorDía * diasEnElMes;

        const dineroAhorrado = (totalCigarettesExpected - totalCigarettesSmoked) * precioPorCigarrillo;

        setMonthlySavings(dineroAhorrado.toFixed(2));
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (userId) {
      getMonthlySavings(userId);
    }
  }, [userId]);


  useEffect(() => {
    const dailyMessage = () => {
      const messages = [
        "Cada día sin fumar es una victoria.",
        "Tu salud es lo más importante.",
        "Recuerda por qué comenzaste este viaje.",
        "¡Sigue así, estás haciendo un gran trabajo!",
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    };

    const checkAndUpdateMessage = async () => {
      const lastShownDate = await AsyncStorage.getItem("lastShownDate");
      const currentDate = moment().format("YYYY-MM-DD");

      if (lastShownDate !== currentDate) {
        const newMessage = dailyMessage();
        setMotivationalMessage(newMessage);
        await AsyncStorage.setItem("lastShownDate", currentDate);
        await AsyncStorage.setItem("motivationalMessage", newMessage);
      } else {
        const savedMessage = await AsyncStorage.getItem("motivationalMessage");
        setMotivationalMessage(savedMessage || dailyMessage());
      }
    };

    checkAndUpdateMessage();
  }, []);

  const getUserData = async (email) => {
    try {
      const q = query(collection(db, "usuarios"), where("uid", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setNombre(userData.nombre || "Usuario");
        setMonthlySavings(userData.monthlySavings || 0);
      } else {
        setNombre("Usuario");
      }
    } catch (error) {
      setNombre("Error al obtener datos");
    }
  };

  const getCigarettesForToday = async (uid) => {
    try {
      const currentDate = moment().format("YYYY-MM-DD");
      const userDocRef = doc(db, "usuarios", uid);
      const cigarettesCollectionRef = collection(userDocRef, "CigaretteHistory");

      const q = query(cigarettesCollectionRef, where("fecha", "==", currentDate));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setCigarettesSmokedToday(data.cigarettesSmoked || 0);
      } else {
        setCigarettesSmokedToday(0);
      }
    } catch (error) {
      setCigarettesSmokedToday(0);
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const getLast7DaysLabels = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = moment().subtract(i, 'days');
      return date.format('ddd');
    }).reverse();
  };

  const last7DaysChartData = {
    labels: getLast7DaysLabels(),
    datasets: [
      {
        data: last7DaysData.map(value => Math.trunc(value)),
        strokeWidth: 3,
      },
    ],
  };

  const chartData = {
    labels: Array.from({ length: moment().endOf('month').date() }, (_, i) => i + 1),
    datasets: [
      {
        data: cigarettesData,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "transparent", // Fondo transparente
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 10, // Grosor de las líneas
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForDots: {
      r: "2.5",
      fill: "white",
    },
    propsForBackgroundLines: {
      stroke: "white",
      strokeWidth: 0.2,
    },
    decimalPlaces: 1,
  };

  const maxDataValue = Math.max(...last7DaysData);

  const handleChartPress = () => {
    setFullMonthChartVisible(true);
  };
  
  return (
    <View style={[profileStyles.container, isDarkMode ? theme.darkBackground : theme.lightBackground]}>
        {/* Animated Background */}
      <Animatable.View animation="fadeIn" style={profileStyles.rectangle}>
      <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={cancelExit}
        >
          <View style={profileStyles.modalBackground}>
            <View style={profileStyles.modalContainer}>
              <Text style={profileStyles.modalTitle}>¿Estás seguro?</Text>
              <Text style={profileStyles.modalMessage}>¿Quieres cerrar la aplicación?</Text>
              <View style={profileStyles.modalButtons}>
                <TouchableOpacity onPress={cancelExit} style={profileStyles.modalButton}>
                  <Text style={profileStyles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmExit} style={[profileStyles.modalButton, profileStyles.confirmButton]}>
                  <Text style={profileStyles.modalButtonText}>Salir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      <TouchableOpacity style={profileStyles.navButtonLeft} onPress={handleExitApp}>
          <Ionicons name="exit" size={24} color="#F2F2F2" />
        </TouchableOpacity>
        <Animatable.Text animation="bounceIn" style={profileStyles.welcomeText}>¡Hola, {nombre}!</Animatable.Text>
        <ScrollView 
          contentContainerStyle={profileStyles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={profileStyles.statsContainer}>
            <View style={profileStyles.statBox}>
              <Ionicons name="time" size={40} color="#FF6F61" />
              <Text style={profileStyles.statLabel}>Tiempo sin fumar</Text>
              <Text style={profileStyles.statValue}>{timeWithoutSmoking ? formatTime(timeWithoutSmoking) : <Image source={loadGif} style={profileStyles.loader} />}</Text>
            </View>
            <View style={profileStyles.statBox}>
              <Ionicons name="logo-no-smoking" size={40} color="#059E9E" />
              <Text style={profileStyles.statLabel}>Cigarros fumados hoy</Text>
              <Text style={profileStyles.statValue}>{cigarettesSmokedToday !== null ? cigarettesSmokedToday : <Image source={loadGif} style={profileStyles.loader} />}</Text>
            </View>
          </View>
          <View style={profileStyles.statsContainer}>
            <View style={profileStyles.statBox}>
              <Ionicons name="checkmark-circle" size={40} color="#059E9E" />
              <Text style={profileStyles.statLabel}>Racha de días</Text>
              <Text style={profileStyles.statValue}>{streakDays ? `${streakDays} días` : <Image source={loadGif} style={profileStyles.loader} />}</Text>
            </View>
            <View style={profileStyles.statBox}>
              <Ionicons name="cash" size={40} color="#FF6F61" />
              <Text style={profileStyles.statLabel}>
                {monthlySavings >= 0 ? "Ahorro del mes" : "Dinero gastado"}
              </Text>
              <Text style={[profileStyles.statValue, monthlySavings < 0 && { color: "#FF0000" }]}>
                {monthlySavings ? `$${Math.abs(monthlySavings)}` : <Image source={loadGif} style={profileStyles.loader} />}
              </Text>
            </View>
          </View>
          <Animatable.Text animation="fadeIn" duration={1000} style={profileStyles.motivationalText}>
            {motivationalMessage}
          </Animatable.Text>
          <Text style={profileStyles.chartTitle}>Cigarros fumados últimos 7 días</Text>
          <View style={profileStyles.chartContainer}>
            <TouchableOpacity onPress={handleChartPress}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Svg height="130" width="18">
                  <SvgText
                    x="20"
                    y="100"
                    fill="white"
                    fontSize="12"
                    rotation="-90"
                    origin="10, 100"
                  >
                    N° de Cigarros
                  </SvgText>
                </Svg>
                <LineChart
                  data={last7DaysChartData}
                  width={screenWidth * 0.75} // Ajustar al ancho del statBox
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                  yAxisInterval={1}
                  yLabelsOffset={10}
                  segments={maxDataValue > 0 ? 3 : 1}
                  style={profileStyles.chart}
                  fromZero={true} // Start Y axis from zero
                  transparent={true} // Fondo transparente para el gráfico
                />
              </View>
            </TouchableOpacity>
            <Text style={profileStyles.chartInfo}>Toca el gráfico para más detalles</Text>
          </View>
        </ScrollView>
      </Animatable.View>
      <View style={profileStyles.navBar}>
        <TouchableOpacity style={profileStyles.navButton} onPress={() => router.push("./historial")}>
          <Ionicons name="calendar" size={24} color="#F2F2F2" />
        </TouchableOpacity>
        <TouchableOpacity style={profileStyles.circleButton} onPress={() => router.push("./dailyQuestionP1")}>
          <View style={profileStyles.circle}>
            <Ionicons name="add-outline" size={24} color="#F2F2F2" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={profileStyles.navButton} onPress={() => router.push("./cuenta")}>
          <Ionicons name="person" size={24} color="#F2F2F2" />
        </TouchableOpacity>
      </View>
      <FullMonthChart
        visible={isFullMonthChartVisible}
        onClose={() => setFullMonthChartVisible(false)}
        data={chartData}
      />
    </View>
  );
};

export default ProfileScreen;