import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { RootState } from "../redux/types"
import { ToolbarKit } from 'imobile_for_reactnative/components'
import { AppToolBar } from "../utils"
import { ToolbarModuleViewProps } from "imobile_for_reactnative/components/ToolbarKit"
import { MainStackScreenNavigationProps } from "@/types"
import { resource } from './resource'
import {
  arAnimationData,
  arAttributeData,
  arMapAddData,
  arMapSettingData,
  arMapStyleData,
  arSandTableData,
  ModuleList,
} from "./modules"
import { getLayers, setCurrentLayer } from "@/redux/models/layers"
import { getARLayers, setCurrentARLayer } from "@/redux/models/arlayer"
import {closeARMap, createARMap, saveARMap} from '@/redux/models/armap'
import { setPipeLineAttribute } from "@/redux/models/arlayer"

const SToolbar = ToolbarKit.createToolbar<ModuleList>(resource)


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
  windowSize: state.device.toJS().windowSize,
  arMapInfo: state.arlayer.toJS(),
  arMap: state.armap.toJS(),
  currentUser: state.user.toJS().currentUser,
})

const mapDispatch = {
  getARLayers,
  createARMap,
  saveARMap,
  closeARMap,
  setCurrentLayer,
  getLayers,
  setCurrentARLayer,
  setPipeLineAttribute,
}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(Toolbar)