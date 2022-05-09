import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { NAVIGATION_CAREMA } from "./NavigationParams"

/****************************** navigator 页面参数 ********************************/
export type MainStackParamList = {
  Camera: NAVIGATION_CAREMA,
}

export type HomeTabParamList = {

}

/****************************** navigation props **********************************/

export type MainStackScreenNavigationProps<RouteName extends keyof MainStackParamList> = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, RouteName>,
  BottomTabNavigationProp<HomeTabParamList>
>

/****************************** 所有页面 route prop type *****************************************/

export type MainStackScreenRouteProp<RouteName extends keyof MainStackParamList> = RouteProp<MainStackParamList, RouteName>

export type HomeTabScreenRouteProp<RouteName extends keyof HomeTabParamList> = RouteProp<HomeTabParamList, RouteName>
