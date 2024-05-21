import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Login from "./screens/login";
import Hom from "./components/Navigation";
import Registro from "./screens/ScreenRegistro";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="login">
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen
            name="hom"
            component={Hom}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Registro" component={Registro} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
