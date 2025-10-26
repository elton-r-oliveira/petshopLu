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
    ActivityIndicator,
} from "react-native";
import { style } from "./styles";
import { MaterialIcons } from "@expo/vector-icons";
import { themes } from "../../global/themes";

import { auth, db } from "../../lib/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    orderBy
} from 'firebase/firestore';

// Import dos componentes
import HealthRecordModal from '../../components/HealthRecordModal';
import PetSelectorModal from '../../components/PetSelectorModal';

// Import dos utilitários
import { getPetImage, getTypeLabel, formatDate } from '../../utils/petUtils';
import { HealthRecord } from "../../@types/HealthRecord";

// 🔹 Interfaces
interface Pet {
    id: string;
    name: string;
    breed: string;
    age: number;
    weight: number;
    animalType: string;
}

export default function Saude() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // Buscar pets do usuário
    // Saude.tsx - ATUALIZE a função fetchPets:
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
                await fetchHealthRecords(petsList[0].id);
            } else {
                setLoading(false);
            }
        } catch (error: any) { // ✅ CORREÇÃO: Tipar o error
            console.error("Erro ao carregar pets: ", error);
            Alert.alert("Erro", "Não foi possível carregar seus pets.");
            setLoading(false);
        }
    };

    // Buscar registros de saúde do pet selecionado
    const fetchHealthRecords = async (petId: string) => {
        if (!currentUser) return;

        setLoading(true);
        try {
            const q = query(
                collection(db, "healthRecords"),
                where("userId", "==", currentUser.uid),
                where("petId", "==", petId),
                orderBy("createdAt", "desc")
            );

            const querySnapshot = await getDocs(q);
            const records: HealthRecord[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                records.push({
                    id: doc.id,
                    type: data.type,
                    name: data.name,
                    date: data.date,
                    nextDate: data.nextDate || undefined,
                    notes: data.notes || undefined,
                    petId: data.petId,
                    userId: data.userId,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                });
            });

            setHealthRecords(records);
        } catch (error: any) { // ✅ CORREÇÃO: Tipar o error
            console.error("Erro ao carregar registros de saúde: ", error);

            if (error.code === 'failed-precondition') {
                try {
                    const q = query(
                        collection(db, "healthRecords"),
                        where("userId", "==", currentUser.uid),
                        where("petId", "==", petId)
                    );

                    const querySnapshot = await getDocs(q);
                    const records: HealthRecord[] = [];

                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        records.push({
                            id: doc.id,
                            type: data.type,
                            name: data.name,
                            date: data.date,
                            nextDate: data.nextDate || undefined,
                            notes: data.notes || undefined,
                            petId: data.petId,
                            userId: data.userId,
                            createdAt: data.createdAt,
                            updatedAt: data.updatedAt,
                        });
                    });

                    records.sort((a, b) => {
                        const dateA = a.createdAt?.toDate?.() || new Date(0);
                        const dateB = b.createdAt?.toDate?.() || new Date(0);
                        return dateB.getTime() - dateA.getTime();
                    });

                    setHealthRecords(records);
                    return;
                } catch (fallbackError: any) { // ✅ CORREÇÃO: Tipar o error
                    console.error("Erro no fallback:", fallbackError);
                }
            }

            Alert.alert("Erro", "Não foi possível carregar os registros de saúde.");
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

    const handlePetSelect = async (pet: Pet) => {
        setSelectedPet(pet);
        setShowPetSelector(false);
        await fetchHealthRecords(pet.id);
    };

    // Saude.tsx - ATUALIZE a função handleAddRecord:
    // Saude.tsx - ATUALIZE a função handleAddRecord:
    const handleAddRecord = async (recordData: Omit<HealthRecord, 'id' | 'petId' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        if (!selectedPet || !currentUser) {
            Alert.alert('Erro', 'Nenhum pet selecionado ou usuário não autenticado.');
            return;
        }

        setSaving(true);
        try {
            const newRecordData = {
                type: recordData.type,
                name: recordData.name,
                date: recordData.date,
                nextDate: recordData.nextDate || null,
                notes: recordData.notes || null,
                petId: selectedPet.id,
                userId: currentUser.uid,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            const docRef = await addDoc(collection(db, "healthRecords"), newRecordData);

            // ✅ CORREÇÃO: Converter null para undefined no objeto final
            const newRecord: HealthRecord = {
                id: docRef.id,
                type: newRecordData.type,
                name: newRecordData.name,
                date: newRecordData.date,
                nextDate: newRecordData.nextDate || undefined, // Converter null para undefined
                notes: newRecordData.notes || undefined,       // Converter null para undefined
                petId: newRecordData.petId,
                userId: newRecordData.userId,
                createdAt: newRecordData.createdAt,
                updatedAt: newRecordData.updatedAt,
            };

            setHealthRecords(prev => [newRecord, ...prev]);
            Alert.alert('Sucesso', `${getTypeLabel(recordData.type)} adicionado com sucesso!`);
            setShowHealthRecordModal(false);
        } catch (error: any) { // ✅ CORREÇÃO: Tipar o error
            console.error("Erro ao adicionar registro:", error);
            Alert.alert('Erro', 'Não foi possível adicionar o registro.');
        } finally {
            setSaving(false);
        }
    };

    // 🔥 ATUALIZAR registro de saúde
    // Saude.tsx - ATUALIZE a função handleUpdateRecord:
    // Saude.tsx - ATUALIZE a função handleUpdateRecord:
    const handleUpdateRecord = async (recordData: Omit<HealthRecord, 'userId' | 'petId' | 'createdAt' | 'updatedAt'>) => {
        if (!editingRecord) return;
        setSaving(true);
        try {
            const recordRef = doc(db, "healthRecords", editingRecord.id);

            await updateDoc(recordRef, {
                name: recordData.name,
                date: recordData.date,
                nextDate: recordData.nextDate || null,
                notes: recordData.notes || null,
                updatedAt: serverTimestamp(),
            });

            setHealthRecords(prev =>
                prev.map(record =>
                    record.id === editingRecord.id
                        ? { ...record, ...recordData, updatedAt: serverTimestamp() }
                        : record
                )
            );

            Alert.alert('Sucesso', `${getTypeLabel(editingRecord.type)} atualizado com sucesso!`);
            setShowHealthRecordModal(false);
        } catch (error: any) {
            console.error("Erro ao editar registro:", error);
            Alert.alert('Erro', 'Não foi possível editar o registro.');
        } finally {
            setSaving(false);
        }
    };


    // 🔥 EXCLUIR registro de saúde
    // Saude.tsx - ATUALIZE a função handleDeleteRecord:
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
                            await deleteDoc(doc(db, "healthRecords", record.id));
                            setHealthRecords(prev => prev.filter(r => r.id !== record.id));
                            Alert.alert('Sucesso', 'Registro excluído com sucesso!');
                        } catch (error: any) { // ✅ CORREÇÃO: Tipar o error
                            console.error("Erro ao excluir registro:", error);
                            Alert.alert('Erro', 'Não foi possível excluir o registro.');
                        }
                    },
                },
            ]
        );
    };

    // Função auxiliar
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

                {/* Loading */}
                {loading && (
                    <View style={style.emptyStateContainer}>
                        <ActivityIndicator size="large" color={themes.colors.secundary} />
                        <Text style={style.emptyStateText}>Carregando registros...</Text>
                    </View>
                )}

                {/* Cards de Saúde */}
                {selectedPet && !loading && (
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
                )}

                {!selectedPet && pets.length === 0 && !loading && (
                    <View style={style.emptyStateContainer}>
                        <Text style={style.emptyStateText}>
                            Cadastre um pet primeiro para gerenciar a saúde.
                        </Text>
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
                loading={saving}
            />
        </View>
    );
}