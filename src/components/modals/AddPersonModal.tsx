import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { Person, EDUCATION_LEVELS, BLOOD_TYPES } from '../../types/types';
import { calculateAge, formatDate } from '../../utils/helpers';

interface AddPersonModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (person: Person) => void;
    person?: Person;
    isEditMode?: boolean;
}

const initialPersonState: Person = {
    id: '',
    name: '',
    birthDate: new Date(),
    gender: 'Masculino',
    education: EDUCATION_LEVELS[0],
    bloodType: BLOOD_TYPES[0],
    height: 170,
    weight: 70,
    photo: null,
};

const AddPersonModal: React.FC<AddPersonModalProps> = ({
    visible,
    onClose,
    onSave,
    person,
    isEditMode = false,
}) => {
    const [formData, setFormData] = useState<Person>(initialPersonState);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [age, setAge] = useState(0);

    useEffect(() => {
        if (person && isEditMode) {
            setFormData(person);
            setAge(calculateAge(person.birthDate));
        } else {
            setFormData(initialPersonState);
            setAge(calculateAge(initialPersonState.birthDate));
        }
    }, [person, isEditMode, visible]);

    const handleSave = () => {
        if (!formData.name.trim()) {
            Alert.alert('Error', 'El nombre es obligatorio');
            return;
        }

        onSave(formData);
        onClose();
    };

    const handleChangeDate = (_: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');

        if (selectedDate) {
            setFormData(prev => ({ ...prev, birthDate: selectedDate }));
            setAge(calculateAge(selectedDate));
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permisos requeridos', 'Necesitamos acceso a la galería para seleccionar una foto.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setFormData(prev => ({ ...prev, photo: result.assets[0] }));
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {isEditMode ? 'Editar Persona' : 'Agregar Persona'}
                    </Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.formContainer}>
                    <View style={styles.photoContainer}>
                        {formData.photo ? (
                            <Image
                                source={{ uri: formData.photo.uri }}
                                style={styles.profilePhoto}
                                contentFit="cover"
                            />
                        ) : (
                            <View style={[styles.profilePhoto, styles.photoPlaceholder]}>
                                <Text style={styles.photoPlaceholderText}>Foto</Text>
                            </View>
                        )}
                        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                            <Text style={styles.photoButtonText}>
                                {formData.photo ? 'Cambiar foto' : 'Seleccionar foto'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Nombre</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.name}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                        placeholder="Nombre completo"
                    />

                    <Text style={styles.label}>Fecha de nacimiento</Text>
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text>{formatDate(formData.birthDate)}</Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={formData.birthDate}
                            mode="date"
                            display="default"
                            onChange={handleChangeDate}
                            maximumDate={new Date()}
                        />
                    )}

                    <Text style={styles.label}>Edad</Text>
                    <View style={styles.input}>
                        <Text>{age} años</Text>
                    </View>

                    <Text style={styles.label}>Género</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.gender}
                            onValueChange={(itemValue) =>
                                setFormData(prev => ({ ...prev, gender: itemValue as Person['gender'] }))
                            }
                            style={styles.picker}
                        >
                            <Picker.Item label="Masculino" value="Masculino" />
                            <Picker.Item label="Femenino" value="Femenino" />
                            <Picker.Item label="Otros" value="Otros" />
                        </Picker>
                    </View>

                    <Text style={styles.label}>Estudios</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.education}
                            onValueChange={(itemValue) =>
                                setFormData(prev => ({ ...prev, education: itemValue }))
                            }
                            style={styles.picker}
                        >
                            {EDUCATION_LEVELS.map((level) => (
                                <Picker.Item key={level} label={level} value={level} />
                            ))}
                        </Picker>
                    </View>

                    <Text style={styles.label}>Tipo de sangre</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.bloodType}
                            onValueChange={(itemValue) =>
                                setFormData(prev => ({ ...prev, bloodType: itemValue }))
                            }
                            style={styles.picker}
                        >
                            {BLOOD_TYPES.map((type) => (
                                <Picker.Item key={type} label={type} value={type} />
                            ))}
                        </Picker>
                    </View>

                    <Text style={styles.label}>Estatura (m)</Text>
                    <View style={styles.sliderContainer}>
                        <Text style={styles.sliderValue}>
                            {(formData.height / 100).toFixed(2)} m
                        </Text>
                        <View style={styles.sliderRow}>
                            <Text>1.40</Text>
                            <TouchableOpacity
                                style={[styles.sliderButton, styles.sliderButtonMinus]}
                                onPress={() => setFormData(prev => ({ ...prev, height: Math.max(140, prev.height - 1) }))}
                            >
                                <Text style={styles.sliderButtonText}>-</Text>
                            </TouchableOpacity>

                            <View style={styles.slider}>
                                <View
                                    style={[
                                        styles.sliderFill,
                                        { width: `${((formData.height - 140) / (210 - 140)) * 100}%` },
                                    ]}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.sliderButton, styles.sliderButtonPlus]}
                                onPress={() => setFormData(prev => ({ ...prev, height: Math.min(210, prev.height + 1) }))}
                            >
                                <Text style={styles.sliderButtonText}>+</Text>
                            </TouchableOpacity>
                            <Text>2.10</Text>
                        </View>
                    </View>

                    <Text style={styles.label}>Peso (kg)</Text>
                    <View style={styles.sliderContainer}>
                        <Text style={styles.sliderValue}>{formData.weight} kg</Text>
                        <View style={styles.sliderRow}>
                            <Text>40</Text>
                            <TouchableOpacity
                                style={[styles.sliderButton, styles.sliderButtonMinus]}
                                onPress={() => setFormData(prev => ({ ...prev, weight: Math.max(40, prev.weight - 1) }))}
                            >
                                <Text style={styles.sliderButtonText}>-</Text>
                            </TouchableOpacity>

                            <View style={styles.slider}>
                                <View
                                    style={[
                                        styles.sliderFill,
                                        { width: `${((formData.weight - 40) / (150 - 40)) * 100}%` },
                                    ]}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.sliderButton, styles.sliderButtonPlus]}
                                onPress={() => setFormData(prev => ({ ...prev, weight: Math.min(150, prev.weight + 1) }))}
                            >
                                <Text style={styles.sliderButtonText}>+</Text>
                            </TouchableOpacity>
                            <Text>150</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Guardar</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    formContainer: {
        flex: 1,
        padding: 16,
    },
    photoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profilePhoto: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
    },
    photoPlaceholder: {
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoPlaceholderText: {
        color: '#888',
    },
    photoButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
    },
    photoButtonText: {
        color: '#fff',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 4,
        padding: 12,
        fontSize: 16,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 4,
        marginBottom: 8,
    },
    picker: {
        height: 50,
    },
    sliderContainer: {
        marginBottom: 20,
    },
    sliderValue: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 8,
    },
    sliderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    slider: {
        flex: 1,
        height: 6,
        backgroundColor: '#e0e0e0',
        borderRadius: 3,
        marginHorizontal: 10,
    },
    sliderFill: {
        height: 6,
        backgroundColor: '#2196F3',
        borderRadius: 3,
    },
    sliderButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    sliderButtonMinus: {
        backgroundColor: '#f44336',
    },
    sliderButtonPlus: {
        backgroundColor: '#4CAF50',
    },
    sliderButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 4,
        alignItems: 'center',
        marginVertical: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddPersonModal;