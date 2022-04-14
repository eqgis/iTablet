/* global GLOBAL */
import {
  ARLayerType,
  TARLayerType,
  SARMap,
  TARElementType,
  ARElementType,
  ARElementLayer,
  ARAction,
  FileTools,
  ARLayer,
  SCoordination,
  IServerService,
} from 'imobile_for_reactnative'
import { IVector3, Point3D } from "imobile_for_reactnative/types/data"
import {
  ConstToolType,
  ToolbarType,
  ConstPath,
} from '../../../../../../constants'
import { Toast, AppProgress, DialogUtils, dataUtil } from '../../../../../../utils'
import NavigationService from '../../../../../NavigationService'
import { getLanguage } from '../../../../../../language'
import { ImagePicker } from '../../../../../../components'
import ToolbarModule from '../ToolbarModule'
import DataHandler from '../../../../../tabs/Mine/DataHandler'
import { AR3DExample, AREffectExample, ARModelExample, AREffectExample2, AREffectExample3, AREffectExample4, ExampleData } from '../../../../../tabs/Mine/DataHandler/DataExample'
import { ExternalDataType, ToolBarListItem } from '../types'
import { Downloads, Download } from '../../../../../../redux/models/down'
import { Platform } from 'react-native'

interface AssetType {
  Photos: 'Photos',
  Videos: 'Videos',
  All: 'All'
}

function openSourcePicker(assetType: keyof AssetType, callback: (data: any) => void) {
  ImagePicker.AlbumListView.defaultProps.showDialog = false
  ImagePicker.AlbumListView.defaultProps.assetType = assetType
  ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'
  ImagePicker.getAlbum({
    maxSize: 1,
    callback: callback,
  })
}

function setARToolbar(type: string, data?: {[name: string]: any}) {
  const _params: any = ToolbarModule.getParams()
  // const _data: any = ToolbarModule.getData()
  ToolbarModule.addData({
    // prevToolbarType: _data.type,
    ...data,
  })
  _params.setToolbarVisible(true, type, {
    isFullScreen: false,
  })
}

let isAddingARElement: boolean = false
/**
 * 添加到当前位置
 * @param type
 */
async function addAtCurrent(type: string, location?: IVector3) {
  if(isAddingARElement) return
  isAddingARElement = true
  const _params: any = ToolbarModule.getParams()
  if (type === ConstToolType.SM_AR_DRAWING_SCENE) {
    await addARScene(location)
  } else if (type === ConstToolType.SM_AR_DRAWING_MODAL) {
    await addARModel(location)
  } else if (type === ConstToolType.SM_AR_DRAWING_TEXT) {
    await addText(location)
  } else {
    let _type
    if (type === ConstToolType.SM_AR_DRAWING_VIDEO) {
      _type = ARElementType.AR_VIDEO
    } else if (type === ConstToolType.SM_AR_DRAWING_WEB) {
      _type = ARElementType.AR_WEBVIEW
    } else {
      _type = ARElementType.AR_IMAGE
    }

    await addMedia(_type, location)
  }
  isAddingARElement = false
}

/**
 * 添加到指定位置
 * @param type
 */
async function addAtPoint(type: string) {
  const _params: any = ToolbarModule.getParams()
  const _data: any = ToolbarModule.getData()
  SARMap.setCenterHitTest(true)
  // _params.setToolbarVisible && _params.setToolbarVisible(true, ConstToolType.SM_AR_DRAWING_ADD_POINT, {
  //   isFullScreen: false,
  // })
  setARToolbar(ConstToolType.SM_AR_DRAWING_ADD_POINT, { prevType: type })
  // ToolbarModule.addData({
  //   prevType: type,
  //   prevArContent: _data.arContent,
  // })
}

async function arVideo() {
  openSourcePicker('Videos', data => {
    if (data && data.length > 0) {
      let path = data[0].uri
      setARToolbar(ConstToolType.SM_AR_DRAWING_VIDEO, { arContent: path })
    }
  })
}

async function arImage() {
  openSourcePicker('Photos', data => {
    if (data && data.length > 0) {
      let path = data[0].uri
      setARToolbar(ConstToolType.SM_AR_DRAWING_IMAGE, { arContent: path })
    }
  })
}

async function arWebView() {
  DialogUtils.showInputDailog({
    value: 'http://',
    type: 'http',
    confirmAction: async (value: string) => {
      setARToolbar(ConstToolType.SM_AR_DRAWING_WEB, { arContent: value })
      DialogUtils.hideInputDailog()
    },
  })
}

async function arText() {
  DialogUtils.showInputDailog({
    value: '',
    confirmAction: async (value: string) => {
      setARToolbar(ConstToolType.SM_AR_DRAWING_TEXT, { arContent: value })
      DialogUtils.hideInputDailog()
    },
  })
}

async function ar3D(path: string) {
  setARToolbar(ConstToolType.SM_AR_DRAWING_SCENE, { arContent: path })
}

/** 打开三维场景 */
export async function addARScene(location?: IVector3) {
  try {
    const _params: any = ToolbarModule.getParams()
    const _data: any = ToolbarModule.getData()
    let newDatasource = false
    const mapName = _params.armap.currentMap?.mapName
    ToolbarModule.addData({
      addNewDSourceWhenCreate: false,
      addNewDsetWhenCreate: false,
    })
    if(!mapName){
      await _params.createARMap()
      newDatasource = true
    }

    //若已存在场景图层则先移除
    const sceneLayers = _params.arlayer?.layers?.filter((layer: ARLayer) => {
      return layer.type === ARLayerType.AR_SCENE_LAYER
    })
    if(sceneLayers && sceneLayers.length > 0) {
      await SARMap.removeARLayer(sceneLayers[0].name)
    }

    let datasourceName = _params.armap.currentMap?.mapName || DataHandler.getARRawDatasource()
    let datasetName = 'scene'
    const result = await DataHandler.createARElementDatasource(_params.user.currentUser, datasourceName, datasetName, newDatasource, true, ARLayerType.AR3D_LAYER)
    if(result.success) {
      datasourceName = result.datasourceName
      datasetName = result.datasetName
      if(newDatasource) {
        DataHandler.setARRawDatasource(datasourceName)
      }

      const homePath = await FileTools.getHomeDirectory()
      let path: string = _data.arContent
      if(!path) {
        Toast.show(getLanguage(global.language).Prompt.NO_SCENE_SELECTED)
        return
      }

      try {
        let addLayerName: string
        if(path.indexOf('http') === 0) {
          //double check
          const isValidUrl = dataUtil.checkOnline3DServiceUrl(path) === ''
          if (!isValidUrl) {
            Toast.show(getLanguage().Profile.ONLINE_DATA_UNAVAILABLE)
            return
          }
          const iserverSrv = new IServerService()
          const info = await iserverSrv.getSceneInfo(path)
          if('error' in info) {
            Toast.show(getLanguage().Profile.ONLINE_DATA_UNAVAILABLE)
            return
          }
          const {serverUrl, sceneName, datasetUrl} = getOnlineSceneFromUrl(path)
          const co = new SCoordination('online')
          const recordinfo = await co.downloadRecordset(datasetUrl, 0 , 1)
          const sceneOffset: Point3D = {x: 0, y: 0, z: 0}
          if(recordinfo.length > 0) {
            recordinfo[0].featureInfo.forEach(feature => {
              if(feature.name === 'AR_SCENE_X') {
                sceneOffset.x = feature.value as number
              }
              if(feature.name === 'AR_SCENE_Y') {
                sceneOffset.y = feature.value as number
              }
              if(feature.name === 'AR_SCENE_Z') {
                sceneOffset.z = feature.value as number
              }
            })
          }
          addLayerName = await SARMap.addSceneLayerOnline(datasourceName, datasetName, serverUrl, sceneName, location, sceneOffset)
        } else {
          path = homePath + _data.arContent
          const pxp = await DataHandler.getPxpContent(path)
          if(pxp === null) return
          const wsPath = path.substring(0, path.lastIndexOf('/')) +  '/' + pxp.Workspace.server
          addLayerName = await SARMap.addSceneLayer(datasourceName, datasetName, wsPath, location)
        }
        if(addLayerName !== ''){
          const layers: ARLayer[] = await _params.getARLayers()
          const defaultLayer = layers.find(item => {
            return item.type === ARLayerType.AR_SCENE_LAYER
          })
          if(defaultLayer) {
            _params.setCurrentARLayer(defaultLayer)
          }
        }
      } catch(e){
        console.warn(e)
      } finally {
        // AppToolBar.show('ARMAP', 'AR_MAP_SELECT_ADD')
      }
    }
  } catch (error) {
    console.warn(error)
  }
}

function getOnlineSceneFromUrl(url: string):  {serverUrl: string, datasetUrl: string, sceneName: string} {
  const pattern = /(.+\/services)\/3D-(.+)\/rest\/realspace\/scenes\/(.+)/
  const result = url.match(pattern)
  let servicesUrl = ''
  let workspaceName = ''
  let sceneName = ''
  if (result) {
    servicesUrl = result[1]
    workspaceName = result[2]
    sceneName = result[3]
    const pat2 = /(.+)\.openrealspace$/
    const result2 = sceneName.match(pat2)
    if (result2) {
      sceneName = result2[1]
    }
  }
  return {
    //http://192.168.11.117:8090/iserver/services/3D-pipe3D/rest/realspace
    serverUrl: servicesUrl + `/3D-${workspaceName}/rest/realspace`,
    //http://192.168.11.117:8090/iserver/services/data-DataSource2/rest/data/datasources/AR_SCENE/datasets/AR_SCENE'
    datasetUrl: servicesUrl + `/data-${workspaceName}/rest/data/datasources/AR_SCENE/datasets/AR_SCENE`,
    sceneName, //: 'pipe3D',
  }
}

async function arModel(path: string) {
  setARToolbar(ConstToolType.SM_AR_DRAWING_MODAL, { arContent: path })
}

/** 添加模型 */
export async function addARModel(location?: IVector3) {
  try {
    await checkARLayer(ARLayerType.AR_MODEL_LAYER)
    const _params: any = ToolbarModule.getParams()
    const _data: any = ToolbarModule.getData()
    const layer = _params.arlayer.currentLayer
    if(layer){
      SARMap.addARModel(layer.name, await FileTools.getHomeDirectory() + _data.arContent, location)
    }
  } catch (error) {
    Toast.show(error)
  }
}

async function addMedia(type: TARElementType, location?: IVector3) {
  try {
    await checkARLayer(ARLayerType.AR_MEDIA_LAYER)
    const _params: any = ToolbarModule.getParams()
    const _data: any = ToolbarModule.getData()
    let content = _data.arContent
    const layer = _params.arlayer.currentLayer
    if(content && layer && layer.type === ARLayerType.AR_MEDIA_LAYER) {
      if((type === ARElementType.AR_VIDEO || type === ARElementType.AR_IMAGE) && content.indexOf('file://') === 0) {
        content = content.substring(7)
      }
      SARMap.addARMedia(layer.name, type, content, location)
    }
    return false
  } catch (error) {
    Toast.show(error)
  }
}

async function addText(location?: IVector3) {
  try {
    await checkARLayer(ARLayerType.AR_TEXT_LAYER)
    const _params: any = ToolbarModule.getParams()
    const _data: any = ToolbarModule.getData()
    let content = _data.arContent
    const layer = _params.arlayer.currentLayer
    if(content && layer && layer.type === ARLayerType.AR_TEXT_LAYER) {
      SARMap.addARText(layer.name, content, location)
    }
  } catch (error) {
    Toast.show(error)
  }
}

/**
 * 添加/修改AR特效
 * @param fileName
 * @param filePath
 * @returns
 */
async function addAREffect(fileName: string, filePath: string) {
  try {
    const _params: any = ToolbarModule.getParams()
    const _data: any = ToolbarModule.getData()
    const homePath = await FileTools.getHomeDirectory()
    const layers = _params.arlayer.layers
    let effectLayer: ARLayer | undefined = undefined

    // 是否允许新建图层添加
    // 特效图层是否未添加完毕  false表示添加完毕， true表示未添加完毕
    // const isNotEnd = _data.isNotEndAddEffect
    const isNotEnd = GLOBAL.isNotEndAddEffect

    // 获取当前图层
    const layer = _params?.arlayer?.currentLayer
    // 若当前图层是特效图层
    if(layer?.type === ARLayerType.EFFECT_LAYER){
      effectLayer = layer
    }

    // 若当前图层是特效图层,且为正在添加状态，则替换
    if(isNotEnd && effectLayer) {
      const homePath = await FileTools.getHomeDirectory()
      if (Platform.OS === 'ios') {
        let targetPath = filePath.replace('.areffect','.mp4')
        await FileTools.copyFile(homePath+filePath, homePath+targetPath)
        SARMap.setAREffect(effectLayer.name, homePath + targetPath)
      }else{
        SARMap.setAREffect(effectLayer.name, homePath + filePath)
      }
      const layerName = fileName.substring(0, fileName.lastIndexOf('.'))
      await SARMap.setLayerCaption(effectLayer.name, layerName)
      await _params.getARLayers()
      return
    }

    const mapName = _params.armap.currentMap?.mapName

    // 若无当前地图，则新建地图
    if(!mapName){
      await _params.createARMap()
    }
    const layerName = fileName.substring(0, fileName.lastIndexOf('.'))
    let addLayerName 
    if (Platform.OS === 'ios') {
      let targetPath = filePath.replace('.areffect','.mp4')
      await FileTools.copyFile(homePath+filePath, homePath+targetPath)
      addLayerName = await SARMap.addEffectLayer(layerName, homePath + targetPath)
    }else{
      addLayerName = await SARMap.addEffectLayer(layerName, homePath + filePath)
    }
    // 先矫正定位
    if(Platform.OS === 'android') {
      SARMap.setEffectLayerCenter(fileName.substring(0, fileName.lastIndexOf('.')))
    } else {
      // IOS TODO
    }
    if(addLayerName !== '') {
      GLOBAL.isNotEndAddEffect = true
      const layers = await _params.getARLayers()
      const defaultLayer = layers.find((item: ARLayer) => {
        return item.type === ARLayerType.EFFECT_LAYER
      })
      if(defaultLayer) {
        _params.setCurrentARLayer(defaultLayer)
      }
    }
  } catch (e) {
    Toast.show(e)
  }
}

/**
 * 根据图层类型添加不同数据源数据集
 *
 * 不支持特效层
 */
async function checkARLayer(type: TARLayerType) {
  if(type === ARLayerType.EFFECT_LAYER) return
  const _params: any = ToolbarModule.getParams()
  const _data: any = ToolbarModule.getData()
  let newDatasource = _data.addNewDSourceWhenCreate === true
  let newDataset = _data.addNewDsetWhenCreate === true
  ToolbarModule.addData({
    addNewDSourceWhenCreate: false,
    addNewDsetWhenCreate: false,
  })
  // const props = AppToolBar.getProps()
  const currentLayer = _params.arlayer.currentLayer
  let satisfy = false
  if(currentLayer) {
    if(!newDataset && currentLayer && currentLayer.type === type) {
      satisfy = true
    } else {
      newDataset = true
    }
    if (currentLayer.datasourceAlias) {
      // DataHandler.setARRawDatasource(currentLayer.datasourceAlias)
      newDatasource = false
    }
  } else if (_params.armap.currentMap?.mapName) { // 已有地图，没有选择/没有 当前图层
    newDatasource = true
  } else {
    await _params.createARMap()
    newDatasource = true
  }

  if(!satisfy) {
    let datasourceName = DataHandler.getARRawDatasource() || _params.armap.currentMap?.mapName || 'ARMAP_DEFAULT'
    let datasetName: string
    switch(type) {
      case ARLayerType.AR_MEDIA_LAYER:
        datasetName = 'defaultArPoiLayer'
        break
      case ARLayerType.AR_TEXT_LAYER:
        datasetName = 'defaultArTextLayer'
        break
      case ARLayerType.AR_MODEL_LAYER:
        datasetName = 'defaultArModelLayer'
        break
      default:
        datasetName = 'defaultArLayer'
    }
    const result = await DataHandler.createARElementDatasource(_params.user.currentUser, datasourceName, datasetName, newDatasource, newDataset, type)
    if(result.success) {
      datasourceName = result.datasourceName
      datasetName = result.datasetName
      if(newDatasource) {
        DataHandler.setARRawDatasource(datasourceName)
      }
      await SARMap.addElementLayer(datasourceName, datasetName, type, false)
      const layers = await _params.getARLayers()
      const defaultLayer = layers.find((item: ARElementLayer) => {
        if(item.type === type) {
          const layer = item
          return layer.datasourceAlias === datasourceName && layer.datasetName === datasetName
        }
        return false
      })
      if(defaultLayer) {
        await _params.setCurrentARLayer(defaultLayer)
      }
    } else {
      Toast.show(result.error)
    }
  }
}

async function toolbarBack() {
  const _params: any = ToolbarModule.getParams()
  const _data: any = ToolbarModule.getData()

  if (_params.type === ConstToolType.SM_AR_DRAWING_ADD_POINT) {
    // 点选添加对象界面，返回上一级
    setARToolbar(_data.prevType, { arContent: _data.arContent })
    ToolbarModule.addData({
      prevType: null,
    })
    SARMap.setCenterHitTest(false)
    return
  }
  // SARMap.setAction(ARAction.SELECT)
  SARMap.setAction(ARAction.NULL)
  SARMap.clearSelection()
  SARMap.cancel()
  _params.setToolbarVisible(true, ConstToolType.SM_AR_DRAWING, {
    containerType: ToolbarType.tableTabs,
    isFullScreen: false,
  })
  ToolbarModule.addData({selectARElement: null})
}

function commit() {
  GLOBAL.isNotEndAddEffect = false
  SARMap.setCenterHitTest(false)
  // SARMap.setAction(ARAction.SELECT)
  SARMap.setAction(ARAction.NULL)
  SARMap.clearSelection()
  SARMap.submit()
  return false
}

function close() {
  const _params: any = ToolbarModule.getParams()
  SARMap.clearSelection()
  SARMap.setCenterHitTest(false)
  // SARMap.setAction(ARAction.SELECT)
  SARMap.setAction(ARAction.NULL)
  ToolbarModule.addData({selectARElement: null})
  _params.setToolbarVisible(false)
  return true
}

export async function download3DExample() {
  _downloadExample('workspace3d', AR3DExample)
}

export async function downloadModelExample(downloadKeys?: string[]) {
  let downloadData = []
  if (downloadKeys && downloadKeys.length > 0) {
    for (const key of downloadKeys) {
      for (const item of ARModelExample) {
        if (key === `${item.userName}_${item.downloadName}`) {
          downloadData.push(item)
        }
      }
    }
  }
  if (downloadData.length === 0) {
    downloadData = downloadData.concat(ARModelExample)
  }
  _downloadExamples('armodel', downloadData)
}

export async function downloadEffectlExample(downloadKeys?: string[]) {
  const defaultData = [AREffectExample, AREffectExample2, AREffectExample3, AREffectExample4]
  let downloadData = []
  if (downloadKeys && downloadKeys.length > 0) {
    for (const key of downloadKeys) {
      for (const item of defaultData) {
        if (key === `${item.userName}_${item.downloadName}`) {
          downloadData.push(item)
        }
      }
    }
  }
  if (downloadData.length === 0) {
    downloadData = downloadData.concat(defaultData)
  }
  _downloadExamples('areffect', downloadData)
}

async function _downloadExamples(type: ExternalDataType, examples: ExampleData[]) {
  for(const example of examples) {
    const downloadKey = example.userName + '_' + example.downloadName
    // const downloadData: Download | undefined = _getDownload(downloadKey)
    // if(downloadData && downloadData.progress < 100) {
    if(AppProgress.isInProgress(downloadKey)) {
      Toast.show(getLanguage(global.language).Prompt.DOWNLOADING)
      return
    }
  }

  for(let i = 0; i < examples.length; i++) {
    await _downloadExample(type, examples[i])
  }
}

// function _getDownload(id: string) {
//   const _data: any = ToolbarModule.getData()
//   const _allProgress: Downloads = _data.downloads
//   if (!_allProgress) return undefined
//   for(const item of _allProgress) {
//     if (item.id === id) {
//       return item
//     }
//   }
// }

async function _downloadExample(type: ExternalDataType, exampleData: ExampleData) {
  const _params: any = ToolbarModule.getParams()
  const _data: any = ToolbarModule.getData()
  const downloadKey = exampleData.userName + '_' + exampleData.downloadName
  // const downloadData: Download | undefined = _getDownload(downloadKey)
  // if(downloadData && downloadData.progress < 100) {
  //   Toast.show(getLanguage(global.language).Prompt.DOWNLOADING)
  //   return false
  // }
  if(AppProgress.isInProgress(downloadKey)) {
    Toast.show(getLanguage().Prompt.DOWNLOADING)
    return false
  }
  const homePath = await FileTools.getHomeDirectory()
  let result: boolean = true
  //尝试读取以前下载的示范数据
  const items = await DataHandler.getExternalData(homePath + ConstPath.Common + exampleData.dir, [type])
  if(items.length === 0) {
    Toast.show(getLanguage(global.language).Prompt.DOWNLOADING)
    AppProgress.addProgress(downloadKey)
    result = await DataHandler.downloadExampleData(exampleData, progress => {
      AppProgress.updateProgress(downloadKey, progress)
    })
    // const downloadOption = await DataHandler.getDataDownloadOption(exampleData)
    // if (downloadOption) {
    //   const downloadOptions = {
    //     fromUrl: downloadOption.fromUrl,
    //     toFile: downloadOption.toFile,
    //     background: true,
    //     fileName: downloadOption.fileName,
    //     progressDivider: 1,
    //     key: downloadOption.id,
    //     // key: downloadKey,
    //     module: global.Type,
    //   }
    //   result = await _params.downloadFile(downloadOptions)

    //   if(result) {
    //     result = await FileTools.unZipFile(downloadOption.toFile, downloadOption.toFile.substring(0, downloadOption.toFile.lastIndexOf('/')))
    //     result && FileTools.deleteFile(downloadOption.toFile)
    //   }
    // }
    if(result) {
      Toast.show(getLanguage(global.language).Prompt.IMPORTING)
      const items = await DataHandler.getExternalData(homePath + ConstPath.Common + exampleData.dir, [type])
      if(items.length > 0) {
        //TODO 导入所有数据
        for (const item of items) {
          result = await DataHandler.importExternalData(_params.user.currentUser, item) && result
        }
        // result && AppToolBar.resetTabData()
        Toast.show(result ? getLanguage(global.language).Prompt.IMPORTED_SUCCESS : getLanguage(global.language).Prompt.FAILED_TO_IMPORT)
      } else {
        Toast.show('没有数据')
      }
    } else {
      Toast.show(getLanguage(global.language).Prompt.DOWNLOAD_FAILED)
    }
    AppProgress.onProgressEnd(downloadKey)
  } else {
    Toast.show(getLanguage(global.language).Prompt.IMPORTING)
    // result = await DataHandler.importExternalData(_params.user.currentUser, items[0])
    for (const item of items) {
      result = await DataHandler.importExternalData(_params.user.currentUser, item) && result
    }
    // result && AppToolBar.resetTabData()
    AppProgress.onProgressEnd(downloadKey)
    Toast.show(result ? getLanguage(global.language).Prompt.IMPORTED_SUCCESS : getLanguage(global.language).Prompt.FAILED_TO_IMPORT)
  }
}


export default {
  toolbarBack,
  commit,
  close,

  addAtCurrent,
  addAtPoint,

  addMedia,
  arVideo,
  arImage,
  arWebView,
  arText,
  addText,
  ar3D,
  addARScene,
  arModel,
  addARModel,
  addAREffect,

  download3DExample,
  downloadModelExample,
  downloadEffectlExample,
}
