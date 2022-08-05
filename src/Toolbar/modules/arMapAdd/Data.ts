import { ARAction, SARMap, FileTools, ARLayerType } from "imobile_for_reactnative"
import { ARLayer } from "imobile_for_reactnative/types/interface/ar"
import { Platform } from "react-native"
import { getARLayerAssets, getARSceneAssets, getImage } from "@/assets"
import { ToolbarTabItem, ToolBarBottomItem, ToolBarListItem, IToolbarOption, ToolbarOption ,ToolBarListOption } from "imobile_for_reactnative/components/ToolbarKit"
import { getLanguage } from "@/language"
import { AppEvent, AppToolBar, AppUser, CheckSpell, DataHandler, Toast, DialogUtils } from "@/utils"
import AppRoot, {UserRoot} from '@/utils/AppPath'
import { AR3DExample, AREffectExample, ARModelExample, AREffectExample2, AREffectExample3, AREffectExample4, ExampleData } from "@/utils/DataHandler/DataExample"
import { ModuleList } from ".."
import { addImage, addVideo, addText, addWebView, addModel, addARSceneLayer,addEffectLayer,
  addBubbleText,
  addARWidget,
  addARAttriubutWidget,
  addARBrochore,
  download3DExample,
  downloadEffectlExample,
  downloadModelExample,
  addARVideoAlbum,
  addSandTable,
  AddOption,
  addARSandTableAlbum,
  addARLinePoint,
  addARMarkerLinePoint,
  addARLineElement,
  cancelAddARLinePoint,
  addARChart,
  addARPieChart,
} from './Actions'
import * as ARMapModule  from "./ModuleData"
import NavigationService from "@/containers/NavigationService"
import { ImagePicker } from "@/components"
// import { arLayerType } from "../../../page/ARLayer"
import { arLayerType } from "@/utils/AppToolBar"

import { getThemeAssets } from "@/assets"

export function getData(key: ModuleList['ARMAP_ADD']): IToolbarOption {
  const option = new ToolbarOption<undefined>()
  option.showBackground = false
  switch (key) {
    case 'AR_MAP_ADD':
      addOption(option)
      break
    case 'AR_MAP_ADD_IMAGE':
      addElementOption(option, addImage)
      break
    case 'AR_MAP_ADD_VIDEO':
      addElementOption(option, addVideo)
      break
    case 'AR_MAP_ADD_TEXT':
      addElementOption(option, addText)
      break
    case 'AR_MAP_ADD_BUBBLE_TEXT':
      addElementOption(option, addBubbleText)
      break
    /** 矢量线的添加 */
    case 'AR_MAP_ADD_LINE':
      addElementLine(option, addARLinePoint)
      break
    /** 矢量符号线的添加 */
    case 'AR_MAP_ADD_MARKER_LINE':
      addElementLine(option, addARMarkerLinePoint)
      break
    case 'AR_MAP_ADD_WEBVIEW':
      addElementOption(option, addWebView)
      break
    case 'AR_MAP_ADD_MODEL':
      addElementOption(option, addModel)
      break
    case 'AR_MAP_ADD_SANDTABLE':
      addElementOption(option, addSandTable)
      break
    case 'AR_MAP_ADD_SCENE':
      addElementOption(option, addARSceneLayer, false)
      break
    case 'AR_MAP_ADD_WIDGET':
      addElementOption(option, addARWidget, false)
      break
    case 'AR_MAP_ADD_ATTRIBUT_WIDGET':
      addElementOption(option, addARAttriubutWidget, false)
      break
    case 'AR_MAP_ADD_VIDEO_ALBUM':
      addElementOption(option, addARVideoAlbum, false)
      break
    case 'AR_MAP_ADD_BROCHORE':
      addElementOption(option, addARBrochore, false)
      break
    /** 柱状图的添加 */
    case 'AR_MAP_ADD_CHART':
      addElementOption(option, addARChart, false)
      break
      /** 饼图的添加 */
    case 'AR_MAP_ADD_PIE_CHART':
      addElementOption(option, addARPieChart, false)
      break

    case 'AR_MAP_AR_SWITCH_ALBUM':
      switchAlbumElementOption(option)
      break
    case 'AR_MAP_AR_SWITCH_VIDEO_ALBUM':
      switchVideoAlbumElementOption(option)
      break
    case 'AR_MAP_ADD_SAND_TABLE_ALBUM':
      addElementOption(option, addARSandTableAlbum, false)
      break


  }

  return option
}

interface AssetType {
  Photos: 'Photos',
  Videos: 'Videos',
  All: 'All'
}

function openSourcePicker(assetType: keyof AssetType, callback: (data: any) => void, size: number) {
  ImagePicker.AlbumListView.defaultProps.showDialog = false
  ImagePicker.AlbumListView.defaultProps.assetType = assetType
  ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'
  ImagePicker.getAlbum({
    maxSize: size,
    callback: callback,
  })
}



function addOption(option: IToolbarOption){
  const { tabShowIndex = 0} = AppToolBar.getData()
  option.tabOption.defaultIndex = tabShowIndex
  // 这个底部组件刚渲染时，默认是第一个选项分类
  AppToolBar.addData({moduleKey: arLayerType.POI})

  option.bottomData = [{
    image: getThemeAssets().toolbar.icon_toolbar_quit,
    onPress: () => {
      AppToolBar.goBack()
    }
  },{
    image: getThemeAssets().tabBar.tab_layer,
    onPress: () => {
      // 跳转到图层列表页面
      // AppNavigation.navigate('ARLayer', {
      //   type: AppToolBar.getData().moduleKey
      // })
      const tabType = AppToolBar.getData().moduleKey
      // 跳转到图层管理页面
      NavigationService.navigate("ARLayerManager", {
        tabType: tabType,
      })
    }
  },{
    image: getThemeAssets().toolbar.icon_toolbar_submit,
    onPress: () => {
      AppToolBar.addData({isNotEndAddEffect: false})
      AppToolBar.goBack()
    }
  },
  ]
  option.tabOption.data = _getAddTab()
}

function _getAddTab(): ToolbarTabItem[] {
  const tabData: ToolbarTabItem[] = [
    {
      title: 'POI',
      type: 'list',
      data: getPoiList(),
      onPress: async () => {
        AppToolBar.addData({moduleKey: arLayerType.POI, isNotEndAddEffect: false})
      },
    },
    {
      title: getLanguage().ARMap.VECTOR,
      type: 'list',
      data: getArGeometryList(),
      onPress: async () => {
        AppToolBar.addData({moduleKey: arLayerType.VECTOR, isNotEndAddEffect: false})
      },
    },

    {
      title: getLanguage().ARMap.THREE_D,
      type: 'list',
      data: [
        {
          image: getImage().import_online_light,
          text: getLanguage().ONLINE,
          onPress: () => {
            // AppInputDialog.show({
            //   title: getLanguage().ENTER_SERVER_ADDRESS,
            //   placeholder: 'http://',
            //   checkSpell: CheckSpell.checkOnline3DServiceUrl,
            //   confirm: url => {
            //     if(url.indexOf('http') !== 0) {
            //       url = 'http://' + url
            //     }
            //     AppToolBar.addData({sceneFilePath: url})
            //     AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_SCENE')
            //   }
            // })

            DialogUtils.showInputDailog({
              title: getLanguage().Profile.ENTER_SERVER_ADDRESS,
              placeholder: 'http://',
              checkSpell: CheckSpell.checkOnline3DServiceUrl,
              confirmAction: url => {
                DialogUtils.hideInputDailog()
                if(url.indexOf('http') !== 0) {
                  url = 'http://' + url
                }
                // ARDrawingAction.ar3D(url)

                AppToolBar.addData({sceneFilePath: url})
                AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_SCENE')

              },
            })

          }
        }
      ],
      onPress: async () => {
        AppToolBar.addData({moduleKey: arLayerType.THREE_D})
      },
      getExtraData: async () => {
        const data = await DataHandler.getLocalData(AppUser.getCurrentUser(), 'WORKSPACE3D')
        const items: ToolBarListItem[] = []
        //检查用户是否已有数据，没有则添加下载选项
        if(data.filter(item => item.Type !== undefined).length === 0) {
          items.push({
            image: getImage().icon_download,
            text: getLanguage().DOWNLOAD,
            onPress: download3DExample,
            downloadKeys: [AR3DExample.userName + '_' + AR3DExample.downloadName]
          })
        }
        return items.concat(data.filter(item => item.Type !== undefined).map(item => {
          return {
            image: item.Type !== undefined ? getARSceneAssets(item.Type) : getImage().my_scene,
            text: item.name.substring(0, item.name.lastIndexOf('.')),
            onPress: () => {
              AppToolBar.addData({sceneFilePath: item.path})
              AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_SCENE')
            }
          }
        })
        )
      }
    },
    {
      title: getLanguage().ARMap.MODEL,
      type: 'list',
      data: [],
      onPress: async () => {
        AppToolBar.addData({moduleKey: arLayerType.MODEL, isNotEndAddEffect: false})
      },
      getExtraData: async () => {
        const data = await DataHandler.getLocalData(AppUser.getCurrentUser(), 'ARMODEL')
        const items: ToolBarListItem[] = []
        const downloadKeys = []
        const exampleData: ExampleData[] = []
        for (const item of ARModelExample) {
          // if(data.findIndex(item2 => item2.name === item.toName) < 0) {
          if(data.findIndex(item2 => item2.name.replace('.glb', '') === item.downloadName.replace('.zip', '')) < 0) {
            downloadKeys.push(item.userName + '_' + item.downloadName)
            exampleData.push(item)
          }
        }
        //检查用户是否已有数据，没有则添加下载选项
        if(downloadKeys.length > 0) {
          items.push({
            image: getImage().icon_download,
            text: getLanguage().DOWNLOAD,
            onPress: () => downloadModelExample(exampleData),
            downloadKeys: downloadKeys,
          })
        }
        return items.concat(data.map(item => {
          return {
            image: getImage().my_dynamic_model,
            text: item.name.substring(0, item.name.lastIndexOf('.')),
            onPress: () => {
              AppToolBar.addData({modelPath: item.path})
              AppToolBar.show('ARMAP_ADD','AR_MAP_ADD_MODEL')
            }
          }
        })
        )
      }
    },{
      title: getLanguage().SAND_TABLE,
      type: 'list',
      data: [],
      onPress: async () => {
        AppToolBar.addData({moduleKey: arLayerType.SAND_TABLE})
      },
      getExtraData: async () => {
        const data = await DataHandler.getLocalData(AppUser.getCurrentUser(), 'SANDTABLE')
        const items: ToolBarListItem[] = []
        // const downloadKeys = []
        // const exampleData: ExampleData[] = []
        // for (const item of ARModelExample) {
        //   // if(data.findIndex(item2 => item2.name === item.toName) < 0) {
        //   if(data.findIndex(item2 => item2.name.replace('.glb', '') === item.downloadName.replace('.zip', '')) < 0) {
        //     downloadKeys.push(item.userName + '_' + item.downloadName)
        //     exampleData.push(item)
        //   }
        // }
        //检查用户是否已有数据，没有则添加下载选项
        // if(downloadKeys.length > 0) {
        //   items.push({
        //     image: getImage().icon_download,
        //     text: getLanguage().Data.DOWNLOAD,
        //     onPress: () => downloadModelExample(exampleData),
        //     downloadKeys: downloadKeys,
        //   })
        // }
        const homePath = await FileTools.getHomeDirectory()
        return items.concat(data.map(item => {
          return {
            image: getThemeAssets().layerType.icon_layer_sandtable,
            text: item.name,
            onPress: () => {
              AppToolBar.addData({sandTablePath: homePath + item.path + '/' + item.sandTableInfo?.xml})
              AppToolBar.show('ARMAP_ADD','AR_MAP_ADD_SANDTABLE')
            }
          }
        })
        )
      }
    },
    {
      title: getLanguage().ARMap.EFFECT,
      type: 'list',
      data: [],
      onPress: async () => {
        AppToolBar.addData({moduleKey: arLayerType.EFFECT})
      },
      getExtraData: async () => {
        const data = await DataHandler.getLocalData(AppUser.getCurrentUser(), 'AREFFECT')
        const items: ToolBarListItem[] = []
        const downloadKeys: string[] = []
        const exampleData: ExampleData[] = []
        if(data.findIndex(item => item.name === AREffectExample.toName) < 0) {
          downloadKeys.push(AREffectExample.userName + '_' + AREffectExample.downloadName)
          exampleData.push(AREffectExample)
        }
        if(data.findIndex(item => item.name === AREffectExample2.toName) < 0) {
          downloadKeys.push(AREffectExample2.userName + '_' + AREffectExample2.downloadName)
          exampleData.push(AREffectExample2)
        }
        if(data.findIndex(item => item.name === AREffectExample3.toName) < 0) {
          downloadKeys.push(AREffectExample3.userName + '_' + AREffectExample3.downloadName)
          exampleData.push(AREffectExample3)
        }
        if(data.findIndex(item => item.name === AREffectExample4.toName) < 0) {
          downloadKeys.push(AREffectExample4.userName + '_' + AREffectExample4.downloadName)
          exampleData.push(AREffectExample4)
        }
        if(downloadKeys.length > 0) {
          items.push({
            image: getImage().icon_download,
            text: getLanguage().DOWNLOAD,
            onPress: () => downloadEffectlExample(exampleData),
            downloadKeys,
          })
        }
        return items.concat(data.map(item => {
          return {
            image: getARLayerAssets(ARLayerType.EFFECT_LAYER),
            text: item.name.substring(0, item.name.lastIndexOf('.')),
            onPress: async () => {
              // 获取图层列表
              let effectLayer: ARLayer | undefined = undefined
              // 是否允许新建图层添加
              // 特效图层是否未添加完毕  false表示添加完毕， true表示未添加完毕
              const isNotEnd = AppToolBar.getData().isNotEndAddEffect
              // console.warn(isNotEnd)

              // 获取当前图层
              const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
              // 若当前图层是特效图层
              if(layer?.type === ARLayerType.EFFECT_LAYER){
                effectLayer = layer
              }
              // 当特效图层正在添加时，说明第一个图层就是正在添加的图层，就修改第一个图层的特效就可以了
              if(isNotEnd && effectLayer) {
                // 正在添加中，切换特效
                const homePath = await FileTools.getHomeDirectory()
                if (Platform.OS === 'ios') {
                  const targetPath = item.path.replace('.areffect', '.mp4')
                  await FileTools.copyFile(homePath + item.path, homePath + targetPath)
                  SARMap.setAREffect(effectLayer.name, homePath + targetPath)
                } else {
                  SARMap.setAREffect(effectLayer.name, homePath + item.path)
                }
              } else {
                // 不是正在添加中就直接新建一个特效图层
                await addEffectLayer(item.name, item.path)
                AppToolBar.addData({isNotEndAddEffect: true})
              }

              // 先矫正定位
              // if(Platform.OS === 'android') {
              SARMap.setEffectLayerCenter(item.name.substring(0, item.name.lastIndexOf('.')))
              // } else {
              //   // IOS TODO
              // }

              // AppToolBar.goBack()
            }
          }
        })
        )
      }
    },
    {
      title: getLanguage().WIDGET,
      type: 'list',
      data: getWidgetListData(),
      onPress: async () => {
        AppToolBar.addData({moduleKey: arLayerType.WIDGET, isNotEndAddEffect: false})
      },
    },
  ]

  if(Platform.OS === 'ios') {
    // tabData.splice(6, 1)
    tabData.splice(4, 1)
  }

  return tabData
}

function getWidgetListData(): ToolBarListItem[]{
  const data = [
    // {
    //   image: getImage().ar_picture,
    //   text: getLanguage().ALBUM,
    //   onPress: () => {
    //     const props = AppToolBar.getProps()
    //     if (props) {
    //       AppImagePicker.showImagePicker({
    //         assetType: 'Photos',
    //         maxNum: 10,
    //         include: ['filename'],
    //       }, {
    //         onSelect: photos => {
    //           AppToolBar.addData({ arPhotos: photos, albumName: getLanguage().ALBUM })
    //           AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_WIDGET')
    //         }
    //       })
    //       AppToolBar.hide()
    //     }
    //   }
    // },
    {
      image: getImage().ar_picture_collection,
      text: getLanguage().ATTRIBUTE_ALBUM,
      onPress: () => {
        AppToolBar.show('ARMAP_ADD', 'AR_MAP_AR_SWITCH_ALBUM')
      }
    },
    {
      image: getImage().ar_video_collection,
      text: getLanguage().VIDEO_ALBUM,
      onPress: () => {
        AppToolBar.show('ARMAP_ADD', 'AR_MAP_AR_SWITCH_VIDEO_ALBUM')
      }
    },
    {
      image: getImage().ar_map_collection,
      text: getLanguage().MAPBROCHORE,
      onPress: () => {
        // AppNavigation.navigate('MapSelectList', {
        //   type: 'mapSelect',
        // })
        NavigationService.navigate("MapSelectList", { type: 'mapSelect' })
      }
    },
    {
      image: getImage().sandtable_album,
      text: getLanguage().SANDTABLE_ALBUM,
      onPress: () => {
        // AppNavigation.navigate('MapSelectList', {
        //   type: 'sandtableSelect',
        // })
        NavigationService.navigate("MapSelectList", { type: 'sandTableSelect' })
      }
    },
    {
      image: getImage().bar_chart,
      text: getLanguage(global.language).Map_Main_Menu.BAR_CHART,
      onPress: () => {
        // AppNavigation.navigate('ChartManager')
        NavigationService.navigate("ChartManager", { type: 'barChartAdd' })
      }
    },
    {
      image: getImage().pie_chart,
      text: getLanguage().PIE_CHART,
      onPress: () => {
        // 饼图
        // AppNavigation.navigate('ChartManager', {
        //   type: 'pieChartAdd'
        // })
        NavigationService.navigate("ChartManager", { type: 'pieChartAdd' })
      }
    }
  ]
  if(Platform.OS === 'ios') {
    data.splice(4, 2)
  }
  return data
}


function addElementOption(option: IToolbarOption, addFunc: (addOption?: AddOption) => Promise<void>, continousAdd = true, goBack = false) {

  option.bottomData = _getAddPOIBottomData(continousAdd, goBack)

  option.listData ={data: [{
    image: getThemeAssets().ar.armap.ar_add_location,
    onPress: () => {
      SARMap.setCenterHitTest(false)
      AppEvent.removeListener('ar_on_tap_add_buttun')
      AppEvent.addListener('ar_on_tap_add_buttun', () => {
        const isAdding = AppToolBar.getData().isAddingARElement
        if(isAdding) return
        AppToolBar.addData({ isAddingARElement: true})
        const option: AddOption = {}
        addFunc(option).then(() => {
          AppToolBar.addData({ isAddingARElement: false , isAlbumFirstAdd: true})
          if(!continousAdd) {
            AppEvent.emitEvent('ar_map_add_end')
            if(AppToolBar.getData().albumName !== getLanguage().ATTRIBUTE_ALBUM
            && AppToolBar.getData().albumName !== getLanguage().MAPBROCHORE
            && AppToolBar.getData().albumName !== getLanguage().ATTRIBUTE_ALBUM
            && AppToolBar.getData().albumName !== getLanguage().VIDEO_ALBUM
            && AppToolBar.getData().albumName !== getLanguage().SANDTABLE_ALBUM){
              if(goBack) {
                AppToolBar.goBack()
              } else {
                // AppToolBar.show('ARMAP', 'AR_MAP_HOME')
                AppToolBar.hide()
              }
            }
          }
        }).catch(() => {
          AppToolBar.addData({ isAddingARElement: false})
        })
      })
      AppEvent.emitEvent('ar_map_add_start')
      AppToolBar.toggleListVisible()
    }
  }, {
    image: getThemeAssets().ar.armap.ar_add_point,
    onPress: () => {
      SARMap.setCenterHitTest(true)
      AppEvent.removeListener('ar_on_tap_add_buttun')
      AppEvent.addListener('ar_on_tap_add_buttun', async () => {
        const translation = await SARMap.getCurrentCenterHitPoint()
        if(translation) {
          const isAdding = AppToolBar.getData().isAddingARElement
          if(isAdding) return
          AppToolBar.addData({ isAddingARElement: true})
          const option: AddOption = {
            translation
          }
          addFunc(option).then(() => {
            AppToolBar.addData({ isAddingARElement: false , isAlbumFirstAdd: true})
            if(!continousAdd) {
              AppEvent.emitEvent('ar_map_add_end')
              SARMap.setCenterHitTest(false)
              if(AppToolBar.getData().albumName !== getLanguage().ATTRIBUTE_ALBUM
              && AppToolBar.getData().albumName !== getLanguage().MAPBROCHORE
              && AppToolBar.getData().albumName !== getLanguage().ATTRIBUTE_ALBUM
              && AppToolBar.getData().albumName !== getLanguage().VIDEO_ALBUM
              && AppToolBar.getData().albumName !== getLanguage().SANDTABLE_ALBUM){
                if(goBack) {
                  AppToolBar.goBack()
                } else {
                  // AppToolBar.show('ARMAP', 'AR_MAP_HOME')
                  AppToolBar.hide()
                }
              }
            }
          }).catch(() => {
            AppToolBar.addData({ isAddingARElement: false})
          })
        }
      })
      AppEvent.emitEvent('ar_map_add_start')
      AppToolBar.toggleListVisible()
    }
  }
  ]}

}

function _getAddPOIBottomData(continousAdd = true, goBack = false): ToolBarBottomItem[] {
  const data = [
    {
      image: getThemeAssets().toolbar.icon_toolbar_quit,
      onPress: () => {
        // TODO SARMap.cancel()
        SARMap.setCenterHitTest(false)
        AppEvent.emitEvent('ar_map_add_end')
        AppToolBar.goBack()
      }
    },
    {
      image: getThemeAssets().toolbar.icon_toolbar_style,
      onPress: () => {
        AppToolBar.toggleListVisible()
      }
    },
  ]

  if(continousAdd) {
    data.push(
      {
        image: getImage().undo,
        onPress: async () => {
          const addARElement = ARMapModule.getAddElements().pop()
          if(addARElement) {
            await SARMap.appointEditElement(addARElement.id, addARElement.layerName)
            SARMap.removeEditElement()
            AppEvent.emitEvent('ar_map_add_undo')
          }
        },
      },
      {
        image: getThemeAssets().toolbar.icon_toolbar_submit,
        onPress: () => {
          SARMap.setCenterHitTest(false)
          AppEvent.emitEvent('ar_map_add_end')
          if(goBack) {
            AppToolBar.goBack()
          } else {
            // AppToolBar.show('ARMAP', 'AR_MAP_HOME')
            AppToolBar.hide()
            // NavigationService.navigate('MapView', { type: "MAP_AR" })
          }
        }
      },)
  }

  return data
}

function getPoiList(): ToolBarListItem[] {
  return [
    {
      image: getImage().ar_picture,
      text: getLanguage(global.language).Map_Main_Menu.MAP_AR_IMAGE,
      onPress: () => {
        // AppImagePicker.showImagePicker({
        //   assetType: 'Photos',
        //   maxNum: 1,
        //   include: ['filename'],
        // },{
        //   onSelect: photos => {
        //     AppToolBar.addData({arContent: photos[0].node.image.uri})
        //     AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_IMAGE')
        //   }
        // })

        openSourcePicker('Photos', data => {
          if (data && data.length > 0) {
            const path = data[0].uri
            // setARToolbar(ConstToolType.SM_AR_DRAWING_IMAGE, { arContent: path })
            AppToolBar.addData({arContent: path})
            AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_IMAGE')
          }
        }, 1)

      }
    },
    {
      image: getImage().ar_video,
      text: getLanguage().ARMap.VIDEO,
      onPress: () => {
        // AppImagePicker.showImagePicker({
        //   assetType: 'Videos',
        //   maxNum: 1,
        //   include: ['filename', 'playableDuration'],
        // },{
        //   onSelect: photos => {
        //     AppToolBar.addData({arContent: photos[0].node.image.uri})
        //     AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_VIDEO')
        //   }
        // })

        openSourcePicker('Videos', data => {
          if (data && data.length > 0) {
            const path = data[0].uri
            // setARToolbar(ConstToolType.SM_AR_DRAWING_VIDEO, { arContent: path })
            AppToolBar.addData({arContent: path})
            AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_VIDEO')
          }
        }, 1)

      }
    },
    {
      image: getImage().ar_webvew,
      text: getLanguage(global.language).Map_Main_Menu.MAP_AR_WEBVIEW,
      onPress: () => {
        // AppInputDialog.show({
        //   defaultValue: 'https://',
        //   placeholder: getLanguage().Common.INPUT_URL,
        //   // checkSpell todo
        //   confirm: text => {
        //     AppToolBar.addData({arContent: text})
        //     AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_WEBVIEW')
        //   }
        // })

        DialogUtils.showInputDailog({
          value: 'http://',
          type: 'http',
          confirmAction: async (value: string) => {
            // setARToolbar(ConstToolType.SM_AR_DRAWING_WEB, { arContent: value })
            AppToolBar.addData({arContent: value})
            AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_WEBVIEW')

            DialogUtils.hideInputDailog()
          },
        })

      }
    },
  ]
}

/** 矢量线 或 矢量符号线 的添加 */
function addElementLine(option: IToolbarOption, addFunc: (addOption?: AddOption) => Promise<void>, goBack = false) {
  // 底部的按钮
  option.bottomData = [
    {
      image: getThemeAssets().toolbar.icon_toolbar_quit,
      onPress: () => {
        // 返回按钮
        AppToolBar.addData({isLineAdd:false})
        SARMap.setAction(ARAction.NULL)
        // SARMap.exitAddARLine()

        const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
        if(layer && (layer.type === ARLayerType.AR_LINE_LAYER || layer.type === ARLayerType.AR_MARKER_LINE_LAYER)) {
          SARMap.exitAddARLine(layer.name)
        }

        AppEvent.emitEvent('ar_map_add_end')
        AppToolBar.goBack()
      }
    },
    {
      image: getThemeAssets().toolbar.icon_toolbar_style,
      onPress: () => {
        AppToolBar.toggleListVisible()
      }
    },
    {
      image: getImage().undo,
      onPress: async () => {
        // 撤销按钮
        cancelAddARLinePoint()
      },
    },
    {
      image: getThemeAssets().toolbar.icon_toolbar_submit,
      onPress: () => {
        // 提交或完成按钮
        AppToolBar.addData({isLineAdd:false})
        AppEvent.emitEvent('ar_map_add_end')
        if(goBack) {
          AppToolBar.goBack()
        } else {
          addARLineElement()
          // AppToolBar.show('ARMAP', 'AR_MAP_HOME')
          AppToolBar.hide()
        }
        SARMap.setAction(ARAction.NULL)
      }
    },
  ]

  // 添加模式选择列表
  option.listData ={data: [{
    image: getThemeAssets().ar.armap.ar_add_location,
    onPress: () => {
      // 添加到当前位置
      // AppEvent.emitEvent('ar_map_add_end')
      // 将Action的状态设置为添加矢量线的状态
      SARMap.setAction(ARAction.LINE_CREATE)
      // SARMap.setAction(602)
      AppToolBar.addData({isLineAdd:true})
      // 对点击添加按钮做监听
      AppEvent.removeListener('ar_on_tap_add_buttun')
      AppEvent.addListener('ar_on_tap_add_buttun', async () => {
        const isLineAdd = AppToolBar.getData().isLineAdd
        if(!isLineAdd) return
        const option: AddOption = {
          foucus: false,
        }
        // 线的节点添加完成
        addFunc(option).then(() => {
          Toast.show(getLanguage().LINE_POINT_ADD_SUCCESSED)
        }).catch(() => {
          AppToolBar.addData({isLineAdd:false})
        })
      })
      AppEvent.emitEvent('ar_map_add_start')
      AppToolBar.toggleListVisible()
    }
  }, {
    image: getThemeAssets().ar.armap.ar_add_point,
    onPress: () => {
      // 添加到指定点的位置
      AppEvent.emitEvent('ar_map_add_end')
      // 将Action的状态设置为添加矢量线的状态
      SARMap.setAction(ARAction.LINE_CREATE_FOUCUS)
      // SARMap.setAction(601)
      AppToolBar.addData({isLineAdd:true})
      // 对点击添加按钮做监听
      AppEvent.removeListener('ar_on_tap_add_buttun')
      AppEvent.addListener('ar_on_tap_add_buttun', async () => {
        // 获取指定点的中心位置坐标
        const translation = await SARMap.getCurrentCenterHitPoint()
        // 当指定点的位置坐标获取成功时才去添加线的节点
        if(translation) {
          const isLineAdd = AppToolBar.getData().isLineAdd
          if(!isLineAdd) return
          const option: AddOption = {
            translation
          }
          // 线的节点添加完成
          addFunc(option).then(() => {
            Toast.show(getLanguage().LINE_POINT_ADD_SUCCESSED)
          }).catch(() => {
            AppToolBar.addData({isLineAdd:false})
          })
        }
      })
      AppEvent.emitEvent('ar_map_add_start')
      AppToolBar.toggleListVisible()
    }
  },
  ]}


}

function getArGeometryList(): ToolBarListItem[]{
  const data: ToolBarListItem[] = [
    {
      image: getImage().icon_ar_layer_text,
      text: getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_SAVE_TEXT,
      onPress: () => {
        // AppInputDialog.show({
        //   placeholder: getLanguage().Common.INPUT_TEXT,
        //   confirm: text => {
        //     AppToolBar.addData({arContent: text})
        //     AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_TEXT')
        //   }
        // })
        DialogUtils.showInputDailog({
          value: '',
          confirmAction: async (value: string) => {
            // setARToolbar(ConstToolType.SM_AR_DRAWING_TEXT, { arContent: value })

            AppToolBar.addData({arContent: value})
            AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_TEXT')

            DialogUtils.hideInputDailog()
          },
        })
      }
    },
    {
      image: getImage().bubble_text,
      text: getLanguage().BUBBLE_TEXT,
      onPress: () => {
        // AppInputDialog.show({
        //   placeholder: getLanguage().Common.INPUT_TEXT,
        //   confirm: text => {
        //     AppToolBar.addData({arContent: text})
        //     AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_BUBBLE_TEXT')
        //   }
        // })

        DialogUtils.showInputDailog({
          value: '',
          confirmAction: async (value: string) => {
            // setARToolbar(ConstToolType.SM_AR_DRAWING_BUBBLE_TEXT, { arContent: value })

            AppToolBar.addData({arContent: value})
            AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_BUBBLE_TEXT')

            DialogUtils.hideInputDailog()
          },
        })

      }
    },
    {
      image: getThemeAssets().ar.point_line,
      text: getLanguage().LINE,
      onPress: () => {
        // 切换到添加矢量线的工具栏
        AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_LINE')
      }
    },
    {
      image: getThemeAssets().ar.marker_line,
      text: getLanguage().MARKER_LINE,
      onPress: async () => {

        const homePath = await FileTools.getHomeDirectory()
        // 获取当前用户的用户名
        const userName = AppUser.getCurrentUser().userName
        // 拼接AR符号库的文件夹路径
        const arSymbolFilePath = homePath + AppRoot.User.path + '/'+ userName + UserRoot.Data.ARSymbol.path
        const filePath = 'file://' + arSymbolFilePath + "/arnavi_arrowcircle.png"

        AppToolBar.addData({markerLineContent: filePath})
        // 切换到添加矢量符号线的工具栏
        AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_MARKER_LINE')

        // AppImagePicker.showImagePicker({
        //   assetType: 'Photos',
        //   maxNum: 1,
        //   include: ['filename'],
        // },{
        //   onSelect: photos => {
        //     AppToolBar.addData({markerLineContent: photos[0].node.image.uri})
        //     AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_MARKER_LINE')
        //   }
        // })

      }
    },
  ]
  // 矢量线，符号线的添加屏蔽ios
  if(Platform.OS === 'ios') {
    data.splice(2,2)
  }

  Platform.OS === 'ios' && data.splice(1,1)

  return data
}

function getPoiSettingBottom(): ToolBarBottomItem[] {
  return[
    {
      image: getThemeAssets().toolbar.icon_toolbar_quit,
      onPress: () => {
        AppToolBar.goBack()
      }
    },
    // {
    //   image: getImage().commit_white,
    //   onPress: () => {
    //     AppToolBar.goBack()
    //   }
    // },
  ]
}


/** 相册集选择风格 */
function switchAlbumElementOption(option: IToolbarOption){
  option.bottomData = getPoiSettingBottom()
  option.listData = _getSwitchAlbumData()
}

/** 视频集选择风格 */
function switchVideoAlbumElementOption(option: IToolbarOption){
  option.bottomData = getPoiSettingBottom()
  option.listData = _getSwitchVideoAlbumData()
}


function _getSwitchAlbumData(): ToolBarListOption {
  const data = [
    {
      image: getImage().icon_tool_relation,
      text: getLanguage().ARMap.RELATIONSHIP,
      onPress: async () => {
        const props = AppToolBar.getProps()
        if (props) {
          // AppImagePicker.showImagePicker({
          //   assetType: 'Photos',
          //   maxNum: 10,
          //   include: ['filename'],
          // }, {
          //   onSelect: photos => {
          //     AppToolBar.addData({ arPhotos: photos, albumName: getLanguage().ALBUM })
          //     AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_WIDGET')
          //   }
          // })
          // AppToolBar.hide()

          openSourcePicker('Photos', data => {
            if (data && data.length > 0) {
              // ToolbarModule.addData({ arPhotos: data, albumName: getLanguage().ATTRIBUTE_ALBUM })
              // const _params: any = ToolbarModule.getParams()
              // _params.setToolbarVisible(true, ConstToolType.SM_AR_DRAWING_ADD_WIDGET, {
              //   isFullScreen: false,
              // })
              AppToolBar.addData({ arPhotos: data, albumName: getLanguage().ATTRIBUTE_ALBUM })
              AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_WIDGET')
            }
          }, 10)

        }
      }
    },
    {
      image: getImage().icon_tool_list,
      text: getLanguage().ARMap.LIST,
      onPress: async () => {
        const props = AppToolBar.getProps()
        if (props) {
          // AppImagePicker.showImagePicker({
          //   assetType: 'Photos',
          //   maxNum: -1,
          //   include: ['filename'],
          // }, {
          //   onSelect: photos => {
          //     AppToolBar.addData({ arPhotos: photos, albumName: getLanguage().ATTRIBUTE_ALBUM })
          //     AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_ATTRIBUT_WIDGET')
          //   }
          // })
          // AppToolBar.hide()

          openSourcePicker('Photos', data => {
            if (data && data.length > 0) {
              // ToolbarModule.addData({ arPhotos: data, albumName: getLanguage().ATTRIBUTE_ALBUM })
              // const _params: any = ToolbarModule.getParams()
              // _params.setToolbarVisible(true, ConstToolType.SM_AR_DRAWING_ADD_ATTRIBUTE_WIDGET, {
              //   isFullScreen: false,
              // })
              AppToolBar.addData({ arPhotos: data, albumName: getLanguage().ATTRIBUTE_ALBUM })
              AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_ATTRIBUT_WIDGET')
            }
          }, 10)
        }
      }
    },
  ]
  return{
    data: data
  }
}

function _getSwitchVideoAlbumData(): ToolBarListOption {
  const data = [
    {
      image: getImage().icon_tool_loop,
      text: getLanguage().ARMap.LOOP,
      onPress: async () => {
        const props = AppToolBar.getProps()
        if (props) {
          // AppImagePicker.showImagePicker({
          //   assetType: 'Videos',
          //   maxNum: 5,
          //   include: ['filename', 'playableDuration'],
          // }, {
          //   onSelect: photos => {
          //     AppToolBar.addData({ arPhotos: photos, albumName: getLanguage().VIDEO_ALBUM ,videoType:0})
          //     AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_VIDEO_ALBUM')
          //   }
          // })
          // AppToolBar.hide()

          openSourcePicker('Videos', data => {
            if (data && data.length > 0) {
              // ToolbarModule.addData({ arPhotos: data, albumName: getLanguage().VIDEO_ALBUM, videoType: 0 })
              // const _params: any = ToolbarModule.getParams()
              // _params.setToolbarVisible(true, ConstToolType.SM_AR_DRAWING_ADD_VIDEO_ALBUM, {
              //   isFullScreen: false,
              // })

              AppToolBar.addData({ arPhotos: data, albumName: getLanguage().VIDEO_ALBUM ,videoType:0})
              AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_VIDEO_ALBUM')
            }
          }, 5)
        }
      }
    },
    {
      image: getImage().icon_tool_list,
      text: getLanguage().ARMap.LIST,
      onPress: async () => {
        const props = AppToolBar.getProps()
        if (props) {
          // AppImagePicker.showImagePicker({
          //   assetType: 'Videos',
          //   maxNum: -1,
          //   include: ['filename', 'playableDuration'],
          // }, {
          //   onSelect: photos => {
          //     AppToolBar.addData({ arPhotos: photos, albumName: getLanguage().VIDEO_ALBUM ,videoType:1})
          //     AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_VIDEO_ALBUM')
          //   }
          // })
          // AppToolBar.hide()

          openSourcePicker('Videos', data => {
            if (data && data.length > 0) {
              // ToolbarModule.addData({ arPhotos: data, albumName: getLanguage().VIDEO_ALBUM, videoType: 1 })
              // const _params: any = ToolbarModule.getParams()
              // _params.setToolbarVisible(true, ConstToolType.SM_AR_DRAWING_ADD_VIDEO_ALBUM, {
              //   isFullScreen: false,
              // })

              AppToolBar.addData({ arPhotos: data, albumName: getLanguage().VIDEO_ALBUM ,videoType:1})
              AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_VIDEO_ALBUM')
            }
          }, 10)
        }
      }
    },
  ]
  return{
    data: data
  }
}
