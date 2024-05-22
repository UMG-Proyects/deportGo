import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Login from "./screens/login";
import Registro from "./screens/ScreenRegistro";
import Navigation from "./components/Navigation";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="login">
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="Registro" component={Registro} />
          <Stack.Screen
            name="hom"
            component={Navigation}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
