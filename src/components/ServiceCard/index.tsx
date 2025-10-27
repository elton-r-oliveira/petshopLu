import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { themes } from "../../global/themes";

interface Service {
  id: string;
  name: string;
  price: string;
  duration: string;
  icon: string;
  description?: string;
}

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, isSelected, onSelect }) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(service)}
      style={{
        width: '48%',
        maxWidth: '48%', // 🟢 evita extrapolar
        backgroundColor: isSelected ? themes.colors.secundary : '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: isSelected ? themes.colors.corTexto : '#e0e0e0',
      }}
    >

      <View style={{ alignItems: 'center' }}>
        <Ionicons
          name={service.icon as any}
          size={32}
          color={isSelected ? '#fff' : themes.colors.secundary}
        />
        <Text
          style={{
            fontSize: 14,
            fontWeight: '700',
            color: isSelected ? '#fff' : themes.colors.corTexto,
            textAlign: 'center',
            marginTop: 8,
            marginBottom: 4,
          }}
        >
          {service.name}
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '800',
            color: isSelected ? '#fff' : themes.colors.secundary,
            marginBottom: 4,
          }}
        >
          R$ {service.price}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: isSelected ? '#fff' : '#666',
          }}
        >
          {service.duration}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ServiceCard;