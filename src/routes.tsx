import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./pages/login";
import Cadastro from "./pages/cadastro";
import editarUsuario from "./pages/editarUsuario";
import { RootStackParamList } from "./types";
import BottomBar from "./components/bottomBar";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ animation: "slide_from_left" }}
        />

        <Stack.Screen
          name="Cadastro"
          component={Cadastro}
          options={{ animation: "slide_from_right" }}
        />

        <Stack.Screen
          name="Home"
          component={BottomBar}
          options={{ animation: "fade" }}
        />

        {/* ✅ Tela de edição do usuário */}
        <Stack.Screen
          name="editarUsuario"
          component={editarUsuario}
          options={{
            animation: "slide_from_bottom",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
