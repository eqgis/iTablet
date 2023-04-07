import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { NAVIGATION_CAREMA, GroupSourceManagePageParams, CoworkManagePageParams, AlbumViewParams } from "./NavigationParams"

/****************************** navigator 页面参数 ********************************/
export type MainStackParamList = {
  Map3DStack: undefined

  Camera: NAVIGATION_CAREMA,
  GroupSourceManagePage: GroupSourceManagePageParams,
  CoworkManagePage: CoworkManagePageParams,
  AlbumView: AlbumViewParams,
  LocationInformation:undefined,
}

export type HomeTabParamList = {

}

export type Map3DStackParamList = {
  Map3D: undefined | {
    type: 'MAP_3D',
    mapName?: string,
  }
}

/****************************** navigation props **********************************/

export type MainStackScreenNavigationProps<RouteName extends keyof MainStackParamList> = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, RouteName>,
  BottomTabNavigationProp<HomeTabParamList>
>

/** Map3DTab 内所有页面通用 navigation prop  */
export type Map3DTabScreenNavigationProp<RouteName extends keyof Map3DStackParamList> = CompositeNavigationProp<
  BottomTabNavigationProp<Map3DStackParamList, RouteName>,
  NativeStackNavigationProp<MainStackParamList>
>

/****************************** 所有页面 route prop type *****************************************/

export type MainStackScreenRouteProp<RouteName extends keyof MainStackParamList> = RouteProp<MainStackParamList, RouteName>

export type HomeTabScreenRouteProp<RouteName extends keyof HomeTabParamList> = RouteProp<HomeTabParamList, RouteName>

export type Map3DTabScreenRouteProp<RouteName extends keyof Map3DStackParamList> = RouteProp<Map3DStackParamList, RouteName>
