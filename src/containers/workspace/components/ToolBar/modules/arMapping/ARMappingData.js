import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import ARMappingAction from './ARMappingAction'
import ToolbarModule from '../ToolbarModule'
import { LayerUtils } from '../../../../../../utils'

function getData() {
  const _params = ToolbarModule.getParams()
  const layerType = LayerUtils.getLayerType(GLOBAL.currentLayer)
  let disablePoint = true,
    disableArea = true,
    disbaleLine = true
  // 如果当前没有图层或类型不满足，不能绘制
  // 如果是CAD或者标注图层，则可以绘制点线面 by zcj
  if(["CADLAYER","TAGGINGLAYER"].indexOf(layerType) != -1){
    disablePoint = false
    disbaleLine = false
    disableArea = false
  }else if (layerType === "POINTLAYER"){
    disablePoint = false
  } else if(layerType === "REGIONLAYER"){
    disableArea = false
  }else if(layerType === "LINELAYER"){
    disbaleLine = false
  }

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
      image: disablePoint ? getThemeAssets().ar.functiontoolbar.ar_draw_point_disable
        : getThemeAssets().ar.functiontoolbar.ar_draw_point,
      disable: disablePoint,
    },
    {
      //AR画线
      key: 'arDrawLine',
      title: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_DRAW_LINE,
      action: ARMappingAction.arDrawLine,
      size: 'large',
      image: disbaleLine ? getThemeAssets().ar.functiontoolbar.ar_draw_line_disable
        : getThemeAssets().ar.functiontoolbar.ar_draw_line,
      disable: disbaleLine,
    },
    {
      //AR画面
      key: 'arDrawArea',
      title: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_DRAW_AREA,
      action: ARMappingAction.arDrawArea,
      size: 'large',
      image: disableArea ? getThemeAssets().ar.functiontoolbar.ar_draw_area_disable
        : getThemeAssets().ar.functiontoolbar.ar_draw_area,
      disable: disableArea,
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
