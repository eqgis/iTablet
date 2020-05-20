import {
  SMap,
  Action,
  SMediaCollector,
  SAIDetectView,
} from 'imobile_for_reactnative'
import {
  ConstToolType,
  ConstPath,
  ToolbarType,
} from '../../../../../../constants'
import {
  dataUtil,
  Toast,
  StyleUtils,
  LayerUtils,
} from '../../../../../../utils'
import { FileTools } from '../../../../../../native'
import { ImagePicker } from '../../../../../../components'
import NavigationService from '../../../../../NavigationService'
import { getLanguage } from '../../../../../../language'
import ToolbarModule from '../ToolbarModule'

function begin() {
  GLOBAL.GPS = setInterval(() => {
    SMap.gpsBegin()
  }, 2000)
}

function stop() {
  if (GLOBAL.GPS !== undefined) {
    clearInterval(GLOBAL.GPS)
  }
}

function submit() {
  (async function() {
    if (GLOBAL.MapToolType === ConstToolType.MAP_TOOL_GPSINCREMENT) {
      await SMap.addGPSRecordset()
    }
    await SMap.submit()
    await SMap.buildNetwork()
  })()
}

function select(type) {
  if (type === undefined) {
    type = ToolbarModule.getParams().type
  }
  switch (type) {
    case ConstToolType.MAP_TOOL_TAGGING_SELECT_BY_RECTANGLE:
    case ConstToolType.MAP_TOOL_SELECT_BY_RECTANGLE:
      SMap.setAction(Action.SELECT_BY_RECTANGLE)
      // SMap.selectByRectangle()
      break
    default:
      SMap.setAction(Action.SELECT)
      break
  }
}

function cancelSelect() {
  ToolbarModule.getParams().setSelection(null)
  SMap.clearSelection()
  select()
}

function viewEntire() {
  SMap.viewEntire().then(async () => {
    const params = ToolbarModule.getParams()
    params.setToolbarVisible && params.setToolbarVisible(false)
    const currentFloorID = await SMap.getCurrentFloorID()
    params.changeFloorID && params.changeFloorID(currentFloorID || '')
  })
}

/** 单选 * */
function pointSelect() {
  const _params = ToolbarModule.getParams()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)

  let type
  if (GLOBAL.MapToolType === ConstToolType.MAP_TOOLS) {
    type = ConstToolType.MAP_TOOL_TAGGING_POINT_SELECT
  } else {
    type = ConstToolType.MAP_TOOL_POINT_SELECT
  }

  _params.setToolbarVisible(true, type, {
    containerType: 'table',
    // column: 3,
    isFullScreen: false,
    // height: ConstToolType.HEIGHT[0],
    cb: () => select(type),
  })
}

/** 框选 * */
function selectByRectangle() {
  const _params = ToolbarModule.getParams()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)

  let type
  if (GLOBAL.MapToolType === ConstToolType.MAP_TOOLS) {
    type = ConstToolType.MAP_TOOL_TAGGING_SELECT_BY_RECTANGLE
  } else {
    type = ConstToolType.MAP_TOOL_SELECT_BY_RECTANGLE
  }

  _params.setToolbarVisible(true, type, {
    containerType: 'table',
    // column: 3,
    isFullScreen: false,
    // height: ConstToolType.HEIGHT[0],
    cb: () => select(type),
  })
}

/** 矩形裁剪 * */
function rectangleCut() {
  const _params = ToolbarModule.getParams()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  // addMapCutListener()
  GLOBAL.MapSurfaceView && GLOBAL.MapSurfaceView.show(true)

  _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_RECTANGLE_CUT, {
    isFullScreen: false,
    // height: 0,
  })
}

/** 距离量算 * */
function measureLength() {
  const _params = ToolbarModule.getParams()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  _params.showMeasureResult(true, 0)
  StyleUtils.setDefaultMapControlStyle().then(() => {
    SMap.measureLength(obj => {
      const pointArr = ToolbarModule.getData().pointArr || []
      const redoArr = []
      // 防止重复添加
      if (pointArr.indexOf(JSON.stringify(obj.curPoint)) === -1) {
        pointArr.push(JSON.stringify(obj.curPoint))
        const newState = {}
        if (pointArr.length > 0 && _params.toolbarStatus.canUndo === false)
          newState.canUndo = true
        if (_params.toolbarStatus.canRedo) newState.canRedo = false
        Object.keys(newState).length > 0 && _params.setToolbarStatus(newState)
        ToolbarModule.addData({ pointArr, redoArr, isFinished: true })
      } else {
        ToolbarModule.addData({ isFinished: true })
      }
      const rel = obj.curResult === 0 ? 0 : obj.curResult.toFixed(6)
      _params.showMeasureResult(true, `${rel}m`)
    })
  })

  _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_MEASURE_LENGTH, {
    containerType: 'table',
    // column: 4,
    isFullScreen: false,
    // height: 0,
  })
}

/**  面积量算  * */
function measureArea() {
  const _params = ToolbarModule.getParams()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  _params.showMeasureResult(true, 0)
  StyleUtils.setDefaultMapControlStyle().then(() => {
    SMap.measureArea(obj => {
      const pointArr = ToolbarModule.getData().pointArr || []
      const redoArr = []
      // 防止重复添加
      if (pointArr.indexOf(JSON.stringify(obj.curPoint)) === -1) {
        pointArr.push(JSON.stringify(obj.curPoint))
        const newState = {}
        if (pointArr.length > 0 && _params.toolbarStatus.canUndo === false)
          newState.canUndo = true
        if (_params.toolbarStatus.canRedo) newState.canRedo = false
        Object.keys(newState).length > 0 && _params.setToolbarStatus(newState)
        ToolbarModule.addData({ pointArr, redoArr, isFinished: true })
      } else {
        ToolbarModule.addData({ isFinished: true })
      }
      const rel = obj.curResult === 0 ? 0 : obj.curResult.toFixed(6)
      _params.showMeasureResult(true, `${rel}㎡`)
    })
  })

  _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_MEASURE_AREA, {
    containerType: 'table',
    // column: 4,
    isFullScreen: false,
    // height: 0,
  })
}

/**  角度量算  * */
function measureAngle() {
  const _params = ToolbarModule.getParams()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  _params.showMeasureResult(true, 0)
  StyleUtils.setDefaultMapControlStyle().then(() => {
    SMap.measureAngle(obj => {
      const pointArr = ToolbarModule.getData().pointArr || []
      const redoArr = []
      // 防止重复添加
      if (pointArr.indexOf(JSON.stringify(obj.curPoint)) === -1) {
        // 角度量算前两次打点不会触发回调，第三次打点添加一个标识，最后一次撤销直接清除当前所有点
        pointArr.indexOf('startLine') === -1 && pointArr.push('startLine')
        pointArr.indexOf(JSON.stringify(obj.curPoint)) === -1 &&
          pointArr.push(JSON.stringify(obj.curPoint))
        const newState = {}
        if (pointArr.length > 0 && _params.toolbarStatus.canUndo === false)
          newState.canUndo = true
        if (_params.toolbarStatus.canRedo) newState.canRedo = false
        Object.keys(newState).length > 0 && _params.setToolbarStatus(newState)
        ToolbarModule.addData({ pointArr, redoArr, isFinished: true })
      } else {
        ToolbarModule.addData({ isFinished: true })
      }
      if (pointArr.length >= 2) {
        _params.showMeasureResult(true, dataUtil.angleTransfer(obj.curAngle, 6))
      } else {
        _params.showMeasureResult(true, '0°')
      }
    })
  })

  _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_MEASURE_ANGLE, {
    containerType: 'table',
    // column: 4,
    isFullScreen: false,
    // height: 0,
  })
}

/** 清除量算结果 * */
function clearMeasure(type) {
  const _params = ToolbarModule.getParams()
  type = _params.type
  if (typeof type === 'string' && type.indexOf('MAP_TOOL_MEASURE_') >= 0) {
    switch (type) {
      case ConstToolType.MAP_TOOL_MEASURE_LENGTH:
        ToolbarModule.getParams().showMeasureResult &&
          ToolbarModule.getParams().showMeasureResult(true, '0m')
        SMap.setAction(Action.MEASURELENGTH)
        break
      case ConstToolType.MAP_TOOL_MEASURE_AREA:
        ToolbarModule.getParams().showMeasureResult &&
          ToolbarModule.getParams().showMeasureResult(true, '0㎡')
        SMap.setAction(Action.MEASUREAREA)
        break
      case ConstToolType.MAP_TOOL_MEASURE_ANGLE:
        ToolbarModule.getParams().showMeasureResult &&
          ToolbarModule.getParams().showMeasureResult(true, '0°')
        SMap.setAction(Action.MEASUREANGLE)
        break
    }
    ToolbarModule.addData({ pointArr: [], redoArr: [], isFinished: true })
    _params.setToolbarStatus({
      canUndo: false,
      canRedo: false,
    })
  }
}

/** 量算功能 撤销事件 * */
async function undo(type) {
  if (ToolbarModule.getData().isFinished === false) return
  if (type === ConstToolType.MAP_TOOL_INCREMENT) {
    await SMap.undo()
    return
  }
  let pointArr = ToolbarModule.getData().pointArr || []
  let redoArr = ToolbarModule.getData().redoArr || []
  const _params = ToolbarModule.getParams()
  if (!_params.toolbarStatus.canUndo) return
  const newState = {}
  if (pointArr.length > 0) {
    redoArr.push(pointArr.pop())
  }
  newState.canRedo = redoArr.length > 0
  newState.canUndo = pointArr.length > 0
  if (type === ConstToolType.MAP_TOOL_MEASURE_ANGLE && pointArr.length <= 1) {
    _params.showMeasureResult && _params.showMeasureResult(true, '0°')
    if (pointArr.length === 1) {
      newState.canRedo = false
      newState.canUndo = false
      pointArr = []
      redoArr = []
      SMap.setAction(Action.MEASUREANGLE)
    }
  }
  _params.setToolbarStatus(newState, async () => {
    await SMap.undo()
    // isFinished防止量算撤销回退没完成，再次触发事件，导致出错
    // pointArr为空，撤销到最后，不会进入量算回调，此时isFinished直接为true
    ToolbarModule.addData({
      pointArr,
      redoArr,
      isFinished: pointArr.length === 0,
    })
  })
}

/** 量算功能 重做事件 * */
async function redo(type = null) {
  if (ToolbarModule.getData().isFinished === false) return
  if (type === ConstToolType.MAP_TOOL_INCREMENT) {
    await SMap.redo()
    return
  }
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
  Object.keys(newState).length > 0 &&
    _params.setToolbarStatus(newState, async () => {
      await SMap.redo()
      // isFinished防止量算撤销回退没完成，再次触发事件，导致出错
      ToolbarModule.addData({ pointArr, redoArr, isFinished: false })
    })
}

async function setting() {
  NavigationService.navigate('AIDetecSettingsView')
  this.props.showFullMap && this.props.showFullMap(true)
  await SAIDetectView.setProjectionModeEnable(false)
}

// function name() {
//   return NavigationService.navigate('InputPage', {
//     headerTitle: getLanguage(global.language).Map_Main_Menu.TOOLS_NAME,
//     cb: async value => {
//       if (value !== '') {
//         (async function() {
//           await SMap.addRecordset(
//             GLOBAL.TaggingDatasetName,
//             'name',
//             value,
//             ToolbarModule.getParams().user.currentUser.userName,
//           )
//         }.bind(this)())
//       }
//       NavigationService.goBack()
//     },
//   })
// }

// function remark() {
//   return NavigationService.navigate('InputPage', {
//     headerTitle: getLanguage(global.language).Map_Main_Menu.TOOLS_REMARKS,
//     cb: async value => {
//       if (value !== '') {
//         (async function() {
//           await SMap.addRecordset(
//             GLOBAL.TaggingDatasetName,
//             'remark',
//             value,
//             ToolbarModule.getParams().user.currentUser.userName,
//           )
//         }.bind(this)())
//       }
//       NavigationService.goBack()
//     },
//   })
// }
//
// function address() {
//   return NavigationService.navigate('InputPage', {
//     headerTitle: getLanguage(global.language).Map_Main_Menu.TOOLS_HTTP,
//     cb: async value => {
//       if (value !== '') {
//         (async function() {
//           await SMap.addRecordset(
//             GLOBAL.TaggingDatasetName,
//             'address',
//             value,
//             ToolbarModule.getParams().user.currentUser.userName,
//           )
//         }.bind(this)())
//       }
//       NavigationService.goBack()
//     },
//   })
// }

// 多媒体采集
function captureImage() {
  (async function() {
    const _params = ToolbarModule.getParams()
    const { currentLayer } = _params
    // let reg = /^Label_(.*)#$/
    if (currentLayer) {
      const layerType = LayerUtils.getLayerType(currentLayer)
      const isTaggingLayer = layerType === 'TAGGINGLAYER'
      // let isTaggingLayer = currentLayer.type === DatasetType.CAD
      // && currentLayer.datasourceAlias.match(reg)
      if (isTaggingLayer) {
        // await SMap.setTaggingGrid(
        //   currentLayer.datasetName,
        //   ToolbarModule.getParams().user.currentUser.userName,
        // )
        const { datasourceAlias } = currentLayer // 标注数据源名称
        const { datasetName } = currentLayer // 标注图层名称
        NavigationService.navigate('Camera', {
          datasourceAlias,
          datasetName,
        })
      }
    } else {
      Toast.show(
        getLanguage(ToolbarModule.getParams().language).Prompt
          .PLEASE_SELECT_PLOT_LAYER,
      )
      ToolbarModule.getParams().navigation.navigate('LayerManager')
    }
  })()
}

function tour() {
  (async function() {
    const _params = ToolbarModule.getParams()
    // let {isTaggingLayer, layerInfo} = await SMap.getCurrentTaggingLayer(
    //   ToolbarModule.getParams().user.currentUser.userName,
    // )
    //
    // // TODO 判断是否是轨迹标注图层
    // if (isTaggingLayer && GLOBAL.TaggingDatasetName) {
    //   let dsDes = layerInfo && layerInfo.datasetDescription &&
    //     layerInfo.datasetDescription !== 'NULL' && JSON.parse(layerInfo.datasetDescription)
    //   dsDes && dsDes.type !== 'tour' && await SMap.setTaggingGrid(
    //     GLOBAL.TaggingDatasetName,
    //     ToolbarModule.getParams().user.currentUser.userName,
    //   )
    //   ImagePicker.AlbumListView.defaultProps.showDialog = false
    //   ImagePicker.AlbumListView.defaultProps.dialogConfirm = null
    // } else {
    const targetPath = await FileTools.appendingHomeDirectory(
      `${ConstPath.UserPath + _params.user.currentUser.userName}/${
        ConstPath.RelativeFilePath.Media
      }`,
    )
    SMediaCollector.initMediaCollector(targetPath)

    let tourLayer
    ImagePicker.AlbumListView.defaultProps.showDialog = true
    ImagePicker.AlbumListView.defaultProps.dialogConfirm = (
      value = '',
      cb = () => {},
    ) => {
      if (value !== '') {
        (async function() {
          await SMap.setLabelColor()
          const tagginData = await SMap.newTaggingDataset(
            value,
            _params.user.currentUser.userName,
            false, // 轨迹图层都设置为不可编辑
            'tour',
          )
          tourLayer = tagginData.layerName
          cb && cb()
        })()
      }
      Toast.show(value)
    }
    // }

    ImagePicker.AlbumListView.defaultProps.assetType = 'All'
    ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'

    ImagePicker.getAlbum({
      maxSize: 9,
      callback: async data => {
        if (data.length <= 1) {
          Toast.show(
            getLanguage(global.language).Prompt.SELECT_TWO_MEDIAS_AT_LEAST,
          )
          return
        }
        if (tourLayer) {
          const res = await SMediaCollector.addTour(tourLayer, data)
          res.result && (await SMap.setLayerFullView(tourLayer))
        }
      },
    })
  })()
}

/**
 * 智能配图
 */
function matchPictureStyle() {
  const _params = ToolbarModule.getParams()
  ImagePicker.AlbumListView.defaultProps.showDialog = false
  ImagePicker.AlbumListView.defaultProps.assetType = 'Photos'
  ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'

  ImagePicker.getAlbum({
    maxSize: 1,
    callback: async data => {
      if (data.length === 1) {
        ToolbarModule.getParams().setContainerLoading &&
          ToolbarModule.getParams().setContainerLoading(
            true,
            getLanguage(global.language).Prompt.IMAGE_RECOGNITION_ING,
          )
        await SMap.matchPictureStyle(data[0].uri, res => {
          ToolbarModule.getParams().setContainerLoading &&
            ToolbarModule.getParams().setContainerLoading(false)
          if (!res || !res.result) {
            Toast.show(
              getLanguage(global.language).Prompt.IMAGE_RECOGNITION_FAILED,
            )
          }
        })
      }
      ToolbarModule.getParams().showFullMap &&
        ToolbarModule.getParams().showFullMap(true)
      _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_STYLE_TRANSFER, {
        isFullScreen: false,
        // height: 0,
      })
    },
  })
}

// 设置我的图层的可选择性
// function _setMyLayersSelectable(layers, selectable) {
//   for (let i = 0; i < layers.length; i++) {
//     if (layers[i].type === 'layerGroup') {
//       _setMyLayersSelectable(layers[i].child, selectable)
//     } else if (
//       LayerUtils.getLayerType(layers[i]) !== 'TAGGINGLAYER' &&
//       layers[i].isSelectable
//     ) {
//       SMap.setLayerSelectable(layers[i].path, selectable)
//     }
//   }
// }

// function captureVideo () {
//   let options = {
//     datasourceName: 'Hunan',
//   }
//   SMediaCollector.captureVideo(options, data => {
//     console.warn(JSON.stringify(data))
//   })
// }
//
// function startCaptureAudio () {
//   let options = {
//     datasourceName: 'Hunan',
//   }
//   SMediaCollector.startCaptureAudio(options)
// }
//
// function stopCaptureAudio () {
//   SMediaCollector.stopCaptureAudio(data => {
//     console.warn(JSON.stringify(data))
//   })
// }

/** ******** 裁剪手势监听 *********** */
// async function addMapCutListener() {
//   await SMap.setGestureDetector({
//     touchBeganHandler: touchBeganHandler,
//     scrollHandler: scrollHandler,
//     touchEndHandler: touchEndHandler,
//     // scrollHandler: scrollHandler,
//   })
// }
//
// async function removeMapCutListener() {
//   await SMap.deleteGestureDetector()
// }
//
// let drawGeo = {
//   id: -1,
//   startPoint: {},
//   endPoint: {},
// }
// function touchBeganHandler (event) {
//   STracking.clear().then(async () => {
//     drawGeo.startPoint = {x: event.x, y: event.y}
//     drawGeo.id = await STracking.drawRectangle(drawGeo.id, drawGeo.startPoint, drawGeo.startPoint)
//   })
// }
//
// function scrollHandler (event) {
//   if (drawGeo.startPoint.x === event.x && drawGeo.startPoint.y === event.y){
//     return
//   } else if (drawGeo.startPoint.x === undefined && drawGeo.startPoint.y === undefined) {
//     drawGeo.startPoint.x = event.x
//     drawGeo.startPoint.y = event.y
//     return
//   }
//   drawGeo.endPoint = {x: event.x, y: event.y}
//   STracking.drawRectangle(drawGeo.id, drawGeo.startPoint, drawGeo.endPoint).then(async id => {
//     drawGeo.id = id
//   })
// }
//
// function touchEndHandler (event) {
//   drawGeo.endPoint = {x: event.x, y: event.y}
//   console.warn(JSON.stringify(drawGeo))
// }

function commit(type) {
  const _params = ToolbarModule.getParams()
  // getParams.showToolbar(false)
  if (typeof type === 'string' && type.indexOf('MAP_EDIT_') >= 0) {
    if (type === ConstToolType.MAP_EDIT_DEFAULT) {
      // 编辑完成关闭Toolbar
      _params.setToolbarVisible(false, '', {
        cb: () => {
          SMap.setAction(Action.PAN)
        },
      })
    } else if (
      type !== ConstToolType.MAP_TOOL_TAGGING &&
      type !== ConstToolType.MAP_TOOL_TAGGING_SETTING
    ) {
      // 编辑完成关闭Toolbar
      // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
      _params.setToolbarVisible(true, ConstToolType.MAP_EDIT_DEFAULT, {
        isFullScreen: false,
        // height: 0,
        cb: () => {
          SMap.submit()
          SMap.setAction(Action.SELECT)
        },
      })
    }
  } else if (type === ConstToolType.MAP_TOOL_RECTANGLE_CUT) {
    NavigationService.navigate('MapCut', {
      points: GLOBAL.MapSurfaceView.getResult(),
    })
  } else if (type === ConstToolType.MAP_TOOL_STYLE_TRANSFER) {
    // ToolbarPicker.hide()
    SMap.resetMapFixColorsModeValue(false)
    _params.setToolbarVisible(false, '', {
      cb: () => {
        SMap.setAction(Action.PAN)
      },
    })
  } else {
    return false // 表示没找到对应方法，调用默认方法
  }
}

async function showAttribute() {
  const _params = ToolbarModule.getParams()
  const _selection = _params.selection
  if (_selection.length === 0) {
    Toast.show(getLanguage(GLOBAL.language).Prompt.NON_SELECTED_OBJ)
    return
  }

  const attributes = await SMap.getSelectionAttributeByLayer(
    _selection[0].layerInfo.path,
    0,
    1,
  )
  if (attributes.total === 0) {
    Toast.show(getLanguage(GLOBAL.language).Prompt.NON_SELECTED_OBJ)
    return
  }

  let selectObjNums = 0
  _selection.forEach(item => {
    selectObjNums += item.ids.length
  })
  selectObjNums === 0 &&
    Toast.show(getLanguage(GLOBAL.language).Prompt.NON_SELECTED_OBJ)

  let params = {
    preType: _params.type,
  }
  GLOBAL.SelectedSelectionAttribute &&
    (params.selectionAttribute = GLOBAL.SelectedSelectionAttribute)
  NavigationService.navigate('LayerSelectionAttribute', params)
}

function showMenuBox() {
  const _params = ToolbarModule.getParams()
  _params.setToolbarVisible(
    true,
    ConstToolType.MAP_TOOL_STYLE_TRANSFER_PICKER,
    {
      containerType: ToolbarType.picker,
      isFullScreen: false,
      // height: ConstToolType.TOOLBAR_HEIGHT_2[3],
      // cb: () => SCollector.stopCollect(),
    },
  )
}

/**
 * Picker类型确认按钮
 * @param params
 * {
    selectKey: item,
    selectName: item,
   }
 */
function pickerConfirm(params) {
  const _params = ToolbarModule.getParams()
  _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_STYLE_TRANSFER, {
    isFullScreen: true,
    showMenuDialog: false,
    isTouchProgress: true,
    // height: 0,
    ...params,
  })
}

/**
 * Picker类型确认按钮
 */
function pickerCancel() {
  const _params = ToolbarModule.getParams()
  _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_STYLE_TRANSFER, {
    isFullScreen: false,
    showMenuDialog: false,
    isTouchProgress: false,
    // height: 0,
  })
}

/**
 * Toolbar列表多选框
 * @param selectList
 * @returns {Promise.<void>}
 */
async function listSelectableAction({ selectList }) {
  ToolbarModule.addData({ selectList })
}

// function toolbarBack() {
//   const _params = ToolbarModule.getParams()
//   if (
//     GLOBAL.MapToolType.indexOf('MAP_TOOL_TAGGING_SELECT_') !== -1 ||
//     GLOBAL.MapToolType.indexOf('MAP_TOOL_TAGGING_EDIT_') !== -1 ||
//     GLOBAL.MapToolType.indexOf('MAP_TOOL_TAGGING_STYLE') !== -1
//   ) {
//     SMap.cancel()
//     SMap.clearSelection()
//     _params.setSelection()
//     const type = ConstToolType.MAP_TOOL_TAGGING_SELECT
//
//     _params.setToolbarVisible(true, type, {
//       isFullScreen: false,
//       // height: 0,
//       cb: () => select(type),
//     })
//   }
// }

async function close(type) {
  const _params = ToolbarModule.getParams()
  const _data = ToolbarModule.getData()
  if (type === ConstToolType.MAP_TOOL_TAGGING_SETTING) {
    await SMap.undo()
    _params.setToolbarVisible(false)
  } else if (
    type === ConstToolType.MAP_TOOL_INCREMENT ||
    type === ConstToolType.MAP_TOOL_GPSINCREMENT
  ) {
    GLOBAL.FloorListView.setVisible(true)
    await SMap.removeNetworkDataset()
    SMap.setAction(Action.PAN)
    _params.setToolbarVisible(false)
  } else if (type === ConstToolType.MAP_TOOL_STYLE_TRANSFER) {
    await SMap.resetMapFixColorsModeValue(true)
    // _params.setToolbarVisible(false)
    return false
  } else if (
    type === ConstToolType.MAP_TOOL_SELECT_BY_RECTANGLE ||
    type === ConstToolType.MAP_TOOL_TAGGING_SELECT_BY_RECTANGLE ||
    type === ConstToolType.MAP_TOOL_TAGGING_POINT_SELECT ||
    type === ConstToolType.MAP_TOOL_POINT_SELECT
  ) {
    SMap.setAction(Action.PAN)
    SMap.clearSelection()
    _params.setToolbarVisible(false)
  } else if (type === ConstToolType.MAP_TOOL_TAGGING_SELECT) {
    SMap.setAction(Action.PAN)
    const { layers } = _params.layers
    // 还原其他图层的选择状态
    // _setMyLayersSelectable(layers, true)
    for (let i = 0; i < layers.length; i++) {
      if (LayerUtils.getLayerType(layers[i]) === 'TAGGINGLAYER') {
        if (
          _params.currentLayer &&
          _params.currentLayer.name &&
          _params.currentLayer.name === layers[i].name
        ) {
          SMap.setLayerEditable(layers[i].path, true)
        }
      }
    }
    _params.setToolbarVisible(false)
  } else if (
    typeof type === 'string' &&
    type.indexOf('MAP_TOOL_MEASURE_') >= 0
  ) {
    ToolbarModule.addData({ pointArr: [], redoArr: [] })
    _params.setToolbarStatus({
      canUndo: false,
      canRedo: false,
    })
    SMap.setAction(Action.PAN)
    _params.showMeasureResult(false)
    _params.setToolbarVisible(false)
  } else if (type === ConstToolType.MAP_TOOL_RECTANGLE_CUT) {
    GLOBAL.MapSurfaceView && GLOBAL.MapSurfaceView.show(false)
    _params.setToolbarVisible(false)
  } else if (type === ConstToolType.MAP_TOOL_ATTRIBUTE_RELATE) {
    // 返回图层属性界面，并清除属性关联选中的对象
    NavigationService.navigate('LayerAttribute')
    await SMap.clearTrackingLayer()
    _params.currentLayer && SMap.selectObj(_params.currentLayer.path)
    _params.setToolbarVisible(false)
  } else if (type === ConstToolType.MAP_TOOL_ATTRIBUTE_SELECTION_RELATE) {
    // 返回框选/点选属性界面，并清除属性关联选中的对象
    NavigationService.navigate('LayerSelectionAttribute', {
      selectionAttribute: GLOBAL.SelectedSelectionAttribute,
      preType: _data.preType,
      preAction: async () => {
        const selection = []
        for (let i = 0; i < _params.selection.length; i++) {
          selection.push({
            layerPath: _params.selection[i].layerInfo.path,
            ids: _params.selection[i].ids,
          })
        }
        await SMap.clearTrackingLayer()
        await SMap.selectObjs(selection)
        _params.setToolbarVisible(false)
      },
    })
    // NavigationService.goBack()
  } else {
    return false
  }
}

export default {
  commit,
  showAttribute,
  showMenuBox,
  matchPictureStyle,
  pickerConfirm,
  pickerCancel,
  measureLength,
  measureArea,
  measureAngle,
  clearMeasure,
  undo,
  redo,
  listSelectableAction,
  close,

  begin,
  stop,
  submit,
  select,
  cancelSelect,
  viewEntire,
  pointSelect,
  selectByRectangle,
  rectangleCut,
  captureImage,
  tour,

  setting,
}
