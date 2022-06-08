import React from 'react'
import { View, Dimensions } from 'react-native'
import { ConstToolType, Height, ToolbarType } from '../../../../../../constants'
import { MTBtn } from '../../../../../../components'
import { scaleSize, Toast, AppToolBar} from '../../../../../../utils'
import { color } from '../../../../../../styles'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets, getPublicAssets, getImage } from '../../../../../../assets'
import ToolbarModule from '../ToolbarModule'
import ToolbarBtnType from '../../ToolbarBtnType'
import { ARElementType, SARMap, ARAction, ARLayerType } from 'imobile_for_reactnative'
import AREditAction from './AREditAction'
import { DATA_ITEM, IARTransform } from '../types'
import NavigationService from '../../../../../../containers/NavigationService'
import ToolBarInput from 'imobile_for_reactnative/components/ToolbarKit/component/ToolBarInput'
import { dp } from 'imobile_for_reactnative/utils/size'

interface SectionItemData {
  key: string,
  image: any,
  // selectedImage: any,
  title: string,
  action: (data: any) => void,
    /** 点击切换标签事件 */
    onPress?: (index: number) => void,
}

interface SectionData {
  title: string,
  containerType?: string,
  data: SectionItemData[],
  getData?: () => Promise<SectionItemData[]>,
  /** 点击切换标签事件 */
  onPress?: (index: number) => void,
}

async function getData(type: string, params: {[name: string]: any}) {
  ToolbarModule.setParams(params)
  let data: SectionData[] | SectionData | SectionItemData[] | string[]  | any[]= []
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
    case ConstToolType.SM_AR_EDIT_VERTEX_ADD_LINE:
      buttons = [
        {
          type: 'ADD_QUIT',
          image: getThemeAssets().toolbar.icon_toolbar_quit,
          action:async () => {
            const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
            if(layer && (layer.type === ARLayerType.AR_LINE_LAYER || layer.type === ARLayerType.AR_MARKER_LINE_LAYER)) {
              SARMap.exitAddARLine(layer.name)
            }
            const _params: any = ToolbarModule.getParams()
            const _data = await getData(ConstToolType.SM_AR_EDIT, _params)
            _params.setToolbarVisible(true, ConstToolType.SM_AR_EDIT, {
              isFullScreen: false,
              buttons: _data.buttons,
            })
            SARMap.clearSelection()
            SARMap.cancel()
            SARMap.setAction(ARAction.SELECT)
            ToolbarModule.addData({selectARElement: null})
          },
        },
        {
          type: 'ADD_LOCATION',
          image: getThemeAssets().ar.armap.ar_add_location,
          action: () => {
            const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
            // 当前图层是线图层
            if (layer && (layer.type === ARLayerType.AR_LINE_LAYER || layer.type === ARLayerType.AR_MARKER_LINE_LAYER)) {
              SARMap.setAction(ARAction.VERTEX_ADD)
              SARMap.addARLinePoint(layer.name, { foucus: false, updatefoucus: false })
            }
          },
        },
        {
          type: 'ADD_POINT',
          image: getThemeAssets().ar.armap.ar_add_point,
          action: () => {
            const _params: any = ToolbarModule.getParams()
            _params.setToolbarVisible(true, ConstToolType.SM_AR_EDIT_VERTEX_ADD_LINE_ATPOINT, {
              isFullScreen: false,
            })
          },
        },
        {
          type: 'ADD_UNDO',
          image: getThemeAssets().ar.armap.undo,
          action: () => {
            // 获取当前图层
            const _params: any = ToolbarModule.getParams()
            const layer = _params.arlayer.currentLayer
            // 当前图层是线图层
            if (layer && (layer.type === ARLayerType.AR_LINE_LAYER || layer.type === ARLayerType.AR_MARKER_LINE_LAYER)) {
              SARMap.cancelAddARLinePoint(layer.name)
            }
          },
        },
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.SM_AR_EDIT_VERTEX_ADD_LINE_ATPOINT:
      buttons = [
        {
          type: 'ADD_QUIT',
          image: getThemeAssets().toolbar.icon_toolbar_quit,
          action:async () => {
            const _params: any = ToolbarModule.getParams()
            SARMap.setAction(ARAction.VERTEX_ADD)
            _params.setToolbarVisible(true, ConstToolType.SM_AR_EDIT_VERTEX_ADD_LINE, {
              isFullScreen: false,
            })
          },
        },
        {
          type: 'ADD_POINT',
          image: getThemeAssets().ar.armap.icon_add_to,
          action: async () => {
            const translation = await SARMap.getCurrentCenterHitPoint()
            if(translation) {
              // 获取当前图层
              const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
              // 当前图层是线图层
              if (layer && (layer.type === ARLayerType.AR_LINE_LAYER || layer.type === ARLayerType.AR_MARKER_LINE_LAYER)) {
                SARMap.setAction(ARAction.VERTEX_ADD_FOUCUS)
                SARMap.addARLinePoint(layer.name, { translation: translation })
              }
            }
          },
        },
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
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
    case ConstToolType.SM_AR_EDIT_ANIMATION_BONE_ANIMATION: {
      const _data = await getBoneAnimationData(type)
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
    case ConstToolType.SM_AR_EDIT_SETTING:
    case ConstToolType.SM_AR_EDIT_SETTING_ARRAY:{
      const _data = await getStyleData(type)
      if (_data) {
        data = _data.data[0].data
      }
      buttons = [ToolbarBtnType.TOOLBAR_BACK]
      break
    }
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE_ALBUM_COLOR:
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE_ALBUM_LINE_COLOR:
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE_ALBUM_TIME_COLOR:
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE_COLOR:
    case ConstToolType.SM_AR_EDIT_SETTING_BACKGROUND:
    case ConstToolType.SM_AR_EDIT_SETTING_BACKGROUND_BORDER_COLOR:
      data = getColorTable()
      buttons = [ToolbarBtnType.TOOLBAR_BACK,ToolbarBtnType.MENU]
      break
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE: {
      const _data = await getStyleData(type)
      if (_data) {
        data = _data.data[0].data
      }
      buttons = [ToolbarBtnType.TOOLBAR_BACK,ToolbarBtnType.MENU]
      break
    }
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE_TEXT_SIZE:
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE_ROTATION_ANGLE:
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE_OPACITY:
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE_BUTTON_TEXT_SIZE:
    case ConstToolType.SM_AR_EDIT_SETTING_BACKGROUND_OPACITY:
    case ConstToolType.SM_AR_EDIT_SETTING_BACKGROUND_BORDER_WIDTH: {
      const _data = await getStyleData(type)
      if (_data) {
        data = _data.data
      }
      buttons = [ToolbarBtnType.TOOLBAR_BACK,ToolbarBtnType.MENU]
      break
    }
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE_TEXT: {
      buttons = [ToolbarBtnType.TOOLBAR_BACK,ToolbarBtnType.MENU]
      break
    }
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
  global.toolBox &&
  global.toolBox.setVisible(true, type, {
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
      key: getLanguage(language).ARMap.TRANSLATION,
      action: () => {
        SARMap.setAction(ARAction.MOVE)
        showSlideToolbar(ConstToolType.SM_AR_EDIT_POSITION, language, {
          selectName: getLanguage(language).ARMap.TRANSLATION,
          selectKey: getLanguage(language).ARMap.TRANSLATION,
          // isTouchProgress: true,
        })
      },
      selectKey: getLanguage(language).ARMap.TRANSLATION,
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
    },{
      key: getLanguage(language).BONE_ANIMATION,
      action: () => AREditAction.showAnimationAction(ConstToolType.SM_AR_EDIT_ANIMATION_BONE_ANIMATION),
      selectKey: getLanguage(language).BONE_ANIMATION,
    })
  }
  return items
}

const ARAlbumItems = (language: string) => {
  const items = [
    {
      key: getLanguage(language).COLOR,
      action: () => {
        global.toolBox &&
        global.toolBox.setVisible(true, ConstToolType.SM_AR_EDIT_SETTING_IITLE_ALBUM_COLOR, {
          containerType: ToolbarType.colorTable,
          isFullScreen: false,
          showMenuDialog: false,
          selectName: getLanguage().COLOR,
          selectKey: getLanguage().COLOR,
        })
      },
      selectKey: getLanguage(language).COLOR,
    },
    {
      key: getLanguage(language).LINE_COLOR_,
      action: () => {
        global.toolBox &&
        global.toolBox.setVisible(true, ConstToolType.SM_AR_EDIT_SETTING_IITLE_ALBUM_LINE_COLOR, {
          containerType: ToolbarType.colorTable,
          isFullScreen: false,
          showMenuDialog: false,
          selectName: getLanguage().LINE_COLOR_,
          selectKey: getLanguage().LINE_COLOR_,
        })
      },
      selectKey: getLanguage(language).LINE_COLOR_,
    },
    {
      key: getLanguage(language).TIME_COLOR,
      action: () => {
        global.toolBox &&
        global.toolBox.setVisible(true, ConstToolType.SM_AR_EDIT_SETTING_IITLE_ALBUM_TIME_COLOR, {
          containerType: ToolbarType.colorTable,
          isFullScreen: false,
          showMenuDialog: false,
          selectName: getLanguage().TIME_COLOR,
          selectKey: getLanguage().TIME_COLOR,
        })
      },
      selectKey: getLanguage(language).TIME_COLOR,
    },
  ]
  return items
}

const ARTtitleSettingItems = (language: string) => {
  const items = [
    {
      key: getLanguage(language).TEXT_SHAPE,
      action: () => {
        global.toolBox &&
        global.toolBox.setVisible(true, ConstToolType.SM_AR_EDIT_SETTING_IITLE, {
          containerType: ToolbarType.table,
          isFullScreen: false,
          showMenuDialog: false,
          selectName: getLanguage().TEXT_SHAPE,
          selectKey: getLanguage().TEXT_SHAPE,
        })
      },
      selectKey: getLanguage(language).TEXT_SHAPE,
    },
    {
      key: getLanguage(language).TEXT_SIZE,
      action: () => {
        global.toolBox &&
        global.toolBox.setVisible(true, ConstToolType.SM_AR_EDIT_SETTING_IITLE_TEXT_SIZE, {
          containerType: ToolbarType.slider,
          isFullScreen: false,
          showMenuDialog: false,
          selectName: getLanguage().TEXT_SIZE,
          selectKey: getLanguage().TEXT_SIZE,
        })
      },
      selectKey: getLanguage(language).TEXT_SIZE,
    },
    {
      key: getLanguage(language).COLOR,
      action: () => {
        global.toolBox &&
        global.toolBox.setVisible(true, ConstToolType.SM_AR_EDIT_SETTING_IITLE_COLOR, {
          containerType: ToolbarType.colorTable,
          isFullScreen: false,
          showMenuDialog: false,
          selectName: getLanguage().COLOR,
          selectKey: getLanguage().COLOR,
        })
      },
      selectKey: getLanguage(language).COLOR,
    },
    {
      key: getLanguage(language).ROTATION_ANGLE,
      action: () => {
        global.toolBox &&
        global.toolBox.setVisible(true, ConstToolType.SM_AR_EDIT_SETTING_IITLE_ROTATION_ANGLE, {
          containerType: ToolbarType.slider,
          isFullScreen: false,
          showMenuDialog: false,
          selectName: getLanguage().ROTATION_ANGLE,
          selectKey: getLanguage().ROTATION_ANGLE,
        })
      },
      selectKey: getLanguage(language).ROTATION_ANGLE,
    },
    {
      key: getLanguage(language).OPACITY,
      action: () => {
        global.toolBox &&
        global.toolBox.setVisible(true, ConstToolType.SM_AR_EDIT_SETTING_IITLE_OPACITY, {
          containerType: ToolbarType.slider,
          isFullScreen: false,
          showMenuDialog: false,
          selectName: getLanguage().OPACITY,
          selectKey: getLanguage().OPACITY,
        })
      },
      selectKey: getLanguage(language).OPACITY,
    },
  ]
  const _data: any = ToolbarModule.getData()
  const params: any = ToolbarModule.getParams()
  const element = _data.selectARElement
  if(element.touchType === 0 && element.videoType === 0){
    items.push(
      {
        key: getLanguage(language).BUTTON_TEXT_SIZE,
        action: () => {
          global.toolBox &&
          global.toolBox.setVisible(true, ConstToolType.SM_AR_EDIT_SETTING_IITLE_BUTTON_TEXT_SIZE, {
            containerType: ToolbarType.slider,
            isFullScreen: false,
            showMenuDialog: false,
            selectName: getLanguage().BUTTON_TEXT_SIZE,
            selectKey: getLanguage().BUTTON_TEXT_SIZE,
          })
        },
        selectKey: getLanguage(language).BUTTON_TEXT_SIZE,
      },
    )
  }
  if(element.type == ARElementType.AR_BAR_CHART || element.type === ARElementType.AR_PIE_CHART){
    items.splice(3, 1)
    items.splice(0, 2)
    // 还差标题文字设置  TITLE
    const titleText = {
      key: getLanguage(language).TITLE,
      action: () => {
        params.setToolbarVisible(true, ConstToolType.SM_AR_EDIT_SETTING_IITLE_TEXT, {
          containerType: ToolbarType.list,
          customView: (_props: any) => (
            <View style = {[{height: dp(50), backgroundColor: '#fff', marginTop: dp(-50), paddingTop: dp(10)}]}>
              <ToolBarInput
                textTitle = {getLanguage(language).TITLE}
                apply = {(text: string) => {
                  SARMap.setNodeTextTitle(text, element)
                }}
                text = {""}
                windowSize = {_props.windowSize}
              />
            </View>
          ),
          isFullScreen: false,
          showMenuDialog: false,
        })
      },
      selectKey: getLanguage(language).FILLCOLOR,
    }
    items.unshift(titleText)

    if(element.type == ARElementType.AR_PIE_CHART){
      // 饼图还要添加标题的背景色
      const fillColor = {
        key: getLanguage(language).FILLCOLOR,
        action: () => {
          global.toolBox &&
          global.toolBox.setVisible(true, ConstToolType.SM_AR_EDIT_SETTING_BACKGROUND, {
            containerType: ToolbarType.colorTable,
            isFullScreen: false,
            showMenuDialog: false,
            selectName: getLanguage().FILLCOLOR,
            selectKey: getLanguage().FILLCOLOR,
          })
        },
        selectKey: getLanguage(language).FILLCOLOR,
      }
      items.push(fillColor)
    }
  }
  return items
}

const ARBackgroundSettingItems = (language: string) => {
  const items = [
    {
      key: getLanguage(language).FILLCOLOR,
      action: () => {
        global.toolBox &&
        global.toolBox.setVisible(true, ConstToolType.SM_AR_EDIT_SETTING_BACKGROUND, {
          containerType: ToolbarType.colorTable,
          isFullScreen: false,
          showMenuDialog: false,
          selectName: getLanguage().FILLCOLOR,
          selectKey: getLanguage().FILLCOLOR,
        })
      },
      selectKey: getLanguage(language).FILLCOLOR,
    },
    {
      key: getLanguage(language).OPACITY,
      action: () => {
        global.toolBox &&
        global.toolBox.setVisible(true, ConstToolType.SM_AR_EDIT_SETTING_BACKGROUND_OPACITY, {
          containerType: ToolbarType.slider,
          isFullScreen: false,
          showMenuDialog: false,
          selectName: getLanguage().OPACITY,
          selectKey: getLanguage().OPACITY,
        })
      },
      selectKey: getLanguage(language).OPACITY,
    },
    {
      key: getLanguage(language).BORDER_COLOR,
      action: () => {
        global.toolBox &&
        global.toolBox.setVisible(true, ConstToolType.SM_AR_EDIT_SETTING_BACKGROUND_BORDER_COLOR, {
          containerType: ToolbarType.colorTable,
          isFullScreen: false,
          showMenuDialog: false,
          selectName: getLanguage().BORDER_COLOR,
          selectKey: getLanguage().BORDER_COLOR,
        })
      },
      selectKey: getLanguage(language).BORDER_COLOR,
    },
    {
      key: getLanguage(language).BORDER_WIDTH,
      action: () => {
        global.toolBox &&
        global.toolBox.setVisible(true, ConstToolType.SM_AR_EDIT_SETTING_BACKGROUND_BORDER_WIDTH, {
          containerType: ToolbarType.slider,
          isFullScreen: false,
          showMenuDialog: false,
          selectName: getLanguage().BORDER_WIDTH,
          selectKey: getLanguage().BORDER_WIDTH,
        })
      },
      selectKey: getLanguage(language).BORDER_WIDTH,
    },
  ]
  const _data: any = ToolbarModule.getData()
  const element = _data.selectARElement
  if(element.touchType === 0 && element.videoType === 0){
    items.push(
      {
        key: getLanguage(language).BUTTON_TEXT_SIZE,
        action: () => {
          global.toolBox &&
          global.toolBox.setVisible(true, ConstToolType.SM_AR_EDIT_SETTING_IITLE_BUTTON_TEXT_SIZE, {
            containerType: ToolbarType.slider,
            isFullScreen: false,
            showMenuDialog: false,
            selectName: getLanguage().BUTTON_TEXT_SIZE,
            selectKey: getLanguage().BUTTON_TEXT_SIZE,
          })
        },
        selectKey: getLanguage(language).BUTTON_TEXT_SIZE,
      },
    )
  }
  if(element.type == ARElementType.AR_BAR_CHART){
    // 柱状图的背景设置只有颜色和透明度
    items.splice(2, 2)
  }
  return items
}

function getMenuData(type:any) {
  const _params: any = ToolbarModule.getParams()
  const _data: any = ToolbarModule.getData()

  let data: { key: string; action: () => void; selectKey: string }[] = []

  if (_data.selectARElement && typeof _data.selectARElement !== 'string') {
    switch (_data.selectARElement.type) {
      case ARElementType.AR_IMAGE:
      case ARElementType.AR_VIDEO:
      case ARElementType.AR_WEBVIEW:
      case ARElementType.AR_TEXT:
      case ARElementType.AR_BUBBLE_TEXT:
      case ARElementType.AR_MODEL:
      case ARElementType.AR_ATTRIBUTE_ALBUM:
      case ARElementType.AR_BROCHOR:
      case ARElementType.AR_ALBUM:
      case ARElementType.AR_VIDEO_ALBUM:
      case ARElementType.AR_SAND_TABLE_ALBUM:
      case ARElementType.AR_SAND_TABLE:
      case ARElementType.AR_BAR_CHART:
      case ARElementType.AR_PIE_CHART:
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
  switch (type){
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE_ALBUM_COLOR:
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE_ALBUM_LINE_COLOR:
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE_ALBUM_TIME_COLOR:
      data = ARAlbumItems(_params.language)
      break
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE:
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE_TEXT_SIZE:
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE_COLOR:
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE_ROTATION_ANGLE:
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE_OPACITY:
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE_BUTTON_TEXT_SIZE:
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE_TEXT:
      data = ARTtitleSettingItems(_params.language)
      break
    case ConstToolType.SM_AR_EDIT_SETTING_BACKGROUND:
    case ConstToolType.SM_AR_EDIT_SETTING_BACKGROUND_OPACITY:
    case ConstToolType.SM_AR_EDIT_SETTING_BACKGROUND_BORDER_COLOR:
    case ConstToolType.SM_AR_EDIT_SETTING_BACKGROUND_BORDER_WIDTH:
      data = ARBackgroundSettingItems(_params.language)
      break
  }

  return data
}

async function getStyleData(type: string) {
  const _data: any = ToolbarModule.getData()
  const _params: any = ToolbarModule.getParams()
  const element = _data.selectARElement
  const currentLayer = _params.arlayer.currentLayer
  const style = _data.currentNodeStyle

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
    size: [10, 40],
    opacity:[0,100],
    buttonsize: [12, 30],
    width: [0, 20],
  }

  const defaultValue = {
    opacity: [95],
    width: [0],
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
  } else if (currentLayer?.type === ARLayerType.AR_WIDGET_LAYER){
    buttons = [
      ToolbarBtnType.TOOLBAR_BACK,
      ToolbarBtnType.MENU,
      {
        type: 'Setting',
        image: getThemeAssets().toolbar.icon_toolbar_setting,
        action: async () => {
          const _params: any = ToolbarModule.getParams()
          _params.showFullMap && _params.showFullMap(true)
          _params.setToolbarVisible(true, ConstToolType.SM_AR_EDIT_SETTING, {
            containerType: ToolbarType.table,
            isFullScreen: false,
          })
        },
      },
      ToolbarBtnType.MENU_FLEX,
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

  if (_data.selectARElement.type === ARElementType.AR_LINE
    || _data.selectARElement.type === ARElementType.AR_MARKER_LINE) {
    buttons = [
      ToolbarBtnType.TOOLBAR_BACK,
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
          leftText:  getLanguage(global.language).ARMap.WEST,
          rightText:  getLanguage(global.language).ARMap.EAST,
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
          leftText:  getLanguage(global.language).DOWN,
          rightText:  getLanguage(global.language).UP,
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
          leftText:  getLanguage(global.language).ARMap.SOUTH,
          rightText:  getLanguage(global.language).ARMap.NORTH,
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
        title: getLanguage(_params.language).ARMap.TRANSLATION,
        data: data,
      })
      break
    // case ConstToolType.SM_AR_VISIBLE_DISTANCE:
    //   data = []
    //   break
    case ConstToolType.SM_AR_EDIT_SCALE: {
      const _defaultValue = transformData.scale === 100 ? transformData.scale : ((transformData.scale + 1) * 100)
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
    case ConstToolType.SM_AR_EDIT_SETTING:{
      data = [
        {
          key: ConstToolType.SM_AR_EDIT_SETTING_IITLE,
          image: getThemeAssets().ar.armap.icon_tool_title,
          title: getLanguage().TITLE,
          action: async () => {
            const element = AppToolBar.getData().selectARElement
            const style = await SARMap.getCurrentNodeStyle(element)
            ToolbarModule.addData({ currentNodeStyle: style })
            const _params: any = ToolbarModule.getParams()
            _params.showFullMap && _params.showFullMap(true)

            if(element?.type === ARElementType.AR_ALBUM){
              _params.setToolbarVisible(true, ConstToolType.SM_AR_EDIT_SETTING_IITLE_ALBUM_COLOR, {
                containerType: ToolbarType.colorTable,
                isFullScreen: false,
                showMenuDialog: false,
                selectName: getLanguage().COLOR,
                selectKey: getLanguage().COLOR,
              })
            } else if(element?.type === ARElementType.AR_BAR_CHART || element?.type === ARElementType.AR_PIE_CHART){
              // 柱状图和饼图的设置工具栏里 点击标题去往的界面
              _params.setToolbarVisible(true, ConstToolType.SM_AR_EDIT_SETTING_IITLE_COLOR, {
                containerType: ToolbarType.colorTable,
                isFullScreen: false,
                showMenuDialog: false,
                selectName: getLanguage().COLOR,
                selectKey: getLanguage().COLOR,
              })
            } else{
              _params.setToolbarVisible(true, ConstToolType.SM_AR_EDIT_SETTING_IITLE, {
                containerType: ToolbarType.table,
                isFullScreen: false,
                showMenuDialog: false,
                selectName: getLanguage().TEXT_SHAPE,
                selectKey: getLanguage().TEXT_SHAPE,
              })
            }
          },
        },
        {
          key: ConstToolType.SM_AR_EDIT_SETTING_BACKGROUND,
          image: getThemeAssets().ar.armap.icon_tool_background,
          title: getLanguage().BACKGROUND,
          action: () => {
            const _params: any = ToolbarModule.getParams()
            _params.showFullMap && _params.showFullMap(true)
            _params.setToolbarVisible(true, ConstToolType.SM_AR_EDIT_SETTING_BACKGROUND, {
              containerType: ToolbarType.colorTable,
              isFullScreen: false,
            })
          },
        },
        {
          key: ConstToolType.SM_AR_EDIT_SETTING_ARRAY,
          image: getThemeAssets().ar.armap.icon_tool_array,
          title: getLanguage().ARRAY,
          action: () => {
            const _params: any = ToolbarModule.getParams()
            _params.showFullMap && _params.showFullMap(true)
            _params.setToolbarVisible(true, ConstToolType.SM_AR_EDIT_SETTING_ARRAY, {
              containerType: ToolbarType.table,
              isFullScreen: false,
            })
          },
        },
        {
          key: ConstToolType.SM_AR_EDIT_SETTING_CHART_DATA,
          image: getThemeAssets().ar.armap.icon_tool_array,
          title: getLanguage().DATA,
          action: () => {
            const _data: any = ToolbarModule.getData()
            const element = _data.selectARElement
            if(element.type == ARElementType.AR_BAR_CHART){
              // 柱状图更新数据
              NavigationService.navigate("ChartManager", { type: 'update' })
            } else if(element.type == ARElementType.AR_PIE_CHART){
              // 饼图更新数据
              NavigationService.navigate("ChartManager", { type: 'pieChartUpdate' })
            }

          },
        },
      ]
      const element = AppToolBar.getData().selectARElement

      if(element?.type === ARElementType.AR_BAR_CHART || element?.type === ARElementType.AR_PIE_CHART){
        // 柱状图和饼图，去掉排列
        data.splice(2, 1)
        if(element?.type === ARElementType.AR_PIE_CHART){
          // 饼图再去掉背景设置
          data.splice(1, 1)
        }
      } else {
        // 其他的去掉柱状图和饼图的更新
        data.splice(3, 1)
      }

      //点击右侧node时不显示标题设置
      if (element?.touchType !== 0) {
        data.splice(0, 1)
        data.splice(1, 1)
      }
      if (element?.type === ARElementType.AR_ALBUM || element?.videoType === 0 || element?.type === ARElementType.AR_SAND_TABLE_ALBUM) {
        data.splice(2, 1)
      }
      allData.push({
        title: getLanguage(_params.language).SETTING,
        data: data,
      })
      break
    }
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE:{
      data = [
        {
          key: ConstToolType.SM_AR_EDIT_SETTING_IITLE,
          image: getThemeAssets().ar.armap.icon_tool_bold,
          title: getLanguage().BOLD,
          action: () => {
            SARMap.setNodeStyle({TextBold:1},element)
          },
        },
        {
          key: ConstToolType.SM_AR_EDIT_SETTING_IITLE,
          image: getThemeAssets().ar.armap.icon_tool_tilt,
          title: getLanguage().TILT,
          action: () => {
            SARMap.setNodeStyle({TextBold:2},element)
          },
        },
        {
          key: ConstToolType.SM_AR_EDIT_SETTING_IITLE,
          image: getThemeAssets().ar.armap.icon_tool_underline,
          title: getLanguage().UNDERLINE,
          action: () => {
            SARMap.setNodeStyle({Flags:3},element)
          },
        },
        {
          key: ConstToolType.SM_AR_EDIT_SETTING_IITLE,
          image: getThemeAssets().ar.armap.icon_tool_strikethrough,
          title: getLanguage().STRIKETHROUGH,
          action: () => {
            SARMap.setNodeStyle({Flags:4},element)
          },
        },
        {
          key: ConstToolType.SM_AR_EDIT_SETTING_IITLE,
          image: getThemeAssets().ar.armap.icon_tool_shadow,
          title: getLanguage().SHADOW,
          action: () => {
            SARMap.setNodeStyle({TextShadow:5},element)
          },
        },
      ]
      allData.push({
        title: getLanguage(_params.language).TEXT_SHAPE,
        data: data,
      })
      break
    }
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE_TEXT_SIZE:{
      data =[
        {
          key: 'single',
          leftText:  ' ',
          rightText: 'mm',
          onMove: (loc: number) => {
            SARMap.setNodeStyle({TextSize:loc},element)
          },
          defaultValue:  style?.TextSize,
          range: range.size,
        },
      ]
      allData.push({
        title: getLanguage(_params.language).TEXT_SIZE,
        data: data,
      })
      break
    }
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE_ROTATION_ANGLE: {
      data =[
        {
          key: 'single',
          leftText:  ' ',
          rightText: '°',
          onMove: (loc: number) => {
            SARMap.setNodeStyle({TextRotation:loc},element)
          },
          defaultValue:  style?.TextRotation,
          range: range.rotation,
        },
      ]
      allData.push({
        title: getLanguage(_params.language).ROTATION_ANGLE,
        data: data,
      })
      break
    }
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE_OPACITY: {
      data =[
        {
          key: 'single',
          leftText:  ' ',
          rightText: '%',
          onMove: (loc: number) => {
            SARMap.setNodeStyle({TextOpacity:loc/100},element)
          },
          defaultValue: style?.TextOpacity? style.TextOpacity*100 : 100,
          range: range.opacity,
        },
      ]
      allData.push({
        title: getLanguage(_params.language).OPACITY,
        data: data,
      })
      break
    }
    case ConstToolType.SM_AR_EDIT_SETTING_IITLE_BUTTON_TEXT_SIZE: {
      data =[
        {
          key: 'single',
          leftText:  ' ',
          rightText: 'mm',
          onMove: (loc: number) => {
            SARMap.setNodeStyle({ButtonTextSize:loc},element)
          },
          defaultValue: style?.ButtonTextSize,
          range: range.buttonsize,
        },
      ]
      allData.push({
        title: getLanguage(_params.language).BUTTON_TEXT_SIZE,
        data: data,
      })
      break
    }
    case ConstToolType.SM_AR_EDIT_SETTING_ARRAY:{
      data = [
        {
          key: ConstToolType.SM_AR_EDIT_SETTING_ARRAY,
          image: getThemeAssets().ar.armap.icon_array_1_3,
          size:'large',
          action: () => {
            SARMap.setNodeStyle({Array:0},element)
          },
        },
        {
          key: ConstToolType.SM_AR_EDIT_SETTING_ARRAY,
          image: getThemeAssets().ar.armap.icon_array_2_3,
          size:'large',
          action: () => {
            SARMap.setNodeStyle({Array:1},element)
          },
        },
        {
          key: ConstToolType.SM_AR_EDIT_SETTING_ARRAY,
          image: getThemeAssets().ar.armap.icon_array_2_4,
          size:'large',
          action: () => {
            SARMap.setNodeStyle({Array:2},element)
          },
        },
        {
          key: ConstToolType.SM_AR_EDIT_SETTING_ARRAY,
          image: getThemeAssets().ar.armap.icon_array_3_3,
          size:'large',
          action: () => {
            SARMap.setNodeStyle({Array:3},element)
          },
        },
        {
          key: ConstToolType.SM_AR_EDIT_SETTING_ARRAY,
          image: getThemeAssets().ar.armap.icon_array_4_4,
          size:'large',
          action: () => {
            SARMap.setNodeStyle({Array:4},element)
          },
        },
      ]
      allData.push({
        title: getLanguage(_params.language).ARRAY,
        data: data,
      })
      break
    }
    case ConstToolType.SM_AR_EDIT_SETTING_BACKGROUND_OPACITY:
    {
      data =[
        {
          key: 'single',
          leftText:  ' ',
          rightText: '%',
          onMove: (loc: number) => {
            SARMap.setNodeStyle({opacity:loc/100},element)
          },
          defaultValue: defaultValue.opacity[0],
          range: range.opacity,
        },
      ]
      allData.push({
        title: getLanguage(_params.language).BACKGROUND_OPACITY,
        data: data,
      })
      break
    }
    case ConstToolType.SM_AR_EDIT_SETTING_BACKGROUND_BORDER_WIDTH:
    {
      data =[
        {
          key: 'single',
          leftText:  ' ',
          rightText: 'mm',
          onMove: (loc: number) => {
            SARMap.setNodeStyle({borderWidth:loc},element)
          },
          defaultValue: defaultValue.width[0],
          range: range.width,
        },
      ]
      allData.push({
        title: getLanguage(_params.language).BORDER_WIDTH,
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
          title: getLanguage(global.language).Common.ADD,
          action: () => AREditAction.showAnimationAction(ConstToolType.SM_AR_EDIT_ANIMATION_TYPE),
        },
        {
          key: 'none',
          image: getThemeAssets().ar.armap.ar_animation_none,
          title: getLanguage(global.language).Common.NONE,
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
          title: getLanguage(global.language).ARMap.TRANSLATION,
          action: () => AREditAction.showAnimationAction(ConstToolType.SM_AR_EDIT_ANIMATION_TRANSLATION),
        },
        {
          key: ConstToolType.SM_AR_EDIT_ANIMATION_ROTATION,
          image: getThemeAssets().ar.armap.ar_rotate,
          title: getLanguage(global.language).ARMap.ROTATION,
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
          // title: getLanguage(global.language).ARMap.DISTANCE,
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
            unit: getLanguage(global.language).Map_Main_Menu.METERS,
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


/**
 * 获取骨骼动画（模型自带动画）编辑数据
 * @param type
 * @returns
 */
async function getBoneAnimationData(type: string) {
  const _data: any = ToolbarModule.getData()
  const _params: any = ToolbarModule.getParams()
  const element = _data.selectARElement
  const currentLayer = _params.arlayer.currentLayer

  if(!element && currentLayer?.type !== ARLayerType.AR_SCENE_LAYER)  {
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
  data = [
    {
      key: 'none',
      image: getThemeAssets().ar.armap.ar_animation_none,
      title: getLanguage(global.language).Common.NONE,
      action: () => {
        if(element && typeof element !== 'string') {
          SARMap.setModelAnimation(element.layerName, element.id, -1)
        }
      },
    },
  ]
  const modelAnimations = await SARMap.getModelAnimation(element.layerName, element.id)
  const animationData: DATA_ITEM[] = []
  for (let i = 0; i < modelAnimations.length; i++) {
    const item = modelAnimations[i]
    animationData.push({
      key: item,
      image: getThemeAssets().ar.armap.ar_scale,
      title: item,
      action: async () => {
        if(element && typeof element !== 'string') {
          SARMap.setModelAnimation(element.layerName, element.id, i)
        }
      },
    })
  }

  allData.push({
    title: getLanguage(_params.language).BONE_ANIMATION,
    data: data.concat(animationData),
  })
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
  const _data: any = ToolbarModule.getData()
  if (
    // type === ConstToolType.SM_AR_EDIT ||
    type === ConstToolType.SM_AR_EDIT_SCALE ||
    type === ConstToolType.SM_AR_EDIT_ROTATION ||
    type === ConstToolType.SM_AR_EDIT_POSITION ||
    type === ConstToolType.SM_AR_EDIT_VERTEX_ADD_LINE
  ) {
    headerData = {
      withoutBack: true,
      type: 'floatNoTitle',
      headerRight: [{
        key: 'delete',
        // title: getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_CLEAR,
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
    if(_data.selectARElement && typeof _data.selectARElement !== 'string') {
      if(_data.selectARElement.type === ARElementType.AR_TEXT
      || _data.selectARElement.type === ARElementType.AR_BUBBLE_TEXT) {
        headerData.headerRight.push({
          key: 'edit_text',
          // title: getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_CLEAR,
          action: AREditAction.changeARText,
          size: 'large',
          image: getImage().icon_edit,
          style: {
            width: scaleSize(60),
            height: scaleSize(60),
            borderRadius: scaleSize(8),
            backgroundColor: color.white,
          },
        })
      }
    }

    if(_data.selectARElement.type === ARElementType.AR_LINE
      || _data.selectARElement.type === ARElementType.AR_MARKER_LINE){
      headerData.headerRight.push({
        key: 'line_object_edit',
        // title: getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_CLEAR,
        action: ()=>{
          SARMap.setAction(ARAction.MOVE)
          _params.setToolbarVisible(true, ConstToolType.SM_AR_EDIT_POSITION, {
            containerType: ToolbarType.slider,
            isFullScreen: false,
          })
        },
        size: 'large',
        image: getImage().icon_edit,
        style: {
          width: scaleSize(60),
          height: scaleSize(60),
          borderRadius: scaleSize(8),
          backgroundColor: color.white,
        },
      },{
        key: 'line_point_add',
        // title: getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_CLEAR,
        action: ()=>{
          SARMap.setAction(ARAction.VERTEX_ADD)
          _params.setToolbarVisible(true, ConstToolType.SM_AR_EDIT_VERTEX_ADD_LINE, {
            isFullScreen: false,
          })
        },
        size: 'large',
        image: getImage().zoom_in,
        style: {
          width: scaleSize(60),
          height: scaleSize(60),
          borderRadius: scaleSize(8),
          backgroundColor: color.white,
        },
      })
    }
  }
  return headerData
}

function getHeaderView(type: string) {
  const _data: any = ToolbarModule.getData()
  if (
    (
      type === ConstToolType.SM_AR_EDIT_SCALE ||
      type === ConstToolType.SM_AR_EDIT_ROTATION ||
      type === ConstToolType.SM_AR_EDIT_POSITION
    ) &&
    _data.selectARElement?.type === ARElementType.AR_SAND_TABLE
  ) {
    return (
      <View
        style={{
          flexDirection: 'column',
          position: 'absolute',
          right: scaleSize(20),
          top: scaleSize(20),
          backgroundColor: 'transparent',
        }}
      >
        <MTBtn
          key={'delete'}
          style={{
            width: scaleSize(60),
            height: scaleSize(60),
            borderRadius: scaleSize(8),
            backgroundColor: color.white,
          }}
          imageStyle={{ width: scaleSize(50), height: scaleSize(50) }}
          image={getThemeAssets().ar.toolbar.icon_delete}
          onPress={AREditAction.deleteARElement}
        />
        <MTBtn
          key={'export'}
          style={{
            width: scaleSize(60),
            height: scaleSize(60),
            marginTop: scaleSize(8),
            borderRadius: scaleSize(8),
            backgroundColor: color.white,
          }}
          imageStyle={{ width: scaleSize(50), height: scaleSize(50) }}
          image={getPublicAssets().common.export_black}
          onPress={AREditAction.exportSandTable}
        />
      </View>
    )
  }
  return undefined
}

function getColorTable(){
  const data = [
    {
      key: '#FFFFFF',
      size: 'large',
      background: '#FFFFFF',
    },
    {
      key: '#000000',
      size: 'large',
      background: '#000000',
    },
    {
      key: '#F0EDE1',
      size: 'large',
      background: '#F0EDE1',
    },
    {
      key: '#1E477C',
      size: 'large',
      background: '#1E477C',
    },
    {
      key: '#4982BC',
      size: 'large',
      background: '#4982BC',
    },
    {
      key: '#00A1E9',
      size: 'large',
      background: '#00A1E9',
    },
    {
      key: '#803000',
      size: 'large',
      background: '#803000',
    },
    {
      key: '#BD5747',
      size: 'large',
      background: '#BD5747',
    },
    {
      key: '#36E106',
      size: 'large',
      background: '#36E106',
    },
    {
      key: '#9CBB58',
      size: 'large',
      background: '#9CBB58',
    },
    {
      key: '#8364A1',
      size: 'large',
      background: '#8364A1',
    },
    {
      key: '#4AADC7',
      size: 'large',
      background: '#4AADC7',
    },
    {
      key: '#F89746',
      size: 'large',
      background: '#F89746',
    },
    {
      key: '#E7A700',
      size: 'large',
      background: '#E7A700',
    },
    {
      key: '#E7E300',
      size: 'large',
      background: '#E7E300',
    },
    {
      key: '#D33248',
      size: 'large',
      background: '#D33248',
    },
    {
      key: '#F1F1F1',
      size: 'large',
      background: '#F1F1F1',
    },
    {
      key: '#7D7D7D',
      size: 'large',
      background: '#7D7D7D',
    },
    {
      key: '#DDD9C3',
      size: 'large',
      background: '#DDD9C3',
    },
    {
      key: '#C9DDF0',
      size: 'large',
      background: '#C9DDF0',
    },
    {
      key: '#DBE4F3',
      size: 'large',
      background: '#DBE4F3',
    },
    {
      key: '#BCE8FD',
      size: 'large',
      background: '#BCE8FD',
    },
    {
      key: '#E5C495',
      size: 'large',
      background: '#E5C495',
    },
    {
      key: '#F4DED9',
      size: 'large',
      background: '#F4DED9',
    },
    {
      key: '#DBE9CE',
      size: 'large',
      background: '#DBE9CE',
    },
    {
      key: '#EBF4DE',
      size: 'large',
      background: '#EBF4DE',
    },
    {
      key: '#E5E1ED',
      size: 'large',
      background: '#E5E1ED',
    },
    {
      key: '#DDF0F3',
      size: 'large',
      background: '#DDF0F3',
    },
    {
      key: '#FDECDC',
      size: 'large',
      background: '#FDECDC',
    },
    {
      key: '#FFE7C4',
      size: 'large',
      background: '#FFE7C4',
    },
    {
      key: '#FDFACA',
      size: 'large',
      background: '#FDFACA',
    },
    {
      key: '#F09CA0',
      size: 'large',
      background: '#F09CA0',
    },
    {
      key: '#D7D7D7',
      size: 'large',
      background: '#D7D7D7',
    },
    {
      key: '#585858',
      size: 'large',
      background: '#585858',
    },
    {
      key: '#C6B797',
      size: 'large',
      background: '#C6B797',
    },
    {
      key: '#8CB4EA',
      size: 'large',
      background: '#8CB4EA',
    },
    {
      key: '#C1CCE4',
      size: 'large',
      background: '#C1CCE4',
    },
    {
      key: '#7ED2F6',
      size: 'large',
      background: '#7ED2F6',
    },
    {
      key: '#B1894F',
      size: 'large',
      background: '#B1894F',
    },
    {
      key: '#E7B8B8',
      size: 'large',
      background: '#E7B8B8',
    },
    {
      key: '#B0D59A',
      size: 'large',
      background: '#B0D59A',
    },
    {
      key: '#D7E3BD',
      size: 'large',
      background: '#D7E3BD',
    },
    {
      key: '#CDC1D9',
      size: 'large',
      background: '#CDC1D9',
    },
    {
      key: '#B7DDE9',
      size: 'large',
      background: '#B7DDE9',
    },
    {
      key: '#FAD6B1',
      size: 'large',
      background: '#FAD6B1',
    },
    {
      key: '#F5CE88',
      size: 'large',
      background: '#F5CE88',
    },
    {
      key: '#FFF55A',
      size: 'large',
      background: '#FFF55A',
    },
    {
      key: '#EF6C78',
      size: 'large',
      background: '#EF6C78',
    },
    {
      key: '#BFBFBF',
      size: 'large',
      background: '#BFBFBF',
    },
    {
      key: '#3E3E3E',
      size: 'large',
      background: '#3E3E3E',
    },
    {
      key: '#938953',
      size: 'large',
      background: '#938953',
    },
    {
      key: '#548ED4',
      size: 'large',
      background: '#548ED4',
    },
    {
      key: '#98B7D5',
      size: 'large',
      background: '#98B7D5',
    },
    {
      key: '#00B4F0',
      size: 'large',
      background: '#00B4F0',
    },
    {
      key: '#9A6C34',
      size: 'large',
      background: '#9A6C34',
    },
    {
      key: '#D79896',
      size: 'large',
      background: '#D79896',
    },
    {
      key: '#7EC368',
      size: 'large',
      background: '#7EC368',
    },
    {
      key: '#C5DDA5',
      size: 'large',
      background: '#C5DDA5',
    },
    {
      key: '#B1A5C6',
      size: 'large',
      background: '#B1A5C6',
    },
    {
      key: '#93CDDD',
      size: 'large',
      background: '#93CDDD',
    },
    {
      key: '#F9BD8D',
      size: 'large',
      background: '#F9BD8D',
    },
    {
      key: '#F7B550',
      size: 'large',
      background: '#F7B550',
    },
    {
      key: '#FFF100',
      size: 'large',
      background: '#FFF100',
    },
    {
      key: '#E80050',
      size: 'large',
      background: '#E80050',
    },
    {
      key: '#A6A6A7',
      size: 'large',
      background: '#A6A6A7',
    },
    {
      key: '#2D2D2B',
      size: 'large',
      background: '#2D2D2B',
    },
    {
      key: '#494428',
      size: 'large',
      background: '#494428',
    },
    {
      key: '#1D3A5F',
      size: 'large',
      background: '#1D3A5F',
    },
    {
      key: '#376192',
      size: 'large',
      background: '#376192',
    },
    {
      key: '#00A1E9',
      size: 'large',
      background: '#00A1E9',
    },
    {
      key: '#825320',
      size: 'large',
      background: '#825320',
    },
    {
      key: '#903635',
      size: 'large',
      background: '#903635',
    },
    {
      key: '#13B044',
      size: 'large',
      background: '#13B044',
    },
    {
      key: '#76933C',
      size: 'large',
      background: '#76933C',
    },
    {
      key: '#5E467C',
      size: 'large',
      background: '#5E467C',
    },
    {
      key: '#31859D',
      action: () => setColor('#31859D'),
      size: 'large',
      background: '#31859D',
    },
    {
      key: '#E46C07',
      size: 'large',
      background: '#E46C07',
    },
    {
      key: '#F39900',
      size: 'large',
      background: '#F39900',
    },
    {
      key: '#B7AB00',
      size: 'large',
      background: '#B7AB00',
    },
    {
      key: '#A50036',
      size: 'large',
      background: '#A50036',
    },
    {
      key: '#979D99',
      size: 'large',
      background: '#979D99',
    },
    {
      key: '#0C0C0C',
      size: 'large',
      background: '#0C0C0C',
    },
    {
      key: '#1C1A10',
      size: 'large',
      background: '#1C1A10',
    },
    {
      key: '#0C263D',
      size: 'large',
      background: '#0C263D',
    },
    {
      key: '#1D3A5F',
      size: 'large',
      background: '#1D3A5F',
    },
    {
      key: '#005883',
      size: 'large',
      background: '#005883',
    },
    {
      key: '#693904',
      size: 'large',
      background: '#693904',
    },
    {
      key: '#622727',
      size: 'large',
      background: '#622727',
    },
    {
      key: '#005E14',
      size: 'large',
      background: '#005E14',
    },
    {
      key: '#4F6028',
      size: 'large',
      background: '#4F6028',
    },
    {
      key: '#3E3050',
      size: 'large',
      background: '#3E3050',
    },
    {
      key: '#245B66',
      size: 'large',
      background: '#245B66',
    },
    {
      key: '#974805',
      size: 'large',
      background: '#974805',
    },
    {
      key: '#AD6A00',
      size: 'large',
      background: '#AD6A00',
    },
    {
      key: '#8B8100',
      size: 'large',
      background: '#8B8100',
    },
    {
      key: '#7C0022',
      size: 'large',
      background: '#7C0022',
    },
    {
      key: '#F0DCBE',
      size: 'large',
      background: '#F0DCBE',
    },
    {
      key: '#F2B1CF',
      size: 'large',
      background: '#F2B1CF',
    },
    {
      key: '#D3FFBF',
      size: 'large',
      background: '#D3FFBF',
    },
    {
      key: '#00165F',
      size: 'large',
      background: '#00165F',
    },
    {
      key: '#6673CB',
      size: 'large',
      background: '#6673CB',
    },
    {
      key: '#006EBF',
      size: 'large',
      background: '#006EBF',
    },
    {
      key: '#89CF66',
      size: 'large',
      background: '#89CF66',
    },
    {
      key: '#70A900',
      size: 'large',
      background: '#70A900',
    },
    {
      key: '#13B044',
      size: 'large',
      background: '#13B044',
    },
    {
      key: '#93D150',
      size: 'large',
      background: '#93D150',
    },
    {
      key: '#70319F',
      size: 'large',
      background: '#70319F',
    },
    {
      key: '#00B4F0',
      size: 'large',
      background: '#00B4F0',
    },
    {
      key: '#D38968',
      size: 'large',
      background: '#D38968',
    },
    {
      key: '#FFBF00',
      size: 'large',
      background: '#FFBF00',
    },
    {
      key: '#FFFF00',
      size: 'large',
      background: '#FFFF00',
    },
    {
      key: '#C10000',
      size: 'large',
      background: '#C10000',
    },
    {
      key: '#F0F1A6',
      size: 'large',
      background: '#F0F1A6',
    },
    {
      key: '#FF0000',
      size: 'large',
      background: '#FF0000',
    },
  ]
  return data
}

export default {
  getData,
  getMenuData,
  getHeaderData,
  getHeaderView,
}
