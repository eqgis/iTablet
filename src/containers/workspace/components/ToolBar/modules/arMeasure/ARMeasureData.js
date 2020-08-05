import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import ARMeasureAction from './ARMeasureAction'
import { Platform } from 'react-native'

function getData() {
  let data = [
    {
      //AR天气
      key: 'arWeather',
      title: getLanguage(global.language).Map_Main_Menu.MAP_AR_WEATHER,
      action: ARMeasureAction.arWeather,
      size: 'large',
      image: getThemeAssets().plot.plot_animation_appear,
    },
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
    // {
    //   // 户型图采集
    //   key: 'arMeasureCollect',
    //   title: getLanguage(global.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT,
    //   action: ARMeasureAction.arMeasureCollect,
    //   size: 'large',
    //   image: getThemeAssets().ar.functiontoolbar.rightbar_ai_layout_light,
    // },
    {
      //AR投射
      key: 'arCastModelOperate',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_CAST_MODEL_OPERATE,
      action: ARMeasureAction.arCastModelOperate,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.ar_cast,
    },
    {
      //AR面积
      key: 'arMeasureArea',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_AREA,
      action: ARMeasureAction.arMeasureArea,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.ar_analyst_area,
    },
    {
      //AR测距
      key: 'arMeasureArea',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_LENGTH,
      action: ARMeasureAction.arMeasureLength,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.ar_analyst_length,
    },
    {
      //AR画线
      key: 'arDrawLine',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_DRAW_LINE,
      action: ARMeasureAction.arDrawLine,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.ar_draw_line,
    },
    {
      //AR画面
      key: 'arDrawArea',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_DRAW_AREA,
      action: ARMeasureAction.arDrawArea,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.ar_draw_area,
    },
    {
      //AR画点
      key: 'arDrawArea',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_DRAW_POINT,
      action: ARMeasureAction.arDrawPoint,
      size: 'large',
      image: getThemeAssets().ar.toolbar.point,
    },
    {
      //AR测高
      key: 'arMeasureHeitht',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_MEASURE_HEIGHT,
      action: ARMeasureAction.arMeasureHeight,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.ar_measure_height,
    },
    {
      //AR视频
      key: 'arVideo',
      title: getLanguage(global.language).Map_Main_Menu.MAP_AR_VIDEO,
      action: ARMeasureAction.arVideo,
      size: 'large',
      image: getThemeAssets().themeType.theme_graphmap,
    },
    {
      //AR图片
      key: 'arImage',
      title: getLanguage(global.language).Map_Main_Menu.MAP_AR_IMAGE,
      action: ARMeasureAction.arImage,
      size: 'large',
      image: getThemeAssets().layerType.layer_type_image,
    },
  ]

  data = data.filter(item => {
    if (Platform.OS === 'ios') {
      if (
        item.key === 'arCastModelOperate' ||
        item.key === 'arVideo' ||
        item.key === 'arImage' ||
        item.key === 'arWeather'
      ) {
        return false
      }
    }
    return true
  })

  return { data }
}

export default {
  getData,
}
