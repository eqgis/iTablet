import { getLanguage } from '@/language'
import CustomFunctionModule from '@/class/CustomFunctionModule'
import { getImage } from '../../assets'
import { AppToolBar, LayerUtils, Toast } from '@/utils'
import { FileTools, SCollector, SMap, SMCollectorType } from 'imobile_for_reactnative'
import ToolbarModule from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'
import { collectionModule } from '@/containers/workspace/components/ToolBar/modules'
import { getThemeAssets } from '@/assets'
import TourAction from '../Langchao/TourAction'
import { getUserInfo } from '../../utils/langchaoServer'

const defaultPositionModule = function () {
  return _PositionModule
}

const showLoading = (time: number, callback?: () => void) => {
  global.Loading.setLoading(true, "上报中")
  setTimeout(() => {
    global.Loading.setLoading(false)
    callback && callback()
  }, time)
}

/**
 * 地图右侧工具栏创建旅行轨迹功能
 */
class PositionModule extends CustomFunctionModule {
  constructor(props: {
      type: string // 自定义类型
      title: string // title
      size: string // 图片尺寸
      image: any // 图片
      getData: (type: string) => { data: any[]; buttons: any[]; } // 当前Function模块获取数据的方法
      actions: any,
    }) {
    super(props)
  }

  action = async () => {
    // this.setModuleData(this.type)
    const data = {name:"destination",type:"marker",id:118081}

    AppToolBar.getProps().setCurrentSymbol(data)

    const type = SMCollectorType.POINT_GPS
    // collectionModule().actions.showCollection(type)

    const position = await SMap.getCurrentLocation()
    ToolbarModule.addData({
      lastType: type,
      lastLayer:undefined,
    })

    await collectionModule().actions.createCollector(type, undefined)
    await SCollector.addGPSPoint()
    await collectionModule().actions.collectionSubmit(type)
    await SCollector.stopCollect()
    // showLoading(2000, async () => {
    //   // 地图定位到指定点位置
    //   SMap.refreshMap()
    //   Toast.show("上报成功")
    // })

    const date = new Date()

    const timezone = 8 //目标时区时间，东八区(北京时间)   东时区正数 西市区负数
    const offset_GMT = date.getTimezoneOffset() // 本地时间和格林威治的时间差，单位为分钟
    const nowDate = date.getTime() // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
    const targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000)
    // const beijingTime = targetDate.getTime()
    // 格式化时间
    const formDateLocal = TourAction.dateFormat("yyyy-MM-dd HH:mm:ss", date)
    const formDateBeijing = TourAction.dateFormat("yyyy-MM-dd HH:mm:ss", targetDate)
    // console.warn("localDate: " + formDateLocal + "beijingdate: " + formDateBeijing)

    // const callInfo = CollectionAction.getCallInfo()
    // let durationTime = 0
    // if(callInfo.startTime >= 0) {
    //   durationTime = (nowDate - callInfo.startTime) / (60 * 1000)
    // }

    let infos = getUserInfo()
    infos = JSON.parse(JSON.stringify(infos))
    console.warn("用户信息" + JSON.stringify(infos))
    let name = '张三'
    let phoneNumber = "17711245121"
    if(infos && infos.length > 0) {
      const itemTemp = infos[0]
      name = itemTemp?.name
      phoneNumber = itemTemp?.mobilePhone !== "" ? itemTemp?.mobilePhone : itemTemp?.phone
    }

    const callContentsObj = {
      myName: name,           // 呼叫人姓名
      myPhoneNumber: phoneNumber,    // 呼叫人电话
      callName: "",         // 被呼叫人姓名
      callPhoneNumber: "",  // 被呼叫人电话
      localTime: formDateLocal,        // 当地时间
      bjTime: formDateBeijing,           // 北京时间
      durationTime: 0,     // 时长
    }
    const callContentsStr = JSON.stringify(callContentsObj)
    console.warn("callContentsStr: " + callContentsStr)



    const result = await LayerUtils.getLayerAttribute(
      {
        data: [],
        head: [],
      },
      "marker_118081@langchao",
      0,
      30,
      {
        // filter: this.filter,
      },
      "refresh",
    )

    const layerAttributedataArray = result.attributes.data
    // const columnIndex = result.total !== 0 ? 0 : result.total
    const columnIndex = layerAttributedataArray.length - 1
    const layerAttributedata = layerAttributedataArray[columnIndex]

    let smID = 0
    let myNameIndex = 0
    let myPhoneNumberIndex = 0
    let callNameIndex = 0
    let callPhoneNumberIndex = 0
    let localTimeIndex = 0
    let bjTimeIndex = 0
    let durationTimeIndex = 0
    let isUploadedIndex = 0



    const length = layerAttributedata.length
    for(let i = 0; i < length; i ++) {
      const item = layerAttributedata[i]
      if(item.name === "SmID") {
        smID = Number(item.value)
      } else if(item.name === "isUploaded") {
        isUploadedIndex = i
      } else if(item.name === "myName") {
        myNameIndex = i
      } else if(item.name === "myPhoneNumber") {
        myPhoneNumberIndex = i
      } else if(item.name === "callName") {
        callNameIndex = i
      } else if(item.name === "callPhoneNumber") {
        callPhoneNumberIndex = i
      } else if(item.name === "localTime_User") {
        localTimeIndex = i
      } else if(item.name === "bjTime") {
        bjTimeIndex = i
      } else if(item.name === "duration") {
        durationTimeIndex = i
      }
    }

    const altData = [
      {
        mapName: "langchao",
        layerPath: "marker_118081@langchao",
        fieldInfo: [
          // {
          //   name: 'CallContents',
          //   value: callContentsStr,
          //   index: index,
          //   columnIndex: columnIndex,
          //   smID: smID,
          // },
          {
            name: 'myName',
            value: callContentsObj.myName,
            index: myNameIndex,
            columnIndex: columnIndex,
            smID: smID,
          },
          {
            name: 'myPhoneNumber',
            value: callContentsObj.myPhoneNumber,
            index: myPhoneNumberIndex,
            columnIndex: columnIndex,
            smID: smID,
          },
          {
            name: 'callName',
            value: callContentsObj.callName,
            index: callNameIndex,
            columnIndex: columnIndex,
            smID: smID,
          },
          {
            name: 'callPhoneNumber',
            value: callContentsObj.callPhoneNumber,
            index: callPhoneNumberIndex,
            columnIndex: columnIndex,
            smID: smID,
          },
          {
            name: 'localTime_User',
            value: callContentsObj.localTime,
            index: localTimeIndex,
            columnIndex: columnIndex,
            smID: smID,
          },
          {
            name: 'bjTime',
            value: callContentsObj.bjTime,
            index: bjTimeIndex,
            columnIndex: columnIndex,
            smID: smID,
          },
          {
            name: 'duration',
            value: callContentsObj.durationTime,
            index: durationTimeIndex,
            columnIndex: columnIndex,
            smID: smID,
          },
          {
            name: 'isUploaded',
            value: false,
            index: isUploadedIndex,
            columnIndex: columnIndex,
            smID: smID,
          },
        ],
        params: {
          // index: int,      // 当前对象所在记录集中的位置
          filter: `SmID=${smID}`, // 过滤条件
          cursorType: 2, // 2: DYNAMIC, 3: STATIC
        },
      },
    ]

    await AppToolBar.getProps().setLayerAttributes(altData)

    TourAction.uploadDialog(smID, 'marker')


    await SMap.toLocationPoint({
      x: position.longitude,
      y: position.latitude,
    })
    // const merPosition = this.llToMerto(position)
    // await SMap.setMapCenter(merPosition.x, merPosition.y)
    // await SMap.setMapScale(1 / 2785.0)



  }
}

const _PositionModule = function () {
  return new PositionModule({
    type: "POSITIONSUBMIT",                               // 自定义类型
    title: getLanguage(global.language).Prompt.REPORT_POSITION, // title
    size: 'large',                                      // 图片尺寸
    image: getThemeAssets().publicAssets.icon_data_upload,             // 图片
    getData: () => {
      return {data: [], buttons: [],}
    },                          // 当前Function模块获取数据的方法
    actions: () => {},                                // 当前Function模块所有事件
  })
}

export default defaultPositionModule