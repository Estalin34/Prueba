import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';

export const WelcomeScreen = ({ navigation }:any) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>BIENVENIDO</Text>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../assets/Image/Banco-del-Pacifico.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.buttonContainer}>
                <View style={styles.button}>
                    <Button title="INICIAR SESIÓN" onPress={() => navigation.navigate('Login')} color="#0078D7" />
                </View>
                <View style={styles.button}>
                    <Button title="REGISTRARSE" onPress={() => navigation.navigate('Register')} color="#0078D7" />
                </View>
            </View>
            <Text style={styles.footer}>Desarrollado por: Estalin Fuenmayor</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#3AE8E8',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#FFFFFF',
    },
    imageContainer: {
        marginBottom: 50,
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    button: {
        width: '80%',
        marginBottom: 10,
    },
    footer: {
        fontSize: 12,
        color: '#FFFFFF',
        position: 'absolute',
        bottom: 20,
        textAlign: 'center',
    },
});

export default WelcomeScreen;
