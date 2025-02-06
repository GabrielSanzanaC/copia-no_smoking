import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../FirebaseConfig";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import * as Animatable from "react-native-animatable";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from "@expo/vector-icons";
import BackgroundShapes from '../components/BackgroundShapes';
import { styles } from "../constants/styles";
import { validateEmail, validatePassword, validateUser } from "../components/Validation"

WebBrowser.maybeCompleteAuthSession();

const initialState = {
  email: "",
  user: "",
  password: "",
  error: "",
  userError: false,
  emailError: false,
  passwordError: false,
  rememberMe: false,
};

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState(initialState);
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);

  /*const [request, response, promptAsync] = Google.useAuthRequest({
    //expoClientId: 'YOUR_EXPO_CLIENT_ID',
    //iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: '571745550303-6485sga5adgjg24a48ijrdite1nf9mic.apps.googleusercontent.com',
    webClientId: '571745550303-84m79of6kn1vqd6g8i3jik57l183vla4.apps.googleusercontent.com',
    redirectUri: 'https://app-nosmoking.firebaseapp.com/__/auth/handler',
  });*/

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loggedIn = await AsyncStorage.getItem("isLoggedIn");
        const userData = await AsyncStorage.getItem("userData");
  
        if (loggedIn === "true" && userData) {
          const { email, password } = JSON.parse(userData);
          setFormData((prevState) => ({
            ...prevState,
            email,
            password,
            rememberMe: true,
          }));
          await signInWithEmailAndPassword(auth, email, password);
          router.push({ pathname: "./screens/ProfileScreen" });
        }
      } catch (err) {
        console.error("Error during auto login:", err);
      }
    };
  
    checkLoginStatus();
  }, []);

  /*useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;

      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          const user = userCredential.user;
          // Guardar estado de sesión y datos del usuario
          AsyncStorage.setItem("isLoggedIn", "true");
          AsyncStorage.setItem(
            "userData",
            JSON.stringify({ email: user.email, uid: user.uid })
          );
          router.push("./screens/ProfileScreen");
        })
        .catch((error) => {
          Alert.alert("Error", error.message);
        });
    }
  }, [response]);*/

  const handleLogin = async () => {
    const { email, password } = formData;
    if (!validateEmail(email, setFormData) || !validatePassword(password, setFormData)) {
      setIsModalVisible(true)
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setFormData((prevState) => ({ ...prevState, error: "" }));
      setIsModalVisible(false)
      router.push("./screens/ProfileScreen");
    } catch (err: any) {
      let errorMessage = "Hubo un problema al iniciar sesión.";
      console.log("Firebase Auth Error:", err.code);
      if ((err as any).code === "auth/user-not-found") {
        errorMessage = "No se encontró un usuario con este correo.";
      } else if ((err as any).code === "auth/wrong-password") {
        errorMessage = "Contraseña incorrecta.";
      } else if ((err as any).code === "auth/invalid-credential") {
        errorMessage = "No se encontró un usuario con este correo o la contraseña es incorrecta.";
      }
      setFormData((prevState) => ({ ...prevState, error: errorMessage }));
      setIsModalVisible(true)
    }
  };

  const handleContinue = async () => {
    const { email, password, user } = formData;

    if (!validateUser(user, setFormData)) {
      setIsModalVisible(true)
      return;
    } 

    if (!validateEmail(email, setFormData) || !validatePassword(password, setFormData)) {
      setIsModalVisible(true)
      return;
    }

    try {
      const usersCollection = collection(db, "usuarios");
      const emailQuery = query(usersCollection, where("email", "==", email));
      const querySnapshot = await getDocs(emailQuery);

      if (!querySnapshot.empty) {
        setFormData((prevState) => ({ ...prevState, error: "El correo ya está registrado. Usa otro correo." }));
        setIsModalVisible(true)
        return;
      }

      const userProfile = JSON.stringify({ user, email, password });

      setFormData((prevState) => ({ ...prevState, error: "" }));
      router.push({
        pathname: '/screens/CreateAccountScreen',
        params: { userProfile },
      });
    } catch (err) {
      setFormData((prevState) => ({ ...prevState, error: "Hubo un problema al registrar el usuario." }));
      console.error(err);
    }
  };

  const handleTabChange = (isLoginTab: boolean | ((prevState: boolean) => boolean)) => {
    setIsLogin(isLoginTab);
    setIsModalVisible(false)
    setFormData((prevState) => ({
      ...prevState,
      error: "",
      userError: false,
      emailError: false,
      passwordError: false,
    }));
  };

  const handleKeyPress = (event: { nativeEvent: { key: string; }; }) => {
    if (event.nativeEvent.key === 'Enter') {
      Keyboard.dismiss();
      if (isLogin) {
        handleLogin();
      } else {
        handleContinue();
      }
    }
  };

  const handleRememberMeChange = async () => {
    setFormData((prevState) => ({ ...prevState, rememberMe: !prevState.rememberMe }));
    const { rememberMe, email, password } = formData;
    if (!rememberMe) {
      await AsyncStorage.setItem("isLoggedIn", "true");
      await AsyncStorage.setItem("userData", JSON.stringify({ email, password }));
    } else {
      await AsyncStorage.setItem("isLoggedIn", "false");
      await AsyncStorage.removeItem('userData');
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundShapesMemo />
      <Animatable.View animation="fadeIn" style={styles.rectangle}>
        <Animatable.View animation="zoomIn" style={styles.centeredContainer}>
          <Ionicons name="logo-no-smoking" size={50} color="#F2F2F2" />
          <Animatable.Text animation="bounceIn" style={styles.titleText}>
            ¡Bienvenido a Deja de Fumar!
          </Animatable.Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" style={styles.formContainer}>
          {!isLogin && (
            <>
              <Text style={styles.label}>Nombre de usuario</Text>
              <TextInput
                style={[styles.input, formData.userError && styles.inputError]}
                value={formData.user}
                onChangeText={(text) => setFormData((prevState) => ({ ...prevState, user: text }))}
              />
            </>
          )}
          
          <Animatable.View animation="slideInRight">
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={[styles.input, formData.emailError && styles.inputError]}
              value={formData.email}
              onChangeText={(text) => setFormData((prevState) => ({ ...prevState, email: text }))}
            />
          </Animatable.View>
          
          <Animatable.View animation="slideInLeft">
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={[styles.input, formData.passwordError && styles.inputError]}
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => setFormData((prevState) => ({ ...prevState, password: text }))}
            />
          </Animatable.View>

          {formData.error ? <Text style={styles.errorText}>{formData.error}</Text> : null}

          {isLogin && (
            <Animatable.View animation="fadeIn" style={[styles.checkboxContainer, !formData.email.trim() || !formData.password.trim() ? styles.disabledContainer : null]}>
              <Checkbox
                value={formData.rememberMe}
                onValueChange={handleRememberMeChange}
                color={formData.rememberMe ? "#FF6F61" : "#B0B0B0"}
                disabled={!formData.email.trim() || !formData.password.trim()}
              />
              <Text style={[styles.checkboxLabel, !formData.email.trim() || !formData.password.trim() ? styles.disabledText : null]}>Recuérdame</Text>
            </Animatable.View>
          )}
          <Animatable.View animation="zoomIn">
            <TouchableOpacity
              style={styles.button}
              onPress={isLogin ? handleLogin : handleContinue}
            >
              <Text style={styles.buttonText}>
                {isLogin ? "Iniciar Sesión" : "Registrarse"}
              </Text>
            </TouchableOpacity>
          </Animatable.View>
          <Animatable.View animation="fadeInUp">
            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => handleTabChange(!isLogin)}
            >
              <Text style={styles.switchButtonText}>
                {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
              </Text>
            </TouchableOpacity>
          </Animatable.View>
          <Animatable.View animation="bounceIn" style={styles.socialButtons}>
            <TouchableOpacity
              style={styles.socialButton}
              //onPress={() => promptAsync()}
              //disabled={!request}
            >
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
          </Animatable.View>
        </Animatable.View>
      </Animatable.View>
    </View>
  );
};

const BackgroundShapesMemo = React.memo(() => {
  return <BackgroundShapes />;
});

export default App;