import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import API_URL from "../src/config/config";

const { height } = Dimensions.get("window");

const App = () => {
  const navigation = useNavigation();
  const [eventos, setEventos] = useState([]);
  const [deportes, setDeportes] = useState([]);
  const [currentEvento, setCurrentEvento] = useState({
    id_deporte: "",
  });
  const [encuentros, setEncuentros] = useState([]);

  useEffect(() => {
    fetchDeportes();
  }, []);

  const fetchDeportes = async () => {
    try {
      const response = await fetch(`${API_URL}listarDeportes`);
      const data = await response.json();
      setDeportes(data);
    } catch (error) {
      console.error("Error fetching deportes:", error);
    }
  };

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch(`${API_URL}listarEventos`);
        const data = await response.json();
        setEventos(data); // Mostrar todos los eventos
      } catch (error) {
        console.error(error);
      }
    };

    fetchEventos();
  }, []);

  useEffect(() => {
    if (currentEvento.id_deporte) {
      const fetchEncuentros = async () => {
        try {
          const response = await fetch(
            `${API_URL}listarEncuentros?id_deporte=${currentEvento.id_deporte}`,
          );
          const data = await response.json();
          setEncuentros(data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchEncuentros();
    }
  }, [currentEvento.id_deporte]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../src/Image/fondo2.webp")} // Ruta de tu imagen
        style={styles.headerImage}
        resizeMode="contain"
      />
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Eventos</Text>
        <View style={styles.eventListContainer}>
          <FlatList
            data={eventos}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            renderItem={({ item }) => (
              <View style={styles.eventItemContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    navigation.navigate("Inscripciones", {
                      id: item.id,
                    })
                  }
                >
                  <Image
                    source={{ uri: item.imagen }}
                    style={styles.buttonIcon}
                  />
                </TouchableOpacity>
                <Text style={styles.buttonText}>{item.nombre}</Text>
              </View>
            )}
            style={styles.eventList}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Encuentros</Text>
          <Picker
            selectedValue={currentEvento.id_deporte}
            onValueChange={(itemValue) =>
              setCurrentEvento({ ...currentEvento, id_deporte: itemValue })
            }
            style={styles.picker}
          >
            <Picker.Item label="Deportes..." value={null} />
            {deportes &&
              deportes.map((deporte) => (
                <Picker.Item
                  key={deporte.id}
                  label={deporte.nombre}
                  value={deporte.id}
                />
              ))}
          </Picker>
        </View>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Equipo A</Text>
            <Text style={styles.tableHeaderText}>vs</Text>
            <Text style={styles.tableHeaderText}>Equipo B</Text>
            <Text style={styles.tableHeaderText}>Hora</Text>
            <Text style={styles.tableHeaderText}>Cancha</Text>
            <Text style={styles.tableHeaderText}>Dirección</Text>
          </View>
          {encuentros.map((encuentro) => (
            <View key={encuentro.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{encuentro.equipoA}</Text>
              <Text style={styles.tableCell}>vs</Text>
              <Text style={styles.tableCell}>{encuentro.equipoB}</Text>
              <Text style={styles.tableCell}>{encuentro.hora}</Text>
              <Text style={styles.tableCell}>{encuentro.cancha}</Text>
              <Text style={styles.tableCell}>{encuentro.direccion}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#000067", // El color azul proporcionado
  },
  headerImage: {
    width: "100%",
    height: height * 0.5, // Ajustar a 25% de la altura de la pantalla
    marginTop: -10,
  },
  content: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginVertical: 10,
  },
  eventListContainer: {
    width: "100%",
  },
  eventList: {
    maxHeight: 300,
  },
  eventItemContainer: {
    width: 120,
    marginHorizontal: 10,
    alignItems: "center",
  },
  button: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0869C9",
    borderRadius: 15,
  },
  buttonIcon: {
    width: 100,
    height: 100,
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 15,
    marginTop: 5,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    flexWrap: "wrap",
    width: 100, // Asegura que el texto se ajuste al ancho del botón
  },
  picker: {
    height: 30,
    width: 200,
    color: "white",
  },
  tableContainer: {},
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 10,
  },
  tableHeaderText: {
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 10,
    marginTop: 5,
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
  },
});

export default App;
