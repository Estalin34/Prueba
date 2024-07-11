import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { database, auth } from '../Config/Config';
import { ref, push, set, onValue } from 'firebase/database';

const OperationsScreen = () => {
  const [operationId, setOperationId] = useState('');
  const [amount, setAmount] = useState('');
  const [operationType, setOperationType] = useState('');
  const [comment, setComment] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Obtiene la información del usuario actual al cargar el componente
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(database, 'users/' + user.uid);
      onValue(userRef, (snapshot) => {
        setUserData(snapshot.val());
      });
    }
  }, []);

  const handleSaveOperation = () => {
    // Validación de campos
    if (!operationId || !amount || !operationType || !comment) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    const parsedAmount = parseFloat(amount);

    // Validación de monto máximo permitido
    if (parsedAmount > 500) {
      Alert.alert('Error', 'Las transacciones superiores a $500 no están permitidas');
      return;
    }

    // Confirmación para montos menores a cierto valor
    if (parsedAmount < 5) {
      Alert.alert(
        'Alerta',
        '¿Estás seguro de que el monto ingresado es correcto?',
        [
          { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
          { text: 'Aceptar', onPress: saveOperation }
        ],
        { cancelable: false }
      );
      return;
    }

    saveOperation(); // Ejecuta la operación de guardado directamente
  };

  const saveOperation = () => {
    const operationsRef = ref(database, 'operations');
    const parsedAmount = parseFloat(amount);

    const newOperationRef = push(operationsRef); // Genera una nueva clave única para la operación
    const operationKey = newOperationRef.key;

    if (operationKey) {
      // Datos a guardar
      const operationData = {
        operationId,
        amount: parsedAmount,
        operationType,
        comment,
        user: userData, // Guarda la información del usuario
      };

      set(newOperationRef, operationData) // Guarda los datos en la referencia generada
        .then(() => {
          Alert.alert('Éxito', 'Operación realizada con éxito');
          // Limpia los campos después de una operación exitosa
          setOperationId('');
          setAmount('');
          setOperationType('');
          setComment('');
        })
        .catch((error) => {
          Alert.alert('Error', error.message);
        });
    } else {
      Alert.alert('Error', 'No se pudo generar la clave para la operación');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Realizar Operación</Text>
      <TextInput
        style={styles.input}
        placeholder="ID de Operación"
        value={operationId}
        onChangeText={setOperationId}
      />
      <TextInput
        style={styles.input}
        placeholder="Monto ($)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo de Operación"
        value={operationType}
        onChangeText={setOperationType}
      />
      <TextInput
        style={styles.input}
        placeholder="Comentario"
        value={comment}
        onChangeText={setComment}
      />
      <Button title="Ejecutar Operación" onPress={handleSaveOperation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
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
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default OperationsScreen;
