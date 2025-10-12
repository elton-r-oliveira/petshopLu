// pages/Agendar/index.tsx
import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { style } from "./styles";
import { MaterialIcons } from "@expo/vector-icons";
import { themes } from "../../global/themes";

export default function Agendar() {
    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={style.container} showsVerticalScrollIndicator={false}>
                <Text style={style.sectionTitle}>Agendar Serviço</Text>

                <View style={style.petCard}>
                    <View style={style.petLeft}>
                        <Image
                            source={require("../../assets/alfred.png")}
                            style={style.petImage}
                        />
                        <View style={style.petInfo}>
                            <Text style={style.petName}>Alfred</Text>
                            <Text style={style.petRace}>Beagle - 4 anos</Text>
                        </View>
                    </View>

                    <View style={style.actions}>
                        <TouchableOpacity style={[style.iconButton, { backgroundColor: themes.colors.bgScreen }]}>
                            <MaterialIcons name="edit" size={20} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity style={[style.iconButton, { backgroundColor: "red" }]}>
                            <MaterialIcons name="delete" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
