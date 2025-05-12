import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MyProfileScreen from '../screens/MyProfileScreen';
import PeopleListScreen from '../screens/PeopleListScreen';
import { RootStackParamList } from '../../types/types';

const Tab = createBottomTabNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName: keyof typeof Ionicons.glyphMap = 'person';

                        if (route.name === 'MyProfile') {
                            iconName = focused ? 'person' : 'person-outline';
                        } else if (route.name === 'PeopleList') {
                            iconName = focused ? 'people' : 'people-outline';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}
            >
                <Tab.Screen
                    name="MyProfile"
                    component={MyProfileScreen}
                    options={{ title: 'Mi Perfil' }}
                />
                <Tab.Screen
                    name="PeopleList"
                    component={PeopleListScreen}
                    options={{ title: 'Lista de personas' }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;