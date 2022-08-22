import { ConstOnline, ConstPath } from '@/constants'
import { Module } from '@/class'
import { getLanguage } from '@/language'
import {
  startModule,
  addModule,
  markModule,
} from '@/containers/workspace/components/ToolBar/modules'
import { Tour } from '../mapFunctionModules'
import { FileTools, IntentModule } from '@/native'
import { getImage } from '../assets'
import { UserInfo } from '@/types'

/**
 * 首页显示的旅行轨迹模块
 */
export default class TourModule extends Module {
  static key = 'tour'
  constructor() {
    super({
      key: TourModule.key,
      // 右侧工具条加载项
      functionModules: [
        startModule(),      // 开始
        addModule(),        // 添加
        markModule(),       // 标注
        Tour(),             // 创建轨迹
      ],
      // 地图类型（三维/二维）
      mapType: Module.MapType.MAP,
    })
  }
  action = async (user: UserInfo, lastMap, service) => {
    try {
      const homePath = await FileTools.appendingHomeDirectory()

      let userPath = ConstPath.CustomerPath
      if (user && user.userName) {
        userPath = `${ConstPath.UserPath + user.userName}/`
      }
      const wsPath =
        homePath +
        userPath +
        ConstPath.RelativeFilePath.Workspace[
          global.language === 'CN' ? 'CN' : 'EN'
        ]

      let wsData
      let isOpenLastMap = false

      if (lastMap) {
        isOpenLastMap = await FileTools.fileIsExistInHomeDirectory(
          lastMap.path,
        )
      }

      let data
      if (isOpenLastMap) {
        data = {
          type: 'Map',
          ...lastMap,
        }
      } else if (this.getDefaultData().openDefaultMap) {
        const moduleMapFullName = `${this.getDefaultData().defaultMapName}.xml`
        // 地图用相对路径
        const moduleMapPath =
          userPath + ConstPath.RelativeFilePath.Map + moduleMapFullName
        if (await FileTools.fileIsExist(homePath + moduleMapPath)) {
          data = {
            type: 'Map',
            path: moduleMapPath,
            name: this.getDefaultData().defaultMapName,
          }
        }
      } else {
        data = [ConstOnline.tiandituCN, ConstOnline.tianditu]
        // data.layerIndex = this.getDefaultData().baseMapIndex
        global.BaseMapSize = data.length
      }

      wsData = [
        {
          DSParams: { server: wsPath },
          type: 'Workspace',
        },
      ]
      if (data instanceof Array) {
        wsData = wsData.concat(data)
      } else {
        wsData.push(data)
      }
      let param = {
        wsData,
        mapTitle: this.getDefaultData().title,
        isExample: this.getDefaultData().isExample,
      }
      if (service) {
        param = Object.assign(param, { service: service })
      }

      IntentModule.setNavParam('MapView', param)
      this.props.navigation.navigate('MapStack', { screen: 'MapView', params: param })

      // if (global.coworkMode) {
      //   NavigationService.navigate('CoworkMapStack', param)
      // } else {
      // NavigationService.navigate('MapStack', {screen: 'MapView', params: param})
    } catch (e) {
      __DEV__ && console.warn(e)
    }
  }

  getDefaultData = () => {
    return {
      key: TourModule.key,
      // 根据语言获取地图模块名称
      title: getLanguage(global.language).Map_Main_Menu.TOUR,
      // 模块图片
      moduleImage: getImage().flight,
      // 点击时模块高亮图片
      moduleImageTouch: getImage().flight,
      // 默认地图名称
      defaultMapName: global.language === 'CN' ? 'LandBuild' : 'PrecipitationOfUSA',
      // 地图默认底图数据
      baseMapSource: [ConstOnline.tiandituCN, ConstOnline.tianditu],
      // 地图默认底图当前显示的地图
      baseMapIndex: 3,
      mapType: this.mapType,
      isExample: false,
      openDefaultMap: true,
      action: this.action,
    }
  }

  // 首页模块数据
  getChunk = (language: string) => {
    return this.createChunk(language, this.getDefaultData())
  }
}