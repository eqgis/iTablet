import {
  Action,
  Point2D,
  ThemeUnique,
  ColorGradientType,
  ThemeRange,
  RangeMode,
  ThemeLabel,
  TextStyle,
  TextAlignment,
} from 'imobile_for_reactnative'
import NavigationService from '../containers/NavigationService'
import { ConstOnline, AudioKeywords } from '../constants'
import { Toast, dataUtil } from '.'

const { keywords, chineseNumber, themeType } = AudioKeywords
let workspace
let mapControl
let map
let nav = {}

/**
 * 地图相关必须设置
 * @param data
 */
function setConfig(data) {
  if (data.workspace) {
    workspace = data.workspace
  }
  if (data.mapControl) {
    mapControl = data.mapControl
  }
  if (data.map) {
    map = data.map
  }
  if (data.nav) {
    nav = data.nav
  }
}

function analyst(content = '', obj = {}) {
  if (!content) return
  let value = ''
  let index = -1
  let type = ''
  const values = Object.values(keywords)
  for (let i = 0; i < values.length; i++) {
    if (content.indexOf(values[i]) >= 0) {
      value = values[i]
      break
    }
  }
  switch (value) {
    case keywords.Baidu:
      GLOBAL.AudioDialog.setVisible(false)
      goToMapView('Baidu')
      break
    case keywords.Google:
      GLOBAL.AudioDialog.setVisible(false)
      goToMapView('Google')
      break
    case keywords.OSM:
      GLOBAL.AudioDialog.setVisible(false)
      goToMapView('OSM')
      break
    case keywords.TD:
      GLOBAL.AudioDialog.setVisible(false)
      goToMapView('TD')
      break
    case keywords.THEME:
      index = getIndex(content)
      if (index >= 0) {
        type = getThmeType(content)
        setThemeByIndex(index, type)
      } else {
        openThemeByLayer(obj.layer)
      }
      break
  }
}

function getIndex(content) {
  let num = -1
  let cNum = ''
  let numStr = ''
  const startKey = '第'
  const startKeyIndex = content.indexOf(startKey)
  if (startKeyIndex < 0) return -1
  for (let i = startKeyIndex + 1; i < content.length; i++) {
    if (!isNaN(parseInt(content[i]))) {
      numStr += content[i]
    } else if (chineseNumber[content[i]]) {
      cNum += chineseNumber[content[i]]
    } else {
      break
    }
  }
  if (!cNum && !numStr) return -1
  if (numStr) {
    num = parseInt(numStr)
  } else if (cNum) {
    num = dataUtil.ChineseToNumber(cNum)
  }
  return num
}

function getThmeType(content) {
  const values = Object.values(themeType)
  for (let i = 0; i < values.length; i++) {
    if (content.indexOf(values[i]) >= 0) {
      return values[i]
    }
  }
}

/**
 * 打开矢量工作区
 * @param type
 */
function goToMapView(type) {
  ;(async function() {
    let key = ''
    let exist = false
    const { routes } = nav
    if (routes && routes.length > 0) {
      for (let index = 0; index < routes.length; index++) {
        if (routes[index].routeName === 'MapView') {
          key = index === routes.length - 1 ? '' : routes[index + 1].key
          exist = true
          break
        }
      }
    }

    if (exist && workspace && mapControl && map) {
      await map.close()
      await workspace.closeAllDatasource()
      const point2dModule = new Point2D()

      await map.setScale(0.0001)
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        ;(async () => {
          const centerPoint = await point2dModule.createObj(lon, lat)
          await map.setCenter(centerPoint)
          await map.viewEntire()
          await mapControl.setAction(Action.PAN)
          await map.refresh()
          key && NavigationService.goBack(key)
        })()
      })
      const { DSParams } = ConstOnline[type]
      const { labelDSParams } = ConstOnline[type]
      const { layerIndex } = ConstOnline[type]

      const dsBaseMap = await workspace.openDatasource(DSParams)

      const dataset = await dsBaseMap.getDataset(layerIndex)
      await map.addLayer(dataset, true)

      if (ConstOnline[type].labelDSParams) {
        const dsLabel = await workspace.openDatasource(labelDSParams)
        await map.addLayer(await dsLabel.getDataset(layerIndex), true)
      }
    } else {
      NavigationService.navigate('MapView', { wsData: ConstOnline[type] })
    }
  })()
}

/**
 * 打开专题图
 * 需要在一个地图工作区，并且选中一个对象
 * @param layer
 */
function openThemeByLayer(data) {
  if (!workspace || !mapControl || !map) {
    Toast.show('请先打开地图工作区')
    return
  }
  if (!data || !data.id) {
    Toast.show('请指定一个编辑图层')
    return
  }
  GLOBAL.AudioDialog.setVisible(false)
  NavigationService.navigate('ThemeEntry', {
    layer: data.layer,
    map,
    mapControl,
  })
}

/**
 * 设置专题图
 * 需要在一个地图工作区
 * @param layer
 */
function setThemeByIndex(index, type = '') {
  if (!workspace || !mapControl || !map) {
    Toast.show('请先打开地图工作区')
    return
  }
  ;(async function() {
    const layer = await map.getLayer(index)
    switch (type) {
      case themeType.UNIQUE:
        setUniqueTheme(layer)
        break
      case themeType.RANGE:
        setRangeTheme(layer)
        break
      case themeType.LABEL:
        setLabelTheme(layer)
        break
      default:
        // 若不指定专题图类型，则跳转到选择专题图类型界面
        NavigationService.navigate('ThemeEntry', {
          // title: Const.UNIQUE,
          layer,
          map,
          mapControl,
        })
        GLOBAL.AudioDialog.setVisible(false)
        break
    }
  })()
}

/**
 * 设置单值专题图
 * @param layer
 */
function setUniqueTheme(layer) {
  ;(async function() {
    try {
      const dataset = await layer.getDataset()
      const datasetVector = await dataset.toDatasetVector()
      const themeUnique = await new ThemeUnique().makeDefault(
        datasetVector,
        'SmID',
        ColorGradientType.YELLOWRED,
      )
      await map.addThemeLayer(dataset, themeUnique, true)
      await map.refresh()
      await mapControl.setAction(Action.PAN)
      Toast.show('设置单值专题图成功')
    } catch (e) {
      Toast.show('设置单值专题图失败')
    }
  })()
}

/**
 * 设置分段专题图
 * @param layer
 */
function setRangeTheme(layer) {
  ;(async function() {
    try {
      const dataset = await layer.getDataset()
      const datasetVector = await dataset.toDatasetVector()
      const themeRange = await new ThemeRange().makeDefault(
        datasetVector,
        'SmID',
        RangeMode.EQUALINTERVAL,
        5,
        ColorGradientType.CYANGREEN,
      )
      await map.addThemeLayer(dataset, themeRange, true)
      await map.refresh()
      await mapControl.setAction(Action.PAN)
      Toast.show('设置分段专题图成功')
    } catch (e) {
      Toast.show('设置分段专题图失败')
    }
  })()
}

/**
 * 设置标签专题图
 * @param layer
 */
function setLabelTheme(layer) {
  ;(async function() {
    try {
      const dataset = await layer.getDataset()
      const themeLabel = await new ThemeLabel().createObj()
      const textStyle = await new TextStyle().createObj()
      await textStyle.setForeColor(0, 255, 0, 1)
      await textStyle.setFontName('微软雅黑')
      await textStyle.setAlignment(TextAlignment.MIDDLECENTER)
      await themeLabel.setUniformStyle(textStyle)
      await map.addThemeLayer(dataset, themeLabel, true)
      await map.refresh()
      await mapControl.setAction(Action.PAN)
      Toast.show('设置标签专题图成功')
    } catch (e) {
      Toast.show('设置标签专题图失败')
    }
  })()
}

export default {
  analyst,
  setConfig,
  goToMapView,
}
