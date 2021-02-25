import { SMap, DatasetType, ThemeType, TThemeType } from 'imobile_for_reactnative'
import { ThemeType as AppThemeType } from '../constants'
import LightTheme from './lightTheme'
import PublicTheme from './publicTheme'

function getThemeAssets(): typeof LightTheme {
  let asset
  switch (GLOBAL.ThemeType) {
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

export {
  getThemeAssets,
  getPublicAssets,
  getThemeIconByType,
  getThemeWhiteIconByType,
  getLayerIconByType,
  getLayerWhiteIconByType,
}
