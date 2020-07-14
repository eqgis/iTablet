import { SAIDetectView, SMap } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../../../language'
import NavigationService from '../../../../../NavigationService'
import { Toast, LayerUtils } from '../../../../../../utils'
import { FileTools } from '../../../../../../native'
import { ConstPath, ConstToolType } from '../../../../../../constants'
import FetchUtils from '../../../../../../utils/FetchUtils'
import ToolbarModule from '../ToolbarModule'
import ToolbarBtnType from '../../../../../../containers/workspace/components/ToolBar/ToolbarBtnType'
import ToolAction from '../../../../../../containers/workspace/components/ToolBar/modules/toolModule/ToolAction'

// 违章采集
function illegallyParkCollect() {
  (async function() {
    const _params = ToolbarModule.getParams()
    const dataList = await SMap.getTaggingLayers(
      _params.user.currentUser.userName,
    )
    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    if (dataList.length > 0) {
      if (GLOBAL.showAIDetect) {
        GLOBAL.isswitch = true
        ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
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
          GLOBAL.currentLayer = dataList[i]
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

    // let isSupportedARCore = await SMeasureView.isSupportedARCore()
    // if (!isSupportedARCore) {
    //   Toast.show(getLanguage(_params.language).Prompt.DONOT_SUPPORT_ARCORE)
    //   return
    // }
  })()
}

async function getTaggingLayerData() {
  const _params = ToolbarModule.getParams()
  let currentLayer = GLOBAL.currentLayer
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

// AI分类
function aiClassify() {
  (async function() {
    const _params = ToolbarModule.getParams()
    if (GLOBAL.isDownload) {
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
        GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
        if (GLOBAL.showAIDetect) {
          GLOBAL.isswitch = true
          ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
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
            GLOBAL.currentLayer = dataList[i]
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
        GLOBAL.isDownload = false
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
          GLOBAL.isDownload = true
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
    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(false)
    if (GLOBAL.showAIDetect) {
      GLOBAL.isswitch = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
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
        GLOBAL.currentLayer = dataList[i]
        break
      }
    }

    await SAIDetectView.setProjectionModeEnable(true)
    await SAIDetectView.setIsPolymerize(false)
    let buttons = [
      ToolbarBtnType.PLACEHOLDER,
      ToolbarBtnType.PLACEHOLDER,
      {
        type: ToolbarBtnType.SETTIING,
        action: ToolAction.setting,
        image: require('../../../../../../assets/mapTools/ai_setting.png'),
      },
    ]
    ;(await GLOBAL.toolBox) &&
      GLOBAL.toolBox.setVisible(true, ConstToolType.AIDETECT, {
        buttons: buttons,
        isFullScreen: false,
        height: 0,
      })
    GLOBAL.AIDETECTCHANGE.setVisible(true)
    ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
  })()
}

// 态势采集(聚合模式)
function polymerizeCollect() {
  (async function() {
    // await SAIDetectView.setProjectionModeEnable(true)
    // await SAIDetectView.setDrawTileEnable(false)
    await SAIDetectView.setIsPolymerize(true)
    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(false)
    ;(await GLOBAL.toolBox) && GLOBAL.toolBox.setVisible(false)
    if (!GLOBAL.showAIDetect) {
      (await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }
    // ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    // await SAIDetectView.startCountTrackedObjs(true)
  })()
}

export default {
  illegallyParkCollect,
  aiClassify,
  _downloadData,
  aiDetect,
  polymerizeCollect,
}
