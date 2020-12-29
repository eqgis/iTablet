import { ConstToolType, Const } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import Utils from '../../utils'
import ToolbarModule from '../ToolbarModule'
import LegendData from './LegendData'

// 改变图例组件的显隐
function changeLegendVisible() {
  const _params = ToolbarModule.getParams()
  const legendData = _params.mapLegend
  const type = ConstToolType.SM_MAP_LEGEND
  legendData[GLOBAL.Type].isShow = !legendData[GLOBAL.Type].isShow
  const { data, buttons } = LegendData.getData(type)
  GLOBAL.ToolBar &&
    GLOBAL.ToolBar.setState({
      // type,
      data,
      buttons,
    })
  _params.setMapLegend && _params.setMapLegend(legendData)
}

function commit() {
  const _params = ToolbarModule.getParams()
  _params.setToolbarVisible(false)
}

function close() {
  const _params = ToolbarModule.getParams()
  _params.setToolbarVisible(false)
}

function menu(type, selectKey, params = {}) {
  let isFullScreen
  let showMenuDialog
  let isTouchProgress
  const showBox = function() {
    if (
      type === ConstToolType.SM_MAP_LEGEND ||
      type === ConstToolType.SM_MAP_LEGEND_POSITION
    ) {
      params.showBox && params.showBox()
    }
  }

  const setData = function() {
    const buttons = LegendData.getButtons(type)
    params.setData &&
      params.setData({
        isFullScreen,
        showMenuDialog,
        isTouchProgress,
        buttons,
      })
  }

  if (Utils.isTouchProgress(selectKey)) {
    isFullScreen = true
    showMenuDialog = !GLOBAL.ToolBar.state.showMenuDialog
    isTouchProgress = GLOBAL.ToolBar.state.showMenuDialog
    setData()
  } else {
    isFullScreen = !GLOBAL.ToolBar.state.showMenuDialog
    showMenuDialog = !GLOBAL.ToolBar.state.showMenuDialog
    isTouchProgress = false
    if (!GLOBAL.ToolBar.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }
}

function showMenuBox(type, selectKey, params = {}) {
  if (type.indexOf('LEGEND') !== -1) {
    if (Utils.isTouchProgress(selectKey)) {
      params.setData &&
        params.setData({
          isTouchProgress: !GLOBAL.ToolBar.state.isTouchProgress,
          showMenuDialog: false,
          isFullScreen: !GLOBAL.ToolBar.state.isTouchProgress,
        })
    } else if (!GLOBAL.ToolBar.state.showMenuDialog) {
      params.showBox && params.showBox()
    } else {
      params.setData &&
        params.setData({
          showMenuDialog: false,
          isFullScreen: false,
        })
      params.showBox && params.showBox()
    }
    return
  }
}

function tableAction(type, item = {}) {
  const _params = ToolbarModule.getParams()
  const legendData = JSON.parse(JSON.stringify(_params.mapLegend))
  legendData[GLOBAL.Type].backgroundColor = item.background
  _params.setMapLegend && _params.setMapLegend(legendData)
}

function cancelSelect() {
  // const _params = ToolbarModule.getParams()

  // const legendData = _params.mapLegend
  const type = ConstToolType.SM_MAP_LEGEND
  let isFullScreen = !GLOBAL.ToolBar.state.showMenuDialog
  let showMenuDialog = !GLOBAL.ToolBar.state.showMenuDialog
  let isTouchProgress = false
  const { data, buttons } = LegendData.getData(type)
  const setData = function() {
    GLOBAL.ToolBar &&
      GLOBAL.ToolBar.setState(
        {
          // type,
          data,
          isFullScreen,
          showMenuDialog,
          isTouchProgress,
          buttons,
        },
        () => {
          GLOBAL.ToolBar.updateOverlayView()
        },
      )
  }
  // 先滑出box，再显示Menu
  GLOBAL.ToolBar && GLOBAL.ToolBar.showBox()
  setTimeout(setData, Const.ANIMATED_DURATION_2)
}

function changePosition(params) {
  const _params = ToolbarModule.getParams()
  const legendData = JSON.parse(JSON.stringify(_params.mapLegend))
  legendData[GLOBAL.Type].legendPosition =
    params[0].selectedItem && params[0].selectedItem.value
  _params.setMapLegend(legendData)
}

let timer
function debounce(fn) {
  if (timer) {
    clearTimeout(this.timer)
  }
  timer = setTimeout(() => {
    fn()
    clearTimeout(timer)
    timer = null
  }, 100)
}

function _setMapLegend(data) {
  const _params = ToolbarModule.getParams()
  if (_params.setMapLegend) {
    debounce(() => _params.setMapLegend(data))
  }
}

/**
 * @author ysl
 * 获取Touchprogress的初始信息
 * @param title
 * @returns {Promise.<{
 * title,                   提示消息标题
 * value: number,           当前值
 * tips: string,            当前信息
 * range: [number,number],  步长 最小改变单位,默认值1
 * step: number,            数值范围
 * unit: string             单位（可选）
 * }>}
 */
async function getTouchProgressInfo(title) {
  const _params = ToolbarModule.getParams()
  // const _data = ToolbarModule.getData()
  let legendSettings = _params.mapLegend
  // let event = _data.event
  let tips = ''
  let range = [1, 100]
  let value = 0
  let step = 1
  let unit = ''
  // let title = GLOBAL.toolBox?.state?.selectName
  switch (title) {
    //线宽 边框宽度
    case getLanguage(GLOBAL.language).Map_Main_Menu.LEGEND_COLUMN:
      value = legendSettings[GLOBAL.Type].column
      range = [1, 4]
      break
    case getLanguage(GLOBAL.language).Map_Main_Menu.LEGEND_WIDTH:
      range = [20, 100]
      value = legendSettings[GLOBAL.Type].widthPercent
      break
    //符号大小
    case getLanguage(GLOBAL.language).Map_Main_Menu.LEGEND_HEIGHT:
      range = [20, 100]
      value = legendSettings[GLOBAL.Type].heightPercent
      break
    //旋转角度
    case getLanguage(GLOBAL.language).Map_Main_Menu.LEGEND_ICON:
      range = [10, 100]
      value = legendSettings[GLOBAL.Type].imagePercent
      break
    //透明度
    case getLanguage(GLOBAL.language).Map_Main_Menu.LEGEND_FONT:
      range = [10, 100]
      value = legendSettings[GLOBAL.Type].fontPercent
      break
  }
  return { title, value, tips, range, step, unit }
}

/**
 * @author ysl
 * 设置TouchProgress的值到地图对应的属性
 * @param title
 * @param value
 */
function setTouchProgressInfo(title, value) {
  const _params = ToolbarModule.getParams()
  // let legendSettings = {..._params.mapLegend}
  let legendSettings = JSON.parse(JSON.stringify(_params.mapLegend))
  let range = [1, 100]
  // switch (GLOBAL.ToolBar?.state?.selectName) {
  switch (title) {
    //线宽 边框宽度
    case getLanguage(GLOBAL.language).Map_Main_Menu.LEGEND_COLUMN:
      range = [1, 4]
      if (value > range[1]) value = range[1]
      else if (value <= range[0]) value = range[0]
      legendSettings[GLOBAL.Type].column = Math.floor(value)
      break
    case getLanguage(GLOBAL.language).Map_Main_Menu.LEGEND_WIDTH:
      range = [20, 100]
      
      if (value > range[1]) value = range[1]
      else if (value <= range[0]) value = range[0]
      
      legendSettings[GLOBAL.Type].widthPercent = value
      break
    //符号大小
    case getLanguage(GLOBAL.language).Map_Main_Menu.LEGEND_HEIGHT:
      range = [20, 100]
      
      if (value > range[1]) value = range[1]
      else if (value <= range[0]) value = range[0]
      
      legendSettings[GLOBAL.Type].heightPercent = value
      break
    //旋转角度
    case getLanguage(GLOBAL.language).Map_Main_Menu.LEGEND_ICON:
      range = [10, 100]
      if (value > range[1]) value = range[1]
      else if (value <= range[0]) value = range[0]
      legendSettings[GLOBAL.Type].imagePercent = value
      break
    //透明度
    case getLanguage(GLOBAL.language).Map_Main_Menu.LEGEND_FONT:
      range = [10, 100]
      
      if (value > range[1]) value = range[1]
      else if (value <= range[0]) value = range[0]
      
      legendSettings[GLOBAL.Type].fontPercent = value
      break
  }
  _setMapLegend(legendSettings)
}

export default {
  commit,
  close,
  menu,
  showMenuBox,
  tableAction,
  // TouchProgress数据和事件
  setTouchProgressInfo,
  getTouchProgressInfo,

  pickerConfirm: params => changePosition(params),
  pickerCancel: () => cancelSelect(),
  cancelSelect,
  changePosition,
  changeLegendVisible,
}
