/*global GLOBAL*/
import { SMap, SARMap, SMediaCollector } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../../../language'
import { Toast, LayerUtils, DateUtil } from '../../../../../../utils'
import { ConstToolType, ConstPath } from '../../../../../../constants'
import { FileTools } from '../../../../../../native'
import ToolbarModule from '../ToolbarModule'
import NavigationService from '../../../../../NavigationService'

async function close() {
  const _data: any = ToolbarModule.getData()
  switch(_data.type) {
    case ConstToolType.SM_MAP_AI_VEHICLE_PREVIEW:
      illegallyParkCollect()
      break
    default:
      SARMap.endCarPlateRead()
      SARMap.removeCarPlateReadListener()
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

/**
 * 拍照进入预览页面
 */
async function goToPreview() {
  try {
    const _params: any = ToolbarModule.getParams()
    const _data: any = ToolbarModule.getData()
    const date = new Date().getTime().toString()
    const location = await SMap.getCurrentPosition()
    const homePath = await FileTools.getHomeDirectory()
    let targetPath = homePath + ConstPath.UserPath +
      _params.user.currentUser.userName + '/' +
      ConstPath.RelativeFilePath.Media
    await SMediaCollector.initMediaCollector(targetPath)
    const imgPath = targetPath + `IMG_${date}.jpg`
    const result = await SARMap.captureImage(imgPath)
    if (result) {
      SARMap.endCarPlateRead()
      SARMap.removeCarPlateReadListener()
      ToolbarModule.addData({
        type: ConstToolType.SM_MAP_AI_VEHICLE_PREVIEW,
        previewImage: imgPath,
        mediaName: DateUtil.formatDate(date, 'yyyy-MM-dd'),
        plateNubmer: _data.plateNubmer,
        location: location,
        modifiedDate: DateUtil.formatDate(date),
      })
      _params.setToolbarVisible(true, ConstToolType.SM_MAP_AI_VEHICLE_PREVIEW, {
        isFullScreen: false,
        height: 0,
      })
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    __DEV__ && console.warn(error)
  }
}

/**
 * 进入结果处理界面
 */
async function goToResultView() {
  try {
    const _data: any = ToolbarModule.getData()
    const _params: any = ToolbarModule.getParams()
    NavigationService.navigate('MediaEdit', {
      layerInfo: _params.currentLayer,
      backAction: () => {
        illegallyParkCollect()
        NavigationService.goBack('MediaEdit')
      },
      cb: () => {
        illegallyParkCollect()
        NavigationService.goBack('MediaEdit')
      },
      info: {
        coordinate: _data.location,
        layerName: _params.currentLayer.name,
        modifiedDate: _data.modifiedDate,
        mediaName: _data.mediaName,
        mediaFilePaths: [_data.previewImage],
        mediaServiceIds: [],
        httpAddress: '',
        description: '',
        location: _data.location,
        mediaData: {
          type: 'AI_VEHICLE',
          mediaName: _data.mediaName,
          plateNubmer: _data.plateNubmer,
        },
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    __DEV__ && console.warn(error)
  }
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
  goToPreview,
  goToResultView,
}
