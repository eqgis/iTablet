import React from 'react'
import { ViewStyle } from 'react-native'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { scaleSize, Toast } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import { color } from '../../../../../../styles'
import ToolbarModule from '../ToolbarModule'
import ARDrawingAction from './ARDrawingAction'
import ToolbarBtnType from '../../ToolbarBtnType'
import ToolBarSlide from '../../components/ToolBarSlide'
import NavigationService from '../../../../../NavigationService'
import { ARElementType, SARMap } from 'imobile_for_reactnative'
import DataHandler from '../../../../../tabs/Mine/DataHandler'

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
  let data: SectionData[] | SectionItemData[] | string[] = []
  let buttons: any[]
  if (type === ConstToolType.SM_AR_DRAWING) {
    buttons = [ToolbarBtnType.PLACEHOLDER, ToolbarBtnType.TOOLBAR_COMMIT]
  } else {
    buttons = [ToolbarBtnType.TOOLBAR_BACK, ToolbarBtnType.TOOLBAR_COMMIT]
  }
  switch (type) {
    case ConstToolType.SM_AR_DRAWING:
    case ConstToolType.SM_AR_DRAWING_POI:
    case ConstToolType.SM_AR_DRAWING_MODEL:
    case ConstToolType.SM_AR_DRAWING_3D:
    case ConstToolType.SM_AR_DRAWING_VECTOR:
    case ConstToolType.SM_AR_DRAWING_EFFECT: {
      const data3D = await get3DData()
      const arModel = await getARModel()
      data = [
        {
          title: getLanguage(GLOBAL.language).Prompt.POI,
          data: [{
            key: ConstToolType.SM_AR_DRAWING_IMAGE,
            image: getThemeAssets().ar.functiontoolbar.ar_picture,
            title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_IMAGE,
            action: ARDrawingAction.arImage,
          }, {
            key: ConstToolType.SM_AR_DRAWING_VIDEO,
            image: getThemeAssets().ar.functiontoolbar.ar_video,
            title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_VIDEO,
            action: ARDrawingAction.arVideo,
          }, {
            key: ConstToolType.SM_AR_DRAWING_WEB,
            image: getThemeAssets().ar.functiontoolbar.ar_webpage,
            title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_WEBVIEW,
            action: ARDrawingAction.arWebView,
          }],
        },
        {
          title: '三维',
          containerType: 'list',
          data: data3D,
        },
        // {
        //   title: '矢量',
        //   data: [{
        //     key: ConstToolType.SM_AR_DRAWING_POINT,
        //     image: getThemeAssets().toolbar.icon_toolbar_savespot,
        //     // selectedImage: any,
        //     title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAVE_POINT,
        //     action: data => {},
        //   }, {
        //     key: ConstToolType.SM_AR_DRAWING_LINE,
        //     image: getThemeAssets().toolbar.icon_toolbar_saveline,
        //     // selectedImage: any,
        //     title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAVE_LINE,
        //     action: data => {},
        //   }, {
        //     key: ConstToolType.SM_AR_DRAWING_REGION,
        //     image: getThemeAssets().toolbar.icon_toolbar_region,
        //     // selectedImage: any,
        //     title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAVE_AEREA,
        //     action: data => {},
        //   }, {
        //     key: ConstToolType.SM_AR_DRAWING_SUBSTANCE,
        //     image: getThemeAssets().ar.functiontoolbar.icon_ar_volume_select,
        //     // selectedImage: any,
        //     title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAVE_SUBSTANCE,
        //     action: data => {},
        //   }, {
        //     key: ConstToolType.SM_AR_DRAWING_TEXT,
        //     image: getThemeAssets().layerType.layer_text,
        //     // selectedImage: any,
        //     title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAVE_TEXT,
        //     action: data => {},
        //   }],
        // },
        {
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAND_TABLE_MODEL,
          data: arModel,
        },
      // {
      //   title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_EFFECT,
      //   data: [{
      //     key: ConstToolType.SM_AR_DRAWING_POINT,
      //     image: getThemeAssets().toolbar.icon_toolbar_savespot,
      //     // selectedImage: any,
      //     title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAVE_POINT,
      //     action: data => {},
      //   }, {
      //     key: ConstToolType.SM_AR_DRAWING_LINE,
      //     image: getThemeAssets().toolbar.icon_toolbar_saveline,
      //     // selectedImage: any,
      //     title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAVE_LINE,
      //     action: data => {},
      //   }, {
      //     key: ConstToolType.SM_AR_DRAWING_REGION,
      //     image: getThemeAssets().toolbar.icon_toolbar_region,
      //     // selectedImage: any,
      //     title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAVE_AEREA,
      //     action: data => {},
      //   }, {
      //     key: ConstToolType.SM_AR_DRAWING_SUBSTANCE,
      //     image: getThemeAssets().ar.functiontoolbar.icon_ar_volume_select,
      //     // selectedImage: any,
      //     title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAVE_SUBSTANCE,
      //     action: data => {},
      //   }],
      // }
      ]
      break
    }
    case ConstToolType.SM_AR_DRAWING_IMAGE:
    case ConstToolType.SM_AR_DRAWING_VIDEO:
    case ConstToolType.SM_AR_DRAWING_WEB:
    case ConstToolType.SM_AR_DRAWING_SCENE:
    case ConstToolType.SM_AR_DRAWING_MODAL:
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        {
          type: ToolbarBtnType.ANALYST,
          image: require('../../../../../../assets/mapTools/icon_point_black.png'),
          // title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_ADD_TO_CURRENT_POSITION,
          action: () => {
            if (type === ConstToolType.SM_AR_DRAWING_SCENE) {
              ARDrawingAction.addARScene()
            } else if (type === ConstToolType.SM_AR_DRAWING_MODAL) {
              ARDrawingAction.addARModel()
            } else {
              let _type
              if (type === ConstToolType.SM_AR_DRAWING_VIDEO) {
                _type = ARElementType.AR_VIDEO
              } else if (type === ConstToolType.SM_AR_DRAWING_WEB) {
                _type = ARElementType.AR_WEBVIEW
              } else {
                _type = ARElementType.AR_IMAGE
              }
  
              ARDrawingAction.addMedia(_type)
            }
          },
        },
        // {
        //   type: ToolbarBtnType.ANALYST,
        //   image: getThemeAssets().mapTools.icon_tool_click,
        //   // title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_ADD_TO_PLANE,
        //   action: () => {

        //   },
        // },
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.SM_AR_DRAWING_EDIT:
      data = [
        {
          key: 'edit',
          image: getThemeAssets().ar.toolbar.icon_ar_edit,
          // selectedImage: any,
          title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT,
          action: () => {
            params.setToolbarVisible(true, ConstToolType.SM_AR_DRAWING_EDIT, {
              isFullScreen: true,
              showMenuDialog: true,
            })
          },
        },
        // {
        //   key: 'undo',
        //   image: getThemeAssets().toolbar.icon_toolbar_undo,
        //   // selectedImage: any,
        //   title: getLanguage(GLOBAL.language).Prompt.UNDO,
        //   action: data => {},
        // },
        // // {
        // //   key: ConstToolType.SM_AR_DRAWING_REGION,
        // //   image: getThemeAssets().toolbar.icon_toolbar_region,
        // //   // selectedImage: any,
        // //   title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAVE_AEREA,
        // //   action: data => {},
        // // },
        // {
        //   key: 'delete',
        //   image: getThemeAssets().edit.icon_delete,
        //   // selectedImage: any,
        //   title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT_DELETE,
        //   action: data => {},
        // },
      ]
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        {
          key: 'addAtCurrent',
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_ADD_TO_CURRENT_POSITION,
          image: require('../../../../../../assets/mapTools/icon_point_black.png'),
          action: ARDrawingAction.addAtCurrent,
        },
        {
          key: 'addAtPlane',
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_ADD_TO_PLANE,
          image: getThemeAssets().mapTools.icon_tool_click,
          action: ARDrawingAction.addAtPoint,
        },
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.SM_AR_DRAWING_STYLE: {
      const _data = await getLayerStyleData(type)
      if (_data) {
        data = _data.data
        buttons = _data.buttons
      }
      break
    }
    case ConstToolType.SM_AR_DRAWING_STYLE_BORDER_COLOR:
      data = color.colors
      break
    case ConstToolType.SM_AR_DRAWING_STYLE_ROTATION:
    case ConstToolType.SM_AR_DRAWING_STYLE_POSITION:
    case ConstToolType.SM_AR_DRAWING_VISIBLE_DISTANCE:{
      const _data = await getStyleData(type)
      if (_data) {
        data = _data.data
        buttons = _data.buttons
      }
      break
    }
  }
  return { data, buttons }
}

/** 获取三维数据 */
async function get3DData() {
  const _params: any = ToolbarModule.getParams()
  const data3DTemp: any[] = await DataHandler.getLocalData(_params.user.currentUser, 'WORKSPACE3D')
  const data3D: any[] = []
  for (let item of data3DTemp) {
    data3D.push({
      key: item.name,
      image: require('../../../../../../assets/mapTools/icon_scene.png'),
      // selectedImage: any,
      title: item.name,
      data: item,
      action: () => ARDrawingAction.ar3D(item.path),
    })
  }
  return data3D
}

/** 获取AR模型数据 */
async function getARModel() {
  const _params: any = ToolbarModule.getParams()
  const arModelTemp: any[] = await DataHandler.getLocalData(_params.user.currentUser, 'ARMODEL')
  const arModel: any[] = []
  for (let item of arModelTemp) {
    arModel.push({
      key: item.name,
      image: getThemeAssets().ar.armap.ar_3d,
      // selectedImage: any,
      title: item.name,
      data: item,
      action: () => ARDrawingAction.arModel(item.path),
    })
  }
  return arModel
}

interface HeaderRightButton {
  action: () => void,
  image: any,
  key: string,
}

interface HeaderDataType {
  backAction?: () => void,
  backImg?: any,
  title?: string,
  headerRight?: HeaderRightButton[],
  headerTitleViewStyle?: ViewStyle,
}

function getHeaderData() {
  const data: HeaderDataType = {}
  data.headerRight = [
    {
      key: 'manage_layer',
      action: () => {
        NavigationService.navigate('ARLayerManager')
      },
      image: getThemeAssets().nav.icon_nav_managelayer,
    },
    // {
    //   key: 'setting',
    //   action: () => {
    //     NavigationService.navigate('ARMapSetting')
    //   },
    //   image: getThemeAssets().nav.icon_nav_setting,
    // },
  ]
  data.title = getLanguage(GLOBAL.language).ARMap.ARDRAWING
  data.headerTitleViewStyle = {
    justifyContent: 'flex-start',
    marginLeft: scaleSize(90),
    borderBottomWidth: 0,
  }
  return data
}

/**
 * 显示滑动条组件
 * @param type
 * @param language
 * @param params Toolbar setVisible中的params
 */
async function showSlideToolbar(type: string, language: string, params: any) {
  let _data: { buttons: string[]; data: any[] } | undefined
  switch (type) {
    case ConstToolType.SM_AR_DRAWING_STYLE:
    case ConstToolType.SM_AR_DRAWING_STYLE_BORDER_WIDTH:
    case ConstToolType.SM_AR_DRAWING_STYLE_TRANSFROM:
    case ConstToolType.SM_AR_DRAWING_STYLE_BORDER_COLOR:
      _data = await getLayerStyleData(type)
      break
    default:
      _data = await getStyleData(type)
  }
  GLOBAL.toolBox &&
  GLOBAL.toolBox.setVisible(true, type, {
    isFullScreen: false,
    showMenuDialog: false,
    buttons: [
      ToolbarBtnType.TOOLBAR_BACK,
      ToolbarBtnType.MENU,
      ToolbarBtnType.MENU_FLEX,
      ToolbarBtnType.TOOLBAR_COMMIT,
    ],
    customView: () => {
      return (
        <ToolBarSlide
          data={{
            title: params.selectName || '',
            data: _data?.data || [],
          }}
        />
      )
    },
    ...params,
  })
}

const ARStyleItems = (language: string) => {
  return [
    {
      key: getLanguage(language).ARMap.SCALE,
      action: () => {
        showSlideToolbar(ConstToolType.SM_AR_DRAWING_STYLE_SCALE, language, {
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
        showSlideToolbar(ConstToolType.SM_AR_DRAWING_STYLE_POSITION, language, {
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
        showSlideToolbar(ConstToolType.SM_AR_DRAWING_STYLE_ROTATION, language, {
          selectName: getLanguage(language).ARMap.ROTATION,
          selectKey: getLanguage(language).ARMap.ROTATION,
          // isTouchProgress: true,
        })
      },
      selectKey: getLanguage(language).ARMap.ROTATION,
    },
  ]
}

const ARLayerStyleItems = (language: string) => {
  return [
    {
      key: getLanguage(language).Map_Main_Menu.STYLE_TRANSPARENCY,
      action: () => {
        showSlideToolbar(ConstToolType.SM_AR_DRAWING_STYLE_TRANSFROM, language, {
          selectName: getLanguage(language).Map_Main_Menu.STYLE_TRANSPARENCY,
          selectKey: getLanguage(language).Map_Main_Menu.STYLE_TRANSPARENCY,
          // isTouchProgress: true,
        })
      },
      selectKey: getLanguage(language).Map_Main_Menu.STYLE_TRANSPARENCY,
    },
    {
      key: getLanguage(language).Map_Main_Menu.STYLE_FRAME_COLOR,
      action: () => {
        GLOBAL.toolBox && GLOBAL.toolBox.menu({
          type: ConstToolType.SM_AR_DRAWING_STYLE_BORDER_COLOR,
          selectKey: getLanguage(language).Map_Main_Menu.STYLE_FRAME_COLOR,
        })
        showSlideToolbar(ConstToolType.SM_AR_DRAWING_STYLE_BORDER_COLOR, language, {
          containerType: ToolbarType.colorTable,
          selectName: getLanguage(language).Map_Main_Menu.STYLE_FRAME_COLOR,
          selectKey: getLanguage(language).Map_Main_Menu.STYLE_FRAME_COLOR,
          customView: null,
        })
      },
      selectKey: getLanguage(language).Map_Main_Menu.STYLE_FRAME_COLOR,
    },
    {
      key: getLanguage(language).Map_Main_Menu.STYLE_BORDER_WIDTH,
      action: () => {
        showSlideToolbar(ConstToolType.SM_AR_DRAWING_STYLE_BORDER_WIDTH, language, {
          selectName: getLanguage(language).Map_Main_Menu.STYLE_BORDER_WIDTH,
          selectKey: getLanguage(language).Map_Main_Menu.STYLE_BORDER_WIDTH,
          // isTouchProgress: true,
        })
      },
      selectKey: getLanguage(language).Map_Main_Menu.STYLE_BORDER_WIDTH,
    },
  ]
}

function getMenuData() {
  const _params: any = ToolbarModule.getParams()
  const _data: any = ToolbarModule.getData()

  let data: { key: string; action: () => void; selectKey: string }[] = []

  switch (_params.type) {
    case ConstToolType.SM_AR_DRAWING_STYLE:
    case ConstToolType.SM_AR_DRAWING_STYLE_BORDER_WIDTH:
    case ConstToolType.SM_AR_DRAWING_STYLE_TRANSFROM:
    case ConstToolType.SM_AR_DRAWING_STYLE_BORDER_COLOR:
      data = ARLayerStyleItems(_params.language)
      break
    default:
      if (_data.selectARElement) {
        switch (_data.selectARElement.type) {
          case ARElementType.AR_IMAGE:
          case ARElementType.AR_VIDEO:
          case ARElementType.AR_WEBVIEW:
          case ARElementType.AR_TEXT:
          case ARElementType.AR_MODEL:
            data = ARStyleItems(_params.language)
            break
        }
      }
      break
  }
  return data
}

/** AR变换信息 */
export interface IARTransform {
  type: 'position' | 'rotation' | 'scale',
  id: number,
  layerName: string,
  positionX: number,
  positionY: number,
  positionZ: number,
  scale: number,
  rotationX: number,
  rotationY: number,
  rotationZ: number,
}
async function getStyleData(type: string) {
  const _data: any = ToolbarModule.getData()
  const element = _data.selectARElement
  if(!element)  {
    Toast.show('未选中对象！')
    return
  }
  SARMap.clearSelection()
  // SARMap.appointEditElement(element.id, element.layerName)

  // option.bottomData = poiEditBottom

  const range = {
    scale: [0 , 200],
    position: [-100, 100],
    rotation: [-180, 180],
  }

  let transformData: IARTransform = {
    layerName: element.layerName,
    id: element.id,
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
    _data?.transformData.layerName === element.layerName &&
    _data?.transformData.id === element.id
  ) {
    Object.assign(transformData, _data.transformData)
  }
  const buttons = [ToolbarBtnType.TOOLBAR_BACK, ToolbarBtnType.TOOLBAR_COMMIT]
  let data: any[] = []
  switch(type) {
    case ConstToolType.SM_AR_DRAWING_STYLE_ROTATION:
      data = [
        {
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
      break
    case ConstToolType.SM_AR_DRAWING_STYLE_POSITION:
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
      break
    case ConstToolType.SM_AR_DRAWING_VISIBLE_DISTANCE:
      data = []
      break
    case ConstToolType.SM_AR_DRAWING_STYLE_SCALE: {
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
      break
    }
  }
  return {
    buttons,
    data,
  }
}

/**
 * AR图层风格
 * @param type
 * @returns
 */
async function getLayerStyleData(type: string) {
  const _params: any = ToolbarModule.getParams()
  const layer = _params.arlayer.currentLayer
  if(!_params.arlayer.currentLayer)  {
    Toast.show('未选中对象！')
    return
  }
  SARMap.clearSelection()

  const range = {
    borderWidth: [0 , 200],
  }
  const buttons = [ToolbarBtnType.TOOLBAR_BACK, ToolbarBtnType.TOOLBAR_COMMIT]
  let data: any[] = []
  switch(type) {
    case ConstToolType.SM_AR_DRAWING_STYLE_BORDER_WIDTH: {
      const borderWidth = await SARMap.getLayerBorderWidth(layer.name)
      data = [{
        key: 'borderWidth',
        leftImage: getThemeAssets().ar.armap.ar_border_width,
        unit: 'mm',
        onMove: (loc: number) => {
          SARMap.setLayerBorderWidth(layer.name, loc)
        },
        defaultValue: borderWidth,
        range: range.borderWidth,
      }]
      break
    }
    case ConstToolType.SM_AR_DRAWING_STYLE_TRANSFROM: {
      const opacity = await SARMap.getLayerOpacity(layer.name)
      data = [{
        key: 'transfrom',
        leftImage: getThemeAssets().ar.armap.ar_opacity,
        unit: '%',
        range: [0,100],
        onMove: (loc: number) => {
          if(layer.name) {
            SARMap.setLayerOpacity(layer.name, loc / 100)
          }
        },
        defaultValue: parseInt((opacity * 100).toFixed()),
      }]
      break
    }
  }
  return {
    buttons,
    data,
  }
}

export default {
  getData,
  getHeaderData,
  getMenuData,
}
