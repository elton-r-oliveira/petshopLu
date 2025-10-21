import React, { useState } from "react";
import { Text, View, Image, TouchableOpacity, Alert, ActivityIndicator, TextInput } from "react-native";

import { style } from "./styles";
import Logo from "../../assets/logo.png";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import { themes } from "../../global/themes";
import { Input } from "../../components/input";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../@types/types";

// Firebase
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../lib/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

type CadastroScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Cadastro"
>;

type Props = {
  navigation: CadastroScreenNavigationProp;
};

export default function Cadastro({ navigation }: Props) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [tipo, setTipo] = useState<"cliente" | "funcionario">("cliente");
  const [codigoFuncionario, setCodigoFuncionario] = useState("");

  const CODIGO_SECRETO = "147"; // Altere para o código que só os funcionários terão

  async function handleCadastro() {
    try {
      setLoading(true);

      if (!nome || !email || !password || !confirmPassword) {
        setLoading(false);
        return Alert.alert("Atenção", "Preencha todos os campos!");
      }

      if (password !== confirmPassword) {
        setLoading(false);
        return Alert.alert("Atenção", "As senhas não coincidem!");
      }

      // Se for funcionário, validar o código
      if (tipo === "funcionario" && codigoFuncionario !== CODIGO_SECRETO) {
        setLoading(false);
        return Alert.alert("Atenção", "Código de funcionário inválido!");
      }

      // Criação do usuário no Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: nome });

      // Criação do documento no Firestore
      await setDoc(doc(db, "usuarios", userCredential.user.uid), {
        nome,
        email,
        tipo,
        codigo: tipo === "funcionario" ? codigoFuncionario : null,
      });

      Alert.alert("Conta criada com sucesso!");
      navigation.navigate("Login");
    } catch (error: any) {
      console.log("Erro no cadastro:", error.message);
      Alert.alert("Erro", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={style.container}>
      <View style={style.boxTop}>
        <Image source={Logo} />
        <Text style={style.titulo}>Bem-vindo a Lu PetShop</Text>
      </View>

      <View style={style.boxMid}>
        <Text style={style.entrar}>Cadastre-se</Text>

        {/* Toggle Cliente / Funcionário */}
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 10,
            marginTop: 20,
            marginBottom: 25,
            borderRadius: 25, // mantém bordas suaves
            overflow: "hidden", // garante que o arredondamento apareça
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: tipo === "cliente" ? themes.colors.secundary : "#ddd",
              paddingVertical: 10,
              alignItems: "center",
            }}
            onPress={() => setTipo("cliente")}
          >
            <Text
              style={{
                color: tipo === "cliente" ? "#fff" : "#555",
                fontWeight: "600",
              }}
            >
              Cliente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: tipo === "funcionario" ? themes.colors.secundary : "#ddd",
              paddingVertical: 10,
              alignItems: "center",
            }}
            onPress={() => setTipo("funcionario")}
          >
            <Text
              style={{
                color: tipo === "funcionario" ? "#fff" : "#555",
                fontWeight: "600",
              }}
            >
              Funcionário
            </Text>
          </TouchableOpacity>
        </View>


        {/* Nome + Código funcionário */}
        {tipo === "funcionario" ? (
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ flex: 1 }}>
              <Input
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
                IconRight={MaterialIcons}
                IconRightName="person"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Input
                placeholder="Código de funcionário"
                value={codigoFuncionario}
                onChangeText={setCodigoFuncionario}
                IconRight={MaterialIcons}
                IconRightName="badge" // ícone representando um crachá
              />
            </View>
          </View>
        ) : (
          <Input
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
            IconRight={MaterialIcons}
            IconRightName="person"
          />
        )}


        {/* Email */}
        <Input
          placeholder="E-mail"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          IconRight={MaterialIcons}
          IconRightName="email"
        />

        {/* Senha */}
        <Input
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          IconRight={Octicons}
          IconRightName="eye-closed"
        />

        {/* Confirmar senha */}
        <Input
          placeholder="Confirmar senha"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          IconRight={Octicons}
          IconRightName="eye-closed"
        />

        {/* Botão cadastrar */}
        <TouchableOpacity style={style.button} onPress={handleCadastro}>
          {loading ? (
            <ActivityIndicator color={themes.colors.lightGray} size="small" />
          ) : (
            <Text style={style.textButton}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        {/* Já tem conta? */}
        <Text style={style.textCadastro}>
          Já tem conta?{" "}
          <Text
            style={style.linkCadastro}
            onPress={() => navigation.navigate("Login")}
          >
            Fazer login
          </Text>
        </Text>
      </View>
    </View>
  );
}
