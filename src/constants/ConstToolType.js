/**
 * 地图功能列表/工具栏 对应的标识符
 */
import { scaleSize } from '../utils'

const TOOLBAR_HEIGHT_1 = 88
const TOOLBAR_HEIGHT_2 = 80

// 图例
const LEGEND_CONST = {
  LEGEND: 'LEGEND', // 图例
  LEGEND_NOT_VISIBLE: 'LEGEND_NOT_VISIBLE', // 图例不可见
  LEGEND_POSITION: 'LEGEND_POSITION', // 图例位置
}

// 导航模块
const NAVIGATION_CONST = {
  MAP_TOOL_INCREMENT: 'MAP_TOOL_INCREMENT', // 增量路网
  MAP_TOOL_GPSINCREMENT: 'MAP_TOOL_GPSINCREMENT', // GPS增量路网
  MAP_NAVIGATION_MODULE: 'MAP_NAVIGATION_MODULE', // 导航
}

// 三维裁剪
const MAP3D_CLIP_CONST = {
  MAP3D_BOX_CLIP: 'MAP3D_BOX_CLIP', // 三维BOX裁剪
  MAP3D_PLANE_CLIP: 'MAP3D_PLANE_CLIP', // 三维PLANE裁剪
  MAP3D_CROSS_CLIP: 'MAP3D_CROSS_CLIP', // 三维CROSS裁剪
  MAP3D_CLIP_SHOW: 'MAP3D_CLIP_SHOW', // 三维裁剪菜单展开状态
  MAP3D_CLIP_HIDDEN: 'MAP3D_CLIP_HIDDEN', // 三维裁剪菜单隐藏状态
  MAP3D_BOX_CLIPPING: 'MAP3D_BOX_CLIPPING', // 三维BOX裁剪 裁剪中状态
  MAP3D_BOX_CLIP_IN: 'MAP3D_BOX_CLIP_IN', // 裁剪区域内
  MAP3D_BOX_CLIP_OUT: 'MAP3D_BOX_CLIP_OUT', // 裁剪区域外
}

// 地图设置
const MAP_SETTINGS = {
  // Map Setting
  MAP_COLOR_MODE: 'MAP_COLOR_MODE', // 地图颜色模式
  MAP_BACKGROUND_COLOR: 'MAP_BACKGROUND_COLOR', // 地图背景颜色
}
export default {
  ...LEGEND_CONST,
  ...NAVIGATION_CONST,
  ...MAP3D_CLIP_CONST,
  ...MAP_SETTINGS,
  // Map
  MAP_BASE: 'MAP_BASE',
  // MAP_ADD_LAYER: 'MAP_ADD_LAYER',
  // MAP_ADD_DATASET: 'MAP_ADD_DATASET',
  MAP_SYMBOL: 'MAP_SYMBOL',
  MAP_COLLECTION: 'MAP_COLLECTION',
  MAP_PLOTTING: 'MAP_PLOTTING',
  MAP_NAVIGATION: 'MAP_NAVIGATION',
  AIMapSuspension: 'AIMapSuspension',
  MAPSUSPENSION_CHANGE: 'MAPSUSPENSION_CHANGE',

  MAP_OPEN: 'MAP_OPEN',

  MAP_COLLECTION_POINT: 'MAP_COLLECTION_POINT',
  MAP_COLLECTION_LINE: 'MAP_COLLECTION_LINE',
  MAP_COLLECTION_REGION: 'MAP_COLLECTION_REGION',

  MAP_COLLECTION_CONTROL_POINT: 'MAP_COLLECTION_CONTROL_POINT',
  MAP_COLLECTION_CONTROL_LINE: 'MAP_COLLECTION_CONTROL_LINE',
  MAP_COLLECTION_CONTROL_REGION: 'MAP_COLLECTION_CONTROL_REGION',
  MAP_ANALYST_START: 'MAP_ANALYST_START',

  AIDETECT: 'AIDETECT',

  MAP_MORE: 'MAP_MORE',

  WORKSPACE_CHANGE: 'WORKSPACE_CHANGE',
  OPEN_MAP: 'OPEN_MAP',

  // MAP_COLLECTION_POINT_POINT: 'MAP_COLLECTION_POINT_POINT',
  // MAP_COLLECTION_POINT_GPS: 'MAP_COLLECTION_POINT_GPS',
  // MAP_COLLECTION_LINE_POINT: 'MAP_COLLECTION_LINE_POINT',
  // MAP_COLLECTION_LINE_GPS_POINT: 'MAP_COLLECTION_LINE_GPS_POINT',
  // MAP_COLLECTION_LINE_GPS_PATH: 'MAP_COLLECTION_LINE_GPS_PATH',
  // MAP_COLLECTION_LINE_FREE_DRAW: 'MAP_COLLECTION_LINE_FREE_DRAW',
  // MAP_COLLECTION_REGION_POINT: 'MAP_COLLECTION_REGION_POINT',
  // MAP_COLLECTION_REGION_GPS_POINT: 'MAP_COLLECTION_REGION_GPS_POINT',
  // MAP_COLLECTION_REGION_GPS_PATH: 'MAP_COLLECTION_REGION_GPS_PATH',
  // MAP_COLLECTION_REGION_FREE_DRAW: 'MAP_COLLECTION_REGION_FREE_DRAW',
  MAP_EDIT: 'MAP_EDIT',
  MAP_EDIT_POINT: 'MAP_EDIT_POINT',
  MAP_EDIT_LINE: 'MAP_EDIT_LINE',
  MAP_EDIT_REGION: 'MAP_EDIT_REGION',
  MAP_EDIT_TAGGING: 'MAP_EDIT_TAGGING',
  MAP_EDIT_DEFAULT: 'MAP_EDIT_DEFAULT',
  MAP_EDIT_TAGGING_SETTING: 'MAP_EDIT_TAGGING_SETTING',
  MAP_EDIT_CAD: 'MAP_EDIT_CAD',

  MAP_ANALYSIS: 'MAP_ANALYSIS',
  MAP_ANALYSIS_BUFFER_ANALYSIS: 'MAP_ANALYSIS_BUFFER_ANALYSIS',
  MAP_ANALYSIS_OVERLAY_ANALYSIS: 'MAP_ANALYSIS_OVERLAY_ANALYSIS',
  MAP_ANALYSIS_ONLINE_ANALYSIS: 'MAP_ANALYSIS_ONLINE_ANALYSIS',
  MAP_ANALYSIS_OPTIMAL_PATH: 'MAP_ANALYSIS_OPTIMAL_PATH',
  MAP_ANALYSIS_CONNECTIVITY_ANALYSIS: 'MAP_ANALYSIS_CONNECTIVITY_ANALYSIS',
  MAP_ANALYSIS_FIND_TSP_PATH: 'MAP_ANALYSIS_FIND_TSP_PATH',
  MAP_ANALYSIS_THIESSEN_POLYGON: 'MAP_ANALYSIS_THIESSEN_POLYGON',
  MAP_ANALYSIS_MEASURE_DISTANCE: 'MAP_ANALYSIS_MEASURE_DISTANCE',
  MAP_ANALYSIS_INTERPOLATION_ANALYSIS: 'MAP_ANALYSIS_INTERPOLATION_ANALYSIS',

  MAP_THEME: 'MAP_THEME',
  MAP_THEME_START: 'MAP_THEME_START',
  MAP_THEME_CREATE: 'MAP_THEME_CREATE',
  MAP_THEME_START_CREATE: 'MAP_THEME_START_CREATE', // 开始->新建
  MAP_THEME_CREATE_BY_LAYER: 'MAP_THEME_CREATE_BY_LAYER',
  MAP_THEME_PARAM: 'MAP_THEME_PARAM',
  MAP_THEME_PARAM_GRAPH: 'MAP_THEME_PARAM_GRAPH',
  MAP_THEME_PARAM_UNIQUE_EXPRESSION: 'MAP_THEME_PARAM_UNIQUE_EXPRESSION',
  MAP_THEME_PARAM_UNIQUE_COLOR: 'MAP_THEME_PARAM_UNIQUE_COLOR',
  MAP_THEME_PARAM_RANGE_EXPRESSION: 'MAP_THEME_PARAM_RANGE_EXPRESSION',
  MAP_THEME_PARAM_RANGE_MODE: 'MAP_THEME_PARAM_RANGE_MODE',
  MAP_THEME_PARAM_RANGE_PARAM: 'MAP_THEME_PARAM_RANGE_PARAM',
  MAP_THEME_PARAM_RANGE_COLOR: 'MAP_THEME_PARAM_RANGE_COLOR',
  MAP_THEME_PARAM_CREATE_DATASETS: 'MAP_THEME_PARAM_CREATE_DATASETS',
  MAP_THEME_PARAM_CREATE_EXPRESSION: 'MAP_THEME_PARAM_CREATE_EXPRESSION',
  MAP_THEME_PARAM_GRAPH_EXPRESSION: 'MAP_THEME_PARAM_GRAPH_EXPRESSION',
  MAP_THEME_PARAM_GRAPH_GRADUATEDMODE: 'MAP_THEME_PARAM_GRAPH_GRADUATEDMODE',
  MAP_THEME_PARAM_GRAPH_COLOR: 'MAP_THEME_PARAM_GRAPH_COLOR',
  MAP_THEME_PARAM_GRAPH_MAXVALUE: 'MAP_THEME_PARAM_GRAPH_MAXVALUE',
  MAP_THEME_PARAM_GRAPH_TYPE: 'MAP_THEME_PARAM_GRAPH_TYPE',
  MAP_THEME_PARAM_DOT_DENSITY_EXPRESSION:
    'MAP_THEME_PARAM_DOT_DENSITY_EXPRESSION',
  MAP_THEME_PARAM_DOT_DENSITY_VALUE: 'MAP_THEME_PARAM_DOT_DENSITY_VALUE',
  MAP_THEME_PARAM_DOT_DENSITY_SYMBOLS: 'MAP_THEME_PARAM_DOT_DENSITY_SYMBOLS',
  MAP_THEME_PARAM_DOT_DENSITY_SIZE: 'MAP_THEME_PARAM_DOT_DENSITY_SIZE',
  MAP_THEME_PARAM_DOT_DENSITY_COLOR: 'MAP_THEME_PARAM_DOT_DENSITY_COLOR',
  MAP_THEME_PARAM_GRADUATED_SYMBOL_EXPRESSION:
    'MAP_THEME_PARAM_GRADUATED_SYMBOL_EXPRESSION',
  MAP_THEME_PARAM_GRADUATED_SYMBOL_GRADUATEDMODE:
    'MAP_THEME_PARAM_GRADUATED_SYMBOL_GRADUATEDMODE',
  MAP_THEME_PARAM_GRADUATED_SYMBOL_VALUE:
    'MAP_THEME_PARAM_GRADUATED_SYMBOL_VALUE',
  MAP_THEME_PARAM_GRADUATED_SYMBOLS: 'MAP_THEME_PARAM_GRADUATED_SYMBOLS',
  MAP_THEME_PARAM_GRADUATED_SYMBOL_SIZE:
    'MAP_THEME_PARAM_GRADUATED_SYMBOL_SIZE',
  MAP_THEME_PARAM_GRADUATED_SYMBOL_COLOR:
    'MAP_THEME_PARAM_GRADUATED_SYMBOL_COLOR',
  // 栅格专题图
  MAP_THEME_PARAM_GRID_UNIQUE_COLOR: 'MAP_THEME_PARAM_GRID_UNIQUE_COLOR',
  MAP_THEME_PARAM_GRID_UNIQUE_DEFAULT_COLOR:
    'MAP_THEME_PARAM_GRID_UNIQUE_DEFAULT_COLOR',
  MAP_THEME_PARAM_GRID_RANGE_RANGEMODE: 'MAP_THEME_PARAM_GRID_RANGE_RANGEMODE',
  MAP_THEME_PARAM_GRID_RANGE_RANGECOUNT:
    'MAP_THEME_PARAM_GRID_RANGE_RANGECOUNT',
  MAP_THEME_PARAM_GRID_RANGE_COLOR: 'MAP_THEME_PARAM_GRID_RANGE_COLOR',
  MAP_ADD: 'MAP_ADD',
  MAP_THEME_ADD_DATASET: 'MAP_THEME_ADD_DATASET',
  MAP_THEME_PARAM_CREATE_EXPRESSION_BY_LAYERNAME:
    'MAP_THEME_PARAM_CREATE_EXPRESSION_BY_LAYERNAME',
  MAP_THEME_START_OPENDS: 'MAP_THEME_START_OPENDS', // 开始->新建->打开数据源
  // 热力图
  MAP_THEME_PARAM_HEAT_AGGREGATION_RADIUS:
    'MAP_THEME_PARAM_HEAT_AGGREGATION_RADIUS',
  MAP_THEME_PARAM_HEAT_AGGREGATION_COLOR:
    'MAP_THEME_PARAM_HEAT_AGGREGATION_COLOR',
  MAP_THEME_PARAM_HEAT_AGGREGATION_FUZZYDEGREE:
    'MAP_THEME_PARAM_HEAT_AGGREGATION_FUZZYDEGREE',
  MAP_THEME_PARAM_HEAT_AGGREGATION_MAXCOLOR_WEIGHT:
    'MAP_THEME_PARAM_HEAT_AGGREGATION_MAXCOLOR_WEIGHT',

  MAP_IMPORT_TEMPLATE: 'MAP_IMPORT_TEMPLATE',
  MAP_HISTORY: 'MAP_HISTORY',

  MAP_THEME_PARAM_UNIFORMLABEL_EXPRESSION:
    'MAP_THEME_PARAM_UNIFORMLABEL_EXPRESSION',
  MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE:
    'MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE',
  MAP_THEME_PARAM_UNIFORMLABEL_FONTNAME:
    'MAP_THEME_PARAM_UNIFORMLABEL_FONTNAME',
  MAP_THEME_PARAM_UNIFORMLABEL_FONTSIZE:
    'MAP_THEME_PARAM_UNIFORMLABEL_FONTSIZE',
  MAP_THEME_PARAM_UNIFORMLABEL_ROTATION:
    'MAP_THEME_PARAM_UNIFORMLABEL_ROTATION',
  MAP_THEME_PARAM_UNIFORMLABEL_FORECOLOR:
    'MAP_THEME_PARAM_UNIFORMLABEL_FORECOLOR',
  MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_COLOR:
    'MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_COLOR',

  MAP_THEME_PARAM_UNIQUELABEL_EXPRESSION:
    'MAP_THEME_PARAM_UNIQUELABEL_EXPRESSION',
  MAP_THEME_PARAM_UNIQUELABEL_COLOR: 'MAP_THEME_PARAM_UNIQUELABEL_COLOR',

  MAP_THEME_PARAM_RANGELABEL_FONTNAME: 'MAP_THEME_PARAM_RANGELABEL_FONTNAME',
  MAP_THEME_PARAM_RANGELABEL_ROTATION: 'MAP_THEME_PARAM_RANGELABEL_ROTATION',
  MAP_THEME_PARAM_RANGELABEL_EXPRESSION:
    'MAP_THEME_PARAM_RANGELABEL_EXPRESSION',
  MAP_THEME_PARAM_RANGELABEL_MODE: 'MAP_THEME_PARAM_RANGELABEL_MODE',
  MAP_THEME_PARAM_RANGELABEL_COLOR: 'MAP_THEME_PARAM_RANGELABEL_COLOR',

  MAP_SHARE: 'MAP_SHARE',
  MAP_SHARE_MAP3D: 'MAP_SHARE_MAP3D',
  MAP_TOOL: 'MAP_TOOL',
  MAP_TOOLS: 'MAP_TOOLS',
  MAP_MARKS: 'MAP_MARKS', //  标注模块
  MAP_TOOL_TAGGING_SETTING: 'MAP_TOOL_TAGGING_SETTING',
  MAP_TOOL_TAGGING: 'MAP_TOOL_TAGGING',
  MAP_TOOL_POINT_SELECT: 'MAP_TOOL_POINT_SELECT',
  MAP_TOOL_SELECT_BY_RECTANGLE: 'MAP_TOOL_SELECT_BY_RECTANGLE',
  MAP_TOOL_MEASURE_LENGTH: 'MAP_TOOL_MEASURE_LENGTH',
  MAP_TOOL_MEASURE_AREA: 'MAP_TOOL_MEASURE_AREA',
  MAP_TOOL_MEASURE_ANGLE: 'MAP_TOOL_MEASURE_ANGLE',
  MAP_TOOL_RECTANGLE_CUT: 'MAP_TOOL_RECTANGLE_CUT',
  MAP_TOOL_TAGGING_POINT_SELECT: 'MAP_TOOL_TAGGING_POINT_SELECT',
  MAP_TOOL_TAGGING_SELECT: 'MAP_TOOL_TAGGING_SELECT',
  MAP_TOOL_TAGGING_SELECT_POINT: 'MAP_TOOL_TAGGING_SELECT_POINT',
  MAP_TOOL_TAGGING_SELECT_LINE: 'MAP_TOOL_TAGGING_SELECT_LINE',
  MAP_TOOL_TAGGING_SELECT_REGION: 'MAP_TOOL_TAGGING_SELECT_REGION',
  MAP_TOOL_TAGGING_SELECT_TEXT: 'MAP_TOOL_TAGGING_SELECT_TEXT',
  MAP_TOOL_TAGGING_EDIT: 'MAP_TOOL_TAGGING_EDIT',
  MAP_TOOL_TAGGING_EDIT_POINT: 'MAP_TOOL_TAGGING_EDIT_POINT',
  MAP_TOOL_TAGGING_EDIT_LINE: 'MAP_TOOL_TAGGING_EDIT_LINE',
  MAP_TOOL_TAGGING_EDIT_REGION: 'MAP_TOOL_TAGGING_EDIT_REGION',
  MAP_TOOL_TAGGING_EDIT_TEXT: 'MAP_TOOL_TAGGING_EDIT_TEXT',
  MAP_TOOL_TAGGING_STYLE: 'MAP_TOOL_TAGGING_STYLE',
  MAP_TOOL_TAGGING_STYLE_POINT: 'MAP_TOOL_TAGGING_STYLE_POINT',
  MAP_TOOL_TAGGING_STYLE_LINE: 'MAP_TOOL_TAGGING_STYLE_LINE',
  MAP_TOOL_TAGGING_STYLE_REGION: 'MAP_TOOL_TAGGING_STYLE_REGION',
  MAP_TOOL_TAGGING_STYLE_TEXT: 'MAP_TOOL_TAGGING_STYLE_TEXT',
  MAP_TOOL_TAGGING_STYLE_TEXT_FONT: 'MAP_TOOL_TAGGING_STYLE_TEXT_FONT',
  MAP_TOOL_TAGGING_STYLE_POINT_COLOR_SET:
    'MAP_TOOL_TAGGING_STYLE_POINT_COLOR_SET',
  MAP_TOOL_TAGGING_STYLE_LINE_COLOR_SET:
    'MAP_TOOL_TAGGING_STYLE_LINE_COLOR_SET',
  MAP_TOOL_TAGGING_STYLE_REGION_FORECOLOR_SET:
    'MAP_TOOL_TAGGING_STYLE_REGION_FORECOLOR_SET',
  MAP_TOOL_TAGGING_STYLE_REGION_BOARDERCOLOR_SET:
    'MAP_TOOL_TAGGING_STYLE_REGION_BOARDERCOLOR_SET',
  MAP_TOOL_TAGGING_STYLE_TEXT_COLOR_SET:
    'MAP_TOOL_TAGGING_STYLE_TEXT_COLOR_SET',
  MAP_TOOL_TAGGING_THEME: 'MAP_TOOL_TAGGING_THEME',
  MAP_TOOL_TAGGING_SELECT_BY_RECTANGLE: 'MAP_TOOL_TAGGING_SELECT_BY_RECTANGLE',

  MAP_STYLE: 'MAP_STYLE',
  MAP_EDIT_STYLE: 'MAP_EDIT_STYLE',
  // 地图底图切换常量
  MAP_EDIT_MORE_STYLE: 'MAP_EDIT_MORE_STYLE',
  MAP_SCALE: 'MAP_SCALE',
  MAP_MAX_SCALE: 'MAP_MAX_SCALE',
  MAP_MIN_SCALE: 'MAP_MIN_SCALE',
  COLLECTION: 'COLLECTION',
  PLOTTING: 'PLOTTING',
  PLOTTING_ANIMATION: 'PLOTTING_ANIMATION',
  MAP_NULL: 'MAP_NULL',
  GRID_STYLE: 'GRID_STYLE',
  MAP_COLLECTION_START: 'MAP_COLLECTION_START',
  MAP_NAVIGATION_START: 'MAP_NAVIGATION_START',
  MAP_PLOTTING_START: 'MAP_PLOTTING_START',
  MAP_PLOTTING_ANIMATION: 'MAP_PLOTTING_ANIMATION',
  MAP_PLOTTING_ANIMATION_ITEM: 'MAP_PLOTTING_ANIMATION_ITEM',
  MAP_START: 'MAP_START',
  MAP_EDIT_START: 'MAP_START',
  MAP_3D_START: 'MAP_3D_START',
  MAP_CHANGE: 'MAP_CHANGE',
  MAP_TEMPLATE: 'MAP_TEMPLATE',
  MAP_SELECT: 'MAP_SELECT',
  LINECOLOR_SET: 'LINECOLOR_SET',
  POINTCOLOR_SET: 'POINTCOLOR_SET',
  TEXTCOLOR_SET: 'TEXTCOLOR_SET',
  REGIONBEFORECOLOR_SET: 'REGIONBEFORECOLOR_SET',
  REGIONBORDERCOLOR_SET: 'REGIONBORDERCOLOR_SET',
  REGIONAFTERCOLOR_SET: 'REGIONAFTERCOLOR_SET',
  TEXTFONT: 'TEXTFONT',
  MAP_THEME_STYLE: 'MAP_THEME_STYLE',
  MAP_THEME_STYLES: 'MAP_THEME_STYLES',
  PLOT_LIB_CHANGE: 'PLOT_LIB_CHANGE',
  // 推演动画
  PLOT_ANIMATION_START: 'plot_animation_start',
  PLOT_ANIMATION_NODE_CREATE: 'plot_animation_node_create',
  PLOT_ANIMATION_PLAY: 'plot_animation_play',
  PLOT_ANIMATION_GO_OBJECT_LIST: 'plot_animation_go_object_list', // 推演动画的节点对象列表
  PLOT_ANIMATION_XML_LIST: 'plot_animation_xml_list',
  PLOT_ANIMATION_WAY: 'plot_animation_way',

  MAP_TOOL_ATTRIBUTE_RELATE: 'MAP_TOOL_ATTRIBUTE_RELATE',
  MAP_TOOL_ATTRIBUTE_SELECTION_RELATE: 'MAP_TOOL_ATTRIBUTE_SELECTION_RELATE',

  // Map3D
  MAP_3D: 'MAP_3D',
  MAP3D_BASE: 'MAP3D_BASE',
  MAP3D_MARK: 'MAP3D_MARK', // 三维标注
  MAP3D_LAYER3D_BASE: 'MAP3D_LAYER3D_BASE',
  MAP3D_ADD_LAYER: 'MAP3D_ADD_LAYER',
  MAP3D_SYMBOL: 'MAP3D_SYMBOL',
  MAP3D_SYMBOL_POINT: 'MAP3D_SYMBOL_POINT',
  MAP3D_SYMBOL_TEXT: 'MAP3D_SYMBOL_TEXT',
  MAP3D_SYMBOL_POINTLINE: 'MAP3D_SYMBOL_POINTLINE',
  MAP3D_SYMBOL_POINTSURFACE: 'MAP3D_SYMBOL_POINTSURFACE',
  MAP3D_TOOL: 'MAP3D_TOOL',
  MAP3D_TOOL_DISTANCEMEASURE: 'MAP3D_TOOL_DISTANCEMEASURE',
  MAP3D_TOOL_SUERFACEMEASURE: 'MAP3D_TOOL_SUERFACEMEASURE',
  MAP3D_TOOL_HEIGHTMEASURE: 'MAP3D_TOOL_HEIGHTMEASURE',
  MAP3D_TOOL_SELECTION: 'MAP3D_TOOL_SELECTION',
  MAP3D_TOOL_BOXTAILOR: 'MAP3D_TOOL_BOXTAILOR',
  MAP3D_TOOL_PSTAILOR: 'MAP3D_TOOL_PSTAILOR',
  MAP3D_TOOL_CROSSTAILOR: 'MAP3D_TOOL_CROSSTAILOR',
  MAP3D_TOOL_FLY: 'MAP3D_TOOL_FLY',
  MAP3D_TOOL_NEWFLY: 'MAP3D_TOOL_NEWFLY',
  MAP3D_TOOL_LEVEL: 'MAP3D_TOOL_LEVEL',
  MAP3D_TOOL_FLYLIST: 'MAP3D_TOOL_FLYLIST',
  MAP3D_ATTRIBUTE: 'MAP3D_ATTRIBUTE',
  MAP3D_CIRCLEFLY: 'MAP3D_CIRCLEFLY',
  MAP3D_WORKSPACE_LIST: 'MAP3D_WORKSPACE_LIST',
  MAP_MORE_MAP3D: 'MAP_MORE_MAP3D',
  MAP3D_SHARE: 'MAP3D_SHARE',
  MAP3D_IMPORTWORKSPACE: 'MAP3D_IMPORTWORKSPACE',
  MAP3D_LAYER3D_DEFAULT: 'MAP3D_LAYER3D_DEFAULT', // 3d默认图层
  MAP3D_LAYER3D_DEFAULT_SELECTED: 'MAP3D_LAYER3D_DEFAULT_SELECTED', // 3d默认图层
  MAP3D_LAYER3D_IMAGE: 'MAP3D_LAYER3D_IMAGE', // 3d影像图层
  MAP3D_LAYER3D_TERRAIN: 'MAP3D_LAYER3D_TERRAIN', // 3d地形图层
  MAP3D_SYMBOL_SELECT: 'MAP3D_SYMBOL_SELECT',

  // MAP_AR视频地图模块-AI助手
  MAP_AR_AI_ASSISTANT: 'MAP_AR_AI_ASSISTANT',

  MAP_MORE_THEME: 'MAP_MORE_THEME',
  STYLE_TRANSFER: 'STYLE_TRANSFER', // 智能配图
  STYLE_TRANSFER_PICKER: 'STYLE_TRANSFER_PICKER', // 智能配图属性选择器

  // 工具视图高度级别
  HEIGHT: [
    scaleSize(100),
    scaleSize(150),
    scaleSize(250),
    scaleSize(720),
    scaleSize(0),
    scaleSize(80),
  ],
  NEWTHEME_HEIGHT: [
    scaleSize(100),
    scaleSize(200),
    scaleSize(300),
    scaleSize(400),
    scaleSize(500),
  ],
  THEME_HEIGHT: [
    scaleSize(100),
    scaleSize(150),
    scaleSize(250),
    scaleSize(400),
    scaleSize(500),
    scaleSize(600),
    scaleSize(700),
    scaleSize(300),
    scaleSize(120),
    scaleSize(750),
    scaleSize(800),
  ],
  TOOLBAR_HEIGHT: [
    scaleSize(TOOLBAR_HEIGHT_1),
    scaleSize(TOOLBAR_HEIGHT_1 * 2),
    scaleSize(TOOLBAR_HEIGHT_1 * 3),
    scaleSize(TOOLBAR_HEIGHT_1 * 4),
    scaleSize(TOOLBAR_HEIGHT_1 * 5),
    scaleSize(TOOLBAR_HEIGHT_1 * 6),
    scaleSize(TOOLBAR_HEIGHT_1 * 7),
    scaleSize(TOOLBAR_HEIGHT_1 * 8),
  ],
  TOOLBAR_HEIGHT_2: [
    scaleSize(TOOLBAR_HEIGHT_2),
    scaleSize(TOOLBAR_HEIGHT_2 * 2),
    scaleSize(TOOLBAR_HEIGHT_2 * 3),
    scaleSize(TOOLBAR_HEIGHT_2 * 4),
    scaleSize(TOOLBAR_HEIGHT_2 * 5),
    scaleSize(TOOLBAR_HEIGHT_2 * 6),
    scaleSize(TOOLBAR_HEIGHT_2 * 7),
  ],
  TOOLBAR_BASEMAP_HEIGHT: [],
}
