import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./pages/login";
import Cadastro from "./pages/cadastro";
import { RootStackParamList } from "./@types/types";
import BottomBar from "./components/bottomBar";
import Pets from "./pages/Pets";
import CadastrarPet from "./pages/CadastrarPet";
import Saude from "./pages/Saude";

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

        {/* 🚀 NOVA TELA: Listagem de Pets */}
        <Stack.Screen
          name="MeusPets" // Nome que será usado para navegação
          component={Pets}
          options={{
            animation: "slide_from_bottom", // Pode escolher a animação que preferir
          }}
        />

        <Stack.Screen
          name="Saude"
          component={Saude}
          options={{
            animation: "slide_from_right",
          }}
        />

        {/* 🚀 NOVA TELA: Cadastro de Pet */}
        <Stack.Screen
          name="CadastrarPet" // Nome que será usado para navegação
          component={CadastrarPet}
          options={{
            animation: "slide_from_right",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
