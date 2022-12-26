import ToolbarModule from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'
import CallModule from './Call'
import PositionSubmitModule from './PositionSubmit'


ToolbarModule.addAppletModule(CallModule)
ToolbarModule.addAppletModule(PositionSubmitModule)


export {
  CallModule,
  PositionSubmitModule,
}