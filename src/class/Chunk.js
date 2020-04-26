/**
 * 首页模块基础类
 */
import { Platform } from 'react-native'
import NavigationService from '../containers/NavigationService'
import { FileTools } from '../native'
import { ConstPath } from '../constants'
import { SMap } from 'imobile_for_reactnative'

export default class Chunk {
  constructor(props) {
    this.props = props
    this.key = props.key
    this.title = props.title // 模块名称，进入地图后的标题
    this.moduleImage = props.moduleImage // 默认图标
    this.moduleImageTouch = props.moduleImageTouch // 点击高亮图标
    this.defaultMapName = props.defaultMapName // 默认地图名
    this.openDefaultMap =
      props.openDefaultMap !== undefined ? props.openDefaultMap : true // 是否打开默认地图
    this.preAction = props.preAction // action之前的检测，返回false则不执行之后的action
    this.baseMapSource = { ...props.baseMapSource } // 默认地图资源
    this.baseMapIndex = props.baseMapIndex // 默认地图资源对应的地图index
    this.isExample = props.isExample || false // 是否是示例，只显示地图，没有其他功能
    this.is3D = props.is3D || false // 是否是三维地图，默认否
    this.licenceType = props.licenceType || 255 // TODO 临时方法
  }

  action = async (user, lastMap) => {
    if (this.preAction && typeof this.preAction === 'function') {
      let result = await this.preAction()
      if (!result) return
    }
    if (this.props.action && typeof this.props.action === 'function') {
      await this.props.action()
      return
    }
    GLOBAL.Type = this.key
    SMap.setCurrentModule(this.licenceType)
    const homePath = await FileTools.appendingHomeDirectory()

    if (this.is3D) {
      // 三维地图
      let fileName = ''
      if (Platform.OS === 'android') {
        fileName = 'OlympicGreen_android'
      } else {
        fileName = 'OlympicGreen_ios'
      }
      const homePath = await FileTools.appendingHomeDirectory()
      const cachePath = homePath + ConstPath.CachePath
      const fileDirPath = cachePath + fileName
      const arrFile = await FileTools.getFilterFiles(fileDirPath)
      if (arrFile.length === 0) {
        NavigationService.navigate('Map3D', {})
      } else {
        const name =
          Platform.OS === 'android'
            ? 'OlympicGreen_android'
            : 'OlympicGreen_ios'
        NavigationService.navigate('Map3D', { name })
      }
    } else {
      // 二维地图
      let data = this.baseMapSource
      data.layerIndex = this.baseMapIndex
      GLOBAL.BaseMapSize = data instanceof Array ? data.length : 1

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
        isOpenLastMap = await FileTools.fileIsExistInHomeDirectory(lastMap.path)
      }

      if (isOpenLastMap) {
        data = {
          type: 'Map',
          ...lastMap,
        }
      } else if (this.openDefaultMap) {
        const moduleMapFullName = `${this.defaultMapName}.xml`
        // 地图用相对路径
        const moduleMapPath =
          userPath + ConstPath.RelativeFilePath.Map + moduleMapFullName
        if (await FileTools.fileIsExist(homePath + moduleMapPath)) {
          data = {
            type: 'Map',
            path: moduleMapPath,
            name: this.defaultMapName,
          }
        }
      }

      wsData = [
        {
          DSParams: { server: wsPath },
          type: 'Workspace',
        },
        data,
      ]

      NavigationService.navigate('MapView', {
        wsData,
        mapTitle: this.title,
        isExample: this.isExample,
      })
    }
  }
}
