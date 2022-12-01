import { SCollector, SMCollectorType } from 'imobile_for_reactnative'
import constants from '../../../../constants'
import ToolbarBtnType from '../../ToolbarBtnType'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import { ConstToolType } from '../../../../../../constants'
import CollectionAction from './CollectionAction'
import ToolbarModule from '../ToolbarModule'
import { AppToolBar, jsonUtil, LayerUtils } from '@/utils'
import TourAction from '../../../../../../../applets/langchaoDemo/src/mapFunctionModules/Langchao/TourAction'

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
      action: () => SCollector.addGPSPoint(type),
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
      action: async () => {
        await SCollector.startCollect(type)
        const obj = {
          key: 'start',
          title: "记录中",
          action: () => {
            Toast.show("正在记录中")
          },
          size: 'large',
          image: getThemeAssets().collection.icon_track_start,
        }
        global.ToolBar?.updateViewData(0,obj)

      },
      size: 'large',
      image: getThemeAssets().collection.icon_track_start,
    })
    data.push({
      key: 'stop',
      title: getLanguage(global.language).Map_Main_Menu.COLLECTION_STOP,
      action: async () => {
        await SCollector.pauseCollect(type)
        let obj = {
          key: 'start',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_START,
          action: async () => {
            await SCollector.startCollect(type)
            const obj = {
              key: 'start',
              title: "记录中",
              action: () => {
                Toast.show("正在记录中")
              },
              size: 'large',
              image: getThemeAssets().collection.icon_track_start,
            }
            global.ToolBar?.updateViewData(0,obj)

          },
          size: 'large',
          image: getThemeAssets().collection.icon_track_start,
        }
        global.ToolBar?.updateViewData(0,obj)
      },
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
  data.push({
    key: constants.CANCEL,
    title: getLanguage(global.language).Map_Main_Menu.COLLECTION_CANCEL,
    action: async () => {
      await CollectionAction.cancel(type)
      let obj = {
        key: 'start',
        title: getLanguage(global.language).Map_Main_Menu.COLLECTION_START,
        action: async () => {
          await SCollector.startCollect(type)
          const obj = {
            key: 'start',
            title: "记录中",
            action: () => {
              Toast.show("正在记录中")
            },
            size: 'large',
            image: getThemeAssets().collection.icon_track_start,
          }
          global.ToolBar?.updateViewData(0,obj)

        },
        size: 'large',
        image: getThemeAssets().collection.icon_track_start,
      }
      global.ToolBar?.updateViewData(0,obj)

      // 将数据恢复默认值
      CollectionAction.setCallInfo({
        name: '',
        phoneNumber: '',
        startTime: -1,
      })
    },
    size: 'large',
    image: getThemeAssets().publicAssets.icon_cancel,
  })
  data.push({
    key: constants.SUBMIT,
    title: getLanguage(global.language).Map_Main_Menu.COLLECTION_SUBMIT,
    action: async () => {
      await CollectionAction.collectionSubmit(type)
      let obj = {
        key: 'start',
        title: getLanguage(global.language).Map_Main_Menu.COLLECTION_START,
        action: async () => {
          await SCollector.startCollect(type)
          const obj = {
            key: 'start',
            title: "记录中",
            action: () => {
              Toast.show("正在记录中")
            },
            size: 'large',
            image: getThemeAssets().collection.icon_track_start,
          }
          global.ToolBar?.updateViewData(0,obj)

        },
        size: 'large',
        image: getThemeAssets().collection.icon_track_start,
      }
      global.ToolBar?.updateViewData(0,obj)
      const date = new Date()


      const timezone = 7 //目标时区时间，东八区(北京时间)   东时区正数 西市区负数
      const offset_GMT = date.getTimezoneOffset() // 本地时间和格林威治的时间差，单位为分钟
      const nowDate = date.getTime() // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
      const targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000)
      // const beijingTime = targetDate.getTime()
      // 格式化时间
      const formDateLocal = TourAction.dateFormat("yyyy-MM-dd HH:mm:ss", date)
      const formDateBeijing = TourAction.dateFormat("yyyy-MM-dd HH:mm:ss", targetDate)
      // console.warn("localDate: " + formDateLocal + "beijingdate: " + formDateBeijing)

      const callInfo = CollectionAction.getCallInfo()
      let durationTime = 0
      if(callInfo.startTime >= 0) {
        durationTime = (nowDate - callInfo.startTime) / (60 * 1000)
      }
      const callContentsObj = {
        myName: '张三',           // 呼叫人姓名
        myPhoneNumber: '17711245121',    // 呼叫人电话
        callName: callInfo.name,         // 被呼叫人姓名
        callPhoneNumber: callInfo.phoneNumber,  // 被呼叫人电话
        localTime: formDateLocal,        // 当地时间
        bjTime: formDateBeijing,           // 北京时间
        durationTime: durationTime,     // 时长
      }
      const callContentsStr = JSON.stringify(callContentsObj)
      console.warn("callContentsStr: " + callContentsStr)
      // 将数据恢复默认值
      CollectionAction.setCallInfo({
        name: '',
        phoneNumber: '',
        startTime: -1,
      })

      const result = await LayerUtils.getLayerAttribute(
        {},
        AppToolBar.getProps().currentLayer.path,
        0,
        30,
        {
          // filter: this.filter,
        },
        "refresh",
      )

      let layerAttributedataArray = result.attributes.data
      // const columnIndex = result.total !== 0 ? 0 : result.total
      const columnIndex = layerAttributedataArray.length - 1
      let layerAttributedata = layerAttributedataArray[columnIndex]

      // console.warn("result: " + JSON.stringify(result))
      let smID = 0
      let index = 0

      const length = layerAttributedata.length
      for(let i = 0; i < length; i ++) {
        let item = layerAttributedata[i]
        if(item.name === "SmID") {
          smID = item.value
        }
        if(item.name === "CallContents") {
          index = i
        }
      }

      const altData = [
        {
          mapName: AppToolBar.getProps().map.currentMap.name,
          layerPath: AppToolBar.getProps().currentLayer.path,
          fieldInfo: [
            {
              name: 'CallContents',
              value: callContentsStr,
              index: index,
              columnIndex: columnIndex,
              smID: smID,
            },
          ],
          // prevData: [
          //   {
          //     name: isSingleData ? data.rowData.name : data.cellData.name,
          //     value: isSingleData ? data.rowData.value : data.cellData.value,
          //     index: data.index,
          //     columnIndex: data.columnIndex,
          //     smID: isSingleData
          //       ? this.state.attributes.data[0][0].value
          //       : data.rowData[1].value,
          //   },
          // ],
          params: {
            // index: int,      // 当前对象所在记录集中的位置
            filter: `SmID=${smID}`, // 过滤条件
            cursorType: 2, // 2: DYNAMIC, 3: STATIC
          },
        },
      ]

      AppToolBar.getProps().setLayerAttributes(altData)

      // let newLayerAttributeState = JSON.parse(JSON.stringify(layerAttributeState))
      // LayerUtils.setMapLayerAttribute(newLayerAttributeState)

    },
    size: 'large',
    image: getThemeAssets().publicAssets.icon_submit,
  })
  buttons = [
    // ToolbarBtnType.CANCEL,
    {
      type: ToolbarBtnType.CANCEL,
      image: getThemeAssets().toolbar.icon_toolbar_quit,
      action: () => {
        global.ToolBar?.close()
        // 将数据恢复默认值
        CollectionAction.setCallInfo({
          name: '',
          phoneNumber: '',
          startTime: -1,
        })
      },
    },
    // {
    //   type: ToolbarBtnType.CHANGE_COLLECTION,
    //   image: getThemeAssets().toolbar.icon_toolbar_switch,
    //   action: () => CollectionAction.changeCollection(type),
    // },
  ]


  buttons.push({
    type: ToolbarBtnType.SHOW_ATTRIBUTE,
    action: () => CollectionAction.showAttribute(),
    image: getThemeAssets().publicAssets.icon_bar_attribute_selected,
  })


  // const _params = ToolbarModule.getParams()
  // // 若是在线协作采集，则没有打开符号库
  // if (!_params.currentTask?.id) {
  //   buttons.push({
  //     type: ToolbarBtnType.MAP_SYMBOL,
  //     image: getThemeAssets().collection.icon_symbol,
  //     action: CollectionAction.showSymbol,
  //   })
  // }

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
    ToolbarBtnType.CANCEL,
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
