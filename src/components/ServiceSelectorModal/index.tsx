import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { themes } from '../../global/themes';
import ServiceCard from '../ServiceCard';

export interface Service {
  id: string;
  name: string;
  price: string;
  duration: string;
  icon: string;
  description?: string;
}

interface ServiceSelectorModalProps {
  visible: boolean;
  services: Service[];
  selectedService: Service | null;
  onSelectService: (service: Service) => void;
  onConfirm: (service: Service) => void;
  onClose: () => void;
}

const { height: screenHeight } = Dimensions.get('window');

const ServiceSelectorModal: React.FC<ServiceSelectorModalProps> = ({
  visible,
  services,
  selectedService,
  onSelectService,
  onConfirm,
  onClose,
}) => {
  useEffect(() => {
    if (visible) {
      console.log('Serviços no modal:', services);
      console.log('Número de serviços:', services.length);
    }
  }, [visible, services]);

  const handleConfirm = () => {
    if (selectedService) {
      onConfirm(selectedService);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* 🔹 Header fixo */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecione o Serviço</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={themes.colors.corTexto} />
            </TouchableOpacity>
          </View>

          {/* 🔹 Subtítulo fixo */}
          <Text style={styles.modalSubtitle}>
            Escolha o serviço desejado para seu pet
          </Text>

          {/* 🔹 Área rolável */}
          <ScrollView
            style={styles.scrollArea}
            showsVerticalScrollIndicator
            contentContainerStyle={{ paddingBottom: 120 }} // espaço para o botão fixo
          >
            <View style={styles.servicesGrid}>
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isSelected={selectedService?.id === service.id}
                  onSelect={onSelectService} // ✅ só seleciona
                />
              ))}
            </View>
          </ScrollView>

          {/* 🔹 Botão SEMPRE VISÍVEL no rodapé */}
          <View style={styles.footerFixed}>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                {
                  backgroundColor: selectedService 
                    ? themes.colors.secundary 
                    : '#ccc',
                  opacity: selectedService ? 1 : 0.6,
                }
              ]}
              onPress={handleConfirm}
              disabled={!selectedService}
            >
              <Text style={[
                styles.confirmButtonText,
                { color: selectedService ? '#fff' : '#999' }
              ]}>
                {selectedService 
                  ? `Confirmar ${selectedService.name}`
                  : 'Selecione um serviço'
                }
              </Text>
              <Ionicons 
                name="checkmark" 
                size={20} 
                color={selectedService ? '#fff' : '#999'} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxHeight: screenHeight * 0.8,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    zIndex: 2,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: themes.colors.corTexto,
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  scrollArea: {
    flexGrow: 1,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  footerFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  confirmButton: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
});

export default ServiceSelectorModal;