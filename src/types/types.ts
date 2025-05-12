import { ImagePickerAsset } from 'expo-image-picker';

export interface Person {
    id: string;
    name: string;
    birthDate: Date;
    gender: 'Masculino' | 'Femenino' | 'Otro';
    education: string;
    bloodType: string;
    height: number;
    weight: number;
    photo?: ImagePickerAsset | null;
}

export type RootStackParamList = {
    MyProfile: undefined;
    PeopleList: undefined;
};

export const EDUCATION_LEVELS = [
    'Preescolar',
    'Primaria',
    'Secundaria',
    'Preparatoria o Bachillerato',
    'Carrera Técnica',
    'Licenciatura',
    'Ingeniería',
    'Maestría',
    'Doctorado',
    'Posdoctorado',
    'Sin estudios',
];

export const BLOOD_TYPES = [
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
];