import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

interface GuoTuTaskParams {
  /** 标题 */
  title?: string,
  /** 获取数据的关键词 */
  keywords?: string,
  /** 是否有下载按钮 */
  hasDownload?: boolean,
}

/****************************** navigator 页面参数 ********************************/
export type GuotuParamList = {
  GuoTuTasks: GuoTuTaskParams,
}

export type HomeTabParamList = {

}

/****************************** navigation props **********************************/

export type GuotuStackScreenNavigationProps<RouteName extends keyof GuotuParamList> = CompositeNavigationProp<
  NativeStackNavigationProp<GuotuParamList, RouteName>,
  BottomTabNavigationProp<HomeTabParamList>
>

/****************************** 所有页面 route prop type *****************************************/

export type GuotuStackScreenRouteProp<RouteName extends keyof GuotuParamList> = RouteProp<GuotuParamList, RouteName>

export type HomeTabScreenRouteProp<RouteName extends keyof HomeTabParamList> = RouteProp<HomeTabParamList, RouteName>
