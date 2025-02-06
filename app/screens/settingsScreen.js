import React, { useState, useEffect, useRef } from "react";
import { settingsStylesheet, Text, View, TouchableOpacity, Alert, Switch, Modal, Animated, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { auth, db } from "../../FirebaseConfig";
import { doc, deleteDoc } from 'firebase/firestore';
import { signOut, deleteUser } from "firebase/auth";
import BackgroundShapes from '../../components/BackgroundShapes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { settingsStyles } from "../../constants/styles";
import theme from "../../constants/theme";

const SettingsScreen = () => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState("es");
  const [notifications, setNotifications] = useState(true);
  const [isPrivacyModalVisible, setPrivacyModalVisible] = useState(false);

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

  // Funciones
  const handlePasswordReset = () => {
    router.push("./reestablecerContrasena");
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Alert.alert("Cerraste sesión correctamente.");
      await AsyncStorage.removeItem('isLoggedIn'); // Eliminar estado de sesión
      await AsyncStorage.removeItem('userData');
      router.push("/");
    } catch (error) {
      Alert.alert("Error al cerrar sesión:", error.message);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (user) {
                // Eliminar el documento del usuario en Firestore
                const userDocRef = doc(db, "usuarios", user.uid);
                await deleteDoc(userDocRef);
  
                // Eliminar el usuario de la autenticación
                await deleteUser(user);
  
                Alert.alert("Tu cuenta ha sido eliminada.");
                router.push("/");
              }
            } catch (error) {
              Alert.alert("Error al eliminar la cuenta:", error.message);
            }
          },
        },
      ]
    );
  };

  const toggleDarkMode = async () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      AsyncStorage.setItem("isDarkMode", JSON.stringify(newMode)); // Guardar nuevo estado en AsyncStorage
      return newMode;
    });
  };

  const handleChangeLanguage = () => {
    const newLanguage = language === "es" ? "en" : "es";
    setLanguage(newLanguage);
    Alert.alert(`Idioma cambiado a ${newLanguage === "es" ? "Español" : "Inglés"}.`);
  };

  const toggleNotifications = () => {
    setNotifications((prev) => !prev);
    Alert.alert(`Notificaciones ${notifications ? "desactivadas" : "activadas"}.`);
  };

  const handleSupport = () => {
    router.push("./SupportScreen");
  };

  return (
    <View style={[settingsStyles.fullScreenContainer, isDarkMode ? theme.darkBackground : theme.lightBackground]}>
      {/* Animated Background */}
      <BackgroundShapesMemo />
      <ScrollView
        style={settingsStyles.container}
        contentContainerStyle={settingsStyles.contentContainer}
        showsVerticalScrollIndicator={false} // Esto hace que la barra de desplazamiento sea invisible
      >
        <View style={settingsStyles.header}>
          <TouchableOpacity onPress={() => router.push("./cuenta")} style={settingsStyles.headerButton}>
            <Ionicons name="arrow-back-outline" size={24} color="white" />
            <Text style={settingsStyles.headerText}>Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Cambiar contraseña */}
        <TouchableOpacity style={settingsStyles.button} onPress={handlePasswordReset}>
          <Ionicons name="lock-closed-outline" size={16} color="white" />
          <Text style={settingsStyles.buttonText}>Restablecer contraseña</Text>
        </TouchableOpacity>

        {/* Cambiar tema */}
        <View style={settingsStyles.option}>
          <Text style={settingsStyles.optionText}>Modo oscuro</Text>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </View>

        {/* Cambiar idioma */}
        <TouchableOpacity style={settingsStyles.button} onPress={handleChangeLanguage}>
          <Ionicons name="language-outline" size={16} color="white" />
          <Text style={settingsStyles.buttonText}>Cambiar idioma</Text>
        </TouchableOpacity>

        {/* Activar/Desactivar notificaciones */}
        <View style={settingsStyles.option}>
          <Text style={settingsStyles.optionText}>Notificaciones</Text>
          <Switch value={notifications} onValueChange={toggleNotifications} />
        </View>

        {/* Soporte técnico */}
        <TouchableOpacity style={settingsStyles.button} onPress={handleSupport}>
          <Ionicons name="help-circle-outline" size={16} color="white" />
          <Text style={settingsStyles.buttonText}>Soporte técnico</Text>
        </TouchableOpacity>

        {/* Mostrar políticas de privacidad */}
        <TouchableOpacity
          style={settingsStyles.button}
          onPress={() => setPrivacyModalVisible(true)}
        >
          <Ionicons name="document-text-outline" size={16} color="white" />
          <Text style={settingsStyles.buttonText}>Políticas de privacidad</Text>
        </TouchableOpacity>

        {/* Modal de políticas de privacidad */}
        <Modal
          visible={isPrivacyModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={settingsStyles.modalContainer}>
            <View style={settingsStyles.modalContent}>
              <Text style={settingsStyles.modalTitle}>Políticas de privacidad</Text>
              <Text style={settingsStyles.modalText}>
                Aquí van los detalles sobre cómo manejamos tus datos y respetamos
                tu privacidad.
              </Text>
              <TouchableOpacity
                style={settingsStyles.closeButton}
                onPress={() => setPrivacyModalVisible(false)}
              >
                <Text style={settingsStyles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Eliminar cuenta */}
        <TouchableOpacity
          style={[settingsStyles.button, settingsStyles.deleteButton]}
          onPress={handleDeleteAccount}
        >
          <Ionicons name="trash-outline" size={16} color="white" />
          <Text style={settingsStyles.buttonText}>Eliminar cuenta</Text>
        </TouchableOpacity>

        {/* Cerrar sesión */}
        <TouchableOpacity
          style={[settingsStyles.button, settingsStyles.signOutButton]}
          onPress={handleSignOut}
        >
          <Ionicons name="exit-outline" size={16} color="white" />
          <Text style={settingsStyles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>

        {/* Versión de la aplicación */}
        <Text style={settingsStyles.versionText}>Versión: 1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const BackgroundShapesMemo = React.memo(() => {
  return <BackgroundShapes />;
});



export default SettingsScreen;
