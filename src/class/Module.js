/**
 * 功能模块基础类
 */
import Chunk from './Chunk'
import { MapTabs } from '../constants'
export default class Module {
  constructor(props) {
    this.props = props || {}

    this.key = this.props.key // 必填

    this.is3D = this.props.is3D || false // 是否是三维地图

    this.chunk = this.props.chunk // 必填，首页模块，包含数据，图片，事件等的类

    this.example = this.props.example || {} // 在线示例地图数据，数据检验

    this.functionModules = this.props.functionModules || [] // 地图界面右侧功能栏

    this.headerButtons = this.props.headerButtons // 地图导航栏右侧按钮 App默认有audio，undo，search

    this.tabModules = this.props.tabModules || [] // 地图底部Tab栏
    // 若tabModules为空，默认根据二维三维地图生成tabModules
    if (this.tabModules.length === 0) {
      if (this.is3D) {
        this.tabModules = [
          MapTabs.Scene,
          MapTabs.Layer3DManager,
          MapTabs.LayerAttribute3D,
          MapTabs.Map3DSetting,
        ]
      } else {
        this.tabModules = [
          MapTabs.MapView,
          MapTabs.LayerManager,
          MapTabs.LayerAttribute,
          MapTabs.MapSetting,
        ]
      }
    }
  }

  createChunk = (language, params) => {
    this.chunk = new Chunk(params)
    return this.chunk
  }
}
