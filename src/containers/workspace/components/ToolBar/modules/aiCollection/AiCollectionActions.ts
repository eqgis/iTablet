/*global GLOBAL*/
import { Platform } from "react-native"
import { SMap, SARMap, SMediaCollector, RNFS } from 'imobile_for_reactnative'
import NavigationService from '../../../../../NavigationService'
import { ConstToolType, ConstPath } from '../../../../../../constants'
import { LayerUtils } from '../../../../../../utils'
import ToolbarModule from '../ToolbarModule'
import { FileTools } from '../../../../../../native'
import { ILocalData } from '../../../../../tabs/Mine/DataHandler/DataLocal'

async function getTaggingLayerData() {
  const _params: any = ToolbarModule.getParams()
  let currentLayer: any = global.currentLayer
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
        `Default_Tagging_${_params.user.currentUser.userName}`,
        _params.user.currentUser.userName,
      )
    }
    let datasourceAlias = 'Label_' + _params.user.currentUser.userName + '#'
    let datasetName = `Default_Tagging_${_params.user.currentUser.userName}`
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
function aiDetect() {
  (async function() {
    const _params: any = ToolbarModule.getParams()
    global.toolBox && global.toolBox.removeAIDetect(false)
    let taggingLayerData = await getTaggingLayerData()
    const dataList = await SMap.getTaggingLayers(
      _params.user.currentUser.userName,
    )
    for (let layer of dataList) {
      if (
        taggingLayerData.datasourceAlias === layer.datasourceAlias &&
        taggingLayerData.datasetName === layer.datasetName
      ) {
        global.currentLayer = layer
        break
      }
    }
    SARMap.startAIDetect(false)
    ;(await global.toolBox) &&
      global.toolBox.setVisible(true, ConstToolType.SM_MAP_AI_ANALYSIS_DETECT, {
        isFullScreen: false,
        height: 0,
      })
  })()
}

async function goToPreview(infos?: SARMap.AIRecognitionInfo[]) {
  try {
    const _params: any = ToolbarModule.getParams()
    const homePath = await FileTools.getHomeDirectory()
    let targetPath = homePath + ConstPath.UserPath +
      _params.user.currentUser.userName + '/' +
      ConstPath.RelativeFilePath.Media
    await SMediaCollector.initMediaCollector(targetPath)
    // 获取对象识别信息
    let recognitionInfos = infos && infos?.length > 0 ? infos : await SARMap.getAIRecognitionInfos()
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
          prevType: ConstToolType.SM_MAP_AI_ANALYSIS_DETECT,
        })
        global.toolBox?.setVisible(true, ConstToolType.SM_MAP_AI_ANALYSIS_PREVIEW, {
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

  let aiType
  switch(_data.type) {
    case ConstToolType.SM_MAP_AI_AGGREGATE:
      aiType = 'AI_AGGREGATE'
      break
    case ConstToolType.SM_MAP_AI_ANALYSIS:
    default:
      aiType = 'AI_DETECT'
      break
  }
  NavigationService.navigate('MediaEdit', {
    // title: getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_TARGET_COLLECT,
    title: _data.title,
    layerInfo: _params.currentLayer,
    backAction: () => {
      aiDetect()
      NavigationService.goBack('MediaEdit')
    },
    cb: () => {
      aiDetect()
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
        type: aiType,
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

async function close() {
  await SARMap.endAIDetect()
  global.ToolBar.close()
}

/**
 * 设置ai模块要使用的模型文件
 * @param model 本地模型文件信息
 * @param type 识别或是分类模型
 * @param language 当前语言
 */
export async function setAIModel(model: ILocalData, type: 'detect' | 'classify', language: string) {
  if(model.aiModelInfo) {
    const homePath = await FileTools.getHomeDirectory()
    const modelPath = homePath + model.path + '/' + model.aiModelInfo.modelName

    //获取对应语言文件
    const labelDefault = model.aiModelInfo.labels.filter(item => (
      item.indexOf('_cn.txt') === -1
      && item.indexOf('_jp.txt') === -1
    ))
    let labelPath: string
    if(labelDefault.length > 0) {
      labelPath = homePath + model.path + '/' + labelDefault[0]
    } else {
      labelPath = homePath + model.path + '/' + model.aiModelInfo.labels[0]
    }

    if(language === 'CN') {
      const name = model.aiModelInfo.labels.find(item => item.toLowerCase().indexOf('_cn.txt') > -1)
      name && (labelPath = homePath + model.path + '/' + name)
    } else if(language === 'JP') {
      const name = model.aiModelInfo.labels.find(item => item.toLowerCase().indexOf('_jp.txt') > -1)
      name && (labelPath = homePath + model.path + '/' + name)
    }

    //读取额外配置信息
    let param
    try {
      if(Platform.OS === 'android' && model.aiModelInfo.paramJsonName) {
        const paramPath =  homePath + model.path + '/' + model.aiModelInfo.paramJsonName
        const file = await RNFS.readFile(paramPath)
        param = JSON.parse(file)
      }
    } catch(e) {
      // eslint-disable-next-line no-console
      __DEV__ && console.warn(e)
    }

    if(type === 'detect') {
      await SARMap.setAIDetectModel({
        modelPath: modelPath,
        labelPath: labelPath,
        param: param,
      })
    } else if(type === 'classify') {
      await SARMap.setAIClassifyModel({
        modelPath: modelPath,
        labelPath: labelPath,
        param: param,
      })
    }
  }
}

/** 设置redux中保存的模型 */
export async function setSelectedModel(language: string) {
  const _params: any = ToolbarModule.getParams()
  const detectModel = _params.aiDetectData
  const classifyModel = _params.aiClassifyData
  const homePath = await FileTools.getHomeDirectory()
  //模型不存在则使用默认模型
  if(detectModel && await FileTools.fileIsExist(
    homePath + detectModel.path + '/' + detectModel.aiModelInfo?.modelName))
  {
    setAIModel(detectModel, 'detect', language)
  } else {
    SARMap.setAIDetectDefaultModel(language)
    _params?.setAIDetectModel(undefined)
  }
  //模型不存在则使用默认模型
  if(classifyModel && await FileTools.fileIsExist(
    homePath + classifyModel.path + '/' + classifyModel.aiModelInfo?.modelName))
  {
    setAIModel(classifyModel, 'classify', language)
  } else {
    SARMap.setAIClassifyDefaultModel(language)
    _params?.setAIClassifyModel(undefined)
  }
}

export default {
  close,

  aiDetect,
  goToCollectType,
  setting,
  goToPreview,
  goToMediaEdit,
  setSelectedModel,
}
