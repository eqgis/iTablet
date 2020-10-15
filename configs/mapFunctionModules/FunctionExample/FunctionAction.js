import React from 'react'
import { Text, View } from 'react-native'
import { SMap, SMediaCollector } from 'imobile_for_reactnative'
import { FileTools } from '../../../src/native'
import { color, size } from '../../../src/styles'
import {
  ConstToolType,
  ConstInfo,
  ConstPath,
  ToolbarType,
  ChunkType,
} from '../../../src/constants'
import { Toast, scaleSize } from '../../../src/utils'
import { getLanguage } from '../../../src/language'
import ToolbarModule from '../../../src/containers/workspace/components/ToolBar/modules/ToolbarModule'

//定位当位置
function location() {
  //step1:移动到当前位置
  SMap.moveToCurrent()
  //step2:获取定位信息
  setTimeout(()=>{
    SMap.getCurrentLocation().then(({longitude,latitude})=>{
      Toast.show("当前位置("+longitude+","+latitude+")",{position: Toast.POSITION.TOP,duration:3500})
    })
  },2000)

  const _params = ToolbarModule.getParams()
  _params.setToolbarVisible(false)
}
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
          ? require('../../../src/assets/mapToolbar/list_type_template_black.png')
          : require('../../../src/assets/mapToolbar/list_type_map_black.png')
        item.info = {
          infoType: 'mtime',
          lastModifiedDate: item.mtime,
          isTemplate: item.isTemplate,
        }
        if (_params.map.currentMap.name === item.name) {
          item.rightView = (
            <View
              style={{
                height: scaleSize(30),
                width: scaleSize(120),
                borderRadius: scaleSize(4),
                backgroundColor: color.bgG,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: scaleSize(30),
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
          )
        }
        userList.push(item)
      })
    }
    data.push({
      title: getLanguage(global.language).Map_Main_Menu.OPEN_MAP,
      // '我的地图',
      image: require('../../../src/assets/mapToolbar/list_type_maps.png'),
      data: userFileList || [],
    })
    _params.setToolbarVisible(true, ConstToolType.MAP_CHANGE, {
      containerType: ToolbarType.list,
      data,
    })
  })()
}

/** 切换地图 * */
async function changeMap(item) {
  const params = ToolbarModule.getParams()
  try {
    if (params.map.currentMap && params.map.currentMap.path === item.path) {
      Toast.show(getLanguage(params.language).Prompt.THE_MAP_IS_OPENED)
      // ConstInfo.MAP_ALREADY_OPENED)
      return
    }
    params.setMap2Dto3D(false)
    params.setOpenOnlineMap(true)
    params.setContainerLoading(
      true,
      getLanguage(params.language).Prompt.SWITCHING,
      // ConstInfo.MAP_CHANGING
    )
    if (params.map.currentMap.name) {
      await SMap.removeLegendListener()
      await params.closeMap()
    }
    // 移除地图上所有callout
    SMediaCollector.removeMedias()
    GLOBAL.clearMapData && GLOBAL.clearMapData()
    // 清除属性历史记录
    await params.clearAttributeHistory()
    await params.setCurrentSymbols()
    const mapInfo = await params.openMap({ ...item })
    if (mapInfo) {
      Toast.show(
        getLanguage(params.language).Prompt.SWITCHING_SUCCESS,
        // ConstInfo.CHANGE_MAP_TO + mapInfo.name
      )
      if (GLOBAL.Type === ChunkType.MAP_NAVIGATION) {
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
      if (GLOBAL.legend) {
        await SMap.addLegendListener({
          legendContentChange: GLOBAL.legend._contentChange,
        })
      }
      GLOBAL.scaleView && GLOBAL.scaleView.getInitialData()
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
        params.setCurrentLayer(layers.length > 0 && layers[0])
        // 若没有底图，默认添加地图
        // if (LayerUtils.getBaseLayers(layers).length > 0) {
        //   await SMap.openDatasource(
        //     ConstOnline['Google'].DSParams, GLOBAL.Type === ChunkType.MAP_COLLECTION
        //       ? 1 : ConstOnline['Google'].layerIndex, false)
        // }
        // if (!LayerUtils.isBaseLayer(layers[layers.length - 1].caption)) {
        //   await LayerUtils.addBaseMap(
        //     layers,
        //     ConstOnline['Google'],
        //     GLOBAL.Type === ChunkType.MAP_COLLECTION
        //       ? 1
        //       : ConstOnline['Google'].layerIndex,
        //     false,
        //   )
        //   await params.getLayers(-1)
        // }
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
      if (GLOBAL.Type === ChunkType.MAP_PLOTTING) {
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
      params.setMap2Dto3D(true)
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
    case ConstToolType.MAP_CHANGE:
      changeMap(params.item)
      _params.getMapSetting()
      break
  }
}

export default {
  location,
  openMap,
  listAction,
}
