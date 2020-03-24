/**
 * 添加 数据
 */
import { SThemeCartography, SMap, EngineType } from 'imobile_for_reactnative'
import { ConstToolType, ConstPath, UserType } from '../../../../../../constants'
import { FileTools } from '../../../../../../native'
import { dataUtil } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import ToolbarBtnType from '../../ToolbarBtnType'
import ToolbarModule from '../ToolbarModule'

/**
 * 获取数据源和地图菜单
 * @returns {Promise.<void>}
 */
async function getUDBsAndMaps() {
  let data = []
  const buttons = [ToolbarBtnType.CANCEL]
  let userUDBPath
  let userUDBs
  // 过滤掉标注和标绘匹配正则
  const checkLabelAndPlot = /^(Label_|PlotEdit_(.*)@)(.*)((#$)|(#_\d+$)|(##\d+$))/
  if (
    ToolbarModule.getParams().user &&
    ToolbarModule.getParams().user.currentUser.userName &&
    ToolbarModule.getParams().user.currentUser.userType !==
      UserType.PROBATION_USER
  ) {
    const userPath = `${(await FileTools.appendingHomeDirectory(
      ConstPath.UserPath,
    )) + ToolbarModule.getParams().user.currentUser.userName}/`
    userUDBPath = userPath + ConstPath.RelativePath.Datasource
    userUDBs = await FileTools.getPathListByFilter(userUDBPath, {
      extension: 'udb',
      type: 'file',
    })
    // 过滤掉标注和标绘
    const filterUDBs = userUDBs.filter(item => {
      item.name = dataUtil.getNameByURL(item.path)
      return !item.name.match(checkLabelAndPlot)
    })
    filterUDBs.map(item => {
      item.image = require('../../../../../../assets/mapToolbar/list_type_udb_black.png')
      item.info = {
        infoType: 'mtime',
        lastModifiedDate: item.mtime,
      }
    })

    const mapData = await FileTools.getPathListByFilter(
      userPath + ConstPath.RelativePath.Map,
      {
        extension: 'xml',
        type: 'file',
      },
    )
    mapData.forEach(item => {
      item.image = require('../../../../../../assets/mapToolbar/list_type_map_black.png')
      item.info = {
        infoType: 'mtime',
        lastModifiedDate: item.mtime,
      }
      item.name = dataUtil.getNameByURL(item.path)
    })

    data = [
      // {
      //   title: Const.PUBLIC_DATA_SOURCE,
      //   data: customerUDBs,
      // },
      {
        title: getLanguage(ToolbarModule.getParams().language).Map_Main_Menu
          .OPEN_DATASOURCE,
        // Const.DATA_SOURCE,
        image: require('../../../../../../assets/mapToolbar/list_type_udbs.png'),
        data: filterUDBs,
      },
      {
        title: getLanguage(ToolbarModule.getParams().language).Map_Main_Menu
          .OPEN_MAP,
        // Const.MAP,
        image: require('../../../../../../assets/mapToolbar/list_type_map.png'),
        data: mapData,
      },
    ]
  } else {
    const customerUDBPath = await FileTools.appendingHomeDirectory(
      ConstPath.CustomerPath + ConstPath.RelativePath.Datasource,
    )
    const customerUDBs = await FileTools.getPathListByFilter(customerUDBPath, {
      extension: 'udb',
      type: 'file',
    })
    // 过滤掉标注和标绘
    const filterUDBs = customerUDBs.filter(item => {
      item.name = dataUtil.getNameByURL(item.path)
      return !item.name.match(checkLabelAndPlot)
    })
    filterUDBs.map(item => {
      item.image = require('../../../../../../assets/mapToolbar/list_type_udb_black.png')
      item.info = {
        infoType: 'mtime',
        lastModifiedDate: item.mtime,
      }
    })
    const customerPath = await FileTools.appendingHomeDirectory(
      ConstPath.CustomerPath,
    )
    const mapData = await FileTools.getPathListByFilter(
      customerPath + ConstPath.RelativePath.Map,
      {
        extension: 'xml',
        type: 'file',
      },
    )
    mapData.forEach(item => {
      item.image = require('../../../../../../assets/mapToolbar/list_type_map_black.png')
      item.info = {
        infoType: 'mtime',
        lastModifiedDate: item.mtime,
      }
      item.name = dataUtil.getNameByURL(item.path)
    })
    data = [
      {
        title: getLanguage(ToolbarModule.getParams().language).Map_Main_Menu
          .OPEN_DATASOURCE,
        // Const.DATA_SOURCE,
        image: require('../../../../../../assets/mapToolbar/list_type_udbs.png'),
        data: filterUDBs,
        addDatasource: true,
        getDatasource: getUDBsAndMaps,
      },
      {
        title: getLanguage(ToolbarModule.getParams().language).Map_Main_Menu
          .OPEN_MAP,
        // Const.MAP,
        image: require('../../../../../../assets/mapToolbar/list_type_map.png'),
        data: mapData,
      },
    ]
  }
  return { data, buttons }
}

async function getDatasets(type, params = {}) {
  let buttons = []
  let data = []

  if (type === ConstToolType.MAP_THEME_ADD_DATASET) {
    const selectList =
      (ToolbarModule.getData() && ToolbarModule.getData().selectList) || []
    const path = await FileTools.appendingHomeDirectory(params.path)
    const list = await SThemeCartography.getUDBName(path)

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

async function getData(type, params = {}) {
  switch (type) {
    case ConstToolType.MAP_THEME_ADD_DATASET:
      return getDatasets(type, params)
    case ConstToolType.MAP_ADD:
      return await getUDBsAndMaps()
  }
}

export default {
  getData,
}
