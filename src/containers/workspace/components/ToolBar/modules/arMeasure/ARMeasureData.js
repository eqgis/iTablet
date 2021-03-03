import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import ARMeasureAction from './ARMeasureAction'
import { View, Animated, Text, FlatList } from 'react-native'
import React from 'react'

function getData() {
  let data = [
    {
      //AR测距
      key: 'arMeasureArea',
      title: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_LENGTH,
      action: ARMeasureAction.arMeasureLength,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.ar_analyst_length,
    },
    {
      //AR测高
      key: 'arMeasureHeitht',
      title: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_MEASURE_HEIGHT,
      action: ARMeasureAction.arMeasureHeight,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.icon_ar_altimetry_select,
    },
    {
      //AR面积
      key: 'arMeasureArea',
      title: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_AREA,
      action: ARMeasureAction.arMeasureArea,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.ar_analyst_area,
    },
    {
      //AR测量角度
      key: 'arMeasureAngle',
      title: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_ANGLE,
      action: ARMeasureAction.arMeasureAngle,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.ar_analyst_angle,
    },
  ]

  return { data }
}

function getMeasureAreaData() {
  let data = [
    {
      //AR测距
      key: 'arMeasureArea',
      title: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_LENGTH,
      action: ARMeasureAction.arMeasureLength,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.icon_ar_distance_unselect,
    },
    {
      //AR测高
      key: 'arMeasureHeitht',
      title: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_MEASURE_HEIGHT,
      action: ARMeasureAction.arMeasureHeight,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.icon_ar_altimetry_unselect,
    },
    {
      //AR面积
      key: 'arMeasureArea',
      title: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_AREA,
      action: ARMeasureAction.arMeasureArea,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.ar_analyst_area,
    },
    {
      //AR测量角度
      key: 'arMeasureAngle',
      title: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_ANGLE,
      action: ARMeasureAction.arMeasureAngle,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.icon_ar_angle,
    },
  ]

  let measureAreadata = [
    {
      //AR面积 多边形
      key: 'polygon',
      title: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_AREA_POLYGON,
      action: ARMeasureAction.arMeasurePolygon,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.icon_ar_polygon,
    },
    {
      //AR面积 矩形
      key: 'rectangle',
      title: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_AREA_RECTANGLE,
      action: ARMeasureAction.arMeasureRectanglet,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.icon_ar_rectangle,
    },
    {
      //AR面积 圆
      key: 'circular',
      title: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_AREA_CIRCULAR,
      action: ARMeasureAction.arMeasureCircular,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.icon_ar_circular,
    },
  ]

  return {data,measureAreadata}
}

export default {
  getData,
  getMeasureAreaData,
}
