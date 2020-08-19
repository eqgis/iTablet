import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import ARMeasureAction from './ARMeasureAction'

function getData() {
  let data = [
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
      //AR测高
      key: 'arMeasureHeitht',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_MEASURE_HEIGHT,
      action: ARMeasureAction.arMeasureHeight,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.ar_measure_height,
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
  ]

  return { data }
}

export default {
  getData,
}
