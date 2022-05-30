/**
 * Tabs
 * 注：MapView相关的Tabs在Routes中始终保持一个
 */

import React from 'react'
import { View } from 'react-native'
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
    <Tab.Navigator
      initialRouteName='Chat'
      screenOptions={{
        headerShown: false,
      }}
      tabBar={() => <View style={{height: 0, width: '100%'}} />}
    >
      <Tab.Screen name="MapView" component={MapView} />
      <Tab.Screen name="LayerAttribute" component={LayerAttribute} />
    </Tab.Navigator>
  )
}

function CoworkTabs(device) {
  return (
    <Tab.Navigator
      initialRouteName='Chat'
      screenOptions={{
        headerShown: false,
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
    <Tab.Navigator
      initialRouteName='Map3D'
      screenOptions={{
        headerShown: false,
      }}
      tabBar={() => <View style={{height: 0, width: '100%'}} />}
    >
      <Tab.Screen name="Map3D" component={Map3D} />
      <Tab.Screen name="LayerAttribute3D" component={LayerAttribute} />
    </Tab.Navigator>
  )
}

export {
  CoworkTabs,
  MapView,
  MapStack,
  Map3DStack,
  // ARMapStack,
}
