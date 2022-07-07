import { ARElementLayer, ARElementType, ARLayerType, SARMap, TARElementType, FileTools, TARLayerType, SCoordination, IServerService } from "imobile_for_reactnative"
import { getLanguage } from "@/language"
import { ExternalDataType } from "@/types"
import { AppLog, AppPath, AppToolBar, CheckSpell, DataHandler, Toast, AppUser } from "@/utils"
import { AR3DExample, ExampleData} from "@/utils/DataHandler/DataExample"
import { Platform } from "react-native"
import { Point3D } from "imobile_for_reactnative/types/data"
import { FetchBlob } from "@/utils/FetchBlob"
import DataLocal from "@/utils/DataHandler/DataLocal"
import { UserRoot } from "@/utils/AppPath"
import AppProgress from "imobile_for_reactnative/utils/AppProgress"
import { ConstPath } from "../../../../src/constants"

export interface AddOption {
  translation?: Point3D
  rotation?: Point3D
  parentId?: number
  foucus?: boolean
  updatefoucus?: boolean
}

async function addMedia(type: TARElementType, option?: AddOption) {
  await checkARElementLayer(ARLayerType.AR_MEDIA_LAYER)
  let content = AppToolBar.getData().arContent
  const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
  if(content && layer && layer.type === ARLayerType.AR_MEDIA_LAYER) {
    if((type === ARElementType.AR_VIDEO || type === ARElementType.AR_IMAGE) && content.indexOf('file://') === 0) {
      content = content.substring(7)
    }
    SARMap.addARMedia(layer.name, type, content, option?.translation)
  }
}

export function addImage(option?: AddOption) {
  return addMedia(ARElementType.AR_IMAGE, option)
}

export function addVideo(option?: AddOption) {
  return addMedia(ARElementType.AR_VIDEO, option)
}

export function addWebView(option?: AddOption) {
  return addMedia(ARElementType.AR_WEBVIEW, option)
}

export async function addText(option?: AddOption) {
  await checkARElementLayer(ARLayerType.AR_TEXT_LAYER)
  const content = AppToolBar.getData().arContent
  const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
  if(content && layer && layer.type === ARLayerType.AR_TEXT_LAYER) {
    SARMap.addARText(layer.name, content, option?.translation)
  }
}

export async function addBubbleText(option?: AddOption) {
  await checkARElementLayer(ARLayerType.AR_TEXT_LAYER)
  const content = AppToolBar.getData().arContent
  const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
  if(content && layer && layer.type === ARLayerType.AR_TEXT_LAYER) {
    SARMap.addARBubbleText(layer.name, content, option?.translation)
  }
}

/** 矢量线节点的添加 */
export async function addARLinePoint(option?: AddOption) {
  // 根据图层类型添加不同数据源数据集
  await checkARElementLayer(ARLayerType.AR_LINE_LAYER)
  // 获取当前图层
  const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
  // 当前图层是线图层
  if(layer && layer.type === ARLayerType.AR_LINE_LAYER) {
    SARMap.addARLinePoint(layer.name, option)
  }
}

/** 矢量符号线节点的添加 */
export async function addARMarkerLinePoint(option?: AddOption) {
  // 根据图层类型添加不同数据源数据集
  await checkARElementLayer(ARLayerType.AR_MARKER_LINE_LAYER)
  // await checkARElementLayer(401)
  // 获取当前图层
  const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
  // 当前图层是线图层
  if(layer && layer.type === ARLayerType.AR_MARKER_LINE_LAYER) {
    // SARMap.addARLinePoint(layer.name, option?.translation)
    SARMap.addARLinePoint(layer.name, option)
  }
}

/** 撤销矢量线或矢量符号线的节点的添加操作 */
export async function cancelAddARLinePoint() {
  const elementEdit = AppToolBar.getData().selectARElement
  if(elementEdit) {
    const layerName = elementEdit?.layerName
    SARMap.cancelAddARLinePoint(layerName)
  } else {
    // 获取当前图层
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    // 当前图层是线图层
    if(layer && (layer.type === ARLayerType.AR_LINE_LAYER || layer.type === ARLayerType.AR_MARKER_LINE_LAYER)) {
      SARMap.cancelAddARLinePoint(layer.name)
    }
  }
}

/** 矢量线或矢量符号线对象的添加 */
export async function addARLineElement() {
  // 获取当前图层
  const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
  if(layer && (layer.type === ARLayerType.AR_LINE_LAYER || layer.type === ARLayerType.AR_MARKER_LINE_LAYER)) {
    SARMap.addARLineElement(layer.name)
  }
}


/** 编辑 矢量符号线节点的添加 */
export async function editAddLinePoint(option?: AddOption) {
  // 获取当前图层
  // const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
  // // 当前图层是线图层
  // if(layer && (layer.type === ARLayerType.AR_LINE_LAYER || layer.type === ARLayerType.AR_MARKER_LINE_LAYER)) {
  //   SARMap.addARLinePoint(layer.name, option)
  // }
  const elementEdit = AppToolBar.getData().selectARElement
  if(elementEdit) {
    const layerName = elementEdit?.layerName
    SARMap.addARLinePoint(layerName, option)
  }
}

export async function addModel(option?: AddOption) {
  const { modelPath } = AppToolBar.getData()
  await checkARElementLayer(ARLayerType.AR_MODEL_LAYER)
  const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
  if(layer){
    SARMap.addARModel(layer.name, await FileTools.getHomeDirectory() + modelPath, option?.translation)
  }
}

export async function addSandTable(option?: AddOption) {
  const { sandTablePath } = AppToolBar.getData()
  await checkARElementLayer(ARLayerType.AR_MODEL_LAYER)
  const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
  if(layer && sandTablePath){
    await SARMap.addARSandTable(layer.name, sandTablePath, option?.translation)
  }
}

export async function addARWidget(option?: AddOption) {
  await checkARElementLayer(ARLayerType.AR_WIDGET_LAYER)
  const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
  const arPhotos = AppToolBar.getData().arPhotos
  const albumName = AppToolBar.getData().albumName
  if(arPhotos && layer) {
    SARMap.addARWidget(layer.name, ARElementType.AR_ALBUM,arPhotos,albumName, option?.translation)
  }
}

export async function addARAttriubutWidget(option?: AddOption) {
  await checkARElementLayer(ARLayerType.AR_WIDGET_LAYER)
  const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
  const arPhotos = AppToolBar.getData().arPhotos
  const albumName = AppToolBar.getData().albumName
  if(arPhotos && layer) {
    SARMap.addARAttributeWidget(layer.name, ARElementType.AR_ATTRIBUTE_ALBUM,arPhotos,albumName, option?.translation)
  }
}

export async function addARVideoAlbum(option?: AddOption) {
  await checkARElementLayer(ARLayerType.AR_WIDGET_LAYER)
  const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
  const arPhotos = AppToolBar.getData().arPhotos
  const albumName = AppToolBar.getData().albumName
  const videoType = AppToolBar.getData().videoType
  if(arPhotos && layer) {
    SARMap.addARVideoAlbum(layer.name, ARElementType.AR_VIDEO_ALBUM,arPhotos,albumName,videoType, option?.translation)
  }
}

export async function addARBrochore(option?: AddOption) {
  // const props = AppToolBar.getProps()
  await checkARElementLayer(ARLayerType.AR_WIDGET_LAYER)
  const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
  const albumName = AppToolBar.getData().albumName
  if(layer){
    // const maps = await DataHandler.getLocalData(props.currentUser.userName, 'MAP')
    // await SARMap.addARBrochoreMap(maps)
    SARMap.addARBrochore(layer.name, ARElementType.AR_BROCHOR,albumName, option?.translation)
  }
}

export async function addARSandTableAlbum(option?: AddOption) {
  const { sandTablePaths } = AppToolBar.getData()
  const albumName = AppToolBar.getData().albumName
  await checkARElementLayer(ARLayerType.AR_WIDGET_LAYER)
  const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
  if(layer && sandTablePaths){
    await SARMap.addARSandTableAlbum(layer.name, sandTablePaths, albumName,option?.translation)
  }
}

/** 柱状图的添加 */
export async function addARChart(option?: AddOption) {
  await checkARElementLayer(ARLayerType.AR_WIDGET_LAYER)
  const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
  const data = AppToolBar.getData()?.chartData
  if(data && layer) {
    if(Platform.OS === 'android'){
      SARMap.addBarChart(layer.name, data, option?.translation)
    }
  }
}

/** 饼图的添加 */
export async function addARPieChart(option?: AddOption) {
  await checkARElementLayer(ARLayerType.AR_WIDGET_LAYER)
  const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
  const data = AppToolBar.getData()?.chartData?.data
  if(data && layer) {
    if(Platform.OS === 'android'){
      SARMap.addARPieChart(layer.name, data, option?.translation)
    }
  }
}

/** 打开三维场景 */
export async function addARSceneLayer(option?: AddOption) {
  let newDatasource = false
  const props = AppToolBar.getProps()
  const mapInfo = props.arMapInfo
  console.warn("name: " + !mapInfo)
  AppToolBar.addData({
    addNewDSourceWhenCreate: false,
    addNewDsetWhenCreate: false,
  })
  if(!props.arMap.currentMap){
    await AppToolBar.getProps().createARMap()
    newDatasource = true
  } else if( !mapInfo) {
    newDatasource = true
  }

  //若已存在场景图层则先移除
  const sceneLayers = mapInfo?.layers.filter(layer => {
    return layer.type === ARLayerType.AR_SCENE_LAYER
  })
  if(sceneLayers && sceneLayers.length > 0) {
    await SARMap.removeARLayer(sceneLayers[0].name)
  }

  let datasourceName = DataHandler.getARRawDatasource()
  let datasetName = 'scene'
  const result = await DataHandler.createARElementDatasource(props.currentUser, datasourceName, datasetName, newDatasource, true, ARLayerType.AR3D_LAYER)
  if(result.success) {
    datasourceName = result.datasourceName
    datasetName = result.datasetName || ''
    if(newDatasource) {
      DataHandler.setARRawDatasource(datasourceName)
    }

    const homePath = await FileTools.getHomeDirectory()
    let path = AppToolBar.getData().sceneFilePath
    if(!path) {
      AppLog.error('未选择场景！')
      return
    }

    let addLayerName: string
    if(path.indexOf('http') === 0) {
      //double check
      const isValidUrl = CheckSpell.checkOnline3DServiceUrl(path) === ''
      if (!isValidUrl) {
        Toast.show(getLanguage().ONLINE_DATA_UNAVAILABLE)
        return
      }
      const iserverSrv = new IServerService(new FetchBlob())
      const info = await iserverSrv.getSceneInfo(path)
      if('error' in info) {
        Toast.show(getLanguage().ONLINE_DATA_UNAVAILABLE)
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
      addLayerName = await SARMap.addSceneLayerOnline(datasourceName, datasetName, serverUrl, sceneName, option?.translation, sceneOffset)
    } else {
      path = homePath + path
      const pxp = await DataLocal.getPxpContent(path)
      if(pxp === null) return
      const wsPath = homePath + AppPath.User.path + '/' + props.currentUser.userName + UserRoot.Data.ARScene.path +  '/' + pxp.Workspace.server
      addLayerName = await SARMap.addSceneLayer(datasourceName, datasetName, wsPath, option?.translation)
    }
    if(addLayerName !== ''){
      const layers = await props.getARLayers()
      const defaultLayer = layers.find(item => {
        return item.type === ARLayerType.AR_SCENE_LAYER
      })
      if(defaultLayer) {
        props.setCurrentARLayer(defaultLayer)
      }
    }
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

export async function addEffectLayer(fileName: string, path: string) {
  try {
    const homePath = await FileTools.getHomeDirectory()
    const props = AppToolBar.getProps()

    if(!props.arMap.currentMap){
      await AppToolBar.getProps().createARMap()
    }
    const layerName = fileName.substring(0, fileName.lastIndexOf('.'))

    let addLayerName
    if (Platform.OS === 'ios') {
      const targetPath = path.replace('.areffect','.mp4')
      await FileTools.copyFile(homePath+path, homePath+targetPath)
      addLayerName = await SARMap.addEffectLayer(layerName, homePath + targetPath)
    }else{
      addLayerName = await SARMap.addEffectLayer(layerName, homePath + path)
    }

    if(addLayerName !== '') {
      const layers = await props.getARLayers()
      const defaultLayer = layers.find(item => {
        return item.type === ARLayerType.EFFECT_LAYER
      })
      if(defaultLayer) {
        props.setCurrentARLayer(defaultLayer)
      }
    }
  } catch (e) {
    AppLog.error(e)
  }
}


/**
 * 根据图层类型添加不同数据源数据集
 */
async function checkARElementLayer(type: TARLayerType) {
  if(type === ARLayerType.EFFECT_LAYER
    || type === ARLayerType.AR_SCENE_LAYER
    || type === ARLayerType.AR3D_LAYER)
  {
    return
  }
  let newDatasource = AppToolBar.getData().addNewDSourceWhenCreate === true
  let newDataset = AppToolBar.getData().addNewDsetWhenCreate === true
  AppToolBar.addData({
    addNewDSourceWhenCreate: false,
    addNewDsetWhenCreate: false,
  })
  const props = AppToolBar.getProps()
  const mapInfo = props.arMapInfo
  let satisfy = false
  if(props.arMap.currentMap){
    if(mapInfo) {
      const layer = mapInfo.currentLayer
      if(!newDataset && layer && layer.type === type) {
        satisfy = true
      } else {
        newDataset = true
      }
    } else {
      newDataset = true
    }
  } else {
    await AppToolBar.getProps().createARMap()
    newDatasource = true
  }

  if(!satisfy) {
    let datasourceName = DataHandler.getARRawDatasource()
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
      // 矢量线类型的图层
      case ARLayerType.AR_LINE_LAYER:
        datasetName = 'defaultArLineLayer'
        break
      // 矢量符号线的图层
      case ARLayerType.AR_MARKER_LINE_LAYER:
        datasetName = 'defaultArMarkerLineLayer'
        break
      default:
        datasetName = 'defaultArLayer'
    }
    const result = await DataHandler.createARElementDatasource(props.currentUser, datasourceName, datasetName, newDatasource, newDataset, type)
    if(result.success) {
      datasourceName = result.datasourceName
      datasetName = result.datasetName || ''
      if(newDatasource) {
        DataHandler.setARRawDatasource(datasourceName)
      }

      let markerLineContent = AppToolBar.getData()?.markerLineContent
      if(markerLineContent && markerLineContent.indexOf('file://') === 0) {
        markerLineContent = markerLineContent.substring(7)
      } else {
        markerLineContent = ""
      }

      const layerName = await SARMap.addElementLayer(datasourceName, datasetName, type, false)
      if(type === ARLayerType.AR_MARKER_LINE_LAYER) {
        await SARMap.setLayerStyle(layerName, {markerSymbolPath: markerLineContent})
      }
      const layers = await props.getARLayers()
      const defaultLayer = layers.find(item => {
        if(item.type === type) {
          const layer = <ARElementLayer> item
          return layer.datasourceAlias === datasourceName && layer.datasetName === datasetName
        }
        return false
      })
      if(defaultLayer) {
        props.setCurrentARLayer(defaultLayer)
      }
    } else {
      AppLog.error(result.error)
    }
  }
}


export async function download3DExample() {
  _downloadExamples('workspace3d', [AR3DExample])
}

export async function downloadModelExample(data: ExampleData[]) {
  _downloadExamples('armodel', data)
}

export async function downloadEffectlExample(data: ExampleData[]) {
  _downloadExamples('areffect', data)
}

async function _downloadExamples(type: ExternalDataType, examples: ExampleData[]) {
  for(let i = 0; i < examples.length; i++) {
    const downloadKey = examples[i].userName + '_' + examples[i].downloadName
    if(AppProgress.isInProgress(downloadKey)) {
      Toast.show(getLanguage().DOWNLOADING)
      return
    }
  }

  for(let i = 0; i < examples.length; i++) {
    const downloadKey = examples[i].userName + '_' + examples[i].downloadName
    AppProgress.addProgress(downloadKey)
  }

  for(let i = 0; i < examples.length; i++) {
    await _downloadExample(type, examples[i])
  }
}

async function _downloadExample(type: ExternalDataType, exampleData: ExampleData) {
  const downloadKey = exampleData.userName + '_' + exampleData.downloadName
  const homePath = await FileTools.getHomeDirectory()
  let result: boolean
  //尝试读取以前下载的示范数据
  const items = await DataHandler.getExternalData(homePath + ConstPath.Common + exampleData.dir, [type])
  if(items.length === 0) {
    Toast.show(getLanguage().DOWNLOADING)
    result = await DataHandler.downloadExampleData(exampleData, (progress) => {
      AppProgress.updateProgress(downloadKey, progress)
    })
    if(result) {
      Toast.show(getLanguage().IMPORTING)
      const items = await DataHandler.getExternalData(homePath + ConstPath.Common + exampleData.dir, [type])
      if(items.length > 0) {
        //TODO 导入所有数据
        result = await DataHandler.importExternalData(AppUser.getCurrentUser(), items[0])
        result && AppToolBar.resetTabData()
        Toast.show(result ? getLanguage().IMPORT_SUCCESS : getLanguage().IMPORT_FAIL)
      } else {
        AppLog.error('没有数据')
      }
    } else {
      Toast.show(getLanguage(global.language).Prompt.DOWNLOAD_FAILED)
    }
  } else {
    AppProgress.updateProgress(downloadKey, 100)
    Toast.show(getLanguage().IMPORTING)
    result = await DataHandler.importExternalData(AppUser.getCurrentUser(), items[0])
    result && AppToolBar.resetTabData()
    Toast.show(result ? getLanguage().IMPORT_SUCCESS : getLanguage().IMPORT_FAIL)
  }
  AppProgress.onProgressEnd(downloadKey)
}
