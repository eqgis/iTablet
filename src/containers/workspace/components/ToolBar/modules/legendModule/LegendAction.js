import { ConstToolType, Const } from '../../../../../../constants'
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
export default {
  commit,
  close,
  menu,
  showMenuBox,
  tableAction,

  pickerConfirm: params => changePosition(params),
  pickerCancel: () => cancelSelect(),
  cancelSelect,
  changePosition,
  changeLegendVisible,
}
