import { ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets, getARSceneAssets } from '../../../../../../assets'
import ToolbarModule from '../ToolbarModule'
import ARDrawingAction from './ARDrawingAction'
import ToolbarBtnType from '../../ToolbarBtnType'
import { SARMap } from 'imobile_for_reactnative'
import DataHandler from '../../../../../tabs/Mine/DataHandler'
import { Platform } from 'react-native'

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
  let buttons: any[] = [ToolbarBtnType.TOOLBAR_BACK, ToolbarBtnType.TOOLBAR_COMMIT]
  if (type === ConstToolType.SM_AR_DRAWING) {
    buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.TOOLBAR_COMMIT]
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
      const arEffect = await getAREffect()
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
          title: getLanguage(GLOBAL.language).ARMap.THREE_D,
          containerType: 'list',
          data: data3D,
        },
        {
          title: getLanguage(GLOBAL.language).ARMap.VECTOR,
          data: [
            // {
            //   key: ConstToolType.SM_AR_DRAWING_POINT,
            //   image: getThemeAssets().toolbar.icon_toolbar_savespot,
            //   // selectedImage: any,
            //   title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAVE_POINT,
            //   action: data => {},
            // },
            // {
            //   key: ConstToolType.SM_AR_DRAWING_LINE,
            //   image: getThemeAssets().toolbar.icon_toolbar_saveline,
            //   // selectedImage: any,
            //   title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAVE_LINE,
            //   action: data => {},
            // },
            // {
            //   key: ConstToolType.SM_AR_DRAWING_REGION,
            //   image: getThemeAssets().toolbar.icon_toolbar_region,
            //   // selectedImage: any,
            //   title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAVE_AEREA,
            //   action: data => {},
            // },
            // {
            //   key: ConstToolType.SM_AR_DRAWING_SUBSTANCE,
            //   image: getThemeAssets().ar.functiontoolbar.icon_ar_volume_select,
            //   // selectedImage: any,
            //   title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAVE_SUBSTANCE,
            //   action: data => {},
            // },
            {
              key: ConstToolType.SM_AR_DRAWING_TEXT,
              image: getThemeAssets().layerType.layer_text,
              // selectedImage: any,
              title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAVE_TEXT,
              action: ARDrawingAction.arText,
            },
          ],
        },
        {
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAND_TABLE_MODEL,
          data: arModel,
        },
        {
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_EFFECT,
          data: arEffect,
        },
      ]
      if (Platform.OS === 'ios') {
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
            title: getLanguage(GLOBAL.language).ARMap.VECTOR,
            data: [
              {
                key: ConstToolType.SM_AR_DRAWING_TEXT,
                image: getThemeAssets().layerType.layer_text,
                // selectedImage: any,
                title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAVE_TEXT,
                action: ARDrawingAction.arText,
              },
            ],
          },
          {
            title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_EFFECT,
            data: arEffect,
          },
        ]
      }
      break
    }
    case ConstToolType.SM_AR_DRAWING_IMAGE:
    case ConstToolType.SM_AR_DRAWING_VIDEO:
    case ConstToolType.SM_AR_DRAWING_WEB:
    case ConstToolType.SM_AR_DRAWING_TEXT:
    case ConstToolType.SM_AR_DRAWING_SCENE:
    case ConstToolType.SM_AR_DRAWING_MODAL:
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        {
          type: 'ADD_LOCATION',
          image: getThemeAssets().ar.armap.ar_add_location,
          action: () => ARDrawingAction.addAtCurrent(type),
        },
        {
          type: 'ADD_POINT',
          image: getThemeAssets().ar.armap.ar_add_point,
          action: () => ARDrawingAction.addAtPoint(type),
        },
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.SM_AR_DRAWING_ADD_POINT:
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        {
          type: ToolbarBtnType.TOOLBAR_COMMIT,
          // image: getThemeAssets().ar.armap.ar_add_point,
          action: async () => {
            const translation = await SARMap.getCurrentCenterHitPoint()
            const _data: any = ToolbarModule.getData()
            if(translation && _data.prevType) {
              ARDrawingAction.addAtCurrent(_data.prevType, translation)
            }
          },
        },
      ]
      break
  }
  return { data, buttons }
}

/** 获取三维数据 */
async function get3DData() {
  const _params: any = ToolbarModule.getParams()
  const data3DTemp: any[] = await DataHandler.getLocalData(_params.user.currentUser, 'WORKSPACE3D')
  return data3DTemp.filter(item => item.Type !== undefined).map(item => {
    return {
      key: item.name,
      image: getARSceneAssets(item.Type),
      title: item.name.substring(0, item.name.lastIndexOf('.')),
      data: item,
      action: () => ARDrawingAction.ar3D(item.path),
    }
  })
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

/** 获取AR特效数据 */
async function getAREffect() {
  const _params: any = ToolbarModule.getParams()
  const arEffectTemp: any[] = await DataHandler.getLocalData(_params.user.currentUser, 'AREFFECT')
  const arEffect: any[] = []
  for (let item of arEffectTemp) {
    arEffect.push({
      key: item.name,
      image: getThemeAssets().ar.armap.ar_effect,
      // selectedImage: any,
      title: item.name,
      data: item,
      action: () => ARDrawingAction.addAREffect(item.name, item.path),
    })
  }
  return arEffect
}


export default {
  getData,

  getAREffect,
}
