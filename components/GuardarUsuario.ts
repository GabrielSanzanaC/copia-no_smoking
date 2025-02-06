import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, addDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "../FirebaseConfig";

interface GuardarUsuarioProps {
  email: string;
  password: string;
  user: string;
  reasons: string[]; // Cambiado a un arreglo de motivos
  age: number;
  yearsSmoking: number;
  cigarettesPerDay: number;
  cigarettesPerPack: number;
  packPrice: number;
}

export const GuardarUsuario = async ({ email, password, user, reasons, age, yearsSmoking, cigarettesPerDay, cigarettesPerPack, packPrice }: GuardarUsuarioProps): Promise<void> => {
  try {
    // Crear usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Guardar información del usuario en Firestore
    await setDoc(doc(db, "usuarios", uid), {
      uid: uid,
      nombre: user,
      email: email,
      edad: age,
      añosFumando: yearsSmoking,
      cigarrillosPorDía: cigarettesPerDay,
      cigarrillosPorPaquete: cigarettesPerPack,
      precioPorPaquete: packPrice,
    });

    // Crear subcolección Motivos dentro del documento del usuario
    await addDoc(collection(db, "usuarios", uid, "Motivos"), { motivos: reasons });
    
     // Crear subcolección TiempoSinFumar e inicializar con tiempo en 0
     await addDoc(collection(db, "usuarios", uid, "TiempoSinFumar"), {
      ultimoRegistro: Timestamp.now(),
    });

  } catch (err: unknown) {
    if (err instanceof Error) {
      // Lanza errores específicos según el tipo
      const errorMessage = (err as any).code === "auth/email-already-in-use"
        ? "El correo electrónico ya está registrado."
        : (err as any).code === "auth/invalid-email"
        ? "El correo electrónico no es válido."
        : (err as any).code === "auth/weak-password"
        ? "La contraseña es demasiado débil. Debe tener al menos 6 caracteres."
        : "Hubo un problema al registrar la cuenta.";

      console.error(errorMessage);
      throw new Error(errorMessage);
    } else {
      console.error("Error desconocido:", err);
      throw new Error("Ocurrió un error inesperado.");
    }
  }
};