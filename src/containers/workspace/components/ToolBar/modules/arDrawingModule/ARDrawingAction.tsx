/* global GLOBAL */
import React from 'react'
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
} from 'imobile_for_reactnative'
import {
  ConstToolType,
} from '../../../../../../constants'
import { Toast } from '../../../../../../utils'
import NavigationService from '../../../../../NavigationService'
import { getLanguage } from '../../../../../../language'
import { ImagePicker } from '../../../../../../components'
import ToolbarModule from '../ToolbarModule'
import Tabs from '../../../Tabs'
import DataHandler from '../../../../../tabs/Mine/DataHandler'
import ARDrawingData from './ARDrawingData'

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

function setARToolbar(type: string, data: {[name: string]: any}) {
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

function addAtCurrent() {
  // let { path } = ToolbarModule.getData()
  // SARImage.addAtCurrentPosition(path)
  // ToolbarModule.getParams().setToolbarVisible(true, 'SM_ARIMAGEMODULE')
}

function addAtPoint() {
  // let { path } = ToolbarModule.getData()
  // SARImage.setTapAction('ADD')
  // SARImage.setImagePath(path)
  // SARImage.setPlaneVisible(true)
  // SARImage.setOnAddListener(() => {
  //   ToolbarModule.getParams().setToolbarVisible(true, 'SM_ARIMAGEMODULE')
  // })
  // ToolbarModule.getParams().setToolbarVisible(
  //   true,
  //   'SM_ARIMAGEMODULE_addAtPlane',
  // )
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
  NavigationService.navigate('InputPage', {
    type: 'http',
    headerTitle: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_WEBVIEW,
    cb: async (value: string) => {
      if (value !== '') {
        setARToolbar(ConstToolType.SM_AR_DRAWING_WEB, { arContent: value })
        NavigationService.goBack('InputPage', null)
      }
    },
  })
}

async function arText() {
  NavigationService.navigate('InputPage', {
    headerTitle: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAVE_TEXT,
    type: 'name',
    cb: async (value: string) => {
      if (value !== '') {
        setARToolbar(ConstToolType.SM_AR_DRAWING_TEXT, { arContent: value })
        NavigationService.goBack('InputPage')
      }
    },
  })
}

async function ar3D(path: string) {
  setARToolbar(ConstToolType.SM_AR_DRAWING_SCENE, { arScenePath: path })
}

/** 打开三维场景 */
export async function addARScene() {
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

    let datasourceName = DataHandler.getARRawDatasource()
    let datasetName = 'scene'
    const result = await DataHandler.createARElementDatasource(_params.user.currentUser, datasourceName, datasetName, newDatasource, true, ARLayerType.AR3D_LAYER)
    if(result.success) {
      datasourceName = result.datasourceName
      datasetName = result.datasetName
      if(newDatasource) {
        DataHandler.setARRawDatasource(datasourceName)
      }

      const homePath = await FileTools.getHomeDirectory()
      let path = _data.arScenePath
      if(!path) {
        Toast.show(getLanguage(GLOBAL.language).Prompt.NO_SCENE_SELECTED)
        return
      }
      path = homePath + path
      // 得到的是工作空间所在目录 需要去找到sxwu文件路径
      try {
        const list = await FileTools.getPathListByFilter(path,{ extension:'sxwu', type: 'file'})
        if(list.length == 0) return
        await SARMap.addSceneLayer(datasourceName, datasetName, homePath + list[0].path)
        if(result){
          await _params.getARLayers()
        }
      } catch(e){
        console.warn(e)
      } finally {
        // AppToolBar.show('ARMAP', 'AR_MAP_SELECT_ADD')
      }
    }
  } catch (error) {
    Toast.show(error)
  }
}

async function arModel(path: string) {
  setARToolbar(ConstToolType.SM_AR_DRAWING_MODAL, { arModelPath: path })
}

/** 添加模型 */
export async function addARModel() {
  try {
    const _params: any = ToolbarModule.getParams()
    const _data: any = ToolbarModule.getData()
    await checkARLayer(ARLayerType.AR_MODEL_LAYER)
    const layer = _params.arlayer.currentLayer
    if(layer){
      SARMap.addARModel(layer.name, await FileTools.getHomeDirectory() + _data.arModelPath, 0)
    }
  } catch (error) {
    Toast.show(error)
  }
}

async function addMedia(type: TARElementType) {
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
      SARMap.addARMedia(layer.name, type, content)
    }
  } catch (error) {
    Toast.show(error)
  }
}

async function addText() {
  try {
    await checkARLayer(ARLayerType.AR_TEXT_LAYER)
    const _params: any = ToolbarModule.getParams()
    const _data: any = ToolbarModule.getData()
    let content = _data.arContent
    const layer = _params.arlayer.currentLayer
    if(content && layer && layer.type === ARLayerType.AR_TEXT_LAYER) {
      SARMap.addARText(layer.name, content)
    }
  } catch (error) {
    Toast.show(error)
  }
}

async function addAREffect(fileName: string, filePath: string) {
  try {
    const homePath = await FileTools.getHomeDirectory()
    const _params: any = ToolbarModule.getParams()
    const _data: any = ToolbarModule.getData()
    const mapName = _params.armap.currentMap?.mapName

    if(!mapName){
      await _params.createARMap()
    }
    const layerName = fileName.substring(0, fileName.lastIndexOf('.'))
    const addLayerName = await SARMap.addEffectLayer(layerName, homePath + filePath)
    if(addLayerName !== '') {
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
  const newDataset = _data.addNewDsetWhenCreate === true
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
    }
  } else {
    await _params.createARMap()
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
        _params.setCurrentARLayer(defaultLayer)
      }
    } else {
      Toast.show(result.error)
    }
  }
}

async function toolbarBack() {
  SARMap.setAction(ARAction.SELECT)
  SARMap.clearSelection()
  SARMap.cancel()
  const _params: any = ToolbarModule.getParams()
  const _data = await ARDrawingData.getData(ConstToolType.SM_AR_DRAWING, _params)
  _params.setToolbarVisible(true, ConstToolType.SM_AR_DRAWING, {
    isFullScreen: false,
    buttons: _data.buttons,
    customView: () => {
      return (
        <Tabs
          data={_data.data}
          device={_params.device}
        />
      )
    },
  })
  ToolbarModule.addData({selectARElement: null})
}

async function tableAction(type: string, params: { key: any; layerName: any; action: (arg0: any) => void }) {
  let result = false
  const _params: any = ToolbarModule.getParams()
  switch (type) {
    case ConstToolType.SM_AR_DRAWING_STYLE_BORDER_COLOR:
      result = await SARMap.setLayerBorderColor(_params.arlayer.currentLayer.name, params.key)
      break
  }
  if (!result && params.action) {
    params.action(params)
  }
}

function menu(type: string, selectKey: string, params = {}) {
  const _params: any = ToolbarModule.getParams()

  let showMenu = false

  if (GLOBAL.ToolBar) {
    if (GLOBAL.ToolBar.state.showMenuDialog) {
      showMenu = false
    } else {
      showMenu = true
    }
    GLOBAL.ToolBar.setState({
      isFullScreen: showMenu,
      showMenuDialog: showMenu,
      selectKey: selectKey,
      selectName: selectKey,
    })
  }
}

function showMenuBox(type: string, selectKey: string, params: any) {
  switch(type) {
    case ConstToolType.SM_AR_DRAWING_STYLE_ROTATION:
    case ConstToolType.SM_AR_DRAWING_STYLE_POSITION:
    case ConstToolType.SM_AR_DRAWING_VISIBLE_DISTANCE:
    case ConstToolType.SM_AR_DRAWING_STYLE_SCALE:
    case ConstToolType.SM_AR_DRAWING_STYLE_BORDER_COLOR:
    case ConstToolType.SM_AR_DRAWING_STYLE_BORDER_WIDTH:
    case ConstToolType.SM_AR_DRAWING_STYLE_TRANSFROM:
      if (!GLOBAL.ToolBar.state.showMenuDialog) {
        params.showBox && params.showBox()
      } else {
        params.setData && params.setData({
          showMenuDialog: false,
          isFullScreen: false,
        })
        params.showBox && params.showBox()
      }
      break
  }
}

function commit() {
  SARMap.setAction(ARAction.NULL)
  SARMap.clearSelection()
  SARMap.submit()
  return false
}


export default {
  toolbarBack,
  tableAction,
  menu,
  showMenuBox,
  commit,

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
}
