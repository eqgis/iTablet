/**
 * 获取地图专题图数据
 */
import { STheme } from 'imobile_for_reactnative'
import { ConstToolType } from '../../../../../../constants'
import { FileTools } from '../../../../../../native'
import { getThemeAssets } from '../../../../../../assets'
import ToolbarModule from '../ToolbarModule'
import ThemeMenuData from './data'
import ThemeAction from './ThemeAction'
import ToolbarBtnType from '../../ToolbarBtnType'
import constants from '../../../../constants'

/**
 * 获取专题图操作
 * @param type
 * @param params
 * @returns {{data: Array, buttons: Array}}
 */
function getData(type, params) {
  let data = []
  let buttons = []
  let temp = {}
  ToolbarModule.setParams(params)
  switch (type) {
    case ConstToolType.SM_MAP_THEME_CREATE:
    case ConstToolType.SM_MAP_THEME_CREATE_BY_LAYER:
      temp = ThemeMenuData.getThemeMapCreate(type)
      data = temp.data
      buttons = temp.buttons
      break
    case ConstToolType.SM_MAP_THEME_PARAM:
    case ConstToolType.SM_MAP_THEME_PARAM_GRAPH:
      temp = ThemeMenuData.getThemeMapParam(type)
      data = temp.data
      buttons = temp.buttons
      break
    default:
      if (type.indexOf(`${ConstToolType.SM_MAP_THEME_PARAM_GRAPH}_`) > 0) {
        buttons = ThemeMenuData.getThemeFiveMenu()
      }
      break
  }
  return { data, buttons }
}

async function getDatasets(type, params = {}) {
  let buttons = []
  let data = []

  if (type === ConstToolType.SM_MAP_ADD_DATASET) {
    const selectList =
      (ToolbarModule.getData() && ToolbarModule.getData().selectList) || []
    const path = await FileTools.appendingHomeDirectory(params.path)
    const list = await STheme.getUDBName(path)

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
        // image: require('../../../../../../assets/mapToolbar/list_type_udb.png'),
        image: getThemeAssets().dataType.icon_data_source,
        data: list,
        allSelectType: true,
      },
    ]

    buttons = [ToolbarBtnType.TOOLBAR_BACK, ToolbarBtnType.TOOLBAR_COMMIT]
  }
  return { data, buttons }
}

function getMenuData(type, themeType) {
  let data = []
  if (type.indexOf('SM_MAP_THEME_PARAM') === -1) return data
  // 切换到menu，保留themeParams，用于保存专题参数
  // 切换到menu，保留mapXml，用于还原专题图
  // 切换到menu，保留themeCreateType，用于修改专题图
  const { themeParams, mapXml, themeCreateType } = ToolbarModule.getData()
  const moduleData = {
    type,
    getData,
    actions: ThemeAction,
    themeParams,
  }
  if (themeParams) {
    Object.assign(moduleData, themeParams)
  }
  if (mapXml) {
    Object.assign(moduleData, { mapXml })
  }
  if (themeCreateType) {
    Object.assign(moduleData, { themeCreateType })
  }
  ToolbarModule.setData(moduleData)
  if (themeType === constants.THEME_UNIQUE_STYLE) {
    data = ThemeMenuData.uniqueMenuInfo(global.language)
  } else if (themeType === constants.THEME_RANGE_STYLE) {
    data = ThemeMenuData.rangeMenuInfo(global.language)
  } else if (themeType === constants.THEME_UNIFY_LABEL) {
    data = ThemeMenuData.labelMenuInfo(global.language)
  } else if (themeType === constants.THEME_UNIQUE_LABEL) {
    data = ThemeMenuData.uniqueLabelMenuInfo(global.language)
  } else if (themeType === constants.THEME_RANGE_LABEL) {
    data = ThemeMenuData.rangeLabelMenuInfo(global.language)
  } else if (themeType === constants.THEME_GRAPH_STYLE) {
    data = ThemeMenuData.graphMenuInfo(global.language)
  } else if (themeType === constants.THEME_DOT_DENSITY) {
    data = ThemeMenuData.dotDensityMenuInfo(global.language)
  } else if (themeType === constants.THEME_GRADUATED_SYMBOL) {
    data = ThemeMenuData.graduatedSymbolMenuInfo(global.language)
  } else if (themeType === constants.THEME_GRID_UNIQUE) {
    data = ThemeMenuData.gridUniqueMenuInfo(global.language)
  } else if (themeType === constants.THEME_GRID_RANGE) {
    data = ThemeMenuData.gridRangeMenuInfo(global.language)
  } else if (themeType === constants.THEME_HEATMAP) {
    data = ThemeMenuData.heatmapMenuInfo(global.language)
  }
  return data
}

export default {
  getData,
  getMenuData,
  getDatasets,
}
