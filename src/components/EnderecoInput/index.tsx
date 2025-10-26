import React, { useState } from "react";
import { View, Text, TextInput, ActivityIndicator, Alert } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { style } from "./styles";
import { themes } from "../../global/themes";

interface EnderecoInputProps {
  cep: string;
  setCep: (value: string) => void;
  rua: string;
  setRua: (value: string) => void;
  cidade: string;
  setCidade: (value: string) => void;
  estado: string;
  setEstado: (value: string) => void;
  numero: string;
  setNumero: (value: string) => void;
  editable: boolean;
}

export default function EnderecoInput({
  cep,
  setCep,
  rua,
  setRua,
  cidade,
  setCidade,
  estado,
  setEstado,
  numero,
  setNumero,
  editable,
}: EnderecoInputProps) {
  const [loading, setLoading] = useState(false);

  function formatarCep(value: string) {
    const numeric = value.replace(/\D/g, "");
    if (numeric.length > 5) {
      return numeric.replace(/(\d{5})(\d{1,3})/, "$1-$2");
    }
    return numeric;
  }

  async function buscarEnderecoPorCep(cepLimpo: string) {
    setLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        Alert.alert("CEP inválido", "Não foi possível encontrar este CEP.");
        setRua("");
        setCidade("");
        setEstado("");
        return;
      }

      setRua(data.logradouro || "");
      setCidade(data.localidade || "");
      setEstado(data.uf || "");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível buscar o endereço. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ gap: 10 }}>
      {/* 🔹 Primeira linha: CEP e Número */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}>
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
              placeholderTextColor={themes.telaPerfil.textos_placeholder}
              keyboardType="numeric"
              maxLength={9}
              value={cep}
              onChangeText={(value) => {
                const formatted = formatarCep(value);
                setCep(formatted);
                const cleanCep = formatted.replace(/\D/g, "");
                if (cleanCep.length === 8) {
                  buscarEnderecoPorCep(cleanCep);
                }
              }}
              editable={editable}
            />
            {loading && <ActivityIndicator size="small" color={themes.colors.secundary} />}
          </View>
        </View>

        <View style={{ flex: 1 }}>
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
              placeholder="Número"
              placeholderTextColor={themes.telaPerfil.textos_placeholder}
              keyboardType="numeric"
              value={numero}
              onChangeText={setNumero}
              editable={editable}
            />
          </View>
        </View>
      </View>

      {/* 🔹 Rua */}
      <View>
        <Text style={style.inputLabel}>Rua</Text>
        <View style={[style.selectInput, {backgroundColor: themes.telaPerfil.nao_editavel}]}>
          <Ionicons
            name="location-outline"
            size={20}
            color={themes.colors.secundary}
            style={style.inputIcon}
          />
          <TextInput
            style={[style.selectInputText, { color: rua ? themes.telaPerfil.textos_labels : themes.telaPerfil.textos_placeholder }]}
            placeholder="Rua"
            placeholderTextColor={themes.telaPerfil.textos_placeholder}
            value={rua}
            onChangeText={setRua}
            editable={false}
          />
        </View>
      </View>

      {/* 🔹 Cidade e Estado */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 2 }}>
          <Text style={style.inputLabel}>Cidade</Text>
          <View style={[style.selectInput, {backgroundColor: themes.telaPerfil.nao_editavel}]}>
            <Ionicons
              name="business-outline"
              size={20}
              color={themes.colors.secundary}
              style={style.inputIcon}
            />
            <TextInput
              style={[style.selectInputText, { color: cidade ? themes.telaPerfil.textos_labels : themes.telaPerfil.textos_placeholder }]}
              value={cidade}
              placeholder="Cidade"
              placeholderTextColor={themes.telaPerfil.textos_placeholder}
              editable={false}
            />
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={style.inputLabel}>Estado</Text>
          <View style={[style.selectInput, {backgroundColor: themes.telaPerfil.nao_editavel}]}>
            <Ionicons
              name="flag-outline"
              size={20}
              color={themes.colors.secundary}
              style={style.inputIcon}
            />
            <TextInput
              style={[style.selectInputText, { color: estado ? themes.telaPerfil.textos_labels : themes.telaPerfil.textos_placeholder }]}
              value={estado}
              placeholder="UF"
              placeholderTextColor={themes.telaPerfil.textos_placeholder}
              editable={false}
            />
          </View>
        </View>
      </View>
    </View>
  );
}