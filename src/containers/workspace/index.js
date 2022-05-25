/**
 * Tabs
 * 注：MapView相关的Tabs在Routes中始终保持一个
 */

import React from 'react'
import { Platform, View } from 'react-native'
import { MapView, Map3D } from './pages'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import LayerManager from '../mtLayerManager'
import Layer3DManager from '../Layer3DManager'
import Setting from '../setting'
import MapSetting from '../mapSetting'
import { Chat } from '../tabs'
import { LayerAttribute } from '../layerAttribute'
import ARLayerManager from '../arLayerManager'
import ARMapSetting from '../arMapSettings/ARMapSetting'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function MapStack(device) {
  return (
    <Stack.Navigator
      initialRouteName='MapView'
      screenOptions={{
        headerShown: false,
        animation: device.orientation.indexOf('PORTRAIT') >= 0 ? 'none' : (Platform.OS === 'ios' ? 'default' : 'slide_from_right'),
        presentation: Platform.OS === 'ios' ? 'card' : 'transparentModal',
      }}
    >
      <Stack.Screen name="MapView" component={MapView} />
      <Stack.Screen name="LayerManager" component={LayerManager} />
      <Stack.Screen name="LayerAttribute" component={LayerAttribute} />
      <Stack.Screen name="MapSetting" component={MapSetting} />
      <Stack.Screen name="ARLayerManager" component={ARLayerManager} />
      <Stack.Screen name="ARMapSetting" component={ARMapSetting} />
    </Stack.Navigator>
  )
}

// function ARMapStack(device) {
//   return (
//     <Stack.Navigator
//       initialRouteName='MapView'
//       screenOptions={{
//         headerShown: false,
//         animation: device.orientation.indexOf('PORTRAIT') >= 0 ? 'none' : (Platform.OS === 'ios' ? 'default' : 'slide_from_right'),
//         presentation: Platform.OS === 'ios' ? 'card' : 'transparentModal',
//       }}
//     >
//       <Stack.Screen name="MapView" component={MapView} />
//       <Stack.Screen name="ARLayerManager" component={ARLayerManager} />
//       <Stack.Screen name="LayerAttribute" component={LayerAttribute} />
//       <Stack.Screen name="ARMapSetting" component={ARMapSetting} />
//     </Stack.Navigator>
//   )
// }

function CoworkTabs(device) {
  return (
    <Tab.Navigator
      initialRouteName='Chat'
      screenOptions={{
        headerShown: false,
        animation: 'none',
        presentation: Platform.OS === 'ios' ? 'card' : 'transparentModal',
      }}
      tabBar={() => <View style={{height: 0, width: '100%'}} />}
    >
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="CoworkMapStack" component={MapStack} />
    </Tab.Navigator>
  )
}

function Map3DStack(device) {
  return (
    <Stack.Navigator
      initialRouteName='Map3D'
      screenOptions={{
        headerShown: false,
        animation: device.orientation.indexOf('PORTRAIT') >= 0 ? 'none' : (Platform.OS === 'ios' ? 'default' : 'slide_from_right'),
        presentation: Platform.OS === 'ios' ? 'card' : 'transparentModal',
      }}
      tabBar={() => <View style={{height: 0, width: '100%'}} />}
    >
      <Stack.Screen name="Map3D" component={Map3D} />
      <Stack.Screen name="Layer3DManager" component={Layer3DManager} />
      <Stack.Screen name="LayerAttribute3D" component={LayerAttribute} />
      <Stack.Screen name="Map3DSetting" component={Setting} />
    </Stack.Navigator>
  )
}

export {
  CoworkTabs,
  MapView,
  MapStack,
  Map3DStack,
  // ARMapStack,
}
