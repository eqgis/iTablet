import { SCollector, SMCollectorType } from 'imobile_for_reactnative'
import constants from '../../../../constants'
import ToolbarBtnType from '../../ToolbarBtnType'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import { ConstToolType } from '../../../../../../constants'
import CollectionAction from './CollectionAction'
import ToolbarModule from '../ToolbarModule'
import { AppEvent } from '@/utils'

/**
 * 获取采集操作数据
 * @param type
 * @returns {*}
 */
function getData(type) {
  const data = []
  let buttons = []
  let isCollection = false


  if (type === ConstToolType.SM_MAP_TOOL_ATTRIBUTE_SELECTION_RELATE) {
    buttons = [ToolbarBtnType.CANCEL]
    return { data, buttons }
  }

  if (
    type === ConstToolType.SM_MAP_COLLECTION_POINT ||
    type === ConstToolType.SM_MAP_COLLECTION_LINE ||
    type === ConstToolType.SM_MAP_COLLECTION_REGION
  ) {
    return getOperationData(type)
  }

  // MAP_COLLECTION_CONTROL_ 类型是MapControl的操作
  if (
    typeof type === 'string' &&
    type.indexOf('MAP_COLLECTION_CONTROL_') >= 0
  ) {
    isCollection = true
  } else {
    Object.keys(SMCollectorType).forEach(key => {
      if (SMCollectorType[key] === type) {
        isCollection = true
      }
    })
  }

  // 判断是否是采集功能
  if (!isCollection) return { data, buttons }

  if (
    type === SMCollectorType.POINT_GPS ||
    type === SMCollectorType.LINE_GPS_POINT ||
    type === SMCollectorType.REGION_GPS_POINT
  ) {
    data.push({
      key: 'addGPSPoint',
      title: getLanguage(global.language).Map_Main_Menu.COLLECTION_ADD_POINT,
      action: () => SCollector.addGPSPoint(),
      size: 'large',
      image: getThemeAssets().collection.icon_collect_point,
    })
  }
  if (
    type === SMCollectorType.LINE_GPS_PATH ||
    type === SMCollectorType.REGION_GPS_PATH
  ) {
    data.push({
      key: 'start',
      title: getLanguage(global.language).Map_Main_Menu.COLLECTION_START,
      action: () => SCollector.startGPSCollect(type),
      size: 'large',
      image: getThemeAssets().collection.icon_track_start,
    })
    data.push({
      key: 'stop',
      title: getLanguage(global.language).Map_Main_Menu.COLLECTION_STOP,
      action: () => SCollector.pauseGPSCollect(type),
      size: 'large',
      image: getThemeAssets().collection.icon_track_stop,
    })
  }
  if (
    type !== SMCollectorType.LINE_GPS_PATH &&
    type !== SMCollectorType.REGION_GPS_PATH
  ) {
    data.push({
      key: constants.UNDO,
      title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
      action: () => CollectionAction.undo(type),
      size: 'large',
      image: getThemeAssets().edit.icon_undo,
    })
    data.push({
      key: constants.REDO,
      title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
      action: () => CollectionAction.redo(type),
      size: 'large',
      image: getThemeAssets().edit.icon_redo,
    })
  }

  // 准星采集的打点
  if(type ===  SMCollectorType.LINE_AIM_POINT
    || type === SMCollectorType.POINT_AIM_POINT
    || type === SMCollectorType.REGION_AIM_POINT
  ) {
    data.unshift({
      key: 'addAimPoint',
      title: getLanguage(global.language).Map_Main_Menu.COLLECTION_ADD_POINT,
      action: () => {
        AppEvent.emitEvent("collector_aim_point_add", type)
      },
      size: 'large',
      image: getThemeAssets().collection.icon_collect_point,
    })
  }

  data.push({
    key: constants.CANCEL,
    title: getLanguage(global.language).Map_Main_Menu.COLLECTION_CANCEL,
    action: () => CollectionAction.cancel(type),
    size: 'large',
    image: getThemeAssets().publicAssets.icon_cancel,
  })
  data.push({
    key: constants.SUBMIT,
    title: getLanguage(global.language).Map_Main_Menu.COLLECTION_SUBMIT,
    action: () => CollectionAction.collectionSubmit(type),
    size: 'large',
    image: getThemeAssets().publicAssets.icon_submit,
  })
  buttons = [
    // ToolbarBtnType.CANCEL,
    {
      type: ToolbarBtnType.CANCEL,
      image: getThemeAssets().toolbar.icon_toolbar_quit,
      action: async () => {
        await CollectionAction.cancel(type)
        AppEvent.emitEvent("collector_aim_point_show", false)
        global.ToolBar?.close()
      },
    },
    {
      type: ToolbarBtnType.CHANGE_COLLECTION,
      image: getThemeAssets().toolbar.icon_toolbar_switch,
      action: () => CollectionAction.changeCollection(type),
    },
  ]


  buttons.push({
    type: ToolbarBtnType.SHOW_ATTRIBUTE,
    action: () => CollectionAction.showAttribute(),
    image: getThemeAssets().publicAssets.icon_bar_attribute_selected,
  })


  const _params = ToolbarModule.getParams()
  // 若是在线协作采集，则没有打开符号库
  if (!_params.currentTask?.id) {
    buttons.push({
      type: ToolbarBtnType.MAP_SYMBOL,
      image: getThemeAssets().collection.icon_symbol,
      action: CollectionAction.showSymbol,
    })
  }

  return { data, buttons }
}

/**
 * 获取采集操作
 * @param type
 * @param params
 * @returns {{data: Array, buttons: Array}}
 */
function getOperationData(type) {
  const data = []
  let buttons = []
  const _params = ToolbarModule.getParams()
  // 判断是否是采集操作功能
  if (
    type !== ConstToolType.SM_MAP_COLLECTION_POINT &&
    type !== ConstToolType.SM_MAP_COLLECTION_LINE &&
    type !== ConstToolType.SM_MAP_COLLECTION_REGION
  )
    return { data, buttons }

  const gpsPointType =
    type === ConstToolType.SM_MAP_COLLECTION_POINT
      ? SMCollectorType.POINT_GPS
      : type === ConstToolType.SM_MAP_COLLECTION_LINE
        ? SMCollectorType.LINE_GPS_POINT
        : SMCollectorType.REGION_GPS_POINT
  data.push({
    key: 'gpsPoint',
    title: getLanguage(global.language).Map_Main_Menu.COLLECTION_POINTS_BY_GPS,
    action: () =>
      CollectionAction.showCollection(gpsPointType, _params.currentLayer.path),
    size: 'large',
    image: getThemeAssets().collection.icon_collect_point,
  })
  if (type !== ConstToolType.SM_MAP_COLLECTION_POINT) {
    const gpsPathType =
      type === ConstToolType.SM_MAP_COLLECTION_LINE
        ? SMCollectorType.LINE_GPS_PATH
        : SMCollectorType.REGION_GPS_PATH
    data.push({
      key: 'gpsPath',
      title: getLanguage(global.language).Map_Main_Menu.COLLECTION_LINE_BY_GPS,
      action: () =>
        CollectionAction.showCollection(gpsPathType, _params.currentLayer.path),
      size: 'large',
      image: getThemeAssets().collection.icon_track_start,
    })
  }

  switch (type) {
    case ConstToolType.SM_MAP_COLLECTION_POINT:
      data.push(
        {
          key: 'pointDraw',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_POINT_DRAW,
          action: () =>
            CollectionAction.showCollection(
              SMCollectorType.POINT_HAND,
              _params.currentLayer.path,
            ),
          size: 'large',
          image: getThemeAssets().mark.icon_mark_manage,
        },
        {
          key: 'aimPointDraw',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_AIM_POINT_DEAW,
          action: () =>{
            CollectionAction.showCollection(
              SMCollectorType.POINT_AIM_POINT,
              _params.currentLayer.path,
            )
          },
          size: 'large',
          image: getThemeAssets().collection.icon_collect_aim_point,
        },
      )
      break
    case ConstToolType.SM_MAP_COLLECTION_LINE:
      data.push(
        {
          key: 'pointDraw',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_POINT_DRAW,
          action: () =>
            CollectionAction.showCollection(
              SMCollectorType.LINE_HAND_POINT,
              _params.currentLayer.path,
            ),
          size: 'large',
          image: getThemeAssets().mark.icon_dotted_lines,
        },
        {
          key: 'aimPointDraw',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_AIM_POINT_DEAW,
          action: () =>{
            CollectionAction.showCollection(
              SMCollectorType.LINE_AIM_POINT,
              _params.currentLayer.path,
            )
          },
          size: 'large',
          image: getThemeAssets().collection.icon_collect_aim_point,
        },
        {
          key: 'freeDraw',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_FREE_DRAW,
          action: () =>
            CollectionAction.showCollection(
              SMCollectorType.LINE_HAND_PATH,
              _params.currentLayer.path,
            ),
          size: 'large',
          image: getThemeAssets().mark.icon_free_line,
        },
      )
      break
    case ConstToolType.SM_MAP_COLLECTION_REGION:
      data.push(
        {
          key: 'pointDraw',
          title: getLanguage(global.language).Map_Main_Menu
            .COLLECTION_POINT_DRAW,
          // '点绘式',
          action: () =>
            CollectionAction.showCollection(
              SMCollectorType.REGION_HAND_POINT,
              _params.currentLayer.path,
            ),
          size: 'large',
          image: getThemeAssets().mark.icon_frame,
        },
        {
          key: 'aimPointDraw',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_AIM_POINT_DEAW,
          action: () =>{
            CollectionAction.showCollection(
              SMCollectorType.REGION_AIM_POINT,
              _params.currentLayer.path,
            )
          },
          size: 'large',
          image: getThemeAssets().collection.icon_collect_aim_point,
        },
        {
          key: 'freeDraw',
          title: getLanguage(global.language).Map_Main_Menu
            .COLLECTION_FREE_DRAW,
          // '自由式',
          action: () =>
            CollectionAction.showCollection(
              SMCollectorType.REGION_HAND_PATH,
              _params.currentLayer.path,
            ),
          size: 'large',
          image: getThemeAssets().mark.icon_free_region,
        },
      )
      break
  }

  buttons = [
    // ToolbarBtnType.CANCEL,
    {
      type: ToolbarBtnType.CANCEL,
      // image: getThemeAssets().collection.icon_symbol,
      action: async () => {
        // await CollectionAction.cancel(type)
        AppEvent.emitEvent("collector_aim_point_show", false)
        global.ToolBar?.close()

      },
    },
    ToolbarBtnType.PLACEHOLDER,
  ]

  // 若是在线协作采集，则没有打开符号库
  if (!_params.currentTask?.id) {
    buttons.push({
      type: ToolbarBtnType.MAP_SYMBOL,
      image: getThemeAssets().collection.icon_symbol,
      action: CollectionAction.showSymbol,
    })
  }
  return { data, buttons }
}

export default {
  getData,
  getOperationData,
}
