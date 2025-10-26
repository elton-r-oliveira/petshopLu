// components/HealthRecordModal.tsx
import React from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Modal,
    Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { themes } from '../../global/themes';
import { style } from './styles'; // Você pode criar um arquivo de styles específico ou usar o mesmo

interface HealthRecord {
    id: string;
    type: 'vaccine' | 'dewormer' | 'antiparasitic';
    name: string;
    date: string;
    nextDate?: string;
    notes?: string;
}

interface HealthRecordModalProps {
    visible: boolean;
    mode: 'add' | 'edit';
    recordType: 'vaccine' | 'dewormer' | 'antiparasitic';
    record?: HealthRecord | null;
    onClose: () => void;
    onSave: (recordData: Omit<HealthRecord, 'id'>) => void;
    onUpdate?: (recordData: HealthRecord) => void;
}

export default function HealthRecordModal({
    visible,
    mode,
    recordType,
    record,
    onClose,
    onSave,
    onUpdate
}: HealthRecordModalProps) {
    const [recordName, setRecordName] = React.useState(record?.name || '');
    const [recordDate, setRecordDate] = React.useState(record?.date || '');
    const [recordNextDate, setRecordNextDate] = React.useState(record?.nextDate || '');
    const [recordNotes, setRecordNotes] = React.useState(record?.notes || '');

    React.useEffect(() => {
        if (record) {
            setRecordName(record.name);
            setRecordDate(record.date);
            setRecordNextDate(record.nextDate || '');
            setRecordNotes(record.notes || '');
        }
    }, [record]);

    const getTypeLabel = (type: 'vaccine' | 'dewormer' | 'antiparasitic') => {
        switch (type) {
            case 'vaccine': return 'Vacina';
            case 'dewormer': return 'Vermífugo';
            case 'antiparasitic': return 'Antiparasitário';
            default: return 'Registro';
        }
    };

    const handleSubmit = () => {
        if (!recordName || !recordDate) {
            Alert.alert('Atenção', 'Por favor, preencha pelo menos o nome e a data.');
            return;
        }

        const recordData = {
            type: recordType,
            name: recordName,
            date: recordDate,
            nextDate: recordNextDate || undefined,
            notes: recordNotes || undefined,
        };

        if (mode === 'add') {
            onSave(recordData);
        } else if (mode === 'edit' && record) {
            onUpdate?.({ ...recordData, id: record.id });
        }

        // Limpar formulário
        setRecordName('');
        setRecordDate('');
        setRecordNextDate('');
        setRecordNotes('');
    };

    const handleClose = () => {
        onClose();
        // Limpar formulário ao fechar
        setRecordName('');
        setRecordDate('');
        setRecordNextDate('');
        setRecordNotes('');
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={handleClose}
        >
            <View style={style.modalOverlay}>
                <View style={style.formModalContent}>
                    <Text style={style.modalTitle}>
                        {mode === 'add' ? 'Adicionar' : 'Editar'} {getTypeLabel(recordType)}
                    </Text>

                    <ScrollView style={style.formContainer}>
                        <View style={style.inputGroup}>
                            <Text style={style.inputLabel}>Nome *</Text>
                            <TextInput
                                style={style.textInput}
                                placeholder={`Ex: ${recordType === 'vaccine' ? 'Vacina V10' : recordType === 'dewormer' ? 'Vermífugo Plus' : 'Antipulgas'}`}
                                value={recordName}
                                onChangeText={setRecordName}
                            />
                        </View>

                        <View style={style.inputGroup}>
                            <Text style={style.inputLabel}>Data de Aplicação *</Text>
                            <TextInput
                                style={style.textInput}
                                placeholder="AAAA-MM-DD"
                                value={recordDate}
                                onChangeText={setRecordDate}
                            />
                            <Text style={style.inputHelp}>Formato: Ano-Mês-Dia (ex: 2024-03-15)</Text>
                        </View>

                        <View style={style.inputGroup}>
                            <Text style={style.inputLabel}>Próxima Aplicação (opcional)</Text>
                            <TextInput
                                style={style.textInput}
                                placeholder="AAAA-MM-DD"
                                value={recordNextDate}
                                onChangeText={setRecordNextDate}
                            />
                        </View>

                        <View style={style.inputGroup}>
                            <Text style={style.inputLabel}>Observações (opcional)</Text>
                            <TextInput
                                style={[style.textInput, style.textArea]}
                                placeholder="Notas adicionais..."
                                value={recordNotes}
                                onChangeText={setRecordNotes}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    </ScrollView>

                    <View style={style.modalButtons}>
                        <TouchableOpacity 
                            style={[style.modalButton, style.cancelButton]}
                            onPress={handleClose}
                        >
                            <Text style={style.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[style.modalButton, style.confirmButton]}
                            onPress={handleSubmit}
                        >
                            <Text style={style.confirmButtonText}>
                                {mode === 'add' ? 'Adicionar' : 'Salvar'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}