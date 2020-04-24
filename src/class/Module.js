/**
 * 功能模块基础类
 */
import Chunk from './Chunk'
export default class Module {
  constructor(props) {
    if (props) {
      this.props = props
      this.key = props.key
      this.chunk = props.chunk // 首页模块，包含数据，图片，事件等的类
      this.example = props.example || {} // 在线示例地图数据，数据检验
      this.functionModules = props.functionModules || [] // 地图界面右侧功能栏
      this.tabModules = props.tabModules || [] // 地图底部Tab栏
    }
  }

  createChunk = (language, params) => {
    this.chunk = new Chunk(params)
    return this.chunk
  }
}
