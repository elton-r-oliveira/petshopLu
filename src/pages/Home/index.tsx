// Home.tsx
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { style } from "./styles";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { themes } from "../../global/themes";
import TopBar from "../../components/topBar";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { BottomTabParamList } from '../../@types/types';
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { auth, db } from "../../lib/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs, Timestamp, orderBy, limit } from "firebase/firestore";

// Interface para o agendamento
interface Agendamento {
  id: string;
  service: string;
  dataHoraAgendamento: Date;
  petNome: string;
  status: string;
  diasRestantes?: number;
}

export default function Home() {
  const navigation = useNavigation<NavigationProp<BottomTabParamList>>();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [agendamentosRecentes, setAgendamentosRecentes] = useState<Agendamento[]>([]);
  const [loadingAgendamentos, setLoadingAgendamentos] = useState(true);
  const insets = useSafeAreaInsets();

  const [topBarNome, setTopBarNome] = useState("");
  const [topBarEndereco, setTopBarEndereco] = useState("");

  // Função para calcular dias restantes
  const calcularDiasRestantes = (dataAgendamento: Date): number => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const dataAgend = new Date(dataAgendamento);
    dataAgend.setHours(0, 0, 0, 0);
    
    const diffTime = dataAgend.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Função para carregar agendamentos recentes
  const carregarAgendamentosRecentes = async (userId: string) => {
    try {
      setLoadingAgendamentos(true);
      
      // Buscar agendamentos futuros e pendentes do usuário
      const agora = Timestamp.now();
      const q = query(
        collection(db, "agendamentos"),
        where("userId", "==", userId),
        where("dataHoraAgendamento", ">=", agora),
        where("status", "in", ["Pendente", "Confirmado"]),
        orderBy("dataHoraAgendamento", "asc"),
        limit(5) // Limita a 5 agendamentos mais recentes
      );

      const querySnapshot = await getDocs(q);
      const agendamentos: Agendamento[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Converter Timestamp para Date
        let dataHoraAgendamento: Date;
        if (data.dataHoraAgendamento && data.dataHoraAgendamento.toDate) {
          dataHoraAgendamento = data.dataHoraAgendamento.toDate();
        } else {
          dataHoraAgendamento = new Date(data.dataHoraAgendamento);
        }

        const diasRestantes = calcularDiasRestantes(dataHoraAgendamento);

        // Só mostra agendamentos futuros
        if (diasRestantes >= 0) {
          agendamentos.push({
            id: doc.id,
            service: data.service,
            dataHoraAgendamento: dataHoraAgendamento,
            petNome: data.petNome || "Pet",
            status: data.status,
            diasRestantes: diasRestantes
          });
        }
      });

      setAgendamentosRecentes(agendamentos);
    } catch (error) {
      console.error("Erro ao carregar agendamentos recentes:", error);
    } finally {
      setLoadingAgendamentos(false);
    }
  };

  // Função para formatar data
  const formatarData = (date: Date): string => {
    return date.toLocaleDateString('pt-BR');
  };

  // Função para formatar hora
  const formatarHora = (date: Date): string => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // Função para obter texto dos dias restantes
  const getTextoDiasRestantes = (dias: number): string => {
    if (dias === 0) return "Hoje";
    if (dias === 1) return "Amanhã";
    if (dias > 1) return `Faltam ${dias} dias`;
    return "Data passada";
  };

  // Função para obter cor baseada nos dias restantes
  const getCorDiasRestantes = (dias: number): string => {
    if (dias === 0) return "#FF6B35"; // Laranja para hoje
    if (dias === 1) return "#FFA726"; // Laranja claro para amanhã
    if (dias <= 3) return "#42A5F5"; // Azul para até 3 dias
    return "#4CAF50"; // Verde para mais de 3 dias
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setTopBarNome(user.displayName || "");
        
        // Carregar agendamentos do usuário
        carregarAgendamentosRecentes(user.uid);

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
      } else {
        setAgendamentosRecentes([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Recarregar agendamentos quando a tela ganhar foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (currentUser) {
        carregarAgendamentosRecentes(currentUser.uid);
      }
    });

    return unsubscribe;
  }, [navigation, currentUser]);

  return (
    <View style={{ flex: 1, backgroundColor: themes.telaHome.fundo }}>

      {/* TopBar fixa */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: themes.telaHome.fundo,
        }}
      >
        <TopBar
          userName={topBarNome || ""}
          location={topBarEndereco || "Endereço não informado"}
        />
      </View>

      {/* Conteúdo rolável */}
      <ScrollView
        style={style.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 120,
          paddingBottom: insets.bottom + 80,
        }}
      >
        <Text style={style.sectionTitle}>O que você gostaria de fazer?</Text>

        <View style={style.quickActions}>
          <TouchableOpacity
            style={[style.actionBox, { backgroundColor: themes.telaHome.texto1 }]}
            onPress={() => navigation.navigate("Pets")}
          >
            <MaterialIcons name="add-circle-outline" size={35} color={themes.telaHome.fundo} />
            <Text style={[style.actionText, { color: themes.telaHome.fundo }]}>Meus Pets</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[style.actionBox, { backgroundColor: themes.telaHome.fundo2 }]}
            onPress={() => navigation.navigate("Agendar")}
          >
            <FontAwesome name="calendar-plus-o" size={35} color={themes.telaHome.fundo} />
            <Text style={[style.actionText, { color: themes.telaHome.fundo }]}>Agendar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[style.actionBox, { borderWidth: 3, borderColor: themes.telaHome.texto2 }]}
            onPress={() => navigation.navigate("Saúde")}
          >
            <Ionicons name="medical" size={35} color={themes.colors.iconeQuickAcess1} />
            <Text style={style.actionText}>Saúde</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[style.actionBox, { borderWidth: 3, borderColor: themes.telaHome.texto2 }]}
            onPress={() => navigation.navigate("Perfil")}
          >
            <Ionicons name="person-circle-outline" size={35} color={themes.telaHome.texto1} />
            <Text style={style.actionText}>Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Atividades recentes - AGENDAMENTOS FUTUROS */}
        <Text style={style.sectionTitle}>Próximos Agendamentos</Text>

        {loadingAgendamentos ? (
          <View style={style.petCard}>
            <Text style={style.petService}>Carregando agendamentos...</Text>
          </View>
        ) : agendamentosRecentes.length === 0 ? (
          <View style={style.petCard}>
            <View style={style.petInfo}>
              <Text style={style.petService}>Nenhum agendamento futuro</Text>
              <Text style={style.horario}>Agende um serviço para ver aqui</Text>
            </View>
          </View>
        ) : (
          agendamentosRecentes.map((agendamento) => (
            <View key={agendamento.id} style={style.petCard}>
              <View style={style.petInfo}>
                <Text style={style.petService}>
                  {agendamento.service} - {agendamento.petNome}
                </Text>
                <Text style={style.horario}>
                  Agendado para {formatarData(agendamento.dataHoraAgendamento)} às {formatarHora(agendamento.dataHoraAgendamento)}
                </Text>
              </View>
              <View style={style.favoriteTextContainer}>
                <Text 
                  style={{ 
                    color: getCorDiasRestantes(agendamento.diasRestantes || 0), 
                    fontWeight: 'bold',
                    fontSize: 14
                  }}
                >
                  {getTextoDiasRestantes(agendamento.diasRestantes || 0)}
                </Text>
                <Text 
                  style={{ 
                    color: '#666',
                    fontSize: 12,
                    marginTop: 4
                  }}
                >
                  {agendamento.status}
                </Text>
              </View>
            </View>
          ))
        )}
        
      </ScrollView>
    </View>
  );
}