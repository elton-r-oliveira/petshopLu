import React, { useEffect, useState } from "react";
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

import { useNavigation, NavigationProp } from '@react-navigation/native';
import { BottomTabParamList } from '../../@types/types'; 

import { auth } from "../../lib/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";

export default function Pets() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        return () => unsubscribe();
    }, []);

    const userName = currentUser?.displayName || "Usuário";

    return (
        <View style={{ flex: 1 }}>

            {/* Conteúdo com Scroll */}
            <ScrollView style={style.container} showsVerticalScrollIndicator={false}>

                <Text style={style.sectionTitle}>Tela de Saúde</Text>

                {/* Ações rápidas */}
                <View style={style.quickActions}>

                </View>

            </ScrollView>
        </View>
    );
}
