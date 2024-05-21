import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Perfil from "./ScreenPerfil";
import Ajustes from "./ScreenAjustes";
import Home from "./ScreenHome";
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
