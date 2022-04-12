import { SScene } from 'imobile_for_reactnative'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { Toast } from '../../../../../../utils'
import NavigationService from '../../../../../NavigationService'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import ToolbarModule from '../ToolbarModule'
import ToolbarBtnType from '../../ToolbarBtnType'

let isClickMeasurePoint = true // 用于量算判断是否是选择点，true为新选择点，false为撤销回退
/** 距离量算 * */
function measureDistance() {
  const _params = ToolbarModule.getParams()
  if (!global.openWorkspace) {
    Toast.show(getLanguage(_params.language).Prompt.PLEASE_OPEN_SCENE)
    // '请打开场景')
    return
  }
  SScene.checkoutListener('startMeasure')
  SScene.setMeasureLineAnalyst({
    callback: result => {
      if (!isClickMeasurePoint) {
        isClickMeasurePoint = true
        ToolbarModule.addData({ isFinished: true })
      }
      const pointArr = ToolbarModule.getData().pointArr || []
      const redoArr = ToolbarModule.getData().redoArr || []
      pointArr.indexOf(JSON.stringify(result)) === -1 &&
        result.x !== 0 &&
        pointArr.push(JSON.stringify(result))
      const newState = {}
      if (pointArr.length > 0 && _params.toolbarStatus.canUndo === false)
        newState.canUndo = true
      if (_params.toolbarStatus.canRedo) newState.canRedo = false
      Object.keys(newState).length > 0 && _params.setToolbarStatus(newState)
      ToolbarModule.addData({ pointArr, redoArr, isFinished: true })
      result.length = Number(result.length)
      result.length = result.length > 0 ? result.length.toFixed(6) : 0
      _params.measureShow(true, `${result.length}m`)
    },
  })
  showAnalystResult(ConstToolType.SM_MAP3D_TOOL_DISTANCE_MEASURE)
}

/** 面积量算 * */
function measureArea() {
  const _params = ToolbarModule.getParams()
  if (!global.openWorkspace) {
    Toast.show(getLanguage(_params.language).Prompt.PLEASE_OPEN_SCENE)
    // '请打开场景')
    return
  }
  SScene.checkoutListener('startMeasure')
  SScene.setMeasureSquareAnalyst({
    callback: result => {
      if (!isClickMeasurePoint) {
        isClickMeasurePoint = true
        ToolbarModule.addData({ isFinished: true })
      }
      const pointArr = ToolbarModule.getData().pointArr || []
      const redoArr = ToolbarModule.getData().redoArr || []
      pointArr.indexOf(JSON.stringify(result)) === -1 &&
        result.x !== 0 &&
        pointArr.push(JSON.stringify(result))
      const newState = {}
      if (pointArr.length > 0 && _params.toolbarStatus.canUndo === false)
        newState.canUndo = true
      if (_params.toolbarStatus.canRedo) newState.canRedo = false
      Object.keys(newState).length > 0 && _params.setToolbarStatus(newState)
      ToolbarModule.addData({ pointArr, redoArr, isFinished: true })
      result.totalArea = Number(result.totalArea)
      result.totalArea = result.totalArea > 0 ? result.totalArea.toFixed(6) : 0
      _params.measureShow(true, `${result.totalArea}㎡`)
    },
  })
  showAnalystResult(ConstToolType.SM_MAP3D_TOOL_SURFACE_MEASURE)
}

/** 路径分析 * */
function pathAnalyst() {
  const params = ToolbarModule.getParams()
  NavigationService.navigate('PointAnalyst', {
    container: params.setContainerLoading ? params.setContainerLoading : {},
    type: 'pointAnalyst',
  })
  params.existFullMap && params.existFullMap()
  params.setToolbarVisible(false)
}

/** 点选 * */
function select() {
  const params = ToolbarModule.getParams()
  SScene.setAction('PANSELECT3D')
  global.action3d = 'PANSELECT3D'
  // this.showMap3DTool(ConstToolType.SM_MAP3D_TOOL_SELECT)
  const type = ConstToolType.SM_MAP3D_TOOL_SELECT
  params.setToolbarVisible(true, type, {
    containerType: ToolbarType.table,
    isFullScreen: false,
  })
}

/** box裁剪 * */
function boxClip() {
  const params = ToolbarModule.getParams()
  global.action3d = 'PAN3D_FIX'
  if (!global.openWorkspace) {
    Toast.show(getLanguage(params.language).Prompt.PLEASE_OPEN_SCENE)
    // '请打开场景')
    return
  }
  global.MapSurfaceView && global.MapSurfaceView.show(true)
  params.setToolbarVisible(true, ConstToolType.SM_MAP3D_TOOL_BOX_CLIPPING, {
    isFullScreen: false,
    // height: 0,
  })
}

/** 三维裁剪参数获取 * */
async function map3dCut() {
  const params = ToolbarModule.getParams()
  const data = global.MapSurfaceView && global.MapSurfaceView.getResult()
  if (data[0].x !== data[0].y) {
    const clipSetting = {
      startX: ~~data[0].x,
      startY: ~~data[0].y,
      endX: ~~data[2].x,
      endY: ~~data[2].y,
      clipInner: true,
      layers: [],
      isCliped: false,
    }
    const rel = await cut3d(clipSetting)
    rel.isCliped = true
    const layers = params.layerList
    layers.map(layer => {
      layer.selected = true
    })
    rel.layers = layers
    let num
    Object.keys(rel).map(key => {
      switch (key) {
        case 'X':
        case 'Y':
          num = 6
          break
        case 'Z':
          num = 1
          break
        case 'zRot':
          num = 0
          break
        case 'length':
          num = 0
          break
        case 'width':
          num = 0
          break
        case 'height':
          num = 0
          break
        case 'clipInner':
          break
      }
      if (rel[key] * 1 === rel[key])
        rel[key] = parseFloat(rel[key].toFixed(num))
    })
    global.MapSurfaceView.show(false)
    // this.props.showMap3DTool(ConstToolType.SM_MAP3D_TOOL_BOX_CLIP)
    params.setToolbarVisible(true, ConstToolType.SM_MAP3D_TOOL_BOX_CLIP, {
      isFullScreen: false,
      containerType: ToolbarType.typeNull,
    })
    params.setClipSetting && params.setClipSetting(rel)
  } else {
    Toast.show(getLanguage(global.language).Map_Main_Menu.CUT_FIRST)
  }
}

// 三维裁剪
async function cut3d(data) {
  // todo 三维裁剪 分this.state.type
  const rel = await SScene.clipByBox(data)
  let num
  Object.keys(rel).map(key => {
    switch (key) {
      case 'X':
      case 'Y':
        num = 6
        break
      case 'Z':
        num = 1
        break
      case 'zRot':
        num = 0
        break
      case 'length':
        num = 0
        break
      case 'width':
        num = 0
        break
      case 'height':
        num = 0
        break
      case 'clipInner':
        break
    }
    if (rel[key] * 1 === rel[key]) rel[key] = parseFloat(rel[key].toFixed(num))
  })
  return rel
}

/** 三维分析结果显示 */
function showAnalystResult(type) {
  const params = ToolbarModule.getParams()
  params.setToolbarVisible(true, type, {
    data: [],
    buttons: [
      ToolbarBtnType.CANCEL,
      // ToolbarBtnType.UNDO,
      // ToolbarBtnType.REDO,
      {
        type: ToolbarBtnType.UNDO,
        action: undo,
      },
      {
        type: ToolbarBtnType.REDO,
        action: redo,
      },
      // ToolbarBtnType.CLEAR,
      {
        type: ToolbarBtnType.MEASURE_CLEAR,
        action: () => clearMeasure(type),
        image: getThemeAssets().mark.icon_mark_erase,
      },
    ],
    // buttons: [ToolbarBtnType.CLOSE_ANALYST, ToolbarBtnType.CLEAR],
    isFullScreen: false,
    // height: ConstToolType.HEIGHT[0],
    // column: data.length,
    containerType: 'list',
  })
}

/** 量算功能 撤销事件 * */
function undo() {
  if (ToolbarModule.getData().isFinished === false) return
  isClickMeasurePoint = false
  const pointArr = ToolbarModule.getData().pointArr || []
  const redoArr = ToolbarModule.getData().redoArr || []
  const _params = ToolbarModule.getParams()
  if (!_params.toolbarStatus.canUndo) return
  const newState = {}
  if (pointArr.length > 0) {
    redoArr.push(pointArr.pop())
  }
  newState.canRedo = redoArr.length > 0
  newState.canUndo = pointArr.length > 0
  _params.setToolbarStatus(newState)
  ToolbarModule.addData({ pointArr, redoArr, isFinished: false })
  SScene.displayDistanceOrArea(pointArr)
}

/** 量算功能 重做事件 * */
function redo() {
  if (ToolbarModule.getData().isFinished === false) return
  isClickMeasurePoint = false
  const pointArr = ToolbarModule.getData().pointArr || []
  const redoArr = ToolbarModule.getData().redoArr || []
  const _params = ToolbarModule.getParams()
  if (!_params.toolbarStatus.canRedo || redoArr.length === 0) return
  const newState = {}
  if (redoArr.length > 0) {
    pointArr.push(redoArr.pop())
  }
  newState.canRedo = redoArr.length > 0
  newState.canUndo = pointArr.length > 0
  _params.setToolbarStatus(newState)
  Object.keys(newState).length > 0 && _params.setToolbarStatus(newState)

  ToolbarModule.addData({ pointArr, redoArr, isFinished: false })
  SScene.displayDistanceOrArea(pointArr)
}

/** 清除三维量算 * */
function clearMeasure(type) {
  const _params = ToolbarModule.getParams()
  switch (type) {
    case ConstToolType.SM_MAP3D_TOOL_SURFACE_MEASURE:
      SScene.clearSquareAnalyst()
      ToolbarModule.getParams().measureShow &&
        ToolbarModule.getParams().measureShow(true, '0㎡')
      ToolbarModule.addData({ pointArr: [], redoArr: [] })
      _params.setToolbarStatus({
        canUndo: false,
        canRedo: false,
        isFinished: true,
      })
      break
    case ConstToolType.SM_MAP3D_TOOL_DISTANCE_MEASURE:
      SScene.clearLineAnalyst()
      ToolbarModule.getParams().measureShow &&
        ToolbarModule.getParams().measureShow(true, '0m')
      ToolbarModule.addData({ pointArr: [], redoArr: [] })
      _params.setToolbarStatus({
        canUndo: false,
        canRedo: false,
        isFinished: true,
      })
      break
    // case ConstToolType.SM_MAP3D_TOOL_BOX_CLIP:
    case ConstToolType.SM_MAP3D_TOOL_CROSS_CLIP:
    case ConstToolType.SM_MAP3D_TOOL_PLANE_CLIP:
    case ConstToolType.SM_MAP3D_TOOL_CLIP_SHOW:
    case ConstToolType.SM_MAP3D_TOOL_CLIP_HIDDEN:
    case ConstToolType.SM_MAP3D_TOOL_BOX_CLIP_IN:
    case ConstToolType.SM_MAP3D_TOOL_BOX_CLIP_OUT:
      // 清除裁剪面 返回上个界面
      _params.clearClip && _params.clearClip()
      // ToolbarModule.setData()
      SScene.clipSenceClear()
      global.MapSurfaceView && global.MapSurfaceView.show()
      _params.setToolbarVisible(true, ConstToolType.SM_MAP3D_TOOL_BOX_CLIPPING, {
        isFullScreen: false,
        // height: 0,
      })
      break
    case ConstToolType.SM_MAP3D_TOOL_BOX_CLIP:
      // 清除裁剪面 返回上个界面
      _params.clearClip && _params.clearClip()
      SScene.clipSenceClear()
      global.MapSurfaceView && global.MapSurfaceView.show()
      _params.setToolbarVisible(true, ConstToolType.SM_MAP3D_TOOL_BOX_CLIPPING, {
        isFullScreen: false,
      })
      break
    default:
      SScene.clear()
      break
  }
}

async function close(type) {
  const _params = ToolbarModule.getParams()
  if (
    type === ConstToolType.SM_MAP3D_TOOL_DISTANCE_MEASURE ||
    type === ConstToolType.SM_MAP3D_TOOL_SURFACE_MEASURE
  ) {
    SScene.closeAnalysis()
    _params.measureShow(false, '')
    _params.existFullMap && _params.existFullMap()
    _params.setToolbarVisible(false)
    // this.clickTime = 0
    _params.setToolbarStatus({
      canUndo: false,
      canRedo: false,
    })
  } else if (type === ConstToolType.SM_MAP3D_TOOL_SELECT) {
    SScene.clearSelection()
    _params.setAttributes({})
    _params.existFullMap && _params.existFullMap()
    _params.setToolbarVisible(false)
  } else if (type === ConstToolType.SM_MAP3D_TOOL_CIRCLE_FLY) {
    SScene.stopCircleFly()
    SScene.clearCirclePoint()
    _params.existFullMap && _params.existFullMap()
    _params.setToolbarVisible(false)
  } else if (
    type === ConstToolType.SM_MAP3D_TOOL_BOX_CLIPPING ||
    type === ConstToolType.SM_MAP3D_TOOL_BOX_CLIP ||
    type === ConstToolType.SM_MAP3D_TOOL_CROSS_CLIP ||
    type === ConstToolType.SM_MAP3D_TOOL_PLANE_CLIP
  ) {
    await SScene.clipSenceClear()
    global.MapSurfaceView && global.MapSurfaceView.show(false)
    _params.setToolbarVisible(false)
  } else {
    SScene.checkoutListener('startTouchAttribute')
    SScene.setAction('PAN3D')
    global.action3d = 'PAN3D'
    ToolbarModule.setData()
    return false
  }
  SScene.checkoutListener('startTouchAttribute')
  SScene.setAction('PAN3D')
  global.action3d = 'PAN3D'
  ToolbarModule.setData()
}

function circleFly() {
  const _params = ToolbarModule.getParams()
  _params.showFullMap && _params.showFullMap(true)
  global.action3d = 'PAN3D_FIX'
  SScene.stopCircleFly()
  _params.setToolbarVisible(true, ConstToolType.SM_MAP3D_TOOL_CIRCLE_FLY, {
    containerType: ToolbarType.table,
    isFullScreen: false,
    resetToolModuleData: true,
  })
}
function showMenuDialog() {
  const _params = ToolbarModule.getParams()
  const _data = ToolbarModule.getData()
  const configs = JSON.parse(JSON.stringify(_data))
  if (configs.showBox) {
    _params.setToolbarVisible(true, ConstToolType.SM_MAP3D_TOOL_CLIP_HIDDEN, {
      containerType: ToolbarType.typeNull,
      isFullScreen: false,
    })
    ToolbarModule.addData({ showBox: false })
  }
  _params.showMenuDialog && _params.showMenuDialog(configs)
}

function showLayerList() {
  const _params = ToolbarModule.getParams()
  const data = ToolbarModule.getData()
  let { showBox } = data
  _params.showMenuDialog &&
    _params.showMenuDialog({
      showMenuDialog: false,
    })
  if (!showBox) {
    _params.setToolbarVisible(true, ConstToolType.SM_MAP3D_TOOL_CLIP_SHOW, {
      containerType: ToolbarType.colorTable,
      isFullScreen: false,
    })
  } else {
    _params.setToolbarVisible(true, ConstToolType.SM_MAP3D_TOOL_CLIP_HIDDEN, {
      containerType: ToolbarType.typeNull,
      isFullScreen: false,
    })
  }
  showBox = !showBox
  ToolbarModule.addData({ showBox })
}

function changeClip() {
  const _params = ToolbarModule.getParams()
  const _data = _params.getClipSetting()
  _params.showMenuDialog({
    showMenuDialog: false,
  })
  const clipSetting = JSON.parse(JSON.stringify(_data))
  clipSetting.clipInner = !clipSetting.clipInner
  if (!clipSetting.layers) {
    clipSetting.layers = _params.layerList || []
  }
  SScene.clipByBox(clipSetting)
  _params.setClipSetting && _params.setClipSetting(clipSetting)
  const type = clipSetting.clipInner
    ? ConstToolType.SM_MAP3D_TOOL_BOX_CLIP_IN
    : ConstToolType.SM_MAP3D_TOOL_BOX_CLIP_OUT
  _params.setToolbarVisible(true, type, {
    containerType: ToolbarType.typeNull,
    isFullScreen: false,
  })
}
function layerChange(layers) {
  const _params = ToolbarModule.getParams()
  const _data = _params.getClipSetting()

  const clipSetting = JSON.parse(JSON.stringify(_data))
  clipSetting.layers = layers
  SScene.clipByBox(clipSetting)
  _params.setClipSetting && _params.setClipSetting(clipSetting)
}

function closeClip() {
  const _params = ToolbarModule.getParams()
  SScene.clipSenceClear()
  _params.setToolbarVisible(false)
  _params.existFullMap && _params.existFullMap()
  _params.setClipSetting && _params.setClipSetting({})
  _params.clearClip && _params.clearClip()
  ToolbarModule.setData()
  global.MapSurfaceView && global.MapSurfaceView.show(false)
}
export default {
  close,

  measureDistance,
  measureArea,
  select,
  pathAnalyst,
  boxClip,
  clearMeasure,
  undo,
  redo,
  map3dCut,
  showLayerList,
  changeClip,
  showMenuDialog,
  layerChange,
  closeClip,
  cut3d,
  circleFly,
}
