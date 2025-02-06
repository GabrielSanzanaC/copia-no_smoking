import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from "expo-router";
import { GuardarUsuario } from "../../components/GuardarUsuario";
import DropDownPicker from 'react-native-dropdown-picker';
import BackgroundShapes from '../../components/BackgroundShapes';
import { styles } from "../../constants/styles";
import countryCurrencyOptions from '../../components/CountriesData';

export default function CreateAccountScreen() {
  const router = useRouter();
  const { userProfile } = useLocalSearchParams();
  const { user, email, password } = JSON.parse(userProfile);
  const [reasons, setReasons] = useState([]);
  const [age, setAge] = useState('');
  const [yearsSmoking, setYearsSmoking] = useState('');
  const [cigarettesPerDay, setCigarettesPerDay] = useState('');
  const [cigarettesPerPack, setCigarettesPerPack] = useState('');
  const [packPrice, setPackPrice] = useState('');
  const [currency, setCurrency] = useState(''); // Estado para la moneda
  const [questionStep, setQuestionStep] = useState(1);
  const [yearlySavings, setYearlySavings] = useState(null);
  const [cigarettesPerYear, setCigarettesPerYear] = useState(null);
  const [open, setOpen] = useState(false); // Estado para el dropdown
  const [isEffectExecuted, setIsEffectExecuted] = useState(false);
  const [loading, setLoading] = useState(false); // Estado para controlar el botón


  const toggleReason = (option) => {
    if (reasons.includes(option)) {
      setReasons(reasons.filter(reason => reason !== option));
    } else {
      setReasons([...reasons, option]);
    }
  };

  const handleContinue = () => {
    if (questionStep === 1) {
      if (!currency) {
        Alert.alert('Por favor, seleccione un tipo de moneda.');
        return;
      }
      setQuestionStep(2); // Pasar a la siguiente pregunta
    } else if (questionStep === 2) {
      if (reasons.length === 0) {
        Alert.alert('Por favor, elige al menos una razón para dejar de fumar.');
        return;
      }
      setQuestionStep(3); // Pasar a la siguiente pregunta
    } else if (questionStep === 3) {
      if (!age || !yearsSmoking) {
        Alert.alert('Por favor, ingrese tanto su edad como los años fumando.');
        return;
      }
      if (isNaN(age) || isNaN(yearsSmoking)) {
        Alert.alert('Por favor, ingrese números válidos.');
        return;
      }
      if (parseInt(yearsSmoking) > parseInt(age)) {
        Alert.alert('Los años fumando no pueden ser mayores que su edad.');
        return;
      }
      setQuestionStep(4); // Pasar a la siguiente pregunta
    } else if (questionStep === 4) {
      if (!cigarettesPerDay || isNaN(cigarettesPerDay)) {
        Alert.alert('Por favor, ingrese un número válido de cigarrillos al día.');
        return;
      }
      setQuestionStep(5); // Pasar a la siguiente pregunta
    } else if (questionStep === 5) {
      if (!cigarettesPerPack || isNaN(cigarettesPerPack)) {
        Alert.alert('Por favor, ingrese un número válido de cigarrillos por cajetilla.');
        return;
      }
      setQuestionStep(6); // Pasar a la siguiente pregunta
    } else if (questionStep === 6) {
      if (!packPrice || isNaN(packPrice)) {
        Alert.alert('Por favor, ingrese un precio válido de la cajetilla.');
        return;
      }

      // Calcular el ahorro y los cigarrillos dejados de fumar
      const totalCigarettesPerYear = parseInt(cigarettesPerDay) * 365;
      const totalPacksPerYear = totalCigarettesPerYear / parseInt(cigarettesPerPack);
      const yearlySavingsAmount = totalPacksPerYear * parseFloat(packPrice);
      const totalCigarettesSaved = totalCigarettesPerYear;

      setYearlySavings(yearlySavingsAmount.toFixed(2)); // Guardamos el ahorro anual calculado
      setCigarettesPerYear(totalCigarettesSaved); // Guardamos la cantidad de cigarrillos ahorrados

      setQuestionStep(7); // Mostrar resumen del ahorro
    }
  };

  const handleFinish = async () => {
    if (loading) return;
    setLoading(true);    
    try {
      await GuardarUsuario({
        email,
        password,
        user,
        reasons, // Pasar el arreglo de razones
        age,
        yearsSmoking,
        cigarettesPerDay,
        cigarettesPerPack,
        packPrice,
        currency // Guardar también el tipo de moneda
      });
      router.push('./ProfileScreen'); // Redirigir a la pantalla de perfil
    } catch (err) {
      // Manejar el error si algo falla en la función GuardarUsuario
      console.error('Error al guardar el usuario:', err);
      Alert.alert('Ocurrió un error al guardar los datos. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    const options = { style: 'currency', currency };
    return new Intl.NumberFormat('es-CL', options).format(amount);
  };

  useEffect(() => {
    if (!isEffectExecuted) {
      // Si el efecto no se ha ejecutado aún
      setIsEffectExecuted(true); // Marcamos que el efecto ha sido ejecutado
      // Aquí puedes colocar la lógica para animaciones o efectos que solo quieras ejecutar una vez
    }
  }, [isEffectExecuted]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <BackgroundShapesMemo />
        
        {questionStep === 1 && (
          <View style={styles.centeredContainer}>
            <Text style={styles.titleText}>Seleccione su país y tipo de moneda</Text>
            <DropDownPicker
              open={open}
              value={currency}
              items={countryCurrencyOptions}
              setOpen={setOpen}
              setValue={setCurrency}
              setItems={() => {}}
              placeholder="Seleccione un país y moneda..."
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>
        )}

        {questionStep === 2 && (
          <View style={styles.centeredContainer}>
            <Text style={styles.titleText}>¿Por qué quieres dejar de fumar?</Text>
            <View style={styles.optionsContainer}>
              {['Mi salud', 'Mi familia', 'Mejorar mi condición física', 'Ahorrar dinero', 'Mejorar mi respiración', 'Aumentar mi energía'].map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.optionButton, reasons.includes(option) && styles.selectedOption]}
                  onPress={() => toggleReason(option)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {questionStep === 3 && (
          <View style={styles.centeredContainer}>
            <Text style={styles.titleText}>¿Cuántos años tienes?</Text>
            <TextInput
              style={styles.input}
              placeholder="Edad"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
            />
            <Text style={styles.titleText}>¿Cuántos años llevas fumando?</Text>
            <TextInput
              style={styles.input}
              placeholder="Años fumando"
              keyboardType="numeric"
              value={yearsSmoking}
              onChangeText={setYearsSmoking}
            />
          </View>
        )}

        {questionStep === 4 && (
          <View style={styles.centeredContainer}>
            <Text style={styles.titleText}>¿Cuántos cigarrillos fumas al día?</Text>
            <TextInput
              style={styles.input}
              placeholder="Cigarrillos al día"
              keyboardType="numeric"
              value={cigarettesPerDay}
              onChangeText={setCigarettesPerDay}
            />
          </View>
        )}

        {questionStep === 5 && (
          <View style={styles.centeredContainer}>
            <Text style={styles.titleText}>¿Cuántos cigarrillos tenía la cajetilla?</Text>
            <TextInput
              style={styles.input}
              placeholder="Cigarrillos por cajetilla"
              keyboardType="numeric"
              value={cigarettesPerPack}
              onChangeText={setCigarettesPerPack}
            />
          </View>
        )}

        {questionStep === 6 && (
          <View style={styles.centeredContainer}>
            <Text style={styles.titleText}>¿Cuánto costaba la cajetilla?</Text>
            <TextInput
              style={styles.input}
              placeholder="Precio de la cajetilla ($)"
              keyboardType="numeric"
              value={packPrice}
              onChangeText={setPackPrice}
            />
          </View>
        )}

        {questionStep === 7 && (
          <View style={styles.centeredContainer}>
            <Text style={styles.titleText}>¡Felicidades por dar el primer paso!</Text>
            <Text style={styles.resultText}>
              Si dejas de fumar, podrías ahorrar aproximadamente:
            </Text>
            <Text style={styles.resultAmount}>{formatCurrency(yearlySavings)} al año</Text>
            <Text style={styles.resultText}>¡Eso es un gran ahorro!</Text>
            <Text style={styles.resultText}>
              Además, dejarías de fumar aproximadamente {cigarettesPerYear} cigarrillos al año.
            </Text>
          </View>
        )}
        <TouchableOpacity style={styles.button} onPress={questionStep === 7 ? handleFinish : handleContinue}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{questionStep === 7 ? 'Ir a Perfil' : 'Continuar'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const BackgroundShapesMemo = React.memo(() => {
  return <BackgroundShapes />;
});