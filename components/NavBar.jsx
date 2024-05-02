import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export const Navbar = () => {
    const navigation = useNavigation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Website</Text>
                <TouchableOpacity style={styles.menu} onPress={handleMenuToggle}>
                    <View style={styles.menuBar} />
                    <View style={styles.menuBar} />
                    <View style={styles.menuBar} />
                </TouchableOpacity>
            </View>
            {menuOpen && (
                <View style={styles.menuContainer}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            navigation.navigate("About");
                            setMenuOpen(false);
                        }}
                    >
                        <Text style={styles.menuText}>About</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            navigation.navigate("Services");
                            setMenuOpen(false);
                        }}
                    >
                        <Text style={styles.menuText}>Services</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            navigation.navigate("Contact");
                            setMenuOpen(false);
                        }}
                    >
                        <Text style={styles.menuText}>Contact</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#0f172a",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },
    menu: {
        padding: 10,
    },
    menuBar: {
        height: 4,
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 2,
        marginVertical: 2,
    },
    menuContainer: {
        backgroundColor: "#0f172a",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    menuItem: {
        paddingVertical: 8,
    },
    menuText: {
        color: "white",
    },
});

export default Navbar;