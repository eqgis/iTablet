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
    if (!isSupportedARCore) {
      GLOBAL.ARDeviceListDialog.setVisible(true)
      return
    }

    // if (GLOBAL.showAIDetect) {
    //   GLOBAL.arSwitchToMap = true
    //   ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    // }

    // let _point = await SMap.getCurrentLocation()
    // let point = { x: _point.longitude, y: _point.latitude }
    // GLOBAL.MeasureCollectData.point = point
    SARMap.changeTrackingMode(1)
    GLOBAL.toolBox && GLOBAL.toolBox.setVisible(false,undefined,{isExistFullMap:false,measureType:'arCollect'})

    // let time = await SCollectSceneFormView.getSystemTime()
    // GLOBAL.mapView.setState({ map: { height: 0 } })
    // const datasourceAlias = time
    // const datasetName = 'CollectSceneForm'
    // const datasetPointName = 'CollectPointSceneForm'
    // NavigationService.navigate('CollectSceneFormView', {
    //   datasourceAlias,
    //   datasetName,
    //   datasetPointName,
    // })

    // GLOBAL.EnterDatumPointType = 'arCollectSceneForm'
    // // NavigationService.navigate('EnterDatumPoint')
    // GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    // NavigationService.navigate('CollectSceneFormView')

    // NavigationService.navigate('InputPage', {
    //   headerTitle: getLanguage(GLOBAL.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_NEWDATA,
    //   value: '',
    //   placeholder: getLanguage(GLOBAL.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_SCENE_NEW_DATANAME,
    //   type: 'name',
    //   cb: async value => {
    //     NavigationService.goBack()
    //   },
    //   backcb: () => {
    //     NavigationService.goBack()
    //     if (GLOBAL.arSwitchToMap) {
    //       GLOBAL.arSwitchToMap = false
    //       GLOBAL.toolBox && GLOBAL.toolBox.switchAr()
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
    if (!isSupportedARCore) {
      GLOBAL.ARDeviceListDialog.setVisible(true)
      return
    }
    let currentLayer = GLOBAL.currentLayer
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
          'Default_Tagging',
          _params.user.currentUser.userName,
        )
      }
      let datasourceAlias = 'Label_' + _params.user.currentUser.userName + '#'
      let datasetName = 'Default_Tagging'
      GLOBAL.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    } else {
      const datasourceAlias = currentLayer.datasourceAlias // 标注数据源名称
      const datasetName = currentLayer.datasetName // 标注图层名称
      GLOBAL.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    }

    // NavigationService.navigate('MeasureView', GLOBAL.MeasureCollectData)
    GLOBAL.EnterDatumPointType = 'arMeasureCollect'
    NavigationService.navigate('EnterDatumPoint')

    if (GLOBAL.showAIDetect) {
      GLOBAL.arSwitchToMap = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }
  })()
}

// AR画线
function arDrawLine() {
  (async function() {
    const _params = ToolbarModule.getParams()
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      GLOBAL.ARDeviceListDialog.setVisible(true)
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
    let currentLayer = GLOBAL.currentLayer
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
          'Default_Tagging',
          _params.user.currentUser.userName,
        )
      }
      let datasourceAlias = 'Label_' + _params.user.currentUser.userName + '#'
      let datasetName = 'Default_Tagging'
      GLOBAL.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    } else {
      // 否则画到当前图层
      const datasourceAlias = currentLayer.datasourceAlias
      const datasetName = currentLayer.datasetName
      GLOBAL.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    }

    let _point = await SMap.getCurrentLocation()
    let point = { x: _point.longitude, y: _point.latitude }
    GLOBAL.MeasureCollectData.point = point

    // GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    // if (GLOBAL.showAIDetect) {
    //   GLOBAL.arSwitchToMap = true
    //   ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    // }
    GLOBAL.MeasureCollectData.measureType = 'drawLine'
    // NavigationService.navigate('MeasureAreaView', GLOBAL.MeasureCollectData)

    GLOBAL.toolBox && GLOBAL.toolBox.setVisible(false,undefined,{isExistFullMap:false,measureType:'drawLine',point:point,datasourceAlias:GLOBAL.MeasureCollectData.datasourceAlias,datasetName:GLOBAL.MeasureCollectData.datasetName})
  })()
}

// AR画面
function arDrawArea() {
  (async function() {
    const _params = ToolbarModule.getParams()
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      GLOBAL.ARDeviceListDialog.setVisible(true)
      return
    }
    let currentLayer = GLOBAL.currentLayer
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
          'Default_Tagging',
          _params.user.currentUser.userName,
        )
      }
      let datasourceAlias = 'Label_' + _params.user.currentUser.userName + '#'
      let datasetName = 'Default_Tagging'
      GLOBAL.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    } else {
      const datasourceAlias = currentLayer.datasourceAlias
      const datasetName = currentLayer.datasetName
      GLOBAL.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    }

    let _point = await SMap.getCurrentLocation()
    let point = { x: _point.longitude, y: _point.latitude }
    GLOBAL.MeasureCollectData.point = point

    // GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    // if (GLOBAL.showAIDetect) {
    //   GLOBAL.arSwitchToMap = true
    //   ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    // }

    GLOBAL.MeasureCollectData.measureType = 'arDrawArea'
    // NavigationService.navigate('MeasureAreaView', GLOBAL.MeasureCollectData)
    GLOBAL.toolBox && GLOBAL.toolBox.setVisible(false,undefined,{isExistFullMap:false,measureType:'arDrawArea',point:point,datasourceAlias:GLOBAL.MeasureCollectData.datasourceAlias,datasetName:GLOBAL.MeasureCollectData.datasetName})
  })()
}

// AR画点
function arDrawPoint() {
  (async function() {
    const _params = ToolbarModule.getParams()
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      GLOBAL.ARDeviceListDialog.setVisible(true)
      return
    }
    let currentLayer = GLOBAL.currentLayer
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
          'Default_Tagging',
          _params.user.currentUser.userName,
        )
      }
      let datasourceAlias = 'Label_' + _params.user.currentUser.userName + '#'
      let datasetName = 'Default_Tagging'
      GLOBAL.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    } else {
      const datasourceAlias = currentLayer.datasourceAlias
      const datasetName = currentLayer.datasetName
      GLOBAL.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    }
    
    let _point = await SMap.getCurrentLocation()
    let point = { x: _point.longitude, y: _point.latitude }
    GLOBAL.MeasureCollectData.point = point

    // GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    // if (GLOBAL.showAIDetect) {
    //   GLOBAL.arSwitchToMap = true
    //   ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    // }

    GLOBAL.MeasureCollectData.measureType = 'arDrawPoint'
    // NavigationService.navigate('MeasureAreaView', GLOBAL.MeasureCollectData)
    GLOBAL.toolBox && GLOBAL.toolBox.setVisible(false,undefined,{isExistFullMap:false,measureType:'arDrawPoint',point:point,datasourceAlias:GLOBAL.MeasureCollectData.datasourceAlias,datasetName:GLOBAL.MeasureCollectData.datasetName})
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
