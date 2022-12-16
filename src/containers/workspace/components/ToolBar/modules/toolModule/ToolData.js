/**
 * 获取地图工具数据
 */
import { SMap, Action } from 'imobile_for_reactnative'
import { ConstToolType } from '../../../../../../constants'
import { getPublicAssets, getThemeAssets } from '../../../../../../assets'
import { LayerUtils } from '../../../../../../utils'
import constants from '../../../../constants'
import ToolbarBtnType from '../../ToolbarBtnType'
import { getLanguage } from '../../../../../../language'
import ToolbarModule from '../ToolbarModule'
import ToolAction from './ToolAction'
import { pickerData } from './data'

/**
 * 获取工具操作
 * @param type
 * @param params
 * @returns {{data: Array, buttons: Array}}
 */
function getData(type, params) {
  let data = []
  let buttons = []
  let customView = null
  ToolbarModule.setParams(params)
  let layerType = ''
  switch (type) {
    case ConstToolType.SM_MAP_TOOL:
      layerType = LayerUtils.getLayerType(
        ToolbarModule.getParams().currentLayer,
      )
      data = [
        {
          key: 'distanceComput',
          title: getLanguage(global.language).Map_Main_Menu
            .TOOLS_DISTANCE_MEASUREMENT,
          // '距离量算',
          action: ToolAction.measureLength,
          size: 'large',
          image: getThemeAssets().mapTools.icon_tool_horizontal_distance,
        },
        {
          key: 'coverComput',
          title: getLanguage(global.language).Map_Main_Menu
            .TOOLS_AREA_MEASUREMENT,
          // '面积量算',
          action: ToolAction.measureArea,
          size: 'large',
          image: getThemeAssets().mapTools.icon_tool_area_measurement,
        },
        {
          key: 'azimuthComput',
          title: getLanguage(global.language).Map_Main_Menu
            .TOOLS_AZIMUTH_MEASUREMENT,
          // '方位角量算',
          action: ToolAction.measureAngle,
          size: 'large',
          image: getThemeAssets().mapTools.icon_tool_azimuth,
        },
        // {
        //   key: 'pointSelect',
        //   title: getLanguage(global.language).Map_Main_Menu.TOOLS_SELECT,
        //   // '点选',
        //   action: ToolAction.pointSelect,
        //   size: 'large',
        //   image: getThemeAssets().mapTools.icon_tool_click,
        // },
        // {
        //   key: 'selectByRectangle',
        //   title: getLanguage(global.language).Map_Main_Menu
        //     .TOOLS_RECTANGLE_SELECT,
        //   // '框选',
        //   action: ToolAction.selectByRectangle,
        //   size: 'large',
        //   image: getThemeAssets().mapTools.icon_tool_frame,
        // },
        // {
        //   key: 'fullScreen',
        //   title: getLanguage(global.language).Map_Main_Menu.FULL_SCREEN,
        //   action: ToolAction.viewEntire,
        //   size: 'large',
        //   image: getThemeAssets().mapTools.icon_tool_full,
        // },
      ]
      // if (!global.coworkMode) {
      //   data.push(
      //     {
      //       key: 'rectangularCut',
      //       title: getLanguage(global.language).Map_Main_Menu
      //         .TOOLS_RECTANGLE_CLIP,
      //       // '矩形裁剪',
      //       action: ToolAction.rectangleCut,
      //       size: 'large',
      //       image: getThemeAssets().mapTools.icon_tool_rectangle,
      //     },
      //     {
      //       key: 'captureImage',
      //       title: getLanguage(global.language).Map_Main_Menu.CAMERA,
      //       action: ToolAction.captureImage,
      //       size: 'large',
      //       disable: layerType !== 'TAGGINGLAYER' && layerType !== 'CADLAYER' && layerType !== 'POINTLAYER',
      //       image:
      //         layerType !== 'TAGGINGLAYER' && layerType !== 'CADLAYER' && layerType !== 'POINTLAYER'
      //           ? getThemeAssets().mapTools.icon_tool_multi_media_ash
      //           : getThemeAssets().mapTools.icon_tool_multi_media,
      //     },
      //     {
      //       key: 'tour',
      //       title: getLanguage(global.language).Map_Main_Menu.TOUR,
      //       action: ToolAction.tour,
      //       size: 'large',
      //       image: getThemeAssets().mapTools.icon_tool_flightpath,
      //     },
      //     {
      //       key: 'matchPictureStyle',
      //       title: getLanguage(global.language).Map_Main_Menu.STYLE_TRANSFER,
      //       action: ToolAction.matchPictureStyle,
      //       size: 'large',
      //       image: getThemeAssets().mapTools.icon_tool_aidrafting,
      //     },
      //     {
      //       key: 'qrCode',
      //       title: getLanguage(global.language).Map_Main_Menu.SCAN,
      //       action: ToolAction.qrCode,
      //       size: 'large',
      //       image: getThemeAssets().toolbar.icon_qrcode,
      //     },
      //   )
      // }

      data.push(
        {
          key: 'selectByRectangle',
          title: getLanguage(global.language).Map_Main_Menu
            .TOOLS_RECTANGLE_SELECT,
          // '框选',
          action: ToolAction.selectByRectangle,
          size: 'large',
          image: getThemeAssets().mapTools.icon_tool_frame,
        },
      )
      break
    case ConstToolType.SM_MAP_TOOL_MEASURE_LENGTH:
    case ConstToolType.SM_MAP_TOOL_MEASURE_AREA:
    case ConstToolType.SM_MAP_TOOL_MEASURE_ANGLE:
      buttons = [
        ToolbarBtnType.CANCEL,
        {
          type: ToolbarBtnType.UNDO,
          action: ToolAction.undo,
        },
        {
          type: ToolbarBtnType.REDO,
          action: ToolAction.redo,
        },
        {
          type: ToolbarBtnType.MEASURE_CLEAR,
          action: ToolAction.clearMeasure,
          image: getThemeAssets().mark.icon_mark_erase,
        },
      ]
      break
    case ConstToolType.SM_MAP_TOOL_ATTRIBUTE_RELATE:
    case ConstToolType.SM_MAP_TOOL_ATTRIBUTE_SELECTION_RELATE:
      buttons = [ToolbarBtnType.CANCEL]
      break
    case ConstToolType.SM_MAP_TOOL_SELECT_BY_RECTANGLE:
    case ConstToolType.SM_MAP_TOOL_POINT_SELECT:
      data = [
        {
          key: constants.CANCEL_SELECT,
          title: getLanguage(global.language).Prompt.CANCEL,
          // constants.CANCEL_SELECT,
          action: ToolAction.cancelSelect,
          size: 'large',
          image: getThemeAssets().mapTools.icon_tool_cancel,
        },
      ]
      buttons = [
        ToolbarBtnType.CANCEL,
        {
          type: ToolbarBtnType.SHOW_ATTRIBUTE,
          action: ToolAction.showAttribute,
          // image: require('../../../../../../assets/mapTools/icon_attribute_white.png'),
          image: getThemeAssets().publicAssets.icon_bar_attribute_selected,
        },
      ]
      break
    case ConstToolType.SM_MAP_TOOL_RECTANGLE_CUT:
      buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.TOOLBAR_COMMIT]
      break
    case ConstToolType.SM_MAP_TOOL_INCREMENT:
      data = [
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Prompt.UNDO,
          action: () => {
            ToolAction.undo(ConstToolType.SM_MAP_TOOL_INCREMENT)
          },
          size: 'large',
          image: require('../../../../../../assets/lightTheme/public/icon_undo_light.png'),
        },
        {
          key: constants.REDO,
          title: getLanguage(global.language).Prompt.REDO,
          action: () => {
            ToolAction.redo(ConstToolType.SM_MAP_TOOL_INCREMENT)
          },
          size: 'large',
          image: require('../../../../../../assets/lightTheme/public/icon_redo_light.png'),
        },
        {
          key: constants.CANCEL,
          title: getLanguage(global.language).Prompt.CANCEL,
          // constants.CANCEL_SELECT,
          action: () => {
            SMap.setAction(Action.PAN)
            SMap.setAction(Action.DRAWLINE)
          },
          size: 'large',
          image: getThemeAssets().mapTools.icon_tool_cancel,
        },
        {
          key: constants.COMMIT,
          title: getLanguage(global.language).Prompt.COMMIT,
          // constants.CANCEL_SELECT,
          action: ToolAction.submit,
          size: 'large',
          image: getThemeAssets().publicAssets.icon_submit,
        },
      ]
      buttons = [ToolbarBtnType.CANCEL]
      break
    case ConstToolType.SM_MAP_TOOL_GPSINCREMENT:
      data = [
        {
          key: constants.BEGIN,
          title: getLanguage(global.language).Prompt.BEGIN,
          action: ToolAction.begin,
          size: 'large',
          image: require('../../../../../../assets/Navigation/begin.png'),
        },
        {
          key: constants.STOP,
          title: getLanguage(global.language).Prompt.STOP,
          action: ToolAction.stop,
          size: 'large',
          image: require('../../../../../../assets/Navigation/stop.png'),
        },
        {
          key: constants.CANCEL,
          title: getLanguage(global.language).Prompt.CANCEL,
          // constants.CANCEL_SELECT,
          action: ToolAction.close,
          size: 'large',
          image: getThemeAssets().mapTools.icon_tool_cancel,
        },
        {
          key: constants.COMMIT,
          title: getLanguage(global.language).Prompt.COMMIT,
          // constants.CANCEL_SELECT,
          action: ToolAction.submit,
          size: 'large',
          image: getThemeAssets().publicAssets.icon_submit,
        },
      ]
      buttons = [ToolbarBtnType.CANCEL]
      break
    case ConstToolType.SM_MAP_TOOL_STYLE_TRANSFER_PICKER:
      data = pickerData()
      buttons = [
        ToolbarBtnType.CANCEL,
        {
          type: ToolbarBtnType.STYLE_TRANSFER,
          action: ToolAction.matchPictureStyle,
          // image: getPublicAssets().common.icon_album,
          image: getThemeAssets().toolbar.icon_album,
        },
        {
          type: ToolbarBtnType.STYLE_TRANSFER_PICKER,
          action: ToolAction.showMenuBox,
          // image: require('../../../../../../assets/mapEdit/icon_function_theme_param_menu.png'),
          image: getThemeAssets().toolbar.icon_toolbar_option,
        },
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.SM_MAP_TOOL_STYLE_TRANSFER:
      buttons = [
        ToolbarBtnType.CANCEL,
        {
          type: ToolbarBtnType.STYLE_TRANSFER,
          action: ToolAction.matchPictureStyle,
          // image: getPublicAssets().common.icon_album,
          image: getThemeAssets().toolbar.icon_album,
        },
        {
          type: ToolbarBtnType.STYLE_TRANSFER_PICKER,
          action: ToolAction.showMenuBox,
          // image: require('../../../../../../assets/mapEdit/icon_function_theme_param_menu.png'),
          image: getThemeAssets().toolbar.icon_toolbar_option,
        },
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
  }
  return { data, buttons, customView }
}

function getMenuData(type) {
  let data = []
  switch (type) {
    case ConstToolType.SM_MAP_TOOL_STYLE_TRANSFER:
      data = [
        {
          key: getLanguage(global.language).Map_Main_Menu.STYLE_BRIGHTNESS,
          action: () => {
            global.toolBox &&
              global.toolBox.setState({
                isTouchProgress: true,
                showMenuDialog: false,
                selectName: getLanguage(global.language).Map_Main_Menu
                  .STYLE_BRIGHTNESS,
                selectKey: getLanguage(global.language).Map_Main_Menu
                  .STYLE_BRIGHTNESS,
                buttons: getData(ConstToolType.SM_MAP_TOOL_STYLE_TRANSFER).buttons,
              })
          },
          selectKey: getLanguage(global.language).Map_Main_Menu
            .STYLE_BRIGHTNESS,
        },
        {
          key: getLanguage(global.language).Map_Main_Menu.STYLE_CONTRAST,
          action: () => {
            global.toolBox &&
              global.toolBox.setState({
                isTouchProgress: true,
                showMenuDialog: false,
                selectName: getLanguage(global.language).Map_Main_Menu
                  .STYLE_CONTRAST,
                selectKey: getLanguage(global.language).Map_Main_Menu
                  .STYLE_CONTRAST,
                buttons: getData(ConstToolType.SM_MAP_TOOL_STYLE_TRANSFER).buttons,
              })
          },
          selectKey: getLanguage(global.language).Map_Main_Menu.STYLE_CONTRAST,
        },
        {
          key: getLanguage(global.language).Map_Main_Menu.SATURATION,
          action: () => {
            global.toolBox &&
              global.toolBox.setState({
                isTouchProgress: true,
                showMenuDialog: false,
                selectName: getLanguage(global.language).Map_Main_Menu
                  .SATURATION,
                selectKey: getLanguage(global.language).Map_Main_Menu
                  .SATURATION,
                buttons: getData(ConstToolType.SM_MAP_TOOL_STYLE_TRANSFER).buttons,
              })
          },
          selectKey: getLanguage(global.language).Map_Main_Menu.SATURATION,
        },
      ]
      break
  }
  return data
}

export default {
  getData,
  getMenuData,
}
