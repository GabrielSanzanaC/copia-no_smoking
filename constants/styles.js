import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  disabledContainer: {
    opacity: 0.1,
  },
  disabledText: {
    color: '#A9A9A9',
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1,
    backgroundColor: "#7595BF"
  },
  rectangle: {
    width: "90%",
    backgroundColor: "#072040",
    borderRadius: 20,
    padding: 20,
    boxShadow: "0px 2px 3.84px rgba(0,0,0,0.25)",
    elevation: 10,
    alignItems: "center",
  },
  centeredContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  titleText: {
    color: "#fff",
    fontSize: 22,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  input: {
    backgroundColor: "beige",
    color: "black",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    alignSelf: 'center',
    borderColor: "#059E9E",
    width: "100%",
  },
  inputError: {
    borderColor: "red",
    borderWidth: 2,
  },
  button: {
    backgroundColor: "#059E9E",
    padding: 15,
    borderRadius: 10,
    alignSelf: 'center',
    alignItems: "center",
    marginBottom: 15,
    elevation: 5,
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.3)',
    width: "80%",
  },
  buttonText: {
    color: "#F2F2F2",
    fontWeight: "bold",
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    margin: 5,
    width: '40%',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#05F89E', // Azul cuando selecciona una opción
  },
  optionText: {
    color: '#000',
    fontWeight: '500',
    textAlign: 'center',
  },
  switchButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  switchButtonText: {
    color: "#F2F2F2",
    textDecorationLine: "underline",
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  socialButton: {
    backgroundColor: "#1F82BF",
    padding: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  socialButtonText: {
    color: "#F2F2F2",
    fontWeight: "bold",
    fontSize: 14,
  },
  resultText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  resultAmount: {
    color: '#E3E34B',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  dropdown: {
    width: '100%',
    backgroundColor: '#fff',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
  },
  dropdownContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderColor: 'gray',
    borderWidth: 1,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkboxLabel: {
    color: "#F2F2F2",
    marginLeft: 10,
    fontSize: 14,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    padding: 10,
    width: "45%",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#FF6F61", // Color del botón
  },
  confirmButton: {
    backgroundColor: "#FF0000", // Botón de salir en color rojo
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export const accountStyles = StyleSheet.create({
  //cuenta
  container: {
    flex: 1,
    padding: 0,
    zIndex: -1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    position: "absolute",
    top: 10, // Fijo en la parte superior
    left: 20,
    right: 20,
    zIndex: 1, // Asegura que esté sobre otros elementos
    paddingHorizontal: 20,
  },
  profileTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "600",
    fontSize: 16,
  },
  card: {
    alignItems: "center",
    backgroundColor: "#072040",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 0, // Agregado para dar espacio desde la parte superior (debajo del header)
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)",
    elevation: 8,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#4F59FF",
    marginBottom: 10,
  },
  profileImagePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#ccc",
    marginBottom: 10,
  },
  cardText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  cardSubText: {
    color: "#B0C4DE",
    fontSize: 14,
    marginBottom: 10,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#059E9E",
    padding: 10,
    borderRadius: 8,
  },
  editButtonText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "600",
  },
  scrollContainer: {
    paddingBottom: 100,
    marginTop: 80, // Ajuste para dejar espacio debajo del header y card
  },
  stats: {
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "#072040",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)",
    elevation: 8,
  },
  statTitle: {
    color: "#B0C4DE",
    fontSize: 14,
    fontWeight: "600",
  },
  statValue: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  settingsButton: {
    backgroundColor: "#4F59FF",
    padding: 10,
    borderRadius: 30,
  },
  loader: {
    width: 30,
    height: 30,
  },
});

export const historialStyles = StyleSheet.create({
  //historial
  scrollToTopButton: {
    position: "absolute",
    bottom: 30,
    left: 20, // Mover el botón a la parte inferior izquierda
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollToTopText: {
    color: "#fff",
    fontSize: 20,
  },
  scrollToTopLabel: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#7595BF",
    position: "relative",
    zIndex: -1,
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "beige",
  },
  buttonText: {
    fontSize: 24,
    color: "beige",
  },
  list: {
    flexGrow: 0, // Para que la lista no crezca más de lo necesario
    width: "100%", // Asegura que ocupe el 100% del contenedor
  },  
  dayContainer: {
    width: 60,
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    elevation: 2,
    alignItems: "center",
    marginTop: 20,
  },
  selectedCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#059E9E",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -22.5 }, { translateY: -22.5 }, { rotate: "45deg" }],
  },
  dayText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00796b",
  },
  selectedDayText: {
    color: "#ffb300",
  },
  dayNameText: {
    fontSize: 14,
    color: "#00796b",
  },
  hasRecords: {
    borderColor: "#ffeb3b",
    borderWidth: 2,
  },
  recordIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ffeb3b",
    position: "absolute",
    bottom: 5,
    right: 5,
  },
  recordsContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
    elevation: 2,
    justifyContent: "center", // Centrar contenido verticalmente
    alignItems: "flex-start", // Centrar contenido horizontalmente
    minHeight: 50, // Altura mínima para el rectángulo
  },
  recordItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#e0f7fa",
  },
  recordNumber: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  recordInfo: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
    elevation: 2,
  },
  recordText: {
    fontSize: 16,
    color: "#555",
  },
});

export const profileStyles = StyleSheet.create({
  //perfil
  container: {
    flex: 1,
    backgroundColor: "#7595BF",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 30,
  },
  rectangle: {
    width: "90%",
    height: "70%",
    backgroundColor: "#072040",
    borderRadius: 20,
    padding: 20,
    paddingTop: 60,
    boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.4)",
    elevation: 10,
    alignItems: "center",
    marginBottom: 80,
  },
  welcomeText: {
    color: "#F2F2F2",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  scrollContentContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 20,
  },
  statsContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.3)",
    elevation: 5,
    width: "45%",
  },
  statLabel: {
    fontSize: 16,
    color: "#ccc",
    marginTop: 10,
    textAlign: "center",
  },
  statValue: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 5,
  },
  motivationalText: {
    fontSize: 20,
    color: "#FFD700",
    textAlign: "center",
    marginVertical: 20,
    fontStyle: "italic",
  },
  signOutButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FF6F61',
    padding: 10,
    borderRadius: 5,
  },
  loader: {
    width: 30,
    height: 30,
  },
  navBar: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  navButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 50,
  },
  circleButton: {
    backgroundColor: "#FF6F61",
    padding: 20,
    borderRadius: 50,
  },
  circle: {
    backgroundColor: '#FF6F61',
    borderRadius: 35,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    color: "#F2F2F2",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  chartContainer: {
    width: "60%",
    alignItems: "center",
  },
  chart: {
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)", // Fondo igual al de los cuadros de estadísticas
    marginLeft: -25, 
  },
  chartInfo: {
    fontSize: 12,
    color: "#F2F2F2",
    textAlign: "center",
    marginTop: 8,
  },
  navButtonLeft: {
    position: "absolute",
    top: 20, // Ajusta esto según lo necesites
    left: 10,
    backgroundColor: "#FF6F61",
    padding: 10,
    borderRadius: 50,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    padding: 10,
    width: "45%",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#FF6F61", // Color del botón
  },
  confirmButton: {
    backgroundColor: "#FF0000", // Botón de salir en color rojo
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export const settingsStyles = StyleSheet.create({
  //ajustes
  fullScreenContainer: {
    flex: 1, // Asegura que ocupe toda la pantalla
    justifyContent: 'flex-start', // Alinea el contenido en la parte superior
    zIndex: -1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerButton: {
    flexDirection: "row", // Para que el ícono y el texto estén en una fila
    alignItems: "center", // Centra verticalmente el ícono y el texto
  },
  headerText: {
    color: "white", // Color blanco para el texto
    fontSize: 18, // Tamaño de fuente
    marginLeft: 8, // Espacio entre el ícono y el texto
  },
  button: {
    borderWidth: 2, // Añadido el borde
    borderColor: "#ffffff", // Color del borde, puedes cambiarlo según tu preferencia
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#059E9E", // Verde para los botones
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  deleteButton: {
    borderWidth: 2, // Añadido el borde
    borderColor: "#ffffff", // Color del borde, puedes cambiarlo según tu preferencia
    backgroundColor: "#FF4D4D", // Botón de eliminar en rojo
  },
  signOutButton: {
    borderWidth: 2, // Añadido el borde
    borderColor: "#ffffff", // Color del borde, puedes cambiarlo según tu preferencia
    backgroundColor: "#FFA500", // Botón de cerrar sesión en naranja
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "bold",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#54DEAF", // Fondo de opciones más oscuro
    padding: 15,
    borderRadius: 10,
    borderWidth: 2, // Añadido el borde
    borderColor: "#ffffff", // Color del borde, puedes cambiarlo según tu preferencia
    marginBottom: 15,
  },
  optionText: {
    color: "white",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 14,
    marginVertical: 10,
  },
  closeButton: {
    backgroundColor: "#4CAF50", // Verde
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  versionText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
  },
});

 export const ResetPasswordScreenStyles = StyleSheet.create({
  //reestablecerContrasena
  backButton: {
    flexDirection: "row", // Para que el ícono y el texto estén en una fila
    alignItems: "center", // Centra verticalmente el ícono y el texto
    marginBottom: 20, // Espacio entre el botón y los otros elementos
  },
  backText: {
    color: "white", // Color blanco para el texto
    fontSize: 16, // Tamaño de fuente
    marginLeft: 8, // Espacio entre el ícono y el texto
  },
  container: {
    flex: 1,
    backgroundColor: "#7595BF",
    padding: 20,
    justifyContent: "center",
    zIndex: -1,
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#072040",
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#A9A9A9",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "beige",
    color: "black",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#059E9E",
    width: "100%",
  },
  actionButton: {
    backgroundColor: "#059E9E",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
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

