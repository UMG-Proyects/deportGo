import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import API_URL from "../src/config/config";

export default function CalendarioScreen() {
  const [equipos, setEquipos] = useState([]);
  const [deportes, setDeportes] = useState([]);
  const [arbitros, setArbitros] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePickerInicio, setShowDatePickerInicio] = useState(false);
  // const [partidos, setPartidos] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredPartidos, setFilteredPartidos] = useState([]);
  const [partido, setPartido] = useState({
    id_arbitro: "",
    id_equipo1: "",
    id_equipo2: "",
    id_deportes: "",
    fecha: "",
    hora: "",
    direccion: "",
    resultadoA: "",
    resultadoB: "",
    Cancha: "",
  });

  useEffect(() => {
    fetchEquipos();
    fetchDeportes();
    fetchArbitros();
  }, []);

  const fetchEquipos = async () => {
    try {
      const response = await fetch(`${API_URL}listarEquipo`);
      const data = await response.json();
      setEquipos(data);
    } catch (error) {
      console.error("Error fetching equipos:", error);
    }
  };

  const fetchDeportes = async () => {
    try {
      const response = await fetch(`${API_URL}listarDeportes`);
      const data = await response.json();
      setDeportes(data);
    } catch (error) {
      console.error("Error fetching deportes:", error);
    }
  };

  const fetchArbitros = async () => {
    try {
      const response = await fetch(`${API_URL}listarArbitro`);
      const data = await response.json();
      setArbitros(data);
    } catch (error) {
      console.error("Error fetching arbitros:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}crearCalendario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(partido),
      });
      const data = await response.json();
      console.log(data);
      if (data.status) {
        Alert.alert("Éxito", "Partido creado exitosamente");
        setModalVisible(false);
        // Refresh your partido list if necessary
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("Error saving partido:", error);
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };

  const handlePickerChange = (key, value) => {
    setPartido((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (key, event, date) => {
    setShowDatePickerInicio(false);
    if (date) {
      const formattedDate = date.toISOString().split("T")[0]; // Format YYYY-MM-DD
      setPartido((prev) => ({ ...prev, [key]: formattedDate }));
    }
  };

  useEffect(() => {
    fetchPartidos();
  }, []);

  const fetchPartidos = async () => {
    try {
      const response = await fetch(`${API_URL}listarCalendario`);
      const json = await response.json();
      console.log("Full server response:", json); // Ensure this is logging the expected data

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      if (!json.calendario || json.calendario.length === 0) {
        throw new Error("No calendario data");
      }

      setPartido(json.calendario); // Use the 'calendario' key to update partidos
      setFilteredPartidos(json.calendario); // Update filtered partidos similarly
    } catch (error) {
      console.error("Failed to fetch partidos:", error.message);
      Alert.alert("Fetch Error", error.message);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = partido.filter(
      (partido) =>
        (partido.deporte ? partido.deporte.toLowerCase() : "").includes(
          text.toLowerCase(),
        ) ||
        (partido.Cancha ? partido.Cancha.toLowerCase() : "").includes(
          text.toLowerCase(),
        ),
    );
    setFilteredPartidos(filtered);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por deporte o cancha"
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredPartidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.partidoContainer}>
            <Text style={styles.deporte}>Deporte: {item.deport}</Text>
            <Text style={styles.info}>
              {item.equipo1_nombre} vs {item.equipo2_nombre}
            </Text>
            <Text style={styles.info}>
              {item.hora} - {item.Cancha}
            </Text>
            <Text style={styles.fecha}>{item.fecha}</Text>
          </View>
        )}
      />
      <Button
        title="Agregar nuevo partido"
        onPress={() => setModalVisible(true)}
        color="#2EC4B6"
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.header}>Crear Nuevo Partido</Text>
          <Picker
            selectedValue={partido.id_deportes}
            onValueChange={(itemValue) =>
              handlePickerChange("id_deportes", itemValue)
            }
            style={styles.pickerStyle}
          >
            <Picker.Item label="Seleccione un Deporte" value="" />
            {deportes.map((deporte) => (
              <Picker.Item
                key={deporte.id}
                label={deporte.nombre}
                value={deporte.id}
              />
            ))}
          </Picker>
          <Picker
            selectedValue={partido.id_arbitro}
            onValueChange={(itemValue) =>
              handlePickerChange("id_arbitro", itemValue)
            }
            style={styles.pickerStyle}
          >
            <Picker.Item label="Seleccione un Árbitro" value="" />
            {arbitros.map((arbitro) => (
              <Picker.Item
                key={arbitro.id}
                label={arbitro.primer_nombre + " " + arbitro.primer_apellido}
                value={arbitro.id}
              />
            ))}
          </Picker>
          <Picker
            selectedValue={partido.id_equipo1}
            onValueChange={(itemValue) =>
              handlePickerChange("id_equipo1", itemValue)
            }
            style={styles.pickerStyle}
          >
            <Picker.Item label="Equipo A" value="" />
            {equipos
              .filter((e) => e.id !== partido.id_equipo2)
              .map((equipo) => (
                <Picker.Item
                  key={equipo.id}
                  label={equipo.nombre}
                  value={equipo.id}
                />
              ))}
          </Picker>
          <Picker
            selectedValue={partido.id_equipo2}
            onValueChange={(itemValue) =>
              handlePickerChange("id_equipo2", itemValue)
            }
            style={styles.pickerStyle}
          >
            <Picker.Item label="Equipo B" value="" />
            {equipos
              .filter((e) => e.id !== partido.id_equipo1)
              .map((equipo) => (
                <Picker.Item
                  key={equipo.id}
                  label={equipo.nombre}
                  value={equipo.id}
                />
              ))}
          </Picker>
          <TouchableOpacity
            onPress={() => setShowDatePickerInicio(true)}
            style={styles.input}
          >
            <Text>{partido.fecha || "Seleccione la fecha"}</Text>
          </TouchableOpacity>
          {showDatePickerInicio && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => handleDateChange("fecha", event, date)}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Hora (HH:MM:SS)"
            value={partido.hora}
            onChangeText={(text) => handlePickerChange("hora", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Dirección"
            value={partido.direccion}
            onChangeText={(text) => handlePickerChange("direccion", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Cancha"
            value={partido.Cancha}
            onChangeText={(text) => handlePickerChange("Cancha", text)}
          />
          <Button
            title="Guardar Partido"
            onPress={handleSubmit}
            color="#2EC4B6"
          />
          <View style={{ marginTop: 8 }}>
            <Button
              title="Cancelar"
              onPress={() => setModalVisible(false)}
              color="red"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  pickerStyle: {
    height: 50,
    backgroundColor: "#ccc",
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    justifyContent: "center",
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingLeft: 8,
    marginVertical: 10,
  },
  partidoContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  deporte: {
    fontSize: 16,
    fontWeight: "bold",
  },
  info: {
    fontSize: 14,
    color: "grey",
  },
  fecha: {
    fontSize: 14,
    color: "blue",
  },
});
