import SMap from 'imobile_for_reactnative/NativeModule/interfaces/mapping/SMap'
import { ConstToolType } from '../../../../../constants'
import ToolbarBtnType from '../ToolbarBtnType'
import { getLanguage } from '../../../../../language'
import { screen } from '../../../../../utils'
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
import mapFunctionModules from '../../../../../../configs/mapFunctionModules'
import ToolBarHeight from './ToolBarHeight'

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

/** 获取Toolbar 高度、行数、列数 **/
function getToolbarSize(type, additional = {}) {
  const params = getParams()
  let toolbarSize = {}
  let data = getData()
  let orientation
  if (params && params.device && params.device.orientation) {
    orientation = params.device.orientation
  } else {
    orientation = screen.getOrientation()
  }
  // 找当前模块下自定义的getToolbarSize，如果返回false，则去ToolBarHeight中去获取对应类型高度
  if (data && data.getToolbarSize) {
    toolbarSize = data.getToolbarSize(type, orientation, additional)
  }
  if (!toolbarSize || Object.keys(toolbarSize).length === 0) {
    toolbarSize = ToolBarHeight.getToolbarSize(type, orientation, additional)
  }
  return toolbarSize
}

function getModule(type, params = {}) {
  let module
  if (
    type === ConstToolType.MAP_SYMBOL ||
    type === ConstToolType.MAP_COLLECTION_POINT ||
    type === ConstToolType.MAP_COLLECTION_LINE ||
    type === ConstToolType.MAP_COLLECTION_REGION
  ) {
    module = collectionModule()
  } else if (type === ConstToolType.MAP_START) {
    module = startModule()
  } else if (type === ConstToolType.MAP_3D_START) {
    module = start3DModule()
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
    module = styleModule()
  } else if (
    typeof type === 'string' &&
    type.indexOf(ConstToolType.MAP_TOOL) > -1
  ) {
    module = toolModule()
  } else if (typeof type === 'string' && type.indexOf('MAP_INCREMENT_') > -1) {
    module = incrementModule()
  } else if (type === ConstToolType.MAP_SHARE) {
    module = shareModule()
  } else if (type === ConstToolType.MAP_SHARE_MAP3D) {
    module = share3DModule()
  } else if (typeof type === 'string' && type.indexOf('MAP_THEME') > -1) {
    module = themeModule()
  } else if (typeof type === 'string' && type.indexOf('MAP_EDIT_') > -1) {
    module = editModule()
  } else if (typeof type === 'string' && type.indexOf('MAP_TOPO_') > -1) {
    module = topoEditModule(type)
  } else if (
    typeof type === 'string' &&
    type.indexOf(ConstToolType.MAP_ANALYSIS) > -1
  ) {
    module = analysisModule()
  } else if (
    type === ConstToolType.PLOT_ANIMATION_START ||
    type === ConstToolType.PLOT_ANIMATION_NODE_CREATE ||
    type === ConstToolType.PLOT_ANIMATION_PLAY ||
    type === ConstToolType.PLOT_ANIMATION_GO_OBJECT_LIST ||
    type === ConstToolType.PLOT_ANIMATION_WAY ||
    type === ConstToolType.PLOT_ANIMATION_XML_LIST
  ) {
    module = plotModule()
  } else if (
    type === ConstToolType.MAP3D_MARK ||
    type === ConstToolType.MAP3D_SYMBOL_POINT ||
    type === ConstToolType.MAP3D_SYMBOL_TEXT ||
    type === ConstToolType.MAP3D_SYMBOL_POINTLINE ||
    type === ConstToolType.MAP3D_SYMBOL_POINTSURFACE
  ) {
    module = mark3DModule()
  } else if (
    type === ConstToolType.MAP3D_TOOL_FLYLIST ||
    type === ConstToolType.MAP3D_TOOL_NEWFLY
  ) {
    module = fly3DModule()
  } else if (typeof type === 'string' && type.indexOf('MAP3D_') > -1) {
    module = tool3DModule()
  } else if (typeof type === 'string' && type.indexOf('LEGEND') > -1) {
    module = legendModule()
  } else if (type === ConstToolType.MAP_AR_AI_ASSISTANT) {
    module = aiModule()
  } else if (
    type === ConstToolType.MAP_BACKGROUND_COLOR ||
    type === ConstToolType.MAP_COLOR_MODE
  ) {
    module = mapSettingModule()
  } else if (
    typeof type === 'string' &&
    type.indexOf(ConstToolType.MAP_MARKS) > -1
  ) {
    module = markModule()
  } else if (type === ConstToolType.MAP_COLOR_PICKER) {
    module = themeColorPickerModule()
  } else if (
    type === ConstToolType.MAP_LAYER_VISIBLE_SCALE ||
    type === ConstToolType.MAP_LAYER_VISIBLE_USER_DEFINE
  ) {
    module = layerVisibleScaleModule()
  } else {
    // TODO 新增自定义FunctionModule
    module = mapFunctionModules.getModule(type, params)
  }
  return module
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

  let module = getModule(type, params)
  if (module && module.getData) {
    toolBarData = module.getData(type, params)
  } else if (type === ConstToolType.MAP_PLOTTING_ANIMATION_ITEM) {
    toolBarData = getPlotAnimationData(type)
  }

  return toolBarData
}

async function setToolBarData(type, params = {}) {
  let module = getModule(type, params)
  if (module && module.setModuleData) {
    module.setModuleData(type)
  }
}

/**
 * 获取菜单弹框数据
 * @param type
 * @param others {themeType}
 * @returns {Array}
 */
function getMenuDialogData(type, ...others) {
  let module = getModule(type)
  let data = (module.getMenuData && module.getMenuData(type, ...others)) || []
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
  getToolbarSize,
}
