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
      image: getThemeAssets().ar.functiontoolbar.icon_ar_altimetry_select,
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
      //AR测量角度
      key: 'arMeasureAngle',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_ANGLE,
      action: ARMeasureAction.arMeasureAngle,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.ar_analyst_angle,
    },
    {
      //体积测量
      key: 'arMeasureAngle',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_VOLUME,
      action: ARMeasureAction.arMeasureVolume,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.icon_ar_volume_select,
    },
  ]

  return { data }
}

function getMeasureAreaData() {
  let data = [
    {
      //AR测距
      key: 'arMeasureArea',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_LENGTH,
      action: ARMeasureAction.arMeasureLength,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.icon_ar_distance_unselect,
    },
    {
      //AR测高
      key: 'arMeasureHeitht',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_MEASURE_HEIGHT,
      action: ARMeasureAction.arMeasureHeight,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.icon_ar_altimetry_unselect,
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
      //AR测量角度
      key: 'arMeasureAngle',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_ANGLE,
      action: ARMeasureAction.arMeasureAngle,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.icon_ar_angle,
    },
    {
      //体积测量
      key: 'arMeasureVolume',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_VOLUME,
      action: ARMeasureAction.arMeasureVolume,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.icon_ar_volume,
    },
  ]

  let data1 = [
    {
      //AR测距
      key: 'arMeasureArea',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_LENGTH,
      action: ARMeasureAction.arMeasureLength,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.icon_ar_distance_unselect,
    },
    {
      //AR测高
      key: 'arMeasureHeitht',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_MEASURE_HEIGHT,
      action: ARMeasureAction.arMeasureHeight,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.icon_ar_altimetry_unselect,
    },
    {
      //AR面积
      key: 'arMeasureArea',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_AREA,
      action: ARMeasureAction.arMeasureArea,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.icon_ar_area_unselect,
    },
    {
      //AR测量角度
      key: 'arMeasureAngle',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_ANGLE,
      action: ARMeasureAction.arMeasureAngle,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.icon_ar_angle,
    },
    {
      //体积测量
      key: 'arMeasureVolume',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_VOLUME,
      action: ARMeasureAction.arMeasureVolume,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.icon_ar_volume_select,
    },
  ]

  let measureAreadata = [
    {
      //AR面积 多边形
      key: 'polygon',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_AREA_POLYGON,
      action: ARMeasureAction.arMeasurePolygon,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.icon_ar_polygon,
    },
    {
      //AR面积 矩形
      key: 'rectangle',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_AREA_RECTANGLE,
      action: ARMeasureAction.arMeasureRectanglet,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.icon_ar_rectangle,
    },
    {
      //AR面积 圆
      key: 'circular',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_AREA_CIRCULAR,
      action: ARMeasureAction.arMeasureCircular,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.icon_ar_circular,
    },
  ]

  let measureAreadata1 = [
    {
      //AR体积 长方体
      key: 'cuboid',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_AREA_CUBOID,
      action: ARMeasureAction.arMeasureCuboid,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.icon_ar_cuboid,
    },
    {
      //AR体积 圆柱体
      key: 'cylinder',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_AREA_CYLINDER,
      action: ARMeasureAction.arMeasureCylinder,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.icon_ar_cylinder,
    },
  ]

  return {data,data1,measureAreadata,measureAreadata1}
}

export default {
  getData,
  getMeasureAreaData,
}
