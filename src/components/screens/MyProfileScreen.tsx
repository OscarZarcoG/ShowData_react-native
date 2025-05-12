import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useStorage } from '../../hooks/useStorage';
import { calculateAge, formatDate } from '../../utils/helpers';
import { Person } from '../../types/types';
import EditPersonModal from '../modals/EditPersonModal';

const MyProfileScreen: React.FC = () => {
    const { myProfile, isLoading, saveMyProfile, deleteMyProfile } = useStorage();
    const [editModalVisible, setEditModalVisible] = useState(false);

    const handleSaveProfile = (updatedProfile: Person) => {
        saveMyProfile(updatedProfile);
        setEditModalVisible(false);
    };

    const handleDeleteProfile = () => {
        Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro de que deseas eliminar tu perfil? Esta acción no se puede deshacer.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => {
                        deleteMyProfile();
                    },
                },
            ]
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.loadingText}>Cargando perfil...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {myProfile ? (
                <>
                    <ScrollView style={styles.scrollContainer}>
                        <View style={styles.photoContainer}>
                            {myProfile.photo ? (
                                <Image
                                    source={{ uri: myProfile.photo.uri }}
                                    style={styles.profilePhoto}
                                    contentFit="cover"
                                />
                            ) : (
                                <View style={[styles.profilePhoto, styles.photoPlaceholder]}>
                                    <Text style={styles.photoPlaceholderText}>Sin Foto</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.profileInfo}>
                            <Text style={styles.nameText}>{myProfile.name}</Text>
                            <Text style={styles.ageText}>
                                {calculateAge(myProfile.birthDate)} años
                            </Text>
                        </View>

                        <View style={styles.detailsContainer}>
                            <DetailItem label="Fecha de nacimiento" value={formatDate(myProfile.birthDate)} />
                            <DetailItem label="Género" value={myProfile.gender} />
                            <DetailItem label="Estudios" value={myProfile.education} />
                            <DetailItem label="Tipo de sangre" value={myProfile.bloodType} />
                            <DetailItem label="Estatura" value={`${(myProfile.height / 100).toFixed(2)} m`} />
                            <DetailItem label="Peso" value={`${myProfile.weight} kg`} />
                        </View>

                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.editButton]}
                                onPress={() => setEditModalVisible(true)}
                            >
                                <Text style={styles.buttonText}>Editar perfil</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.deleteButton]}
                                onPress={handleDeleteProfile}
                            >
                                <Text style={styles.buttonText}>Eliminar perfil</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    <EditPersonModal
                        visible={editModalVisible}
                        onClose={() => setEditModalVisible(false)}
                        onSave={handleSaveProfile}
                        person={myProfile}
                    />
                </>
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        No has configurado tu perfil aún.
                    </Text>
                    <TouchableOpacity
                        style={[styles.button, styles.createButton]}
                        onPress={() => setEditModalVisible(true)}
                    >
                        <Text style={styles.buttonText}>Crear perfil</Text>
                    </TouchableOpacity>

                    <EditPersonModal
                        visible={editModalVisible}
                        onClose={() => setEditModalVisible(false)}
                        onSave={handleSaveProfile}
                        person={{
                            id: '',
                            name: '',
                            birthDate: new Date(),
                            gender: 'Masculino',
                            education: 'Preparatoria o Bachillerato',
                            bloodType: 'O+',
                            height: 170,
                            weight: 70,
                            photo: null,
                        }}
                    />
                </View>
            )}
        </View>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    scrollContainer: {
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
    profileInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    ageText: {
        fontSize: 18,
        color: '#666',
    },
    detailsContainer: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
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
    actionButtons: {
        marginTop: 30,
        marginBottom: 20,
    },
    button: {
        padding: 16,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 10,
    },
    createButton: {
        backgroundColor: '#2196F3',
    },
    editButton: {
        backgroundColor: '#2196F3',
    },
    deleteButton: {
        backgroundColor: '#f44336',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default MyProfileScreen;