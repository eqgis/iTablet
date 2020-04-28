import ToolbarModule from '../../../src/containers/workspace/components/ToolBar/modules/ToolbarModule'
import { ToolbarType } from '../../../src/constants'
import FunctionModule from '../../../src/class/FunctionModule'
import FunctionData from './FunctionData'
import FunctionAction from './FunctionAction'

class FunctionExample extends FunctionModule {
  constructor (props) {
    super(props)
  }

  getToolbarSize = () => {}

  action = () => {
    // 注册当前模块数据到ToolbarModule中
    this.setModuleData(this.type)
    const params = ToolbarModule.getParams()
    // 获取显示的数据
    const _data = FunctionData.getData(this.type, params)
    // Toolbar 内容弹出框的类型
    const containerType = ToolbarType.table
    // 获取内容弹出框的尺寸，自定义尺寸需要复写getToolbarSize方法
    const data = ToolbarModule.getToolbarSize(containerType, {})
    // 显示全屏
    params.showFullMap && params.showFullMap(true)
    // 弹出Toolbar并设置类型和内容
    params.setToolbarVisible(true, this.type, {
      containerType,
      isFullScreen: true,
      ...data,
      ..._data,
    })
  }
}

export default function () {
  return new FunctionExample({
    type: 'FunctionExample',
    key: '示例',
    title: '示例',
    size: 'large',
    image: require('../../../src/assets/function/icon_function_start.png'),
    getData: FunctionData.getData, // 当前Function模块获取数据的方法
    actions: FunctionAction, // 当前Function模块所有事件
  })
}
