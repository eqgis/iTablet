import React from 'react'
import { ConstToolType } from '../../../../../../constants'
import { Toast } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import ToolbarModule from '../ToolbarModule'
import ToolbarBtnType from '../../ToolbarBtnType'
import ToolBarSlide from '../../components/ToolBarSlide'
import { ARElementType, SARMap, ARAction, ARLayerType } from 'imobile_for_reactnative'

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
  if (type === ConstToolType.SM_AR_EDIT) {
    buttons = [ToolbarBtnType.PLACEHOLDER, ToolbarBtnType.TOOLBAR_COMMIT]
  } else {
    buttons = [ToolbarBtnType.TOOLBAR_BACK, ToolbarBtnType.TOOLBAR_COMMIT]
  }
  let customView: (() => React.ReactElement) | undefined = undefined
  switch (type) {
    case ConstToolType.SM_AR_EDIT:
      data = [
        // {
        //   key: 'edit',
        //   image: getThemeAssets().ar.toolbar.icon_ar_edit,
        //   // selectedImage: any,
        //   title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT,
        //   action: () => {
        //     params.setToolbarVisible(true, ConstToolType.SM_AR_EDIT, {
        //       isFullScreen: true,
        //       showMenuDialog: true,
        //     })
        //   },
        // },
        // {
        //   key: 'undo',
        //   image: getThemeAssets().toolbar.icon_toolbar_undo,
        //   // selectedImage: any,
        //   title: getLanguage(GLOBAL.language).Prompt.UNDO,
        //   action: data => {},
        // },
        // // {
        // //   key: ConstToolType.SM_AR_REGION,
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
      // buttons = [
      //   ToolbarBtnType.TOOLBAR_BACK,
      //   {
      //     key: 'addAtCurrent',
      //     title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_ADD_TO_CURRENT_POSITION,
      //     image: require('../../../../../../assets/mapTools/icon_point_black.png'),
      //     action: ARDrawingAction.addAtCurrent,
      //   },
      //   {
      //     key: 'addAtPlane',
      //     title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_ADD_TO_PLANE,
      //     image: getThemeAssets().mapTools.icon_tool_click,
      //     action: ARDrawingAction.addAtPoint,
      //   },
      //   ToolbarBtnType.TOOLBAR_COMMIT,
      // ]
      break
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
  }
  return { data, buttons, customView: customView }
}

/**
 * 显示滑动条组件
 * @param type
 * @param language
 * @param params Toolbar setVisible中的params
 */
async function showSlideToolbar(type: string, language: string, params: any) {
  let _data: { buttons: string[]; data: any[] } | undefined
  // switch (type) {
  //   case ConstToolType.SM_AR_STYLE:
  //   case ConstToolType.SM_AR_STYLE_BORDER_WIDTH:
  //   case ConstToolType.SM_AR_STYLE_TRANSFROM:
  //   case ConstToolType.SM_AR_STYLE_BORDER_COLOR:
  //     _data = await getLayerStyleData(type)
  //     break
  //   default:
  //     _data = await getStyleData(type)
  // }
  _data = await getStyleData(type)
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
}

function getMenuData() {
  const _params: any = ToolbarModule.getParams()
  const _data: any = ToolbarModule.getData()

  let data: { key: string; action: () => void; selectKey: string }[] = []

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
  } else {
    if (_params.arlayer.currentLayer.type === ARLayerType.AR_SCENE_LAYER) {
      data = ARStyleItems(_params.language)
    }
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
  const _params: any = ToolbarModule.getParams()
  const element = _data.selectARElement
  const currentLayer = _params.arlayer.currentLayer

  if(!element && currentLayer?.type !== ARLayerType.AR_SCENE_LAYER)  {
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
  const buttons = [
    ToolbarBtnType.TOOLBAR_BACK,
    ToolbarBtnType.MENU,
    ToolbarBtnType.MENU_FLEX,
    ToolbarBtnType.TOOLBAR_COMMIT,
  ]
  let data: any[] = []
  switch(type) {
    case ConstToolType.SM_AR_EDIT_ROTATION:
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
  getMenuData,
}
