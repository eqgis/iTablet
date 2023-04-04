/* global GLOBAL */
import React from 'react'
import { SData, SMap, SPlot } from 'imobile_for_reactnative'
import { Action,  } from 'imobile_for_reactnative/NativeModule/interfaces/mapping/SMap'
import {
  ConstToolType,
  ConstInfo,
  ConstPath,
  ToolbarType,
  TouchType,
} from '../../../../../../constants'
import { StyleUtils, Toast, LayerUtils } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import { FileTools } from '../../../../../../native'
import ToolbarModule from '../ToolbarModule'
import PlotData from './PlotData'
import { PlotAnimationView, AnimationNodeListView } from './customView'
import NavigationService from '../../../../../NavigationService'


async function listAction(type, params = {}) {
  const _params = ToolbarModule.getParams()
  switch (type) {
    case ConstToolType.SM_MAP_PLOT_ANIMATION_XML_LIST:
      await SMap.setLayerEditable(_params.currentLayer.path, true)
      SPlot.readAnimationXmlFile(params.item.path)
      animationPlay()
      break
    case ConstToolType.SM_MAP_PLOT_LIB_CHANGE:
      changePlotLib(params.item)
      break
    case ConstToolType.SM_MAP_PLOT_ANIMATION_TEMP:
      PlotData.getAnimationList()
      break
  }
}

let plotAnimationView = null
async function geometrySelected(event) {
  const params = ToolbarModule.getParams()
  const currentToolbarType = ToolbarModule.getData().type
  switch (currentToolbarType) {
    case ConstToolType.SM_MAP_PLOT_ANIMATION: {
      const recordArry = await SData.queryRecordset(
        {
          datasetName: event.layerInfo.datasetName,
          datasourceName: event.layerInfo.datasourceAlias
        },
        {queryIDs:[event.id]}
      )

      let type = -1
      for(let i=0;i<recordArry.length;i++){
        if(recordArry[i].geometry.id === event.id){
          type = recordArry[i].geometry.graphicObjectType
        }
      }

      // const type = await SPlot.getGraphicObjectType(
      //   event.layerInfo.name,
      //   event.id,
      // )
      if (type === -1 || type == undefined) {
        Toast.show(
          getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_SYMBOL,
        )
        SMap.setAction(Action.PAN)
      } else {
        params.setToolbarVisible(
          true,
          ConstToolType.SM_MAP_PLOT_ANIMATION_NODE_CREATE,
          {
            isFullScreen: true,
            containerType: ToolbarType.createPlotAnimation,
            customView: _props => (
              <PlotAnimationView
                ref={ref => (plotAnimationView = ref)}
                saveAndContinue={async () => {
                  const createInfo =
                    plotAnimationView &&
                    plotAnimationView.getCreateInfo()
                  if (
                    _props.selection.length > 0 &&
                    _props.selection[0].ids > 0
                  ) {
                    createInfo.geoId = _props.selection[0].ids[0]
                    createInfo.layerName = _props.selection[0].layerInfo.name
                  }
                  if (createInfo.animationType !== -1) {
                    const mapName = await SMap.getMapName()
                    if(mapName===''){
                      SMap.saveMap()
                    }
                    SPlot.createAnimation(createInfo)
                  }
                }}
                savePlotAnimationNode={async () => {
                  const createInfo =
                    plotAnimationView &&
                    plotAnimationView.getCreateInfo()
                  if (
                    _props.selection.length > 0 &&
                    _props.selection[0].ids > 0
                  ) {
                    createInfo.geoId = _props.selection[0].ids[0]
                    createInfo.layerName = _props.selection[0].layerInfo.name
                  }
                  if (createInfo.animationType !== -1) {
                    const mapName = await SMap.getMapName()
                    if(mapName===''){
                      SMap.saveMap()
                    }
                    SPlot.createAnimation(createInfo)
                  }
                  global.TouchType = TouchType.NULL
                  global.animationWayData && (global.animationWayData = null)

                  const height = 0
                  params.showFullMap && params.showFullMap(true)
                  const type = ConstToolType.SM_MAP_PLOT_ANIMATION_START
                  params.setToolbarVisible(true, type, {
                    isFullScreen: false,
                    height,
                    cb: () => SMap.setAction(Action.SELECT),
                  })
                }}
                layerName={
                  _props.selection[0] && _props.selection[0].layerInfo.name
                }
                layerInfo={_props.selection[0] && _props.selection[0].layerInfo}
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
  params.setToolbarVisible(true, ConstToolType.SM_MAP_COLLECTION_SYMBOL, {
    isFullScreen: true,
    containerType: ToolbarType.tabs,
    cb: () => {
      SMap.cancel()
    },
  })
}

/** 标绘分类点击事件 * */
async function showCollection(libId, symbolCode, type) {
  // await SMap.addCadLayer('PlotEdit')
  const params = ToolbarModule.getParams()
  if (params.currentLayer) {
    await SMap.setLayerEditable(params.currentLayer.path, true)
  }
  StyleUtils.setDefaultMapControlStyle().then(() => {})
  await SPlot.setPlotSymbol(libId, symbolCode)
  const { data, buttons } = PlotData.getCollectionData(
    libId,
    symbolCode,
    ToolbarModule.getParams(),
  )
  if (!ToolbarModule.getParams().setToolbarVisible) return
  // ToolbarModule.getParams().setLastState()
  // const column = 4
  // const rows = Math.ceil(data.length / column) - 1 + 1
  // let height
  // switch (rows) {
  //   case 2:
  //     height = ConstToolType.HEIGHT[2]
  //     break
  //   case 1:
  //   default:
  //     height = ConstToolType.HEIGHT[0]
  //     break
  // }
  ToolbarModule.getParams().showFullMap(true)
  ToolbarModule.getParams().setToolbarVisible(true, type, {
    isFullScreen: false,
    // height,
    data,
    buttons,
    // column,
    cb: () => {
      ToolbarModule.getParams().setLastState()
      // createCollector(type)
    },
  })
}

function cancelAnimationWay() {
  // global.animationWayData && (global.animationWayData.points = null)
  // SMap.endAnimationWayPoint(false)
  const params = ToolbarModule.getParams()
  // SPlot.refreshAnimationWayPoint()
  const type = ConstToolType.SM_MAP_PLOT_ANIMATION_NODE_CREATE
  params.setToolbarVisible(true, type, {
    isFullScreen: true,
    height: ConstToolType.TOOLBAR_HEIGHT[5],
    containerType: 'createPlotAnimation',
    cb: () => {},
  })
}

async function endAnimationWayPoint() {
  const params = ToolbarModule.getParams()
  // const wayPoints = await SPlot.endAnimationWayPoint(true)
  // global.animationWayData && (global.animationWayData.wayPoints = wayPoints)

  const type = ConstToolType.SM_MAP_PLOT_ANIMATION_NODE_CREATE
  params.setToolbarVisible(true, type, {
    isFullScreen: true,
    height: ConstToolType.TOOLBAR_HEIGHT[5],
    containerType: 'createPlotAnimation',
    cb: () => {},
  })
}

async function animationWayUndo() {
  // await SPlot.unDoAnimationWayPoint()
}

async function collectionSubmit(libId, symbolCode) {
  const params = ToolbarModule.getParams()
  await SMap.submit().then(async result => {
    if (result) {
      await SMap.refreshMap()
      await SMap.setLayerEditable(params.currentLayer.path, true)
      SPlot.setPlotSymbol(libId, symbolCode)

      ToolbarModule.getParams().getLayers(-1, async layers => {
        // let plotLayer
        // for (let i = 0; i < layers.length; i++) {
        //   if (layers[i].name.indexOf('PlotEdit_') !== -1) {
        //     plotLayer = layers[i]
        //     break
        //   }
        // }
        // if (plotLayer) {
        //   ToolbarModule.getParams().setCurrentLayer(plotLayer)
        let layerType = LayerUtils.getLayerType(params.currentLayer)
        if (layerType !== 'TAGGINGLAYER' && global.coworkMode && global.getFriend) {
          let currentTaskInfo = params.coworkInfo?.[params.user.currentUser.userName]?.[params.currentTask.groupID]?.[params.currentTask.id]
          let isRealTime = currentTaskInfo?.isRealTime === undefined ? false : currentTaskInfo.isRealTime
          let friend = global.getFriend()
          isRealTime && friend.onGeometryAdd(params.currentLayer)
        }
      })
    }
  })
}

async function cancel(libId, symbolCode) {
  SMap.cancel()
  SPlot.setPlotSymbol(libId, symbolCode)
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
  SPlot.animationReset()
  const height = 0
  ToolbarModule.getParams().showFullMap &&
    ToolbarModule.getParams().showFullMap(true)
  const type = ConstToolType.SM_MAP_PLOT_ANIMATION_START
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
      let result
      for(let i =0 ;i<libIds.length;i++){
        result = await SPlot.removePlotSymbolLibrary(libIds[i])
      }
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
      try {
        global.Loading &&
          global.Loading.setLoading(
            true,
            getLanguage(global.language).Prompt.SAVEING,
          )
        await SPlot.animationSave(savePath, value)

        global.Loading && global.Loading.setLoading(false)

        NavigationService.goBack()
        Toast.show(getLanguage(params.language).Prompt.SAVE_SUCCESSFULLY)
      } catch (error) {
        global.Loading && global.Loading.setLoading(false)
      }
    },
  })
}

function showAnimationNodeList() {
  const params = ToolbarModule.getParams()
  params.setToolbarVisible(true, ConstToolType.SM_MAP_PLOT_ANIMATION_GO_OBJECT_LIST, {
    isFullScreen: true,
    // height:
    //   params.device.orientation === 'PORTRAIT'
    //     ? Height.LIST_HEIGHT_P
    //     : Height.LIST_HEIGHT_L,
    containerType: ToolbarType.list,
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
  params.setToolbarVisible(true, ConstToolType.SM_MAP_PLOT_ANIMATION_XML_LIST, {
    data: _data.data,
    buttons: _data.buttons,
    containerType: ToolbarType.list,
    isFullScreen: true,
    // height:
    //   params.device.orientation.indexOf('LANDSCAPE') === 0
    //     ? ConstToolType.THEME_HEIGHT[4]
    //     : ConstToolType.HEIGHT[3],
  })
}

async function animationPlay() {
  const params = ToolbarModule.getParams()
  // const height = ConstToolType.HEIGHT[0]
  params.showFullMap && params.showFullMap(true)
  const type = ConstToolType.SM_MAP_PLOT_ANIMATION_PLAY
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
  if (data.type === ConstToolType.SM_MAP_PLOT_ANIMATION) {
    SPlot.animationClose()
    SMap.setAction(Action.PAN)
    // SPlot.endAnimationWayPoint(false)
    global.TouchType = TouchType.NULL
    global.animationWayData && (global.animationWayData = null)
    params.setToolbarVisible(false)
  } else if (
    data.type === ConstToolType.SM_MAP_PLOT_ANIMATION_PLAY ||
    data.type === ConstToolType.SM_MAP_PLOT_ANIMATION_START
  ) {
    SPlot.animationClose()
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
