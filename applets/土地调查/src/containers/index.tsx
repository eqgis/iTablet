import React from 'react'
import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack'
import GuoTuTasks from './guoTuTasks/GuoTuTasks'
import GuoTuLocation from './guoTuLocation/GuoTuLocation'

const Stack = createNativeStackNavigator()

const _navigators = [
  <Stack.Screen key="GuoTuTasks" name="GuoTuTasks" component={GuoTuTasks} options={{
    headerShown: false,
    animation: 'none',
    presentation: 'containedTransparentModal',
  }} />,
  <Stack.Screen key="GuoTuLocation" name="GuoTuLocation" component={GuoTuLocation} options={{
    headerShown: false,
    animation: 'none',
    presentation: 'containedTransparentModal',
  }} />
]

export default _navigators