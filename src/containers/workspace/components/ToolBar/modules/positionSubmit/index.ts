import FunctionModule from '../../../../../../class/FunctionModule'
import TourAction from 'applets/langchaoDemo/src/mapFunctionModules/Langchao/TourAction'
import { getImage } from 'applets/langchaoDemo/src/assets'
import Toast from '@/utils/Toast'
import { SMap, SMCollectorType } from 'imobile_for_reactnative'
import { getThemeAssets } from '@/assets'
import collectionModule from '../collectionModule'
import ToolbarModule from '../ToolbarModule'
import { AppToolBar } from '@/utils'


const showLoading = (time: number, callback?: () => void) => {
  global.Loading.setLoading(true, "上报中")
  setTimeout(() => {
    global.Loading.setLoading(false)
    callback && callback()
  }, time)
}

class PositionSubmitModule extends FunctionModule {
  constructor(props) {
    super(props)
  }

  positionUpload = () => {
    showLoading(2000, async () => {
      // await SMap.moveToCurrent()
      // await SMap.removeAllCallout()
      const position = await SMap.getCurrentLocation()
      // await SMap.addLocationCallout(position.longitude, position.latitude, '当前位置', "2")
      await SMap.addCallouts([{
        x: position.longitude,
        y: position.latitude,
      }])
      // 地图定位到指定点位置
      await SMap.toLocationPoint({
        x: position.longitude,
        y: position.latitude,
      })

      // await SMap.setMapScale(1 / 2785.0)
      // await SMap.setMapCenter(position.longitude, position.latitude)
      // await SMap.refreshMap()
      Toast.show("上报成功")
    })
  }

  llToMerto = (position:SMap.pointType) => {
    const mercator = {
      x:0,
      y: 0,
    }
    const earthRad = 6378137.0
    mercator.x = position.longitude * Math.PI / 180 * earthRad
    const a = position.latitude * Math.PI / 180
    mercator.y = earthRad / 2 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)))
    return mercator
  }

  action = async () => {
    const data = {name:"destination",type:"marker",id:118081}

    AppToolBar.getProps().setCurrentSymbol(data)

    const type = SMCollectorType.POINT_GPS
    collectionModule().actions.showCollection(type)
    // const merPosition = this.llToMerto(position)
    // await SMap.setMapCenter(merPosition.x, merPosition.y)
    // await SMap.setMapScale(1 / 2785.0)

  }
}

export default function() {
  return new PositionSubmitModule({
    type: "POSITIONSUBMIT",
    title: "上报",
    size: 'large',
    image: getThemeAssets().publicAssets.icon_data_upload,
  })
}
