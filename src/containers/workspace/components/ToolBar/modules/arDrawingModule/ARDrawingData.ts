import { ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets, getARSceneAssets, getPublicAssets } from '../../../../../../assets'
import ToolbarModule from '../ToolbarModule'
import ARDrawingAction from './ARDrawingAction'
import ToolbarBtnType from '../../ToolbarBtnType'
import { SARMap ,ARAction} from 'imobile_for_reactnative'
import DataHandler from '../../../../../tabs/Mine/DataHandler'
import { Platform } from 'react-native'
import { AR3DExample, ARModelExample, AREffectExample, AREffectExample2, AREffectExample3, AREffectExample4 } from '../../../../../tabs/Mine/DataHandler/DataExample'

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
  data?: SectionItemData[],
  getData?: () => Promise<SectionItemData[]>,
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
      SARMap.setAction(ARAction.NULL)
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
          getData: get3DData,
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
          getData: getARModel,
        },
        {
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_EFFECT,
          getData: getAREffect,
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
                title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAVE_TEXT,
                action: ARDrawingAction.arText,
              },
            ],
          },
          {
            title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_EFFECT,
            getData: getAREffect,
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
          type: 'ADD_POINT',
          image: getThemeAssets().ar.armap.ar_add_point,
          action: async () => {
            const translation = await SARMap.getCurrentCenterHitPoint()
            const _data: any = ToolbarModule.getData()
            if(translation && _data.prevType) {
              ARDrawingAction.addAtCurrent(_data.prevType, translation)
            }
          },
        },
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
  }
  return { data, buttons }
}

/** 获取三维数据 */
async function get3DData() {
  const _params: any = ToolbarModule.getParams()
  const data3DTemp: any[] = await DataHandler.getLocalData(_params.user.currentUser, 'WORKSPACE3D')
  const items: any[] = []
  const downloadKeys = [AR3DExample.userName + '_' + AR3DExample.downloadName]
  //检查用户是否已有数据，没有则添加下载选项
  if(data3DTemp.filter(item => item.Type !== undefined).length === 0) {
    items.push({
      key: AR3DExample.downloadName,
      image: getPublicAssets().common.icon_download,
      title: getLanguage(_params.language).Prompt.DOWNLOAD,
      action: ARDrawingAction.download3DExample,
      downloadKeys,
    })
  }
  return items.concat(data3DTemp.filter(item => item.Type !== undefined).map(item => {
    return {
      key: item.name,
      image: getARSceneAssets(item.Type),
      title: item.name.substring(0, item.name.lastIndexOf('.')),
      data: item,
      action: () => ARDrawingAction.ar3D(item.path),
    }
  }))
}

/** 获取AR模型数据 */
async function getARModel() {
  const _params: any = ToolbarModule.getParams()
  const arModelTemp: any[] = await DataHandler.getLocalData(_params.user.currentUser, 'ARMODEL')
  const items: any[] = []
  const downloadKeys = [ARModelExample.userName + '_' + ARModelExample.downloadName]
  if(arModelTemp.length === 0) {
    items.push({
      key: AR3DExample.downloadName,
      image: getPublicAssets().common.icon_download,
      title: getLanguage(_params.language).Prompt.DOWNLOAD,
      action: ARDrawingAction.downloadModelExample,
      downloadKeys,
    })
  }
  return items.concat(arModelTemp.map(item => {
    return {
      key: item.name,
      image: getThemeAssets().ar.armap.ar_3d,
      title: item.name.substring(0, item.name.lastIndexOf('.')),
      data: item,
      action: () => ARDrawingAction.arModel(item.path),
    }
  }))
}

/** 获取AR特效数据 */
async function getAREffect() {
  const _params: any = ToolbarModule.getParams()
  const arEffectTemp: any[] = await DataHandler.getLocalData(_params.user.currentUser, 'AREFFECT')
  arEffectTemp.sort((a: any, b: any) => {
    if (a.name > b.name) {
      return 1
    } else if (a.name < b.name) {
      return -1
    } else {
      return 0
    }
  })
  const downloadKeys: string[] = []
  const items: any[] = []
  if(arEffectTemp.findIndex(item => item.name === AREffectExample.toName) < 0) {
    downloadKeys.push(AREffectExample.userName + '_' + AREffectExample.downloadName)
  }
  if(arEffectTemp.findIndex(item => item.name === AREffectExample2.toName) < 0) {
    downloadKeys.push(AREffectExample2.userName + '_' + AREffectExample2.downloadName)
  }
  if(arEffectTemp.findIndex(item => item.name === AREffectExample3.toName) < 0) {
    downloadKeys.push(AREffectExample3.userName + '_' + AREffectExample3.downloadName)
  }
  if(arEffectTemp.findIndex(item => item.name === AREffectExample4.toName) < 0) {
    downloadKeys.push(AREffectExample4.userName + '_' + AREffectExample4.downloadName)
  }
  if(downloadKeys.length > 0) {
    items.push({
      key: AR3DExample.downloadName,
      image: getPublicAssets().common.icon_download,
      title: getLanguage(_params.language).Prompt.DOWNLOAD,
      action: () => ARDrawingAction.downloadEffectlExample(downloadKeys),
      downloadKeys,
    })
  }
  return items.concat(arEffectTemp.map(item => {
    return {
      key: item.name,
      image: getThemeAssets().ar.armap.ar_effect,
      title: item.name.substring(0, item.name.lastIndexOf('.')),
      data: item,
      action: () => ARDrawingAction.addAREffect(item.name, item.path),
    }
  }))
}

export default {
  getData,

  getAREffect,
}
