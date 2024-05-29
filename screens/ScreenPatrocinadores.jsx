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
} from "react-native";
import API_URL from "../src/config/config";

export default function PatrocinadorScreen() {
  const [patrocinadores, setPatrocinadores] = useState([]);
  const [filteredPatrocinadores, setFilteredPatrocinadores] = useState([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPatrocinador, setCurrentPatrocinador] = useState({
    id: null,
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    telefono: "",
  });

  useEffect(() => {
    fetchPatrocinadores();
  }, []);

  const fetchPatrocinadores = async () => {
    try {
      const response = await fetch(`${API_URL}listarPatrocinadores`);
      const data = await response.json();
      setPatrocinadores(data.patrocinador);
      setFilteredPatrocinadores(data.patrocinador);
    } catch (error) {
      console.error("Error fetching patrocinadores:", error);
    }
  };

  const openModal = (
    patrocinador = {
      id: null,
      primer_nombre: "",
      segundo_nombre: "",
      primer_apellido: "",
      segundo_apellido: "",
      telefono: "",
    },
  ) => {
    setCurrentPatrocinador(patrocinador);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const validateInputs = () => {
    const { primer_nombre, primer_apellido, telefono } = currentPatrocinador;
    if (!primer_nombre || !primer_apellido || !telefono) {
      Alert.alert(
        "Error",
        "Los campos Primer Nombre, Primer Apellido y Teléfono son obligatorios.",
      );
      return false;
    }
    return true;
  };

  const handleCreateOrUpdate = async () => {
    if (!validateInputs()) return;

    try {
      const method = currentPatrocinador.id ? "PUT" : "POST";
      const url = currentPatrocinador.id
        ? `${API_URL}editarPatrocinadores/${currentPatrocinador.id}`
        : `${API_URL}crearPatrocinador`;

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentPatrocinador),
      });
      const data = await response.json();
      if (data.status) {
        fetchPatrocinadores();
        Alert.alert(
          "Éxito",
          `Patrocinador ${currentPatrocinador.id ? "actualizado" : "creado"} exitosamente`,
        );
        closeModal();
      } else {
        Alert.alert(
          "Error",
          `Error al ${currentPatrocinador.id ? "actualizar" : "crear"} patrocinador`,
        );
      }
    } catch (error) {
      console.error(
        `Error ${currentPatrocinador.id ? "updating" : "creating"} patrocinador:`,
        error,
      );
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = patrocinadores.filter(
      (patrocinador) =>
        patrocinador.primer_nombre.toLowerCase().includes(text.toLowerCase()) ||
        patrocinador.primer_apellido.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredPatrocinadores(filtered);
  };

  const handleDeactivate = async (id) => {
    try {
      const response = await fetch(`${API_URL}desactivarPatrocinador/${id}`, {
        method: "PUT",
      });
      const data = await response.json();
      if (data.status) {
        fetchPatrocinadores();
        Alert.alert("Éxito", "Patrocinador desactivado exitosamente");
      } else {
        Alert.alert("Error", "Error al desactivar patrocinador");
      }
    } catch (error) {
      console.error("Error deactivating patrocinador:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar patrocinador"
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredPatrocinadores}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.patrocinadorContainer}>
            <Text>{`${item.primer_nombre} ${item.primer_apellido}`}</Text>
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
                onPress={() => handleDeactivate(item.id)}
                color="red"
              />
            </View>
          </View>
        )}
      />
      <Button
        title="Crear Patrocinador"
        onPress={() => openModal()}
        color="#2EC4B6"
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Text>
            {currentPatrocinador.id
              ? "Editar Patrocinador"
              : "Crear Patrocinador"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Primer nombre"
            value={currentPatrocinador.primer_nombre}
            onChangeText={(text) =>
              setCurrentPatrocinador({
                ...currentPatrocinador,
                primer_nombre: text,
              })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Segundo nombre"
            value={currentPatrocinador.segundo_nombre}
            onChangeText={(text) =>
              setCurrentPatrocinador({
                ...currentPatrocinador,
                segundo_nombre: text,
              })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Primer apellido"
            value={currentPatrocinador.primer_apellido}
            onChangeText={(text) =>
              setCurrentPatrocinador({
                ...currentPatrocinador,
                primer_apellido: text,
              })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Segundo apellido"
            value={currentPatrocinador.segundo_apellido}
            onChangeText={(text) =>
              setCurrentPatrocinador({
                ...currentPatrocinador,
                segundo_apellido: text,
              })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={String(currentPatrocinador.telefono)}
            onChangeText={(text) =>
              setCurrentPatrocinador({ ...currentPatrocinador, telefono: text })
            }
          />
          <Button
            title={currentPatrocinador.id ? "Actualizar" : "Crear"}
            onPress={handleCreateOrUpdate}
            color="#2EC4B6"
          />
          <View style={{ marginTop: 8 }}>
            <Button title="Cancelar" onPress={closeModal} color="red" />
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
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  patrocinadorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});
