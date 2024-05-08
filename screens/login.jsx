import React, { useEffect, useState } from "react";
import {
  View,
  Text,
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

export default function Login({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user.user);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState([]);

  const login = () => {
    setError([]);
    axios
      .post("login", form)
      .then(async ({ data }) => {
        dispatch(setUser(data.user));
        await SecureStore.setItemAsync("token", data.accesToken);
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + data.accesToken;
        navigation.navigate("home");
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        axios
          .get("profile")
          .then(({ data }) => {
            dispatch(setUser(data.data));
            navigation.navigate("home");
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
          backgroundColor: "#011627",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 10,
            width: "80%",
            borderRadius: 10,
          }}
        >
          <View style={{ marginTop: 10, alignItems: "center" }}>
            <Text style={{ fontSize: 20 }}>Login</Text>
          </View>
          <Text style={{ color: "red", fontSize: 16, marginTop: 5 }}>
            {error?.message ? error.message : ""}
          </Text>
          <View style={{ marginTop: 10 }}>
            <Text>Email</Text>
            <TextInput
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
            <Text>Password</Text>
            <TextInput
              onChangeText={(text) => {
                form.password = text;
              }}
              secureTextEntry={true}
              style={style.input}
            />

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
              style={{ width: "70%" }}
            >
              <Text
                style={{
                  backgroundColor: "#2EC4B6",
                  color: "black",
                  textAlign: "center",
                  borderRadius: 10,
                  padding: 5,
                }}
              >
                Iniciar Sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  input: {
    backgroundColor: "#EBF2F0",
    padding: 7,
    borderRadius: 6,
  },
});
