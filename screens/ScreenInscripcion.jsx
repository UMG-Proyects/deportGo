import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Button,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import API_URL from "../src/config/config";

const InscripcionesScreen = ({ route }) => {
  const { id } = route.params;
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [genero, setGenero] = useState("");
  const [telefono, setTelefono] = useState("");
  const [telefonoEmergencia, setTelefonoEmergencia] = useState("");
  const [tarifa, setTarifa] = useState("");
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [equipos, setEquipos] = useState([]);

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const responseEvento = await fetch(`${API_URL}listarEventos`);
        const dataEvento = await responseEvento.json();
        const eventoEncontrado = dataEvento.find((e) => e.id === id);
        setEvento(eventoEncontrado);

        const responseEquipo = await fetch(`${API_URL}listarEquipo`);
        const dataEquipo = await responseEquipo.json();
        setEquipos(dataEquipo);

        if (!eventoEncontrado) {
          setError("Evento no encontrado");
        }
        setLoading(false);
      } catch (err) {
        setError("Error al cargar el evento");
        setLoading(false);
      }
    };

    fetchEvento();
  }, [id]);

  const handleInscribe = async () => {
    if (
      !nombre ||
      !edad ||
      !genero ||
      !telefono ||
      !telefonoEmergencia ||
      !tarifa ||
      !equipoSeleccionado
    ) {
      Alert.alert("Por favor, complete todos los campos.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}crearInscripcion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          edad,
          genero,
          telefono,
          telefono_emergencia: telefonoEmergencia,
          tarifa: parseInt(tarifa, 10),
          nombre_entrenador: "",
          id_evento: id,
          id_equipo: equipoSeleccionado,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert("Inscripción exitosa", result.message);
        setModalVisible(false);
      } else {
        Alert.alert(
          "Error al inscribir",
          result.message || "Error desconocido",
        );
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {evento ? (
          <>
            <View style={styles.containerImage}>
              <Image
                source={{ uri: evento.imagen }}
                style={styles.imagenHeader}
              />
            </View>
            <View style={styles.tittleContainer}>
              <Text style={styles.title}>{evento.nombre}</Text>
            </View>
            <Text style={styles.detail}>
              <Text style={styles.bold}>Descripción:</Text> {evento.descripcion}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.bold}>Fecha Inicio:</Text>{" "}
              {evento.fecha_inicio}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.bold}>Fecha Final:</Text> {evento.fecha_final}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.bold}>Hora:</Text> {evento.hora}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.bold}>Participantes:</Text>{" "}
              {evento.participantes}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.bold}>Rama:</Text> {evento.rama}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.bold}>Ubicación:</Text> {evento.ubicacion}
            </Text>
            <Button title="Inscribirse" onPress={() => setModalVisible(true)} />
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Picker
                    selectedValue={equipoSeleccionado}
                    onValueChange={(itemValue, itemIndex) =>
                      setEquipoSeleccionado(itemValue)
                    }
                    style={styles.pickerStyle}
                  >
                    <Picker.Item label="Seleccione un Equipo" value={null} />
                    {equipos.map((equipo) => (
                      <Picker.Item
                        key={equipo.id}
                        label={equipo.nombre} // Asegúrate de que este campo corresponde a tu estructura de datos
                        value={equipo.id}
                      />
                    ))}
                  </Picker>
                  <TextInput
                    placeholder="Nombre completo"
                    value={nombre}
                    onChangeText={setNombre}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Edad"
                    value={edad}
                    onChangeText={setEdad}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Género"
                    value={genero}
                    onChangeText={setGenero}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Teléfono"
                    value={telefono}
                    onChangeText={setTelefono}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Teléfono de Emergencia"
                    value={telefonoEmergencia}
                    onChangeText={setTelefonoEmergencia}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Tarifa"
                    value={tarifa}
                    onChangeText={setTarifa}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                  <Button title="Enviar Inscripción" onPress={handleInscribe} />
                  <View style={{ marginTop: 8 }}>
                    <Button
                      title="Cerrar"
                      color="red"
                      onPress={() => setModalVisible(false)}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          </>
        ) : (
          <Text style={styles.detail}>No se encontró el evento</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: 20,
  },
  container: {
    flex: 1,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  tittleContainer: {
    width: "100%",
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  detail: {
    fontSize: 18,
    marginVertical: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 18,
  },
  containerImage: {
    width: "100%",
    alignSelf: "center",
  },
  imagenHeader: {
    width: "100%",
    height: undefined,
    aspectRatio: 1.5,
    resizeMode: "cover",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pickerStyle: {
    width: 300,
    backgroundColor: "#ccc",
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  input: {
    width: 300,
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
});

export default InscripcionesScreen;
