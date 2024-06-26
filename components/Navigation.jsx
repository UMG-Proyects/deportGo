import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "../screens/ScreenHome";
import Perfil from "../screens/ScreenPerfil";
import Ajustes from "../screens/ScreenAjustes";
import Deportes from "../screens/ScreenDeporte";
import Categorias from "../screens/ScreenCategoria";
import Arbitros from "../screens/ScreenArbitro";
import Patrocinadores from "../screens/ScreenPatrocinadores";
import Organizadores from "../screens/ScreenOrganizador";
import Eventos from "../screens/ScreenEvento";
import Inscripciones from "../screens/ScreenInscripcion";
import Equipos from "../screens/ScreenEquipo";
import Calendarios from "../screens/ScreenCalendario";
import { MaterialIcons } from "@expo/vector-icons"; // Importa los iconos de MaterialIcons
import Nav from "../components/Nav";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Ajustes"
        component={Ajustes}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={({ navigation, route }) => ({
        header: () => <Nav navigation={navigation} title={route.name} />,
      })}
    >
      <Drawer.Screen name="Homes" component={BottomTabNavigator} />
      <Drawer.Screen name="Deportes" component={Deportes} />
      <Drawer.Screen name="Categorias" component={Categorias} />
      <Drawer.Screen name="Arbitros" component={Arbitros} />
      <Drawer.Screen name="Patrocinadores" component={Patrocinadores} />
      <Drawer.Screen name="Organizadores" component={Organizadores} />
      <Drawer.Screen name="Eventos" component={Eventos} />
      <Drawer.Screen name="Inscripciones" component={Inscripciones} />
      <Drawer.Screen name="Equipos" component={Equipos} />
      <Drawer.Screen name="Calendarios" component={Calendarios} />
    </Drawer.Navigator>
  );
};

export default function Navigation() {
  return <DrawerNavigator />;
}
