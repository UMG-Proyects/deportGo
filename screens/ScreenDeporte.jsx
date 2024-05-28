import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import API_URL from "../src/config/config";

export default function Deporte() {
  const [deportes, setDeportes] = useState([]);
  const [filteredDeportes, setFilteredDeportes] = useState([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDeporte, setCurrentDeporte] = useState({
    id: null,
    nombre: "",
  });

  useEffect(() => {
    fetchDeportes();
  }, []);

  const fetchDeportes = async () => {
    try {
      const response = await fetch(`${API_URL}listarDeportes`);
      const data = await response.json();
      setDeportes(data);
      setFilteredDeportes(data);
    } catch (error) {
      console.error("Error fetching deportes:", error);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = deportes.filter((deporte) =>
      deporte.nombre.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredDeportes(filtered);
  };

  const handleCreate = async (nombre) => {
    try {
      const response = await fetch(`${API_URL}crearDeporte`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre }),
      });
      const data = await response.json();
      if (data.status) {
        fetchDeportes();
        Alert.alert("Éxito", "Deporte creado exitosamente");
      } else {
        Alert.alert("Error", "Error al crear deporte");
      }
    } catch (error) {
      console.error("Error creating deporte:", error);
    }
  };

  const handleEdit = async (id, nombre) => {
    try {
      const response = await fetch(`${API_URL}editarDeportes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre }),
      });
      const data = await response.json();
      if (data.status) {
        fetchDeportes();
        Alert.alert("Éxito", "Deporte actualizado exitosamente");
      } else {
        Alert.alert("Error", "Error al actualizar deporte");
      }
    } catch (error) {
      console.error("Error editing deporte:", error);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      const response = await fetch(`${API_URL}desactivarDeporte/${id}`, {
        method: "PUT",
      });
      const data = await response.json();
      if (data.status) {
        fetchDeportes();
        Alert.alert("Éxito", "Deporte desactivado exitosamente");
      } else {
        Alert.alert("Error", "Error al desactivar deporte");
      }
    } catch (error) {
      console.error("Error deactivating deporte:", error);
    }
  };

  const openModal = (deporte) => {
    setCurrentDeporte(deporte);
    setModalVisible(true);
  };

  const closeModal = (deactivate = false) => {
    if (!deactivate) {
      setCurrentDeporte({ id: null, nombre: "" });
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar deporte"
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredDeportes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.deporteContainer}>
            <Text>{item.nombre}</Text>
            <View style={styles.buttonContainer}>
              <View style={{ marginRight: 8 }}>
                <Button
                  title="Editar"
                  onPress={() => openModal(item)}
                  color="#2EC4B6"
                />
              </View>
              <View>
                <Button
                  title="Desactivar"
                  onPress={() => {
                    handleDeactivate(item.id);
                    closeModal(true);
                  }}
                  color="red"
                />
              </View>
            </View>
          </View>
        )}
      />
      <Button
        title="Crear Deporte"
        onPress={() => openModal({ id: null, nombre: "" })}
        color="#2EC4B6"
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Text>{currentDeporte.id ? "Editar Deporte" : "Crear Deporte"}</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del deporte"
            value={currentDeporte.nombre}
            onChangeText={(text) =>
              setCurrentDeporte({ ...currentDeporte, nombre: text })
            }
          />
          <Button
            title={currentDeporte.id ? "Actualizar" : "Crear"}
            onPress={() => {
              if (currentDeporte.id) {
                handleEdit(currentDeporte.id, currentDeporte.nombre);
              } else {
                handleCreate(currentDeporte.nombre);
              }
              closeModal();
            }}
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
  deporteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 8, // Agregar espacio arriba de los botones
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
