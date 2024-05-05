import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { LineChart } from 'recharts';
import { XAxis, Tooltip, CartesianGrid, Line } from 'recharts';
import { db, ref, onValue } from '../utils/firebase';
import { ImageBackground } from 'react-native';
import Navbar from './NavBar';
import { StyleSheet } from 'react-native';
const LineChartRechart = () => {
    const [data, setData] = useState([]);
    const [dataHumid, setDataHumid] = useState([]);
    const [dataCo, setDataCo] = useState([]);
    const [dataPressure, setDataPressure] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const temperatureRef = ref(db, 'Product/nfI9A/temperature');
            onValue(temperatureRef, (snapshot) => {
                const temperatureData = snapshot.val();
                const temperatureArray = Object.values(temperatureData).slice(-10); // Lấy 10 dữ liệu mới nhất
                setData(temperatureArray.map((value, index) => ({ name: index, temperature: value })));
            });

            const humidityRef = ref(db, 'Product/nfI9A/humidity');
            onValue(humidityRef, (snapshot) => {
                const humidityData = snapshot.val();
                const humidityArray = Object.values(humidityData).slice(-10); // Lấy 10 dữ liệu mới nhất
                setDataHumid(humidityArray.map((value, index) => ({ name: index, humidity: value })));
            });
            
            const coRef = ref(db, 'Product/nfI9A/co');
            onValue(coRef, (snapshot) => {
                const coData = snapshot.val();
                const coArray = Object.values(coData).slice(-10); // Lấy 10 dữ liệu mới nhất
                setDataCo(coArray.map((value, index) => ({ name: index, co: value })));
            });

            const pressureRef = ref(db, 'Product/nfI9A/pressure');
            onValue(pressureRef, (snapshot) => {
                const pressureData = snapshot.val();
                const pressureArray = Object.values(pressureData).slice(-10); // Lấy 10 dữ liệu mới nhất
                setDataPressure(pressureArray.map((value, index) => ({ name: index, pressure: value })));
            });
        };

        fetchData();
    }, []);

    return (
        <ImageBackground source={require('../assets/home_desktop.jpg')} resizeMode='cover' style={styles.imageBackground}>
            <View style={styles.container}>
                <Navbar />
                <LineChart width={400} height={400} data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <XAxis dataKey="name" />
                    <Tooltip />
                    <CartesianGrid stroke="#f5f5f5" />
                    <Line type="monotone" dataKey="temperature" stroke="#ff7300" />
                </LineChart>

                <LineChart width={400} height={400} data={dataHumid} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <XAxis dataKey="name" />
                    <Tooltip />
                    <CartesianGrid stroke="#f5f5f5" />
                    <Line type="monotone" dataKey="humidity" stroke="#ff7300" />
                </LineChart>

                <LineChart width={400} height={400} data={dataCo} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <XAxis dataKey="name" />
                    <Tooltip />
                    <CartesianGrid stroke="#f5f5f5" />
                    <Line type="monotone" dataKey="humidity" stroke="#ff7300" />
                </LineChart>

                <LineChart width={400} height={400} data={dataPressure} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <XAxis dataKey="name" />
                    <Tooltip />
                    <CartesianGrid stroke="#f5f5f5" />
                    <Line type="monotone" dataKey="humidity" stroke="#ff7300" />
                </LineChart>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    imageBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
    },
});
export default LineChartRechart;
