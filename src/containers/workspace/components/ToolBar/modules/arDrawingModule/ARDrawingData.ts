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
import { dataUtil, DialogUtils } from '../../../../../../utils'
import NavigationService from '../../../../../NavigationService'

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
  data?: SectionItemData[],
  getData?: () => Promise<SectionItemData[]>,
  /** 点击切换标签事件 */
  onPress?: (index: number) => void,
}

async function getData(type: string, params: {[name: string]: any}) {
  ToolbarModule.setParams(params)
  ToolbarModule.addData({moduleIndex: 0})
  let data: SectionData[] | SectionItemData[] | string[] = []
  let buttons: any[] = [ToolbarBtnType.TOOLBAR_BACK, ToolbarBtnType.TOOLBAR_COMMIT]
  if (type === ConstToolType.SM_AR_DRAWING) {
    // buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.TOOLBAR_COMMIT]
    buttons = [
      ToolbarBtnType.CANCEL,
      {
        type: 'TO_AR_LAYER_MANAGER',
        image: getThemeAssets().tabBar.tab_layer,
        action: () => {
          // 获取当前所属的tab索引值
          let tabType = ToolbarModule.getData()?.moduleIndex?.toString()
          // 跳转到图层管理页面
          NavigationService.navigate("ARLayerManager", {
            tabType: tabType,
          })
        },
      },
      ToolbarBtnType.TOOLBAR_COMMIT,
    ]
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
          title: getLanguage(global.language).Prompt.POI,
          data: [{
            key: ConstToolType.SM_AR_DRAWING_IMAGE,
            image: getThemeAssets().ar.functiontoolbar.ar_picture,
            title: getLanguage(global.language).Map_Main_Menu.MAP_AR_IMAGE,
            action: ARDrawingAction.arImage,
          }, {
            key: ConstToolType.SM_AR_DRAWING_VIDEO,
            image: getThemeAssets().ar.functiontoolbar.ar_video,
            title: getLanguage(global.language).Map_Main_Menu.MAP_AR_VIDEO,
            action: ARDrawingAction.arVideo,
          }, {
            key: ConstToolType.SM_AR_DRAWING_WEB,
            image: getThemeAssets().ar.functiontoolbar.ar_webpage,
            title: getLanguage(global.language).Map_Main_Menu.MAP_AR_WEBVIEW,
            action: ARDrawingAction.arWebView,
          }],
          onPress: () => {
            // 点击tab后将索引值同步
            ToolbarModule.addData({moduleIndex: 0})
            // 转到非特效tab里视为特效图层已经添加完成
            global.isNotEndAddEffect = false
          },
        },
        {
          title: getLanguage(global.language).ARMap.VECTOR,
          data: [
            // {
            //   key: ConstToolType.SM_AR_DRAWING_POINT,
            //   image: getThemeAssets().toolbar.icon_toolbar_savespot,
            //   // selectedImage: any,
            //   title: getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAVE_POINT,
            //   action: data => {},
            // },
            // {
            //   key: ConstToolType.SM_AR_DRAWING_LINE,
            //   image: getThemeAssets().toolbar.icon_toolbar_saveline,
            //   // selectedImage: any,
            //   title: getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAVE_LINE,
            //   action: data => {},
            // },
            // {
            //   key: ConstToolType.SM_AR_DRAWING_REGION,
            //   image: getThemeAssets().toolbar.icon_toolbar_region,
            //   // selectedImage: any,
            //   title: getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAVE_AEREA,
            //   action: data => {},
            // },
            // {
            //   key: ConstToolType.SM_AR_DRAWING_SUBSTANCE,
            //   image: getThemeAssets().ar.functiontoolbar.icon_ar_volume_select,
            //   // selectedImage: any,
            //   title: getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAVE_SUBSTANCE,
            //   action: data => {},
            // },
            {
              key: ConstToolType.SM_AR_DRAWING_TEXT,
              image: getThemeAssets().layerType.layer_text,
              // selectedImage: any,
              title: getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAVE_TEXT,
              action: ARDrawingAction.arText,
            },
          ],
          onPress: () => {
            // 点击tab后将索引值同步
            ToolbarModule.addData({moduleIndex: 1})
            // 转到非特效tab里视为特效图层已经添加完成
            global.isNotEndAddEffect = false
          },
        },
        {
          title: getLanguage(global.language).ARMap.THREE_D,
          containerType: 'list',
          onPress: () => {
            // 点击tab后将索引值同步
            ToolbarModule.addData({moduleIndex: 2})
            // 转到非特效tab里视为特效图层已经添加完成
            global.isNotEndAddEffect = false
          },
          getData: get3DData,
        },
        {
          title: getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAND_TABLE_MODEL,
          onPress: () => {
            // 点击tab后将索引值同步
            ToolbarModule.addData({moduleIndex: 3})
            // 转到非特效tab里视为特效图层已经添加完成
            global.isNotEndAddEffect = false
          },
          getData: getARModel,
        },
        {
          title: getLanguage(global.language).Map_Main_Menu.MAP_AR_EFFECT,
          onPress: () => {
            // 点击tab后将索引值同步
            ToolbarModule.addData({moduleIndex: 4})
          },
          getData: getAREffect,
        },
      ]
      if (Platform.OS === 'ios') {
        data.splice(3, 1)
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
          image: getThemeAssets().ar.armap.icon_add_to,
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
  const items: any[] = [{
    key: 'open_online',
    image: require('../../../../../../assets/Mine/mine_my_import_online_light.png'),
    title: getLanguage().Profile.ONLINE,
    action: () => {
      DialogUtils.showInputDailog({
        title: getLanguage().Profile.ENTER_SERVER_ADDRESS,
        placeholder: 'http://',
        checkSpell: dataUtil.checkOnline3DServiceUrl,
        confirmAction: url => {
          DialogUtils.hideInputDailog()
          if(url.indexOf('http') !== 0) {
            url = 'http://' + url
          }
          ARDrawingAction.ar3D(url)
        },
      })
    },
  }]
  const downloadKeys = [AR3DExample.userName + '_' + AR3DExample.downloadName]
  //检查用户是否已有数据，没有则添加下载选项
  if(data3DTemp.filter(item => item.Type !== undefined).length === 0) {
    items.push({
      key: 'download',
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
  const downloadKeys: string[] = []
  for (const item of ARModelExample) {
    if(arModelTemp.findIndex(item2 => item2.name.replace('.glb', '') === item.downloadName.replace('.zip', '')) < 0) {
      downloadKeys.push(item.userName + '_' + item.downloadName)
    }
  }
  if(downloadKeys.length > 0) {
    items.push({
      key: 'download',
      image: getPublicAssets().common.icon_download,
      title: getLanguage(_params.language).Prompt.DOWNLOAD,
      action: () => ARDrawingAction.downloadModelExample(downloadKeys),
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
      key: 'download',
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
