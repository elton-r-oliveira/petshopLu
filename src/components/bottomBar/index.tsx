import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { themes } from "../../global/themes";

// Telas
import Home from "../../pages/Home";
import Pets from "../../pages/Pets";
import Agendar from "../../pages/Agendar";
import Historico from "../../pages/Historico";
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
                },
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
                    } else if (route.name === "Shop") {
                        return focused ? (
                            <Ionicons name="cart" size={size} color={corIcones} />
                        ) : (
                            <Ionicons name="cart-outline" size={size} color={corIcones} />
                        );
                    } else if (route.name === "Vacinas") {
                        return focused ? (
                            <MaterialCommunityIcons name="clock" size={size} color={corIcones} />
                        ) : (
                            <MaterialCommunityIcons name="clock-outline" size={size} color={corIcones} />
                        );
                    } else if (route.name === "Perfil") {
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
            <Tab.Screen name="Shop" component={Historico} />
            <Tab.Screen name="Vacinas" component={Historico} />
            <Tab.Screen name="Perfil" component={Perfil} />
        </Tab.Navigator>
    );
}
