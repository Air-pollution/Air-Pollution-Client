import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ref, onValue } from '@firebase/database';
import { db } from '../utils/firebase';

const LineChartComp = () => {
    const [altitudeData, setAltitudeData] = useState([]);

    useEffect(() => {
        const fetchAltitudeData = () => {
            const altitudeRef = ref(db, 'Product/klMJ0/altitude'); // Thay "klMJ0" bằng productID thực tế
            onValue(altitudeRef, (snapshot) => {
                const altitudeValues = snapshot.val();
                if (altitudeValues) {
                    const sortedAltitude = Object.entries(altitudeValues)
                        .sort((a, b) => b[0].localeCompare(a[0])) // Sắp xếp theo timestamp theo thứ tự giảm dần
                        .slice(0, 10) // Lấy 10 mục mới nhất
                        .map(([key, value]) => value); // Trích xuất các giá trị độ cao
                    setAltitudeData(sortedAltitude.reverse()); // Đảo ngược để có thứ tự thời gian
                }
            });
        };

        fetchAltitudeData();

        // Hàm dọn dẹp
        return () => {
            // Gỡ bỏ các bộ nghe sự kiện hoặc thực hiện bất kỳ việc dọn dẹp nào ở đây nếu cần
        };
    }, []);

    return (
        <View>
            <Text>Bezier Line LineChart</Text>
            <LineChart
                data={{
                    labels: Array.from({ length: 10 }, (_, i) => `${i + 1}`), // Labels from 1 to 10
                    datasets: [
                        {
                            data: altitudeData,
                        },
                    ],
                }}
                width={Dimensions.get('window').width}
                height={220}
                yAxisLabel="Altitude"
                yAxisInterval={1}
                chartConfig={{
                    backgroundColor: '#e26a00',
                    backgroundGradientFrom: '#fb8c00',
                    backgroundGradientTo: '#ffa726',
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
