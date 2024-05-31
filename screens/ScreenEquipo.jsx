import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import API_URL from "../src/config/config";

export default function Equipo() {
  const [equipos, setEquipos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [deportes, setDeportes] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [filteredEquipos, setFilteredEquipos] = useState([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentEquipo, setCurrentEquipo] = useState({
    id: null,
    estado: true,
    id_categoria: "",
    id_deporte: "",
    id_municipio: "",
    nombre: "",
    participantes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchEquipos(),
        fetchCategorias(),
        fetchDeportes(),
        fetchMunicipios(),
      ]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (
    equipo = {
      id: null,
      estado: true,
      id_categoria: "",
      id_deporte: "",
      id_municipio: "",
      nombre: "",
      participantes: "",
    },
  ) => {
    setCurrentEquipo(equipo);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const fetchEquipos = async () => {
    try {
      const response = await fetch(`${API_URL}listarEquipo`);
      const data = await response.json();
      setEquipos(data);
      setFilteredEquipos(data);
    } catch (error) {
      console.error("Error fetching equipos:", error);
      setError("Error fetching equipos");
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${API_URL}listCat`);
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error("Error fetching categorias:", error);
      setError("Error fetching categorias");
    }
  };

  const fetchDeportes = async () => {
    try {
      const response = await fetch(`${API_URL}listarDeportes`);
      const data = await response.json();
      setDeportes(data);
    } catch (error) {
      console.error("Error fetching deportes:", error);
      setError("Error fetching deportes");
    }
  };

  const fetchMunicipios = async () => {
    try {
      const response = await fetch(`${API_URL}listarMunicipios`);
      const data = await response.json();
      setMunicipios(data);
    } catch (error) {
      console.error("Error fetching municipios:", error);
      setError("Error fetching municipios");
    }
  };

  const handleCreateEquipo = async () => {
    if (
      !currentEquipo.id_categoria ||
      !currentEquipo.id_deporte ||
      !currentEquipo.id_municipio ||
      !currentEquipo.nombre ||
      !currentEquipo.participantes
    ) {
      Alert.alert("Error", "Todos los campos obligatorios deben ser llenados");
      return;
    }

    try {
      const method = currentEquipo.id ? "PUT" : "POST";
      const url = currentEquipo.id
        ? `${API_URL}editarEquipo/${currentEquipo.id}`
        : `${API_URL}crearEquipo`;

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentEquipo),
      });
      const data = await response.json();
      if (data.status) {
        fetchEquipos();
        Alert.alert(
          "Éxito",
          `Equipo ${currentEquipo.id ? "actualizado" : "creado"} exitosamente`,
        );
        closeModal();
      } else {
        Alert.alert(
          "Error",
          `Error al ${currentEquipo.id ? "actualizar" : "crear"} equipo`,
        );
      }
    } catch (error) {
      console.error(
        `Error ${currentEquipo.id ? "updating" : "creating"} equipo:`,
        error,
      );
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = equipos.filter((equipo) =>
      equipo.nombre.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredEquipos(filtered);
  };

  const deactivateEquipo = async (id) => {
    try {
      const response = await fetch(`${API_URL}desactivarEquipo/${id}`, {
        method: "PUT",
      });
      const data = await response.json();
      if (data.status) {
        fetchEquipos();
        Alert.alert("Éxito", "Equipo desactivado exitosamente");
      } else {
        Alert.alert("Error", "Error al desactivar equipo");
      }
    } catch (error) {
      console.error("Error deactivating equipo:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setCurrentEquipo({ ...currentEquipo, [field]: value });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar equipo..."
        value={search}
        onChangeText={handleSearch}
      />
      {loading && <Text>Cargando...</Text>}
      {error && <Text>{error}</Text>}
      <FlatList
        data={filteredEquipos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.equipoItem}>
            <Text>{item.nombre}</Text>
            <View style={styles.buttonContainer}>
              <View style={{ marginRight: 8 }}>
                <Button
                  title="Editar"
                  onPress={() => openModal(item)}
                  color="#2EC4B6"
                />
              </View>
              <Button
                title="Desactivar"
                onPress={() => deactivateEquipo(item.id)}
                color="red"
              />
            </View>
          </View>
        )}
      />
      <Button
        title="Crear Equipo"
        onPress={() => openModal()}
        color="#2EC4B6"
      />

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView style={styles.scrollView}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {currentEquipo.id ? "Editar Equipo" : "Crear Equipo"}
            </Text>
            <Picker
              selectedValue={currentEquipo.id_categoria}
              onValueChange={(itemValue) =>
                setCurrentEquipo({ ...currentEquipo, id_categoria: itemValue })
              }
              style={styles.picker}
            >
              <Picker.Item label="Seleccione una Categoria" value={null} />
              {categorias &&
                categorias.map((categoria) => (
                  <Picker.Item
                    key={categoria.id}
                    label={categoria.categoria}
                    value={categoria.id}
                  />
                ))}
            </Picker>
            <Picker
              selectedValue={currentEquipo.id_deporte}
              onValueChange={(itemValue) =>
                setCurrentEquipo({ ...currentEquipo, id_deporte: itemValue })
              }
              style={styles.picker}
            >
              <Picker.Item label="Seleccione un deporte" value={null} />
              {deportes &&
                deportes.map((deporte) => (
                  <Picker.Item
                    key={deporte.id}
                    label={deporte.nombre}
                    value={deporte.id}
                  />
                ))}
            </Picker>
            <Picker
              selectedValue={currentEquipo.id_municipio}
              onValueChange={(itemValue) =>
                setCurrentEquipo({ ...currentEquipo, id_municipio: itemValue })
              }
              style={styles.picker}
            >
              <Picker.Item label="Seleccione un Municipio" value={null} />
              {municipios &&
                municipios.map((municipio) => (
                  <Picker.Item
                    key={municipio.id}
                    label={municipio.Municipio}
                    value={municipio.id}
                  />
                ))}
            </Picker>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={currentEquipo.nombre}
              onChangeText={(text) =>
                setCurrentEquipo({ ...currentEquipo, nombre: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Participantes"
              value={String(currentEquipo.participantes)}
              onChangeText={(text) =>
                setCurrentEquipo({ ...currentEquipo, participantes: text })
              }
            />
            <Button
              title={currentEquipo.id ? "Actualizar" : "Crear"}
              onPress={handleCreateEquipo}
              color="#2EC4B6"
            />
            <View style={{ marginTop: 8 }}>
              <Button title="Cancelar" onPress={closeModal} color="red" />
            </View>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  equipoItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    justifyContent: "center",
  },
  picker: {
    height: 50,
    backgroundColor: "#ccc",
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  scrollView: {
    flex: 1,
  },
});
