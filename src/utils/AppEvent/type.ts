import { NetInfoState } from "@react-native-community/netinfo"
import { ARElement } from "imobile_for_reactnative/NativeModule/interfaces/ar/SARMap"
import { GGA } from "imobile_for_reactnative/NativeModule/interfaces/SLocation"



/**
 * 事件及其对应参数
 */
export interface Event {
  //ar地图添加事件
  'ar_map_add_start': undefined
  //ar地图添加结束事件
  'ar_map_add_end': undefined
  //ar地图清除动画列表等事件
  'ar_map_add_undo': undefined
  //ar地图添加按钮事件
  'ar_on_tap_add_buttun': undefined
  //AR对象添加到场景回调事件
  'ar_map_on_add_element': ARElement

  'ar_sandtable_add': undefined
  'ar_sandtable_add_end': undefined
  'ar_sandtable_on_add': undefined

  'ar_animation_save': undefined
  'ar_animation_play': undefined
  'ar_animation_exit': undefined

  'ar_tracking_image_result': {success: boolean}

  'on_exit_ar_map_module': undefined

  'network_change': NetInfoState
  /** android权限申请后，初始化用户数据 */
  "androidPremissionRequstCallback": undefined
  /** 准星采集打点事件 */
  "collector_aim_point_add": number
  /** 打点的准星是否显示  */
  "collector_aim_point_show": boolean
  /** 蓝牙定位的定位信息 */
  "positionGGAInfo": GGA | null
}