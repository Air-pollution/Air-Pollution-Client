import React from 'react';
import { View } from 'react-native';
import { LineChart } from 'recharts';
// import { Line } from 'react-native-svg';
import { XAxis, Tooltip, CartesianGrid } from 'recharts';
import {Line} from 'recharts';
const LineChartRechart = () => {
    const data = [
        { name: 'Jan', uv: 4000, pv: 2400 },
        { name: 'Feb', uv: 3000, pv: 1398 },
        { name: 'Mar', uv: 2000, pv: 9800 },
        { name: 'Apr', uv: 2780, pv: 3908 },
        { name: 'May', uv: 1890, pv: 4800 },
        { name: 'Jun', uv: 2390, pv: 3800 },
        { name: 'Jul', uv: 3490, pv: 4300 },
    ];

    return (
        <View>
            <LineChart width={400} height={400} data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <XAxis dataKey="name" xAxisId={0} />
                <Tooltip />
                <CartesianGrid stroke="#f5f5f5" />
                <Line type="monotone" dataKey="uv" stroke="#ff7300" yAxisId={0} xAxisId={0} />
                <Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={1} xAxisId={0} />
            </LineChart>
        </View>
    );
};

export default LineChartRechart;
