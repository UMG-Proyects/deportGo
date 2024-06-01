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
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import API_URL from "../src/config/config";
import * as ImagePicker from "expo-image-picker";

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [deportes, setDeportes] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [patrocinadores, setPatrocinadores] = useState([]);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePickerInicio, setShowDatePickerInicio] = useState(false);
  const [showDatePickerFinal, setShowDatePickerFinal] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
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
    participantes: "",
    ubicacion: "",
    rama: "",
  });

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchEventos(),
        fetchCategorias(),
        fetchDeportes(),
        fetchMunicipios(),
        fetchPatrocinadores(),
      ]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (
    evento = {
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
      participantes: "",
      ubicacion: "",
      rama: "",
    },
  ) => {
    setCurrentEvento(evento);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const fetchEventos = async () => {
    try {
      const response = await fetch(`${API_URL}listarEventos`);
      const data = await response.json();
      setEventos(data);
      setFilteredEventos(data);
    } catch (error) {
      console.error("Error fetching eventos:", error);
      setError("Error fetching eventos");
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

  const fetchPatrocinadores = async () => {
    try {
      const response = await fetch(`${API_URL}listarPatrocinadores`);
      const data = await response.json();
      setPatrocinadores(data.patrocinador);
    } catch (error) {
      console.error("Error fetching patrocinadores:", error);
      setError("Error fetching patrocinadores");
    }
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
      const method = currentEvento.id ? "PUT" : "POST";
      const url = currentEvento.id
        ? `${API_URL}editarEvento/${currentEvento.id}`
        : `${API_URL}crearEventos`;

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentEvento),
      });
      const data = await response.json();
      if (data.status) {
        fetchEventos(); // Actualiza la lista de eventos después de crear o actualizar
        Alert.alert(
          "Éxito",
          `Evento ${currentEvento.id ? "actualizado" : "creado"} exitosamente`,
        );
        closeModal();
      } else {
        Alert.alert(
          "Error",
          `Error al ${currentEvento.id ? "actualizar" : "crear"} evento`,
        );
      }
    } catch (error) {
      console.error(
        `Error ${currentEvento.id ? "updating" : "creating"} evento:`,
        error,
      );
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = eventos.filter((evento) =>
      evento.nombre.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredEventos(filtered);
  };

  const deactivateEvento = async (id) => {
    try {
      const response = await fetch(`${API_URL}desactivarEvento/${id}`, {
        method: "PUT",
      });
      const data = await response.json();
      if (data.status) {
        fetchEventos();
        Alert.alert("Éxito", "Evento desactivado exitosamente");
      } else {
        Alert.alert("Error", "Error al desactivar evento");
      }
    } catch (error) {
      console.error("Error deactivating evento:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setCurrentEvento({ ...currentEvento, [field]: value });
  };

  const handleDateChange = (field, event, selectedDate) => {
    if (Platform.OS !== "ios") {
      setShowDatePickerInicio(false);
      setShowDatePickerFinal(false);
    }
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      handleInputChange(field, formattedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      const formattedTime = selectedTime
        .toISOString()
        .split("T")[1]
        .substring(0, 8);
      handleInputChange("hora", formattedTime);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar evento..."
        value={search}
        onChangeText={handleSearch}
      />
      {loading && <Text>Cargando...</Text>}
      {error && <Text>{error}</Text>}
      <FlatList
        data={filteredEventos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventoItem}>
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
                onPress={() => deactivateEvento(item.id)}
                color="red"
              />
            </View>
          </View>
        )}
      />
      <Button
        title="Crear Evento"
        onPress={() => openModal()}
        color="#2EC4B6"
      />

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView style={styles.scrollView}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {currentEvento.id ? "Editar Evento" : "Crear Evento"}
            </Text>
            <Picker
              selectedValue={currentEvento.id_categoria}
              onValueChange={(itemValue) => {
                setCurrentEvento({ ...currentEvento, id_categoria: itemValue });
              }}
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
                setCurrentEvento({
                  ...currentEvento,
                  id_patrocinador: itemValue,
                })
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
            <TouchableOpacity
              onPress={() => setShowDatePickerInicio(true)}
              style={styles.input}
            >
              <Text>{currentEvento.fecha_inicio || "Fecha Inicio"}</Text>
            </TouchableOpacity>
            {showDatePickerInicio && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={(event, date) =>
                  handleDateChange("fecha_inicio", event, date)
                }
              />
            )}
            <TouchableOpacity
              onPress={() => setShowDatePickerFinal(true)}
              style={styles.input}
            >
              <Text>{currentEvento.fecha_final || "Fecha final"}</Text>
            </TouchableOpacity>
            {showDatePickerFinal && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={(event, date) =>
                  handleDateChange("fecha_final", event, date)
                }
              />
            )}
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={styles.input}
            >
              <Text>{currentEvento.hora || "Hora"}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
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
              placeholder="Participantes"
              value={currentEvento.participantes}
              onChangeText={(text) =>
                setCurrentEvento({
                  ...currentEvento,
                  participantes: text,
                })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Ubicacion"
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
            <View style={styles.container}>
              <Button title="Cargar Imagen" onPress={pickImage} />
              {image && <Image source={{ uri: image }} style={styles.image} />}
            </View>
            <Button
              title={currentEvento.id ? "Actualizar" : "Crear"}
              onPress={handleCreateEvento}
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
  eventoItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row", // Alineación horizontal de botones
  },
  editButton: {
    color: "blue",
    marginRight: 10,
  },
  deleteButton: {
    color: "red",
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
  scrollView: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 200,
  },
});
