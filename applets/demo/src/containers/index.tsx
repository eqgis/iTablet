import React from 'react'
import { Platform } from 'react-native'
import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack'
import Home from './Home'

const Stack = createNativeStackNavigator()

export default function() {
  return (
    <Stack.Navigator
      initialRouteName='Home'
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        presentation: 'card',
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  )
}
