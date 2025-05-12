import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { Person } from '../../types/types';
import { calculateAge, formatDate } from '../../utils/helpers';

interface PersonDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    person: Person | null;
    onEdit: () => void;
}

const PersonDetailsModal: React.FC<PersonDetailsModalProps> = ({
    visible,
    onClose,
    person,
    onEdit,
}) => {
    if (!person) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Detalles de la persona</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content}>
                    <View style={styles.photoContainer}>
                        {person.photo ? (
                            <Image
                                source={{ uri: person.photo.uri }}
                                style={styles.profilePhoto}
                                contentFit="cover"
                            />
                        ) : (
                            <View style={[styles.profilePhoto, styles.photoPlaceholder]}>
                                <Text style={styles.photoPlaceholderText}>Sin Foto</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.detailsContainer}>
                        <DetailItem label="Nombre" value={person.name} />
                        <DetailItem label="Fecha de nacimiento" value={formatDate(person.birthDate)} />
                        <DetailItem label="Edad" value={`${calculateAge(person.birthDate)} años`} />
                        <DetailItem label="Género" value={person.gender} />
                        <DetailItem label="Estudios" value={person.education} />
                        <DetailItem label="Tipo de sangre" value={person.bloodType} />
                        <DetailItem label="Estatura" value={`${(person.height / 100).toFixed(2)} m`} />
                        <DetailItem label="Peso" value={`${person.weight} kg`} />
                    </View>

                    <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                        <Text style={styles.editButtonText}>Editar</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </Modal>
    );
};

interface DetailItemProps {
    label: string;
    value: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
    <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>{label}:</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

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
    content: {
        flex: 1,
        padding: 16,
    },
    photoContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    profilePhoto: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    photoPlaceholder: {
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoPlaceholderText: {
        color: '#888',
    },
    detailsContainer: {
        marginTop: 20,
    },
    detailItem: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    detailLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    detailValue: {
        flex: 2,
        fontSize: 16,
        color: '#666',
    },
    editButton: {
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 4,
        alignItems: 'center',
        marginVertical: 20,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PersonDetailsModal;