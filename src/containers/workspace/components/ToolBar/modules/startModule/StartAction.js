/* global GLOBAL */
import React from 'react'
import { Text, View } from 'react-native'
import {
  SMap,
  SScene,
  SMediaCollector,
  DatasetType,
} from 'imobile_for_reactnative'
import { color, size } from '../../../../../../styles'
import { FileTools, NativeMethod } from '../../../../../../native'
import { getThemeAssets } from '../../../../../../assets'
import {
  ConstToolType,
  ConstInfo,
  ConstPath,
  UserType,
  ToolbarType,
  ChunkType,
} from '../../../../../../constants'
import { Toast, LayerUtils, scaleSize } from '../../../../../../utils'
import NavigationService from '../../../../../NavigationService'
import { getLanguage } from '../../../../../../language'
import ToolbarModule from '../ToolbarModule'

/** 切换标绘库 * */
// function changePlotLib() {
//   if (!ToolbarModule.getParams().setToolbarVisible) return
//   ToolbarModule.getParams().showFullMap && ToolbarModule.getParams().showFullMap(true)
//   ;(async function() {
//     let data = [],
//       path =
//         (await FileTools.appendingHomeDirectory(
//           ToolbarModule.getParams().user && ToolbarModule.getParams().user.currentUser.userName
//             ? ConstPath.UserPath + ToolbarModule.getParams().user.currentUser.userName + '/'
//             : ConstPath.CustomerPath,
//         )) + ConstPath.RelativePath.Plotting

/** 打开地图 * */
function openMap() {
  const _params = ToolbarModule.getParams()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  ;(async function() {
    const data = []
    const path =
      (await FileTools.appendingHomeDirectory(
        _params.user && _params.user.currentUser.userName
          ? `${ConstPath.UserPath + _params.user.currentUser.userName}/`
          : ConstPath.CustomerPath,
      )) + ConstPath.RelativeFilePath.Map
    let userFileList
    userFileList = await FileTools.getMaps(path)
    if (userFileList && userFileList.length > 0) {
      const userList = []
      userFileList.forEach(item => {
        const { name } = item
        item.title = name
        item.name = name.split('.')[0]
        item.image = item.isTemplate
          ? getThemeAssets().dataType.icon_map_template
          : getThemeAssets().dataType.icon_mapdata
        item.info = {
          infoType: 'mtime',
          lastModifiedDate: item.mtime,
          isTemplate: item.isTemplate,
        }
        if (_params.map.currentMap.name === item.name) {
          item.rightView = (
            <View
              style={{
                height: '100%',
                flexDirection: 'column',
                // justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              <View
                style={{
                  marginTop: scaleSize(8),
                  marginRight: scaleSize(8),
                  paddingHorizontal: scaleSize(8),
                  // height: scaleSize(30),
                  // width: scaleSize(140),
                  borderRadius: scaleSize(4),
                  backgroundColor: color.bgG,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: size.fontSize.fontSizeSm,
                    color: 'white',
                    backgroundColor: 'transparent',
                  }}
                >
                  {getLanguage(_params.language).Map_Main_Menu.CURRENT_MAP}
                </Text>
              </View>
            </View>
          )
        }
        userList.push(item)
      })
    }
    data.push({
      title: getLanguage(global.language).MAP,
      // '我的地图',
      image: getThemeAssets().dataType.icon_map,
      data: userFileList || [],
      extraData: !global.Type.startsWith('MAP_AR') && {
        title: getLanguage(global.language).Profile.SAMPLEDATA,
        action: () => {
          NavigationService.navigate('SampleMap', {
            refreshAction: openMap,
          })
        },
      },
    })
    _params.setToolbarVisible(true, ConstToolType.SM_MAP_START_CHANGE, {
      containerType: ToolbarType.list,
      data,
    })
  })()
}

/** 判断是否保存 * */
function isNeedToSave(cb = () => {}) {
  let isAnyMapOpened = true // 是否有打开的地图
  SMap.mapIsModified().then(async result => {
    isAnyMapOpened = await SMap.isAnyMapOpened()
    if (isAnyMapOpened && result) {
      setSaveViewVisible(true, cb)
    } else {
      cb()
    }
  })
}

/** 打开模板 * */
function openTemplateList() {
  const _params = ToolbarModule.getParams()
  if (!_params.setToolbarVisible) return
  _params.showFullMap &&
    _params.showFullMap(true)

  NativeMethod.getTemplates(
    _params.user.currentUser.userName,
    ConstPath.Module.Collection,
  ).then(async templateList => {
    const tpList = []
    for (let item of templateList) {
      const path = await FileTools.appendingHomeDirectory(item.path)
      const is3D = await SScene.is3DWorkspace({ server: path })
      if (!is3D) {
        tpList.push(item)
      }
    }
    const data = [
      {
        title: getLanguage(global.language).Map_Main_Menu.CREATE_WITH_SYMBOLS,
        // Const.CREATE_SYMBOL_COLLECTION,
        data: [],
      },
      {
        title: getLanguage(global.language).Map_Main_Menu.CREATE_WITH_TEMPLATE,
        // Const.CREATE_MODULE,
        data: tpList,
      },
    ]
    _params.setToolbarVisible(
      true,
      ConstToolType.SM_MAP_START_TEMPLATE,
      {
        containerType: ToolbarType.list,
        data,
      },
    )
  })
}

/** 导入 * */
// function importWorkspace() {
//   if (global.Type === ChunkType.MAP_COLLECTION) {
//     openWorkspace(async path => {
//       try {
//         ToolbarModule.getParams().setContainerLoading &&
//         ToolbarModule.getParams().setContainerLoading(true, '正在导入工作空间')
//
//         let fileNameAndType = path.substr(path.lastIndexOf('/') + 1, path.length - 1).split('.')
//         let alias = fileNameAndType[0]
//         let fileType = fileNameAndType[1].toString().toUpperCase()
//         let type
//         switch (fileType) {
//           case 'SXW':
//             type = WorkspaceType.SXW
//             break
//           case 'SMW':
//             type = WorkspaceType.SMW
//             break
//           case 'SXWU':
//             type = WorkspaceType.SXWU
//             break
//           case 'SMWU':
//           default:
//             type = WorkspaceType.SMWU
//         }
//
//         let data = { server: path, type, alias }
//         ToolbarModule.getParams().importTemplate(data, result => {
//           ToolbarModule.getParams().getLayers()
//           Toast.show(result ? '已为您导入工作空间' : '导入工作空间失败')
//           NavigationService.goBack()
//           ToolbarModule.getParams().setContainerLoading && ToolbarModule.getParams().setContainerLoading(false)
//         })
//       } catch (error) {
//         Toast.show('导入工作空间失败')
//         ToolbarModule.getParams().setContainerLoading && ToolbarModule.getParams().setContainerLoading(false)
//       }
//     })
//   }
// }

/** 新建 * */
async function create() {
  // 不是从xml加载地图
  global.IS_MAP_FROM_XML = false
  if (global.Type === ChunkType.MAP_COLLECTION) {
    openTemplateList()
    return
  }
  let params = ToolbarModule.getParams()
  // if (
  //   global.Type === ChunkType.MAP_EDIT ||
  //   global.Type === ChunkType.MAP_THEME ||
  //   global.Type === ChunkType.MAP_PLOTTING ||
  //   global.Type === ChunkType.MAP_NAVIGATION ||
  //   global.Type === ChunkType.MAP_ANALYST ||
  //   global.Type === ChunkType.MAP_AR
  // )
  {
    params.setOpenOnlineMap(false)
    const userPath =
      params.user.currentUser.userName &&
      params.user.currentUser.userType !== UserType.PROBATION_USER
        ? `${ConstPath.UserPath + params.user.currentUser.userName}/`
        : ConstPath.CustomerPath
    const mapPath = await FileTools.appendingHomeDirectory(
      userPath + ConstPath.RelativePath.Map,
    )
    const newName = await FileTools.getAvailableMapName(mapPath, 'DefaultMap')
    NavigationService.navigate('InputPage', {
      headerTitle: getLanguage(global.language).Map_Main_Menu.START_NEW_MAP,
      // '新建地图',
      value: newName,
      placeholder: getLanguage(global.language).Prompt.ENTER_MAP_NAME,
      type: 'name',
      cb: async value => {
        global.Loading &&
          global.Loading.setLoading(
            true,
            getLanguage(global.language).Prompt.CREATING,
            // ConstInfo.MAP_SYMBOL_COLLECTION_CREATING,
          )

        // 移除多媒体采集Callout
        SMediaCollector.removeMedias()
        await params.closeMap()
        const userPath = `${ConstPath.UserPath +
          (params.user.currentUser.userName || 'Customer')}/`
        const fillLibPath = await FileTools.appendingHomeDirectory(
          `${userPath +
            ConstPath.RelativeFilePath.DefaultWorkspaceDir}Workspace.bru`,
        )
        const lineLibPath = await FileTools.appendingHomeDirectory(
          `${userPath +
            ConstPath.RelativeFilePath.DefaultWorkspaceDir}Workspace.lsl`,
        )
        const markerLibPath = await FileTools.appendingHomeDirectory(
          `${userPath +
            ConstPath.RelativeFilePath.DefaultWorkspaceDir}Workspace.sym`,
        )
        await SMap.importSymbolLibrary(value, fillLibPath) // 导入面符号库
        await SMap.importSymbolLibrary(value, lineLibPath) // 导入线符号库
        await SMap.importSymbolLibrary(value, markerLibPath) // 导入点符号库
        // await params.setCurrentMap()
        // await SMap.removeAllLayer() // 移除所有图层

        LayerUtils.openDefaultBaseMap()
        await SMap.openTaggingDataset(params.user.currentUser.userName)

        let layers = (params.getLayers && (await params.getLayers())) || []
        let _currentLayer = null
        // 默认设置第一个可见图层为当前图层
        for (let layer of layers) {
          if (
            layer.isVisible &&
            layer.type !== DatasetType.IMAGE &&
            layer.type !== DatasetType.MBImage
          ) {
            _currentLayer = layer
            break
          }
        }
        params.setCurrentLayer(_currentLayer)

        // 如果是标绘模块则加载标绘数据
        if (global.Type === ChunkType.MAP_PLOTTING) {
          const plotIconPath = await FileTools.appendingHomeDirectory(
            `${userPath + ConstPath.RelativePath.Plotting}PlotLibData`,
          )
          await params.getSymbolPlots({
            path: plotIconPath,
            isFirst: true,
            newName: value,
          })
        }

        params.saveMap &&
          (await params.saveMap({
            mapName: value,
            nModule: global.Type,
            notSaveToXML: true,
          }))

        global.Loading && global.Loading.setLoading(false)

        NavigationService.goBack()
        if (global.legend) {
          await SMap.addLegendListener({
            legendContentChange: global.legend._contentChange,
          })
        }
        params.setToolbarVisible && params.setToolbarVisible(false)
      },
    })
  }
}

/** 历史 * */
function showHistory() {
  const userName =
    ToolbarModule.getParams().user.currentUser.userName || 'Customer'
  let latestMap = []
  if (
    ToolbarModule.getParams().map.latestMap &&
    ToolbarModule.getParams().map.latestMap[userName] &&
    ToolbarModule.getParams().map.latestMap[userName][global.Type]
  ) {
    latestMap = ToolbarModule.getParams().map.latestMap[userName][global.Type]
  }
  latestMap.forEach(item => {
    // item.image = getThemeAssets().dataType.icon_map
    item.image = getThemeAssets().dataType.icon_mapdata
  })
  const data = [
    {
      title: getLanguage(global.language).Map_Main_Menu.START_RECENT,
      // Const.HISTORY,
      data: latestMap,
    },
  ]
  ToolbarModule.getParams().setToolbarVisible(true, ConstToolType.SM_MAP_START_CHANGE, {
    containerType: ToolbarType.list,
    height:
      ToolbarModule.getParams().device.orientation.indexOf('LANDSCAPE') === 0
        ? ConstToolType.THEME_HEIGHT[4]
        : ConstToolType.HEIGHT[3],
    data,
  })
}

/** 切换底图 * */
// function changeBaseLayer(type) {
//   if (!ToolbarModule.getParams().setToolbarVisible) return
//   ToolbarModule.getParams().showFullMap && ToolbarModule.getParams().showFullMap(true)

/** 导出成图片 * */
// function outPutMap() {
//
// }

function setSaveViewVisible(visible, cb) {
  if (!ToolbarModule.getParams().setSaveViewVisible) return
  global.SaveMapView && global.SaveMapView.setVisible(visible, {
    cb,
  })
}

/** 保存地图 * */
function saveMap() {
  (async function() {
    try {
      if (global.Type === ChunkType.MAP_3D) {
        global.openWorkspace && Toast.show(ConstInfo.SAVE_SCENE_SUCCESS)
        ToolbarModule.getParams().setToolbarVisible &&
          ToolbarModule.getParams().setToolbarVisible(false)
        return
      }

      ToolbarModule.getParams().setContainerLoading &&
        ToolbarModule.getParams().setContainerLoading(
          true,
          getLanguage(global.language).Prompt.SAVING,
        )
      // '正在保存地图')
      let mapName = ''
      if (ToolbarModule.getParams().map.currentMap.name) {
        // 获取当前打开的地图xml的名称
        mapName = ToolbarModule.getParams().map.currentMap.name
        mapName =
          mapName.substr(0, mapName.lastIndexOf('.')) ||
          ToolbarModule.getParams().map.currentMap.name
      } else {
        const mapInfo = await SMap.getMapInfo()
        if (mapInfo && mapInfo.name) {
          // 获取MapControl中的地图名称
          mapName = mapInfo.name
        } else if (ToolbarModule.getParams().layers.length > 0) {
          // 获取数据源名称作为地图名称
          mapName = ToolbarModule.getParams().collection.datasourceName
        }
      }
      const addition = {}
      // const prefix = `@Label_${
      //   ToolbarModule.getParams().user.currentUser.userName
      // }#`
      // const regexp = new RegExp(prefix)
      // const layers = await ToolbarModule.getParams().getLayers()
      // addition.filterLayers = layers
      //   .filter(item => item.name.match(regexp))
      //   .map(val => val.name)
      // if (
      //   ToolbarModule.getParams().map &&
      //   ToolbarModule.getParams().map.currentMap &&
      //   ToolbarModule.getParams().map.currentMap.Template
      // ) {
      //   addition.Template = ToolbarModule.getParams().map.currentMap.Template
      // }
      const isMapFromXML = global.IS_MAP_FROM_XML
      global.IS_MAP_FROM_XML = false
      const result = await ToolbarModule.getParams().saveMap({
        mapName,
        addition,
        isMapFromXML,
      })
      ToolbarModule.getParams().setContainerLoading &&
        ToolbarModule.getParams().setContainerLoading(false)
      result &&
        ToolbarModule.getParams().setToolbarVisible &&
        ToolbarModule.getParams().setToolbarVisible(false)
      Toast.show(
        result
          ? getLanguage(global.language).Prompt.SAVE_SUCCESSFULLY
          : getLanguage(global.language).Prompt.SAVE_FAILED,
      )
    } catch (e) {
      ToolbarModule.getParams().setContainerLoading &&
        ToolbarModule.getParams().setContainerLoading(false)
      Toast.show(getLanguage(global.language).Prompt.SAVE_FAILED)
    }
  })()
}

/** 另存地图 * */
function saveMapAs() {
  (async function() {
    // if (!ToolbarModule.getParams().setSaveMapDialogVisible) return
    // ToolbarModule.getParams().setSaveMapDialogVisible(true)
    const userPath =
      ToolbarModule.getParams().user.currentUser.userName &&
      ToolbarModule.getParams().user.currentUser.userType !==
        UserType.PROBATION_USER
        ? `${ConstPath.UserPath +
            ToolbarModule.getParams().user.currentUser.userName}/`
        : ConstPath.CustomerPath
    const mapPath = await FileTools.appendingHomeDirectory(
      userPath + ConstPath.RelativePath.Map,
    )
    const newName = await FileTools.getAvailableMapName(
      mapPath,
      ToolbarModule.getParams().map.currentMap.name || 'DefaultMap',
    )
    NavigationService.navigate('InputPage', {
      value: newName,
      headerTitle: getLanguage(global.language).Map_Main_Menu.START_SAVE_AS_MAP,
      // '地图另存',
      placeholder: getLanguage(global.language).Prompt.ENTER_MAP_NAME,
      type: 'name',
      cb: async value => {
        const addition = {}
        // const prefix = `@Label_${
        //   ToolbarModule.getParams().user.currentUser.userName
        // }#`
        // const regexp = new RegExp(prefix)
        // const layers = await ToolbarModule.getParams().getLayers()
        // addition.filterLayers = layers
        //   .filter(item => item.name.match(regexp))
        //   .map(val => val.name)
        if (
          ToolbarModule.getParams().map &&
          ToolbarModule.getParams().map.currentMap &&
          ToolbarModule.getParams().map.currentMap.Template
        ) {
          addition.Template = ToolbarModule.getParams().map.currentMap.Template
        }
        ToolbarModule.getParams().setContainerLoading &&
          ToolbarModule.getParams().setContainerLoading(
            true,
            getLanguage(global.language).Prompt.SAVING,
          )
        ToolbarModule.getParams().saveMap &&
          ToolbarModule.getParams()
            .saveMap({ mapName: value, addition, isNew: true })
            .then(
              result => {
                ToolbarModule.getParams().setToolbarVisible &&
                  ToolbarModule.getParams().setToolbarVisible(false)
                ToolbarModule.getParams().setContainerLoading &&
                  ToolbarModule.getParams().setContainerLoading(false)
                if (result) {
                  NavigationService.goBack('InputPage')
                  setTimeout(() => {
                    Toast.show(
                      getLanguage(global.language).Prompt.SAVE_SUCCESSFULLY,
                    )
                  }, 1000)
                } else {
                  Toast.show(getLanguage(global.language).Prompt.SAVE_FAILED)
                }
              },
              () => {
                ToolbarModule.getParams().setContainerLoading &&
                  ToolbarModule.getParams().setContainerLoading(false)
              },
            )
      },
    })
  })()
}

/** 切换地图 * */
async function changeMap(item) {
  const params = ToolbarModule.getParams()
  // 不是从xml加载地图
  global.IS_MAP_FROM_XML = false
  try {
    if (params.map.currentMap && params.map.currentMap.path === item.path) {
      Toast.show(getLanguage(params.language).Prompt.THE_MAP_IS_OPENED)
      // ConstInfo.MAP_ALREADY_OPENED)
      return
    }
    let exist = await FileTools.fileIsExistInHomeDirectory(item.path)
    if(!exist){
      Toast.show(getLanguage(params.language).Prompt.THE_MAP_IS_NOTEXIST)
      return
    }
    params.setOpenOnlineMap(true)
    params.setContainerLoading(
      true,
      getLanguage(params.language).Prompt.SWITCHING_MAP,
      // ConstInfo.MAP_CHANGING
    )
    //if (params.map.currentMap.name)
    {
      await SMap.removeLegendListener()
      await params.closeMap()
    }
    // 移除地图上所有callout
    SMediaCollector.removeMedias()
    global.clearMapData && global.clearMapData()
    // 清除属性历史记录
    await params.clearAttributeHistory()
    await params.setCurrentSymbols()
    const mapInfo = await params.openMap({ ...item })
    if (mapInfo) {
      Toast.show(
        getLanguage(params.language).Prompt.SWITCHING_SUCCESS,
        // ConstInfo.CHANGE_MAP_TO + mapInfo.name
      )
      if (global.Type === ChunkType.MAP_NAVIGATION) {
        const floorListView = params.getFloorListView()
        const datas = await SMap.getFloorData()
        if (datas.data && datas.data.length > 0) {
          let { data, datasource, currentFloorID } = datas
          //打开地图时比较楼层id来进行排序 zhangxt
          data = data.sort((a, b) => {
            try {
              return b.id - a.id
            } catch (e) {
              return 0
            }
          })
          floorListView.setState(
            {
              data,
              datasource,
            },
            () => {
              params.changeFloorID(currentFloorID)
            },
          )
        }
      }

      // 切换地图后重新添加图例事件
      if (global.legend) {
        await SMap.addLegendListener({
          legendContentChange: global.legend._contentChange,
        })
      }
      global.scaleView && global.scaleView.getInitialData()
      if (mapInfo.Template) {
        params.setContainerLoading(
          true,
          // ConstInfo.TEMPLATE_READING
          getLanguage(params.language).Prompt.READING_TEMPLATE,
        )
        const templatePath = await FileTools.appendingHomeDirectory(
          ConstPath.UserPath + mapInfo.Template,
        )
        await params.getSymbolTemplates({
          path: templatePath,
          name: item.name,
        })
      } else {
        await params.setTemplate()
      }
      await SMap.openTaggingDataset(params.user.currentUser.userName)
      await params.getLayers(-1, async layers => {
        layers.map(layer => {
          if (layer.isVisible) {
            SMediaCollector.showMedia(layer.name, false)
          }
        })
        let _currentLayer = null
        // 默认设置第一个可见图层为当前图层
        for (let layer of layers) {
          if (
            layer.isVisible &&
            layer.type !== DatasetType.IMAGE &&
            layer.type !== DatasetType.MBImage
          ) {
            _currentLayer = layer
            break
          }
        }
        params.setCurrentLayer(_currentLayer)
      })

      // 检查是否有可显示的标注图层，并把多媒体标注显示到地图上
      SMap.getTaggingLayers(params.user.currentUser.userName).then(dataList => {
        dataList.forEach(item => {
          if (item.isVisible) {
            SMediaCollector.showMedia(item.name)
          }
        })
      })
      // 如果是标绘模块则加载标绘数据
      if (global.Type === ChunkType.MAP_PLOTTING) {
        const plotIconPath = await FileTools.appendingHomeDirectory(
          `${ConstPath.UserPath + params.user.currentUser.userName}/${
            ConstPath.RelativePath.Plotting
          }PlotLibData`,
        )
        await params.getSymbolPlots({
          path: plotIconPath,
          isFirst: true,
        })
      }

      params.setContainerLoading(false)
      params.setToolbarVisible(false)
    } else {
      params.getLayers(-1, layers => {
        params.setCurrentLayer(layers.length > 0 && layers[0])
      })
      Toast.show(ConstInfo.CHANGE_MAP_FAILED)
      params.setContainerLoading(false)
    }
    // })
  } catch (e) {
    Toast.show(ConstInfo.CHANGE_MAP_FAILED)
    params.setContainerLoading(false)
  }
}

async function listAction(type, params = {}) {
  const _params = ToolbarModule.getParams()
  switch (type) {
    case ConstToolType.SM_MAP_START_TEMPLATE:
      openTemplate(params.item)
      _params.getMapSetting()
      break
    case ConstToolType.SM_MAP_START_CHANGE:
      changeMap(params.item)
      _params.getMapSetting()
      break
  }
}

async function headerAction(type, section = {}) {
  const params = ToolbarModule.getParams()
  switch (section.title) {
    case getLanguage(params.language).Map_Main_Menu.CREATE_WITH_SYMBOLS: {
      const userPath =
        params.user.currentUser.userName &&
        params.user.currentUser.userType !== UserType.PROBATION_USER
          ? `${ConstPath.UserPath + params.user.currentUser.userName}/`
          : ConstPath.CustomerPath
      const mapPath = await FileTools.appendingHomeDirectory(
        userPath + ConstPath.RelativePath.Map,
      )
      const newName = await FileTools.getAvailableMapName(mapPath, 'DefaultMap')
      NavigationService.navigate('InputPage', {
        headerTitle: getLanguage(params.language).Map_Main_Menu.START_NEW_MAP,
        // '新建地图',
        value: newName,
        placeholder: getLanguage(params.language).Prompt.ENTER_MAP_NAME,
        type: 'name',
        cb: async value => {
          global.Loading &&
            global.Loading.setLoading(
              true,
              getLanguage(params.language).Prompt.CREATING,
              // ConstInfo.MAP_SYMBOL_COLLECTION_CREATING,
            )
          // 移除地图上所有callout
          SMediaCollector.removeMedias()
          await params.closeMap()
          params.setCollectionInfo() // 清空当前模板
          params.setCurrentTemplateInfo() // 清空当前模板
          params.setCurrentPlotInfo() // 清空模板
          params.setTemplate() // 清空模板

          // 重新打开工作空间，防止Resource被删除或破坏
          const customerPath =
            ConstPath.CustomerPath +
            ConstPath.RelativeFilePath.Workspace[
              global.language === 'CN' ? 'CN' : 'EN'
            ]
          let wsPath
          if (params.user.currentUser.userName) {
            const userWSPath = `${ConstPath.UserPath +
              params.user.currentUser.userName}/${
              ConstPath.RelativeFilePath.Workspace[
                global.language === 'CN' ? 'CN' : 'EN'
              ]
            }`
            wsPath = await FileTools.appendingHomeDirectory(userWSPath)
          } else {
            wsPath = await FileTools.appendingHomeDirectory(customerPath)
          }
          await params.openWorkspace({ server: wsPath })
          LayerUtils.openDefaultBaseMap()

          const layers = await params.getLayers()
          await SMap.openTaggingDataset(params.user.currentUser.userName)
          // 检查是否有可显示的标注图层，并把多媒体标注显示到地图上
          await SMap.getTaggingLayers(params.user.currentUser.userName).then(
            dataList => {
              dataList.forEach(item => {
                if (item.isVisible) {
                  SMediaCollector.showMedia(item.name)
                }
              })
            },
          )
          // 隐藏底图
          if (layers.length > 0) {
            await SMap.setLayerVisible(layers[layers.length - 1].path, true)
          }

          const moveToCurrentResult = await SMap.moveToCurrent()
          if (!moveToCurrentResult) {
            await SMap.moveToPoint({ x: 116.21, y: 39.42 })
          }
          await SMap.setScale(0.0000060635556556859582)

          params.saveMap &&
            (await params.saveMap({
              mapName: value,
              nModule: global.Type,
              notSaveToXML: true,
            }))

          global.Loading && global.Loading.setLoading(false)
          NavigationService.goBack()
          setTimeout(async () => {
            params.setToolbarVisible(false)
            if (global.legend) {
              await SMap.addLegendListener({
                legendContentChange: global.legend._contentChange,
              })
            }
            Toast.show(getLanguage(params.language).Prompt.CREATE_SUCCESSFULLY)
          }, 1000)
        },
      })
      break
    }
  }
}

async function openTemplate(item) {
  const params = ToolbarModule.getParams()
  const userPath =
    params.user.currentUser.userName &&
    params.user.currentUser.userType !== UserType.PROBATION_USER
      ? `${ConstPath.UserPath + params.user.currentUser.userName}/`
      : ConstPath.CustomerPath
  const mapPath = await FileTools.appendingHomeDirectory(
    userPath + ConstPath.RelativePath.Map,
  )
  const newName = await FileTools.getAvailableMapName(
    mapPath,
    item.name || 'DefaultName',
  )
  NavigationService.navigate('InputPage', {
    value: newName,
    headerTitle: getLanguage(params.language).Map_Main_Menu.START_NEW_MAP,
    // '新建地图',
    placeholder: getLanguage(params.language).Prompt.ENTER_MAP_NAME,
    type: 'name',
    cb: async (value = '') => {
      try {
        params.setContainerLoading &&
          params.setContainerLoading(
            true,
            getLanguage(params.language).Prompt.CREATING,
          )
        // 打开模板工作空间
        const moduleName = ''
        if (params.map.currentMap.name) {
          await params.closeMap()
        }
        // 移除地图上所有callout
        SMediaCollector.removeMedias()
        await params.setCurrentSymbols()
        params
          .importWorkspace({
            ...item,
            module: moduleName,
            mapName: value.toString().trim(),
          })
          .then(async ({ mapsInfo, msg }) => {
            if (msg) {
              params.setContainerLoading && params.setContainerLoading(false)
              Toast.show(msg)
            } else if (mapsInfo && mapsInfo.length > 0) {
              // 清除属性历史记录
              await params.clearAttributeHistory()
              // 关闭地图
              if (params.map.currentMap.name) {
                await params.closeMap()
              }
              global.clearMapData && global.clearMapData()
              // 打开地图
              const mapPath =
                (params.user && params.user.currentUser.userName
                  ? `${ConstPath.UserPath + params.user.currentUser.userName}/`
                  : ConstPath.CustomerPath) + ConstPath.RelativeFilePath.Map
              const mapInfo = await params.openMap({
                path: `${mapPath + mapsInfo[0]}.xml`,
                name: mapsInfo[0],
              })
              if (mapInfo) {
                if (mapInfo.Template) {
                  params.setContainerLoading(
                    true,
                    getLanguage(params.language).Prompt.READING_TEMPLATE,
                  )
                  const templatePath = await FileTools.appendingHomeDirectory(
                    ConstPath.UserPath + mapInfo.Template,
                  )
                  await params.getSymbolTemplates({
                    path: templatePath,
                    name: item.name,
                  })
                } else {
                  await params.setTemplate()
                }
                params.setToolbarVisible(false)
              } else {
                Toast.show(
                  getLanguage(params.language).Prompt.THE_MAP_IS_OPENED,
                )
              }

              // 添加底图
              let layers = await params.getLayers(-1)
              await params.setCurrentLayer(layers.length > 0 && layers[0])
              if (!LayerUtils.isBaseLayer(layers[layers.length - 1])) {
                await LayerUtils.openDefaultBaseMap()
                await params.getLayers(-1)
              }

              // 检查是否有可显示的标注图层，并把多媒体标注显示到地图上
              let taggingLayers = await SMap.getTaggingLayers(
                params.user.currentUser.userName,
              )
              for (let item of taggingLayers) {
                if (item.isVisible) {
                  await SMediaCollector.showMedia(item.name)
                }
              }

              // 没有标注图层,则默认打开一个
              if (taggingLayers.length === 0) {
                await SMap.openTaggingDataset(params.user.currentUser.userName)
              }

              // params.setContainerLoading(false)
              await params.mapMoveToCurrent()
              params.setContainerLoading(
                true,
                getLanguage(params.language).Prompt.READING_TEMPLATE,
              )
              await params.getSymbolTemplates(null)

              // 保存新建模板地图，若不保存，再次进入地图则没有底图
              await params.saveMap({
                mapName: mapsInfo[0],
              })

              params.setToolbarVisible(false)
              params.setContainerLoading && params.setContainerLoading(false)
              Toast.show(getLanguage(params.language).Prompt.CREATE_SUCCESSFULLY)
            } else {
              params.setContainerLoading && params.setContainerLoading(false)
              Toast.show(ConstInfo.CREATE_FAILED)
            }
          })
      } catch (error) {
        Toast.show(ConstInfo.CREATE_FAILED)
        params.setContainerLoading && params.setContainerLoading(false)
      }
      NavigationService.goBack()
      // setTimeout(async () => {
      // params.setToolbarVisible(false)
      if (global.legend) {
        await SMap.addLegendListener({
          legendContentChange: global.legend._contentChange,
        })
      }
      // Toast.show(getLanguage(params.language).Prompt.CREATE_SUCCESSFULLY)
      // ConstInfo.MAP_SYMBOL_COLLECTION_CREATED)
      // }, 1000)
    },
  })
}

export default {
  headerAction,
  listAction,
  isNeedToSave,
  openMap,
  openTemplateList,
  create,
  showHistory,
  saveMap,
  saveMapAs,
}
