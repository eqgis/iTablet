import React from 'react'
import { ToolbarModuleData } from './ToolbarModuleData'

export type ModuleProps<ParamList> = Props<ParamList, keyof ParamList>

type Props<ParamList, key extends keyof ParamList> = {
  name: key
  data: ToolbarModuleData<ParamList>
}

/** 自定义view自动添加的props */
export interface ToolbarModuleViewProps<ModuleOption> {
  /** 当前模块自定义view是否可见 */
  visible: boolean
  /** 当前模块自定义view的自定义数据 */
  data?: ModuleOption
}

class ToolbarModule<ParamList> extends React.Component<ModuleProps<ParamList>>  {

  constructor(prop: ModuleProps<ParamList>) {
    super(prop)

  }

  render() {
    return null
  }
}

export default ToolbarModule