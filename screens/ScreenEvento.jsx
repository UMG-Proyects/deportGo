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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import API_URL from "../src/config/config";

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [deportes, setDeportes] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [patrocinadores, setPatrocinadores] = useState([]);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEvento, setCurrentEvento] = useState({
    id: null,
    id_categoria: "",
    id_deporte: "",
    id_municipio: "",
    id_patrocinador: "",
    nombre: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_final: "",
    hora: "",
    equipos_participantes: "",
    ubicacion: "",
    rama: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await fetchEventos();
    await fetchCategorias();
    await fetchDeportes();
    await fetchMunicipios();
    await fetchPatrocinadores();
  };

  const fetchEventos = async () => {
    try {
      const response = await fetch(`${API_URL}listarEventos`);
      const data = await response.json();
      setEventos(data);
      setFilteredEventos(data);
    } catch (error) {
      console.error("Error fetching eventos:", error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${API_URL}listCat`); // Reemplazar con el endpoint adecuado
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error("Error fetching categorias:", error);
    }
  };

  const fetchDeportes = async () => {
    try {
      const response = await fetch(`${API_URL}listarDeportes`); // Reemplazar con el endpoint adecuado
      const data = await response.json();
      setDeportes(data);
    } catch (error) {
      console.error("Error fetching deportes:", error);
    }
  };

  const fetchMunicipios = async () => {
    try {
      const response = await fetch(`${API_URL}listarMunicipios`);
      const data = await response.json();
      console.log("minicipio", data);
      setMunicipios(data);
    } catch (error) {
      console.error("Error fetching municipios:", error);
    }
  };

  const fetchPatrocinadores = async () => {
    try {
      const response = await fetch(`${API_URL}listarPatrocinadores`); // Reemplazar con el endpoint adecuado
      const data = await response.json();
      setPatrocinadores(data.patrocinador);
    } catch (error) {
      console.error("Error fetching patrocinadores:", error);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = eventos.filter((evento) =>
      evento.nombre.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredEventos(filtered);
  };

  const handleCreateEvento = async () => {
    if (
      !currentEvento.id_categoria ||
      !currentEvento.id_deporte ||
      !currentEvento.id_municipio ||
      !currentEvento.nombre ||
      !currentEvento.fecha_inicio ||
      !currentEvento.equipos_participantes
    ) {
      Alert.alert("Error", "Todos los campos obligatorios deben ser llenados");
      return;
    }

    try {
      const response = await fetch(`${API_URL}crearEventos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.status) {
        fetchEventos();
        Alert.alert("Éxito", "Evento creado exitosamente");
        closeModal();
      } else {
        Alert.alert("Error", "Error al crear evento");
      }
    } catch (error) {
      console.error("Error creating evento:", error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentEvento({
      id: null,
      id_categoria: "",
      id_deporte: "",
      id_municipio: "",
      id_patrocinador: "",
      nombre: "",
      descripcion: "",
      fecha_inicio: "",
      fecha_final: "",
      hora: "",
      equipos_participantes: "",
      ubicacion: "",
      rama: "",
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar evento..."
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredEventos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventoItem}>
            <Text>{item.nombre}</Text>
            <TouchableOpacity onPress={() => editEvento(item.id)}>
              <Text style={styles.editButton}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deactivateEvento(item.id)}>
              <Text style={styles.deleteButton}>Desactivar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Button
        title="Crear Evento"
        onPress={() => setModalVisible(true)}
        color="#2EC4B6"
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Crear Evento</Text>
          <Picker
            selectedValue={currentEvento.id_categoria}
            onValueChange={(itemValue) =>
              setCurrentEvento({ ...currentEvento, id_categoria: itemValue })
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
            selectedValue={currentEvento.id_deporte}
            onValueChange={(itemValue) =>
              setCurrentEvento({ ...currentEvento, id_deporte: itemValue })
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
            selectedValue={currentEvento.id_patrocinador}
            onValueChange={(itemValue) =>
              setCurrentEvento({ ...currentEvento, id_patrocinador: itemValue })
            }
            style={styles.picker}
          >
            <Picker.Item label="Seleccione un patrocinador" value={null} />
            {patrocinadores &&
              patrocinadores.map((patrocinador) => (
                <Picker.Item
                  key={patrocinador.id}
                  label={
                    patrocinador.primer_nombre +
                    " " +
                    patrocinador.primer_apellido
                  }
                  value={patrocinador.id}
                />
              ))}
          </Picker>
          <Picker
            selectedValue={currentEvento.id_municipio}
            onValueChange={(itemValue) =>
              setCurrentEvento({ ...currentEvento, id_municipio: itemValue })
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
            value={currentEvento.nombre}
            onChangeText={(text) =>
              setCurrentEvento({ ...currentEvento, nombre: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={currentEvento.descripcion}
            onChangeText={(text) =>
              setCurrentEvento({ ...currentEvento, descripcion: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Fecha de inicio"
            value={currentEvento.fecha_inicio}
            onChangeText={(text) =>
              setCurrentEvento({ ...currentEvento, fecha_inicio: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Fecha final"
            value={currentEvento.fecha_final}
            onChangeText={(text) =>
              setCurrentEvento({ ...currentEvento, fecha_final: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Hora"
            value={currentEvento.hora}
            onChangeText={(text) =>
              setCurrentEvento({ ...currentEvento, hora: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Equipos participantes"
            value={currentEvento.equipos_participantes}
            onChangeText={(text) =>
              setCurrentEvento({
                ...currentEvento,
                equipos_participantes: text,
              })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Ubicación"
            value={currentEvento.ubicacion}
            onChangeText={(text) =>
              setCurrentEvento({ ...currentEvento, ubicacion: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Rama"
            value={currentEvento.rama}
            onChangeText={(text) =>
              setCurrentEvento({ ...currentEvento, rama: text })
            }
          />
          <Button
            title="Agregar Evento"
            onPress={handleCreateEvento}
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
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  eventoItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    color: "blue",
  },
  deleteButton: {
    color: "red",
  },
  modalContent: {
    flex: 1,
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
  },
  patrocinadorItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  picker: {
    height: 50,
    backgroundColor: "#ccc",
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 5,
    paddingHorizontal: 5,
  },
});
