import ToolbarModule from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'
import checkModule from './checkModule'
import locationModule from './locationModule'

// 注册自定义地图工具栏模块
ToolbarModule.addAppletModule(checkModule)
ToolbarModule.addAppletModule(locationModule)

export {
  checkModule,
  locationModule,
}