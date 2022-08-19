/* global GLOBAL */
import ToolbarModule from '../ToolbarModule'
import { SMeasureView, SMap ,SARMap } from 'imobile_for_reactnative'
import { LayerUtils } from '../../../../../../utils'
import NavigationService from '../../../../../NavigationService'

function close() {}

function memu() {}

function showMenuBox() {}

function commit() {}

// 高精度采集
function collectSceneForm() {
  (async function() {
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (isSupportedARCore != 1) {
      global.ARServiceAction = isSupportedARCore
      global.ARDeviceListDialog.setVisible(true)
      return
    }

    // if (global.showAIDetect) {
    //   global.arSwitchToMap = true
    //   ;(await global.toolBox) && global.toolBox.switchAr()
    // }

    // let _point = await SMap.getCurrentLocation()
    // let point = { x: _point.longitude, y: _point.latitude }
    // global.MeasureCollectData.point = point
    SARMap.changeTrackingMode(1)
    global.toolBox && global.toolBox.setVisible(false,undefined,{isExistFullMap:false,measureType:'arCollect'})

    // let time = await SCollectSceneFormView.getSystemTime()
    // global.mapView.setState({ map: { height: 0 } })
    // const datasourceAlias = time
    // const datasetName = 'CollectSceneForm'
    // const datasetPointName = 'CollectPointSceneForm'
    // NavigationService.navigate('CollectSceneFormView', {
    //   datasourceAlias,
    //   datasetName,
    //   datasetPointName,
    // })

    // global.EnterDatumPointType = 'arCollectSceneForm'
    // // NavigationService.navigate('EnterDatumPoint')
    // global.toolBox && global.toolBox.removeAIDetect(true)
    // NavigationService.navigate('CollectSceneFormView')

    // NavigationService.navigate('InputPage', {
    //   headerTitle: getLanguage(global.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_NEWDATA,
    //   value: '',
    //   placeholder: getLanguage(global.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_SCENE_NEW_DATANAME,
    //   type: 'name',
    //   cb: async value => {
    //     NavigationService.goBack()
    //   },
    //   backcb: () => {
    //     NavigationService.goBack()
    //     if (global.arSwitchToMap) {
    //       global.arSwitchToMap = false
    //       global.toolBox && global.toolBox.switchAr()
    //     }
    //   },
    // })
  })()
}

// 户型图采集
function arMeasureCollect() {
  (async function() {
    const _params = ToolbarModule.getParams()
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (isSupportedARCore != 1) {
      global.ARServiceAction = isSupportedARCore
      global.ARDeviceListDialog.setVisible(true)
      return
    }
    let currentLayer = global.currentLayer
    let isTaggingLayer = false
    if (currentLayer) {
      let layerType = LayerUtils.getLayerType(currentLayer)
      isTaggingLayer = layerType === 'TAGGINGLAYER'
    }
    if (!isTaggingLayer) {
      let hasDefaultTagging = await SMap.hasDefaultTagging(
        _params.user.currentUser.userName,
      )
      if (!hasDefaultTagging) {
        await SMap.newTaggingDataset(
          `Default_Tagging_${_params.user.currentUser.userName}`,
          _params.user.currentUser.userName,
        )
      }
      let datasourceAlias = 'Label_' + _params.user.currentUser.userName + '#'
      let datasetName = `Default_Tagging_${_params.user.currentUser.userName}`
      global.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    } else {
      const datasourceAlias = currentLayer.datasourceAlias // 标注数据源名称
      const datasetName = currentLayer.datasetName // 标注图层名称
      global.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    }

    // NavigationService.navigate('MeasureView', global.MeasureCollectData)
    global.EnterDatumPointType = 'arMeasureCollect'
    NavigationService.navigate('EnterDatumPoint')

    if (global.showAIDetect) {
      global.arSwitchToMap = true
      ;(await global.toolBox) && global.toolBox.switchAr()
    }
  })()
}

// AR画线
function arDrawLine() {
  (async function() {
    const _params = ToolbarModule.getParams()
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (isSupportedARCore != 1) {
      global.ARServiceAction = isSupportedARCore
      global.ARDeviceListDialog.setVisible(true)
      return
    }
    /*
    let isTaggingLayer = false
    if (currentLayer) {
      let layerType = LayerUtils.getLayerType(currentLayer)
      isTaggingLayer = layerType === 'TAGGINGLAYER'
    }*/
    /**
     * 修改：原本只能绘制到标注图层
     * 改为如果绘制类型和图层类型相同，或者图层是CAD图层，则绘制在当前图层，否则绘制到标注图层
     * by zhaochaojie
     */
    let currentLayer = global.currentLayer
    const layerType = LayerUtils.getLayerType(currentLayer)

    // 是否绘制到标注图层
    let isDrawTaggingLayer = false
    if (!currentLayer || (!currentLayer.datasourceAlias && !currentLayer.datasetName)){
      // 当前没有选择图层，则绘制到标注图层
      isDrawTaggingLayer = true
    } else if(["LINELAYER","CADLAYER","TAGGINGLAYER"].indexOf(layerType) == -1) {
      // 当前图层不是线/CAD/标记图层，则绘制到默认标注图层
      isDrawTaggingLayer = true
    }
    if (isDrawTaggingLayer) {
      let hasDefaultTagging = await SMap.hasDefaultTagging(
        _params.user.currentUser.userName,
      )
      if (!hasDefaultTagging) {
        await SMap.newTaggingDataset(
          `Default_Tagging_${_params.user.currentUser.userName}`,
          _params.user.currentUser.userName,
        )
      }
      let datasourceAlias = 'Label_' + _params.user.currentUser.userName + '#'
      let datasetName = `Default_Tagging_${_params.user.currentUser.userName}`
      global.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    } else {
      // 否则画到当前图层
      const datasourceAlias = currentLayer.datasourceAlias
      const datasetName = currentLayer.datasetName
      global.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    }

    let _point = await SMap.getCurrentLocation()
    let point = { x: _point.longitude, y: _point.latitude }
    global.MeasureCollectData.point = point

    // global.toolBox && global.toolBox.removeAIDetect(true)
    // if (global.showAIDetect) {
    //   global.arSwitchToMap = true
    //   ;(await global.toolBox) && global.toolBox.switchAr()
    // }
    global.MeasureCollectData.measureType = 'drawLine'
    // NavigationService.navigate('MeasureAreaView', global.MeasureCollectData)

    global.toolBox && global.toolBox.setVisible(false,undefined,{isExistFullMap:false,measureType:'drawLine',point:point,datasourceAlias:global.MeasureCollectData.datasourceAlias,datasetName:global.MeasureCollectData.datasetName})
  })()
}

// AR画面
function arDrawArea() {
  (async function() {
    const _params = ToolbarModule.getParams()
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (isSupportedARCore != 1) {
      global.ARServiceAction = isSupportedARCore
      global.ARDeviceListDialog.setVisible(true)
      return
    }
    let currentLayer = global.currentLayer
    const layerType = LayerUtils.getLayerType(currentLayer)

    // 是否绘制到标注图层
    let isDrawTaggingLayer = false
    if (!currentLayer || (!currentLayer.datasourceAlias && !currentLayer.datasetName)){
      // 当前没有选择图层，则绘制到标注图层
      isDrawTaggingLayer = true
    } else if(["REGIONLAYER","CADLAYER","TAGGINGLAYER"].indexOf(layerType) == -1) {
      // 当前图层不是面线/CAD/标记图层，则绘制到默认标注图层
      isDrawTaggingLayer = true
    }

    if (isDrawTaggingLayer) {
      let hasDefaultTagging = await SMap.hasDefaultTagging(
        _params.user.currentUser.userName,
      )
      if (!hasDefaultTagging) {
        await SMap.newTaggingDataset(
          `Default_Tagging_${_params.user.currentUser.userName}`,
          _params.user.currentUser.userName,
        )
      }
      let datasourceAlias = 'Label_' + _params.user.currentUser.userName + '#'
      let datasetName = `Default_Tagging_${_params.user.currentUser.userName}`
      global.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    } else {
      const datasourceAlias = currentLayer.datasourceAlias
      const datasetName = currentLayer.datasetName
      global.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    }

    let _point = await SMap.getCurrentLocation()
    let point = { x: _point.longitude, y: _point.latitude }
    global.MeasureCollectData.point = point

    // global.toolBox && global.toolBox.removeAIDetect(true)
    // if (global.showAIDetect) {
    //   global.arSwitchToMap = true
    //   ;(await global.toolBox) && global.toolBox.switchAr()
    // }

    global.MeasureCollectData.measureType = 'arDrawArea'
    // NavigationService.navigate('MeasureAreaView', global.MeasureCollectData)
    global.toolBox && global.toolBox.setVisible(false,undefined,{isExistFullMap:false,measureType:'arDrawArea',point:point,datasourceAlias:global.MeasureCollectData.datasourceAlias,datasetName:global.MeasureCollectData.datasetName})
  })()
}

// AR画点
function arDrawPoint() {
  (async function() {
    const _params = ToolbarModule.getParams()
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (isSupportedARCore != 1) {
      global.ARServiceAction = isSupportedARCore
      global.ARDeviceListDialog.setVisible(true)
      return
    }
    let currentLayer = global.currentLayer
    const layerType = LayerUtils.getLayerType(currentLayer)

    // 是否绘制到标注图层
    let isDrawTaggingLayer = false
    if (!currentLayer || (!currentLayer.datasourceAlias && !currentLayer.datasetName)){
      // 当前没有选择图层，则绘制到标注图层
      isDrawTaggingLayer = true
    } else if(["POINTLAYER","CADLAYER","TAGGINGLAYER"].indexOf(layerType) == -1) {
      // 当前图层不是点线/CAD/标记图层，则绘制到默认标注图层
      isDrawTaggingLayer = true
    }

    if (isDrawTaggingLayer) {
      let hasDefaultTagging = await SMap.hasDefaultTagging(
        _params.user.currentUser.userName,
      )
      if (!hasDefaultTagging) {
        await SMap.newTaggingDataset(
          `Default_Tagging_${_params.user.currentUser.userName}`,
          _params.user.currentUser.userName,
        )
      }
      let datasourceAlias = 'Label_' + _params.user.currentUser.userName + '#'
      let datasetName = `Default_Tagging_${_params.user.currentUser.userName}`
      global.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    } else {
      const datasourceAlias = currentLayer.datasourceAlias
      const datasetName = currentLayer.datasetName
      global.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    }
    
    let _point = await SMap.getCurrentLocation()
    let point = { x: _point.longitude, y: _point.latitude }
    global.MeasureCollectData.point = point

    // global.toolBox && global.toolBox.removeAIDetect(true)
    // if (global.showAIDetect) {
    //   global.arSwitchToMap = true
    //   ;(await global.toolBox) && global.toolBox.switchAr()
    // }

    global.MeasureCollectData.measureType = 'arDrawPoint'
    // NavigationService.navigate('MeasureAreaView', global.MeasureCollectData)
    global.toolBox && global.toolBox.setVisible(false,undefined,{isExistFullMap:false,measureType:'arDrawPoint',point:point,datasourceAlias:global.MeasureCollectData.datasourceAlias,datasetName:global.MeasureCollectData.datasetName})
  })()
}

export default {
  close,
  memu,
  showMenuBox,
  commit,

  collectSceneForm,
  arMeasureCollect,
  arDrawLine,
  arDrawArea,
  arDrawPoint,
}
