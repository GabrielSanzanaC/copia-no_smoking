import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { reauthenticateWithCredential, updatePassword, EmailAuthProvider } from "firebase/auth";
import BackgroundShapes from '../../components/BackgroundShapes';
import { auth } from "../../FirebaseConfig"; // Asegúrate de que 'auth' esté exportado correctamente
import { ResetPasswordScreenStyles } from "../../constants/styles";

const ResetPasswordScreen = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  // Animaciones de aparición
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(translateYAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleChangePassword = async () => {
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      alert("Contraseña actualizada exitosamente");
      router.push("./cuenta");
    } catch (error) {
      setError("Error al actualizar la contraseña. Verifica tus datos e intenta nuevamente.");
      console.error("Error al actualizar la contraseña: ", error);
    }
  };

  return (
    <View style={ResetPasswordScreenStyles.container}>
      {/* Animated Background */}
      <BackgroundShapesMemo />
      <TouchableOpacity onPress={() => router.push("./settingsScreen")} style={ResetPasswordScreenStyles.backButton}>
        <Ionicons name="arrow-back-outline" size={24} color="white" />
        <Text style={ResetPasswordScreenStyles.backText}>Volver</Text>
      </TouchableOpacity>
      <Animated.View
        style={[
          ResetPasswordScreenStyles.headerContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }],
          },
        ]}
      >
        <Text style={ResetPasswordScreenStyles.headerTitle}>Cambiar Contraseña</Text>
      </Animated.View>
      <Animated.View
        style={[
          ResetPasswordScreenStyles.formContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }],
          },
        ]}
      >
        {error ? <Text style={ResetPasswordScreenStyles.errorText}>{error}</Text> : null}
        <TextInput
          style={ResetPasswordScreenStyles.input}
          placeholder="Contraseña actual"
          placeholderTextColor="black"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          style={ResetPasswordScreenStyles.input}
          placeholder="Nueva contraseña"
          placeholderTextColor="black"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity style={ResetPasswordScreenStyles.actionButton} onPress={handleChangePassword}>
          <Text style={ResetPasswordScreenStyles.actionButtonText}>Actualizar contraseña</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );  
};

const BackgroundShapesMemo = React.memo(() => {
  return <BackgroundShapes />;
});



export default ResetPasswordScreen;
