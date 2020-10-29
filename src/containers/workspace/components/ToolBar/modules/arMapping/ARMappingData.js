import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import ARMappingAction from './ARMappingAction'
import ToolbarModule from '../ToolbarModule'

function getData() {
  const _params = ToolbarModule.getParams()
  let data = [
    // {
    //   // 户型图采集
    //   key: 'arMeasureCollect',
    //   title: getLanguage(GLOBAL.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT,
    //   action: ARMappingAction.arMeasureCollect,
    //   size: 'large',
    //   image: getThemeAssets().ar.functiontoolbar.rightbar_ai_layout_light,
    // },
    {
      //AR画点
      key: 'arDrawArea',
      title: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_DRAW_POINT,
      action: ARMappingAction.arDrawPoint,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.ar_draw_point,
    },
    {
      //AR画线
      key: 'arDrawLine',
      title: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_DRAW_LINE,
      action: ARMappingAction.arDrawLine,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.ar_draw_line,
    },
    {
      //AR画面
      key: 'arDrawArea',
      title: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_DRAW_AREA,
      action: ARMappingAction.arDrawArea,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.ar_draw_area,
    },
  ]
  
  if (_params.laboratory.highPrecisionCollect) {
    data.unshift({
      // 高精度采集
      key: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT,
      title: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT,
      action: ARMappingAction.collectSceneForm,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.rightbar_ai_poi_light,
    })
  }

  return { data }
}

export default {
  getData,
}
