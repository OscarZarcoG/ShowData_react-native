import React from 'react';
import { Person } from '../../types/types';
import AddPersonModal from './AddPersonModal';

interface EditPersonModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (person: Person) => void;
    person: Person | null;
}

const EditPersonModal: React.FC<EditPersonModalProps> = ({
    visible,
    onClose,
    onSave,
    person
}) => {
    if (!person) return null;

    return (
        <AddPersonModal
            visible={visible}
            onClose={onClose}
            onSave={onSave}
            person={person}
            isEditMode={true}
        />
    );
};

export default EditPersonModal;