// Saude.tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    FlatList,
} from "react-native";
import { style } from "./styles";
import { MaterialIcons } from "@expo/vector-icons";
import { themes } from "../../global/themes";

import { auth, db } from "../../lib/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

// Import dos componentes
import HealthRecordModal from '../../components/HealthRecordModal';
import PetSelectorModal from '../../components/PetSelectorModal';

// Import dos utilitários
import { getPetImage, getTypeLabel, formatDate } from '../../utils/petUtils';

// 🔹 Interfaces
interface Pet {
    id: string;
    name: string;
    breed: string;
    age: number;
    weight: number;
    animalType: string;
}

interface HealthRecord {
    id: string;
    type: 'vaccine' | 'dewormer' | 'antiparasitic';
    name: string;
    date: string;
    nextDate?: string;
    notes?: string;
}

export default function Saude() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados para controle dos modais
    const [showPetSelector, setShowPetSelector] = useState(false);
    const [showHealthRecordModal, setShowHealthRecordModal] = useState(false);
    const [healthRecordModalMode, setHealthRecordModalMode] = useState<'add' | 'edit'>('add');
    const [currentRecordType, setCurrentRecordType] = useState<'vaccine' | 'dewormer' | 'antiparasitic'>('vaccine');
    const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (user) {
                fetchPets(user.uid);
            }
        });

        return () => unsubscribe();
    }, []);

    // Buscar pets do usuário
    const fetchPets = async (userId: string) => {
        try {
            const q = query(collection(db, "cadastrarPet"), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);

            const petsList: Pet[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                petsList.push({
                    id: doc.id,
                    name: data.name || "",
                    breed: data.breed || "",
                    age: data.age || 0,
                    weight: data.weight || 0,
                    animalType: data.animalType || "dog",
                });
            });

            setPets(petsList);
            if (petsList.length > 0) {
                setSelectedPet(petsList[0]);
                fetchHealthRecords(petsList[0].id);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error("Erro ao carregar pets: ", error);
            setLoading(false);
        }
    };

    // Buscar registros de saúde do pet selecionado
    const fetchHealthRecords = async (petId: string) => {
        setLoading(true);
        try {
            const mockRecords: HealthRecord[] = [
                {
                    id: '1',
                    type: 'vaccine',
                    name: 'Vacina V10',
                    date: '2024-01-15',
                    nextDate: '2025-01-15',
                    notes: 'Primeira dose'
                },
                {
                    id: '2',
                    type: 'vaccine',
                    name: 'Antirrábica',
                    date: '2024-01-15',
                    nextDate: '2025-01-15'
                },
                {
                    id: '3',
                    type: 'dewormer',
                    name: 'Vermífugo Plus',
                    date: '2024-02-01',
                    nextDate: '2024-08-01'
                },
                {
                    id: '4',
                    type: 'antiparasitic',
                    name: 'Antipulgas',
                    date: '2024-03-01',
                    nextDate: '2024-04-01'
                }
            ];

            setHealthRecords(mockRecords);
        } catch (error) {
            console.error("Erro ao carregar registros de saúde: ", error);
        } finally {
            setLoading(false);
        }
    };

    // Handlers para os modais
    const openAddModal = (type: 'vaccine' | 'dewormer' | 'antiparasitic') => {
        setCurrentRecordType(type);
        setHealthRecordModalMode('add');
        setEditingRecord(null);
        setShowHealthRecordModal(true);
    };

    const openEditModal = (record: HealthRecord) => {
        setEditingRecord(record);
        setCurrentRecordType(record.type);
        setHealthRecordModalMode('edit');
        setShowHealthRecordModal(true);
    };

    const handlePetSelect = (pet: Pet) => {
        setSelectedPet(pet);
        setShowPetSelector(false);
        fetchHealthRecords(pet.id);
    };

    // Handlers para operações CRUD
    const handleAddRecord = async (recordData: Omit<HealthRecord, 'id'>) => {
        if (!selectedPet) {
            Alert.alert('Erro', 'Nenhum pet selecionado.');
            return;
        }

        try {
            const newRecord: HealthRecord = {
                id: Date.now().toString(),
                ...recordData,
            };

            // Aqui você implementaria o addDoc para salvar no Firestore
            setHealthRecords(prev => [...prev, newRecord]);
            
            Alert.alert('Sucesso', `${getTypeLabel(recordData.type)} adicionado com sucesso!`);
            setShowHealthRecordModal(false);
        } catch (error) {
            console.error("Erro ao adicionar registro:", error);
            Alert.alert('Erro', 'Não foi possível adicionar o registro.');
        }
    };

    const handleUpdateRecord = async (recordData: HealthRecord) => {
        try {
            // Aqui você implementaria o updateDoc para atualizar no Firestore
            setHealthRecords(prev => 
                prev.map(record => 
                    record.id === recordData.id ? recordData : record
                )
            );

            Alert.alert('Sucesso', `${getTypeLabel(recordData.type)} atualizado com sucesso!`);
            setShowHealthRecordModal(false);
        } catch (error) {
            console.error("Erro ao editar registro:", error);
            Alert.alert('Erro', 'Não foi possível editar o registro.');
        }
    };

    const handleDeleteRecord = (record: HealthRecord) => {
        Alert.alert(
            'Excluir Registro',
            `Tem certeza que deseja excluir "${record.name}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Aqui você implementaria o deleteDoc para excluir do Firestore
                            setHealthRecords(prev => 
                                prev.filter(r => r.id !== record.id)
                            );

                            Alert.alert('Sucesso', 'Registro excluído com sucesso!');
                        } catch (error) {
                            console.error("Erro ao excluir registro:", error);
                            Alert.alert('Erro', 'Não foi possível excluir o registro.');
                        }
                    },
                },
            ]
        );
    };

    // Função auxiliar - APENAS ESTA PERMANECE AQUI
    const getRecordsByType = (type: 'vaccine' | 'dewormer' | 'antiparasitic') => {
        return healthRecords.filter(record => record.type === type);
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={style.container} showsVerticalScrollIndicator={false}>
                <Text style={style.sectionTitle}>Saúde do Pet</Text>

                {/* Seletor de Pet */}
                <TouchableOpacity
                    style={style.petSelector}
                    onPress={() => setShowPetSelector(true)}
                >
                    <View style={style.petSelectorContent}>
                        {selectedPet ? (
                            <>
                                <Image
                                    source={getPetImage(selectedPet.animalType)}
                                    style={style.petSelectorImage}
                                />
                                <View style={style.petSelectorInfo}>
                                    <Text style={style.petSelectorName}>{selectedPet.name}</Text>
                                    <Text style={style.petSelectorDetails}>
                                        {selectedPet.breed} • {selectedPet.age} anos
                                    </Text>
                                </View>
                            </>
                        ) : (
                            <Text style={style.petSelectorPlaceholder}>
                                Selecione um pet
                            </Text>
                        )}
                        <MaterialIcons
                            name="arrow-drop-down"
                            size={24}
                            color={themes.colors.secundary}
                        />
                    </View>
                </TouchableOpacity>

                {/* Cards de Saúde */}
                {selectedPet ? (
                    <View style={style.healthCardsContainer}>
                        
                        {/* Card de Vacinas */}
                        <View style={style.healthCard}>
                            <View style={style.healthCardHeader}>
                                <View style={[style.healthIcon, { backgroundColor: themes.colors.vaccine }]}>
                                    <MaterialIcons name="vaccines" size={24} color="#fff" />
                                </View>
                                <Text style={style.healthCardTitle}>Vacinas</Text>
                                <TouchableOpacity
                                    style={style.addButton}
                                    onPress={() => openAddModal('vaccine')}
                                >
                                    <MaterialIcons name="add" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>

                            {getRecordsByType('vaccine').length > 0 ? (
                                <FlatList
                                    data={getRecordsByType('vaccine')}
                                    scrollEnabled={false}
                                    renderItem={({ item }) => (
                                        <View style={style.recordItem}>
                                            <View style={style.recordHeader}>
                                                <Text style={style.recordName}>{item.name}</Text>
                                                <View style={style.recordActions}>
                                                    <TouchableOpacity 
                                                        style={style.editButton}
                                                        onPress={() => openEditModal(item)}
                                                    >
                                                        <MaterialIcons name="edit" size={16} color="#fff" />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity 
                                                        style={style.deleteButton}
                                                        onPress={() => handleDeleteRecord(item)}
                                                    >
                                                        <MaterialIcons name="delete" size={16} color="#fff" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <View style={style.recordDetails}>
                                                <Text style={style.recordDate}>
                                                    Aplicada: {formatDate(item.date)}
                                                </Text>
                                                {item.nextDate && (
                                                    <Text style={style.recordNextDate}>
                                                        Próxima: {formatDate(item.nextDate)}
                                                    </Text>
                                                )}
                                            </View>
                                            {item.notes && (
                                                <Text style={style.recordNotes}>{item.notes}</Text>
                                            )}
                                        </View>
                                    )}
                                    keyExtractor={(item) => item.id}
                                />
                            ) : (
                                <Text style={style.emptyText}>Nenhuma vacina registrada</Text>
                            )}
                        </View>

                        {/* Card de Vermífugos */}
                        <View style={style.healthCard}>
                            <View style={style.healthCardHeader}>
                                <View style={[style.healthIcon, { backgroundColor: themes.colors.dewormer }]}>
                                    <MaterialIcons name="medication" size={24} color="#fff" />
                                </View>
                                <Text style={style.healthCardTitle}>Vermífugos</Text>
                                <TouchableOpacity
                                    style={style.addButton}
                                    onPress={() => openAddModal('dewormer')}
                                >
                                    <MaterialIcons name="add" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>

                            {getRecordsByType('dewormer').length > 0 ? (
                                <FlatList
                                    data={getRecordsByType('dewormer')}
                                    scrollEnabled={false}
                                    renderItem={({ item }) => (
                                        <View style={style.recordItem}>
                                            <View style={style.recordHeader}>
                                                <Text style={style.recordName}>{item.name}</Text>
                                                <View style={style.recordActions}>
                                                    <TouchableOpacity 
                                                        style={style.editButton}
                                                        onPress={() => openEditModal(item)}
                                                    >
                                                        <MaterialIcons name="edit" size={16} color="#fff" />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity 
                                                        style={style.deleteButton}
                                                        onPress={() => handleDeleteRecord(item)}
                                                    >
                                                        <MaterialIcons name="delete" size={16} color="#fff" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <View style={style.recordDetails}>
                                                <Text style={style.recordDate}>
                                                    Aplicado: {formatDate(item.date)}
                                                </Text>
                                                {item.nextDate && (
                                                    <Text style={style.recordNextDate}>
                                                        Próximo: {formatDate(item.nextDate)}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                    )}
                                    keyExtractor={(item) => item.id}
                                />
                            ) : (
                                <Text style={style.emptyText}>Nenhum vermífugo registrado</Text>
                            )}
                        </View>

                        {/* Card de Antiparasitários */}
                        <View style={style.healthCard}>
                            <View style={style.healthCardHeader}>
                                <View style={[style.healthIcon, { backgroundColor: themes.colors.antiparasitic }]}>
                                    <MaterialIcons name="pest-control" size={24} color="#fff" />
                                </View>
                                <Text style={style.healthCardTitle}>Antiparasitários</Text>
                                <TouchableOpacity
                                    style={style.addButton}
                                    onPress={() => openAddModal('antiparasitic')}
                                >
                                    <MaterialIcons name="add" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>

                            {getRecordsByType('antiparasitic').length > 0 ? (
                                <FlatList
                                    data={getRecordsByType('antiparasitic')}
                                    scrollEnabled={false}
                                    renderItem={({ item }) => (
                                        <View style={style.recordItem}>
                                            <View style={style.recordHeader}>
                                                <Text style={style.recordName}>{item.name}</Text>
                                                <View style={style.recordActions}>
                                                    <TouchableOpacity 
                                                        style={style.editButton}
                                                        onPress={() => openEditModal(item)}
                                                    >
                                                        <MaterialIcons name="edit" size={16} color="#fff" />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity 
                                                        style={style.deleteButton}
                                                        onPress={() => handleDeleteRecord(item)}
                                                    >
                                                        <MaterialIcons name="delete" size={16} color="#fff" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <View style={style.recordDetails}>
                                                <Text style={style.recordDate}>
                                                    Aplicado: {formatDate(item.date)}
                                                </Text>
                                                {item.nextDate && (
                                                    <Text style={style.recordNextDate}>
                                                        Próximo: {formatDate(item.nextDate)}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                    )}
                                    keyExtractor={(item) => item.id}
                                />
                            ) : (
                                <Text style={style.emptyText}>Nenhum antiparasitário registrado</Text>
                            )}
                        </View>
                    </View>
                ) : (
                    <View style={style.emptyStateContainer}>
                        {pets.length === 0 ? (
                            <Text style={style.emptyStateText}>
                                Cadastre um pet primeiro para gerenciar a saúde.
                            </Text>
                        ) : null}
                    </View>
                )}
            </ScrollView>

            {/* Modais Componentizados */}
            <PetSelectorModal
                visible={showPetSelector}
                pets={pets}
                onSelectPet={handlePetSelect}
                onClose={() => setShowPetSelector(false)}
            />

            <HealthRecordModal
                visible={showHealthRecordModal}
                mode={healthRecordModalMode}
                recordType={currentRecordType}
                record={editingRecord}
                onClose={() => setShowHealthRecordModal(false)}
                onSave={handleAddRecord}
                onUpdate={handleUpdateRecord}
            />
        </View>
    );
}