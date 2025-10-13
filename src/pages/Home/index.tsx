// Home.tsx
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { style } from "./styles";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { themes } from "../../global/themes";
import TopBar from "../../components/topBar";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { BottomTabParamList } from '../../@types/types';

import { auth, db } from "../../firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Home() {
  const navigation = useNavigation<NavigationProp<BottomTabParamList>>();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Estados para TopBar
  const [topBarNome, setTopBarNome] = useState("");
  const [topBarEndereco, setTopBarEndereco] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        // Atualiza TopBar apenas quando o usuário estiver definido
        setTopBarNome(user.displayName || "");

        // Se você também estiver salvando endereço no Firestore, carregue aqui
        try {
          const docRef = doc(db, "usuarios", user.uid);
          const snapshot = await getDoc(docRef);
          if (snapshot.exists()) {
            const data = snapshot.data();
            setTopBarEndereco(data.endereco || "");
          } else {
            setTopBarEndereco("Endereço não informado");
          }
        } catch (error) {
          console.error("Erro ao carregar endereço:", error);
          setTopBarEndereco("Endereço não informado");
        }
      }
    });

    return () => unsubscribe();
  }, []);  
  return (
    <ScrollView style={style.container} showsVerticalScrollIndicator={false}>
      {/* TopBar */}
      <TopBar
        userName={topBarNome || "Usuário"}
        location={topBarEndereco || "Endereço não informado"}
      />
      {/* Seção de ações rápidas */}
      <Text style={style.sectionTitle}>O que você gostaria de fazer?</Text>

      <View style={style.quickActions}>

        <TouchableOpacity
          style={[style.actionBox, { backgroundColor: themes.telaHome.texto1 }]}
          onPress={() => navigation.navigate('Pets')} // Navega para Pets
        >
          <MaterialIcons name="add-circle-outline" size={35} color={themes.telaHome.fundo} />
          <Text style={[style.actionText, { color: themes.telaHome.fundo }]}>Meus Pets</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[style.actionBox, { backgroundColor: themes.telaHome.fundo2 }]}
          onPress={() => navigation.navigate('Agendar')} // Navega para Histórico
        >
          <FontAwesome name="calendar-plus-o" size={35} color={themes.telaHome.fundo} />
          <Text style={[style.actionText, { color: themes.telaHome.fundo }]}>Agendar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[style.actionBox, { borderWidth: 3, borderColor: themes.telaHome.texto2 }]}
          onPress={() => navigation.navigate('Histórico')} // Navega para Histórico
        >
          <Ionicons name="list" size={35} color={themes.colors.iconeQuickAcess1} />
          <Text style={style.actionText}>Agendamentos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[style.actionBox, { borderWidth: 3, borderColor: themes.telaHome.texto2 }]}
          onPress={() => navigation.navigate('Perfil')} // Navega para Perfil
        >
          <Ionicons name="person-circle-outline" size={35} color={themes.telaHome.texto1} />
          <Text style={style.actionText}>Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Atividades recentes */}
      <Text style={style.sectionTitle}>Atividades Recentes</Text>

      <View style={style.petCard}>
        <View style={style.petInfo}>
          <Text style={style.petService}>Banho e Tosa - Alfred</Text>
          <Text style={style.horario}>Agendado para 20/09 às 14:00</Text>
        </View>
        <View style={style.favoriteTextContainer}>
          <Text style={{ color: 'green', fontWeight: 'bold' }}>Concluído</Text>
        </View>
      </View>

      <View style={style.petCard}>
        <View style={style.petInfo}>
          <Text style={style.petService}>Banho e Tosa Higiênica - Bia</Text>
          <Text style={style.horario}>Agendado para 21/09 às 14:00</Text>
        </View>
        <View style={style.favoriteTextContainer}>
          <Text style={{ color: 'green', fontWeight: 'bold' }}>Concluído</Text>
        </View>
      </View>

      <View style={style.petCard}>
        <View style={style.petInfo}>
          <Text style={style.petService}>Terapia - Milin</Text>
          <Text style={style.horario}>Agendado para 25/09 às 11:00</Text>
        </View>
        <View style={style.favoriteTextContainer}>
          <Text style={{ color: 'red', fontWeight: 'bold' }}>R$ 75,00</Text>
        </View>
      </View>

      <View style={style.petCard}>
        <View style={style.petInfo}>
          <Text style={style.petService}>Natação - Margaret</Text>
          <Text style={style.horario}>Agendado para 30/09 às 15:00</Text>
        </View>
        <View style={style.favoriteTextContainer}>
          <Text style={{ color: 'red', fontWeight: 'bold' }}>R$ 30,00</Text>
        </View>
      </View>
    </ScrollView>
  );
}
