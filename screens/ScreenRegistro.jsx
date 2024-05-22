import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "../axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/user/action";

export default function Register({ navigation }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState([]);

  const register = () => {
    setError([]);
    axios
      .post("register", form)
      .then(({ data }) => {
        dispatch(setUser(data.user));
        navigation.navigate("Login");
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 20, flex: 1, justifyContent: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Register</Text>
        <TextInput
          placeholder="Name"
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={form.password}
          onChangeText={(text) => setForm({ ...form, password: text })}
          style={styles.input}
        />
        <TouchableOpacity onPress={register} style={styles.button}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={{ color: "#2EC4B6", marginTop: 10 }}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#EBF2F5",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#2EC4B6",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
});
