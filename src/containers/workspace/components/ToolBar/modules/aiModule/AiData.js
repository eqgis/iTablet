import { getThemeAssets } from '../../../../../../assets'
import { getLanguage } from '../../../../../../language'
import { ConstToolType } from '../../../../../../constants'
import AiActions from './AiActions'
import ToolbarModule from '../ToolbarModule'
import { Platform } from 'react-native'

function getData(type) {
  const _params = ToolbarModule.getParams()
  const buttons = []
  let data = []
  // if (type === ConstToolType.SM_MAP_AR_ANALYSIS)
  switch (type) {
    case ConstToolType.SM_MAP_AR_ANALYSIS:
      data = [
        {
          // 目标采集
          key: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_TARGET_COLLECT,
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_TARGET_COLLECT,
          action: AiActions.aiDetect,
          size: 'large',
          image: getThemeAssets().ar.functiontoolbar.rightbar_ai_collect_light,
        },
        {
          // 目标分类
          key: 'aiClassify',
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_CLASSIFY,
          action: AiActions.aiClassify,
          size: 'large',
          image: getThemeAssets().ar.functiontoolbar.rightbar_ai_classify_light,
        },
        {
          // 态势采集
          key: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_AGGREGATE_COLLECT,
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_AGGREGATE_COLLECT,
          action: AiActions.polymerizeCollect,
          size: 'large',
          image: getThemeAssets().ar.functiontoolbar
            .rightbar_ai_aggregate_collect_light,
        },
        {
          // 违章采集
          key: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_VIOLATION_COLLECT,
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_VIOLATION_COLLECT,
          action: AiActions.illegallyParkCollect,
          size: 'large',
          image: getThemeAssets().ar.functiontoolbar.rightbar_ai_violation_light,
        },
        // {
        //   //路面采集
        //   key: getLanguage(GLOBAL.language).Map_Main_Menu
        //     .MAP_AR_AI_ASSISTANT_ROAD_COLLECT,
        //   title: getLanguage(GLOBAL.language).Map_Main_Menu
        //     .MAP_AR_AI_ASSISTANT_ROAD_COLLECT,
        //   // action:openMap,
        //   size: 'large',
        //   image: getThemeAssets().ar.icon_ar,
        // },
      ]
      if (Platform.OS === 'android') {
        if (_params.laboratory.poseEstimation) {
          data.push({
            // 人体姿态
            key: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AI_POSE_ESTIMATION,
            title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AI_POSE_ESTIMATION,
            action: AiActions.poseEstimation,
            size: 'large',
            image: getThemeAssets().ar.functiontoolbar.ar_bodyposture,
          })
        }
        if (_params.laboratory.gestureBone) {
          data.push({
            // 手势骨骼
            key: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AI_GESTURE_BONE,
            title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AI_GESTURE_BONE,
            action: AiActions.gestureBone,
            size: 'large',
            image: getThemeAssets().ar.functiontoolbar.icon_ar_gesture,
          })
        }
      }
  }
  return { data, buttons }
}

export default {
  getData,
}
