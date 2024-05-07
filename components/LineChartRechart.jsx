// import React, { useEffect, useState } from 'react';
// import { View } from 'react-native';
// import { LineChart } from 'recharts';
// import { XAxis, Tooltip, CartesianGrid, Line } from 'recharts';
// import { db, ref, onValue } from '../utils/firebase';
// import { ImageBackground } from 'react-native';
// import Navbar from './NavBar';
// import { StyleSheet } from 'react-native';

// const LineChartRechart = () => {
//     const [data, setData] = useState([]);
//     const [dataHumid, setDataHumid] = useState([]);
//     const [dataPressure, setDataPressure] = useState([]);
//     const [dataCo, setDataCo] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             const temperatureRef = ref(db, 'Product/nfI9A/temperature');
//             onValue(temperatureRef, (snapshot) => {
//                 const temperatureData = snapshot.val();
//                 const temperatureArray = Object.values(temperatureData).slice(-10); // Lấy 10 dữ liệu mới nhất
//                 setData(temperatureArray.map((value, index) => ({ name: index, temperature: value })));
//             });

//             const humidityRef = ref(db, 'Product/nfI9A/humidity');
//             onValue(humidityRef, (snapshot) => {
//                 const humidityData = snapshot.val();
//                 const humidityArray = Object.values(humidityData).slice(-10); // Lấy 10 dữ liệu mới nhất
//                 setDataHumid(humidityArray.map((value, index) => ({ name: index, humidity: value })));
//             });

//             const pressureRef = ref(db, 'Product/nfI9A/pressure');
//             onValue(pressureRef, (snapshot) => {
//                 const pressureData = snapshot.val();
//                 const pressureArray = Object.values(pressureData).slice(-10); // Lấy 10 dữ liệu mới nhất
//                 setDataPressure(pressureArray.map((value, index) => ({ name: index, pressure: value })));
//             });

//             const coRef = ref(db, 'Product/nfI9A/co');
//             onValue(coRef, (snapshot) => {
//                 const coData = snapshot.val();
//                 const coArray = Object.values(coData).slice(-10); // Lấy 10 dữ liệu mới nhất
//                 setDataCo(coArray.map((value, index) => ({ name: index, co: value })));
//             });
//         };

//         fetchData();
//     }, []);

//     return (
//         <ImageBackground  source={require('../assets/home_desktop.jpg')} resizeMode='cover' style={styles.imageBackground}>
//             <Navbar />
//             <View style={styles.container}>
//                 <View style={styles.chartContainer}>
                    
//                     <LineChart width={600} height={400} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
//                         <XAxis dataKey="name" />
//                         <Tooltip />
//                         <CartesianGrid stroke="#f5f5f5" />
//                         <Line data={data} type="monotone" dataKey="temperature" stroke="#e26a00" />
//                         <Line data={dataHumid} type="monotone" dataKey="humidity" stroke="#1E88E5" />
//                         <Line data={dataPressure} type="monotone" dataKey="pressure" stroke="#FF5722" />
//                         <Line data={dataCo} type="monotone" dataKey="co" stroke="#78909C" />
//                     </LineChart>
//                 </View>
//             </View>
//         </ImageBackground>
//     );
// };

// const styles = StyleSheet.create({
//     imageBackground: {
//         flex: 1,
//         width: '100%',
//         height: '100%',
//     },
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     chartContainer: {
//         alignItems: 'center',
//     },
// });

// export default LineChartRechart;



import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { LineChart } from 'recharts';
import { XAxis, Tooltip, CartesianGrid, Line } from 'recharts';
import { ImageBackground } from 'react-native';
import Navbar from './NavBar';
import { StyleSheet } from 'react-native';

const LineChartRechart = () => {
    const [testdata, setTestData] = useState([
        { name: '1', temperature: 25, humidity: 50 ,pressure: 1010, co: 300 },
        { name: '2', temperature: 24, humidity: 50 ,pressure: 1010, co: 300 },
        { name: '3', temperature: 23, humidity: 50 ,pressure: 1010, co: 300 },
        { name: '4', temperature: 22, humidity: 50 ,pressure: 1010, co: 300 },
        { name: '5', temperature: 21, humidity: 50 ,pressure: 1010, co: 300 },
        { name: '6', temperature: 20, humidity: 50 ,pressure: 1010, co: 300 },
        { name: '7', temperature: 19, humidity: 50 ,pressure: 1010, co: 300 },
        { name: '8', temperature: 18, humidity: 50 ,pressure: 1010, co: 300 },
        { name: '9', temperature: 17, humidity: 50 ,pressure: 1010, co: 300 },
        { name: '10', temperature: 16, humidity: 50 ,pressure: 1010, co: 300 },
    ]);
    const [data, setData] = useState([
        { name: '1', temperature: 25 },
        { name: '2', temperature: 24 },
        { name: '3', temperature: 23 },
        { name: '4', temperature: 22 },
        { name: '5', temperature: 21 }
        { name: '6', temperature: 20 },
        { name: '7', temperature: 19 },
        { name: '8', temperature: 18 },
        { name: '9', temperature: 17 },
        { name: '10', temperature: 16 },
    ]);
    const [dataHumid, setDataHumid] = useState([
        { name: '1', humidity: 50 },
        { name: '2', humidity: 51 },
        { name: '3', humidity: 52 },
        { name: '4', humidity: 53 },
        { name: '5', humidity: 54 },
        { name: '6', humidity: 55 },
        { name: '7', humidity: 56 },
        { name: '8', humidity: 57 },
        { name: '9', humidity: 58 },
        { name: '10', humidity: 59 },
    ]);
    const [dataPressure, setDataPressure] = useState([
        { name: '1', pressure: 1010 },
        { name: '2', pressure: 1009 },
        { name: '3', pressure: 1008 },
        { name: '4', pressure: 1007 },
        { name: '5', pressure: 1006 },
        { name: '6', pressure: 1005 },
        { name: '7', pressure: 1004 },
        { name: '8', pressure: 1003 },
        { name: '9', pressure: 1002 },
        { name: '10', pressure: 1001 },
    ]);
    const [dataCo, setDataCo] = useState([
        { name: '1', co: 300 },
        { name: '2', co: 310 },
        { name: '3', co: 320 },
        { name: '4', co: 330 },
        { name: '5', co: 340 },
        { name: '6', co: 350 },
        { name: '7', co: 360 },
        { name: '8', co: 370 },
        { name: '9', co: 380 },
        { name: '10', co: 390 },
    ]);

    return (
        <ImageBackground source={require('../assets/home_desktop.jpg')} resizeMode='cover' style={styles.imageBackground}>
            <Navbar />
            <View style={styles.container}>
                <View style={styles.chartContainer}>

                    <LineChart data={testdata} width={600} height={400} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <XAxis dataKey="name" />
                        <Tooltip />
                        <CartesianGrid stroke="#f5f5f5" />
                        <Line  type="monotone" dataKey="temperature" stroke="#e26a00" yAxisId={0} />
                        <Line  type="monotone" dataKey="humidity" stroke="#e26a00" yAxisId={0} />
                        <Line  type="monotone" dataKey="pressure" stroke="#e26a00" yAxisId={0} />
                        <Line  type="monotone" dataKey="co" stroke="#e26a00" yAxisId={0} />


                    </LineChart>
                </View>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartContainer: {
        alignItems: 'center',
    },
});

export default LineChartRechart;
