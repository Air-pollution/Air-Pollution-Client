import React from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import TableCustom from "../components/TableCustom";
import Navbar from "../components/NavBar";

const Equipment = () => {
    return (
        <ImageBackground source={require('../assets/home_desktop.jpg')} resizeMode='cover' style={styles.background}>
            <Navbar />
            <View style={styles.container}>
                <Text style={styles.title}>Equipment</Text>
                <TableCustom />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
    },
});

export default Equipment;
