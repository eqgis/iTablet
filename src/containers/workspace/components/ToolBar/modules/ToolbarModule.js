import SMap from 'imobile_for_reactnative/NativeModule/interfaces/mapping/SMap'
import { ConstToolType } from '../../../../../constants'
import ToolbarBtnType from '../ToolbarBtnType'
import { getLanguage } from '../../../../../language'
import {
  startModule,
  start3DModule,
  styleModule,
  toolModule,
  shareModule,
  share3DModule,
  themeModule,
  collectionModule,
  editModule,
  analysisModule,
  plotModule,
  fly3DModule,
  tool3DModule,
  legendModule,
  aiModule,
  mapSettingModule,
  markModule,
  mark3DModule,
  incrementModule,
  themeColorPickerModule,
  topoEditModule,
  layerVisibleScaleModule,
} from '../modules'

// 更新类中的数据
// function setParams(params) {
//   // _params = params
//   CollectionData.setParams(params)
//   PlotData.setParams(params)
//   StartData.setParams(params)
//   ShareData.setParams(params)
//   MoreData.setParams(params)
//   Map3DData.setParams(params)
// }

let _params = {} // 外部数据和方法 Toolbar props
let _data = {} // 临时数据

function setParams(params = {}) {
  _params = params
}

function addParams(params = {}) {
  Object.assign(_params, params)
}

function getParams() {
  return _params
}

function setData(data = {}) {
  _data = data
}

function addData(data = {}) {
  Object.assign(_data, data)
}

function getData() {
  return _data
}

/**
 * 获取Toolbar内容数据和底部对应按钮
 * @param type
 * @param params
 * @returns {Promise.<{data, buttons}>}
 */
async function getToolBarData(type, params = {}) {
  let toolBarData = {
    data: [],
    buttons: [],
  }

  if (
    type === ConstToolType.MAP_SYMBOL ||
    type === ConstToolType.MAP_COLLECTION_POINT ||
    type === ConstToolType.MAP_COLLECTION_LINE ||
    type === ConstToolType.MAP_COLLECTION_REGION
  ) {
    toolBarData = collectionModule().getData(type, params)
  } else if (type === ConstToolType.MAP_START) {
    toolBarData = startModule().getData(type, params)
  } else if (type === ConstToolType.MAP_3D_START) {
    toolBarData = start3DModule().getData(type, params)
  } else if (
    type === ConstToolType.MAP_STYLE ||
    type === ConstToolType.GRID_STYLE ||
    type === ConstToolType.LINECOLOR_SET ||
    type === ConstToolType.POINTCOLOR_SET ||
    type === ConstToolType.TEXTCOLOR_SET ||
    type === ConstToolType.REGIONBEFORECOLOR_SET ||
    type === ConstToolType.REGIONBORDERCOLOR_SET ||
    type === ConstToolType.REGIONAFTERCOLOR_SET ||
    type === ConstToolType.TEXTFONT
  ) {
    toolBarData = styleModule().getData(type, params)
  } else if (
    typeof type === 'string' &&
    type.indexOf(ConstToolType.MAP_TOOL) > -1
  ) {
    toolBarData = toolModule().getData(type, params)
  } else if (type === ConstToolType.MAP_SHARE) {
    toolBarData = shareModule().getData(type, params)
  } else if (type === ConstToolType.MAP_SHARE_MAP3D) {
    toolBarData = share3DModule().getData(type, params)
  } else if (typeof type === 'string' && type.indexOf('MAP_THEME') > -1) {
    toolBarData = themeModule().getData(type, params)
  } else if (typeof type === 'string' && type.indexOf('MAP_EDIT_') > -1) {
    toolBarData = editModule().getData(type, params)
  } else if (typeof type === 'string' && type.indexOf('MAP_TOPO_') > -1) {
    toolBarData = topoEditModule(type).getData(type) //无action的module 先传type设置数据
  } else if (
    typeof type === 'string' &&
    type.indexOf(ConstToolType.MAP_ANALYSIS) > -1
  ) {
    toolBarData = analysisModule().getData(type, params)
  } else if (
    type === ConstToolType.PLOT_ANIMATION_START ||
    type === ConstToolType.PLOT_ANIMATION_NODE_CREATE ||
    type === ConstToolType.PLOT_ANIMATION_PLAY ||
    type === ConstToolType.PLOT_ANIMATION_GO_OBJECT_LIST ||
    type === ConstToolType.PLOT_ANIMATION_WAY ||
    type === ConstToolType.PLOT_ANIMATION_XML_LIST
  ) {
    toolBarData = plotModule().getData(type, params)
  } else if (typeof type === 'string' && type.indexOf('MAP_INCREMENT_') > -1) {
    toolBarData = incrementModule().getData(type)
  } else if (
    type === ConstToolType.MAP3D_MARK ||
    type === ConstToolType.MAP3D_SYMBOL_POINT ||
    type === ConstToolType.MAP3D_SYMBOL_TEXT ||
    type === ConstToolType.MAP3D_SYMBOL_POINTLINE ||
    type === ConstToolType.MAP3D_SYMBOL_POINTSURFACE
  ) {
    toolBarData = mark3DModule().getData(type, params)
  } else if (
    type === ConstToolType.MAP3D_TOOL_FLYLIST ||
    type === ConstToolType.MAP3D_TOOL_NEWFLY
  ) {
    toolBarData = await fly3DModule().getData(type, params)
  } else if (typeof type === 'string' && type.indexOf('MAP3D_') > -1) {
    toolBarData = await tool3DModule().getData(type, params)
  } else if (typeof type === 'string' && type.indexOf('LEGEND') > -1) {
    toolBarData = legendModule().getData(type, params)
  } else if (type === ConstToolType.MAP_PLOTTING_ANIMATION_ITEM) {
    toolBarData = getPlotAnimationData(type)
  } else if (type === ConstToolType.MAP_AR_AI_ASSISTANT) {
    toolBarData = await aiModule().getData(type, params)
  } else if (
    type === ConstToolType.MAP_BACKGROUND_COLOR ||
    type === ConstToolType.MAP_COLOR_MODE
  ) {
    toolBarData = mapSettingModule().getData(type)
  } else if (
    typeof type === 'string' &&
    type.indexOf(ConstToolType.MAP_MARKS) > -1
  ) {
    toolBarData = markModule().getData(type, params)
  } else if (type === ConstToolType.MAP_COLOR_PICKER) {
    toolBarData = themeColorPickerModule().getData(type, params)
  } else if (
    type === ConstToolType.MAP_LAYER_VISIBLE_SCALE ||
    type === ConstToolType.MAP_LAYER_VISIBLE_USER_DEFINE
  ) {
    toolBarData = layerVisibleScaleModule().getData(type, params)
  }
  return toolBarData
}

async function setToolBarData(type, params = {}) {
  let toolBarData
  if (
    type === ConstToolType.MAP_SYMBOL ||
    type === ConstToolType.MAP_COLLECTION_POINT ||
    type === ConstToolType.MAP_COLLECTION_LINE ||
    type === ConstToolType.MAP_COLLECTION_REGION
  ) {
    toolBarData = collectionModule()
  } else if (type === ConstToolType.MAP_START) {
    toolBarData = startModule()
  } else if (type === ConstToolType.MAP_3D_START) {
    toolBarData = start3DModule()
  } else if (
    type === ConstToolType.MAP_STYLE ||
    type === ConstToolType.GRID_STYLE ||
    type === ConstToolType.LINECOLOR_SET ||
    type === ConstToolType.POINTCOLOR_SET ||
    type === ConstToolType.TEXTCOLOR_SET ||
    type === ConstToolType.REGIONBEFORECOLOR_SET ||
    type === ConstToolType.REGIONBORDERCOLOR_SET ||
    type === ConstToolType.REGIONAFTERCOLOR_SET ||
    type === ConstToolType.TEXTFONT
  ) {
    toolBarData = styleModule()
  } else if (
    typeof type === 'string' &&
    (type.indexOf(ConstToolType.MAP_TOOL) > -1 ||
      type === ConstToolType.MAP_TOOL_STYLE_TRANSFER)
  ) {
    toolBarData = toolModule()
  } else if (typeof type === 'string' && type.indexOf('MAP_INCREMENT_') > -1) {
    toolBarData = incrementModule()
  } else if (type === ConstToolType.MAP_SHARE) {
    toolBarData = shareModule()
  } else if (type === ConstToolType.MAP_SHARE_MAP3D) {
    toolBarData = share3DModule()
  } else if (typeof type === 'string' && type.indexOf('MAP_THEME') > -1) {
    toolBarData = themeModule()
  } else if (typeof type === 'string' && type.indexOf('MAP_EDIT_') > -1) {
    toolBarData = editModule()
  } else if (typeof type === 'string' && type.indexOf('MAP_TOPO_') > -1) {
    toolBarData = topoEditModule(type)
  } else if (
    typeof type === 'string' &&
    type.indexOf(ConstToolType.MAP_ANALYSIS) > -1
  ) {
    toolBarData = analysisModule()
  } else if (
    type === ConstToolType.PLOT_ANIMATION_START ||
    type === ConstToolType.PLOT_ANIMATION_NODE_CREATE ||
    type === ConstToolType.PLOT_ANIMATION_PLAY ||
    type === ConstToolType.PLOT_ANIMATION_GO_OBJECT_LIST ||
    type === ConstToolType.PLOT_ANIMATION_WAY ||
    type === ConstToolType.PLOT_ANIMATION_XML_LIST
  ) {
    toolBarData = plotModule()
  } else if (
    type === ConstToolType.MAP3D_TOOL_FLYLIST ||
    type === ConstToolType.MAP3D_TOOL_NEWFLY
  ) {
    toolBarData = await fly3DModule()
  } else if (
    (typeof type === 'string' && type.indexOf('MAP3D_') > -1) ||
    type === ConstToolType.MAP3D_BOX_CLIPPING ||
    type === ConstToolType.MAP3D_BOX_CLIP
  ) {
    toolBarData = await tool3DModule()
  } else if (typeof type === 'string' && type.indexOf('LEGEND') > -1) {
    toolBarData = legendModule().getData(type, params)
  } else if (type === ConstToolType.MAP_PLOTTING_ANIMATION_ITEM) {
    toolBarData = getPlotAnimationData(type)
  } else if (type === ConstToolType.MAP_AR_AI_ASSISTANT) {
    toolBarData = await aiModule()
  } else if (
    type === ConstToolType.MAP_BACKGROUND_COLOR ||
    type === ConstToolType.MAP_COLOR_MODE
  ) {
    toolBarData = mapSettingModule()
  } else if (
    typeof type === 'string' &&
    type.indexOf(ConstToolType.MAP_MARKS) > -1
  ) {
    toolBarData = markModule()
  } else if (type === ConstToolType.MAP_COLOR_PICKER) {
    toolBarData = themeColorPickerModule()
  } else if (
    type === ConstToolType.MAP_LAYER_VISIBLE_SCALE ||
    type === ConstToolType.MAP_LAYER_VISIBLE_USER_DEFINE
  ) {
    toolBarData = layerVisibleScaleModule()
  }
  // else {
  //   toolBarData = mapModule().getData(type)
  //
  //   setData({
  //     type: type,
  //     getData: mapModule().getData,
  //     actions: mapModule().actions,
  //   })
  // }
  if (toolBarData && toolBarData.setModuleData) {
    toolBarData.setModuleData(type)
  }
}

/**
 * 获取菜单弹框数据
 * @param type
 * @param others {themeType}
 * @returns {Array}
 */
function getMenuDialogData(type, ...others) {
  let data = []
  switch (type) {
    case ConstToolType.MAP_TOOL_STYLE_TRANSFER:
    case ConstToolType.MAP_TOOL_TAGGING_STYLE_POINT:
    case ConstToolType.MAP_TOOL_TAGGING_STYLE_LINE:
    case ConstToolType.MAP_TOOL_TAGGING_STYLE_REGION:
    case ConstToolType.MAP_TOOL_TAGGING_STYLE_TEXT:
    case ConstToolType.MAP_TOOL_TAGGING_STYLE_POINT_COLOR_SET:
    case ConstToolType.MAP_TOOL_TAGGING_STYLE_LINE_COLOR_SET:
    case ConstToolType.MAP_TOOL_TAGGING_STYLE_REGION_FORECOLOR_SET:
    case ConstToolType.MAP_TOOL_TAGGING_STYLE_REGION_BOARDERCOLOR_SET:
    case ConstToolType.MAP_TOOL_TAGGING_STYLE_TEXT_FONT:
    case ConstToolType.MAP_TOOL_TAGGING_STYLE_TEXT_COLOR_SET:
      data = toolModule().getMenuData(type)
      break
    case ConstToolType.MAP_STYLE:
    case ConstToolType.GRID_STYLE:
    case ConstToolType.LINECOLOR_SET:
    case ConstToolType.POINTCOLOR_SET:
    case ConstToolType.REGIONBEFORECOLOR_SET:
    case ConstToolType.REGIONAFTERCOLOR_SET:
    case ConstToolType.REGIONBORDERCOLOR_SET:
    case ConstToolType.TEXTCOLOR_SET:
    case ConstToolType.TEXTFONT:
      data = styleModule().getMenuData(type)
      break
    case ConstToolType.LEGEND:
    case ConstToolType.LEGEND_POSITION:
      data = legendModule().getMenuData(type)
      break
    case ConstToolType.MAP_COLOR_MODE:
    case ConstToolType.MAP_BACKGROUND_COLOR:
      data = mapSettingModule.getMenuData(type)
  }
  if (data.length === 0 && type.indexOf('MAP_THEME_PARAM') >= 0) {
    data = themeModule().getMenuData(type, ...others)
  }
  return data
}

function getPlotAnimationData(type) {
  let data = []
  let buttons = []
  // if (type.indexOf('MAP3D_') === -1) return { data, buttons }
  switch (type) {
    case ConstToolType.MAP_PLOTTING_ANIMATION_ITEM:
      data = [
        {
          key: 'startFly',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_START,
          // '开始飞行',
          action: async () => {
            await SMap.animationPlay()
          },
          size: 'large',
          image: require('../../../../../assets/mapEdit/icon_play.png'),
          selectedImage: require('../../../../../assets/mapEdit/icon_play.png'),
        },
        {
          key: 'stop',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_PAUSE,
          // '暂停',
          action: () => {
            SMap.animationPause()
          },
          size: 'large',
          image: require('../../../../../assets/mapEdit/icon_stop.png'),
          selectedImage: require('../../../../../assets/mapEdit/icon_stop.png'),
          // selectMode:"flash"
        },
      ]
      buttons = [ToolbarBtnType.END_ANIMATION]
      break
  }
  return { data, buttons }
}

export default {
  setParams,
  addParams,
  getParams,

  setData,
  addData,
  getData,

  getToolBarData,
  setToolBarData,
  getMenuDialogData,
}
