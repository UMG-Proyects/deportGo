import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Perfil from "../screens/ScreenPerfil";
import Ajustes from "../screens/ScreenAjustes";
import Home from "../screens/ScreenHome";
import { MaterialIcons } from "@expo/vector-icons"; // Importa los iconos de MaterialIcons

const Tab = createBottomTabNavigator();

export default function Hom() {
  return (
    <Tab.Navigator>
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
}
