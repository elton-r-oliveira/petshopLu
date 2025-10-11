import React, { useState } from "react";
import { Text, View, Image, TouchableOpacity, Alert, ActivityIndicator, } from "react-native";

import { style } from "./styles";
import Logo from "../../assets/logo.png";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import { themes } from "../../global/themes";
import { Input } from "../../components/input";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/types";

// Firebase
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebaseConfig"

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

      // Cria usuário no Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // ✅ NOVO PASSO: Salvar o Nome do usuário no perfil do Firebase
      await updateProfile(userCredential.user, {
        displayName: nome // Salva a variável de estado 'nome' como displayName
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

        {/* Nome */}
        <Input
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
          IconRight={MaterialIcons}
          IconRightName="person"
        />

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
