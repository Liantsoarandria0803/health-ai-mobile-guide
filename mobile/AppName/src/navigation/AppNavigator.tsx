import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from '../screens/LoginPage';
import RegisterPage from '../screens/RegisterPage';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  // Add other screen definitions here as your app grows
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginPage} options={{ title: 'Login' }} />
      <Stack.Screen name="Register" component={RegisterPage} options={{ title: 'Register' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
