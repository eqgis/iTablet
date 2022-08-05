import { ARElementType, SARMap } from 'imobile_for_reactnative'
import React from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'
import {  getImage } from '../../../assets'
import { AppEvent, AppStyle, AppToolBar, dp } from '../../../utils'
import { ModuleViewProps } from '../../../Toolbar'
import AnimationList from './AnimationList'
import { ARElement } from 'imobile_for_reactnative/types/interface/ar'
import * as ARMapModule from './ModuleData'
import ToolbarModule from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'
import { ConstToolType } from '@/constants'
import { ModelAnimation } from 'imobile_for_reactnative/NativeModule/interfaces/ar/SARMap'
type Props = ModuleViewProps<unknown>

interface State {
  addAnimations: ModelAnimation[]
  currentArElement?: ARElement
  showAdd: boolean
}

class ARMapAddView extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      addAnimations: [],
      showAdd: false,
    }
  }

  componentDidMount() {
    AppEvent.addListener('ar_map_on_add_element', this.onAddElement)
    AppEvent.addListener('ar_map_add_end', this.onAddEnd)
    AppEvent.addListener('ar_map_add_start', this.onAddStart)
    AppEvent.addListener('ar_map_add_undo', this.onAddUndo)
  }

  componentWillUnmount() {
    AppEvent.removeListener('ar_map_on_add_element', this.onAddElement)
    AppEvent.removeListener('ar_map_add_end', this.onAddEnd)
    AppEvent.removeListener('ar_map_add_start', this.onAddStart)
    AppEvent.removeListener('ar_map_add_undo', this.onAddUndo)
  }

  onAddElement = async (currentAddElement: ARElement) => {
    ARMapModule.getAddElements().push(currentAddElement)
    if(ToolbarModule.getParams().type === ConstToolType.SM_AR_DRAWING_MODAL
      || ToolbarModule.getParams().type === ConstToolType.SM_AR_DRAWING_ADD_POINT
    ) {
      if(currentAddElement.type === ARElementType.AR_MODEL) {
        const animations = await SARMap.getModelAnimation(currentAddElement.layerName, currentAddElement.id)
        if(animations.length > 0) {
          this.setState({addAnimations: animations, currentArElement: currentAddElement})
        }
      }
    }
  }

  onAddStart = () => {
    this.setState({showAdd: true})
  }

  onAddEnd = () => {
    ARMapModule.clearAddList()
    this.setState({addAnimations: [], currentArElement: undefined, showAdd: false})
  }

  onAddUndo = () => {
    this.setState({addAnimations: [], currentArElement: undefined,})
  }


  /** 添加模型时的动画列表 */
  renderAddAnimationList = () => {
    if(this.state.addAnimations.length === 0 || this.state.currentArElement === undefined) return null
    return (
      <AnimationList
        addAnimations={this.state.addAnimations}
        arElement={this.state.currentArElement}
      />
    )
  }

  renderAddButton = () => {
    return (
      <TouchableOpacity
        style={[styles.addButton, !this.isPortrait && {bottom: dp(30)}]}
        onPress={()=>{
          AppEvent.emitEvent('ar_on_tap_add_buttun')
        }}
      >
        <Image
          style={{width: dp(80), height: dp(80)}}
          source={getImage().icon_ar_measure_add}
        />
      </TouchableOpacity>
    )
  }



  isPortrait = this.props.windowSize.height > this.props.windowSize.width

  render() {
    this.isPortrait = this.props.windowSize.height > this.props.windowSize.width
    return(
      <>
        {this.renderAddAnimationList()}
        {this.state.showAdd && this.renderAddButton()}
      </>
    )
  }
}

export default ARMapAddView


const styles = StyleSheet.create({
  addButton: {
    ...AppStyle.FloatStyle,
    position: 'absolute',
    alignSelf: 'center',
    bottom: dp(130),
  },
})