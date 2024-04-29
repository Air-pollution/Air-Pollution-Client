import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function EmptyCard({ addProductIDToUser }) {
    const [newProductID, setNewProductID] = useState('');

    const handleAddProductID = () => {
        if (newProductID.trim() !== '') {
            addProductIDToUser(newProductID.trim());
            setNewProductID('');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name='fire-off' color='#dedede' size={40} />
                <MaterialCommunityIcons name='water-off' color='#dedede' size={40} />
                <MaterialCommunityIcons name='wifi-off' color='#dedede' size={40} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>No data available. Please connect your sensors and try again.</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Product ID"
                    value={newProductID}
                    onChangeText={setNewProductID}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddProductID}>
                    <Text style={styles.addButtonLabel}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        width: 300,
        height: 300,
        backgroundColor: '#fff',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop: 40,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
    },
    textContainer: {
        width: '100%',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        height: 40,
        width: 200,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    addButton: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    addButtonLabel: {
        color: 'white',
        fontSize: 20,
    },
});
