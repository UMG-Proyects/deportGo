import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/user/action";
import axios from "../axios";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import Hom from "../components/Navigation";

export default function Login({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user.user);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState([]);

  const login = () => {
    setError([]);
    axios
      .post("login", form)
      .then(async ({ data }) => {
        dispatch(setUser(data.user));
        await SecureStore.setItemAsync("token", data.accesToken);
        // axios.defaults.headers.common["Authorization"] =
        //   "Bearer " + data.accesToken;
        navigation.navigate("hom");
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        // axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        axios
          .get("profile")
          .then(({ data }) => {
            dispatch(setUser(data.data));
            navigation.navigate("hom");
          })
          .catch(async () => {
            await SecureStore.deleteItemAsync("token");
          });
      }
    })();
  }, []);

  // Oculta la barra de navegación en esta pantalla
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#011627" barStyle="light-content" />
      <View
        style={{
          backgroundColor: "#fff",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            padding: 10,
            width: "90%",
            borderRadius: 10,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("../src/Image/logo.jpeg")} // Reemplaza con la ruta correcta de tu logo
              style={{
                width: 200,
                height: 200,
              }} // Ajusta el tamaño de la imagen según sea necesario
            />
          </View>
          <Text style={{ color: "red", fontSize: 16, marginTop: 5 }}>
            {error?.message ? error.message : ""}
          </Text>
          <View style={{ marginTop: 5 }}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="gray"
              onChangeText={(text) => {
                form.email = text;
              }}
              style={style.input}
            />
            <Text style={{ color: "red" }}>
              {error?.email ? error.email[0] : ""}
            </Text>
          </View>

          <View style={{ marginTop: 10 }}>
            <View style={style.passwordContainer}>
              <TextInput
                placeholder=" Password"
                placeholderTextColor="gray"
                secureTextEntry={!isPasswordVisible}
                onChangeText={(text) => setForm({ ...form, password: text })}
                style={style.passwordInput}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!isPasswordVisible)}
                style={style.eyeIcon}
              >
                <Icon
                  name={isPasswordVisible ? "visibility" : "visibility-off"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            <Text style={{ color: "red" }}>
              {error?.password ? error.password[0] : ""}
            </Text>
          </View>

          <View
            style={{ marginTop: 10, marginBottom: 10, alignItems: "center" }}
          >
            <TouchableOpacity
              onPress={() => {
                login();
              }}
              style={{ width: "90%" }}
            >
              <Text
                style={{
                  backgroundColor: "#2EC4B6",
                  color: "black",
                  fontWeight: "bold",
                  textAlign: "center",
                  borderRadius: 15,
                  padding: 10,
                }}
              >
                Iniciar Sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={style.footer}>
          <Text style={style.textFoot}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
            <Text style={[style.textFooter, style.link]}>Crear cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  input: {
    backgroundColor: "#EBF2F5",
    padding: 7,
    borderRadius: 15,
    borderColor: "#000",
    borderWidth: 1,
    height: 50,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF2F5",
    borderRadius: 15,
    borderColor: "#000",
    borderWidth: 1,
    height: 50,
  },
  eyeIcon: {
    padding: 10,
    position: "absolute",
    right: 0,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
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
