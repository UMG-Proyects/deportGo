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

export default function Patrocinador() {
  const [patrocinadores, setPatrocinadores] = useState([]);
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
      setPatrocinadores(data);
    } catch (error) {
      console.error("Error fetching patrocinadores:", error);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
  };

  const filterPatrocinadores = () => {
    return patrocinadores.filter((patrocinador) =>
      patrocinador.primer_nombre.toLowerCase().includes(search.toLowerCase()),
    );
  };

  const handleCreateOrEditPatrocinador = async () => {
    if (
      !currentPatrocinador.primer_nombre ||
      !currentPatrocinador.primer_apellido ||
      !currentPatrocinador.telefono
    ) {
      Alert.alert(
        "Error",
        "Los campos Primer Nombre, Primer Apellido y Teléfono son obligatorios",
      );
      return;
    }

    try {
      const endpoint = currentPatrocinador.id
        ? `editarPatrocinadores/${currentPatrocinador.id}`
        : "crearPatrocinador";

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: currentPatrocinador.id ? "PUT" : "POST",
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
          currentPatrocinador.id
            ? "Patrocinador actualizado exitosamente"
            : "Patrocinador creado exitosamente",
        );
        closeModal();
      } else {
        Alert.alert(
          "Error",
          currentPatrocinador.id
            ? "Error al editar patrocinador"
            : "Error al crear el patrocinador",
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeactivatePatrocinador = async (id) => {
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

  const openModal = () => {
    setCurrentPatrocinador({
      id: null,
      primer_nombre: "",
      segundo_nombre: "",
      primer_apellido: "",
      segundo_apellido: "",
      telefono: "",
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar patrocinadores"
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filterPatrocinadores()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.patrocinadorContainer}>
            <Text>{item.primer_nombre}</Text>
            <View style={styles.buttonContainer}>
              <Button
                title="Editar"
                onPress={() => {
                  setCurrentPatrocinador(item);
                  openModal();
                }}
                color="#2EC4B6"
              />
              <Button
                title="Desactivar"
                onPress={() => handleDeactivatePatrocinador(item.id)}
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
          <Text>Crear / Editar Patrocinador</Text>
          {/* Input fields */}
          <Button
            title="Guardar"
            onPress={handleCreateOrEditPatrocinador}
            color="#2EC4B6"
          />
          <Button title="Cancelar" onPress={closeModal} color="red" />
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
});
