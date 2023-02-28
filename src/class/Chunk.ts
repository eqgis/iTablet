/**
 * 首页模块基础类
 */
import NavigationService from '../containers/NavigationService'
import { FileTools } from '../native'
import { ConstPath } from '../constants'
import { ImageSourcePropType } from 'react-native'
import { Map, UserInfo } from '@/types'
import { DataItemServices } from 'imobile_for_reactnative/types/interface/iserver/types'

export interface ChunkProps {
  key: string,
  title: string, // 模块名称，进入地图后的标题
  moduleImage: ImageSourcePropType, // 默认图标
  moduleImageTouch: ImageSourcePropType, // 点击高亮图标
  defaultMapName: string, // 默认地图名
  openDefaultMap: boolean, // 是否打开默认地图
  action: () => void,
  preAction: () => boolean, // action之前的检测，返回false则不执行之后的action
  afterAction: () => boolean, // action之后的检测，返回false则不执行之后的action
  baseMapSource: any, // 默认地图资源
  baseMapIndex: number, // 默认地图资源对应的地图index
  isExample: boolean, // 是否是示例，只显示地图，没有其他功能
  mapType: 'MAP' | 'SCENE' | '', // 二维，三维地图，默认为空
  onMapLoad: () => void, //地图/AR地图/三维场景加载完成回调
  toolbarModuleData: Array<any>,
}

export default class Chunk {
  static MapType = {
    MAP: 'MAP',
    SCENE: 'SCENE',
    AR: 'AR',
  }

  props: ChunkProps
  key: string
  title: string // 模块名称，进入地图后的标题
  moduleImage: ImageSourcePropType // 默认图标
  moduleImageTouch: ImageSourcePropType // 点击高亮图标
  defaultMapName: string // 默认地图名
  openDefaultMap: boolean // 是否打开默认地图
  preAction: () => boolean // action之前的检测，返回false则不执行之后的action
  afterAction: () => boolean // action之后的检测，返回false则不执行之后的action
  baseMapSource: any // 默认地图资源
  baseMapIndex: number // 默认地图资源对应的地图index
  isExample: boolean // 是否是示例，只显示地图，没有其他功能
  mapType: 'MAP' | 'SCENE' | '' // 二维，三维地图，默认为空
  onMapLoad: () => void //地图/AR地图/三维场景加载完成回调
  toolbarModuleData: Array<any>

  constructor(props: ChunkProps) {
    this.props = props

    this.key = props.key

    this.title = props.title // 模块名称，进入地图后的标题

    this.moduleImage = props.moduleImage // 默认图标

    this.moduleImageTouch = props.moduleImageTouch // 点击高亮图标

    this.defaultMapName = props.defaultMapName // 默认地图名

    this.openDefaultMap =
      props.openDefaultMap !== undefined ? props.openDefaultMap : true // 是否打开默认地图

    this.preAction = props.preAction // action之前的检测，返回false则不执行之后的action
    this.afterAction = props.afterAction // action之后的检测，返回false则不执行之后的action

    this.baseMapSource = props.baseMapSource // 默认地图资源

    this.baseMapIndex = props.baseMapIndex // 默认地图资源对应的地图index

    this.isExample = props.isExample || false // 是否是示例，只显示地图，没有其他功能

    this.mapType = props.mapType || '' // 二维，三维地图，默认为空   'MAP' ｜ 'SCENE' ｜ ''

    this.onMapLoad = props.onMapLoad //地图/AR地图/三维场景加载完成回调

    this.toolbarModuleData = props.toolbarModuleData ? props.toolbarModuleData : []

  }

  getTitle = () => this.title

  action = async (user: UserInfo, lastMap: Map, service: DataItemServices) => {
    if (this.preAction && typeof this.preAction === 'function') {
      const result = await this.preAction()
      if (!result) return false
    }
    if (
      // this.mapType === '' &&
      this.props.action &&
      typeof this.props.action === 'function'
    ) {
      await this.props.action()
      return true
    }
    global.Type = this.key
    const homePath = await FileTools.appendingHomeDirectory()

    switch (this.mapType) {
      case Chunk.MapType.SCENE: {
        // 三维地图

        let isOpenLastMap = false
        if (lastMap) {
          isOpenLastMap = await FileTools.fileIsExistInHomeDirectory(
            lastMap.path,
          )
        }
        //三维也先获取一下上次场景 add xiezhy
        if (isOpenLastMap) {
          NavigationService.navigate('Map3DStack', {screen: 'Map3D', params: {name:lastMap.name}})
        } else {
          const fileName = 'OlympicGreen_EXAMPLE'
          const homePath = await FileTools.appendingHomeDirectory()
          const cachePath = homePath + ConstPath.CachePath
          const fileDirPath = cachePath + fileName
          const arrFile = await FileTools.getFilterFiles(fileDirPath)
          if (arrFile.length === 0) {
            NavigationService.navigate('Map3DStack', {screen: 'Map3D', params: {mapType:  this.mapType,  onMapLoad: this.onMapLoad, toolbarModuleData: this.toolbarModuleData,}})
          } else {
            // const name = 'OlympicGreen_EXAMPLE'
            const name = 'OlympicGreen'
            NavigationService.navigate('Map3DStack', {screen: 'Map3D', params: { name, mapType:  this.mapType,  onMapLoad: this.onMapLoad, toolbarModuleData: this.toolbarModuleData,}})
          }
        }
        break
      }
      case Chunk.MapType.MAP: {
        // 二维地图
        let data = this.baseMapSource
        data.layerIndex = this.baseMapIndex
        global.BaseMapSize = data instanceof Array ? data.length : 1

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
        ]
        if (data instanceof Array) {
          wsData = wsData.concat(data)
        } else {
          wsData.push(data)
        }
        let param = {
          wsData,
          mapTitle: this.title,
          isExample: this.isExample,
          mapType:  this.mapType,
          onMapLoad: this.onMapLoad,
          toolbarModuleData: this.toolbarModuleData,
        }
        if (service) {
          param = Object.assign(param, {service: service})
        }
        // if (global.coworkMode) {
        //   NavigationService.navigate('CoworkMapStack', param)
        // } else {
        NavigationService.navigate('MapStack', {screen: 'MapView', params: param})
        // }
        break
      }
      case Chunk.MapType.AR: {
        // 二维地图
        let data = this.baseMapSource
        data.layerIndex = this.baseMapIndex
        global.BaseMapSize = data instanceof Array ? data.length : 1

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
        ]
        if (data instanceof Array) {
          wsData = wsData.concat(data)
        } else {
          wsData.push(data)
        }
        const param = {
          wsData,
          mapTitle: this.title,
          isExample: this.isExample,
          mapType:  this.mapType,
          onMapLoad: this.onMapLoad,
          toolbarModuleData: this.toolbarModuleData,
        }
        // if (global.coworkMode) {
        //   NavigationService.navigate('CoworkMapStack', param)
        // } else {
        NavigationService.navigate('MapStack', {screen: 'MapView', params: param})
        // }
        break
      }
      default:
        break
    }

    if (this.afterAction && typeof this.afterAction === 'function') {
      const result = await this.afterAction()
      if (!result) return false
    }
    return true
  }
}
