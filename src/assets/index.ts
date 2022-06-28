import { SMap, DatasetType, ThemeType, TThemeType, TARLayerType, ARLayerType } from 'imobile_for_reactnative'
import { ThemeType as AppThemeType } from '../constants'
import LightTheme from './lightTheme'
import publicTheme from './publicTheme'
import PublicTheme from './publicTheme'

const image = {
  ...LightTheme.analyst,
  ...LightTheme.ar.armap,
  ...LightTheme.ar.functiontoolbar,
  ...LightTheme.ar.toolbar,
  ...LightTheme.ar,
  ...LightTheme.attribute,
  ...LightTheme.collection,
  ...LightTheme.cowork,
  ...LightTheme.dataType,
  ...LightTheme.edit,
  ...LightTheme.find,
  ...LightTheme.friend,
  ...LightTheme.functionBar,
  ...LightTheme.home,
  ...LightTheme.layer,
  ...LightTheme.layer3dType,
  ...LightTheme.layerType,
  ...LightTheme.mapTools,
  ...LightTheme.mark,
  ...LightTheme.mine,
  ...LightTheme.module,
  ...LightTheme.nav,
  ...LightTheme.navigation,
  ...LightTheme.plot,
  ...LightTheme.publicAssets,
  ...LightTheme.search,
  ...LightTheme.setting,
  ...LightTheme.share,
  ...LightTheme.start,
  ...LightTheme.tabBar,
  ...LightTheme.themeType,
  ...LightTheme.toolbar,
  ...publicTheme.attribute,
  ...publicTheme.common,
  ...publicTheme.mapTools,
  ...publicTheme.plot,
  ...publicTheme.theme.aggregationColorScheme,
  ...publicTheme.theme.graphColorScheme,
}

function getImage(): typeof image {
  return image
}

function getThemeAssets(): typeof LightTheme {
  let asset
  switch (global.ThemeType) {
    case AppThemeType.DARK_THEME:
      asset = require('./darkTheme').default
      break
    case AppThemeType.LIGHT_THEME:
    default:
      asset = require('./lightTheme').default
      break
  }
  return asset
}

function getPublicAssets(): typeof PublicTheme {
  return require('./publicTheme').default
}

/** 获取专题类型Icon * */
function getThemeIconByType(type: TThemeType) {
  let icon
  switch (type) {
    case ThemeType.UNIQUE: // 单值专题图
      icon = getThemeAssets().themeType.theme_create_unique_style
      break
    case ThemeType.RANGE: // 分段专题图
      icon = getThemeAssets().themeType.theme_create_range_style
      break
    case ThemeType.LABEL: // 标签专题图
      icon = getThemeAssets().themeType.theme_create_unify_label
      break
    case ThemeType.LABELUNIQUE:
      icon = getThemeAssets().themeType.theme_create_unique_label
      break
    case ThemeType.LABELRANGE:
      icon = getThemeAssets().themeType.theme_create_range_label
      break
    case ThemeType.GRAPH: // 统计专题图
      icon = getThemeAssets().themeType.theme_graphmap
      break
    case ThemeType.DOTDENSITY: // 点密度专题图
      icon = getThemeAssets().themeType.theme_dot_density
      break
    case ThemeType.GRADUATEDSYMBOL: // 等级符号专题图
      icon = getThemeAssets().themeType.theme_graduated_symbol
      break
    case ThemeType.GRIDUNIQUE: // 栅格单值专题图
      icon = getThemeAssets().themeType.theme_grid_unique
      break
    case ThemeType.GRIDRANGE: // 栅格分段专题图
      icon = getThemeAssets().themeType.theme_grid_range
      break
    default:
      icon = getThemeAssets().layerType.icon_unknown
      break
  }
  return icon
}

function getThemeWhiteIconByType(type: TThemeType) {
  let icon
  switch (type) {
    case ThemeType.UNIQUE: // 单值专题图
      icon = getThemeAssets().themeType.theme_create_unique_style_selected
      break
    case ThemeType.RANGE: // 分段专题图
      icon = getThemeAssets().themeType.theme_create_range_style_selected
      break
    case ThemeType.LABEL: // 标签专题图
      icon = getThemeAssets().themeType.theme_create_unify_label_selected
      break
    case ThemeType.LABELUNIQUE:
      icon = getThemeAssets().themeType.theme_create_unique_label_selected
      break
    case ThemeType.LABELRANGE:
      icon = getThemeAssets().themeType.theme_create_range_label_selected
      break
    case ThemeType.GRAPH: // 统计专题图
      icon = getThemeAssets().themeType.theme_graphmap_selected
      break
    case ThemeType.DOTDENSITY: // 点密度专题图
      icon = getThemeAssets().themeType.theme_dot_density_selected
      break
    case ThemeType.GRADUATEDSYMBOL: // 等级符号专题图
      icon = getThemeAssets().themeType.theme_graduated_symbol_selected
      break
    case ThemeType.GRIDUNIQUE: // 栅格单值专题图
      icon = getThemeAssets().themeType.theme_grid_unique_selected
      break
    case ThemeType.GRIDRANGE: // 栅格分段专题图
      icon = getThemeAssets().themeType.theme_grid_range_selected
      break
    default:
      icon = getThemeAssets().layerType.icon_unknown
      break
  }
  return icon
}

/** 获取图层类型Icon * */
function getLayerIconByType(type: SMap.LayerInfo['type'] | string) {
  let icon
  switch (type) {
    case 'layerGroup':
      icon = getThemeAssets().layerType.layer_group
      break
    case DatasetType.POINT: // 点数据集
    case 'POINT':
      icon = getThemeAssets().layerType.layer_point
      break
    case DatasetType.PointZ: // 三维点数据集
    case 'POINT3D':
      icon = getThemeAssets().layer3dType.layer3d_point
      break
    case DatasetType.LINE: // 线数据集
    case 'LINE':
      icon = getThemeAssets().layerType.layer_line
      break
    case DatasetType.LineZ: // 三维线数据集
    case 'LINE3D':
      icon = getThemeAssets().layer3dType.layer3d_line
      break
    case DatasetType.REGION: // 多边形数据集
    case 'REGION':
      icon = getThemeAssets().layerType.layer_region
      break
    case DatasetType.RegionZ: // 三维多边形数据集
    case 'REGION3D':
      icon = getThemeAssets().layer3dType.layer3d_terrain_layer
      break
    case DatasetType.TEXT: // 文本数据集
    case 'TEXT':
      icon = getThemeAssets().layerType.layer_text
      break
    case DatasetType.MBImage: // 多波段影像
    case DatasetType.IMAGE: // 影像数据集
    case 'MBIMAGE':
    case 'IMAGE':
      icon = getThemeAssets().layerType.layer_image
      break
    case DatasetType.CAD: // 复合数据集
    case 'CAD':
      icon = getThemeAssets().layerType.layer_cad
      break
    case DatasetType.Network: // 复合数据集
    case DatasetType.NETWORK3D: // 三维复合数据集
    case 'NETWORK':
    case 'NETWORK3D':
      icon = getThemeAssets().layerType.layer_network
      break
    case DatasetType.GRID: // GRID数据集
    case 'GRID':
      icon = getThemeAssets().layerType.layer_grid
      break
    default:
      icon = getThemeAssets().layerType.icon_unknown
      break
  }
  return icon
}

function getLayerWhiteIconByType(type: SMap.LayerInfo['type'] | string) {
  let icon
  switch (type) {
    case 'layerGroup':
      icon = getThemeAssets().layerType.layer_group_selected
      break
    case DatasetType.POINT: // 点数据集
    case 'POINT':
      icon = getThemeAssets().layerType.layer_point_selected
      break
    case DatasetType.PointZ: // 三维点数据集
    case 'POINT3D':
      icon = getThemeAssets().layer3dType.layer3d_point_selected
      break
    case DatasetType.LINE: // 线数据集
    case 'LINE':
      icon = getThemeAssets().layerType.layer_line_selected
      break
    case DatasetType.LineZ: // 三维线数据集
    case 'LINE3D':
      icon = getThemeAssets().layer3dType.layer3d_line_selected
      break
    case DatasetType.REGION: // 多边形数据集
    case 'REGION':
      icon = getThemeAssets().layerType.layer_region_selected
      break
    case DatasetType.RegionZ: // 三维多边形数据集
    case 'REGION3D':
      icon = getThemeAssets().layer3dType.layer3d_terrain_layer_selected
      break
    case DatasetType.TEXT: // 文本数据集
    case 'TEXT':
      icon = getThemeAssets().layerType.layer_text_selected
      break
    case DatasetType.MBImage: // 多波段影像
    case DatasetType.IMAGE: // 影像数据集
    case 'IMAGE':
      icon = getThemeAssets().layerType.layer_image_selected
      break
    case DatasetType.CAD: // CAD数据集
    case 'CAD':
      // icon = require('./map/icon-cad.png')
      icon = getThemeAssets().layerType.layer_cad_selected
      break
    case DatasetType.Network: // 网络数据集
    case DatasetType.NETWORK3D: // 三维复合数据集
    case 'NETWORK':
    case 'NETWORK3D':
      icon = getThemeAssets().layerType.layer_network_selected
      break
    case DatasetType.GRID: // GRID数据集
    case 'GRID':
      icon = getThemeAssets().layerType.layer_grid_selected
      break
    default:
      icon = getThemeAssets().layerType.icon_unknown_selected
      break
  }
  return icon
}

/** 根据AR图层类型获取相应图片 */
function getARLayerAssets(type: TARLayerType): any {
  switch (type) {
    case ARLayerType.EFFECT_LAYER:
      return getThemeAssets().ar.armap.ar_effect
    case ARLayerType.AR_MEDIA_LAYER:
      return getThemeAssets().ar.armap.ar_poi
    case ARLayerType.AR3D_LAYER:
      return getThemeAssets().ar.armap.ar_3d
    case ARLayerType.AR_SCENE_LAYER:
      return getThemeAssets().ar.armap.ar_3d
    case ARLayerType.AR_MODEL_LAYER:
      return getThemeAssets().ar.armap.ar_model
    case ARLayerType.AR_TEXT_LAYER:
    case ARLayerType.AR_POINT_LAYER:
    case ARLayerType.AR_LINE_LAYER:
    case ARLayerType.AR_REGION_LAYER:
    case ARLayerType.AR_MARKER_LINE_LAYER:
      return getThemeAssets().ar.armap.ar_vector
    case ARLayerType.AR_WIDGET_LAYER:
      return getThemeAssets().ar.armap.ar_widget_layer
    default:
      return getThemeAssets().layerType.icon_unknown
  }
}

/** 根据AR图层类型获取相应的禁用图片 */
function getARLayerAssetsGray(type: TARLayerType): any {
  switch (type) {
    case ARLayerType.EFFECT_LAYER:
      return getThemeAssets().ar.armap.ar_effect_gray
    case ARLayerType.AR_MEDIA_LAYER:
      return getThemeAssets().ar.armap.ar_poi_gray
    case ARLayerType.AR3D_LAYER:
      return getThemeAssets().ar.armap.ar_3d_gray
    case ARLayerType.AR_SCENE_LAYER:
      return getThemeAssets().ar.armap.ar_3d_gray
    case ARLayerType.AR_MODEL_LAYER:
      return getThemeAssets().ar.armap.ar_model_gray
    case ARLayerType.AR_TEXT_LAYER:
    case ARLayerType.AR_POINT_LAYER:
    case ARLayerType.AR_LINE_LAYER:
    case ARLayerType.AR_REGION_LAYER:
      return getThemeAssets().ar.armap.ar_vector_gray
    default:
      return getThemeAssets().layerType.unknown_gray
  }
}

/** 根据AR场景类型获取对应图片 */
function getARSceneAssets(type: number) {
  switch(type) {
    case 1:
      return getThemeAssets().ar.functiontoolbar.ar_pipeline
    case 2:
      return getThemeAssets().ar.functiontoolbar.ar_terrain
    case 3:
      return getThemeAssets().ar.functiontoolbar.ar_3d_model
    default:
      return getThemeAssets().mine.my_scene
  }
}

export {
  getImage,
  getThemeAssets,
  getPublicAssets,
  getThemeIconByType,
  getThemeWhiteIconByType,
  getLayerIconByType,
  getLayerWhiteIconByType,
  getARLayerAssets,
  getARSceneAssets,
  getARLayerAssetsGray,
}
