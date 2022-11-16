import React from "react"
import { connect, ConnectedProps } from "react-redux"
import { RootState } from "../redux/types"
import { ToolbarKit } from 'imobile_for_reactnative/components'
import { AppToolBar } from "../utils"
import { ToolbarModuleData, ToolbarModuleViewProps } from "imobile_for_reactnative/components/ToolbarKit"
import { MainStackScreenNavigationProps } from "@/types"
import { resource } from './resource'
import {
  arAnimationData,
  arAttributeData,
  arMapAddData,
  arMapData,
  arMapEditData,
  arMapSettingData,
  arMapStyleData,
  arMapToolbox,
  arSandTableData,
  ModuleList,
} from "./modules"
import { getLayers, setCurrentLayer } from "@/redux/models/layers"
import { getARLayers, setCurrentARLayer } from "@/redux/models/arlayer"
import {closeARMap, createARMap, saveARMap} from '@/redux/models/armap'
import { setPipeLineAttribute, changeShowAttributeElement } from "@/redux/models/arattribute"
import { ScaledSize } from "react-native"
import { setBackgroundSoundPlayState } from "@/redux/models/setting"

const SToolbar = ToolbarKit.createToolbar<ModuleList>(resource)


export interface Props extends ReduxProps {
  navigation: MainStackScreenNavigationProps<'Camera'>
  visibleChange: (visible: boolean) => void
  extraModule: ToolbarModuleData<unknown>[]
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
        <SToolbar.Module name={'ARMAP_TOOLBOX'} data={arMapToolbox}/>
        <SToolbar.Module name={'ARMAP'} data={arMapData}/>
        <SToolbar.Module name={'ARMAP_EDIT'} data={arMapEditData}/>
        {this.props.extraModule.map(module => <SToolbar.Module name={module.name} data={module}/>)}
      </SToolbar.Container>
    )
  }
}

const mapStateToProp = (state: RootState) => ({
  windowSize: state.device.toJS().windowSize as ScaledSize,
  arMapInfo: state.arlayer.toJS(),
  arMap: state.armap.toJS(),
  currentUser: state.user.toJS().currentUser,
  pipeLineAttribute: state.arattribute.pipeLineAttribute,
  elementAttribute: state.arattribute.elementAttribute,
  backgroundSoundPlaystate: state.setting.toJS().backgroundSoundPlaystate,
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
  changeShowAttributeElement,
  setBackgroundSoundPlayState,
}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(Toolbar)