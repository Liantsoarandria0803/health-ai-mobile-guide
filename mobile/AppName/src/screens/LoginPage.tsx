import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Card from '../components/ui/Card';
import Label from '../components/ui/Label';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    // Basic validation
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email/username and password.');
      return;
    }
    // In a real app, you would handle authentication here
    Alert.alert('Login Attempt', `Email: ${email}, Password: ${password}`);
    console.log('Login attempt with:', { email, password });
  };

  return (
    <View style={styles.container}>
      <Card>
        <Label>Email or Username</Label>
        <Input
          placeholder="Enter your email or username"
          value={email}
          onChangeText={setEmail}
        />
        <Label>Password</Label>
        <Input
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Login" onPress={handleLogin} />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0', // A light background color
  },
});

export default LoginPage;
