import React, { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import API_URL from "../src/config/config";

export default function Registro({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState({});

  const handleRegister = () => {
    const userData = {
      name,
      email,
      password,
    };

    fetch(`${API_URL}register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.acces_token) {
          Alert.alert("Registro exitoso", "Usuario registrado correctamente");
          navigation.navigate("login");
        } else {
          setError(data);
        }
      })
      .catch((error) => {
        Alert.alert(
          "Error en el registro",
          "Algo salió mal. Inténtalo de nuevo.",
          console.log(error),
        );
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#011627" barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../src/Image/logo.jpeg")}
              style={styles.logo}
            />
          </View>
          <Text style={styles.errorText}>
            {error?.message ? error.message : ""}
          </Text>
          <TextInput
            placeholder="Nombre"
            placeholderTextColor="gray"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <Text style={styles.errorText}>
            {error?.name ? error.name[0] : ""}
          </Text>
          <TextInput
            placeholder="Correo electrónico"
            placeholderTextColor="gray"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
          />
          <Text style={styles.errorText}>
            {error?.email ? error.email[0] : ""}
          </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="gray"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
              style={styles.passwordInput}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!isPasswordVisible)}
              style={styles.eyeIcon}
            >
              <Icon
                name={isPasswordVisible ? "visibility" : "visibility-off"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.errorText}>
            {error?.password ? error.password[0] : ""}
          </Text>
          <TouchableOpacity
            onPress={handleRegister}
            style={styles.registerButton}
          >
            <Text style={styles.registerButtonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Text style={styles.textFoot}>¿Ya tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("login")}>
            <Text style={[styles.textFooter, styles.link]}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    padding: 10,
    width: "90%",
    borderRadius: 10,
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 5,
  },
  input: {
    backgroundColor: "#EBF2F5",
    padding: 7,
    borderRadius: 15,
    borderColor: "#000",
    borderWidth: 1,
    height: 50,
    marginTop: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF2F5",
    borderRadius: 15,
    borderColor: "#000",
    borderWidth: 1,
    height: 50,
    marginTop: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 7,
  },
  eyeIcon: {
    padding: 10,
    position: "absolute",
    right: 0,
  },
  registerButton: {
    backgroundColor: "#2EC4B6",
    borderRadius: 15,
    padding: 10,
    marginTop: 20,
    width: "90%",
    alignSelf: "center",
  },
  registerButtonText: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  textFooter: {
    color: "#2EC4B6",
    fontSize: 15,
    fontWeight: "bold",
  },
  textFoot: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
  link: {
    textDecorationLine: "underline",
    marginLeft: 5,
  },
});
