import React from 'react'
import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack'
import ContactsList from './ContactsList'
import InputServer from './InputServer'
import HistoricalRecord from './HistoricalRecord'
import SettingPage from './SettingPage/SettingPage'

const Stack = createNativeStackNavigator()

const _navigators = [
  <Stack.Screen key="ContactsList" name="ContactsList" component={ContactsList} options={{
    headerShown: false,
    animation: 'none',
    presentation: 'containedTransparentModal',
  }} />,
  <Stack.Screen key="InputServer" name="InputServer" component={InputServer} options={{
    headerShown: false,
    animation: 'none',
    presentation: 'containedTransparentModal',
  }} />,
  <Stack.Screen key="HistoricalRecord" name="HistoricalRecord" component={HistoricalRecord} options={{
    headerShown: false,
    animation: 'none',
    presentation: 'containedTransparentModal',
  }} />,
  <Stack.Screen key="SettingPage" name="SettingPage" component={SettingPage} options={{
    headerShown: false,
    animation: 'none',
    presentation: 'containedTransparentModal',
  }} />,
]

export default _navigators