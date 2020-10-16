import ToolbarModule from '../../../src/containers/workspace/components/ToolBar/modules/ToolbarModule'
import { ToolbarType } from '../../../src/constants'
import CustomFunctionModule from '../../../src/class/CustomFunctionModule'
import FunctionData from './FunctionData'
import FunctionAction from './FunctionAction'

// 当前模块自定义类型
export const FunctionExampleTypes = {
  FUNCTION_EXAMPLE: 'FUNCTION_EXAMPLE',
  FUNCTION_EXAMPLE_LIST_ACTION: 'FUNCTION_EXAMPLE_LIST_ACTION',
  FUNCTION_EXAMPLE_TABLE_ACTION: 'FUNCTION_EXAMPLE_TABLE_ACTION',
}

class FunctionExample extends CustomFunctionModule {
  constructor (props) {
    super(props)
    this.setTypes(FunctionExampleTypes) // 用于检测Type是否可用，避免与系统自带类型冲突
  }

  getToolbarSize = () => {}

  action = () => {
    // 注册当前模块数据到ToolbarModule中
    this.setModuleData(this.type)
    const params = ToolbarModule.getParams()
    // 获取显示的数据
    const _data = FunctionData.getData(this.type, params)
    // ToolbarType 为 Toolbar 内容弹出框的类型
    const containerType = ToolbarType.table // table | selectableList | selectableList 等
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
    type: FunctionExampleTypes.FUNCTION_EXAMPLE,
    title: '示例',
    size: 'large',
    image: require('../../../src/assets/userDefine/userDefineTab.png'),
    getData: FunctionData.getData, // 当前Function模块获取数据的方法
    actions: FunctionAction, // 当前Function模块所有事件
  })
}
