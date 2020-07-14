import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import ARMeasureAction from './ARMeasureAction'

function getData() {
  let data = [
    {
      // 高精度采集
      key: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT,
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT,
      action: ARMeasureAction.collectSceneForm,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.rightbar_ai_poi_light,
    },
    {
      // 户型图采集
      key: 'arMeasureCollect',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT,
      action: ARMeasureAction.arMeasureCollect,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.rightbar_ai_layout_light,
    },
    {
      //AR投射
      key: 'arCastModelOperate',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_CAST_MODEL_OPERATE,
      action: ARMeasureAction.arCastModelOperate,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.ar_cast,
    },
  ]

  return { data }
}

export default {
  getData,
}
