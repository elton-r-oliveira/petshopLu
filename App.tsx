import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, Text } from "react-native"; // ✅ Adicione Text aqui
import { SafeAreaProvider } from "react-native-safe-area-context";
import Routes from "./src/routes";

import { Inter_100Thin, Inter_200ExtraLight, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, Inter_900Black, Inter_100Thin_Italic, Inter_200ExtraLight_Italic, Inter_300Light_Italic, Inter_400Regular_Italic, Inter_500Medium_Italic, Inter_600SemiBold_Italic, Inter_700Bold_Italic, Inter_800ExtraBold_Italic, Inter_900Black_Italic, useFonts, } from "@expo-google-fonts/inter";

import { Baloo2_400Regular, Baloo2_500Medium, Baloo2_600SemiBold, Baloo2_700Bold, Baloo2_800ExtraBold, } from "@expo-google-fonts/baloo-2";

export default function App() {
  const [fontsLoaded] = useFonts({
    Baloo2_400Regular,
    Baloo2_700Bold,
    Baloo2_500Medium,
    Baloo2_600SemiBold,
    Baloo2_800ExtraBold,
    Inter_400Regular,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
    Inter_100Thin_Italic,
    Inter_200ExtraLight_Italic,
    Inter_300Light_Italic,
    Inter_400Regular_Italic,
    Inter_500Medium_Italic,
    Inter_600SemiBold_Italic,
    Inter_700Bold_Italic,
    Inter_800ExtraBold_Italic,
    Inter_900Black_Italic,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Routes />
    </SafeAreaProvider>
  );
}