/* global GLOBAL */
import {
  SARMap,
  ARAction,
  ARLayerType,
} from 'imobile_for_reactnative'
import { IAnimationParam, ARElementLayer, AREffectLayer } from "imobile_for_reactnative/types/interface/ar"
import { IVector3 } from "imobile_for_reactnative/types/data"
import {
  ConstToolType,
  ToolbarType,
} from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { DialogUtils, Toast } from '../../../../../../utils'
import ToolbarModule from '../ToolbarModule'
import { IARTransform } from '../types'
import AREditData from './AREditData'
import { Platform } from 'react-native'

async function toolbarBack() {
  const _params: any = ToolbarModule.getParams()
  let prevType
  switch(_params.type) {
    case ConstToolType.SM_AR_EDIT_ANIMATION_TYPE:
      prevType = ConstToolType.SM_AR_EDIT_ANIMATION
      break
    case ConstToolType.SM_AR_EDIT_ANIMATION_TRANSLATION:
    case ConstToolType.SM_AR_EDIT_ANIMATION_ROTATION:
      prevType = ConstToolType.SM_AR_EDIT_ANIMATION_TYPE
      break
    case ConstToolType.SM_AR_EDIT_ROTATION:
    case ConstToolType.SM_AR_EDIT_POSITION:
    case ConstToolType.SM_AR_EDIT_SCALE:
      prevType = ConstToolType.SM_AR_EDIT
      break
    default:
      // const _data = await AREditData.getData(prevType, _params)
  }
  if (
    prevType === ConstToolType.SM_AR_EDIT_ANIMATION ||
    prevType === ConstToolType.SM_AR_EDIT_ANIMATION_TYPE
  ) {
    showAnimationAction(prevType)
  } else {
    if (prevType === undefined) {
      _params.setToolbarVisible(false)
    } else {
      _params.setToolbarVisible(true, ConstToolType.SM_AR_EDIT, {
        isFullScreen: false,
      })
    }
    SARMap.clearSelection()
    SARMap.cancel()
    SARMap.setAction(ARAction.SELECT)
    ToolbarModule.addData({selectARElement: null})
  }
}

function menu(type: string, selectKey: string, params: any) {
  let showMenu = false

  if (global.ToolBar) {
    if (global.ToolBar.state.showMenuDialog) {
      showMenu = false
    } else {
      showMenu = true
    }
    params.showBox && params.showBox()
    global.ToolBar.setState({
      isFullScreen: showMenu,
      showMenuDialog: showMenu,
      selectKey: selectKey,
      selectName: selectKey,
    })
  }
}

function showMenuBox(type: string, selectKey: string, params: any) {
  switch(type) {
    case ConstToolType.SM_AR_EDIT_ROTATION:
    case ConstToolType.SM_AR_EDIT_POSITION:
    case ConstToolType.SM_AR_EDIT_SCALE:
    case ConstToolType.SM_AR_EDIT_ANIMATION:
    case ConstToolType.SM_AR_EDIT_ANIMATION_TYPE:
    case ConstToolType.SM_AR_EDIT_ANIMATION_TRANSLATION:
    case ConstToolType.SM_AR_EDIT_ANIMATION_ROTATION:
    case ConstToolType.SM_AR_EDIT_ANIMATION_ROTATION_AXIS:
      if (!global.ToolBar.state.showMenuDialog) {
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
  const _params: any = ToolbarModule.getParams()
  if(_params.type === ConstToolType.SM_AR_EDIT_LAYER_VISIBLE_BOUNDS) {
    const data: any  = ToolbarModule.getData()
    const _params: any = ToolbarModule.getParams()
    const layer: ARElementLayer = data.selectARElementLayer
    const ARElementLayerVisibleBounds: number = data.ARElementLayerVisibleBounds
    SARMap.setLayerMaxVisibleBounds(layer.name, ARElementLayerVisibleBounds)
    _params.setToolbarVisible(false)

  } else if(_params.type === ConstToolType.SM_AR_EDIT_EFFECT_LAYER_VISIBLE_BOUNDS){
    // 特效图层设置可见距离的方法
    const data: any  = ToolbarModule.getData()
    const _params: any = ToolbarModule.getParams()
    const layer: AREffectLayer = data.selectAREffectLayer
    const AREffectLayerVisibleBounds: number = data.AREffectLayerVisibleBounds

     // 设置最大可见距离的方法
    if(Platform.OS === 'android') {
      SARMap.setEffectLayerMaxVisibleBounds(layer.name, AREffectLayerVisibleBounds)
    } else {
      // IOS TODO
    }
    _params.setToolbarVisible(false)
    // 特效图层点击确认后将禁用dialog框给取消
    GLOBAL.isEffectProgress = false

  } else if(_params.type === ConstToolType.SM_AR_EDIT_EFFECT_LAYER_SECONDS_TO_PLAY) {
    // 特效图层设置持续时间
    const data: any  = ToolbarModule.getData()
    const _params: any = ToolbarModule.getParams()
    const layer: AREffectLayer = data.selectAREffectLayer
    const AREffectLayerSecondsToPlay: number = data.AREffectLayerSecondsToPlay

    // 设置持续时间的方法
    if(Platform.OS === 'android') {
      SARMap.setEffectLayerSecondsToPlay(layer.name, AREffectLayerSecondsToPlay)
    } else {
      // IOS TODO
    }

    _params.setToolbarVisible(false)
    // 特效图层点击确认后将禁用dialog框给取消
    GLOBAL.isEffectProgress = false

  } else{
    SARMap.submit().then(async () => {
      const _data: any = ToolbarModule.getData()
      const _params: any = ToolbarModule.getParams()
      let id = 0
      if (
        _params.arlayer.currentLayer?.type === ARLayerType.AR_SCENE_LAYER ||
        _params.arlayer.currentLayer?.type === ARLayerType.AR3D_LAYER
      ) {
        SARMap.appointEditAR3DLayer(_params.arlayer.currentLayer.name)
      } else if (_data.selectARElement) {
        id = _data.selectARElement.id
        SARMap.appointEditElement(_data.selectARElement.id, _data.selectARElement.layerName)
      }
      let transformData: IARTransform = {
        layerName: _params.arlayer.currentLayer.name,
        id,
        type: 'position',
        positionX: 0,
        positionY: 0,
        positionZ: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        scale: 0,
      }
      ToolbarModule.addData({transformData})
      const data = await AREditData.getData(_params.type, _params)
      // global.ToolBar.setState({
      //   data: data.data,
      //   // isFullScreen: false,
      //   // showMenuDialog: false,
      //   // selectName: global.ToolBar.state.selectName,
      //   // selectKey: global.ToolBar.state.selectKey,
      // })
      global.ToolBar.resetContentView()
    })
  }
  return true
}

function close() {
  const _params: any = ToolbarModule.getParams()
  // const _data: any = ToolbarModule.getData()
  // if (_params.type === ConstToolType.SM_AR_EDIT && _data.selectARElement) {
  if (_params.type === ConstToolType.SM_AR_EDIT) {
    SARMap.clearSelection()
    SARMap.setAction(ARAction.NULL)
    // SARMap.setAction(ARAction.SELECT)
    ToolbarModule.addData({selectARElement: null})
    // _params.setToolbarVisible(true, _params.type, {
    //   isFullScreen: false,
    // })
    // return true
  }
  // 将禁用dialog框设置为不禁用
  GLOBAL.isEffectProgress = false
  return false
}

/** 动画 */
function showAnimationAction(type: string) {
  const _params: any = ToolbarModule.getParams()
  _params.showFullMap && _params.showFullMap(true)
  _params.setToolbarVisible(true, type, {
    containerType: ToolbarType.tableTabs,
    isFullScreen: false,
  })
  if (type === ConstToolType.SM_AR_EDIT_ANIMATION_TRANSLATION) {
    const animationParam: IAnimationParam = {
      name: '',
      type: 'translation',
      startPosition: {x: 0, y: 0, z:0},
      direction: 'x',
      distance: 1,
    }
    ToolbarModule.addData({animationParam})
  } else if (type === ConstToolType.SM_AR_EDIT_ANIMATION_ROTATION) {
    const animationParam: IAnimationParam = {
      name: '',
      type: 'rotation',
      rotationAxis: {x: 1, y: 0, z:0},
      clockwise: true,
    }
    ToolbarModule.addData({animationParam})
  }
}

interface IAnimation {
  name?: string,
  type?: 'rotation',
  duration?: number,
  delay?: number,
  repeatCount?: number,
  repeatMode?: 1 | 2,

  rotationAxis?: IVector3,
  clockwise?: boolean,

  startPosition?: IVector3,
  direction?: 'x' | 'y' | 'z',
  distance?: number,
}

/** 创建动画 */
function createAnimation(params?: IAnimation) {
  const _data: any = ToolbarModule.getData()
  DialogUtils.getInputDialog()?.setDialogVisible(true, {
    confirmAction: async (name: string) => {
      if (name !== '' && _data.animationParam) {
        params && Object.assign(_data.animationParam, params)
        _data.animationParam.name = name
        // NavigationService.goBack('InputPage')
        await SARMap.addNodeAnimation(_data.animationParam)
        ToolbarModule.addData({animationParam: null})
        DialogUtils.getInputDialog()?.setDialogVisible(false)
        showAnimationAction(ConstToolType.SM_AR_EDIT_ANIMATION)
      }
    },
  })
}

function deleteARElement() {
  const _params: any = ToolbarModule.getParams()
  const _data: any = ToolbarModule.getData()

  const element = _data.selectARElement
  if(element) {
    global.SimpleDialog.set({
      text: getLanguage(global.language).Common.DELETE_CURRENT_OBJ_CONFIRM,
      confirmAction: () => {
        SARMap.clearSelection()
        SARMap.removeEditElement()
        SARMap.setAction(ARAction.SELECT)

        // _params.setToolbarVisible(false)
        _params.setToolbarVisible(true, ConstToolType.SM_AR_EDIT, {
          isFullScreen: false,
        })
      },
    })
    global.SimpleDialog.setVisible(true)
  } else {
    Toast.show(getLanguage(global.language).Common.NO_SELECTED_OBJ)
  }
}

async function getTouchProgressInfo(title: string) {
  const data: any  = ToolbarModule.getData()
  const _params: any = ToolbarModule.getParams()
  let tips = ''
  let range = [1, 100]
  let value = data.ARElementLayerVisibleBounds
  let step = 1
  let unit = getLanguage().Convert_Unit.METER
  let _title = getLanguage().Map_Layer.LAYERS_VISIBLE_DISTANCE

  if(_params.type === ConstToolType.SM_AR_EDIT_LAYER_VISIBLE_BOUNDS) {
    range = [1, 100]
    value = data.ARElementLayerVisibleBounds
    step = 1
    unit = getLanguage().Convert_Unit.METER
    _title = getLanguage().Map_Layer.LAYERS_VISIBLE_DISTANCE
  } else if(_params.type === ConstToolType.SM_AR_EDIT_EFFECT_LAYER_VISIBLE_BOUNDS){
    // 特效图层设置可见距离的方法
    range = [0, 100]
    value = data.AREffectLayerVisibleBounds
    step = 1
    unit = getLanguage().Convert_Unit.METER
    _title = getLanguage().Map_Layer.LAYERS_VISIBLE_DISTANCE
    

  } else if(_params.type === ConstToolType.SM_AR_EDIT_EFFECT_LAYER_SECONDS_TO_PLAY) {
    // 特效图层设置持续时间
    range = [0, 100]
    value = data.AREffectLayerSecondsToPlay
    step = 1
    unit = getLanguage().Convert_Unit.SECOND
    _title = getLanguage().Map_Layer.LAYERS_SECONDS_TO_PLAY

  } 

  return { title: _title, value, tips, range, step, unit }
}


function setTouchProgressInfo(title: string, value: number) {
  const _params: any = ToolbarModule.getParams()
  if(_params.type === ConstToolType.SM_AR_EDIT_LAYER_VISIBLE_BOUNDS) {
    // 非特效图层设置可见距离
    let range = [1, 100]
    if (value > range[1]) value = range[1]
    else if (value <= range[0]) value = range[0]

    ToolbarModule.addData({ARElementLayerVisibleBounds: value})

  } else if(_params.type === ConstToolType.SM_AR_EDIT_EFFECT_LAYER_VISIBLE_BOUNDS){
    // 特效图层设置可见距离
    let range = [0, 100]
    if (value > range[1]) value = range[1]
    else if (value <= range[0]) value = range[0]

    // 添加特效可见距离
    ToolbarModule.addData({AREffectLayerVisibleBounds: value})

  } else if(_params.type === ConstToolType.SM_AR_EDIT_EFFECT_LAYER_SECONDS_TO_PLAY) {
    // 特效图层设置持续时间
    let range = [0, 100]
    if (value > range[1]) value = range[1]
    else if (value <= range[0]) value = range[0]

    // 添加特效持续时间
    ToolbarModule.addData({AREffectLayerSecondsToPlay: value})
  } 


  
}

export default {
  toolbarBack,
  menu,
  showMenuBox,
  commit,
  close,
  getTouchProgressInfo,
  setTouchProgressInfo,

  showAnimationAction,
  createAnimation,
  deleteARElement,
}
