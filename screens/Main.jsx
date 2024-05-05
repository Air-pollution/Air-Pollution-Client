import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Platform, ScrollView, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalColors } from '../globalStyles';
import { auth, db } from '../utils/firebase';
import { signOut } from 'firebase/auth';
import { ref, onValue } from '@firebase/database';
import emailjs from '@emailjs/browser';
import {set} from "firebase/database";
// Import animations
import { FadeInTemp, FadeInHumid, FadeInSmoke, FadeInPressure } from '../components/FadeAnim';
import EmptyCard from '../components/EmptyCard';
import LineChartComp from '../components/LineChartComp';
import Navbar from '../components/NavBar';
function Header({ logOut }) {
    const username = auth.currentUser.displayName;

    const handleSignOut = () => {
        signOut(auth).then(() => {
            logOut();
        }).catch((error) => {
            console.log(error);
        });
    }
    return (
        <View style={styles.header}>
            <Text style={styles.dashboardTitle}>
                {username}'s Home sensors
            </Text>
            <TouchableOpacity onPress={handleSignOut}>
                <MaterialCommunityIcons name='exit-to-app' size={30} />
            </TouchableOpacity>
        </View>
    )
}

// Thẻ hiển thị thông số
function TempCard({ value }) {
    return (
        <ImageBackground source={require('../assets/heat.jpg')} style={styles.cardContainer} resizeMode='cover'>
            <Text style={styles.title}>Temperature</Text>
            <Text style={styles.value}>{value} ℃</Text>
        </ImageBackground>
    )
}
function HumidCard({ value = 0 }) {
    return (
        <ImageBackground source={require('../assets/humid.jpg')} style={styles.cardContainer} resizeMode='cover'>
            <Text style={styles.title}>Humidity</Text>
            <Text style={styles.value}>{value} %</Text>
        </ImageBackground>
    )
}
function SmokeCard({ value = 0 }) {
    return (
        <ImageBackground source={require('../assets/smoke.jpg')} style={styles.cardContainer} resizeMode='cover'>
            <Text style={styles.title}>Smoke level</Text>
            <Text style={styles.value}>{value} %</Text>
        </ImageBackground>
    )
}
function PressureCard({ value = 0 }) {
    return (
        <ImageBackground source={require('../assets/pressure.jpg')} style={styles.cardContainer} resizeMode='cover'>
            <Text style={styles.title}>Pressure level</Text>
            <Text style={styles.value}>{value} %</Text>
        </ImageBackground>
    )
}

// function EmptyCard() {
//     return (
//         <View style={emptyCard.container}>
//             <View style={emptyCard.iconContainer}>
//                 <MaterialCommunityIcons name='fire-off' color='#dedede' size={40} />
//                 <MaterialCommunityIcons name='water-off' color='#dedede' size={40} />
//                 <MaterialCommunityIcons name='wifi-off' color='#dedede' size={40} />
//             </View>
//             <View style={emptyCard.textContainer}>
//                 <Text style={emptyCard.text}>No data available. Please connect your sensors and try again.</Text>
//             </View>
//         </View>
//     )
// }


export default function Main({ navigation }) {
    const userID = auth.currentUser.uid;
    const userName = auth.currentUser.displayName;
    const currentEmail = auth.currentUser.email;

    const [temp, setTemp] = useState(0);
    const [humid, setHumid] = useState(0);
    const [smoke, setSmoke] = useState(0);
    const [pressure, setPressure] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSensor, setSelectedSensor] = useState('');

    // function send email
const sendEmailTemp = (temperature) => {
    // emailjs.send('service_0oexdbn', 'template_n8kb5iz', 
    // { 
    //     subject: "Alert temperature", 
    //     to_name: userName, 
    //     message: "Alert temperature: " + temperature, 
    //     sender: "Fire alarm system", 
    //     receiver: currentEmail 
    // });
    console.log("Email sent!");
}
const sendEmailHumi = (Humi) => {
    // emailjs.send('service_0oexdbn', 'template_n8kb5iz', { subject: "Alert humidity", status: "humidity", to_name: userName, status: "humidity", message: "Alert humidity: " + Humi, sender: "Fire alarm system", receiver: currentEmail }, 'vRpK3hlM2u0_-RXFR')
    console.log("Email sent!");
}
const sendEmailSmoke = (Smoke) => {
    // emailjs.send('service_0oexdbn', 'template_n8kb5iz', { subject: "Alert smoke",status: "cacbon monoxide", to_name: userName, status: "cacbon monoxide", message: "Alert smoke: " + Smoke, sender: "Fire alarm system", receiver: currentEmail }, 'vRpK3hlM2u0_-RXFR')
    console.log("Email sent!");
}



    const fetchData = () => {
        const userID = auth.currentUser.uid;
        const userRef = ref(db, `User/${userID}`);
        onValue(userRef, (snapshot) => {
            const userData = snapshot.val();
            if (userData && userData.productID) {
                const productID = userData.productID;
                console.log("Product ID:", productID);
                localStorage.setItem('ProductID', productID);
                const tempRef = ref(db, `Product/${productID}/temperature`);
                const humidRef = ref(db, `Product/${productID}/humidity`);
                const smokeRef = ref(db, `Product/${productID}/co`);
                const pressureRef = ref(db, `Product/${productID}/pressure`);

                const getLastData = (ref, setData, threshold, emailFunction) => {
                    onValue(ref, (snapshot) => {
                        const data = snapshot.val();
                        if (data) {
                            const lastKey = Object.keys(data).pop();
                            const lastValue = data[lastKey];
                            setData(lastValue);
                            if (lastValue >= threshold) {
                                emailFunction(lastValue);
                            }
                        } else {
                            console.log(`No data available for ${ref.path.toString()}`);
                        }
                    }, (error) => {
                        console.error(`Error fetching data from ${ref.path.toString()}:`, error);
                    });
                };

                getLastData(tempRef, setTemp, 40, sendEmailTemp);
                getLastData(humidRef, setHumid, 20, sendEmailHumi);
                getLastData(smokeRef, setSmoke, 60, sendEmailSmoke);
                getLastData(pressureRef, setPressure, 60, sendEmailSmoke);
            } else {
                console.log("User data does not contain productID");
            }
        }, (error) => {
            console.error("Error fetching user data from Firebase:", error);
        });
    };


    const getStatus = () => {
        if (temp < 40 && smoke < 40) {
            return <Text style={[styles.status, { color: 'green' }]}> Safe</Text>;
        }
        else if (temp < 45 && smoke < 50) {
            return <Text style={[styles.status, { color: 'orange' }]}> Unsafe</Text>;
        }
        else return <Text style={[styles.status, { color: 'red' }]}> Critical</Text>;
    }

    const getSubtitle = () => {
        let status = "";
        if (temp < 40) {
            status += "Your house's temperature is normal.";
        }
        else if (temp < 45) {
            status += "Your house's temperature is high.";
        }
        else status += "Your house's temperature is dangerously high!";

        if (smoke < 40) {
            status += "\nCarbon monoxide is at a safe level.";
        }
        else if (smoke < 50) {
            status += "\nCarbon monoxide level is high.";
        }
        else status += "\nCarbon monoxide level is dangerously high!";
        return status;
    }

    const addProductIDToUser = (productID) => {
        const userRef = ref(db, `User/${userID}`);
        set(userRef, { productID })
            .then(() => console.log("Product ID added successfully"))
            .catch((error) => console.error("Error adding product ID:", error));
    };

    React.useEffect(() => {
        fetchData();
    }, []);
    const [showChart, setShowChart] = useState(false);

    // Hàm xử lý sự kiện khi ấn vào thẻ card
    const handleCardPress = (sensor) => {
        setSelectedSensor(sensor);
        console.log("Selected sensor:", sensor)
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };
    return (
        <ImageBackground style={styles.mainContainer} source={require('../assets/home_desktop.jpg')} resizeMode='cover'>
            <Navbar />
            <Header logOut={() => { navigation.navigate('Login') }} />
            <ScrollView style={{ marginTop: 0 }}>
                <View style={styles.bodyContainer}>
                    {
                        temp > 0 && humid > 0 && smoke >= 0 ? (
                            <View style={{ alignItems: 'center' }}>
                                <Text style={styles.status}>
                                    Status: {getStatus()}
                                </Text>
                                <Text style={styles.statusSub}>
                                    {getSubtitle()}
                                </Text>
                                <View style={styles.valuesContainer}>
                                    <TouchableOpacity onPress={() => handleCardPress('temperature')}>
                                        <View style={styles.cardWrapper}>
                                            <FadeInTemp>
                                                <TempCard value={temp} />
                                            </FadeInTemp>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleCardPress('humidity')}>
                                        <View style={styles.cardWrapper}>
                                            <FadeInHumid>
                                                <HumidCard value={humid} />
                                            </FadeInHumid>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleCardPress('co')}>
                                        <View style={styles.cardWrapper}>
                                            <FadeInSmoke>
                                                <SmokeCard value={smoke} />
                                            </FadeInSmoke>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleCardPress('pressure')}>
                                        <View style={styles.cardWrapper}>
                                            <FadeInPressure>
                                                <PressureCard value={pressure} />
                                            </FadeInPressure>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                            :
                            (
                                <View style={{ height: '100%', justifyContent: 'center' }}>
                                    <EmptyCard addProductIDToUser={addProductIDToUser} />
                                </View>
                            )
                    }
                </View>
            </ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={closeModal}>
                            <Text style={styles.closeButton}>X</Text>
                        </TouchableOpacity>
                        <View style={styles.chartContainer}>
                            <LineChartComp sensor={selectedSensor} />
                        </View>
                    </View>
                </View>
            </Modal>


        </ImageBackground>

    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền mờ khi modal hiển thị
    },
    modalContent: {
        width: '80%',
        // backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
    },
    chartContainer: {
        alignItems: 'center', // Canh chỉnh biểu đồ ở giữa theo chiều ngang
        marginTop: 20, // Khoảng cách giữa biểu đồ và nút đóng modal
    },
    closeButton: {
        alignSelf: 'flex-end', // Canh chỉnh nút đóng modal sang phải
        marginTop: -10, // Khoảng cách giữa nút đóng và biểu đồ
        fontWeight: 'bold',
    },
    dashboardTitle: {
        fontSize: Platform.OS === 'web' ? 30 : 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    header: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: Platform.OS === 'web' ? 0 : 24,
    },
    mainContainer: {
        backgroundColor: globalColors.backgroundBlue,
        flex: 1,
    },
    bodyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    valuesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
    },
    cardWrapper: {
        width: '45%', // Đảm bảo phần tử con không bị tràn ra khỏi màn hình
        margin: 5, // Khoảng cách giữa các thẻ
    },
    cardContainer: {
        width: Platform.OS === 'web' ? 350 : 250,
        height: 175,
        backgroundColor: '#fff',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 10,
        overflow: 'hidden',
        marginHorizontal: 20,
        shadowColor: "#000",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.43,
        shadowRadius: 9.51,
        elevation: 15,
    },
    status: {
        fontSize: 26,
        fontWeight: 600,
        textAlign: 'center',
        marginBottom: 40,
    },
    statusSub: {
        fontSize: Platform.OS === 'web' ? 26 : 20,
        fontWeight: 600,
        textAlign: 'center',
        marginBottom: 20,
        padding: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: Platform.OS === 'web' ? 28 : 24,
        fontWeight: 'bold',
        color: '#fff'
    },
    value: {
        fontSize: 26,
        color: '#fff',
    },
});

const emptyCard = StyleSheet.create({
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
    text: {
        fontSize: 24,
        textAlign: 'center',
        flexWrap: 'wrap'
    },
});

