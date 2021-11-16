/*global GLOBAL*/
import { SMap, SARMap, SMediaCollector } from 'imobile_for_reactnative'
import NavigationService from '../../../../../NavigationService'
import { ConstToolType, ConstPath } from '../../../../../../constants'
import { LayerUtils } from '../../../../../../utils'
import ToolbarModule from '../ToolbarModule'
import { FileTools } from '../../../../../../native'

async function close() {
  await SARMap.endAIDetect()
  GLOBAL.ToolBar.close()
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

// 目标采集
function polymerizeCollect() {
  (async function() {
    const _params: any = ToolbarModule.getParams()
    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(false)
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
    SARMap.startAIDetect(true)
    ;(await GLOBAL.toolBox) &&
      GLOBAL.toolBox.setVisible(true, ConstToolType.SM_MAP_AI_AGGREGATE_DETECT, {
        // buttons: buttons,
        isFullScreen: false,
        height: 0,
      })
  })()
}

async function goToPreview() {
  try {
    const _params: any = ToolbarModule.getParams()
    const homePath = await FileTools.getHomeDirectory()
    let targetPath = homePath + ConstPath.UserPath +
      _params.user.currentUser.userName + '/' +
      ConstPath.RelativeFilePath.Media
    await SMediaCollector.initMediaCollector(targetPath)
    // 获取对象识别信息
    let recognitionInfos = await SARMap.getAIRecognitionInfos()
    const captureTime = new Date().getTime().toString()
    const imgPath = targetPath + `IMG_${captureTime}.jpg`
    const result = await SARMap.captureImage(imgPath, true)
    if(result) {
      const classResult = await SARMap.startAIClassify(imgPath)
      if (classResult) {
        const location = await SMap.getCurrentPosition()
        ToolbarModule.addData({
          classResult: classResult,
          captureImgPath: imgPath,
          recognitionInfos: recognitionInfos,
          location: location,
          prevType: ConstToolType.SM_MAP_AI_AGGREGATE_DETECT,
        })
        GLOBAL.toolBox?.setVisible(true, ConstToolType.SM_MAP_AI_AGGREGATE_PREVIEW, {
          isFullScreen: false,
          height: 0,
        })
      } else {
        // Toast.show('')
      }
    } else {
      // Toast.show('')
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    __DEV__ && console.warn(error)
  }
}

async function goToMediaEdit() {
  const _data: any = ToolbarModule.getData()
  const _params: any = ToolbarModule.getParams()

  NavigationService.navigate('MediaEdit', {
    // title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_TARGET_COLLECT,
    title: _data.title,
    layerInfo: _params.currentLayer,
    backAction: () => {
      polymerizeCollect()
      NavigationService.goBack('MediaEdit')
    },
    cb: () => {
      polymerizeCollect()
      NavigationService.goBack('MediaEdit')
    },
    info: {
      // id: string,
      coordinate: _data.location,
      layerName: _params.currentLayer.name,
      // geoID: number,
      // medium: Array<any>,
      modifiedDate: _data.modifiedDate,
      mediaName: _data.mediaName,
      mediaFilePaths: [_data.captureImgPath],
      mediaServiceIds: [],
      httpAddress: '',
      description: '',
      location: _data.location,
      mediaData: {
        type: 'AI_AGGREGATE',
        recognitionInfos: _data.recognitionInfos,
      },
    },
  })
}

async function goToCollectType() {
  NavigationService.navigate('AIDetectSettingView')
}

async function setting() {
  NavigationService.navigate('AISelectModelView', {
    modelType: 'detect',
  })
}

export default {
  close,

  polymerizeCollect,
  goToPreview,
  goToMediaEdit,
  goToCollectType,
  setting,
}
