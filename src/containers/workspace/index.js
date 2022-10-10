/**
 * Tabs
 * 注：MapView相关的Tabs在Routes中始终保持一个
 */

import React from 'react'
import { View } from 'react-native'
import { MapView, Map3D } from './pages'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { Chat } from '../tabs'
import { LayerAttribute } from '../layerAttribute'

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
      <Tab.Screen name="MapView" component={MapView} options={{freezeOnBlur: true}} />
      {/* <Tab.Screen name="LayerAttribute" component={LayerAttribute} /> */}
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
      {/* <Tab.Screen name="LayerAttribute3D" component={LayerAttribute} /> */}
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
