/**
 * 添加 数据
 */
import { SThemeCartography, SMap, SMSymbolTable } from 'imobile_for_reactnative'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { FileTools } from '../../../../../../native'
import { dataUtil, scaleSize } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import ToolbarBtnType from '../../ToolbarBtnType'
import ToolbarModule from '../ToolbarModule'
import DataHandler from '../../../../../tabs/Mine/DataHandler'
import { TreeList } from '../../../../../../components'
import NavigationService from '../../../../../NavigationService'
import React from 'react'
import { color } from '../../../../../../styles'
import { View } from 'react-native'
import AddAction from './AddAction'
import Toast from 'react-native-root-toast'

/**
 * 获取数据源和地图菜单
 * @returns {Promise.<void>}
 */
async function getUDBsAndMaps() {
  let data = []
  const buttons = [ToolbarBtnType.CANCEL]
  // 过滤掉标注和标绘匹配正则
  const checkLabelAndPlot = /^(Label_|PlotEdit_(.*)@)(.*)((#$)|(#_\d+$)|(##\d+$))/
  let user = ToolbarModule.getParams().user.currentUser

  let userUDBs = await DataHandler.getLocalData(user, 'DATA')
  // 过滤掉标注和标绘
  const filterUDBs = userUDBs.filter(item => {
    item.name = dataUtil.getNameByURL(item.path)
    return !item.name.match(checkLabelAndPlot)
  })
  filterUDBs.map(item => {
    item.image = require('../../../../../../assets/mapToolbar/list_type_udb_black.png')
    if (item.isDirectory) {
      item.image = require('../../../../../../assets/Mine/mine_my_local_data.png')
    }
    item.info = {
      infoType: 'mtime',
      lastModifiedDate: item.mtime,
    }
  })

  let mapData = await DataHandler.getLocalData(user, 'MAP')
  mapData.forEach(item => {
    item.image = require('../../../../../../assets/mapToolbar/list_type_map_black.png')
    item.info = {
      infoType: 'mtime',
      lastModifiedDate: item.mtime,
    }
    item.name = dataUtil.getNameByURL(item.path)
  })

  let symbol = await DataHandler.getLocalData(user, 'SYMBOL')
  symbol.forEach(item => {
    let name = item.name.substring(0, item.name.lastIndexOf('.'))
    let type = item.name.substring(item.name.lastIndexOf('.') + 1).toLowerCase()
    let image
    switch (type) {
      case 'sym':
        image = require('../../../../../../assets/map/icon-shallow-dot_black.png')
        break
      case 'lsl':
        image = require('../../../../../../assets/map/icon-shallow-line_black.png')
        break
      case 'bru':
        image = require('../../../../../../assets/map/icon-shallow-polygon_black.png')
        break
      default:
        image = require('../../../../../../assets/mapToolbar/list_type_map_black.png')
        break
    }
    item.name = name
    item.image = image
    item.info = {
      infoType: 'mtime',
      lastModifiedDate: item.mtime,
    }
  })

  data = [
    {
      title: getLanguage(ToolbarModule.getParams().language).Map_Main_Menu
        .OPEN_DATASOURCE,
      // Const.DATA_SOURCE,
      image: require('../../../../../../assets/mapToolbar/list_type_udbs.png'),
      data: filterUDBs,
      addDatasource: true,
      // getDatasource: getUDBsAndMaps,
      extraData: {
        image: require('../../../../../../assets/mapTools/icon_add_white.png'),
        action: () => {
          NavigationService.navigate('MyDatasource', {
            title: getLanguage(global.language).Profile.DATA,
            from: 'MapView',
            exitCallback: async () => {
              const params = ToolbarModule.getParams()
              const _data = await getUDBsAndMaps()
              const containerType = ToolbarType.list
              const data = ToolbarModule.getToolbarSize(containerType, {})
              params.showFullMap && params.showFullMap(true)
              params.setToolbarVisible(true, ConstToolType.MAP_ADD, {
                containerType,
                isFullScreen: true,
                isTouchProgress: false,
                showMenuDialog: false,
                ...data,
                ..._data,
              })
            },
          })
        },
      },
    },
    {
      title: getLanguage(ToolbarModule.getParams().language).Map_Main_Menu
        .OPEN_MAP,
      // Const.MAP,
      image: require('../../../../../../assets/mapToolbar/list_type_map.png'),
      data: mapData,
    },
    {
      title: getLanguage(ToolbarModule.getParams().language).Profile.SYMBOL,
      image: require('../../../../../../assets/mapToolbar/list_type_udbs.png'),
      data: symbol,
    },
  ]

  return { data, buttons }
}

async function getDatasets(type, params = {}) {
  let buttons = []
  let data = []

  if (type === ConstToolType.MAP_THEME_ADD_DATASET) {
    const selectList =
      (ToolbarModule.getData() && ToolbarModule.getData().selectList) || []
    const path = await FileTools.appendingHomeDirectory(params.path)
    let list = await SThemeCartography.getUDBName(path)

    //过滤属性表
    list = list.filter(item => item.datasetType !== 'TABULAR')
    list.forEach(_params => {
      if (_params.geoCoordSysType && _params.prjCoordSysType) {
        _params.info = {
          infoType: 'dataset',
          geoCoordSysType: _params.geoCoordSysType,
          prjCoordSysType: _params.prjCoordSysType,
        }
      }
      if (
        Object.keys(selectList).length > 0 &&
        selectList[params.name] !== undefined &&
        selectList[params.name].length > 0
      ) {
        // for (let item of selectList[params.name]) {
        //   _params.isSelected = Object.keys(item)[0] === _params.datasetName
        // }
        _params.isSelected = selectList[params.name][_params.datasetName]
      }
    })
    const arr = params.name.split('.')
    const alias = arr[0]
    data = [
      {
        title: alias,
        image: require('../../../../../../assets/mapToolbar/list_type_udb.png'),
        data: list,
      },
    ]

    buttons = [ToolbarBtnType.TOOLBAR_BACK, ToolbarBtnType.TOOLBAR_COMMIT]
  }
  return { data, buttons }
}

async function getSymbolPath() {
  let buttons = [ToolbarBtnType.TOOLBAR_BACK]

  let filePath = ToolbarModule.getData().currentSymbolFile
  let groups = await SMap.findAllSymbolGroupFromFile(filePath)

  let customView = () => (
    <TreeList
      style={{
        flex: 1,
        paddingHorizontal: scaleSize(30),
        backgroundColor: color.bgW,
      }}
      itemTextColor={color.themeText2}
      data={groups}
      onPress={({ data }) => {
        AddAction.onSelectPath(data.path)
      }}
    />
  )

  return { buttons, customView }
}

async function getSymbolsFromFile() {
  let { currentSymbolFile, currentSymbolPath } = ToolbarModule.getData()
  let params = ToolbarModule.getParams()
  let buttons = [ToolbarBtnType.TOOLBAR_BACK]
  let customView = () => (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: color.bgW,
      }}
    >
      <SMSymbolTable
        style={{
          flex: 1,
          paddingHorizontal: scaleSize(30),
          alignItems: 'center',
          backgroundColor: color.bgW,
        }}
        source={{
          filePath: currentSymbolFile,
          path: currentSymbolPath,
        }}
        tableStyle={{
          orientation: 1,
          textSize: 15,
          lineSpacing: 10,
          imageSize: 40,
          count: params.device.orientation.indexOf('LANDSCAPE') === 0 ? 3 : 4,
          legendBackgroundColor: dataUtil.colorRgba(color.bgW),
          textColor: dataUtil.colorRgba(color.font_color_white),
        }}
        onSymbolClick={async data => {
          let params = ToolbarModule.getParams()
          let mapName = params.map.currentMap.name
          let isEixst = await SMap.isInSymbolLib(data.type, data.id)
          let addSymbol = async (mapName, filePath, id, isReplace) => {
            let result = await SMap.addSymbolFromFile(
              mapName,
              filePath,
              id,
              isReplace,
            )
            Toast.show(
              result
                ? getLanguage(global.language).Prompt.ADD_SUCCESS
                : getLanguage(global.language).Prompt.ADD_FAILED,
            )
          }
          if (!isEixst) {
            addSymbol(mapName, currentSymbolFile, data.id, false)
          } else {
            GLOBAL.SimpleDialog.set({
              text: getLanguage(global.language).Prompt.OVERRIDE_SYMBOL,
              confirmAction: () =>
                addSymbol(mapName, currentSymbolFile, data.id, true),
              cancelAction: () =>
                addSymbol(mapName, currentSymbolFile, data.id, false),
              confirmText: getLanguage(global.language).Prompt.YES,
              cancelText: getLanguage(global.language).Prompt.NO,
            })
            GLOBAL.SimpleDialog.setVisible(true)
          }
        }}
      />
    </View>
  )

  return { buttons, customView }
}

async function getData(type, params = {}) {
  switch (type) {
    case ConstToolType.MAP_THEME_ADD_DATASET:
      return getDatasets(type, params)
    case ConstToolType.MAP_ADD:
      return await getUDBsAndMaps()
    case 'ADD_SYMBOL_PATH':
      return await getSymbolPath()
    case 'ADD_SYMBOL_SYMBOLS':
      return await getSymbolsFromFile()
  }
}

export default {
  getData,
}
