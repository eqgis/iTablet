import { getThemeAssets } from '../../../../../../assets'
import { getLanguage } from '../../../../../../language'
import AiActions from './AiActions'
import ToolbarModule from '../ToolbarModule'
import { Platform } from 'react-native'

function getData() {
  const _params = ToolbarModule.getParams()
  const buttons = []
  const data = [
    {
      // 目标分类
      key: 'aiClassify',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_CLASSIFY,
      action: AiActions.aiClassify,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.rightbar_ai_classify_light,
    },
    {
      // 目标采集
      key: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_TARGET_COLLECT,
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_TARGET_COLLECT,
      action: AiActions.aiDetect,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.rightbar_ai_collect_light,
    },
    {
      // 态势采集
      key: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_AGGREGATE_COLLECT,
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_AGGREGATE_COLLECT,
      action: AiActions.polymerizeCollect,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar
        .rightbar_ai_aggregate_collect_light,
    },
    {
      // 违章采集
      key: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_VIOLATION_COLLECT,
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_VIOLATION_COLLECT,
      action: AiActions.illegallyParkCollect,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.rightbar_ai_violation_light,
    },
    // {
    //   //路面采集
    //   key: getLanguage(global.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_ROAD_COLLECT,
    //   title: getLanguage(global.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_ROAD_COLLECT,
    //   // action:openMap,
    //   size: 'large',
    //   image: getThemeAssets().ar.icon_ar,
    // },
  ]
  if (Platform.OS === 'android') {
    console.warn(JSON.stringify(_params.laboratory))
    if (_params.laboratory.poseEstimation) {
      data.push({
        // 人体姿态
        key: getLanguage(global.language).Map_Main_Menu.MAP_AI_POSE_ESTIMATION,
        title: getLanguage(global.language).Map_Main_Menu.MAP_AI_POSE_ESTIMATION,
        action: AiActions.poseEstimation,
        size: 'large',
        image: getThemeAssets().ar.functiontoolbar.ar_bodyposture,
      })
    }
    if (_params.laboratory.gestureBone) {
      data.push({
        // 手势骨骼
        key: getLanguage(global.language).Map_Main_Menu.MAP_AI_GESTURE_BONE,
        title: getLanguage(global.language).Map_Main_Menu.MAP_AI_GESTURE_BONE,
        action: AiActions.gestureBone,
        size: 'large',
        // image: getThemeAssets().ar.functiontoolbar.ar_bodyposture,
        image: require('../../../../../../assets/mapTools/icon_select_by_rectangle.png'),
      })
    }
  }
  return { data, buttons }
}

export default {
  getData,
}
