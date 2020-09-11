import ToolbarModule from '../ToolbarModule'
import { SMeasureView, SMap } from 'imobile_for_reactnative'
import { Toast, LayerUtils } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import NavigationService from '../../../../../NavigationService'

function close() {}

function memu() {}

function showMenuBox() {}

function commit() {}

// 高精度采集
function collectSceneForm() {
  (async function() {
    const _params = ToolbarModule.getParams()
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      Toast.show(getLanguage(_params.language).Prompt.DONOT_SUPPORT_ARCORE)
      return
    }

    if (GLOBAL.showAIDetect) {
      GLOBAL.isswitch = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }

    // let time = await SCollectSceneFormView.getSystemTime()
    // GLOBAL.mapView.setState({ map: { height: 0 } })
    // GLOBAL.newcollectData = time
    // const datasourceAlias = time
    // const datasetName = 'CollectSceneForm'
    // const datasetPointName = 'CollectPointSceneForm'
    // NavigationService.navigate('CollectSceneFormView', {
    //   datasourceAlias,
    //   datasetName,
    //   datasetPointName,
    // })

    GLOBAL.EnterDatumPointType = 'arCollectSceneForm'
    NavigationService.navigate('EnterDatumPoint')

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
    //     if (GLOBAL.isswitch) {
    //       GLOBAL.isswitch = false
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
      Toast.show(getLanguage(_params.language).Prompt.DONOT_SUPPORT_ARCORE)
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
        let data = await SMap.newTaggingDataset(
          'Default_Tagging',
          _params.user.currentUser.userName,
        )
        GLOBAL.TaggingDatasetName = data && data.datasetName
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
      GLOBAL.isswitch = true
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
      Toast.show(getLanguage(_params.language).Prompt.DONOT_SUPPORT_ARCORE)
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
        let data = await SMap.newTaggingDataset(
          'Default_Tagging',
          _params.user.currentUser.userName,
        )
        GLOBAL.TaggingDatasetName = data && data.datasetName
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

    let _point = await SMap.getCurrentLocation()
    let point = { x: _point.longitude, y: _point.latitude }
    GLOBAL.MeasureCollectData.point = point

    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    if (GLOBAL.showAIDetect) {
      GLOBAL.isswitch = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }
    GLOBAL.MeasureCollectData.measureType = 'drawLine'
    NavigationService.navigate('MeasureAreaView', GLOBAL.MeasureCollectData)
  })()
}

// AR画面
function arDrawArea() {
  (async function() {
    const _params = ToolbarModule.getParams()
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      Toast.show(getLanguage(_params.language).Prompt.DONOT_SUPPORT_ARCORE)
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
        let data = await SMap.newTaggingDataset(
          'Default_Tagging',
          _params.user.currentUser.userName,
        )
        GLOBAL.TaggingDatasetName = data && data.datasetName
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

    let _point = await SMap.getCurrentLocation()
    let point = { x: _point.longitude, y: _point.latitude }
    GLOBAL.MeasureCollectData.point = point

    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    if (GLOBAL.showAIDetect) {
      GLOBAL.isswitch = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }

    GLOBAL.MeasureCollectData.measureType = 'arDrawArea'
    NavigationService.navigate('MeasureAreaView', GLOBAL.MeasureCollectData)
  })()
}

// AR画点
function arDrawPoint() {
  (async function() {
    const _params = ToolbarModule.getParams()
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      Toast.show(getLanguage(_params.language).Prompt.DONOT_SUPPORT_ARCORE)
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
        let data = await SMap.newTaggingDataset(
          'Default_Tagging',
          _params.user.currentUser.userName,
        )
        GLOBAL.TaggingDatasetName = data && data.datasetName
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

    let _point = await SMap.getCurrentLocation()
    let point = { x: _point.longitude, y: _point.latitude }
    GLOBAL.MeasureCollectData.point = point

    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    if (GLOBAL.showAIDetect) {
      GLOBAL.isswitch = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }

    GLOBAL.MeasureCollectData.measureType = 'arDrawPoint'
    NavigationService.navigate('MeasureAreaView', GLOBAL.MeasureCollectData)
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
