import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { database, auth } from '../Config/Config';
import { ref, onValue } from 'firebase/database';

interface Transaction {
    id: string;
    operationId: string;
    amount: number;
    operationType: string;
    comment: string;
    // Puedes añadir otros campos según sea necesario
}

const TransactionItem = ({ item }: { item: Transaction }) => {
    const handlePress = () => {
        Alert.alert('Comentario de la Operación', item.comment);
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.transaction}>
            <Text>Orden: {item.operationId}</Text>
            <Text>Monto: {item.amount}</Text>
            <Text>Tipo: {item.operationType}</Text>
        </TouchableOpacity>
    );
};

const HistoryScreen = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            return; // Manejar usuario no autenticado
        }

        const transactionsRef = ref(database, 'operations'); // Cambiado a 'operations'
        const unsubscribe = onValue(transactionsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const transactionsList = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                })) as Transaction[];
                setTransactions(transactionsList);
            } else {
                setTransactions([]);
            }
        });

        return () => unsubscribe(); // Limpia el listener cuando el componente se desmonta
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Mi Historial</Text>
            <FlatList
                data={transactions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransactionItem item={item} />}
                ListEmptyComponent={<Text>No hay transacciones</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    transaction: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default HistoryScreen;
