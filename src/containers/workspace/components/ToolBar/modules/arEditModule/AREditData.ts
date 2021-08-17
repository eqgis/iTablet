import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { scaleSize, Toast } from '../../../../../../utils'
import { color } from '../../../../../../styles'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import ToolbarModule from '../ToolbarModule'
import ToolbarBtnType from '../../ToolbarBtnType'
import { ARElementType, SARMap, ARAction, ARLayerType } from 'imobile_for_reactnative'
import AREditAction from './AREditAction'
import { DATA_ITEM, IARTransform } from '../types'

interface SectionItemData {
  key: string,
  image: any,
  // selectedImage: any,
  title: string,
  action: (data: any) => void,
}

interface SectionData {
  title: string,
  containerType?: string,
  data: SectionItemData[]
}

async function getData(type: string, params: {[name: string]: any}) {
  ToolbarModule.setParams(params)
  let data: SectionData[] | SectionData | SectionItemData[] | string[] = []
  let buttons: any[]
  if (type === ConstToolType.SM_AR_EDIT) {
    buttons = [ToolbarBtnType.CANCEL]
  } else {
    buttons = [ToolbarBtnType.TOOLBAR_BACK, ToolbarBtnType.TOOLBAR_COMMIT]
  }
  // let customView: (() => React.ReactElement) | undefined = undefined
  switch (type) {
    // case ConstToolType.SM_AR_EDIT:
    case ConstToolType.SM_AR_EDIT_SCALE:
    case ConstToolType.SM_AR_EDIT_ROTATION:
    case ConstToolType.SM_AR_EDIT_POSITION: {
      const _data = await getStyleData(type)
      if (_data) {
        data = _data.data
        buttons = _data.buttons
      }
      break
    }
    case ConstToolType.SM_AR_EDIT_ANIMATION_TYPE:
    case ConstToolType.SM_AR_EDIT_ANIMATION_TRANSLATION:
    case ConstToolType.SM_AR_EDIT_ANIMATION_ROTATION:
    case ConstToolType.SM_AR_EDIT_ANIMATION_ROTATION_AXIS:
    case ConstToolType.SM_AR_EDIT_ANIMATION: {
      const _data = await getAnimationData(type)
      if (_data) {
        data = _data.data
        buttons = _data.buttons
      }
      break
    }
    case ConstToolType.SM_AR_EDIT_LAYER_VISIBLE_BOUNDS:
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
  }
  return { data, buttons }
}

/**
 * 显示滑动条组件
 * @param type
 * @param language
 * @param params Toolbar setVisible中的params
 */
async function showSlideToolbar(type: string, language: string, params: any) {
  GLOBAL.toolBox &&
  GLOBAL.toolBox.setVisible(true, type, {
    containerType: ToolbarType.slider,
    isFullScreen: false,
    showMenuDialog: false,
    ...params,
  })
}

const ARStyleItems = (language: string) => {
  const items = [
    {
      key: getLanguage(language).ARMap.SCALE,
      action: () => {
        SARMap.setAction(ARAction.SCALE)
        showSlideToolbar(ConstToolType.SM_AR_EDIT_SCALE, language, {
          selectName: getLanguage(language).ARMap.SCALE,
          selectKey: getLanguage(language).ARMap.SCALE,
          // isTouchProgress: true,
        })
      },
      selectKey: getLanguage(language).ARMap.SCALE,
    },
    {
      key: getLanguage(language).ARMap.POSITION,
      action: () => {
        SARMap.setAction(ARAction.MOVE)
        showSlideToolbar(ConstToolType.SM_AR_EDIT_POSITION, language, {
          selectName: getLanguage(language).ARMap.POSITION,
          selectKey: getLanguage(language).ARMap.POSITION,
          // isTouchProgress: true,
        })
      },
      selectKey: getLanguage(language).ARMap.POSITION,
    },
    {
      key: getLanguage(language).ARMap.ROTATION,
      action: () => {
        SARMap.setAction(ARAction.ROTATE)
        showSlideToolbar(ConstToolType.SM_AR_EDIT_ROTATION, language, {
          selectName: getLanguage(language).ARMap.ROTATION,
          selectKey: getLanguage(language).ARMap.ROTATION,
          // isTouchProgress: true,
        })
      },
      selectKey: getLanguage(language).ARMap.ROTATION,
    },
  ]
  const _data: any = ToolbarModule.getData()
  // 只有模型才能用动画
  if (typeof _data?.selectARElement !== 'string' && _data?.selectARElement?.type === ARElementType.AR_MODEL) {
    items.push({
      key: getLanguage(language).ARMap.ANIMATION,
      action: () => AREditAction.showAnimationAction(ConstToolType.SM_AR_EDIT_ANIMATION),
      selectKey: getLanguage(language).ARMap.ANIMATION,
    })
  }
  return items
}

function getMenuData() {
  const _params: any = ToolbarModule.getParams()
  const _data: any = ToolbarModule.getData()

  let data: { key: string; action: () => void; selectKey: string }[] = []

  if (_data.selectARElement && typeof _data.selectARElement !== 'string') {
    switch (_data.selectARElement.type) {
      case ARElementType.AR_IMAGE:
      case ARElementType.AR_VIDEO:
      case ARElementType.AR_WEBVIEW:
      case ARElementType.AR_TEXT:
      case ARElementType.AR_MODEL:
        data = ARStyleItems(_params.language)
        break
    }
  } else {
    if (
      _params.arlayer.currentLayer.type === ARLayerType.AR_SCENE_LAYER ||
      _params.arlayer.currentLayer.type === ARLayerType.AR3D_LAYER
    ) {
      data = ARStyleItems(_params.language)
    }
  }
  return data
}

async function getStyleData(type: string) {
  const _data: any = ToolbarModule.getData()
  const _params: any = ToolbarModule.getParams()
  const element = _data.selectARElement
  const currentLayer = _params.arlayer.currentLayer

  if(!element && currentLayer?.type !== ARLayerType.AR_SCENE_LAYER && currentLayer?.type !== ARLayerType.AR3D_LAYER)  {
    Toast.show(getLanguage(_params.language).Prompt.UNSELECTED_OBJECT)
    return
  }
  const layerName = element?.layerName || currentLayer?.name
  const id = element?.id || 0

  const range = {
    scale: [0 , 200],
    position: [-20, 20],
    rotation: [-180, 180],
  }

  let transformData: IARTransform = {
    layerName: layerName,
    id: id,
    type: 'position',
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    scale: 100,
  }
  if (
    _data?.transformData &&
    _data?.transformData.layerName === layerName &&
    _data?.transformData.id === id
  ) {
    Object.assign(transformData, _data.transformData)
  }
  let buttons
  if (type === ConstToolType.SM_AR_EDIT) {
    buttons = [
      ToolbarBtnType.CANCEL,
      ToolbarBtnType.MENU,
      ToolbarBtnType.TOOLBAR_COMMIT,
    ]
  } else {
    buttons = [
      ToolbarBtnType.TOOLBAR_BACK,
      ToolbarBtnType.MENU,
      ToolbarBtnType.MENU_FLEX,
      ToolbarBtnType.TOOLBAR_COMMIT,
    ]
  }

  let data: any[] = []
  const allData: {
    title: string,
    data: typeof data,
  }[] = []
  switch(type) {
    case ConstToolType.SM_AR_EDIT_ROTATION:
      data = [
        {
          key: 'x',
          leftText: 'x',
          onMove: (loc: number) => {
            transformData = {
              ...transformData,
              rotationX: loc,
              type: 'rotation',
            }
            SARMap.setARElementTransform(transformData)
            ToolbarModule.addData({transformData})
          },
          // defaultValue: defaultValue.rotation[0],
          defaultValue: transformData.rotationX,
          range: range.rotation,
          unit: '°',
        },
        {
          key: 'y',
          leftText: 'y',
          onMove: (loc: number) => {
            transformData = {
              ...transformData,
              rotationY: loc,
              type: 'rotation',
            }
            SARMap.setARElementTransform(transformData)
            ToolbarModule.addData({transformData})
          },
          // defaultValue: defaultValue.rotation[0],
          defaultValue: transformData.rotationY,
          range: range.rotation,
          unit: '°',
        },
        {
          key: 'z',
          leftText: 'z',
          onMove: (loc: number) => {
            transformData = {
              ...transformData,
              rotationZ: loc,
              type: 'rotation',
            }
            SARMap.setARElementTransform(transformData)
            ToolbarModule.addData({transformData})
          },
          // defaultValue: defaultValue.rotation[0],
          defaultValue: transformData.rotationZ,
          range: range.rotation,
          unit: '°',
        },
      ]
      allData.push({
        title: getLanguage(_params.language).ARMap.ROTATION,
        data: data,
      })
      break
    case ConstToolType.SM_AR_EDIT_POSITION:
      data = [
        {
          key: 'left-right',
          leftText:  getLanguage(GLOBAL.language).ARMap.LEFT,
          rightText:  getLanguage(GLOBAL.language).ARMap.RIGHT,
          onMove: (loc: number) => {
            loc = loc / 25
            transformData = {
              ...transformData,
              positionX: loc,
              type: 'position',
            }
            SARMap.setARElementTransform(transformData)
            ToolbarModule.addData({transformData})
          },
          // defaultValue: defaultValue.position[0],
          defaultValue: transformData.positionX * 25,
          range: range.position,
        },
        {
          key: 'down-up',
          leftText:  getLanguage(GLOBAL.language).ARMap.DOWN,
          rightText:  getLanguage(GLOBAL.language).ARMap.UP,
          onMove: (loc: number) => {
            loc = loc / 25
            transformData = {
              ...transformData,
              positionY: loc,
              type: 'position',
            }
            SARMap.setARElementTransform(transformData)
            ToolbarModule.addData({transformData})
          },
          // defaultValue: defaultValue.position[0],
          defaultValue: transformData.positionY * 25,
          range: range.position,
        },
        {
          key: 'back-front',
          leftText:  getLanguage(GLOBAL.language).ARMap.BACK,
          rightText:  getLanguage(GLOBAL.language).ARMap.FRONT,
          onMove: (loc: number) => {
            loc = loc / 25
            transformData = {
              ...transformData,
              positionZ: loc,
              type: 'position',
            }
            SARMap.setARElementTransform(transformData)
            ToolbarModule.addData({transformData})
          },
          // defaultValue: defaultValue.position[0],
          defaultValue: transformData.positionZ * 25,
          range: range.position,
        },
      ]
      allData.push({
        title: getLanguage(_params.language).ARMap.POSITION,
        data: data,
      })
      break
    // case ConstToolType.SM_AR_VISIBLE_DISTANCE:
    //   data = []
    //   break
    case ConstToolType.SM_AR_EDIT_SCALE: {
      let _defaultValue = transformData.scale === 100 ? transformData.scale : ((transformData.scale + 1) * 100)
      data = [{
        key: 'scale',
        leftImage: getThemeAssets().ar.armap.ar_scale,
        unit: '%',
        onMove: (loc: number) => {
          const ratio = loc / 100 - 1
          transformData = {
            ...transformData,
            scale: ratio,
            type: 'scale',
          }
          SARMap.setARElementTransform(transformData)
          ToolbarModule.addData({transformData})
        },
        // defaultValue: defaultValue.scale[0],
        defaultValue: Math.ceil(_defaultValue),
        range: range.scale,
      }]
      allData.push({
        title: getLanguage(_params.language).ARMap.SCALE,
        data: data,
      })
      break
    }
  }
  return {
    buttons,
    data: allData,
  }
}

/**
 * 获取AR动画编辑数据
 * @param type
 * @returns
 */
async function getAnimationData(type: string) {
  const _data: any = ToolbarModule.getData()
  const _params: any = ToolbarModule.getParams()
  const element = _data.selectARElement
  const currentLayer = _params.arlayer.currentLayer

  if(!element && currentLayer?.type !== ARLayerType.AR_SCENE_LAYER && currentLayer?.type !== ARLayerType.AR3D_LAYER)  {
    Toast.show(getLanguage(_params.language).Prompt.UNSELECTED_OBJECT)
    return
  }
  // const layerName = element?.layerName || currentLayer?.name
  // const id = element?.id || 0

  const buttons = [
    ToolbarBtnType.TOOLBAR_BACK,
    ToolbarBtnType.MENU,
    ToolbarBtnType.MENU_FLEX,
    ToolbarBtnType.TOOLBAR_COMMIT,
  ]
  let data: any[] = []
  const allData: {
    title: string,
    type?: string,
    data: typeof data,
  }[] = []
  switch(type) {
    /** 一级 动画 */
    case ConstToolType.SM_AR_EDIT_ANIMATION: {
      data = [
        {
          key: 'add',
          image: getThemeAssets().functionBar.icon_tool_add,
          title: getLanguage(GLOBAL.language).Common.ADD,
          action: () => AREditAction.showAnimationAction(ConstToolType.SM_AR_EDIT_ANIMATION_TYPE),
        },
        {
          key: 'none',
          image: getThemeAssets().ar.armap.ar_animation_none,
          title: getLanguage(GLOBAL.language).Common.NONE,
          action: () => {
            if(element && typeof element !== 'string') {
              SARMap.clearAnimation(element.layerName, element.id)
            }
          },
        },
      ]
      const animation = await SARMap.getAnimationList()
      const animationData: DATA_ITEM[] = []
      for (let i = animation.length - 1; i >= 0; i--) {
        const item = animation[i]
        animationData.push({
          key: 'none',
          image: item.type === 'rotation'
            ? getThemeAssets().ar.armap.ar_rotate
            : getThemeAssets().ar.armap.ar_translation,
          title: item.name,
          action: async () => {
            if(element && typeof element !== 'string') {
              await SARMap.clearAnimation(element.layerName, element.id)
              SARMap.setAnimation(element.layerName, element.id, item.id)
            }
          },
        })
      }

      allData.push({
        title: getLanguage(_params.language).ARMap.ANIMATION,
        data: data.concat(animationData),
      })
      break
    }
    /** 二级 动画类型 */
    case ConstToolType.SM_AR_EDIT_ANIMATION_TYPE:
      data = [
        {
          key: ConstToolType.SM_AR_EDIT_ANIMATION_TRANSLATION,
          image: getThemeAssets().ar.armap.ar_translation,
          title: getLanguage(GLOBAL.language).ARMap.POSITION,
          action: () => AREditAction.showAnimationAction(ConstToolType.SM_AR_EDIT_ANIMATION_TRANSLATION),
        },
        {
          key: ConstToolType.SM_AR_EDIT_ANIMATION_ROTATION,
          image: getThemeAssets().ar.armap.ar_rotate,
          title: getLanguage(GLOBAL.language).ARMap.ROTATION,
          action: () => AREditAction.showAnimationAction(ConstToolType.SM_AR_EDIT_ANIMATION_ROTATION),
        },
      ]
      allData.push({
        title: getLanguage(_params.language).ARMap.ANIMATION_TYPE,
        data: data,
      })
      break
    /** 三级 位移 */
    case ConstToolType.SM_AR_EDIT_ANIMATION_TRANSLATION:
      allData.push({
        title: getLanguage(_params.language).ARMap.DIRECTION,
        data: [{
          key: 'x',
          image: getThemeAssets().ar.armap.ar_translation,
          title: 'x',
          action: () => AREditAction.createAnimation({ direction: 'x' }),
        }, {
          key: 'y',
          image: getThemeAssets().ar.armap.ar_translation,
          title: 'y',
          action: () => AREditAction.createAnimation({ direction: 'y' }),
        }, {
          key: 'z',
          image: getThemeAssets().ar.armap.ar_translation,
          title: 'z',
          action: () => AREditAction.createAnimation({ direction: 'z' }),
        }],
      })
      allData.push({
        title: getLanguage(_params.language).ARMap.DISTANCE,
        type: ToolbarType.slider,
        data: [{
          // title: getLanguage(GLOBAL.language).ARMap.DISTANCE,
          type: ToolbarType.slider,
          data: [{
            onMove: (loc: number) => {
              if (_data.animationParam) {
                _data.animationParam.distance = loc
              }
              // AREditAction.createAnimation({ distance: loc })
            },
            defaultValue: 1,
            range: [-5, 5],
            unit: getLanguage(GLOBAL.language).Map_Main_Menu.METERS,
          }],
        }],
      })
      break
    /** 三级 旋转 */
    case ConstToolType.SM_AR_EDIT_ANIMATION_ROTATION:
      allData.push({
        title: getLanguage(_params.language).ARMap.DIRECTION,
        data: [{
          key: 'x',
          image: getThemeAssets().ar.armap.ar_rotate,
          title: 'x',
          action: () => AREditAction.createAnimation({ rotationAxis:  {x: 1, y: 0, z: 0} }),
        }, {
          key: 'y',
          image: getThemeAssets().ar.armap.ar_rotate,
          title: 'y',
          action: () => AREditAction.createAnimation({ rotationAxis:  {x: 0, y: 1, z: 0} }),
        }, {
          key: 'z',
          image: getThemeAssets().ar.armap.ar_rotate,
          title: 'z',
          action: () => AREditAction.createAnimation({ rotationAxis:  {x: 0, y: 0, z: 1} }),
        }],
      })
      allData.push({
        title: getLanguage(_params.language).ARMap.DISTANCE,
        data: [{
          key: 'axis_x',
          image: getThemeAssets().ar.armap.ar_rotate,
          title: getLanguage(_params.language).ARMap.CLOCKWISE,
          action: () => {
            _data.animationParam.clockwise = true
            // AREditAction.createAnimation({ clockwise: true })
          },
        }, {
          key: 'axis_y',
          image: getThemeAssets().ar.armap.ar_rotate,
          title: getLanguage(_params.language).ARMap.COUNTER_CLOCKWISE,
          action: () => {
            _data.animationParam.clockwise = false
            // AREditAction.createAnimation({ clockwise: false })
          },
        }],
      })
      break
  }
  return { buttons, data: allData }
}

function getHeaderData(type: string) {
  let headerData: any
  const _params: any = ToolbarModule.getParams()
  if (
    _params.arlayer.currentLayer?.type === ARLayerType.AR_SCENE_LAYER ||
    _params.arlayer.currentLayer?.type === ARLayerType.AR3D_LAYER
  ) {
    return headerData
  }
  if (
    // type === ConstToolType.SM_AR_EDIT ||
    type === ConstToolType.SM_AR_EDIT_SCALE ||
    type === ConstToolType.SM_AR_EDIT_ROTATION ||
    type === ConstToolType.SM_AR_EDIT_POSITION
  ) {
    headerData = {
      withoutBack: true,
      type: 'floatNoTitle',
      headerRight: [{
        key: 'delete',
        // title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_CLEAR,
        action: AREditAction.deleteARElement,
        size: 'large',
        image: getThemeAssets().ar.toolbar.icon_delete,
        style: {
          width: scaleSize(60),
          height: scaleSize(60),
          borderRadius: scaleSize(8),
          backgroundColor: color.white,
        },
      }],
    }
  }
  return headerData
}

export default {
  getData,
  getMenuData,
  getHeaderData,
}
