/*global GLOBAL*/
import {  SMap } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../../../language'
import { Toast, LayerUtils, FetchUtils } from '../../../../../../utils'
import { FileTools } from '../../../../../../native'
import { ConstPath } from '../../../../../../constants'
import ToolbarModule from '../ToolbarModule'
import NavigationService from '../../../../../NavigationService'

let isDownload = true // 目标分类默认文件下载判断

interface DownloadData {
  key: string,
  fileName: string,
  cachePath: string,
  copyFilePath: string,
}

// AI分类
async function aiClassify() {
  const _params: any = ToolbarModule.getParams()
  if (isDownload) {
    const homePath = await FileTools.appendingHomeDirectory()
    const dustbinPath =
      `${homePath +
        ConstPath.Common_AIClassifyModel}mobilenet_quant_224` + '/'
    let dustbin_model = `${dustbinPath}mobilenet_quant_224` + '.tflite'
    let dustbin_txt = `${dustbinPath}mobilenet_quant_224` + '.txt'
    const isDustbin =
      (await FileTools.fileIsExist(dustbin_model)) &&
      (await FileTools.fileIsExist(dustbin_txt))
    if (isDustbin) {
      GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
      if (GLOBAL.showAIDetect) {
        GLOBAL.arSwitchToMap = true
        ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
      }
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
      // _params.showFullMap && _params.showFullMap(true)
      const datasourceAlias = taggingLayerData.datasourceAlias // 标注数据源名称
      const datasetName = taggingLayerData.datasetName // 标注图层名称
      NavigationService.navigate('ClassifyView', {
        datasourceAlias,
        datasetName,
      })
    } else {
      isDownload = false
      const downloadData = await getDownloadData(
        'mobilenet_quant_224',
        'mobilenet_quant_224',
      )
      _downloadData(downloadData)
      Toast.show(getLanguage(_params.language).Prompt.DOWNLOADING_PLEASE_WAIT)
    }
  } else {
    Toast.show(getLanguage(_params.language).Prompt.DOWNLOADING_PLEASE_WAIT)
  }
}

async function getDownloadData(key: string, fileName: string): Promise<DownloadData> {
  const homePath = await FileTools.appendingHomeDirectory()
  const cachePath = homePath + ConstPath.CachePath
  const toPath = homePath + ConstPath.Common_AIClassifyModel + fileName
  return {
    key,
    fileName,
    cachePath,
    copyFilePath: toPath,
  }
}

async function _downloadData(downloadData: DownloadData) {
  const _params: any = ToolbarModule.getParams()
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
}

async function getTaggingLayerData() {
  const _params: any = ToolbarModule.getParams()
  let currentLayer = _params.currentLayer
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
  aiClassify,
}
