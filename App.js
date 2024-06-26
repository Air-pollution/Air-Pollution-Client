import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();


// Import Stack screens
import Main from './screens/Main';
import Login from './screens/Login';
import Register from './screens/Register';
import LineChartComp from './components/LineChartComp';
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Dashboard"
          component={Main}
        />
        <Stack.Screen
          name="Login"
          component={Login}
        />
        <Stack.Screen
          name="Register"
          component={Register}
        />
      </Stack.Navigator>
    </NavigationContainer>

    // <View>
    //   <LineChartComp />
    // </View>
  )
}