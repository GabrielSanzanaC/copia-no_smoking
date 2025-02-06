export const validateEmail = (email, setFormData) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setFormData((prevState) => ({
        ...prevState,
        emailError: true,
        error: "El correo no puede estar vacío.",
      }));
      return false;
    } else if (!emailRegex.test(email)) {
      setFormData((prevState) => ({
        ...prevState,
        emailError: true,
        error: "El formato del correo no es válido.",
      }));
      return false;
    } else {
      setFormData((prevState) => ({
        ...prevState,
        emailError: false,
      }));
      return true;
    }
  };
  
  export const validatePassword = (password, setFormData) => {
    if (!password.trim()) {
      setFormData((prevState) => ({
        ...prevState,
        passwordError: true,
        error: "La contraseña no puede estar vacía.",
      }));
      return false;
    } else if (password.length < 6) {
      setFormData((prevState) => ({
        ...prevState,
        passwordError: true,
        error: "La contraseña debe tener al menos 6 caracteres.",
      }));
      return false;
    } else {
      setFormData((prevState) => ({
        ...prevState,
        passwordError: false,
      }));
      return true;
    }
  };
  
  export const validateUser = (user, setFormData) => {
    if (!user.trim()) {
      setFormData((prevState) => ({
        ...prevState,
        userError: true,
        error: "El nombre de usuario no puede estar vacío.",
      }));
      return false;
    }
    else {
      setFormData((prevState) => ({
        ...prevState,
        userError: false,
      }));
      return true;
    }
  };