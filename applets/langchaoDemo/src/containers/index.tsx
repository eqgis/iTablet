import React from 'react'
import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack'
import ContactsList from './ContactsList'

const Stack = createNativeStackNavigator()

const _navigators = [
  <Stack.Screen key="ContactsList" name="ContactsList" component={ContactsList} options={{
    headerShown: false,
    animation: 'none',
    presentation: 'containedTransparentModal',
  }} />,
//   <Stack.Screen key="GuoTuLocation" name="GuoTuLocation" component={GuoTuLocation} options={{
//     headerShown: false,
//     animation: 'none',
//     presentation: 'containedTransparentModal',
//   }} />
]

export default _navigators