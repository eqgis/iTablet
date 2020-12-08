/**
 * 功能模块基础类
 */
import { Platform } from 'react-native'
import Chunk from './Chunk'
import { MapTabs } from '../constants'
export default class Module {
  // static MapType = Chunk.MapType
  static MapType = {
    MAP: 'MAP',
    SCENE: 'SCENE',
    AR: 'AR',
  }
  
  constructor(props) {
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

    let getNames = function (data) {
      let _name = '', _mapName = ''
      if (Platform.OS === 'ios' && data.name_ios) {
        _name = data.name_ios
        _mapName = data.mapName_ios || _name
      } else if (Platform.OS === 'android' && data.name_android) {
        _name = data.name_android
        _mapName = data.mapName_android || _name
      } else {
        _name = data.name
        _mapName = data.mapName || _name
      }
      if (_name === '' || _name === undefined) {
        data = data.DEFAULT
        _name = data.name
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

  createChunk = (language, params) => {
    this.chunk = new Chunk(params)
    return this.chunk
  }
}
