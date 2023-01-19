import { Platform } from 'react-native'
import { SMap, SARMap, SMediaCollector ,SData,SPlot} from 'imobile_for_reactnative'
import { getLanguage } from '../../../../../../language'
import { Toast, LayerUtils, FetchUtils, DateUtil } from '../../../../../../utils'
import { FileTools } from '../../../../../../native'
import { ConstPath, ConstToolType } from '../../../../../../constants'
import { ImagePicker } from '../../../../../../components'
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
      const datasourceAlias = taggingLayerData.datasourceAlias // 标注数据源名称
      const datasetName = taggingLayerData.datasetName // 标注图层名称
      await SARMap.setAIClassifyDefaultModel(global.language)
      ToolbarModule.addData({
        datasourceAlias,
        datasetName,
      })
      _params.showFullMap && _params.showFullMap(true)
      global.toolBox?.setVisible(true, ConstToolType.SM_MAP_AI_CATEGORY_DETECT, {
        isFullScreen: false,
        height: 0,
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
    // let hasDefaultTagging = await SMap.hasDefaultTagging(
    //   _params.user.currentUser.userName,
    // )
    let hasDefaultTagging = false
    const datasets = await SData.getDatasetsByDatasource({alias:"Label_"+_params.user.currentUser.userName+"#"})
    datasets.forEach(item => {
      if (item.datasetName === "Default_Tagging_"+_params.user.currentUser.userName) {
        hasDefaultTagging = true
      }
    })
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

async function setting() {
  NavigationService.navigate('AISelectModelView', {
    modelType: 'classify',
  })
}

async function close() {
  global.ToolBar.close()
}

async function takeCamera() {
  try {
    const _params: any = ToolbarModule.getParams()
    const homePath = await FileTools.getHomeDirectory()
    // const tempPath = homePath + ConstPath.UserPath + _params.user.currentUser.userName + '/' + ConstPath.RelativePath.Temp
    let targetPath = homePath + ConstPath.UserPath +
      _params.user.currentUser.userName + '/' +
      ConstPath.RelativeFilePath.Media
    const captureTime = new Date().getTime().toString()
    const imgPath = targetPath + `IMG_${captureTime}.jpg`
    const result = await SARMap.captureImage(imgPath)
    if(result) {
      const classResult = await SARMap.startAIClassify(imgPath)
      if (classResult) {
        ToolbarModule.addData({
          selectedCategoryData: classResult.length > 0 && classResult[0], // 默认选择第一个识别结果
          classResult: classResult,
          captureImgPath: imgPath,
          prevType: ConstToolType.SM_MAP_AI_CATEGORY_DETECT,
        })
        global.toolBox?.setVisible(true, ConstToolType.SM_MAP_AI_CATEGORY_PREVIEW, {
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
    // Toast.show('')
  }
}

async function openAlbum() {
  ImagePicker.AlbumListView.defaultProps.showDialog = false
  ImagePicker.AlbumListView.defaultProps.dialogConfirm = null
  ImagePicker.AlbumListView.defaultProps.assetType = 'Photos'
  ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'
  ImagePicker.getAlbum({
    maxSize: 1,
    callback: async (data: any[]) => {
      let mediaPaths: string[] = []
      if (data.length > 0) {
        data.forEach(item => {
          mediaPaths.push(item.uri)
        })
        const result = await SARMap.startAIClassify(mediaPaths[0])
        if (result) {
          ToolbarModule.addData({
            selectedCategoryData: result.length > 0 && result[0], // 默认选择第一个识别结果
            classResult: result,
            captureImgPath: mediaPaths[0],
            prevType: ConstToolType.SM_MAP_AI_CATEGORY_DETECT,
          })
          global.toolBox?.setVisible(true, ConstToolType.SM_MAP_AI_CATEGORY_PREVIEW, {
            isFullScreen: false,
            height: 0,
          })
        } else {
          Toast.show('')
        }
      } else {
        Toast.show(
          getLanguage(global.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_CLASSIFY_NOPICS,
        )
      }
    },
  })
}

async function clear() {
  const _data: any = ToolbarModule.getData()
  global.toolBox?.setVisible(true, _data.prevType, {
    isFullScreen: false,
    height: 0,
  })
}

async function save() {
  try {
    //保存数据->跳转
    const _params: any = ToolbarModule.getParams()
    const _data: any = ToolbarModule.getData()
    let currentLayer = _params.currentLayer
    // let reg = /^Label_(.*)#$/
    let saveAble = false
    if (currentLayer) {
      let layerType = LayerUtils.getLayerType(currentLayer)
      saveAble = layerType === 'TAGGINGLAYER' || layerType === 'CADLAYER' || layerType === 'POINTLAYER'
      // && currentLayer.datasourceAlias.match(reg)
    }
    if (saveAble) {
      const datasourceAlias = currentLayer.datasourceAlias // 标注数据源名称
      const datasetName = currentLayer.datasetName // 标注图层名称
      let targetPath = await FileTools.appendingHomeDirectory(
        ConstPath.UserPath +
        _params.user.currentUser.userName +
          '/' +
          ConstPath.RelativeFilePath.Media,
      )
      SMediaCollector.initMediaCollector(targetPath)

      let mediaName = _data.selectedCategoryData.label // 目标类别
      let classifyTime = new Date().getTime()
      let mediaFileName = mediaName // 图片文件名字
      if (_data.selectedCategoryData.confidence === undefined) { // 结果全部不符合
        const timeStr = classifyTime
        mediaFileName = timeStr.toString()
        classifyTime = DateUtil.formatDate(timeStr, 'yyyy-MM-dd hh:mm:ss')
      }
      const mediaData = JSON.stringify({
        type: 'AI_CLASSIFY',
        recognitionInfos: [_data.selectedCategoryData],
      })
      NavigationService.navigate('MediaEdit', {
        info: {
          mediaFilePaths: [_data.captureImgPath],
          modifiedDate: classifyTime,
          layerName: currentLayer.name,
          datasourceName: datasourceAlias,
          datasetName: datasetName,
          mediaName: mediaFileName,
          mediaData: mediaData,
          description: '',
        },
        layerInfo: currentLayer,
        cb: async () => {
          clear()
          NavigationService.goBack('MediaEdit')
        },
      })
    } else {
      Toast.show(getLanguage(global.language).AI.SUPPORT_POINT_AND_CAD)
    }
  } catch (error) {
    Toast.show(getLanguage(global.language).Prompt.SAVE_FAILED)
  }
}

export default {
  close,

  aiClassify,
  setting,
  takeCamera,
  openAlbum,
  clear,
  save,
}
