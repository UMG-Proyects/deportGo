import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import API_URL from "../src/config/config";

const InscripcionScreen = () => {
  const route = useRoute();
  const { id } = route.params;

  const [evento, setEvento] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [inscripcion, setInscripcion] = useState({
    nombre: "",
    tarifa: "",
    fecha: new Date(),
    id_evento: id,
    id_equipo: "",
    edad: "",
    genero: "",
    telefono: "",
    telefono_emergencia: "",
    nombre_entrenador: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchEvento();
  }, []);

  const fetchEvento = async () => {
    try {
      const response = await fetch(`${API_URL}consultarEvento/${id}`);
      const data = await response.json();
      setEvento(data);
    } catch (error) {
      setError("Error fetching event details");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInscripcion = async () => {
    if (!inscripcion.nombre || !inscripcion.fecha || !inscripcion.id_evento) {
      Alert.alert("Error", "Todos los campos obligatorios deben ser llenados");
      return;
    }

    try {
      const response = await fetch(`${API_URL}crearInscripcion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inscripcion),
      });
      const data = await response.json();
      if (data.status) {
        Alert.alert("Éxito", "Inscripción creada exitosamente");
        setModalVisible(false);
      } else {
        Alert.alert("Error", "Error al crear la inscripción");
      }
    } catch (error) {
      console.error("Error creating inscripción:", error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || inscripcion.fecha;
    setShowDatePicker(Platform.OS === "ios");
    setInscripcion({ ...inscripcion, fecha: currentDate });
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: evento.imagen }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{evento.nombre}</Text>
        <Text style={styles.label}>Descripción:</Text>
        <Text style={styles.details}>{evento.descripcion}</Text>
        <Text style={styles.label}>Fecha de inicio:</Text>
        <Text style={styles.details}>{evento.fecha_inicio}</Text>
        <Text style={styles.label}>Fecha de fin:</Text>
        <Text style={styles.details}>{evento.fecha_final}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Inscribirse" onPress={openModal} color="#2EC4B6" />
      </View>

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView style={styles.modalContent}>
          <Text style={styles.modalTitle}>Crear Inscripción</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={inscripcion.nombre}
            onChangeText={(text) =>
              setInscripcion({ ...inscripcion, nombre: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Tarifa"
            keyboardType="numeric"
            value={inscripcion.tarifa}
            onChangeText={(text) =>
              setInscripcion({ ...inscripcion, tarifa: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="ID del Equipo"
            value={inscripcion.id_equipo}
            onChangeText={(text) =>
              setInscripcion({ ...inscripcion, id_equipo: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Edad"
            keyboardType="numeric"
            value={inscripcion.edad}
            onChangeText={(text) =>
              setInscripcion({ ...inscripcion, edad: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Género"
            value={inscripcion.genero}
            onChangeText={(text) =>
              setInscripcion({ ...inscripcion, genero: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            keyboardType="phone-pad"
            value={inscripcion.telefono}
            onChangeText={(text) =>
              setInscripcion({ ...inscripcion, telefono: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono de Emergencia"
            keyboardType="phone-pad"
            value={inscripcion.telefono_emergencia}
            onChangeText={(text) =>
              setInscripcion({ ...inscripcion, telefono_emergencia: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre del Entrenador"
            value={inscripcion.nombre_entrenador}
            onChangeText={(text) =>
              setInscripcion({ ...inscripcion, nombre_entrenador: text })
            }
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>
              Fecha de inscripción: {inscripcion.fecha.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={inscripcion.fecha}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <Button
            title="Crear Inscripción"
            onPress={handleCreateInscripcion}
            color="#2EC4B6"
          />
          <Button title="Cancelar" onPress={closeModal} color="red" />
        </ScrollView>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#000067",
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginVertical: 10,
    textAlign: "left",
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "left",
  },
  details: {
    fontSize: 24,
    color: "white",
    marginVertical: 5,
    textAlign: "left",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 20,
  },
  detailsContainer: {
    alignItems: "flex-start",
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
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
  dateText: {
    fontSize: 16,
    color: "black",
    marginVertical: 10,
    paddingLeft: 10,
  },
});

export default InscripcionScreen;
