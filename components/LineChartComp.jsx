// Import các dependencies cần thiết
import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ref, onValue } from '@firebase/database';
import { db } from '../utils/firebase';

// Component biểu đồ đường
const LineChartComp = ({ sensor }) => {
    const [sensorData, setSensorData] = useState([]);
    const ProductID = localStorage.getItem('ProductID');

    useEffect(() => {
        const fetchSensorData = () => {
            const sensorRef = ref(db, `Product/${ProductID}/${sensor}`);
            onValue(sensorRef, (snapshot) => {
                const sensorValues = snapshot.val();
                if (sensorValues) {
                    const sortedSensorData = Object.entries(sensorValues)
                        .sort((a, b) => b[0].localeCompare(a[0]))
                        .slice(0, 10)
                        .map(([key, value]) => value);
                    setSensorData(sortedSensorData.reverse());
                }
            });
        };

        fetchSensorData();

        return () => {
            // Cleanup code if needed
        };
    }, [sensor]);

    // Function to determine color based on sensor type
    const getChartColor = () => {
        switch (sensor) {
            case 'temperature':
                return '#e26a00'; // Orange color for temperature
            case 'humidity':
                return '#1E88E5'; // Blue color for humidity
            case 'pressure':
                return '#FF5722'; // Deep orange color for pressure
            case 'co':
                return '#78909C'; // Gray color for CO
            default:
                return '#e26a00'; // Default to orange
        }
    };

    return (
        <View>
            <Text>{sensor}</Text>
            <LineChart
                data={{
                    labels: Array.from({ length: 10 }, (_, i) => `${i + 1}`),
                    datasets: [
                        {
                            data: sensorData,
                        },
                    ],
                }}
                width={Dimensions.get('window').width}
                height={220}
                yAxisLabel={sensor}
                yAxisInterval={1}
                chartConfig={{
                    backgroundColor: getChartColor(),
                    backgroundGradientFrom: getChartColor(),
                    backgroundGradientTo: getChartColor(),
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                    propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: '#ffa726',
                    },
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />
        </View>
    );
};


export default LineChartComp;
