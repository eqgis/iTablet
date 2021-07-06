/**
 * 地图功能列表/工具栏 对应的标识符
 *
 * 命名规范：大类(如MAP或MAP3D等)_功能类型(如SETTINGS、TOOL、ANALYSIS等)_具体功能，使用 "大类_功能类型_" 来分类查找
 * 例如：SM_MAP3D_MARK_POINT、SM_MAP_THEME_CREATE
 */
import { scaleSize } from '../utils'

const TOOLBAR_HEIGHT_1 = 88
const TOOLBAR_HEIGHT_2 = 80

// 图例
const LEGEND_CONST = {
  SM_MAP_LEGEND: 'SM_MAP_LEGEND', // 图例，模块类型
  // SM_MAP_LEGEND_NOT_VISIBLE: 'SM_MAP_LEGEND_NOT_VISIBLE', // 图例不可见
  SM_MAP_LEGEND_POSITION: 'SM_MAP_LEGEND_POSITION', // 图例位置
}

// 导航模块
const NAVIGATION_CONST = {
  SM_MAP_TOOL_INCREMENT: 'SM_MAP_TOOL_INCREMENT', //增量路网
  SM_MAP_TOOL_GPSINCREMENT: 'SM_MAP_TOOL_GPSINCREMENT', //GPS增量路网
  SM_MAP_NAVIGATION_MODULE: 'SM_MAP_NAVIGATION_MODULE', //导航

  SM_MAP_INCREMENT: 'SM_MAP_INCREMENT', //增量模块，模块类型
  SM_MAP_INCREMENT_INNER: 'SM_MAP_INCREMENT_INNER', //增量室内
  SM_MAP_INCREMENT_POINTLINE: 'SM_MAP_INCREMENT_POINTLINE', //点绘式
  SM_MAP_INCREMENT_FREELINE: 'SM_MAP_INCREMENT_FREELINE', //自由式
  SM_MAP_INCREMENT_GPS_POINT: 'SM_MAP_INCREMENT_GPS_POINT', //GPS打点式
  SM_MAP_INCREMENT_GPS_TRACK: 'SM_MAP_INCREMENT_GPS_TRACK', //GPS轨迹式
  SM_MAP_INCREMENT_CHANGE_METHOD: 'SM_MAP_INCREMENT_CHANGE_METHOD', //切换增量方式
  SM_MAP_INCREMENT_EDIT: 'SM_MAP_INCREMENT_EDIT', //编辑
  SM_MAP_INCREMENT_CHANGE_NETWORK: 'SM_MAP_INCREMENT_CHANGE_NETWORK', //切换路网

  SM_MAP_TOPO_EDIT: 'SM_MAP_TOPO', //拓扑编辑，模块类型
  SM_MAP_TOPO_SWITCH_TYPE: 'SM_MAP_TOPO_SWITCH_TYPE', //拓扑编辑 切换当前编辑类型
  SM_MAP_TOPO_TOPING: 'SM_MAP_TOPO_TOPING', //拓扑编辑 编辑状态
  SM_MAP_TOPO_MERGE_DATASET: 'SM_MAP_TOPO_MERGE_DATASET', //合并数据集
  SM_MAP_TOPO_OBJECT_EDIT: 'SM_MAP_TOPO_OBJECT_EDIT', //对象编辑
  SM_MAP_TOPO_OBJECT_EDIT_SELECTED: 'SM_MAP_TOPO_OBJECT_EDIT_SELECTED', //对象编辑 已选中对象
  SM_MAP_TOPO_SMOOTH: 'SM_MAP_TOPO_SMOOTH', //拓扑编辑 平滑线
  SM_MAP_TOPO_SPLIT: 'SM_MAP_TOPO_SPLIT', //拓扑编辑 点线打断
  SM_MAP_TOPO_EXTEND_LINE: 'SM_MAP_TOPO_EXTEND_LINE', //拓扑编辑 线延长
  SM_MAP_TOPO_SPLIT_LINE: 'SM_MAP_TOPO_SPLIT_LINE', //拓扑编辑 线线打断
  SM_MAP_TOPO_SPLIT_LINE_SELECT_FINISH: 'SM_MAP_TOPO_SPLIT_LINE_SELECT_FINISH', //拓扑编辑 线线打断 两条线选择完成
  SM_MAP_TOPO_TRIM_LINE: 'SM_MAP_TOPO_TRIM_LINE', //拓扑编辑 线修剪
  SM_MAP_TOPO_RESAMPLE_LINE: 'SM_MAP_TOPO_RESAMPLE_LINE', //拓扑编辑 重采样线
  SM_MAP_TOPO_CHANGE_DIRECTION: 'SM_MAP_TOPO_CHANGE_DIRECTION', //拓扑编辑 线变方向
}

//地图设置
const MAP_SETTINGS_CONST = {
  SM_MAP_SETTINGS_COLOR_MODE: 'SM_MAP_SETTINGS_COLOR_MODE',              //地图颜色模式
  SM_MAP_SETTINGS_BACKGROUND_COLOR: 'SM_MAP_SETTINGS_BACKGROUND_COLOR',  //地图背景颜色
}

/** 图层设置 **/
const MAP_LAYER_VISIBLE_CONST = {
  SM_MAP_LAYER_VISIBLE_SCALE: 'SM_MAP_LAYER_VISIBLE_SCALE',             //图层可见比例尺范围设置
  SM_MAP_LAYER_VISIBLE_SCALE_USER_DEFINE: 'SM_MAP_LAYER_VISIBLE_SCALE_USER_DEFINE', //图层可见比例尺 用户自定义设置
}

const MAP_MARKS_CONST = {
  SM_MAP_MARKS: 'SM_MAP_MARKS', //  标注模块，模块类型
  SM_MAP_MARKS_DRAW: 'SM_MAP_MARKS_DRAW', //标注绘制
  SM_MAP_MARKS_DRAW_UNDO: 'SM_MAP_MARKS_DRAW_UNDO', //撤销
  SM_MAP_MARKS_DRAW_REDO: 'SM_MAP_MARKS_DRAW_REDO', //回退
  SM_MAP_MARKS_DRAW_TEXT: 'SM_MAP_MARKS_DRAW_TEXT', //标注添加文字

  SM_MAP_MARKS_TAGGING_SETTING: 'SM_MAP_MARKS_TAGGING_SETTING',
  SM_MAP_MARKS_TAGGING_SELECT_BY_RECTANGLE:
    'SM_MAP_MARKS_TAGGING_SELECT_BY_RECTANGLE',
  SM_MAP_MARKS_SELECT_BY_RECTANGLE: 'SM_MAP_MARKS_SELECT_BY_RECTANGLE',
  SM_MAP_MARKS_TAGGING_POINT_SELECT: 'SM_MAP_MARKS_TAGGING_POINT_SELECT',
  SM_MAP_MARKS_TAGGING_SELECT: 'SM_MAP_MARKS_TAGGING_SELECT',
  SM_MAP_MARKS_POINT_SELECT: 'SM_MAP_MARKS_POINT_SELECT',
  SM_MAP_MARKS_TAGGING_EDIT: 'SM_MAP_MARKS_TAGGING_EDIT',
  SM_MAP_MARKS_TAGGING_STYLE: 'SM_MAP_MARKS_TAGGING_STYLE',
  //标注对象编辑相关
  SM_MAP_MARKS_TAGGING_EDIT_POINT: 'SM_MAP_MARKS_TAGGING_EDIT_POINT',
  SM_MAP_MARKS_TAGGING_EDIT_LINE: 'SM_MAP_MARKS_TAGGING_EDIT_LINE',
  SM_MAP_MARKS_TAGGING_EDIT_REGION: 'SM_MAP_MARKS_TAGGING_EDIT_REGION',
  SM_MAP_MARKS_TAGGING_EDIT_TEXT: 'SM_MAP_MARKS_TAGGING_EDIT_TEXT',
  //非CAD图层编辑 无风格
  SM_MAP_MARKS_TAGGING_EDIT_POINT_NOSTYLE: 'SM_MAP_MARKS_TAGGING_EDIT_POINT_NOSTYLE',
  SM_MAP_MARKS_TAGGING_EDIT_LINE_NOSTYLE: 'SM_MAP_MARKS_TAGGING_EDIT_LINE_NOSTYLE',
  SM_MAP_MARKS_TAGGING_EDIT_REGION_NOSTYLE:
    'SM_MAP_MARKS_TAGGING_EDIT_REGION_NOSTYLE',
  SM_MAP_MARKS_TAGGING_EDIT_TEXT_NOSTYLE: 'SM_MAP_MARKS_TAGGING_EDIT_TEXT_NOSTYLE',
  //CAD图层编辑 带风格
  SM_MAP_MARKS_TAGGING_STYLE_POINT: 'SM_MAP_MARKS_TAGGING_STYLE_POINT',
  SM_MAP_MARKS_TAGGING_STYLE_LINE: 'SM_MAP_MARKS_TAGGING_STYLE_LINE',
  SM_MAP_MARKS_TAGGING_STYLE_REGION: 'SM_MAP_MARKS_TAGGING_STYLE_REGION',
  SM_MAP_MARKS_TAGGING_STYLE_TEXT: 'SM_MAP_MARKS_TAGGING_STYLE_TEXT',
  //颜色设置
  SM_MAP_MARKS_TAGGING_STYLE_POINT_COLOR_SET:
    'SM_MAP_MARKS_TAGGING_STYLE_POINT_COLOR_SET',
  SM_MAP_MARKS_TAGGING_STYLE_LINE_COLOR_SET:
    'SM_MAP_MARKS_TAGGING_STYLE_LINE_COLOR_SET',
  SM_MAP_MARKS_TAGGING_STYLE_REGION_BORDERCOLOR_SET:
    'SM_MAP_MARKS_TAGGING_STYLE_REGION_BORDERCOLOR_SET',
  SM_MAP_MARKS_TAGGING_STYLE_REGION_FORECOLOR_SET:
    'SM_MAP_MARKS_TAGGING_STYLE_REGION_FORECOLOR_SET',
  SM_MAP_MARKS_TAGGING_STYLE_TEXT_COLOR_SET:
    'SM_MAP_MARKS_TAGGING_STYLE_TEXT_COLOR_SET',
  SM_MAP_MARKS_TAGGING_STYLE_TEXT_FONT: 'SM_MAP_MARKS_TAGGING_STYLE_TEXT_FONT',
}

//带Touchprogress的type 无data只有buttons  所有TouchProgress对应的type放在此处，注明模块
const TOUCHPROGRESS_CONST = {
  //标注模块
  SM_MAP_MARKS_TAGGING_STYLE_LINE_WIDTH: 'SM_MAP_MARKS_TAGGING_STYLE_LINE_WIDTH', //线宽
  SM_MAP_MARKS_TAGGING_STYLE_POINT_SIZE: 'SM_MAP_MARKS_TAGGING_STYLE_POINT_SIZE', //点符号大小
  SM_MAP_MARKS_TAGGING_STYLE_POINT_ROTATION:
    'SM_MAP_MARKS_TAGGING_STYLE_POINT_ROTATION', //点旋转角度
  SM_MAP_MARKS_TAGGING_STYLE_POINT_TRANSPARENCY:
    'SM_MAP_MARKS_TAGGING_STYLE_POINT_TRANSPARENCY', //点透明度
  SM_MAP_MARKS_TAGGING_STYLE_REGION_BORDER_WIDTH:
    'SM_MAP_MARKS_TAGGING_STYLE_REGION_BORDER_WIDTH', //面边框宽度
  SM_MAP_MARKS_TAGGING_STYLE_REGION_TRANSPARENCY:
    'SM_MAP_MARKS_TAGGING_STYLE_REGION_TRANSPARENCY', //面透明度
  SM_MAP_MARKS_TAGGING_STYLE_TEXT_FONT_SIZE:
    'SM_MAP_MARKS_TAGGING_STYLE_TEXT_FONT_SIZE', //文字字号
  SM_MAP_MARKS_TAGGING_STYLE_TEXT_ROTATION:
    'SM_MAP_MARKS_TAGGING_STYLE_TEXT_ROTATION', //文字旋转角度
}

/** 地图浏览 **/
const MAP_EDIT_CONST = {
  SM_MAP_EDIT: 'SM_MAP_EDIT',                                   // 地图编辑模块，Toolbar只有底部按钮栏（未选中任何对象时的编辑模式），模块类型
  SM_MAP_EDIT_POINT: 'SM_MAP_EDIT_POINT',                       // 编辑点
  SM_MAP_EDIT_LINE: 'SM_MAP_EDIT_LINE',                         // 编辑线
  SM_MAP_EDIT_REGION: 'SM_MAP_EDIT_REGION',                     // 编辑面
  SM_MAP_EDIT_TEXT: 'SM_MAP_EDIT_TEXT',                         // 编辑文字
  SM_MAP_EDIT_TAGGING: 'SM_MAP_EDIT_TAGGING',                   // 编辑标注
  SM_MAP_EDIT_TAGGING_SETTING: 'SM_MAP_EDIT_TAGGING_SETTING',   // 标注设置
  SM_MAP_EDIT_PLOT: 'SM_MAP_EDIT_PLOT',                         // 编辑标绘
}

/** 专题 **/
const MAP_THEME_CONST = {
  SM_MAP_THEME: 'SM_MAP_THEME',                                                       // 专题模块，模块类型
  SM_MAP_THEME_CREATE: 'SM_MAP_THEME_CREATE',                                         // 新建专题图，选择专题图类型
  SM_MAP_THEME_CREATE_BY_LAYER: 'SM_MAP_THEME_CREATE_BY_LAYER',                       // 从图层页面，新建专题图，选择专题图类型
  SM_MAP_THEME_PARAM: 'SM_MAP_THEME_PARAM',                                           // 普通专题图
  SM_MAP_THEME_PARAM_CREATE_DATASETS: 'SM_MAP_THEME_PARAM_CREATE_DATASETS',           // 选择数据集
  SM_MAP_THEME_PARAM_CREATE_EXPRESSION: 'SM_MAP_THEME_PARAM_CREATE_EXPRESSION',       // 选择数据集中表达式

  // 单值专题图
  SM_MAP_THEME_PARAM_UNIQUE_EXPRESSION: 'SM_MAP_THEME_PARAM_UNIQUE_EXPRESSION',       // 单值专题表达式
  SM_MAP_THEME_PARAM_UNIQUE_COLOR: 'SM_MAP_THEME_PARAM_UNIQUE_COLOR',                 // 单值专题图颜色方案

  // 分段专题图
  SM_MAP_THEME_PARAM_RANGE_EXPRESSION: 'SM_MAP_THEME_PARAM_RANGE_EXPRESSION',         // 分段专题表达式
  SM_MAP_THEME_PARAM_RANGE_MODE: 'SM_MAP_THEME_PARAM_RANGE_MODE',                     // 选择分段专题模式
  SM_MAP_THEME_PARAM_RANGE_COLOR: 'SM_MAP_THEME_PARAM_RANGE_COLOR',                   // 选择分段专题颜色方案

  // 统计专题图
  SM_MAP_THEME_PARAM_GRAPH: 'SM_MAP_THEME_PARAM_GRAPH',                               // 统计专题图
  SM_MAP_THEME_PARAM_GRAPH_EXPRESSION: 'SM_MAP_THEME_PARAM_GRAPH_EXPRESSION',         // 选择统计专题图数据集中表达式
  SM_MAP_THEME_PARAM_GRAPH_GRADUATEDMODE: 'SM_MAP_THEME_PARAM_GRAPH_GRADUATEDMODE',   // 统计专题图统计值计算方法
  SM_MAP_THEME_PARAM_GRAPH_COLOR: 'SM_MAP_THEME_PARAM_GRAPH_COLOR',                   // 统计专题图颜色表
  SM_MAP_THEME_PARAM_GRAPH_MAXVALUE: 'SM_MAP_THEME_PARAM_GRAPH_MAXVALUE',             // 统计专题图最大显示值
  SM_MAP_THEME_PARAM_GRAPH_TYPE: 'SM_MAP_THEME_PARAM_GRAPH_TYPE',                     // 统计专题图类型

  // 点密度专题图
  SM_MAP_THEME_PARAM_DOT_DENSITY_EXPRESSION:
    'SM_MAP_THEME_PARAM_DOT_DENSITY_EXPRESSION',                                      // 点密度专题图表达式
  SM_MAP_THEME_PARAM_DOT_DENSITY_VALUE: 'SM_MAP_THEME_PARAM_DOT_DENSITY_VALUE',       // 点密度专题图基础值
  SM_MAP_THEME_PARAM_DOT_DENSITY_SYMBOLS: 'SM_MAP_THEME_PARAM_DOT_DENSITY_SYMBOLS',   // 点密度专题图符号
  SM_MAP_THEME_PARAM_DOT_DENSITY_SIZE: 'SM_MAP_THEME_PARAM_DOT_DENSITY_SIZE',         // 点密度专题图大小
  SM_MAP_THEME_PARAM_DOT_DENSITY_COLOR: 'SM_MAP_THEME_PARAM_DOT_DENSITY_COLOR',       // 点密度专题图颜色方案

  // 等级符号专题图
  SM_MAP_THEME_PARAM_GRADUATED_SYMBOL_EXPRESSION:
    'SM_MAP_THEME_PARAM_GRADUATED_SYMBOL_EXPRESSION',                              // 等级符号专题图，修改分级方式表达式
  SM_MAP_THEME_PARAM_GRADUATED_SYMBOL_GRADUATEDMODE:
    'SM_MAP_THEME_PARAM_GRADUATED_SYMBOL_GRADUATEDMODE',                           // 等级符号专题图，修改分级方式
  SM_MAP_THEME_PARAM_GRADUATED_SYMBOL_VALUE:
    'SM_MAP_THEME_PARAM_GRADUATED_SYMBOL_VALUE',                                   // 等级符号专题图，修改基准值
  SM_MAP_THEME_PARAM_GRADUATED_SYMBOLS: 'SM_MAP_THEME_PARAM_GRADUATED_SYMBOLS',       // 等级符号专题图，修改点符号
  SM_MAP_THEME_PARAM_GRADUATED_SYMBOL_SIZE:
    'SM_MAP_THEME_PARAM_GRADUATED_SYMBOL_SIZE',                                    // 等级符号专题图，修改点符号大小
  SM_MAP_THEME_PARAM_GRADUATED_SYMBOL_COLOR:
    'SM_MAP_THEME_PARAM_GRADUATED_SYMBOL_COLOR',                                   // 等级符号专题图，修改点符号颜色方案

  // 栅格专题图
  SM_MAP_THEME_PARAM_GRID_UNIQUE_COLOR: 'SM_MAP_THEME_PARAM_GRID_UNIQUE_COLOR',       // 栅格单值专题图颜色方案
  SM_MAP_THEME_PARAM_GRID_RANGE_RANGEMODE: 'SM_MAP_THEME_PARAM_GRID_RANGE_RANGEMODE', // 栅格分段专题图分段方法
  SM_MAP_THEME_PARAM_GRID_RANGE_RANGECOUNT:
    'SM_MAP_THEME_PARAM_GRID_RANGE_RANGECOUNT',                                    // 栅格分段专题图分段数
  SM_MAP_THEME_PARAM_GRID_RANGE_COLOR: 'SM_MAP_THEME_PARAM_GRID_RANGE_COLOR',         // 栅格分段专题图颜色方案
  SM_MAP_THEME_PARAM_CREATE_EXPRESSION_BY_LAYERNAME:
    'SM_MAP_THEME_PARAM_CREATE_EXPRESSION_BY_LAYERNAME',                           // 通过图层获取数据集，并从数据集中获取表达式

  // 热力图
  SM_MAP_THEME_PARAM_HEAT_AGGREGATION_RADIUS:
    'SM_MAP_THEME_PARAM_HEAT_AGGREGATION_RADIUS',                                  // 热力图核半径
  SM_MAP_THEME_PARAM_HEAT_AGGREGATION_COLOR:
    'SM_MAP_THEME_PARAM_HEAT_AGGREGATION_COLOR',                                   // 热力图颜色方案
  SM_MAP_THEME_PARAM_HEAT_AGGREGATION_FUZZYDEGREE:
    'SM_MAP_THEME_PARAM_HEAT_AGGREGATION_FUZZYDEGREE',                             // 热力图颜色渐变模糊度
  SM_MAP_THEME_PARAM_HEAT_AGGREGATION_MAXCOLOR_WEIGHT:
    'SM_MAP_THEME_PARAM_HEAT_AGGREGATION_MAXCOLOR_WEIGHT',                         // 热力图最大颜色权重

  // 单值标签专题图
  SM_MAP_THEME_PARAM_UNIFORMLABEL_EXPRESSION:
    'SM_MAP_THEME_PARAM_UNIFORMLABEL_EXPRESSION',                                  // 单值标签表达式
  SM_MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE:
    'SM_MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE',                                   // 单值标签背景形状
  SM_MAP_THEME_PARAM_UNIFORMLABEL_FONTNAME:
    'SM_MAP_THEME_PARAM_UNIFORMLABEL_FONTNAME',                                    // 单值标签字形
  SM_MAP_THEME_PARAM_UNIFORMLABEL_FONTSIZE:
    'SM_MAP_THEME_PARAM_UNIFORMLABEL_FONTSIZE',                                    // 单值标签字号
  SM_MAP_THEME_PARAM_UNIFORMLABEL_ROTATION:
    'SM_MAP_THEME_PARAM_UNIFORMLABEL_ROTATION',                                    // 单值标签旋转角度
  SM_MAP_THEME_PARAM_UNIFORMLABEL_FORECOLOR:
    'SM_MAP_THEME_PARAM_UNIFORMLABEL_FORECOLOR',                                   // 单值标签前景色
  SM_MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_COLOR:
    'SM_MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_COLOR',                             // 单值标签背景色
  SM_MAP_THEME_PARAM_UNIQUELABEL_EXPRESSION:
    'SM_MAP_THEME_PARAM_UNIQUELABEL_EXPRESSION',                                   // 单值标签单值表达式
  SM_MAP_THEME_PARAM_UNIQUELABEL_COLOR: 'SM_MAP_THEME_PARAM_UNIQUELABEL_COLOR',       // 单值标签单值颜色方案

  // 分段标签专题图
  SM_MAP_THEME_PARAM_RANGELABEL_FONTNAME: 'SM_MAP_THEME_PARAM_RANGELABEL_FONTNAME',   // 分段标签字形
  SM_MAP_THEME_PARAM_RANGELABEL_ROTATION: 'SM_MAP_THEME_PARAM_RANGELABEL_ROTATION',   // 分段标签旋转角度
  SM_MAP_THEME_PARAM_RANGELABEL_EXPRESSION:
    'SM_MAP_THEME_PARAM_RANGELABEL_EXPRESSION',                                    // 分段标签表达式
  SM_MAP_THEME_PARAM_RANGELABEL_MODE: 'SM_MAP_THEME_PARAM_RANGELABEL_MODE',           // 分段标签分段方式
  SM_MAP_THEME_PARAM_RANGELABEL_COLOR: 'SM_MAP_THEME_PARAM_RANGELABEL_COLOR',         // 分段标签专题图颜色表
}

/** 推演动画 **/
const PLOT_ANIMATION_CONST = {
  SM_MAP_PLOT: 'SM_MAP_PLOT',                                                   // 标绘模块，模块类型
  SM_MAP_PLOT_LIB_CHANGE: 'SM_MAP_PLOT_LIB_CHANGE',

  SM_MAP_PLOT_ANIMATION: 'SM_MAP_PLOT_ANIMATION',                               // 推演模块
  SM_MAP_PLOT_ANIMATION_TEMP: 'SM_MAP_PLOT_ANIMATION_TEMP',
  // SM_MAP_PLOTTING_ANIMATION_ITEM: 'SM_MAP_PLOTTING_ANIMATION_ITEM',
  SM_MAP_PLOT_ANIMATION_START: 'SM_MAP_PLOT_ANIMATION_START',                   // 推演主页面
  SM_MAP_PLOT_ANIMATION_NODE_CREATE: 'SM_MAP_PLOT_ANIMATION_NODE_CREATE',       // 推演创建/修改动画
  SM_MAP_PLOT_ANIMATION_PLAY: 'SM_MAP_PLOT_ANIMATION_PLAY',                     // 推演播放
  SM_MAP_PLOT_ANIMATION_GO_OBJECT_LIST: 'SM_MAP_PLOT_ANIMATION_GO_OBJECT_LIST', // 推演动画的节点对象列表
  SM_MAP_PLOT_ANIMATION_XML_LIST: 'SM_MAP_PLOT_ANIMATION_XML_LIST',             // 推演动画的xml列表
  SM_MAP_PLOT_ANIMATION_WAY: 'SM_MAP_PLOT_ANIMATION_WAY',                       // 推演创建路线
}

/** 分析模块 **/
const MAP_ANALYSIS_CONST = {
  SM_MAP_ANALYSIS: 'SM_MAP_ANALYSIS',                                               // 分析模块，模块类型
  SM_MAP_ANALYSIS_BUFFER_ANALYSIS: 'SM_MAP_ANALYSIS_BUFFER_ANALYSIS',               // 缓冲分析
  SM_MAP_ANALYSIS_OVERLAY_ANALYSIS: 'SM_MAP_ANALYSIS_OVERLAY_ANALYSIS',             // 叠加分析
  SM_MAP_ANALYSIS_ONLINE_ANALYSIS: 'SM_MAP_ANALYSIS_ONLINE_ANALYSIS',               // 在线分析
  SM_MAP_ANALYSIS_OPTIMAL_PATH: 'SM_MAP_ANALYSIS_OPTIMAL_PATH',                     // 路径分析
  SM_MAP_ANALYSIS_CONNECTIVITY_ANALYSIS: 'SM_MAP_ANALYSIS_CONNECTIVITY_ANALYSIS',   // 连通性分析
  SM_MAP_ANALYSIS_FIND_TSP_PATH: 'SM_MAP_ANALYSIS_FIND_TSP_PATH',                   // 商旅分析
  SM_MAP_ANALYSIS_THIESSEN_POLYGON: 'SM_MAP_ANALYSIS_THIESSEN_POLYGON',             // 泰森分析
  SM_MAP_ANALYSIS_MEASURE_DISTANCE: 'SM_MAP_ANALYSIS_MEASURE_DISTANCE',             // 距离分析
  SM_MAP_ANALYSIS_INTERPOLATION_ANALYSIS: 'SM_MAP_ANALYSIS_INTERPOLATION_ANALYSIS', // 插值分析
}

/** 处理模块 **/
const MAP_PROCESS_CONST = {
  SM_MAP_PROCESS: 'SM_MAP_PROCESS',                                                 // 分析处理，模块类型
}

/** 图层设置 **/
const LAYER_SETTING_CONST = {
  SM_MAP_LAYER_SETTING_IMAGE: 'SM_MAP_LAYER_SETTING_IMAGE',                           // 图层设置，模块类型
  SM_MAP_LAYER_SETTING_IMAGE_MENU: 'SM_MAP_LAYER_SETTING_IMAGE_MENU',                 // 展示图层设置
  SM_MAP_LAYER_SETTING_IMAGE_STRETCH_TYPE: 'SM_MAP_LAYER_SETTING_IMAGE_STRETCH_TYPE', // 拉伸方式
  SM_MAP_LAYER_SETTING_IMAGE_DISPLAY_MODE: 'SM_MAP_LAYER_SETTING_IMAGE_DISPLAY_MODE', // 显示模式
}

/** 三维标注 **/
const MAP3D_MARK_CONST = {
  SM_MAP3D_MARK: 'SM_MAP3D_MARK',                                  // 三维标注，模块类型
  SM_MAP3D_MARK_POINT: 'SM_MAP3D_MARK_POINT',                      // 三维标注点
  SM_MAP3D_MARK_TEXT: 'SM_MAP3D_MARK_TEXT',                        // 三维标注文字
  SM_MAP3D_MARK_POINT_LINE: 'SM_MAP3D_MARK_POINT_LINE',            // 三维标注线
  SM_MAP3D_MARK_POINT_SURFACE: 'SM_MAP3D_MARK_POINT_SURFACE',      // 三维标注面
}

/** 三维工具 **/
const MAP3D_TOOL_CONST = {
  SM_MAP3D_TOOL: 'SM_MAP3D_TOOL',                                  // 三维工具，模块类型
  SM_MAP3D_TOOL_DISTANCE_MEASURE: 'SM_MAP3D_TOOL_DISTANCE_MEASURE',  // 三维距离量算
  SM_MAP3D_TOOL_SURFACE_MEASURE: 'SM_MAP3D_TOOL_SURFACE_MEASURE',  // 三维面积量算
  SM_MAP3D_TOOL_HEIGHT_MEASURE: 'SM_MAP3D_TOOL_HEIGHT_MEASURE',      // 三维高度脸酸
  // SM_MAP3D_TOOL_SELECTION: 'SM_MAP3D_TOOL_SELECTION',
  // SM_MAP3D_TOOL_BOXTAILOR: 'SM_MAP3D_TOOL_BOXTAILOR',
  // SM_MAP3D_TOOL_PSTAILOR: 'SM_MAP3D_TOOL_PSTAILOR',
  // SM_MAP3D_TOOL_CROSSTAILOR: 'SM_MAP3D_TOOL_CROSSTAILOR',
  // SM_MAP3D_LEVEL: 'SM_MAP3D_TOOL_LEVEL',
  SM_MAP3D_TOOL_SELECT: 'SM_MAP3D_TOOL_SELECT',                    // 三维点选

  // 三维裁剪
  SM_MAP3D_TOOL_BOX_CLIP: 'SM_MAP3D_TOOL_BOX_CLIP',                // 三维BOX裁剪
  SM_MAP3D_TOOL_PLANE_CLIP: 'SM_MAP3D_TOOL_PLANE_CLIP',            // 三维PLANE裁剪
  SM_MAP3D_TOOL_CROSS_CLIP: 'SM_MAP3D_TOOL_CROSS_CLIP',            // 三维CROSS裁剪
  SM_MAP3D_TOOL_CLIP_SHOW: 'SM_MAP3D_TOOL_CLIP_SHOW',              // 三维裁剪菜单展开状态
  SM_MAP3D_TOOL_CLIP_HIDDEN: 'SM_MAP3D_TOOL_CLIP_HIDDEN',          // 三维裁剪菜单隐藏状态
  SM_MAP3D_TOOL_BOX_CLIPPING: 'SM_MAP3D_TOOL_BOX_CLIPPING',        // 三维BOX裁剪 裁剪中状态
  SM_MAP3D_TOOL_BOX_CLIP_IN: 'SM_MAP3D_TOOL_BOX_CLIP_IN',          // 裁剪区域内
  SM_MAP3D_TOOL_BOX_CLIP_OUT: 'SM_MAP3D_TOOL_BOX_CLIP_OUT',        // 裁剪区域外
  SM_MAP3D_TOOL_CIRCLE_FLY: 'SM_MAP3D_TOOL_CIRCLE_FLY',            // 三维绕点飞行
}

/** 三维飞行 **/
const MAP3D_FLY_CONST = {
  SM_MAP3D_FLY: 'SM_MAP3D_FLY',              // 播放飞行轨迹，模块类型
  SM_MAP3D_FLY_NEW: 'SM_MAP3D_FLY_NEW',      // 新建飞行轨迹
  SM_MAP3D_FLY_LIST: 'SM_MAP3D_FLY_LIST',    // 获取飞行轨迹列表
}

/** 三维图层 **/
const MAP3D_LAYER3D_CONST = {
  SM_MAP3D_LAYER3D_BASE: 'SM_MAP3D_LAYER3D_BASE',                         // 3d底图
  SM_MAP3D_LAYER3D_DEFAULT: 'SM_MAP3D_LAYER3D_DEFAULT',                   // 3d默认图层
  SM_MAP3D_LAYER3D_DEFAULT_SELECTED: 'SM_MAP3D_LAYER3D_DEFAULT_SELECTED', // 3d默认图层，被选中
  SM_MAP3D_LAYER3D_IMAGE: 'SM_MAP3D_LAYER3D_IMAGE',                       // 3d影像图层
  SM_MAP3D_LAYER3D_TERRAIN: 'SM_MAP3D_LAYER3D_TERRAIN',                   // 3d地形图层
}

/** 风格模块 **/
const MAP_STYLE_CONST = {
  SM_MAP_STYLE: 'SM_MAP_STYLE',                                         // 风格，模块类型
  SM_MAP_STYLE_GRID: 'SM_MAP_STYLE_GRID',                               // 栅格风格
  SM_MAP_STYLE_LINE_COLOR: 'SM_MAP_STYLE_LINE_COLOR',                   // 线颜色
  SM_MAP_STYLE_POINT_COLOR: 'SM_MAP_STYLE_POINT_COLOR',                 // 点颜色
  SM_MAP_STYLE_REGION_BEFORE_COLOR: 'SM_MAP_STYLE_REGION_BEFORE_COLOR', // 面前景色
  SM_MAP_STYLE_REGION_BORDER_COLOR: 'SM_MAP_STYLE_REGION_BORDER_COLOR', // 面边框色
  SM_MAP_STYLE_REGION_AFTER_COLOR: 'SM_MAP_STYLE_REGION_AFTER_COLOR',   // 面背景色
  SM_MAP_STYLE_TEXT_COLOR: 'SM_MAP_STYLE_TEXT_COLOR',                   // 文字颜色
  SM_MAP_STYLE_TEXT_FONT: 'SM_MAP_STYLE_TEXT_FONT',                     // 文字字体
}

/** 工具模块 **/
const MAP_TOOL_CONST = {
  SM_MAP_TOOL: 'SM_MAP_TOOL',                                                         // 工具模块，模块类型
  SM_MAP_TOOL_POINT_SELECT: 'SM_MAP_TOOL_POINT_SELECT',                               // 点选
  SM_MAP_TOOL_SELECT_BY_RECTANGLE: 'SM_MAP_TOOL_SELECT_BY_RECTANGLE',                 // 框选
  SM_MAP_TOOL_MEASURE_LENGTH: 'SM_MAP_TOOL_MEASURE_LENGTH',                           // 量算长度
  SM_MAP_TOOL_MEASURE_AREA: 'SM_MAP_TOOL_MEASURE_AREA',                               // 量算面积
  SM_MAP_TOOL_MEASURE_ANGLE: 'SM_MAP_TOOL_MEASURE_ANGLE',                             // 量算角度
  SM_MAP_TOOL_RECTANGLE_CUT: 'SM_MAP_TOOL_RECTANGLE_CUT',                             // 矩形裁剪
  SM_MAP_TOOL_ATTRIBUTE_RELATE: 'SM_MAP_TOOL_ATTRIBUTE_RELATE',                       // 属性关联
  SM_MAP_TOOL_ATTRIBUTE_SELECTION_RELATE: 'SM_MAP_TOOL_ATTRIBUTE_SELECTION_RELATE',   // 框选属性关联
  SM_MAP_TOOL_STYLE_TRANSFER: 'SM_MAP_TOOL_STYLE_TRANSFER',                           // 智能配图
  SM_MAP_TOOL_STYLE_TRANSFER_PICKER: 'SM_MAP_TOOL_STYLE_TRANSFER_PICKER',             // 智能配图属性选择器
}

/** 采集模块 **/
const MAP_COLLECTION_CONST = {
  SM_MAP_COLLECTION: 'SM_MAP_COLLECTION',                                  // 采集模块，模块类型
  SM_MAP_COLLECTION_SYMBOL: 'SM_MAP_COLLECTION_SYMBOL',                    // 符号库（采集/标绘）
  SM_MAP_COLLECTION_POINT: 'SM_MAP_COLLECTION_POINT',                      // 采集点
  SM_MAP_COLLECTION_LINE: 'SM_MAP_COLLECTION_LINE',                        // 采集线
  SM_MAP_COLLECTION_REGION: 'SM_MAP_COLLECTION_REGION',                    // 采集面
  SM_MAP_COLLECTION_TEMPLATE_CREATE: 'SM_MAP_COLLECTION_TEMPLATE_CREATE',  // 采集模板创建/修改
}

/** 添加模块 **/
const MAP_ADD_CONST = {
  SM_MAP_ADD: 'SM_MAP_ADD',                                 // 添加模块，模块类型
  SM_MAP_ADD_SYMBOL_PATH: 'SM_MAP_ADD_SYMBOL_PATH',         // 根据路径获取本地符号树状列表
  SM_MAP_ADD_SYMBOL_SYMBOLS: 'SM_MAP_ADD_SYMBOL_SYMBOLS',   // 根据文件路径获取符号
  SM_MAP_ADD_DATASET: 'SM_MAP_ADD_DATASET',                 // 展示数据集列表
}

/** 开始模块 **/
const MAP_START_CONST = {
  SM_MAP_START: 'SM_MAP_START',                             // 开始模块，模块类型
  SM_MAP_START_TEMPLATE: 'SM_MAP_START_TEMPLATE',           // 打开模板
  SM_MAP_START_CHANGE: 'SM_MAP_START_CHANGE',               // 切换地图
}

/** 三维开始模块 **/
const MAP3D_START_CONST = {
  SM_MAP3D_START: 'SM_MAP3D_START',                         // 三维开始模块，模块类型
}

/** MAP_AR视频地图模块 **/
const MAP_AR_CONST = {
  SM_MAP_AR_MEASURE: 'SM_MAP_AR_MEASURE',                   // AR量算
  SM_MAP_AR_TOOL: 'SM_MAP_AR_TOOL',                         // AR工具
  SM_MAP_AR_EFFECT: 'SM_MAP_AR_EFFECT',                     // AR特效
  SM_MAP_AR_MAPPING: 'SM_MAP_AR_MAPPING',                   // AR测图
  SM_MAP_AR_ANALYSIS: 'SM_MAP_AR_ANALYSIS',                 // AR分析
  SM_MAP_AR_ANALYSIS_DETECT: 'SM_MAP_AR_ANALYSIS_DETECT',   // AR目标检测
}

/** 二维分享 **/
const MAP_SHARE_CONST = {
  SM_MAP_SHARE: 'SM_MAP_SHARE',
}

/** 三维分享 **/
const MAP3D_SHARE_CONST = {
  SM_MAP3D_SHARE: 'SM_MAP3D_SHARE',
}

/** 三维未分类的常量 **/
const MAP3D_CONST = {
  SM_MAP3D_BASE: 'SM_MAP3D_BASE',
  SM_MAP3D_ADD_LAYER: 'SM_MAP3D_ADD_LAYER',
  SM_MAP3D_ATTRIBUTE: 'SM_MAP3D_ATTRIBUTE',
  SM_MAP3D_WORKSPACE_LIST: 'SM_MAP3D_WORKSPACE_LIST',
  SM_MAP3D_IMPORTWORKSPACE: 'SM_MAP3D_IMPORTWORKSPACE',
}

/** 自定义颜色选择 RGB/色盘 弹出框 **/
const MAP_COLOR_CONST = {
  SM_MAP_COLOR_PICKER: 'SM_MAP_COLOR_PICKER',
}

// TODO LayerManager Toolbar常量，待移除
/** 图层页面Toolbar的常量 **/
const LAYER_TOOLBAR_CONST = {
  // 地图底图切换常量
  SM_MAP_LAYER_BASE_CHANGE: 'SM_MAP_LAYER_BASE_CHANGE',      // 选择底图
  SM_MAP_LAYER_NAVIGATION: 'SM_MAP_LAYER_NAVIGATION',        // 导航模块-图层-更多
  SM_MAP_LAYER_THEME_CREATE: 'SM_MAP_LAYER_THEME_CREATE',    // 专题-普通图层-更多
  SM_MAP_LAYER_THEME_MODIFY: 'SM_MAP_LAYER_THEME_MODIFY',    // 专题-专题图层-更多
  SM_MAP_LAYER_BASE_DEFAULT: 'SM_MAP_LAYER_BASE_DEFAULT',    // 图层-我的底图-更多
}

/** MAP_AR三维管线 **/
const SM_ARSCENEMODULE_CONST = {
  /** 三维AR管线界面菜单 **/
  SM_ARSCENEMODULE: 'SM_ARSCENEMODULE',
  /** 三维AR管线风格菜单 **/
  SM_ARSCENEMODULE_modify_style: 'SM_ARSCENEMODULE_modify_style',
  /** 三维AR管线模型切换 **/
  SM_ARSCENEMODULE_CHANGE: 'SM_ARSCENEMODULE_CHANGE',
  /** 三维AR管线工作空间切换 **/
  SM_ARSCENEMODULE_WORKSPACE: 'SM_ARSCENEMODULE_WORKSPACE',
  /** 三维AR管线位置调整 **/
  SM_ARSCENEMODULE_TransLation: 'SM_ARSCENEMODULE_TransLation',
  /** 三维AR管线角度调整 **/
  SM_ARSCENEMODULE_Rotation: 'SM_ARSCENEMODULE_Rotation',
  /** 三维AR管线模型比例调整 **/
  SM_ARSCENEMODULE_Scale: 'SM_ARSCENEMODULE_Scale',
  /** 三维AR管线添加场景前初始界面 **/
  SM_ARSCENEMODULE_NOMAL: 'SM_ARSCENEMODULE_NOMAL',
}

/** 三维分享 **/
const MAP_BASE_CONST = {
  SM_MAP_BASE_CHANGE: 'SM_BASE_MAP_CHANGE',
}

/** 数据服务 **/
const MAP_SERVICE_CONST = {
  SM_MAP_SERVICE: 'SM_MAP_SERVICE',
  SM_MAP_SERVICE_LIST: 'SM_MAP_SERVICE_LIST',
  SM_MAP_SERVICE_DATASOURCE: 'SM_MAP_SERVICE_DATASOURCE',
  SM_MAP_SERVICE_DATASET: 'SM_MAP_SERVICE_DATASET',
}

/** AR制图 **/
const AR_DRAWING_CONST = {
  SM_AR_DRAWING: 'SM_AR_DRAWING',
  SM_AR_DRAWING_POI: 'SM_AR_DRAWING_POI',
  SM_AR_DRAWING_EFFECT: 'SM_AR_DRAWING_EFFECT',
  SM_AR_DRAWING_MODEL: 'SM_AR_DRAWING_MODEL',
  SM_AR_DRAWING_VECTOR: 'SM_AR_DRAWING_VECTOR',
  SM_AR_DRAWING_3D: 'SM_AR_DRAWING_3D',

  SM_AR_DRAWING_IMAGE: 'SM_AR_DRAWING_IMAGE',
  SM_AR_DRAWING_VIDEO: 'SM_AR_DRAWING_VIDEO',
  SM_AR_DRAWING_WEB: 'SM_AR_DRAWING_WEB',
  SM_AR_DRAWING_SCENE: 'SM_AR_DRAWING_SCENE',
  // SM_AR_DRAWING_PIPELINE: 'SM_AR_DRAWING_PIPELINE',
  // SM_AR_DRAWING_TERRAIN: 'SM_AR_DRAWING_TERRAIN',
  SM_AR_DRAWING_MODAL: 'SM_AR_DRAWING_MODAL',
  SM_AR_DRAWING_POINT: 'SM_AR_DRAWING_POINT',
  SM_AR_DRAWING_LINE: 'SM_AR_DRAWING_LINE',
  SM_AR_DRAWING_REGION: 'SM_AR_DRAWING_REGION',
  SM_AR_DRAWING_SUBSTANCE: 'SM_AR_DRAWING_SUBSTANCE',
  SM_AR_DRAWING_TEXT: 'SM_AR_DRAWING_TEXT',
  SM_AR_DRAWING_SAND: 'SM_AR_DRAWING_SAND',
  SM_AR_DRAWING_D_MODAL: 'SM_AR_DRAWING_D_MODAL',

  /** AR打点添加 **/
  SM_AR_DRAWING_ADD_POINT: 'SM_AR_DRAWING_ADD_POINT',
}

const AR_START_CONST = {
  SM_AR_START: 'SM_AR_START',
  SM_AR_START_OPEN_MAP: 'SM_AR_START_OPEN_MAP',
  SM_AR_START_SAVE: 'SM_AR_START_SAVE',
  SM_AR_START_CLOSE_MAP: 'SM_AR_START_CLOSE_MAP',
}

const AR_EDIT_CONST = {
  SM_AR_EDIT: 'SM_AR_EDIT',
  SM_AR_EDIT_ROTATION: 'SM_AR_EDIT_ROTATION',
  SM_AR_EDIT_POSITION: 'SM_AR_EDIT_POSITION',
  SM_AR_EDIT_SCALE: 'SM_AR_EDIT_SCALE',

  SM_AR_EDIT_ANIMATION: 'SM_AR_EDIT_ANIMATION',
  SM_AR_EDIT_ANIMATION_TYPE: 'SM_AR_EDIT_ANIMATION_TYPE',
  SM_AR_EDIT_ANIMATION_TRANSLATION: 'SM_AR_EDIT_ANIMATION_TRANSLATION',
  SM_AR_EDIT_ANIMATION_TRANSLATION_DIRECTION: 'SM_AR_EDIT_ANIMATION_TRANSLATION_DIRECTION',
  SM_AR_EDIT_ANIMATION_TRANSLATION_DISTANCE: 'SM_AR_EDIT_ANIMATION_TRANSLATION_DISTANCE',
  SM_AR_EDIT_ANIMATION_ROTATION: 'SM_AR_EDIT_ANIMATION_ROTATION',
  SM_AR_EDIT_ANIMATION_ROTATION_AXIS: 'SM_AR_EDIT_ANIMATION_ROTATION_AXIS',
  SM_AR_EDIT_ANIMATION_ROTATION_DIRECTION: 'SM_AR_EDIT_ANIMATION_ROTATION_DIRECTION',
}

const AR_STYLE_CONST = {
  SM_AR_STYLE: 'SM_AR_STYLE',
  SM_AR_STYLE_TRANSFROM: 'SM_AR_STYLE_TRANSFROM',
  SM_AR_STYLE_BORDER_COLOR: 'SM_AR_STYLE_BORDER_COLOR',
  SM_AR_STYLE_BORDER_WIDTH: 'SM_AR_STYLE_BORDER_WIDTH',
  SM_AR_STYLE_EFFECT: 'SM_AR_STYLE_EFFECT',

  // 文字样式
  SM_AR_STYLE_TEXT: 'SM_AR_STYLE_TEXT',
  SM_AR_STYLE_TEXT_OPACITY: 'SM_AR_STYLE_TEXT_OPACITY',
  SM_AR_STYLE_TEXT_COLOR: 'SM_AR_STYLE_TEXT_COLOR',
  SM_AR_STYLE_TEXT_SIZE: 'SM_AR_STYLE_TEXT_SIZE',
  SM_AR_STYLE_BACKGROUND_OPACITY: 'SM_AR_STYLE_BACKGROUND_OPACITY',
  SM_AR_STYLE_BACKGROUND_COLOR: 'SM_AR_STYLE_BACKGROUND_COLOR',
}

export default {
  ...LEGEND_CONST,
  ...NAVIGATION_CONST,
  ...MAP_SETTINGS_CONST,
  ...MAP_MARKS_CONST,
  ...TOUCHPROGRESS_CONST,
  ...MAP_START_CONST,
  ...MAP_ADD_CONST,
  ...MAP_EDIT_CONST,
  ...MAP_THEME_CONST,
  ...MAP_STYLE_CONST,
  ...MAP_TOOL_CONST,
  ...MAP_COLLECTION_CONST,
  ...PLOT_ANIMATION_CONST,
  ...MAP_ANALYSIS_CONST,
  ...MAP_PROCESS_CONST,
  ...LAYER_SETTING_CONST,
  ...MAP_LAYER_VISIBLE_CONST,
  ...MAP_AR_CONST,
  ...MAP_SHARE_CONST,

  ...MAP3D_CONST,
  ...MAP3D_START_CONST,
  ...MAP3D_MARK_CONST,
  ...MAP3D_TOOL_CONST,
  ...MAP3D_FLY_CONST,
  ...MAP3D_LAYER3D_CONST,
  ...MAP3D_SHARE_CONST,

  ...MAP_COLOR_CONST,
  ...LAYER_TOOLBAR_CONST,

  ...SM_ARSCENEMODULE_CONST,
  ...MAP_BASE_CONST,
  ...MAP_SERVICE_CONST,

  ...AR_DRAWING_CONST,
  ...AR_START_CONST,
  ...AR_EDIT_CONST,
  ...AR_STYLE_CONST,

  ...AR_DRAWING_CONST,

  SM_MAP_MEDIA: 'SM_MAP_MEDIA',

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
