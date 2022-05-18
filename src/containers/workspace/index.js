/**
 * Tabs
 * 注：MapView相关的Tabs在Routes中始终保持一个
 */

import React from 'react'
import { Platform, View } from 'react-native'
import { MapView, Map3D } from './pages'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { color } from '../../styles'
import LayerManager from '../mtLayerManager'
import Layer3DManager from '../Layer3DManager'
import Setting from '../setting'
import MapSetting from '../mapSetting'
import { Chat } from '../tabs'
import { LayerAttribute } from '../layerAttribute'
import TabNavigationService from '../TabNavigationService'
import ARLayerManager from '../arLayerManager'
import ARMapSetting from '../arMapSettings/ARMapSetting'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function compose(Component) {
  class Tab extends Component {
    render() {
      return (
        <Component
          ref={navigatorRef => {
            TabNavigationService.setTopLevelNavigator(navigatorRef)
          }}
          {...this.props}
          // onNavigationStateChange={(prevState, currentState) => {
          //   console.log(JSON.stringify(currentState))
          // }}
        />
      )
    }
  }
  return Tab
}

const options = {
  animationEnabled: false, // 切换页面时是否有动画效果
  tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
  swipeEnabled: false, // 是否可以左右滑动切换tab
  backBehavior: 'initialRoute', // 按 back 键是否跳转到第一个Tab， none 为不跳转
  lazy: true,
  tabBarOptions: {
    showLabel: false,
    showIcon: false,
    indicatorStyle: {
      height: 0, // 如TabBar下面显示有一条线，可以设高度为0后隐藏
    },
    style: {
      backgroundColor: color.theme, // TabBar 背景色
      height: 0,
    },
    safeAreaInset: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  },
}

const stackOption = {
  mode: 'modal',
  headerMode: 'none',
  transparentCard: true,
  cardStyle: {
    backgroundColor: 'transparent',
    opacity: 1,
  },
  transitionConfig: () => ({
    screenInterpolator: sceneProps => {
      return forHorizontal(sceneProps)
    },
  }),
}

const forHorizontal = sceneProps => {
  const { layout, position, scene } = sceneProps
  const { index } = scene

  const width = layout.initWidth
  const translateX = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [width, 0, 0],
  })

  const opacity = position.interpolate({
    inputRange: [index - 1, index - 0.99, index],
    outputRange: [0, 1, 1],
  })
  return { opacity, transform: [{ translateX: translateX }] }
}

// const MapStack = compose(
//   createNativeStackNavigator(
//     {
//       MapView: {
//         screen: MapView,
//       },
//       LayerManager: {
//         screen: LayerManager,
//       },
//       LayerAttribute: {
//         screen: LayerAttribute,
//       },
//       MapSetting: {
//         screen: MapSetting,
//       },
//       ARLayerManager: {
//         screen: ARLayerManager,
//       },
//       ARMapSetting: {
//         screen: ARMapSetting,
//       },
//     },
//     stackOption,
//   ),
// )

// const ARMapStack = compose(
//   createNativeStackNavigator(
//     {
//       ARMapView: {
//         screen: MapView,
//       },
//       ARLayerManager: {
//         screen: ARLayerManager,
//       },
//       // LayerAttribute: {
//       //   screen: LayerAttribute,
//       // },
//       ARMapSetting: {
//         screen: ARMapSetting,
//       },
//     },
//     stackOption,
//   ),
// )

// const CoworkTabs = createBottomTabNavigator(
//   {
//     // onechat
//     Chat: {
//       screen: Chat,
//     },
//     CoworkMapStack: {
//       screen: MapStack,
//     },
//   },
//   options,
// )

// const analystTabsOptions = Object.assign({}, options, {
//   initialRouteIndex: 1,
//   lazy: false,
//   backBehavior: 'none',
// })
// const MapAnalystTabs = compose(
//   createBottomTabNavigator(
//     {
//       MapAnalystView: {
//         screen: MapView,
//       },
//       AnalystTools: {
//         screen: AnalystTools,
//       },
//       LayerAnalystManager: {
//         screen: LayerManager,
//       },
//     },
//     analystTabsOptions,
//   ),
// )

// const Map3DStack = createNativeStackNavigator(
//   {
//     Map3D: {
//       screen: Map3D,
//     },
//     Layer3DManager: {
//       screen: Layer3DManager,
//     },
//     LayerAttribute3D: {
//       screen: LayerAttribute,
//     },
//     Map3DSetting: {
//       screen: Setting,
//     },
//   },
//   stackOption,
// )

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

function ARMapStack() {
  return (
    <Stack.Navigator
      initialRouteName='MapView'
      screenOptions={{
        // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerShown: false,
        animation: 'none',
      }}
    >
      <Stack.Screen name="MapView" component={MapView} />
      <Stack.Screen name="ARLayerManager" component={ARLayerManager} />
      <Stack.Screen name="LayerAttribute" component={LayerAttribute} />
      <Stack.Screen name="ARMapSetting" component={ARMapSetting} />
    </Stack.Navigator>
  )
}

function CoworkTabs() {
  return (
    <Tab.Navigator
      initialRouteName='Chat'
      screenOptions={{
        // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerShown: false,
        animation: 'none',
      }}
      tabBar={() => <View style={{height: 0, width: '100%'}} />}
    >
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="CoworkMapStack" component={MapStack} />
    </Tab.Navigator>
  )
}

function Map3DStack() {
  return (
    <Stack.Navigator
      initialRouteName='Map3D'
      screenOptions={{
        // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerShown: false,
        animation: 'none',
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

export { CoworkTabs, MapView, MapStack, Map3DStack, ARMapStack }
