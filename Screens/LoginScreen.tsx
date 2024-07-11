import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Config/Config';

const LoginScreen = ({ navigation }:any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (email === '' || password === '') {
            setError('Todos los campos son obligatorios');
            return;
        }
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                // Navegar a la pantalla Home después del inicio de sesión exitoso
                navigation.navigate('Home');
            })
            .catch(error => {
                setError(error.message);
            });
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>LOGIN</Text>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Ingrese correo"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Ingrese contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <View style={styles.button}>
                <Button title="Login" onPress={handleLogin} color="#0078D7" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    headerContainer: {
        marginBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    button: {
        width: '80%',
        marginTop: 10,
    },
});

export default LoginScreen;
