/*global GLOBAL*/
import { SAIDetectView, SMap } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../../../language'
import NavigationService from '../../../../../NavigationService'
import { Toast, LayerUtils } from '../../../../../../utils'
import { FileTools } from '../../../../../../native'
import { ConstPath, ConstToolType } from '../../../../../../constants'
import { getThemeAssets } from '../../../../../../assets'
import FetchUtils from '../../../../../../utils/FetchUtils'
import ToolbarModule from '../ToolbarModule'
import ToolbarBtnType from '../../../../../../containers/workspace/components/ToolBar/ToolbarBtnType'
import ToolAction from '../../../../../../containers/workspace/components/ToolBar/modules/toolModule/ToolAction'

let isDownload = true // 目标分类默认文件下载判断

// 违章采集
function illegallyParkCollect() {
  (async function() {
    const _params = ToolbarModule.getParams()
    const dataList = await SMap.getTaggingLayers(
      _params.user.currentUser.userName,
    )
    global.toolBox && global.toolBox.removeAIDetect(true)
    if (dataList.length > 0) {
      if (global.showAIDetect) {
        global.arSwitchToMap = true
        ;(await global.toolBox) && global.toolBox.switchAr()
      }
      let taggingLayerData = await getTaggingLayerData()
      const dataList = await SMap.getTaggingLayers(
        _params.user.currentUser.userName,
      )
      for (let i = 0; i < dataList.length; i++) {
        if (
          taggingLayerData.datasourceAlias === dataList[i].datasourceAlias &&
          taggingLayerData.datasetName === dataList[i].datasetName
        ) {
          global.currentLayer = dataList[i]
          break
        }
      }
      const datasourceAlias = taggingLayerData.datasourceAlias // 标注数据源名称
      const datasetName = taggingLayerData.datasetName // 标注图层名称
      NavigationService.navigate('IllegallyParkView', {
        datasourceAlias,
        datasetName,
      })
    } else {
      Toast.show(getLanguage(_params.language).Prompt.PLEASE_NEW_PLOT_LAYER)
      _params.navigation.navigate('LayerManager')
    }
  })()
}

async function getTaggingLayerData() {
  const _params = ToolbarModule.getParams()
  let currentLayer = global.currentLayer
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

// AI分类
function aiClassify() {
  (async function() {
    const _params = ToolbarModule.getParams()
    if (isDownload) {
      this.homePath = await FileTools.appendingHomeDirectory()
      const dustbinPath =
        `${this.homePath +
          ConstPath.Common_AIClassifyModel}mobilenet_quant_224` + '/'
      this.dustbin_model = `${dustbinPath}mobilenet_quant_224` + '.tflite'
      this.dustbin_txt = `${dustbinPath}mobilenet_quant_224` + '.txt'
      const isDustbin =
        (await FileTools.fileIsExist(this.dustbin_model)) &&
        (await FileTools.fileIsExist(this.dustbin_txt))
      if (isDustbin) {
        global.toolBox && global.toolBox.removeAIDetect(true)
        if (global.showAIDetect) {
          global.arSwitchToMap = true
          ;(await global.toolBox) && global.toolBox.switchAr()
        }
        let taggingLayerData = await getTaggingLayerData()
        const dataList = await SMap.getTaggingLayers(
          _params.user.currentUser.userName,
        )
        for (let i = 0; i < dataList.length; i++) {
          if (
            taggingLayerData.datasourceAlias === dataList[i].datasourceAlias &&
            taggingLayerData.datasetName === dataList[i].datasetName
          ) {
            global.currentLayer = dataList[i]
            break
          }
        }
        const datasourceAlias = taggingLayerData.datasourceAlias // 标注数据源名称
        const datasetName = taggingLayerData.datasetName // 标注图层名称
        NavigationService.navigate('ClassifyView', {
          datasourceAlias,
          datasetName,
        })
      } else {
        isDownload = false
        const downloadData = getDownloadData(
          'mobilenet_quant_224',
          'mobilenet_quant_224',
        )
        _downloadData(downloadData)
        Toast.show(getLanguage(_params.language).Prompt.DOWNLOADING_PLEASE_WAIT)
      }
    } else {
      Toast.show(getLanguage(_params.language).Prompt.DOWNLOADING_PLEASE_WAIT)
    }
  }.bind(this)())
}

function getDownloadData(key, fileName) {
  const cachePath = this.homePath + ConstPath.CachePath
  const toPath = this.homePath + ConstPath.Common_AIClassifyModel + fileName
  return {
    key,
    fileName,
    cachePath,
    copyFilePath: toPath,
  }
}

function _downloadData(downloadData) {
  (async function() {
    const _params = ToolbarModule.getParams()
    const keyword = downloadData.fileName
    const dataUrl = await FetchUtils.getFindUserDataUrl(
      'xiezhiyan123',
      keyword,
      '.zip',
    )
    const { cachePath } = downloadData
    const fileDirPath = downloadData.copyFilePath
    const fileCachePath = `${cachePath + downloadData.fileName}.zip`
    await FileTools.deleteFile(fileCachePath)
    try {
      const downloadOptions = {
        fromUrl: dataUrl,
        toFile: fileCachePath,
        background: true,
        fileName: downloadData.fileName,
        progressDivider: 1,
        key: downloadData.key,
      }
      _params
        .downloadFile(downloadOptions)
        .then(async () => {
          await FileTools.unZipFile(fileCachePath, fileDirPath)
          await FileTools.deleteFile(fileCachePath)
          _params.deleteDownloadFile({ id: 'mobilenet_quant_224' })
          isDownload = true
          Toast.show(getLanguage(_params.language).Prompt.DOWNLOAD_SUCCESSFULLY)
        })
        .catch(() => {
          Toast.show(getLanguage(_params.language).Prompt.NETWORK_ERROR)
          FileTools.deleteFile(fileCachePath)
        })
    } catch (e) {
      Toast.show(getLanguage(_params.language).Prompt.NETWORK_ERROR)
      // '网络错误，下载失败'
      FileTools.deleteFile(fileCachePath)
    }
  })()
}

// 目标采集
function aiDetect() {
  (async function() {
    const _params = ToolbarModule.getParams()
    global.toolBox && global.toolBox.removeAIDetect(false)
    if (global.showAIDetect) {
      global.arSwitchToMap = true
      ;(await global.toolBox) && global.toolBox.switchAr()
    }
    let taggingLayerData = await getTaggingLayerData()
    const dataList = await SMap.getTaggingLayers(
      _params.user.currentUser.userName,
    )
    for (let i = 0; i < dataList.length; i++) {
      if (
        taggingLayerData.datasourceAlias === dataList[i].datasourceAlias &&
        taggingLayerData.datasetName === dataList[i].datasetName
      ) {
        global.currentLayer = dataList[i]
        break
      }
    }

    await SAIDetectView.setProjectionModeEnable(true)
    await SAIDetectView.setIsPolymerize(false)
    await SAIDetectView.startDetect()
    let buttons = [
      ToolbarBtnType.PLACEHOLDER,
      ToolbarBtnType.PLACEHOLDER,
      {
        type: ToolbarBtnType.SETTIING,
        action: ToolAction.setting,
        // image: require('../../../../../../assets/mapTools/ai_setting.png'),
        image: getThemeAssets().toolbar.icon_toolbar_setting,
      },
    ]
    ;(await global.toolBox) &&
      global.toolBox.setVisible(true, ConstToolType.SM_MAP_AI_ANALYSIS_DETECT, {
        buttons: buttons,
        isFullScreen: false,
        height: 0,
      })
    global.AIDETECTCHANGE.setVisible(true, getLanguage(
      global.language,
    ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_TARGET_COLLECT)
    ;(await global.toolBox) && global.toolBox.switchAr()
  })()
}

// 态势采集(聚合模式)
function polymerizeCollect() {
  // await SAIDetectView.setIsPolymerize(true)
  // await SAIDetectView.startDetect()
  // global.toolBox && global.toolBox.removeAIDetect(false)
  // ;(await global.toolBox) && global.toolBox.setVisible(false)
  // if (!global.showAIDetect) {
  //   (await global.toolBox) && global.toolBox.switchAr()
  // }
  (async function() {
    const _params = ToolbarModule.getParams()
    global.toolBox && global.toolBox.removeAIDetect(false)
    if (global.showAIDetect) {
      global.arSwitchToMap = true
      ;(await global.toolBox) && global.toolBox.switchAr()
    }
    let taggingLayerData = await getTaggingLayerData()
    const dataList = await SMap.getTaggingLayers(
      _params.user.currentUser.userName,
    )
    for (let i = 0; i < dataList.length; i++) {
      if (
        taggingLayerData.datasourceAlias === dataList[i].datasourceAlias &&
        taggingLayerData.datasetName === dataList[i].datasetName
      ) {
        global.currentLayer = dataList[i]
        break
      }
    }

    await SAIDetectView.setIsPolymerize(true)
    await SAIDetectView.startDetect()
    let buttons = [
      ToolbarBtnType.PLACEHOLDER,
      ToolbarBtnType.PLACEHOLDER,
      {
        type: ToolbarBtnType.SETTIING,
        action: ToolAction.setting,
        // image: require('../../../../../../assets/mapTools/ai_setting.png'),
        image: getThemeAssets().toolbar.icon_toolbar_setting,
      },
    ]
    ;(await global.toolBox) &&
      global.toolBox.setVisible(true, ConstToolType.SM_MAP_AI_ANALYSIS_DETECT, {
        buttons: buttons,
        isFullScreen: false,
        height: 0,
      })
    global.AIDETECTCHANGE.setVisible(true, getLanguage(
      global.language,
    ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_AGGREGATE_COLLECT)
    ;(await global.toolBox) && global.toolBox.switchAr()
  })()
}

// 人体姿态
function poseEstimation() {
  (async function() {
    global.toolBox && global.toolBox.removeAIDetect(true)

    if (global.showAIDetect) {
      global.arSwitchToMap = true
      ;(await global.toolBox) && global.toolBox.switchAr()
    }

    setTimeout(async () => {
      NavigationService.navigate('AIPoseEstimationView')
    }, 500)
  })()
}

// 手势骨骼
function gestureBone() {
  (async function() {
    global.toolBox && global.toolBox.removeAIDetect(true)

    if (global.showAIDetect) {
      global.arSwitchToMap = true
      ;(await global.toolBox) && global.toolBox.switchAr()
    }

    setTimeout(async () => {
      // NavigationService.navigate('AIGestureBoneView')
      let info = {}
      info.gestureTitle = getLanguage(
        global.language,
      ).Map_Main_Menu.MAP_AI_GESTURE_BONE //放大
      info.zoom = getLanguage(
        global.language,
      ).Map_Main_Menu.MAP_AI_POSE_ESTIMATION_ASSOCIATION_MAGNIFY //放大
      info.shrink = getLanguage(
        global.language,
      ).Map_Main_Menu.MAP_AI_POSE_ESTIMATION_ASSOCIATION_SHRINK //缩小
      info.full = getLanguage(global.language).Map_Main_Menu.FULL_SCREEN //全幅
      info.associationCancel = getLanguage(
        global.language,
      ).Map_Main_Menu.MAP_AI_POSE_ESTIMATION_ASSOCIATION_CANCEL //取消关联
      info.association = getLanguage(
        global.language,
      ).Map_Main_Menu.MAP_AI_POSE_ESTIMATION_ASSOCIATION //关联地图
      info.switchCamera = getLanguage(
        global.language,
      ).Map_Main_Menu.MAP_AI_POSE_ESTIMATION_SWITCH_CAMERA //切换相机
      info.location = getLanguage(
        global.language,
      ).Map_Attribute.ATTRIBUTE_LOCATION //定位
      info.gestureDetail = getLanguage(
        global.language,
      ).Map_Main_Menu.MAP_AI_GESTURE_BONE_DETAIL //手势详情
      info.close = getLanguage(
        global.language,
      ).Map_Main_Menu.MAP_AI_GESTURE_BONE_CLOSE //关闭
      // SMap.toGestureBoneView(getLanguage(global.language).Map_Main_Menu.MAP_AI_GESTURE_BONE)
      SMap.toGestureBoneView(info)
      SMap.addGestureBoneFinishListener(() => {
        global.toolBox && global.toolBox.removeAIDetect(false)
        if (!global.showAIDetect) {
          global.toolBox && global.toolBox.switchAr()
        }
        SMap.removeGestureBoneFinishListener()
      })
    }, 500)
  })()
}

export default {
  illegallyParkCollect,
  aiClassify,
  _downloadData,
  aiDetect,
  polymerizeCollect,
  poseEstimation,
  gestureBone,
}
