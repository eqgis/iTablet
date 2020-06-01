/**
 * 功能模块基础类
 */
import Chunk from './Chunk'
import { MapTabs } from '../constants'
export default class Module {
  // static MapType = Chunk.MapType
  static MapType = {
    MAP: 'MAP',
    SCENE: 'SCENE',
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
      }
    }
  }

  createChunk = (language, params) => {
    this.chunk = new Chunk(params)
    return this.chunk
  }
}
