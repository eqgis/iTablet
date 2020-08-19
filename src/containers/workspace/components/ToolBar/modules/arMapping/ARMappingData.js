import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import ARMappingAction from './ARMappingAction'

function getData() {
  let data = [
    {
      // 高精度采集
      key: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT,
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT,
      action: ARMappingAction.collectSceneForm,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.rightbar_ai_poi_light,
    },
    // {
    //   // 户型图采集
    //   key: 'arMeasureCollect',
    //   title: getLanguage(global.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT,
    //   action: ARMappingAction.arMeasureCollect,
    //   size: 'large',
    //   image: getThemeAssets().ar.functiontoolbar.rightbar_ai_layout_light,
    // },
    {
      //AR画点
      key: 'arDrawArea',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_DRAW_POINT,
      action: ARMappingAction.arDrawPoint,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.ar_draw_point,
    },
    {
      //AR画线
      key: 'arDrawLine',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_DRAW_LINE,
      action: ARMappingAction.arDrawLine,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.ar_draw_line,
    },
    {
      //AR画面
      key: 'arDrawArea',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_DRAW_AREA,
      action: ARMappingAction.arDrawArea,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.ar_draw_area,
    },
  ]

  return { data }
}

export default {
  getData,
}
