import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../pages/login";
import Cadastro from "../pages/cadastro";
import { RootStackParamList } from "../routes/types";
import BottomBar from "../components/bottomBar"

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
          options={{
            animation: "slide_from_left",
          }}
        />

        <Stack.Screen
          name="Cadastro"
          component={Cadastro}
          options={{
            animation: "slide_from_right",
          }}
        />

        <Stack.Screen
          name="Home"
          component={BottomBar}
          options={{
            animation: "fade",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
