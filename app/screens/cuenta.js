import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Animatable from "react-native-animatable";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { auth, db, storage } from "../../FirebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import BackgroundShapes from '../../components/BackgroundShapes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import loadGif from "../../assets/images/load.gif";  // Importar la imagen de carga
import { accountStyles } from "../../constants/styles";
import theme from "../../constants/theme";


const AccountDetailsScreen = () => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [state, setState] = useState({
    nombre: null,
    email: null,
    moneda: "CLP",
    totalCigarettesSmoked: 0,
    totalMoneySpentSinceSmoking: 0,
    totalMoneySpentSinceAccountCreation: 0,
    timeLostInDays: 0,
    timeLostInHours: 0,
    timeLostInMinutes: 0,
    photoURL: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setState(prevState => ({ ...prevState, email: user.email }));
        getUserData(user.uid);
        getTotalCigarettesSmoked(user.uid);
      } else {
        setState({
          nombre: "Usuario invitado",
          email: "No disponible",
          moneda: "CLP",
          totalCigarettesSmoked: 0,
          totalMoneySpentSinceSmoking: 0,
          totalMoneySpentSinceAccountCreation: 0,
          timeLostInDays: 0,
          timeLostInHours: 0,
          timeLostInMinutes: 0,
          photoURL: null,
        });
      }
    });
    return unsubscribe;
  }, []);

  // Cargar el modo oscuro desde AsyncStorage cuando la aplicación se inicia
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

  const getUserData = useCallback(async (uid) => {
    try {
      const q = query(collection(db, "usuarios"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setState(prevState => ({
          ...prevState,
          nombre: userData.nombre || "Usuario",
          moneda: userData.moneda || "CLP",
          photoURL: userData.photoURL,
    
        }));
      } else {
        setState(prevState => ({
          ...prevState,
          nombre: "Usuario desconocido"
        }));
      }
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        nombre: "Error al obtener datos"
      }));
    }
  }, []);

  const getTotalCigarettesSmoked = useCallback(async (uid) => {
    try {
      const userQuery = query(collection(db, "usuarios"), where("uid", "==", uid));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const cigaretteHistoryRef = collection(userDoc.ref, "CigaretteHistory");

        const cigaretteHistorySnapshot = await getDocs(cigaretteHistoryRef);

        let totalCigarettes = 0;
        let totalMoneySpent = 0;

        cigaretteHistorySnapshot.forEach((doc) => {
          const data = doc.data();
          totalCigarettes += data.cigarettesSmoked || 0;
          totalMoneySpent += (data.cigarettesSmoked || 0) * (data.pricePerCigarette || 0);
        });

        const timeLostInMinutesTotal = totalCigarettes * 7;
        const days = Math.floor(timeLostInMinutesTotal / 1440);
        const hours = Math.floor((timeLostInMinutesTotal % 1440) / 60);
        const minutes = timeLostInMinutesTotal % 60;

        setState(prevState => ({
          ...prevState,
          totalCigarettesSmoked: totalCigarettes,
          timeLostInDays: days,
          timeLostInHours: hours,
          timeLostInMinutes: minutes
        }));
      } else {
        console.log("Usuario no encontrado");
      }
    } catch (error) {
      console.error("Error al obtener cigarrillos fumados y dinero gastado:", error);
    }
  }, []);

  const getTotalMoneySpent = useCallback(async (userId) => {
    try {
      const userSnap = await getDocs(query(collection(db, "usuarios"), where("uid", "==", userId)));

      if (!userSnap.empty) {
        const userData = userSnap.docs[0].data();

        const yearsSmoking = parseInt(userData.añosFumando) || 0;
        const cigarettesPerDay = parseInt(userData.cigarrillosPorDía) || 0;
        const pricePerPack = parseFloat(userData.precioPorPaquete) || 0;
        const cigarettesPerPack = parseInt(userData.cigarrillosPorPaquete) || 1;

        if (!yearsSmoking || !cigarettesPerDay || !pricePerPack || !cigarettesPerPack) {
          console.warn("Faltan datos para calcular el gasto total.");
          return;
        }

        const totalSpentSinceSmoking = yearsSmoking * 365 * cigarettesPerDay * (pricePerPack / cigarettesPerPack);

        const cigaretteHistoryRef = collection(userSnap.docs[0].ref, "CigaretteHistory");
        const cigaretteHistorySnap = await getDocs(cigaretteHistoryRef);

        let totalSpentSinceAccountCreation = 0;

        cigaretteHistorySnap.forEach((doc) => {
          const data = doc.data();
          totalSpentSinceAccountCreation += (parseInt(data.cigarettesSmoked) || 0) * (pricePerPack / cigarettesPerPack);
        });

        setState(prevState => ({
          ...prevState,
          totalMoneySpentSinceSmoking: totalSpentSinceSmoking,
          totalMoneySpentSinceAccountCreation: totalSpentSinceAccountCreation
        }));
      }
    } catch (error) {
      console.error("Error al calcular el gasto total:", error);
    }
  }, []);

  useEffect(() => {
    if (auth.currentUser) {
      getTotalMoneySpent(auth.currentUser.uid);
    }
  }, [getTotalMoneySpent]);

  const handlePhotoPick = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  }, []);

  const uploadImage = useCallback(async (uri) => {
    const user = auth.currentUser;
    try {
      const userRef = doc(db, "usuarios", user.uid);
      const blob = await fetch(uri).then((res) => res.blob());
      const photoRef = ref(storage, `profile_pictures/${user.uid}.jpg`);

      await uploadBytes(photoRef, blob);
      const newPhotoURL = await getDownloadURL(photoRef);

      await updateDoc(userRef, { photoURL: newPhotoURL });
      setState(prevState => ({
        ...prevState,
        photoURL: newPhotoURL
      }));
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  }, []);

  useEffect(() => {
    if (state.photoURL) {
      console.log("URL de la foto que se está mostrando:", state.photoURL);
    }
  }, [state.photoURL]);

  const formatMoney = useCallback((amount) => {
    return new Intl.NumberFormat("es-CL", { style: "currency", currency: state.moneda }).format(amount);
  }, [state.moneda]);

  return (
    <View style={[accountStyles.container, isDarkMode ? theme.darkBackground : theme.lightBackground]}>
      {/* Animated Background */}
      <BackgroundShapesMemo />

      <Animatable.View animation="fadeInDown" duration={800} style={accountStyles.header}>
        <View style={accountStyles.profileTextContainer}>
          <TouchableOpacity onPress={() => router.push("./ProfileScreen")} style={accountStyles.profileButton}>
            <Ionicons name="arrow-back-outline" size={24} color="white" />
            <Text style={accountStyles.profileText}>Inicio</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => router.push("./settingsScreen")} style={accountStyles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
      </Animatable.View>

      <ScrollView contentContainerStyle={accountStyles.scrollContainer} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <Animatable.View animation="zoomIn" duration={1000} style={accountStyles.card}>
          {/* Mostrar imagen de perfil */}
          {state.photoURL ? (
            <Image source={{ uri: `${state.photoURL}?ts=${Date.now()}` }} style={accountStyles.profileImage} />
          ) : (
            <View style={accountStyles.profileImagePlaceholder} />
          )}
          <Text style={accountStyles.cardText}>{state.nombre || "Cargando..."}</Text>
          <Text style={accountStyles.cardSubText}>{state.email || "Cargando..."}</Text>
          <TouchableOpacity style={accountStyles.editButton} onPress={handlePhotoPick}>
            <Ionicons name="camera-outline" size={16} color="white" />
            <Text style={accountStyles.editButtonText}>Cambiar foto</Text>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={200} duration={800} style={accountStyles.stats}>
          <Animatable.View animation="bounceIn" delay={300} style={accountStyles.statCard}>
            <Text style={accountStyles.statTitle}>Cigarrillos fumados</Text>
            <Text style={accountStyles.statValue}>{state.totalCigarettesSmoked}</Text>
          </Animatable.View>
          <Animatable.View animation="bounceIn" delay={400} style={accountStyles.statCard}>
            <Text style={accountStyles.statTitle}>Dinero gastado desde que comenzó a fumar</Text>
            <Text style={accountStyles.statValue}>{formatMoney(state.totalMoneySpentSinceSmoking)}</Text>
          </Animatable.View>
          <Animatable.View animation="bounceIn" delay={600} style={accountStyles.statCard}>
            <Text style={accountStyles.statTitle}>Dinero gastado desde la creación de la cuenta</Text>
            <Text style={accountStyles.statValue}>{formatMoney(state.totalMoneySpentSinceAccountCreation)}</Text>
          </Animatable.View>
          <Animatable.View animation="bounceIn" delay={500} style={accountStyles.statCard}>
            <Text style={accountStyles.statTitle}>Tiempo de vida perdido</Text>
            <Text style={accountStyles.statValue}>{state.timeLostInDays} días, {state.timeLostInHours} horas y {state.timeLostInMinutes} minutos</Text>
          </Animatable.View>
        </Animatable.View>
      </ScrollView>
    </View>
  );
};

const BackgroundShapesMemo = React.memo(() => {
  return <BackgroundShapes />;
});

export default AccountDetailsScreen;