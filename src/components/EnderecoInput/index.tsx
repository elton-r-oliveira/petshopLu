import React, { useState } from "react";
import { View, Text, TextInput, ActivityIndicator, Alert } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { style } from "./styles";
import { themes } from "../../global/themes";

interface EnderecoInputProps {
  endereco: string;
  setEndereco: (value: string) => void;
  editable: boolean;
}

export default function EnderecoInput({ endereco, setEndereco, editable }: EnderecoInputProps) {
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [loading, setLoading] = useState(false);

  async function buscarEnderecoPorCep(value: string) {
    const cepLimpo = value.replace(/\D/g, ""); // remove caracteres não numéricos

    if (cepLimpo.length !== 8) return; // CEP válido tem 8 dígitos

    setLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        Alert.alert("CEP inválido", "Não foi possível encontrar este CEP.");
        return;
      }

      // Monta o endereço completo
      const enderecoCompleto = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
      setEndereco(enderecoCompleto);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível buscar o endereço. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ gap: 10 }}>
      <Text style={style.inputLabel}>CEP</Text>
      <View style={style.selectInput}>
        <MaterialIcons
          name="location-searching"
          size={20}
          color={themes.colors.secundary}
          style={style.inputIcon}
        />
        <TextInput
          style={style.selectInputText}
          placeholder="Digite o CEP"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={cep}
          onChangeText={(value) => {
            setCep(value);
            if (value.replace(/\D/g, "").length === 8) {
              buscarEnderecoPorCep(value);
            }
          }}
          editable={editable}
        />
        {loading && <ActivityIndicator size="small" color={themes.colors.secundary} />}
      </View>

      <Text style={style.inputLabel}>Endereço</Text>
      <View style={style.selectInput}>
        <Ionicons
          name="location-outline"
          size={20}
          color={themes.colors.secundary}
          style={style.inputIcon}
        />
        <TextInput
          style={[style.selectInputText, { color: editable ? "#FFF" : "#888" }]}
          value={endereco}
          onChangeText={setEndereco}
          placeholder="Rua, bairro, cidade - UF"
          placeholderTextColor="#888"
          editable={editable}
        />
      </View>

      <Text style={style.inputLabel}>Número</Text>
      <View style={style.selectInput}>
        <Ionicons
          name="home-outline"
          size={20}
          color={themes.colors.secundary}
          style={style.inputIcon}
        />
        <TextInput
          style={style.selectInputText}
          placeholder="Número da residência"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={numero}
          onChangeText={setNumero}
          editable={editable}
        />
      </View>
    </View>
  );
}
