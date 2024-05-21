import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { HomeScreen } from "../screens/ScreenHome";
import { ProfileScreen } from "../screens/ScreenPerfil";
import { SettingScreen } from "../screens/ScreenAjustes";
import { DeportScreen } from "../screens/ScreenDeporte";
import { CategoryScreen } from "../screens/ScreenCategoria";
import { ReferyScreen } from "../screens/ScreenArbitro";

const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const BottomTabNavigator = () => {
  return (
    <BottomTab.Navigator>
      <BottomTab.Screen name="Home" component={HomeScreen} />
      <BottomTab.Screen name="Perfil" component={ProfileScreen} />
      <BottomTab.Screen name="Ajustes" component={SettingScreen} />
    </BottomTab.Navigator>
  );
};

const Nav = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Main" component={BottomTabNavigator} />
        <Drawer.Screen name="Deportes" component={DeportScreen} />
        <Drawer.Screen name="Categorias" component={CategoryScreen} />
        <Drawer.Screen name="Arbitros" component={ReferyScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default Nav;
