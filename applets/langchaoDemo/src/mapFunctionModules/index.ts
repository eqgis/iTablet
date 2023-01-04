import ToolbarModule from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'
import CallModule from './Call'
import PositionSubmitModule from './PositionSubmit'
import CallDetailModule from './CallDetail'


ToolbarModule.addAppletModule(CallModule)
ToolbarModule.addAppletModule(PositionSubmitModule)
ToolbarModule.addAppletModule(CallDetailModule)



export {
  CallModule,
  PositionSubmitModule,
}