import React from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { style } from "./styles";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { themes } from "../../global/themes";
import TopBar from "../../components/topBar";

export default function Agendar() {
    return (
        <View style={{ flex: 1 }}>

            {/* Conteúdo com Scroll */}
            <ScrollView style={style.container} showsVerticalScrollIndicator={false}>

                {/* TopBar */}
                <TopBar onLogoPress={() =>
                    console.log("Logo clicada")}
                />

                <Text style={style.sectionTitle}>Tela de Agendamentos</Text>

                {/* Ações rápidas */}
                <View style={style.quickActions}>

                </View>

            </ScrollView>
        </View>
    );
}
