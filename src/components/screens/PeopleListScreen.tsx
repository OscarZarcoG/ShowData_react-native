import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStorage } from '../../hooks/useStorage';
import { Person } from '../../types/types';
import PersonDetailsModal from '../modals/PersonDetailsModal';
import AddPersonModal from '../modals/AddPersonModal';
import EditPersonModal from '../modals/EditPersonModal';

const PeopleListScreen: React.FC = () => {
    const { peopleList, isLoading, savePerson, deletePerson } = useStorage();

    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);

    const handlePersonPress = (person: Person) => {
        setSelectedPerson(person);
        setDetailsModalVisible(true);
    };

    const handleAddPerson = () => {
        setAddModalVisible(true);
    };

    const handleSavePerson = (person: Person) => {
        savePerson(person);
        setAddModalVisible(false);
        setEditModalVisible(false);
    };

    const handleEditPerson = () => {
        setDetailsModalVisible(false);
        setEditModalVisible(true);
    };

    const handleDeletePerson = () => {
        if (selectedPerson) {
            Alert.alert(
                'Confirmar eliminación',
                `¿Estás seguro de que deseas eliminar a ${selectedPerson.name}? Esta acción no se puede deshacer.`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Eliminar',
                        style: 'destructive',
                        onPress: () => {
                            deletePerson(selectedPerson.id);
                            setDetailsModalVisible(false);
                            setSelectedPerson(null);
                        },
                    },
                ]
            );
        }
    };

    const renderPersonItem = ({ item }: { item: Person }) => (
        <TouchableOpacity
            style={styles.personCard}
            onPress={() => handlePersonPress(item)}
        >
            <Text style={styles.personName}>{item.name}</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.loadingText}>Cargando personas...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddPerson}
                >
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {peopleList.length > 0 ? (
                <FlatList
                    data={peopleList}
                    renderItem={renderPersonItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        No hay personas en la lista. Agrega una persona con el botón superior.
                    </Text>
                </View>
            )}

            <PersonDetailsModal
                visible={detailsModalVisible}
                onClose={() => setDetailsModalVisible(false)}
                person={selectedPerson}
                onEdit={handleEditPerson}
            />

            <AddPersonModal
                visible={addModalVisible}
                onClose={() => setAddModalVisible(false)}
                onSave={handleSavePerson}
            />

            <EditPersonModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
                onSave={handleSavePerson}
                person={selectedPerson}
            />

            {selectedPerson && detailsModalVisible && (
                <View style={styles.modalFooter}>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDeletePerson}
                    >
                        <Text style={styles.deleteButtonText}>Eliminar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

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
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#2196F3',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        padding: 16,
    },
    personCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    personName: {
        fontSize: 16,
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    modalFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    deleteButton: {
        backgroundColor: '#f44336',
        padding: 12,
        borderRadius: 4,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PeopleListScreen;