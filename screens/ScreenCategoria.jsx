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

export default function Categoria() {
  const [categorias, setCategorias] = useState([]);
  const [filteredCategorias, setFilteredCategorias] = useState([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCategoria, setCurrentCategoria] = useState({
    id: null,
    categoria: "",
  });

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${API_URL}listCat`);
      const data = await response.json();
      setCategorias(data);
      setFilteredCategorias(data);
    } catch (error) {
      console.error("Error fetching categorias:", error);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = categorias.filter((categoria) =>
      categoria.categoria.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredCategorias(filtered);
  };

  const handleCreate = async (categoria) => {
    try {
      const response = await fetch(`${API_URL}crearCat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoria }),
      });
      const data = await response.json();
      if (data.status) {
        fetchCategorias();
        Alert.alert("Éxito", "Categoría creada exitosamente");
      } else {
        Alert.alert("Error", "Error al crear categoría");
      }
    } catch (error) {
      console.error("Error creating categoría:", error);
    }
  };

  const handleEdit = async (id, categoria) => {
    try {
      const response = await fetch(`${API_URL}editarCat/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoria }),
      });
      const data = await response.json();
      if (data.status) {
        fetchCategorias();
        Alert.alert("Éxito", "Categoría actualizada exitosamente");
      } else {
        Alert.alert("Error", "Error al actualizar categoría");
      }
    } catch (error) {
      console.error("Error editing categoría:", error);
    }
  };

  const openModal = (categoria) => {
    setCurrentCategoria(categoria);
    setModalVisible(true);
  };

  const closeModal = () => {
    setCurrentCategoria({ id: null, categoria: "" });
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar categoría"
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredCategorias}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.categoriaContainer}>
            <Text>{item.categoria}</Text>
            <View style={styles.buttonContainer}>
              <View style={{ marginRight: 8 }}>
                <Button
                  title="Editar"
                  onPress={() => openModal(item)}
                  color="#2EC4B6"
                />
              </View>
            </View>
          </View>
        )}
      />
      <Button
        title="Crear Categoría"
        onPress={() => openModal({ id: null, categoria: "" })}
        color="#2EC4B6"
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Text>
            {currentCategoria.id ? "Editar Categoría" : "Crear Categoría"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre de la categoría"
            value={currentCategoria.categoria}
            onChangeText={(text) =>
              setCurrentCategoria({ ...currentCategoria, categoria: text })
            }
          />
          <Button
            title={currentCategoria.id ? "Actualizar" : "Crear"}
            onPress={() => {
              if (currentCategoria.id) {
                handleEdit(currentCategoria.id, currentCategoria.categoria);
              } else {
                handleCreate(currentCategoria.categoria);
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
  categoriaContainer: {
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
