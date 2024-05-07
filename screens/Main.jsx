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
                {username}'s Equipment
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
    const [predictedClass, setPredictedClass] = useState(0);
    // function send email
const sendEmailTemp = (temperature) => {
    emailjs.send('service_0oexdbn', 'template_n8kb5iz', { subject: "Alert temperature", status: "temperature", to_name: userName, status: "temperature", message: "Alert temperature: " + temperature, sender: "Air Pollution Monitoring System", receiver: currentEmail }, 'vRpK3hlM2u0_-RXFR')
    console.log("Email sent!");
}
const sendEmailHumi = (Humi) => {
    emailjs.send('service_0oexdbn', 'template_n8kb5iz', { subject: "Alert humidity", status: "humidity", to_name: userName, status: "humidity", message: "Alert humidity: " + Humi, sender: "Air Pollution Monitoring System", receiver: currentEmail }, 'vRpK3hlM2u0_-RXFR')
    console.log("Email sent!");
}
const sendEmailSmoke = (Smoke) => {
    emailjs.send('service_0oexdbn', 'template_n8kb5iz', { subject: "Alert smoke",status: "cacbon monoxide", to_name: userName, status: "cacbon monoxide", message: "Alert smoke: " + Smoke, sender: "Air Pollution Monitoring System", receiver: currentEmail }, 'vRpK3hlM2u0_-RXFR')
    console.log("Email sent!");
    }
    
    const sendEmailPressure = (Pressure) => {
        emailjs.send('service_0oexdbn', 'template_n8kb5iz', { subject: "Alert pressure", status: "air pressure", to_name: userName, status: "air pressure", message: "Alert pressure: " + Pressure, sender: "Air Pollution Monitoring System", receiver: currentEmail }, 'vRpK3hlM2u0_-RXFR')
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
                const predictedClassRef = ref(db, `Product/${productID}/predictedClass`);
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

                getLastData(tempRef, setTemp, 35, sendEmailTemp);
                getLastData(humidRef, setHumid, 80, sendEmailHumi);
                getLastData(smokeRef, setSmoke, 35, sendEmailSmoke);
                getLastData(pressureRef, setPressure, 1020, sendEmailPressure);
                getLastData(predictedClassRef, setPredictedClass, 80, sendEmailHumi);
            } else {
                console.log("User data does not contain productID");
            }
        }, (error) => {
            console.error("Error fetching user data from Firebase:", error);
        });
    };


    const getStatus = () => {
        console.log("temp", temp);
        console.log("predict: ", predictedClass);
        if ( temp <= 25 && temp >= 20 && humid >= 40 && humid <= 60 && pressure >= 1010 && pressure <= 1015 && smoke <= 9 ) {
            return <Text style={[styles.status, { color: 'green' }]}> Safe</Text>;
        }
        else if (temp >= 35 || humid <= 30 || smoke > 35 || pressure < 1000 || pressure > 1020) {
            return <Text style={[styles.status, { color: 'red' }]}> Critical</Text>;
        }
        else return <Text style={[styles.status, { color: 'orange' }]}> Warning</Text>;

        
    }
    const getPredict = () => {
        switch (predictedClass) {
            case 0:
                return <Text style={[styles.status, { color: 'green' }]}> Clear</Text>;
            case 1:
                return <Text style={[styles.status, { color: 'orange' }]}> Sunny</Text>;
            case 2:
                return <Text style={[styles.status, { color: 'blue' }]}> Mist</Text>;
            case 3:
                return <Text style={[styles.status, { color: 'grey' }]}> Light drizzle</Text>;
            case 4:
                return <Text style={[styles.status, { color: 'light blue' }]}> Light rain</Text>;
            case 5:
                return <Text style={[styles.status, { color: 'dark' }]}> Overcast</Text>;
            case 6:
                return <Text style={[styles.status, { color: '#104491' }]}> Cloudy</Text>;
            case 7:
                return <Text style={[styles.status, { color: '#98B5C7' }]}> Party Cloudy</Text>;
            case 8:
                return <Text style={[styles.status, { color: '#28292A' }]}> Patchy Light drizzle</Text>;
            case 9:
                return <Text style={[styles.status, { color: '#B6A6A6' }]}> Fog</Text>;
            case 10:
                return <Text style={[styles.status, { color: '#4F4F4F' }]}> Moderate rain</Text>;
            case 11:
                return <Text style={[styles.status, { color: '#87CEEB' }]}> Patchy Rain Possible</Text>;
            default:
        }
    }

    const getSubtitle = () => {
        let status = "";
        if (temp < 25 && temp > 20) {
            status += "Temperature is normal.";
        }
        else if (temp > 35) {
            status += "Temperature is dangerous.";
        }
        else status += "Temperature is warning";
        //humid
        if (humid < 60 && humid > 40) {
            status += "\nHumidity is at a safe level.";
        }
        else if (humid < 30) {
            status += "\nHumidity level is dangerous.";
        }
        else status += "\nHumidity level is warning.";
        //pressure
        if (pressure < 1015 && pressure > 1010) {
            status += "\nPressure is at a safe level.";
        }
        else if (pressure > 1020) {
            status += "\nPressure level is dangerous.";
        }
        else status += "\nPressure level is warning.";
        //smoke
        if (smoke < 9) {
            status += "\nCarbon monoxide is at a safe level.";
        }
        else if (smoke > 35) {
            status += "\nCarbon monoxide level is high.";
        }
        else status += "\nCarbon monoxide level is warning.";
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
                                <Text style={styles.status}>
                                    Predict: {getPredict()}
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

