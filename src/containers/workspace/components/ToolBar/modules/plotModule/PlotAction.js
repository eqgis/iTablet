import React from 'react'
import { SMap, Action } from 'imobile_for_reactnative'
import {
  ConstToolType,
  ConstInfo,
  ConstPath,
  ToolbarType,
  TouchType,
} from '../../../../../../constants'
import { StyleUtils, Toast } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import { FileTools } from '../../../../../../native'
import ToolbarModule from '../ToolbarModule'
import PlotData from './PlotData'
import { PlotAnimationView, AnimationNodeListView } from './customView'
import NavigationService from '../../../../../NavigationService'

// function commit(type) {
//   const params = ToolbarModule.getParams()
//   let currentToolbarType = ''
//   if (type === ConstToolType.MAP_EDIT_DEFAULT) {
//     // 编辑完成关闭Toolbar
//     params.setToolbarVisible(false, '', {
//       cb: () => {
//         SMap.setAction(Action.PAN)
//       },
//     })
//   } else if (
//     type !== ConstToolType.MAP_TOOL_TAGGING &&
//     type !== ConstToolType.MAP_TOOL_TAGGING_SETTING
//   ) {
//     currentToolbarType = ConstToolType.MAP_EDIT_DEFAULT
//     // 编辑完成关闭Toolbar
//     // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
//     params.setToolbarVisible(true, ConstToolType.MAP_EDIT_DEFAULT, {
//       isFullScreen: false,
//       height: 0,
//       cb: () => {
//         SMap.submit()
//         SMap.setAction(Action.SELECT)
//       },
//     })
//   }
//   ToolbarModule.addData({
//     type: currentToolbarType,
//   })
// }

function listAction(type, params = {}) {
  switch (type) {
    case ConstToolType.PLOT_ANIMATION_XML_LIST:
      SMap.readAnimationXmlFile(params.item.path)
      animationPlay()
      break
    case ConstToolType.PLOT_LIB_CHANGE:
      changePlotLib(params.item)
      break
    case ConstToolType.MAP_PLOTTING_ANIMATION:
      PlotData.getAnimationList()
      break
  }
}

async function geometrySelected(event) {
  const params = ToolbarModule.getParams()
  const currentToolbarType = ToolbarModule.getData().type
  switch (currentToolbarType) {
    case ConstToolType.PLOTTING_ANIMATION: {
      const type = await SMap.getGeometryTypeById(
        event.layerInfo.name,
        event.id,
      )
      if (type === -1) {
        Toast.show(
          getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_SYMBOL,
        )
        SMap.setAction(Action.PAN)
      } else {
        params.setToolbarVisible(
          true,
          ConstToolType.PLOT_ANIMATION_NODE_CREATE,
          {
            isFullScreen: true,
            height: ConstToolType.TOOLBAR_HEIGHT[5],
            // containerType: ToolbarType.createPlotAnimation,
            customView: _props => (
              <PlotAnimationView
                ref={ref => (this.plotAnimationView = ref)}
                saveAndContinue={() => {
                  const createInfo =
                    this.plotAnimationView &&
                    this.plotAnimationView.getCreateInfo()
                  if (
                    _props.selection.length > 0 &&
                    _props.selection[0].ids > 0
                  ) {
                    createInfo.geoId = _props.selection[0].ids[0]
                    createInfo.layerName = _props.selection[0].layerInfo.name
                  }
                  if (createInfo.animationMode !== -1) {
                    SMap.createAnimationGo(createInfo, GLOBAL.newPlotMapName)
                  }
                }}
                savePlotAnimationNode={() => {
                  const createInfo =
                    this.plotAnimationView &&
                    this.plotAnimationView.getCreateInfo()
                  if (
                    _props.selection.length > 0 &&
                    _props.selection[0].ids > 0
                  ) {
                    createInfo.geoId = _props.selection[0].ids[0]
                    createInfo.layerName = _props.selection[0].layerInfo.name
                  }
                  if (createInfo.animationMode !== -1) {
                    SMap.createAnimationGo(createInfo, GLOBAL.newPlotMapName)
                  }
                  GLOBAL.TouchType = TouchType.NULL
                  GLOBAL.animationWayData && (GLOBAL.animationWayData = null)

                  const height = 0
                  params.showFullMap && params.showFullMap(true)
                  const type = ConstToolType.PLOT_ANIMATION_START
                  params.setToolbarVisible(true, type, {
                    isFullScreen: false,
                    height,
                    cb: () => SMap.setAction(Action.SELECT),
                  })
                }}
                layerName={
                  _props.selection[0] && _props.selection[0].layerInfo.name
                }
                geoId={_props.selection[0] && _props.selection[0].ids[0]}
                device={params.device}
                showToolbar={params.setToolbarVisible}
              />
            ),
          },
        )
      }
      break
    }
  }
}

function showSymbol() {
  const params = ToolbarModule.getParams()
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, ConstToolType.MAP_SYMBOL, {
    isFullScreen: true,
    containerType: ToolbarType.tabs,
    // height:
    //   params.device.orientation.indexOf('PORTRAIT') >= 0
    //     ? ConstToolType.HEIGHT[3]
    //     : ConstToolType.THEME_HEIGHT[4],
    // column: params.device.orientation.indexOf('LANDSCAPE') === 0 ? 8 : 4,
  })
}

/** 标绘分类点击事件 * */
async function showCollection(libId, symbolCode, type) {
  // await SMap.addCadLayer('PlotEdit')
  StyleUtils.setDefaultMapControlStyle().then(() => {})
  await SMap.setPlotSymbol(libId, symbolCode)
  const { data, buttons } = PlotData.getCollectionData(
    libId,
    symbolCode,
    ToolbarModule.getParams(),
  )
  if (!ToolbarModule.getParams().setToolbarVisible) return
  // ToolbarModule.getParams().setLastState()
  const column = 4
  const rows = Math.ceil(data.length / column) - 1 + 1
  let height
  switch (rows) {
    case 2:
      height = ConstToolType.HEIGHT[2]
      break
    case 1:
    default:
      height = ConstToolType.HEIGHT[0]
      break
  }
  ToolbarModule.getParams().showFullMap(true)
  ToolbarModule.getParams().setToolbarVisible(true, type, {
    isFullScreen: false,
    height,
    data,
    buttons,
    column,
    cb: () => {
      ToolbarModule.getParams().setLastState()
      // createCollector(type)
    },
  })
}

function cancelAnimationWay() {
  // GLOBAL.animationWayData && (GLOBAL.animationWayData.points = null)
  // SMap.endAnimationWayPoint(false)
  const params = ToolbarModule.getParams()
  SMap.refreshAnimationWayPoint()
  const type = ConstToolType.PLOT_ANIMATION_NODE_CREATE
  params.setToolbarVisible(true, type, {
    isFullScreen: true,
    height: ConstToolType.TOOLBAR_HEIGHT[5],
    containerType: 'createPlotAnimation',
    cb: () => {},
  })
}

async function endAnimationWayPoint() {
  const params = ToolbarModule.getParams()
  const wayPoints = await SMap.endAnimationWayPoint(true)
  GLOBAL.animationWayData && (GLOBAL.animationWayData.wayPoints = wayPoints)

  const type = ConstToolType.PLOT_ANIMATION_NODE_CREATE
  params.setToolbarVisible(true, type, {
    isFullScreen: true,
    height: ConstToolType.TOOLBAR_HEIGHT[5],
    containerType: 'createPlotAnimation',
    cb: () => {},
  })
}

async function animationWayUndo() {
  await SMap.addAnimationWayPoint(null, false)
}

async function collectionSubmit(libId, symbolCode) {
  await SMap.submit()
  await SMap.refreshMap()
  SMap.setPlotSymbol(libId, symbolCode)

  ToolbarModule.getParams().getLayers(-1, async layers => {
    let plotLayer
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].name.indexOf('PlotEdit_') !== -1) {
        plotLayer = layers[i]
        break
      }
    }
    if (plotLayer) {
      ToolbarModule.getParams().setCurrentLayer(plotLayer)
    }
  })
}

async function cancel(libId, symbolCode) {
  SMap.cancel()
  SMap.setPlotSymbol(libId, symbolCode)
}

function undo() {
  SMap.undo()
  SMap.refreshMap()
}

function redo() {
  SMap.redo()
  SMap.refreshMap()
}

function reset() {
  // SMap.animationStop()
  SMap.animationReset()
  const height = 0
  ToolbarModule.getParams().showFullMap &&
    ToolbarModule.getParams().showFullMap(true)
  const type = ConstToolType.PLOT_ANIMATION_START
  ToolbarModule.getParams().setToolbarVisible(true, type, {
    isFullScreen: false,
    height,
    cb: () => SMap.setAction(Action.SELECT),
  })
}

/** 切换标绘库 * */
async function changePlotLib(item) {
  const params = ToolbarModule.getParams()
  try {
    ToolbarModule.getParams().setContainerLoading(
      true,
      getLanguage(params.language).Prompt.SWITCHING_PLOT_LIB,
      // ConstInfo.MAP_CHANGING
    )
    const libIds = params.template.plotLibIds
    if (libIds !== undefined) {
      const result = await SMap.removePlotSymbolLibraryArr(libIds)
      if (result) {
        const plotPath = await FileTools.appendingHomeDirectory(
          // ConstPath.UserPath + ConstPath.RelativeFilePath.Plotting,
          item.path,
        )
        ToolbarModule.getParams().getSymbolPlots({
          path: plotPath,
          isFirst: false,
        })
      }
    }
    Toast.show(
      getLanguage(params.language).Prompt.SWITCHING_SUCCESS,
      // ConstInfo.CHANGE_MAP_TO + mapInfo.name
    )
    ToolbarModule.getParams().setContainerLoading(false)
    ToolbarModule.getParams().setToolbarVisible(false)
  } catch (e) {
    Toast.show(ConstInfo.CHANGE_PLOT_LIB_FAILED)
    params.setContainerLoading(false)
  }
}

async function animationSave() {
  const params = ToolbarModule.getParams()
  const mapName = await SMap.getMapName()
  const userName = params.user.currentUser.userName || 'Customer'
  const savePath = await FileTools.appendingHomeDirectory(
    `${ConstPath.UserPath + userName}/${
      ConstPath.RelativeFilePath.Animation
    }/${mapName}`,
  )
  const defaultAnimationName = mapName
  NavigationService.navigate('InputPage', {
    headerTitle: getLanguage(global.language).Map_Main_Menu.PLOT_SAVE_ANIMATION,
    // '保存推演动画',
    value: defaultAnimationName,
    placeholder: getLanguage(global.language).Prompt.ENTER_ANIMATION_NAME,
    type: 'name',
    cb: async value => {
      GLOBAL.Loading &&
        GLOBAL.Loading.setLoading(
          true,
          getLanguage(global.language).Prompt.SAVEING,
        )
      await SMap.animationSave(savePath, value)

      GLOBAL.Loading && GLOBAL.Loading.setLoading(false)

      NavigationService.goBack()
      Toast.show(getLanguage(params.language).Prompt.SAVE_SUCCESSFULLY)
    },
  })
}

function showAnimationNodeList() {
  const params = ToolbarModule.getParams()
  params.setToolbarVisible(true, ConstToolType.PLOT_ANIMATION_GO_OBJECT_LIST, {
    isFullScreen: true,
    height: ConstToolType.TOOLBAR_HEIGHT[5],
    containerType: ToolbarType.animationNode,
    // cb: () => {},
    customView: _props => (
      <AnimationNodeListView
        data={_props.data}
        type={_props.type}
        device={_props.device}
      />
    ),
  })
}

async function showAnimationXmlList() {
  const params = ToolbarModule.getParams()
  params.showFullMap && params.showFullMap(true)
  const _data = await PlotData.getAnimationList()
  params.setToolbarVisible(true, ConstToolType.PLOT_ANIMATION_XML_LIST, {
    data: _data.data,
    buttons: _data.buttons,
    containerType: ToolbarType.list,
    isFullScreen: true,
    height:
      params.device.orientation.indexOf('LANDSCAPE') === 0
        ? ConstToolType.THEME_HEIGHT[4]
        : ConstToolType.HEIGHT[3],
  })
}

async function animationPlay() {
  const params = ToolbarModule.getParams()
  // const height = ConstToolType.HEIGHT[0]
  params.showFullMap && params.showFullMap(true)
  const type = ConstToolType.PLOT_ANIMATION_PLAY
  params.setToolbarVisible(true, type, {
    isFullScreen: false,
    // height,
    // column: 4,
    containerType: ToolbarType.table,
    // cb: () => SMap.setAction(Action.SELECT),
  })
}

function close() {
  const params = ToolbarModule.getParams()
  const data = ToolbarModule.getData()
  if (data.type === ConstToolType.PLOTTING_ANIMATION) {
    SMap.animationClose()
    SMap.setAction(Action.PAN)
    SMap.endAnimationWayPoint(false)
    GLOBAL.TouchType = TouchType.NULL
    GLOBAL.animationWayData && (GLOBAL.animationWayData = null)
    params.setToolbarVisible(false)
  } else if (
    data.type === ConstToolType.PLOT_ANIMATION_PLAY ||
    data.type === ConstToolType.PLOT_ANIMATION_START
  ) {
    SMap.animationClose()
    params.setToolbarVisible(false)
  } else {
    SMap.setAction(Action.PAN)
    params.setToolbarVisible(false)
  }
  ToolbarModule.setData() // 关闭Toolbar清除临时数据
}

function overlayOnPress() {}

const actions = {
  // commit,
  listAction,
  close,
  overlayOnPress,

  geometrySelected,
  showSymbol,
  showCollection,
  changePlotLib,
  cancelAnimationWay,
  endAnimationWayPoint,
  animationWayUndo,
  collectionSubmit,
  cancel,
  undo,
  redo,
  reset,
  animationPlay,
  animationSave,
  showAnimationNodeList,
  showAnimationXmlList,
}
export default actions
