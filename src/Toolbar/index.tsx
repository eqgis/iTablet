import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { RootState } from "../redux/types"
import createToolbar from "../SMToolbar/createToolbar"
import { AppToolBar } from "../utils"
import { ToolbarModuleViewProps } from "../SMToolbar/ToolbarModule"
import { MainStackScreenNavigationProps } from "@/types"
import {
  arAnimationData,
  arAttributeData,
  arMapAddData,
  arMapSettingData,
  arMapStyleData,
  arSandTableData,
  ModuleList,
} from "./modules"
import { getARLayers } from "@/redux/models/arlayer"

const SToolbar = createToolbar<ModuleList>()


export interface Props extends ReduxProps {
  navigation: MainStackScreenNavigationProps<'Camera'>
  visibleChange: (visible: boolean) => void
}

export type ModuleViewProps<ModuleOption> = Props & ToolbarModuleViewProps<ModuleOption>

class Toolbar extends React.Component<Props> {

  constructor(props: Props) {
    super(props)
  }

  render() {
    return (
      <SToolbar.Container
        ref={ref => AppToolBar.setToolBar(ref)}
        onOverlayPress={() => AppToolBar.goBack()}
        {...this.props}
      >
        <SToolbar.Module name={'ARSANDTABLE'} data={arSandTableData}/>
        <SToolbar.Module name={'ARANIMATION'} data={arAnimationData}/>
        <SToolbar.Module name={'ARATTRIBUTE'} data={arAttributeData}/>
        <SToolbar.Module name={'ARMAP_ADD'} data={arMapAddData}/>
        <SToolbar.Module name={'ARMAP_STYLE'} data={arMapStyleData}/>
        <SToolbar.Module name={'ARMAP_SETTING'} data={arMapSettingData}/>
      </SToolbar.Container>
    )
  }
}

const mapStateToProp = (state: RootState) => ({
  windowSize: state.device2.windowSize,
  arMapInfo: state.arlayer.toJS(),
})

const mapDispatch = {
  getARLayers
}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(Toolbar)