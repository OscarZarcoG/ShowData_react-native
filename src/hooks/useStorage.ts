import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Person } from '../types/types';
import { generateUniqueId } from '../utils/helpers';

const MY_PROFILE_KEY = '@my_profile';
const PEOPLE_LIST_KEY = '@people_list';

export const useStorage = () => {
    const [myProfile, setMyProfile] = useState<Person | null>(null);
    const [peopleList, setPeopleList] = useState<Person[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);

                const profileData = await AsyncStorage.getItem(MY_PROFILE_KEY);
                if (profileData) {
                    const parsedProfile = JSON.parse(profileData);
                    parsedProfile.birthDate = new Date(parsedProfile.birthDate);
                    setMyProfile(parsedProfile);
                }

                const peopleData = await AsyncStorage.getItem(PEOPLE_LIST_KEY);
                if (peopleData) {
                    const parsedPeople = JSON.parse(peopleData);
                    parsedPeople.forEach((person: Person) => {
                        person.birthDate = new Date(person.birthDate);
                    });
                    setPeopleList(parsedPeople);
                }
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const saveMyProfile = async (profile: Person) => {
        try {
            if (!profile.id) {
                profile.id = generateUniqueId();
            }
            await AsyncStorage.setItem(MY_PROFILE_KEY, JSON.stringify(profile));
            setMyProfile(profile);
            return true;
        } catch (error) {
            console.error('Error saving profile:', error);
            return false;
        }
    };

    const deleteMyProfile = async () => {
        try {
            await AsyncStorage.removeItem(MY_PROFILE_KEY);
            setMyProfile(null);
            return true;
        } catch (error) {
            console.error('Error deleting profile:', error);
            return false;
        }
    };

    const savePerson = async (person: Person) => {
        try {
            let updatedList = [...peopleList];

            if (person.id) {
                const index = updatedList.findIndex(p => p.id === person.id);
                if (index !== -1) {
                    updatedList[index] = person;
                }
            } else {
                person.id = generateUniqueId();
                updatedList.push(person);
            }

            await AsyncStorage.setItem(PEOPLE_LIST_KEY, JSON.stringify(updatedList));
            setPeopleList(updatedList);
            return true;
        } catch (error) {
            console.error('Error saving person:', error);
            return false;
        }
    };

    const deletePerson = async (personId: string) => {
        try {
            const updatedList = peopleList.filter(person => person.id !== personId);
            await AsyncStorage.setItem(PEOPLE_LIST_KEY, JSON.stringify(updatedList));
            setPeopleList(updatedList);
            return true;
        } catch (error) {
            console.error('Error deleting person:', error);
            return false;
        }
    };

    return {
        myProfile,
        peopleList,
        isLoading,
        saveMyProfile,
        deleteMyProfile,
        savePerson,
        deletePerson
    };
};