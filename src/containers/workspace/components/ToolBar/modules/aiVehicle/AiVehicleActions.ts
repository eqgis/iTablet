/*global GLOBAL*/
import { SMap } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../../../language'
import { Toast, LayerUtils } from '../../../../../../utils'
import { ConstToolType } from '../../../../../../constants'
import ToolbarModule from '../ToolbarModule'

async function close() {
  const _data: any = ToolbarModule.getData()
  switch(_data.type) {
    case ConstToolType.SM_MAP_AI_VEHICLE_PREVIEW:
      illegallyParkCollect()
      break
    default:
      GLOBAL.ToolBar?.removeAIDetect(false)
      GLOBAL.ToolBar?.close()
  }
}

// 违章采集
function illegallyParkCollect() {
  (async function() {
    const _params: any = ToolbarModule.getParams()
    const dataList = await SMap.getTaggingLayers(
      _params.user.currentUser.userName,
    )
    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    if (dataList.length > 0) {
      let taggingLayerData = await getTaggingLayerData()
      const dataList = await SMap.getTaggingLayers(
        _params.user.currentUser.userName,
      )
      for (let layer of dataList) {
        if (
          taggingLayerData.datasourceAlias === layer.datasourceAlias &&
          taggingLayerData.datasetName === layer.datasetName
        ) {
          GLOBAL.currentLayer = layer
          break
        }
      }
      _params.setToolbarVisible(true, ConstToolType.SM_MAP_AI_VEHICLE_DETECT, {
        isFullScreen: false,
        height: 0,
      })
    } else {
      Toast.show(getLanguage(_params.language).Prompt.PLEASE_NEW_PLOT_LAYER)
      _params.navigation.navigate('LayerManager')
    }
  })()
}

async function getTaggingLayerData() {
  const _params: any = ToolbarModule.getParams()
  let currentLayer: any = GLOBAL.currentLayer
  let isTaggingLayer = false
  if (currentLayer) {
    let layerType = LayerUtils.getLayerType(currentLayer)
    isTaggingLayer = layerType === 'TAGGINGLAYER'
  }
  let taggingLayerData
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
    taggingLayerData = {
      datasourceAlias,
      datasetName,
    }
  } else {
    const datasourceAlias = currentLayer.datasourceAlias // 标注数据源名称
    const datasetName = currentLayer.datasetName // 标注图层名称
    taggingLayerData = {
      datasourceAlias,
      datasetName,
    }
  }
  return taggingLayerData
}

export default {
  close,

  illegallyParkCollect,
}
