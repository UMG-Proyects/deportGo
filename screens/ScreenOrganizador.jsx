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

export default function Organizador() {
  const [arbitros, setArbitros] = useState([]);
  const [filteredArbitros, setFilteredArbitros] = useState([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentArbitro, setCurrentArbitro] = useState({
    id: null,
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    genero: "",
    direccion: "",
    telefono: "",
  });

  useEffect(() => {
    fetchArbitros();
  }, []);

  const fetchArbitros = async () => {
    try {
      const response = await fetch(`${API_URL}listarArbitro`);
      const data = await response.json();
      setArbitros(data);
      setFilteredArbitros(data);
    } catch (error) {
      console.error("Error fetching arbitros:", error);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = arbitros.filter((arbitro) =>
      arbitro.primer_nombre.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredArbitros(filtered);
  };

  const handleCreateArbitro = async () => {
    // Validar campos obligatorios
    if (
      !currentArbitro.primer_nombre ||
      !currentArbitro.primer_apellido ||
      !currentArbitro.telefono
    ) {
      Alert.alert(
        "Error",
        "Los campos Primer Nombre, Primer Apellido y Teléfono son obligatorios",
      );
      return;
    }

    try {
      const response = await fetch(`${API_URL}crearArbitro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentArbitro),
      });
      const data = await response.json();
      if (data.status) {
        fetchArbitros();
        Alert.alert("Éxito", "Árbitro creado exitosamente");
        closeModal();
      } else {
        Alert.alert("Error", "Error al crear árbitro");
      }
    } catch (error) {
      console.error("Error creating arbitro:", error);
    }
  };

  const handleEditArbitro = async (id) => {
    // Validar campos obligatorios
    if (
      !currentArbitro.primer_nombre ||
      !currentArbitro.primer_apellido ||
      !currentArbitro.telefono
    ) {
      Alert.alert(
        "Error",
        "Los campos Primer Nombre, Primer Apellido y Teléfono son obligatorios",
      );
      return;
    }

    try {
      const response = await fetch(`${API_URL}editarArbitro/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentArbitro),
      });
      const data = await response.json();
      if (data.status) {
        fetchArbitros();
        Alert.alert("Éxito", "Árbitro actualizado exitosamente");
        closeModal();
      } else {
        Alert.alert("Error", "Error al editar árbitro");
      }
    } catch (error) {
      console.error("Error editing arbitro:", error);
    }
  };

  const handleDeactivateArbitro = async (id) => {
    try {
      const response = await fetch(`${API_URL}desactivarArbitro/${id}`, {
        method: "PUT",
      });
      const data = await response.json();
      if (data.status) {
        fetchArbitros();
        Alert.alert("Éxito", "Árbitro desactivado exitosamente");
      } else {
        Alert.alert("Error", "Error al desactivar árbitro");
      }
    } catch (error) {
      console.error("Error deactivating arbitro:", error);
    }
  };

  const openModal = () => {
    setCurrentArbitro({
      id: null,
      primer_nombre: "",
      segundo_nombre: "",
      primer_apellido: "",
      segundo_apellido: "",
      genero: "",
      direccion: "",
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
        placeholder="Buscar árbitro"
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredArbitros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.arbitroContainer}>
            <Text>{item.primer_nombre}</Text>
            <View style={styles.buttonContainer}>
              <Button
                title="Editar"
                onPress={() => {
                  setCurrentArbitro(item);
                  openModal();
                }}
                color="#2EC4B6"
              />
              <Button
                title="Desactivar"
                onPress={() => handleDeactivateArbitro(item.id)}
                color="red"
              />
            </View>
          </View>
        )}
      />
      <Button
        title="Crear Árbitro"
        onPress={() => openModal()}
        color="#2EC4B6"
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Text>Crear / Editar Árbitro</Text>
          <TextInput
            style={styles.input}
            placeholder="Primer nombre"
            value={currentArbitro.primer_nombre}
            onChangeText={(text) =>
              setCurrentArbitro({ ...currentArbitro, primer_nombre: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Segundo nombre"
            value={currentArbitro.segundo_nombre}
            onChangeText={(text) =>
              setCurrentArbitro({ ...currentArbitro, segundo_nombre: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Primer apellido"
            value={currentArbitro.primer_apellido}
            onChangeText={(text) =>
              setCurrentArbitro({ ...currentArbitro, primer_apellido: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Segundo apellido"
            value={currentArbitro.segundo_apellido}
            onChangeText={(text) =>
              setCurrentArbitro({ ...currentArbitro, segundo_apellido: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Género"
            value={currentArbitro.genero}
            onChangeText={(text) =>
              setCurrentArbitro({ ...currentArbitro, genero: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Dirección"
            value={currentArbitro.direccion}
            onChangeText={(text) =>
              setCurrentArbitro({ ...currentArbitro, direccion: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={String(currentPatrocinador.telefono)}
            onChangeText={(text) =>
              setCurrentArbitro({ ...currentArbitro, telefono: text })
            }
          />
          <Button
            title="Guardar"
            onPress={() => {
              if (currentArbitro.id) {
                handleEditArbitro(currentArbitro.id);
              } else {
                handleCreateArbitro();
              }
            }}
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
  arbitroContainer: {
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
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});
