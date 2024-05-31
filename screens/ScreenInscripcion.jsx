import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

const InscripcionScreen = () => {
  const route = useRoute();
  const { id, nombre } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Screen Inscripción</Text>
      <Text style={styles.text}>ID del Evento: {id}</Text>
      <Text style={styles.text}>Nombre del Evento: {nombre}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000067", // El color azul proporcionado
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
});

export default InscripcionScreen;
