/**
 * 功能模块基础类
 */
import { ImageSourcePropType, Platform } from 'react-native'
import Chunk, { ChunkProps } from './Chunk'
import { MapTabs } from '../constants'
import FunctionModule from './FunctionModule'

type HeaderButton = Array<string | {
  key: string,
  image: ImageSourcePropType,
  action: () => void,
}>

type EXAMPLE_MAP = {
  name?: string,
  mapName?: string,
  name_android?: string,
  mapName_android?: string,
  name_ios?: string,
  mapName_ios?: string,
}

interface EXAMPLE {
  // DEFAULT: EXAMPLE_MAP,
  'DEFAULT'?: EXAMPLE_MAP | EXAMPLE_MAP[],
  'CN'?: EXAMPLE_MAP | EXAMPLE_MAP[],
  'TR'?: EXAMPLE_MAP | EXAMPLE_MAP[],
  'JA'?: EXAMPLE_MAP | EXAMPLE_MAP[],
  'FR'?: EXAMPLE_MAP | EXAMPLE_MAP[],
  'AR'?: EXAMPLE_MAP | EXAMPLE_MAP[],
  'EN'?: EXAMPLE_MAP | EXAMPLE_MAP[],
}

interface Props {
  key: string,
  mapType: '2D' | '3D' | '',
  chunk: Chunk,
  example: EXAMPLE,
  functionModules: Array<FunctionModule>,
  headerButtons: HeaderButton[],
  tabModules: Array<string>,
}

export default class Module {
  // static MapType = Chunk.MapType
  static MapType = {
    MAP: 'MAP',
    SCENE: 'SCENE',
    AR: 'AR',
  }

  props: Props

  key = '' // 必填

  mapType = '' // 二维，三维地图，默认为空   '2D' ｜ '3D' ｜ ''

  chunk: Chunk // 必填，首页模块，包含数据，图片，事件等的类

  example: EXAMPLE = {} // 在线示例地图数据，数据检验

  functionModules: Array<FunctionModule> = [] // 地图界面右侧功能栏

  headerButtons: HeaderButton[] = [] // 地图导航栏右侧按钮 App默认有audio，undo，search

  tabModules: Array<string> = [] // 地图底部Tab栏

  getTabModules: (() => void) | undefined

  getFunctionModules: (() => void) | undefined

  constructor(props: Props) {
    this.props = props || {}

    this.key = this.props.key // 必填

    this.mapType = props.mapType || '' // 二维，三维地图，默认为空   '2D' ｜ '3D' ｜ ''

    this.chunk = this.props.chunk // 必填，首页模块，包含数据，图片，事件等的类

    this.example = this.props.example || {} // 在线示例地图数据，数据检验

    this.functionModules = this.props.functionModules || [] // 地图界面右侧功能栏

    this.headerButtons = this.props.headerButtons // 地图导航栏右侧按钮 App默认有audio，undo，search

    this.tabModules = this.props.tabModules || [] // 地图底部Tab栏
    // 若tabModules为空，默认根据二维三维地图生成tabModules
    if (this.tabModules.length === 0) {
      switch (this.mapType) {
        case Module.MapType.SCENE:
          this.tabModules = [
            MapTabs.Scene,
            MapTabs.Layer3DManager,
            MapTabs.LayerAttribute3D,
            MapTabs.Map3DSetting,
          ]
          break
        case Module.MapType.MAP:
          this.tabModules = [
            MapTabs.MapView,
            MapTabs.LayerManager,
            MapTabs.LayerAttribute,
            MapTabs.MapSetting,
          ]
          break
        case Module.MapType.AR:
          this.tabModules = [
            MapTabs.MapView,
            MapTabs.LayerManager,
            MapTabs.LayerAttribute,
            MapTabs.MapSetting,
          ]
          break
      }
    }

    /** 获取地图底部Tabs */
    this.getTabModules = undefined

    /** 获取地图侧边栏 */
    this.getFunctionModules = undefined
  }

  /**
   * 根据当前语言，获取对应语言地图名称
   * @param {string} language
   */
  getExampleName = (language = '') => {
    let _example, names = []

    switch (language) {
      case 'AR':
        _example = this.example.AR
        break
      case 'CN':
        _example = this.example.CN
        break
      case 'EN':
        _example = this.example.EN
        break
      case 'FR':
        _example = this.example.FR
        break
      case 'JA':
        _example = this.example.JA
        break
      case 'TR':
        _example = this.example.TR
        break
      default:
        _example = this.example.DEFAULT
    }
    if (!_example) {
      if (this.example.DEFAULT) {
        _example = this.example.DEFAULT
      } else {
        return []
      }
    }

    const getNames = function (data: EXAMPLE_MAP) {
      let _name = '', _mapName = ''
      if (Platform.OS === 'ios' && data.name_ios) {
        _name = data.name_ios
        _mapName = data.mapName_ios || _name
      } else if (Platform.OS === 'android' && data.name_android) {
        _name = data.name_android
        _mapName = data.mapName_android || _name
      } else {
        _name = data.name || ''
        _mapName = data.mapName || _name
      }
      if (_name === '' || _name === undefined) {
        _name = data.name || ''
        _mapName = data.mapName || _name
      }
      return {
        name: _name,
        mapName: _mapName,
      }
    }

    if (_example instanceof Array) {
      for (let i = 0; i < _example.length; i++) {
        names.push(getNames(_example[i]))
      }
    } else {
      names = [getNames(_example)]
    }

    return names
  }

  createChunk = (language: string, params: ChunkProps) => {
    this.chunk = new Chunk(params)
    return this.chunk
  }
}
