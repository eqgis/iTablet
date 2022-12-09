import { getLanguage } from '@/language'
import CustomFunctionModule from '@/class/CustomFunctionModule'
import { getImage } from '../../assets'
import { AppToolBar, LayerUtils, Toast } from '@/utils'
import { FileTools, SCollector, SMap, SMCollectorType } from 'imobile_for_reactnative'
import ToolbarModule from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'
import { collectionModule } from '@/containers/workspace/components/ToolBar/modules'
import { getThemeAssets } from '@/assets'
import TourAction from '../Langchao/TourAction'

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
    let isUploadedIndex = 0

    const length = layerAttributedata.length
    for(let i = 0; i < length; i ++) {
      const item = layerAttributedata[i]
      if(item.name === "SmID") {
        smID = Number(item.value)
      } else if(item.name === "isUploaded") {
        isUploadedIndex = i
      }
    }

    const altData = [
      {
        mapName: "langchao",
        layerPath: "marker_118081@langchao",
        fieldInfo: [
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