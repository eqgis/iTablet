import { ConstToolType ,ConstPath, Const} from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets, getARSceneAssets, getPublicAssets, getImage } from '../../../../../../assets'
import ToolbarModule from '../ToolbarModule'
import ARDrawingAction from './ARDrawingAction'
import ToolbarBtnType from '../../ToolbarBtnType'
import { SARMap ,ARAction} from 'imobile_for_reactnative'
import DataHandler from '../../../../../../utils/DataHandler'
import { Platform } from 'react-native'
import { AR3DExample, ARModelExample, AREffectExample, AREffectExample2, AREffectExample3, AREffectExample4 } from '../../../../../../utils/DataHandler/DataExample'
import { dataUtil, DialogUtils ,AppToolBar,AppUser} from '../../../../../../utils'
import NavigationService from '../../../../../NavigationService'
import { FileTools } from '@/native'

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
  // ToolbarModule.addData({moduleIndex: 0})
  ToolbarModule.addData({moduleKey: 'POI'})
  const data: (SectionData | SectionItemData | string)[] = []
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
          // let tabType = ToolbarModule.getData()?.moduleIndex?.toString()
          const tabType = ToolbarModule.getData()?.moduleKey
          // 跳转到图层管理页面
          NavigationService.navigate("ARLayerManager", {
            tabType: tabType,
          })
        },
      },
      ToolbarBtnType.TOOLBAR_COMMIT,
    ]
  } else {
    buttons = [ToolbarBtnType.TOOLBAR_BACK,ToolbarBtnType.TOOLBAR_COMMIT]
  }
  switch (type) {
    case ConstToolType.SM_AR_DRAWING:
    case ConstToolType.SM_AR_DRAWING_POI:
    case ConstToolType.SM_AR_DRAWING_MODEL:
    case ConstToolType.SM_AR_DRAWING_3D:
    case ConstToolType.SM_AR_DRAWING_VECTOR:
    case ConstToolType.SM_AR_DRAWING_EFFECT: {
      SARMap.setAction(ARAction.NULL)
      const poiData = {
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
          // ToolbarModule.addData({moduleIndex: 0})
          ToolbarModule.addData({moduleKey: Const.POI})
          // 转到非特效tab里视为特效图层已经添加完成
          global.isNotEndAddEffect = false
        },
      }

      const vectorData =  {
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
          {
            key: ConstToolType.SM_AR_DRAWING_BUBBLE_TEXT,
            image: getImage().bubble_text,
            // selectedImage: any,
            title: getLanguage().BUBBLE_TEXT,
            action: ARDrawingAction.arBubbleText,
          },
          {
            key: 'SM_AR_DRAWING_LINE',
            image: getThemeAssets().ar.point_line,
            title: getLanguage().LINE,
            action: () => {
              // 切换到添加矢量线的工具栏
              // AppToolBar.show('ARMAP', 'AR_MAP_ADD_LINE')
              const _params: any = ToolbarModule.getParams()
              _params.setToolbarVisible(true, ConstToolType.SM_AR_DRAWING_ADD_LINE, {
                isFullScreen: false,
              })
            }
          },
          {
            key: 'SM_AR_DRAWING_MARKER_LINE',
            image: getThemeAssets().ar.marker_line,
            title: getLanguage().MARKER_LINE,
            action: async () => {
              const homePath = await FileTools.getHomeDirectory()
              // 获取当前用户的用户名
              const userName = AppUser.getCurrentUser().userName
              // 拼接AR符号库的文件夹路径
              const arSymbolFilePath = homePath + ConstPath.UserPath + userName + '/' + ConstPath.RelativePath.ARSymbol
              const filePath = 'file://' + arSymbolFilePath + "arnavi_arrowcircle.png"

              AppToolBar.addData({markerLineContent: filePath})
              // 切换到添加矢量线的工具栏
              // AppToolBar.show('ARMAP', 'AR_MAP_ADD_LINE')
              const _params: any = ToolbarModule.getParams()
              _params.setToolbarVisible(true, ConstToolType.SM_AR_DRAWING_ADD_MARKER_LINE, {
                isFullScreen: false,
              })
            }
          },
        ],
        onPress: () => {
          // 点击tab后将索引值同步
          // ToolbarModule.addData({moduleIndex: 1})
          ToolbarModule.addData({moduleKey: Const.VECTOR})
          // 转到非特效tab里视为特效图层已经添加完成
          global.isNotEndAddEffect = false
        },
      }

      if(Platform.OS === 'ios') {
        vectorData.data.splice(1)
      }

      const threeDData = {
        title: getLanguage(global.language).ARMap.THREE_D,
        containerType: 'list',
        onPress: () => {
          // 点击tab后将索引值同步
          // ToolbarModule.addData({moduleIndex: 2})
          ToolbarModule.addData({moduleKey: Const.THREE_D})
          // 转到非特效tab里视为特效图层已经添加完成
          global.isNotEndAddEffect = false
        },
        getData: get3DData,
      }

      const modelData =   {
        title: getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAND_TABLE_MODEL,
        onPress: () => {
          // 点击tab后将索引值同步
          // ToolbarModule.addData({moduleIndex: 3})
          ToolbarModule.addData({moduleKey: Const.MODEL})
          // 转到非特效tab里视为特效图层已经添加完成
          global.isNotEndAddEffect = false
        },
        getData: getARModel,
      }

      const sandTableData =  {
        title: getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAND_TABLE,
        onPress: () => {
          // 点击tab后将索引值同步
          // ToolbarModule.addData({moduleIndex: 3})
          ToolbarModule.addData({moduleKey: Const.MODEL})
          // 转到非特效tab里视为特效图层已经添加完成
          global.isNotEndAddEffect = false
        },
        getData: getARSandTable,
      }

      const effectData =   {
        title: getLanguage(global.language).Map_Main_Menu.MAP_AR_EFFECT,
        onPress: () => {
          // 点击tab后将索引值同步
          // ToolbarModule.addData({moduleIndex: 4})
          ToolbarModule.addData({moduleKey: Const.EFFECT})
        },
        getData: getAREffect,
      }

      const widgetData =  {
        title: getLanguage(global.language).Prompt.WIDGET,
        // data: [{
        //   key: ConstToolType.SM_AR_ATTRIBUTE_ALBUM,
        //   image: getThemeAssets().ar.functiontoolbar.ar_picture_collection,
        //   title: getLanguage(global.language).Map_Main_Menu.ATTRIBUTE_ALBUM,
        //   action: ARDrawingAction.arAttributeAlbum,
        // }, {
        //   key: ConstToolType.SM_AR_VIDEO_ALBUM,
        //   image: getThemeAssets().ar.functiontoolbar.ar_video_collection,
        //   title: getLanguage(global.language).Map_Main_Menu.VIDEO_ALBUM,
        //   action: ARDrawingAction.arVideoAlbum,
        // }, {
        //   key: ConstToolType.SM_AR_MAPBROCHORE,
        //   image: getThemeAssets().ar.functiontoolbar.ar_map_collection,
        //   title: getLanguage(global.language).Map_Main_Menu.MAPBROCHORE,
        //   action: ARDrawingAction.arMapBrochor,
        // }, {
        //   key: ConstToolType.SM_AR_SANDTABLE_ALBUM,
        //   image: getThemeAssets().ar.functiontoolbar.sandtable_album,
        //   title: getLanguage(global.language).Map_Main_Menu.SANDTABLE_ALBUM,
        //   action: ARDrawingAction.arSandtableAlbum,
        // }],
        onPress: () => {
          // 点击tab后将索引值同步
          ToolbarModule.addData({moduleIndex: 5})
          ToolbarModule.addData({moduleKey: Const.WIDGET})
          // 转到非特效tab里视为特效图层已经添加完成
          global.isNotEndAddEffect = false
        },
        getData: getWidgetListData,
      }

      data.push(poiData)
      data.push(vectorData)
      data.push(threeDData)
      data.push(modelData)
      Platform.OS === 'android' && data.push(sandTableData)
      data.push(effectData)
      Platform.OS === 'android' && data.push(widgetData)

      break
    }
    case ConstToolType.SM_AR_DRAWING_IMAGE:
    case ConstToolType.SM_AR_DRAWING_VIDEO:
    case ConstToolType.SM_AR_DRAWING_WEB:
    case ConstToolType.SM_AR_DRAWING_TEXT:
    case ConstToolType.SM_AR_DRAWING_BUBBLE_TEXT:
    case ConstToolType.SM_AR_DRAWING_SCENE:
    case ConstToolType.SM_AR_DRAWING_MODAL:
    case ConstToolType.SM_AR_DRAWING_ADD_BROCHORE:
    case ConstToolType.SM_AR_DRAWING_ADD_SAND_TABLE_ALBUM:
    case ConstToolType.SM_AR_DRAWING_ADD_ATTRIBUTE_WIDGET:
    case ConstToolType.SM_AR_DRAWING_ADD_WIDGET:
    case ConstToolType.SM_AR_DRAWING_ADD_VIDEO_ALBUM:
    case ConstToolType.SM_AR_DRAWING_ADD_LINE:
    case ConstToolType.SM_AR_DRAWING_ADD_MARKER_LINE:
    case ConstToolType.SM_AR_DRAWING_ADD_SAND:
    case ConstToolType.SM_AR_DRAWING_ADD_BAR_CHART:
    case ConstToolType.SM_AR_DRAWING_ADD_PIE_CHART:
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
  if(type ===  ConstToolType.SM_AR_DRAWING_ADD_LINE ||type === ConstToolType.SM_AR_DRAWING_ADD_MARKER_LINE){
    buttons.splice(3,0, {
      type: 'ADD_UNDO',
      image: getThemeAssets().ar.armap.undo,
      action: () => ARDrawingAction.cancelAddARLinePoint(),
    })
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

/** 获取沙盘数据 */
async function getARSandTable() {
  const _params: any = ToolbarModule.getParams()
  const sandTableTemp: any[] = await DataHandler.getLocalData(_params.user.currentUser, 'SANDTABLE')
  const items: any[] = []
  const homePath = await FileTools.getHomeDirectory()
  return items.concat(sandTableTemp.map(item => {
    return {
      key: item.name,
      image: getThemeAssets().layerType.icon_layer_sandtable,
      title: item.name,
      data: item,
      action: () => {
        ARDrawingAction.arSandTable(homePath + item.path + '/' + item.sandTableInfo.xml)
      },
    }
  }))
}

/** 获取小组件数据 */
async function getWidgetListData() {
  const items = [{
    key: ConstToolType.SM_AR_ATTRIBUTE_ALBUM,
    image: getThemeAssets().ar.functiontoolbar.ar_picture_collection,
    title: getLanguage(global.language).Map_Main_Menu.ATTRIBUTE_ALBUM,
    action: ARDrawingAction.arAttributeAlbum,
  }, {
    key: ConstToolType.SM_AR_VIDEO_ALBUM,
    image: getThemeAssets().ar.functiontoolbar.ar_video_collection,
    title: getLanguage(global.language).Map_Main_Menu.VIDEO_ALBUM,
    action: ARDrawingAction.arVideoAlbum,
  }, {
    key: ConstToolType.SM_AR_MAPBROCHORE,
    image: getThemeAssets().ar.functiontoolbar.ar_map_collection,
    title: getLanguage(global.language).Map_Main_Menu.MAPBROCHORE,
    action: ARDrawingAction.arMapBrochor,
  }, {
    key: ConstToolType.SM_AR_SANDTABLE_ALBUM,
    image: getThemeAssets().ar.functiontoolbar.sandtable_album,
    title: getLanguage(global.language).Map_Main_Menu.SANDTABLE_ALBUM,
    action: ARDrawingAction.arSandtableAlbum,
  }, {
    key: ConstToolType.SM_AR_BAR_CHART,
    image: getThemeAssets().ar.functiontoolbar.bar_chart,
    title: getLanguage(global.language).Map_Main_Menu.BAR_CHART,
    action: ARDrawingAction.arBarChart,
  }, {
    key: ConstToolType.SM_AR_PIE_CHART,
    image: getThemeAssets().ar.functiontoolbar.pie_chart,
    title: getLanguage(global.language).Map_Main_Menu.PIE_CHART,
    action: ARDrawingAction.arPieChart,
  }]

  if(Platform.OS === 'ios') {
    items.splice(4, 2)
  }
  return items
}

export default {
  getData,

  getAREffect,
}
