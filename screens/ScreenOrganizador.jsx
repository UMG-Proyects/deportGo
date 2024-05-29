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

export default function Organizacion() {
  const [organizaciones, setOrganizaciones] = useState([]);
  const [filteredOrganizaciones, setFilteredOrganizaciones] = useState([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentOrganizacion, setCurrentOrganizacion] = useState({
    id: null,
    nombre: "",
    telefono: "",
    correo_electronico: "",
    no_de_cuenta: "",
  });

  useEffect(() => {
    fetchOrganizaciones();
  }, []);

  const fetchOrganizaciones = async () => {
    try {
      const response = await fetch(`${API_URL}listarOrganizaciones`);
      const data = await response.json();
      console.log(data);
      setOrganizaciones(data);
      setFilteredOrganizaciones(data);
    } catch (error) {
      console.error("Error fetching organizaciones:", error);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = organizaciones.filter((organizacion) =>
      organizacion.nombre.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredOrganizaciones(filtered);
  };

  const handleCreateOrganizacion = async () => {
    if (
      !currentOrganizacion.nombre ||
      !currentOrganizacion.telefono ||
      !currentOrganizacion.correo_electronico ||
      !currentOrganizacion.no_de_cuenta
    ) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await fetch(`${API_URL}crearOrganizacion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentOrganizacion),
      });
      const data = await response.json();
      if (data.status) {
        fetchOrganizaciones();
        Alert.alert("Éxito", "Organización creada exitosamente");
        closeModal();
      } else {
        Alert.alert("Error", "Error al crear organización");
      }
    } catch (error) {
      console.error("Error creating organizacion:", error);
    }
  };

  const handleEditOrganizacion = async (id) => {
    if (
      !currentOrganizacion.nombre ||
      !currentOrganizacion.telefono ||
      !currentOrganizacion.correo_electronico ||
      !currentOrganizacion.no_de_cuenta
    ) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await fetch(`${API_URL}editarOrganizacion/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentOrganizacion),
      });
      const data = await response.json();
      if (data.status) {
        fetchOrganizaciones();
        Alert.alert("Éxito", "Organización actualizada exitosamente");
        closeModal();
      } else {
        Alert.alert("Error", "Error al editar organización");
      }
    } catch (error) {
      console.error("Error editing organizacion:", error);
    }
  };

  const handleDeactivateOrganizacion = async (id) => {
    try {
      const response = await fetch(`${API_URL}desactivarOrganizacion/${id}`, {
        method: "PUT",
      });
      const data = await response.json();
      if (data.status) {
        fetchOrganizaciones();
        Alert.alert("Éxito", "Organización desactivada exitosamente");
      } else {
        Alert.alert("Error", "Error al desactivar organización");
      }
    } catch (error) {
      console.error("Error deactivating organizacion:", error);
    }
  };

  const openModal = (organizacion) => {
    if (organizacion) {
      setCurrentOrganizacion(organizacion);
    } else {
      setCurrentOrganizacion({
        id: null,
        nombre: "",
        telefono: "",
        correo_electronico: "",
        no_de_cuenta: "",
      });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar organización"
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredOrganizaciones}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.organizacionContainer}>
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
                onPress={() => handleDeactivateOrganizacion(item.id)}
                color="red"
              />
            </View>
          </View>
        )}
      />
      <Button
        title="Crear Organización"
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
            {currentOrganizacion.id
              ? "Editar Organización"
              : "Crear Organización"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={currentOrganizacion.nombre}
            onChangeText={(text) =>
              setCurrentOrganizacion({ ...currentOrganizacion, nombre: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={currentOrganizacion.telefono}
            onChangeText={(text) =>
              setCurrentOrganizacion({ ...currentOrganizacion, telefono: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={currentOrganizacion.correo_electronico}
            onChangeText={(text) =>
              setCurrentOrganizacion({
                ...currentOrganizacion,
                correo_electronico: text,
              })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="No. de Cuenta"
            value={currentOrganizacion.no_de_cuenta}
            onChangeText={(text) =>
              setCurrentOrganizacion({
                ...currentOrganizacion,
                no_de_cuenta: text,
              })
            }
          />
          <Button
            title={currentOrganizacion.id ? "Actualizar" : "Crear"}
            onPress={() => {
              if (currentOrganizacion.id) {
                handleEditOrganizacion(currentOrganizacion.id);
              } else {
                handleCreateOrganizacion();
              }
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
    padding: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  organizacionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});
