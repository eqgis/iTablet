import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { RootState } from "../redux/types"
import createToolbar from "../SMToolbar/createToolbar"
import { AppToolBar } from "../utils"
import { ToolbarModuleViewProps } from "../SMToolbar/ToolbarModule"
import { MainStackScreenNavigationProps } from "@/types"
import {
  arSandTableData,
  ModuleList,
} from "./modules"

const SToolbar = createToolbar<ModuleList>()


export interface Props extends ReduxProps {
  navigation: MainStackScreenNavigationProps<'Camera'>
  showCalibration: () => void
  onSwitchAR: () => void
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
      </SToolbar.Container>
    )
  }
}

const mapStateToProp = (state: RootState) => ({
  windowSize: state.device2.windowSize,
})


const mapDispatch = {

}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(Toolbar)