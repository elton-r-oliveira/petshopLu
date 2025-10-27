import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { themes } from "../../global/themes";

import Home from "../../pages/Home";
import Pets from "../../pages/Pets";
import Agendar from "../../pages/Agendar";
import Saude from "../../pages/Saude";
import Perfil from "../../pages/Perfil";

const Tab = createBottomTabNavigator();
const corIcones = themes.BottomBar.cor_icones;

export default function BottomBar() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: themes.BottomBar.cor_fundo,
          height: 60 + (insets.bottom > 0 ? insets.bottom - 5 : 0),
          paddingTop: 5,
          // 🔥 não use paddingBottom extra aqui — o height já inclui o espaço seguro
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: themes.BottomBar.cor_icones,
        tabBarInactiveTintColor: themes.BottomBar.cor_icones,
        tabBarIcon: ({ size, focused }) => {
          const iconMap: Record<string, string[]> = {
            Home: ["home", "home-outline"],
            Pets: ["heart", "heart-outline"],
            Agendar: ["calendar", "calendar-outline"],
            Saúde: ["medical", "medical-outline"],
            Perfil: ["person-circle", "person-circle-outline"],
          };

          const [filled, outline] = iconMap[route.name] || ["help", "help-outline"];
          return (
            <Ionicons
              name={(focused ? filled : outline) as keyof typeof Ionicons.glyphMap}
              size={size}
              color={corIcones}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Pets" component={Pets} />
      <Tab.Screen name="Agendar" component={Agendar} />
      <Tab.Screen name="Saúde" component={Saude} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}
