/* global global */
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
import { Point3D } from "imobile_for_reactnative/types/data"
import {
  ConstToolType,
  ToolbarType,
  ConstPath,
} from '../../../../../../constants'
import { Toast, AppProgress, DialogUtils, dataUtil, AppToolBar, AppEvent } from '../../../../../../utils'
import NavigationService from '../../../../../NavigationService'
import { getLanguage } from '../../../../../../language'
import { ImagePicker } from '../../../../../../components'
import ToolbarModule from '../ToolbarModule'
import DataHandler from '../../../../../../utils/DataHandler'
import { AR3DExample, AREffectExample, ARModelExample, AREffectExample2, AREffectExample3, AREffectExample4, ExampleData } from '../../../../../../utils/DataHandler/DataExample'
import { ExternalDataType } from '../types'
import { Platform } from 'react-native'
import { getThemeAssets } from '../../../../../../assets'
import ToolbarBtnType from '../../ToolbarBtnType'

interface AssetType {
  Photos: 'Photos',
  Videos: 'Videos',
  All: 'All'
}

function openSourcePicker(assetType: keyof AssetType, callback: (data: any) => void, size: number) {
  ImagePicker.AlbumListView.defaultProps.showDialog = false
  ImagePicker.AlbumListView.defaultProps.assetType = assetType
  ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'
  ImagePicker.getAlbum({
    maxSize: size,
    callback: callback,
  })
}

function setARToolbar(type: string, data?: { [name: string]: any }) {
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

let isAddingARElement = false
/**
 * 添加到当前位置
 * @param type
 */
async function addAtCurrent(type: string, location?: Point3D) {
  if (isAddingARElement) return
  isAddingARElement = true
  if (type === ConstToolType.SM_AR_DRAWING_SCENE) {
    await addARScene(location)
  } else if (type === ConstToolType.SM_AR_DRAWING_MODAL) {
    await addARModel(location)
  } else if (type === ConstToolType.SM_AR_DRAWING_TEXT) {
    await addText(location)
  } else if(type === ConstToolType.SM_AR_DRAWING_BUBBLE_TEXT) {
    await addBubbleText(location)
  } else if (type === ConstToolType.SM_AR_DRAWING_ADD_BROCHORE) {
    await addBrochore(location)
  } else if (type === ConstToolType.SM_AR_DRAWING_ADD_SAND_TABLE_ALBUM) {
    await addARSandTableAlbum(location)
  } else if (type === ConstToolType.SM_AR_DRAWING_ADD_ATTRIBUTE_WIDGET) {
    await addARAttriubutWidget(location)
  } else if (type === ConstToolType.SM_AR_DRAWING_ADD_WIDGET) {
    await addARWidget(location)
  } else if (type === ConstToolType.SM_AR_DRAWING_ADD_VIDEO_ALBUM) {
    await addARVideoAlbum(location)
  } else if (type === ConstToolType.SM_AR_DRAWING_ADD_LINE) {
    await addARLinePoint(location)
  } else if (type === ConstToolType.SM_AR_DRAWING_ADD_MARKER_LINE) {
    await addARMarkerLinePoint(location)
  } else if (type === ConstToolType.SM_AR_DRAWING_ADD_SAND) {
    await addSandTable(location)
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
  AppToolBar.addData({ isAlbumFirstAdd: true })
}

/**
 * 添加到指定位置
 * @param type
 */
async function addAtPoint(type: string) {
  // const _params: any = ToolbarModule.getParams()
  // const _data: any = ToolbarModule.getData()
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
      const path = data[0].uri
      setARToolbar(ConstToolType.SM_AR_DRAWING_VIDEO, { arContent: path })
    }
  }, 1)
}

async function arImage() {
  openSourcePicker('Photos', data => {
    if (data && data.length > 0) {
      const path = data[0].uri
      setARToolbar(ConstToolType.SM_AR_DRAWING_IMAGE, { arContent: path })
    }
  }, 1)
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

function arBubbleText() {
  DialogUtils.showInputDailog({
    value: '',
    confirmAction: async (value: string) => {
      setARToolbar(ConstToolType.SM_AR_DRAWING_BUBBLE_TEXT, { arContent: value })
      DialogUtils.hideInputDailog()
    },
  })
}

async function ar3D(path: string) {
  setARToolbar(ConstToolType.SM_AR_DRAWING_SCENE, { arContent: path })
}

/** 打开三维场景 */
export async function addARScene(location?: Point3D) {
  try {
    const _params: any = ToolbarModule.getParams()
    const _data: any = ToolbarModule.getData()
    let newDatasource = false
    const mapName = _params.armap.currentMap?.mapName
    ToolbarModule.addData({
      addNewDSourceWhenCreate: false,
      addNewDsetWhenCreate: false,
    })
    if (!mapName) {
      await _params.createARMap()
      newDatasource = true
    }

    //若已存在场景图层则先移除
    const sceneLayers = _params.arlayer?.layers?.filter((layer: ARLayer) => {
      return layer.type === ARLayerType.AR_SCENE_LAYER
    })
    if (sceneLayers && sceneLayers.length > 0) {
      await SARMap.removeARLayer(sceneLayers[0].name)
    }

    let datasourceName = _params.armap.currentMap?.mapName || DataHandler.getARRawDatasource()
    let datasetName = 'scene'
    const result = await DataHandler.createARElementDatasource(_params.user.currentUser, datasourceName, datasetName, newDatasource, true, ARLayerType.AR3D_LAYER)
    if (result.success) {
      datasourceName = result.datasourceName
      datasetName = result.datasetName || ''
      if (newDatasource) {
        DataHandler.setARRawDatasource(datasourceName)
      }

      const homePath = await FileTools.getHomeDirectory()
      let path: string = _data.arContent
      if (!path) {
        Toast.show(getLanguage(global.language).Prompt.NO_SCENE_SELECTED)
        return
      }

      try {
        let addLayerName: string
        if (path.indexOf('http') === 0) {
          //double check
          const isValidUrl = dataUtil.checkOnline3DServiceUrl(path) === ''
          if (!isValidUrl) {
            Toast.show(getLanguage().Profile.ONLINE_DATA_UNAVAILABLE)
            return
          }
          const iserverSrv = new IServerService()
          const info = await iserverSrv.getSceneInfo(path)
          if ('error' in info) {
            Toast.show(getLanguage().Profile.ONLINE_DATA_UNAVAILABLE)
            return
          }
          const { serverUrl, sceneName, datasetUrl } = getOnlineSceneFromUrl(path)
          const co = new SCoordination('online')
          const recordinfo = await co.downloadRecordset(datasetUrl, 0, 1)
          const sceneOffset: Point3D = { x: 0, y: 0, z: 0 }
          if (recordinfo.length > 0) {
            recordinfo[0].featureInfo.forEach(feature => {
              if (feature.name === 'AR_SCENE_X') {
                sceneOffset.x = feature.value as number
              }
              if (feature.name === 'AR_SCENE_Y') {
                sceneOffset.y = feature.value as number
              }
              if (feature.name === 'AR_SCENE_Z') {
                sceneOffset.z = feature.value as number
              }
            })
          }
          addLayerName = await SARMap.addSceneLayerOnline(datasourceName, datasetName, serverUrl, sceneName, location, sceneOffset)
        } else {
          path = homePath + _data.arContent
          const pxp = await DataHandler.getPxpContent(path)
          if (pxp === null) return
          const wsPath = path.substring(0, path.lastIndexOf('/')) + '/' + pxp.Workspace.server
          addLayerName = await SARMap.addSceneLayer(datasourceName, datasetName, wsPath, location)
        }
        if (addLayerName !== '') {
          const layers: ARLayer[] = await _params.getARLayers()
          const defaultLayer = layers.find(item => {
            return item.type === ARLayerType.AR_SCENE_LAYER
          })
          if (defaultLayer) {
            _params.setCurrentARLayer(defaultLayer)
          }
        }
      } catch (e) {
        console.warn(e)
      } finally {
        // AppToolBar.show('ARMAP', 'AR_MAP_SELECT_ADD')
      }
    }
  } catch (error) {
    console.warn(error)
  }
}

function getOnlineSceneFromUrl(url: string): { serverUrl: string, datasetUrl: string, sceneName: string } {
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
export async function addARModel(location?: Point3D) {
  try {
    await checkARLayer(ARLayerType.AR_MODEL_LAYER)
    const _params: any = ToolbarModule.getParams()
    const _data: any = ToolbarModule.getData()
    const layer = _params.arlayer.currentLayer
    if (layer) {
      SARMap.addARModel(layer.name, await FileTools.getHomeDirectory() + _data.arContent, location)
    }
  } catch (error) {
    Toast.show(error)
  }
}

async function addMedia(type: TARElementType, location?: Point3D) {
  try {
    await checkARLayer(ARLayerType.AR_MEDIA_LAYER)
    const _params: any = ToolbarModule.getParams()
    const _data: any = ToolbarModule.getData()
    let content = _data.arContent
    const layer = _params.arlayer.currentLayer
    if (content && layer && layer.type === ARLayerType.AR_MEDIA_LAYER) {
      if ((type === ARElementType.AR_VIDEO || type === ARElementType.AR_IMAGE) && content.indexOf('file://') === 0) {
        content = content.substring(7)
      }
      SARMap.addARMedia(layer.name, type, content, location)
    }
    return false
  } catch (error) {
    Toast.show(error)
  }
}

async function addText(location?: Point3D) {
  try {
    await checkARLayer(ARLayerType.AR_TEXT_LAYER)
    const _params: any = ToolbarModule.getParams()
    const _data: any = ToolbarModule.getData()
    const content = _data.arContent
    const layer = _params.arlayer.currentLayer
    if (content && layer && layer.type === ARLayerType.AR_TEXT_LAYER) {
      SARMap.addARText(layer.name, content, location)
    }
  } catch (error) {
    Toast.show(error)
  }
}

async function addBubbleText(location?: Point3D) {
  try {
    await checkARLayer(ARLayerType.AR_TEXT_LAYER)
    const _params: any = ToolbarModule.getParams()
    const _data: any = ToolbarModule.getData()
    let content = _data.arContent
    const layer = _params.arlayer.currentLayer
    if(content && layer && layer.type === ARLayerType.AR_TEXT_LAYER) {
      SARMap.addARBubbleText(layer.name, content, location)
    }
  } catch (error) {
    Toast.show(error)
  }
}

async function addBrochore(location?: Point3D){
  await checkARLayer(ARLayerType.AR_WIDGET_LAYER)
  const _params: any = ToolbarModule.getParams()
  const _data: any = ToolbarModule.getData()
  const layer = _params.arlayer.currentLayer
  const albumName = _data.albumName
  if (layer) {
    SARMap.addARBrochore(layer.name, ARElementType.AR_BROCHOR, albumName, location)
  }
}

async function addARSandTableAlbum(location?: Point3D) {
  await checkARLayer(ARLayerType.AR_WIDGET_LAYER)
  const _params: any = ToolbarModule.getParams()
  const _data: any = ToolbarModule.getData()
  const layer = _params.arlayer.currentLayer
  const albumName = _data.albumName
  const { sandTablePaths } = _data
  if (layer && sandTablePaths) {
    await SARMap.addARSandTableAlbum(layer.name, sandTablePaths, albumName, location)
  }
}

async function addARAttriubutWidget(location?: Point3D) {
  await checkARLayer(ARLayerType.AR_WIDGET_LAYER)
  const _params: any = ToolbarModule.getParams()
  const _data: any = ToolbarModule.getData()
  const layer = _params.arlayer.currentLayer
  const albumName = _data.albumName
  const arPhotos = _data.arPhotos
  if (arPhotos && layer) {
    SARMap.addARAttributeWidget(layer.name, ARElementType.AR_ATTRIBUTE_ALBUM, arPhotos, albumName, location)
  }
}

async function addARWidget(location?: Point3D) {
  await checkARLayer(ARLayerType.AR_WIDGET_LAYER)
  const _params: any = ToolbarModule.getParams()
  const _data: any = ToolbarModule.getData()
  const layer = _params.arlayer.currentLayer
  const albumName = _data.albumName
  const arPhotos = _data.arPhotos
  if (arPhotos && layer) {
    SARMap.addARWidget(layer.name, ARElementType.AR_ALBUM, arPhotos, albumName, location)
  }
}

async function addARVideoAlbum(location?: Point3D) {
  await checkARLayer(ARLayerType.AR_WIDGET_LAYER)
  const _params: any = ToolbarModule.getParams()
  const _data: any = ToolbarModule.getData()
  const layer = _params.arlayer.currentLayer
  const albumName = _data.albumName
  const arPhotos = _data.arPhotos
  const videoType = _data.videoType
  if (arPhotos && layer) {
    SARMap.addARVideoAlbum(layer.name, ARElementType.AR_VIDEO_ALBUM, arPhotos, albumName, videoType, location)
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
    const homePath = await FileTools.getHomeDirectory()
    let effectLayer: ARLayer | undefined = undefined

    // 是否允许新建图层添加
    // 特效图层是否未添加完毕  false表示添加完毕， true表示未添加完毕
    // const isNotEnd = _data.isNotEndAddEffect
    const isNotEnd = global.isNotEndAddEffect

    // 获取当前图层
    const layer = _params?.arlayer?.currentLayer
    // 若当前图层是特效图层
    if (layer?.type === ARLayerType.EFFECT_LAYER) {
      effectLayer = layer
    }

    // 若当前图层是特效图层,且为正在添加状态，则替换
    if (isNotEnd && effectLayer) {
      const homePath = await FileTools.getHomeDirectory()
      if (Platform.OS === 'ios') {
        const targetPath = filePath.replace('.areffect', '.mp4')
        await FileTools.copyFile(homePath + filePath, homePath + targetPath)
        SARMap.setAREffect(effectLayer.name, homePath + targetPath)
      } else {
        SARMap.setAREffect(effectLayer.name, homePath + filePath)
      }
      const layerName = fileName.substring(0, fileName.lastIndexOf('.'))
      await SARMap.setLayerCaption(effectLayer.name, layerName)
      await _params.getARLayers()
      return
    }

    const mapName = _params.armap.currentMap?.mapName

    // 若无当前地图，则新建地图
    if (!mapName) {
      await _params.createARMap()
    }
    const layerName = fileName.substring(0, fileName.lastIndexOf('.'))
    let addLayerName
    if (Platform.OS === 'ios') {
      const targetPath = filePath.replace('.areffect', '.mp4')
      await FileTools.copyFile(homePath + filePath, homePath + targetPath)
      addLayerName = await SARMap.addEffectLayer(layerName, homePath + targetPath)
    } else {
      addLayerName = await SARMap.addEffectLayer(layerName, homePath + filePath)
    }
    // 先矫正定位
    if (Platform.OS === 'android') {
      SARMap.setEffectLayerCenter(fileName.substring(0, fileName.lastIndexOf('.')))
    } else {
      // IOS TODO
    }
    if (addLayerName !== '') {
      global.isNotEndAddEffect = true
      const layers = await _params.getARLayers()
      const defaultLayer = layers.find((item: ARLayer) => {
        return item.type === ARLayerType.EFFECT_LAYER
      })
      if (defaultLayer) {
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
  if (type === ARLayerType.EFFECT_LAYER) return
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
  if (currentLayer) {
    if (!newDataset && currentLayer && currentLayer.type === type) {
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

  if (!satisfy) {
    let datasourceName = DataHandler.getARRawDatasource() || _params.armap.currentMap?.mapName || 'ARMAP_DEFAULT'
    let datasetName: string
    switch (type) {
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
    if (result.success) {
      datasourceName = result.datasourceName
      datasetName = result.datasetName
      if (newDatasource) {
        DataHandler.setARRawDatasource(datasourceName)
      }
      await SARMap.addElementLayer(datasourceName, datasetName, type, false)
      const layers = await _params.getARLayers()
      const defaultLayer = layers.find((item: ARElementLayer) => {
        if (item.type === type) {
          const layer = item
          return layer.datasourceAlias === datasourceName && layer.datasetName === datasetName
        }
        return false
      })
      if (defaultLayer) {
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

  if(_params.type === ConstToolType.SM_AR_DRAWING_MODAL) {
    AppEvent.emitEvent('ar_map_add_end')
  }

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
  ToolbarModule.addData({ selectARElement: null })
}

function commit() {
  const _data: any = ToolbarModule.getData()
  const _params: any = ToolbarModule.getParams()
  if(_params.type === ConstToolType.SM_AR_DRAWING_MODAL
    || _params.type === ConstToolType.SM_AR_DRAWING_ADD_POINT
  ) {
    AppEvent.emitEvent('ar_map_add_end')
  }

  if(_params.type === ConstToolType.SM_AR_DRAWING_ADD_LINE ||
    _params.type === ConstToolType.SM_AR_DRAWING_ADD_MARKER_LINE ||
    _data.prevType === ConstToolType.SM_AR_DRAWING_ADD_LINE ||
    _data.prevType === ConstToolType.SM_AR_DRAWING_ADD_MARKER_LINE
  ){
    addARLineElement()
  }

  global.isNotEndAddEffect = false
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
  ToolbarModule.addData({ selectARElement: null })
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
  for (const example of examples) {
    const downloadKey = example.userName + '_' + example.downloadName
    // const downloadData: Download | undefined = _getDownload(downloadKey)
    // if(downloadData && downloadData.progress < 100) {
    if (AppProgress.isInProgress(downloadKey)) {
      Toast.show(getLanguage(global.language).Prompt.DOWNLOADING)
      return
    }
  }

  for (let i = 0; i < examples.length; i++) {
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
  if (AppProgress.isInProgress(downloadKey)) {
    Toast.show(getLanguage().Prompt.DOWNLOADING)
    return false
  }
  const homePath = await FileTools.getHomeDirectory()
  let result: boolean = true
  //尝试读取以前下载的示范数据
  const items = await DataHandler.getExternalData(homePath + ConstPath.Common + exampleData.dir, [type])
  if (items.length === 0) {
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
    if (result) {
      Toast.show(getLanguage(global.language).Prompt.IMPORTING)
      const items = await DataHandler.getExternalData(homePath + ConstPath.Common + exampleData.dir, [type])
      if (items.length > 0) {
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

function arAttributeAlbum() {
  const _params: any = ToolbarModule.getParams()
  const data = []
  data.push({
    key: ConstToolType.SM_AR_ATTRIBUTE_ALBUM,
    title: getLanguage(global.language).Map_Main_Menu.RELATIONSHIP,
    action: () => {
      openSourcePicker('Photos', data => {
        if (data && data.length > 0) {
          ToolbarModule.addData({ arPhotos: data, albumName: getLanguage().ATTRIBUTE_ALBUM })
          const _params: any = ToolbarModule.getParams()
          _params.setToolbarVisible(true, ConstToolType.SM_AR_DRAWING_ADD_WIDGET, {
            isFullScreen: false,
          })
        }
      }, 10)
    },
    size: 'large',
    image: getThemeAssets().ar.functiontoolbar.icon_tool_relation,
  }, {
    key: ConstToolType.SM_AR_ATTRIBUTE_ALBUM,
    title: getLanguage(global.language).Map_Main_Menu.LIST,
    action: () => {
      openSourcePicker('Photos', data => {
        if (data && data.length > 0) {
          ToolbarModule.addData({ arPhotos: data, albumName: getLanguage().ATTRIBUTE_ALBUM })
          const _params: any = ToolbarModule.getParams()
          _params.setToolbarVisible(true, ConstToolType.SM_AR_DRAWING_ADD_ATTRIBUTE_WIDGET, {
            isFullScreen: false,
          })
        }
      }, 10)
    },
    size: 'large',
    image: getThemeAssets().ar.functiontoolbar.icon_tool_list,
  })
  const buttons = [
    ToolbarBtnType.TOOLBAR_BACK,
  ]
  _params.setToolbarVisible(true, ConstToolType.SM_AR_ATTRIBUTE_ALBUM, {
    isFullScreen: false,
    containerType: ToolbarType.table,
    data,
    buttons,
  })
}

function arVideoAlbum() {
  const _params: any = ToolbarModule.getParams()
  const data = []
  data.push({
    key: ConstToolType.SM_AR_VIDEO_ALBUM,
    title: getLanguage(global.language).Map_Main_Menu.LOOP,
    action: () => {
      openSourcePicker('Videos', data => {
        if (data && data.length > 0) {
          ToolbarModule.addData({ arPhotos: data, albumName: getLanguage().VIDEO_ALBUM, videoType: 0 })
          const _params: any = ToolbarModule.getParams()
          _params.setToolbarVisible(true, ConstToolType.SM_AR_DRAWING_ADD_VIDEO_ALBUM, {
            isFullScreen: false,
          })
        }
      }, 5)
    },
    size: 'large',
    image: getThemeAssets().ar.functiontoolbar.icon_tool_loop,
  }, {
    key: ConstToolType.SM_AR_VIDEO_ALBUM,
    title: getLanguage(global.language).Map_Main_Menu.LIST,
    action: () => {
      openSourcePicker('Videos', data => {
        if (data && data.length > 0) {
          ToolbarModule.addData({ arPhotos: data, albumName: getLanguage().VIDEO_ALBUM, videoType: 1 })
          const _params: any = ToolbarModule.getParams()
          _params.setToolbarVisible(true, ConstToolType.SM_AR_DRAWING_ADD_VIDEO_ALBUM, {
            isFullScreen: false,
          })
        }
      }, 10)
    },
    size: 'large',
    image: getThemeAssets().ar.functiontoolbar.icon_tool_list,
  })
  const buttons = [
    ToolbarBtnType.TOOLBAR_BACK,
  ]
  _params.setToolbarVisible(true, ConstToolType.SM_AR_VIDEO_ALBUM, {
    isFullScreen: false,
    containerType: ToolbarType.table,
    data,
    buttons,
  })
}

function arMapBrochor() {
  NavigationService.navigate("MapSelectList", { type: 'mapSelect' })
}

function arSandtableAlbum() {
  NavigationService.navigate("MapSelectList", { type: 'sandTableSelect' })
}

/** 矢量线节点的添加 */
async function addARLinePoint(location?: Point3D) {
  // 根据图层类型添加不同数据源数据集
  await checkARLayer(ARLayerType.AR_LINE_LAYER)
  // 获取当前图层
  const _params: any = ToolbarModule.getParams()
  const layer = _params.arlayer.currentLayer
  // 当前图层是线图层
  if(layer && layer.type === ARLayerType.AR_LINE_LAYER) {
    if(location){
      SARMap.setAction(ARAction.LINE_CREATE_FOUCUS)
      SARMap.addARLinePoint(layer.name, {translation:location})
    }else{
      SARMap.setAction(ARAction.LINE_CREATE)
      SARMap.addARLinePoint(layer.name, {foucus: false})
    }
  }
}

/** 矢量符号线节点的添加 */
async function addARMarkerLinePoint(location?: Point3D) {
  // 根据图层类型添加不同数据源数据集
  await checkARLayer(ARLayerType.AR_MARKER_LINE_LAYER)
  // await checkARElementLayer(401)
  // 获取当前图层
  const _params: any = ToolbarModule.getParams()
  const layer = _params.arlayer.currentLayer
  // 当前图层是线图层
  if(layer && layer.type === ARLayerType.AR_MARKER_LINE_LAYER) {
    // SARMap.addARLinePoint(layer.name, option?.translation)
    if(location){
      SARMap.setAction(ARAction.LINE_CREATE_FOUCUS)
      SARMap.addARLinePoint(layer.name, {translation:location})
    }else{
      SARMap.setAction(ARAction.LINE_CREATE)
      SARMap.addARLinePoint(layer.name, {foucus: false})
    }
  }
}

/** 矢量线节点的添加 */
async function editAddLinePoint(location?: Point3D) {
  // 获取当前图层
  const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
  // 当前图层是线图层
  if (layer && (layer.type === ARLayerType.AR_LINE_LAYER || layer.type === ARLayerType.AR_MARKER_LINE_LAYER)) {

    if (location) {
      SARMap.setAction(ARAction.VERTEX_ADD_FOUCUS)
      SARMap.addARLinePoint(layer.name, { translation: location })
    } else {
      SARMap.setAction(ARAction.VERTEX_ADD)
      SARMap.addARLinePoint(layer.name, { foucus: false, updatefoucus: false })
    }
  }
}

/** 撤销矢量线或矢量符号线的节点的添加操作 */
async function cancelAddARLinePoint() {
  // 获取当前图层
  const _params: any = ToolbarModule.getParams()
  const layer = _params.arlayer.currentLayer
  // 当前图层是线图层
  if(layer && (layer.type === ARLayerType.AR_LINE_LAYER || layer.type === ARLayerType.AR_MARKER_LINE_LAYER)) {
    SARMap.cancelAddARLinePoint(layer.name)
  }
}

/** 矢量线或矢量符号线对象的添加 */
async function addARLineElement() {
  // 获取当前图层
  const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
  if(layer && (layer.type === ARLayerType.AR_LINE_LAYER || layer.type === ARLayerType.AR_MARKER_LINE_LAYER)) {
    SARMap.addARLineElement(layer.name)
  }
}

/** 矢量线或矢量符号线对象的更新 */
async function updateARLineElement() {
  // 获取当前图层
  const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
  if(layer && (layer.type === ARLayerType.AR_LINE_LAYER || layer.type === ARLayerType.AR_MARKER_LINE_LAYER)) {
    SARMap.updateARLineElement(layer.name)
  }
}

function arSandTable(path: string) {
  setARToolbar(ConstToolType.SM_AR_DRAWING_ADD_SAND, { arContent: path })
}

async function addSandTable(location?: Point3D) {
  try {
    await checkARLayer(ARLayerType.AR_MODEL_LAYER)
    const _params: any = ToolbarModule.getParams()
    const _data: any = ToolbarModule.getData()
    const layer = _params.arlayer.currentLayer
    if (layer && _data.arContent) {
      await SARMap.addARSandTable(layer.name, _data.arContent, location)
    }
  } catch (e) {
    Toast.show(e)
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
  arBubbleText,
  addText,
  ar3D,
  addARScene,
  arModel,
  addARModel,
  addAREffect,

  arAttributeAlbum,
  arVideoAlbum,
  arMapBrochor,
  arSandtableAlbum,

  addARLinePoint,
  addARMarkerLinePoint,
  cancelAddARLinePoint,
  editAddLinePoint,
  updateARLineElement,

  download3DExample,
  downloadModelExample,
  downloadEffectlExample,

  arSandTable,
  addSandTable,
}
