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
import TopBar from "../../components/topBar";

import { useNavigation, NavigationProp } from '@react-navigation/native';
import { BottomTabParamList } from '../../@types/types';

import { auth } from "../../firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";

export default function Perfil() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);

            // Se o usuário sair, você pode redirecionar para a tela de Login aqui
            // if (!user) {
            //     navigation.replace('Login'); 
            // }
        });

        // Limpa o observador ao desmontar o componente
        return () => unsubscribe();
    }, []);

    // Pega o nome, ou usa um texto de fallback se não estiver logado
    const userName = currentUser?.displayName || "Usuário";

    return (
        <View style={{ flex: 1 }}>

            {/* Conteúdo com Scroll */}
            <ScrollView style={style.container} showsVerticalScrollIndicator={false}>

                {/* TopBar */}
                <TopBar
                    userName={userName}
                    onLogoPress={() => console.log("Logo clicada")}
                />
                
                <Text style={style.sectionTitle}>Tela de Perfil</Text>

                {/* Ações rápidas */}
                <View style={style.quickActions}>

                </View>

            </ScrollView>
        </View>
    );
}
