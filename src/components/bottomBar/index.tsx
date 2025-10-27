import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { themes } from "../../global/themes";

// Telas
import Home from "../../pages/Home";
import Pets from "../../pages/Pets";
import Agendar from "../../pages/Agendar";
import Saude from "../../pages/Saude";
import Perfil from "../../pages/Perfil";

const Tab = createBottomTabNavigator();

// cor do icones
const corIcones = themes.BottomBar.cor_icones;

export default function BottomBar() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: {
                    backgroundColor: themes.BottomBar.cor_fundo,
                    height: 65,
                    paddingTop: 5,
                    // ✅ ADICIONE ESTAS LINHAS PARA SAFE AREA
                    paddingBottom: 5,
                    position: 'absolute',
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
                    if (route.name === "Home") {
                        return (
                            <Ionicons
                                name={focused ? "home" : "home-outline"}
                                size={size}
                                color={corIcones}
                            />
                        );
                    } else if (route.name === "Pets") {
                        return (
                            <Ionicons
                                name={focused ? "heart" : "heart-outline"}
                                size={size}
                                color={corIcones}
                            />
                        );
                    } else if (route.name === "Agendar") {
                        return (
                            <Ionicons
                                name={focused ? "calendar" : "calendar-outline"}
                                size={size}
                                color={corIcones}
                            />
                        );
                    } else if (route.name === "Saúde") {
                        return (
                            <Ionicons
                                name={focused ? "medical" : "medical-outline"}
                                size={size}
                                color={corIcones}
                            />
                        );
                    }
                    else if (route.name === "Perfil") {
                        return (
                            <Ionicons
                                name={focused ? "person-circle" : "person-circle-outline"}
                                size={size}
                                color={corIcones}
                            />
                        )
                    }
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