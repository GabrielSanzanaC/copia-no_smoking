// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const { API_KEY } = require('./config');
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "app-nosmoking.firebaseapp.com",
  projectId: "app-nosmoking",
  storageBucket: "app-nosmoking.firebasestorage.app",
  messagingSenderId: "571745550303",
  appId: "1:571745550303:web:16a804fc73467d9f160e6a",
  measurementId: "G-MDD41D6QB8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app);
export const db = getFirestore(app);
export const logout = signOut(auth);
export const storage = getStorage(app);

// Function to register user
export const registerUser = async (nombre: string, email: string, password: string) => {
  try {
    // Step 1: Register user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Step 2: Save additional user info in Firestore
    const docRef = await addDoc(collection(db,"usuarios"), {
      uid: user.uid, // Associate Firestore data with Authentication user
      nombre: nombre,
    });

    console.log("Usuario registrado con ID: ", docRef.id);
  } catch (e) {
    console.error("Error registrando usuario: ", e);
  }
};

// Function to login user
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (e) {
    console.error("Error logging in user: ", e);
    throw e;
  }
};
