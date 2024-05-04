import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
export const Navbar = () => {
    const navigation = useNavigation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const { width } = Dimensions.get('window');
        setIsMobile(Platform.OS === 'ios' && width < 768);
    }, []);

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <View style={styles.container}>
            {!isMobile && ( // Chỉ hiển thị nút menu cho thiết bị không phải di động
                <TouchableOpacity style={styles.menuButton} onPress={handleMenuToggle}>
                    <Text style={styles.menuButtonText}>{menuOpen ? 'Close' : 'Menu'}</Text>
                </TouchableOpacity>
            )}
            <View style={styles.menuContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>Website</Text>
                    {isMobile && ( // Hiển thị biểu tượng menu cho thiết bị di động
                        <TouchableOpacity style={styles.menuIcon} onPress={handleMenuToggle}>
                            <View style={styles.menuBar} />
                            <View style={styles.menuBar} />
                            <View style={styles.menuBar} />
                        </TouchableOpacity>
                    )}
                </View>
                {(!isMobile || menuOpen) && ( // Hiển thị menu trên PC hoặc trên thiết bị di động nếu menu đã được mở
                    <View style={styles.menuItems}>
                        <TouchableOpacity
                            style={styles.menuItem}
                        onPress={() => {
                            navigation.navigate("LineChartRechart");
                            setMenuOpen(false);
                        }}
                        >
                            <Text style={styles.menuText}>Live</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.menuItem}
                        onPress={() => {
                            navigation.navigate("Equipment");
                            setMenuOpen(false);
                        }}
                        >
                            <Text style={styles.menuText}>Equipment</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.menuItem}
                        // onPress={() => {
                        //     navigation.navigate("Contact");
                        //     setMenuOpen(false);
                        // }}
                        >
                            <Text style={styles.menuText}>Contact</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#0f172a",
    },
    menuButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1,
        padding: 10,
        backgroundColor: '#ffffff80',
        borderRadius: 5,
    },
    menuButtonText: {
        color: 'black',
    },
    menuContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },
    menuIcon: {
        padding: 10,
    },
    menuBar: {
        height: 4,
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 2,
        marginVertical: 2,
    },
    menuItems: {
        flexDirection: "row",
    },
    menuItem: {
        padding: 8,
        marginLeft: 20,
    },
    menuText: {
        color: "white",
    },
});

export default Navbar;
