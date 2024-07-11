import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { auth, database } from '../Config/Config';
import { signOut } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';

interface UserData {
    username: string;
    email: string;
    phone: string;
}

interface Account {
    id: string;
    name: string;
}

export const ProfileScreen = ({ navigation }: any) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [accounts, setAccounts] = useState<Account[]>([
        { id: '1', name: 'Principal' },
        { id: '2', name: 'Trabajo' },
        { id: '3', name: 'Estudios' }
    ]);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const userRef = ref(database, 'users/' + user.uid);
            onValue(userRef, (snapshot) => {
                setUserData(snapshot.val());
            });

            const accountsRef = ref(database, 'accounts');
            onValue(accountsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const accountsList = Object.keys(data).map(key => ({ ...data[key], id: key }));
                    setAccounts(accountsList);
                }
            });
        }
    }, []);

    const handleLogout = () => {
        signOut(auth).then(() => {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
            });
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.bankName}>BANCO PACIFICO</Text>
                <Text style={styles.lastLogin}>Último ingreso: 08 jul. 2021 / 13h10</Text>
            </View>

            <View style={styles.productsContainer}>
                <Text style={styles.productsHeader}>Mis productos</Text>
                <FlatList
                    horizontal
                    data={accounts}
                    renderItem={({ item }) => (
                        <View style={styles.accountCard}>
                            <Text style={styles.accountName}>{item.name}</Text>
                            <Text style={styles.accountNumber}>No. 220032XXX</Text>
                            <Text style={styles.accountBalance}>Saldo disponible</Text>
                            <TouchableOpacity style={styles.viewAllButton}>
                                <Text style={styles.viewAllButtonText}>Ver todas mis cuentas</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={item => item.id}
                />
            </View>

            <View style={styles.userInfoContainer}>
                {userData && (
                    <>
                        <TextInput
                            style={styles.userInfoInput}
                            value={`Usuario: ${userData.username}`}
                            editable={false}
                        />
                        <TextInput
                            style={styles.userInfoInput}
                            value={`Celular: ${userData.phone}`}
                            editable={false}
                        />
                    </>
                )}
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Transferir Dinero</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Pagar Servicios</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Pagar Tarjetas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Todas las operaciones</Text>
                </TouchableOpacity>
            </View>

            <Button title="Cerrar Sesión" onPress={handleLogout} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    bankName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    lastLogin: {
        fontSize: 12,
        color: 'gray',
    },
    productsContainer: {
        width: '100%',
        marginBottom: 20,
    },
    productsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    accountCard: {
        backgroundColor: '#f9f9f9',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginRight: 10,
    },
    accountName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    accountNumber: {
        fontSize: 16,
        color: 'gray',
    },
    accountBalance: {
        fontSize: 16,
        marginVertical: 10,
    },
    viewAllButton: {
        backgroundColor: '#ffdd00',
        padding: 10,
        borderRadius: 5,
    },
    viewAllButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    userInfoContainer: {
        width: '100%',
        marginBottom: 20,
    },
    userInfoInput: {
        backgroundColor: '#fff',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    actionButton: {
        backgroundColor: '#3AB1E8',
        padding: 8,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        width: '20%',
        
    },
    actionButtonText: {
        fontSize: 12,
        textAlign: 'center',
    },
});

export default ProfileScreen;
