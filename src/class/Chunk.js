/**
 * 首页模块基础类
 */
import NavigationService from '../containers/NavigationService'
import { FileTools } from '../native'
import { ConstPath } from '../constants'
import { SMap } from 'imobile_for_reactnative'
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
  onMapOpenSuccess: () => void,
  isEnterHome: boolean,
  defaultData: string,

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
  onMapOpenSuccess: () => void
  defaultData:string
  isEnterHome: boolean

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
    this.afterAction = props.afterAction // action之前的检测，返回false则不执行之后的action

    this.baseMapSource = props.baseMapSource // 默认地图资源

    this.baseMapIndex = props.baseMapIndex // 默认地图资源对应的地图index

    this.isExample = props.isExample || false // 是否是示例，只显示地图，没有其他功能

    this.mapType = props.mapType || '' // 二维，三维地图，默认为空   'MAP' ｜ 'SCENE' ｜ ''

    this.onMapLoad = props.onMapLoad //地图/AR地图/三维场景加载完成回调（地图容器控件初始化完成回调）

    this.toobarModuleData = props.toolbarModuleData ? props.toolbarModuleData : []

    this.isEnterHome =
      props.isEnterHome === false ? false : true // 是否进入首页，默认为true即进入首页

    this.onMapOpenSuccess = props.onMapOpenSuccess // 地图/AR地图/三维场景打开完成回调 （带一个可选参数，用于判断三维场景是否有场景打开了，地图和AR地图没有传任何参数）
    this.defaultData = props.defaultData || '' // 小插件的默认数据

  }

  getTitle = () => this.title

  action = async (user, lastMap, service) => {
    if (this.preAction && typeof this.preAction === 'function') {
      let result = await this.preAction()
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
        if(isOpenLastMap){
          NavigationService.navigate('Map3DStack', {screen: 'Map3D', params: {name:lastMap.name}})
        }else{
          let fileName = 'OlympicGreen_EXAMPLE'
          const homePath = await FileTools.appendingHomeDirectory()
          const cachePath = homePath + ConstPath.CachePath
          const fileDirPath = cachePath + fileName
          const arrFile = await FileTools.getFilterFiles(fileDirPath)
          if (arrFile.length === 0) {
            NavigationService.navigate('Map3DStack', {screen: 'Map3D', params: {mapType:  this.mapType,  onMapLoad: this.onMapLoad, toolbarModuleData: this.toolbarModuleData,  onMapOpenSuccess:  this.onMapOpenSuccess,}})
          } else {
            // const name = 'OlympicGreen_EXAMPLE'
            const name = 'OlympicGreen'
            NavigationService.navigate('Map3DStack', {screen: 'Map3D', params: { name, mapType:  this.mapType,  onMapLoad: this.onMapLoad, toolbarModuleData: this.toolbarModuleData,  onMapOpenSuccess:  this.onMapOpenSuccess,}})
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

        if(this.defaultData !== '') {
          if(this.defaultData.indexOf("http") !== -1) {
            // 用户指定的数据在服务上 to do
          } else {
            // 用户指定的数据在项目里
            const startIndex = this.defaultData.lastIndexOf("/") + 1
            const endtIndex = this.defaultData.lastIndexOf(".")
            const name = this.defaultData.substring(startIndex, endtIndex)

            let dataPathTemp = this.defaultData
            dataPathTemp = dataPathTemp.replace("assets/userData/","")
            dataPathTemp = dataPathTemp.replace(".zip","")
            // 数据在手机里的目录
            const dataPath = homePath + ConstPath.CachePath + dataPathTemp
            if(!( await FileTools.fileIsExist(dataPath))) {
              // 将数据拷到手机的iTablet/Cache目录下
              await FileTools.initAppletsUserData(name)
            }

            // 地图用相对路径
            const MapPath = homePath + userPath + ConstPath.RelativeFilePath.Map + this.defaultMapName + `.xml`
            if(!( await FileTools.fileIsExist(MapPath))) {
              let wsPathTemp = dataPath + "/" + name + ".smwu"
              let result = await SMap.importWorkspaceInfo({
                server: wsPathTemp,
                type: 9,
              })
            }
          }
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
        if (this.baseMapSource instanceof Array) {
          wsData = wsData.concat(this.baseMapSource)
        } else if (this.baseMapSource) {
          wsData = wsData.push(this.baseMapSource)
        }
        let param = {
          wsData,
          mapTitle: this.title,
          isExample: this.isExample,
          mapType:  this.mapType,
          onMapLoad: this.onMapLoad,
          toolbarModuleData: this.toolbarModuleData,
          onMapOpenSuccess:  this.onMapOpenSuccess,
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
        let param = {
          wsData,
          mapTitle: this.title,
          isExample: this.isExample,
          mapType:  this.mapType,
          onMapLoad: this.onMapLoad,
          toolbarModuleData: this.toolbarModuleData,
          onMapOpenSuccess:  this.onMapOpenSuccess,
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
      let result = await this.afterAction()
      if (!result) return false
    }
    return true
  }
}
