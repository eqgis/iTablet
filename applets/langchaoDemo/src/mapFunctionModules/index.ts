import ToolbarModule from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'
import CallModule from './Call'
import PositionSubmitModule from './PositionSubmit'
import CallDetailModule from './CallDetail'
import ChangeBaseLayerModule from './ChangeBaseLayer'


ToolbarModule.addAppletModule(CallModule)
ToolbarModule.addAppletModule(PositionSubmitModule)
ToolbarModule.addAppletModule(CallDetailModule)
ToolbarModule.addAppletModule(ChangeBaseLayerModule)



export {
  CallModule,
  PositionSubmitModule,
  CallDetailModule,
  ChangeBaseLayerModule,
}