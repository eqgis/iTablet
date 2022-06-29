import { ARElementType, SARMap } from 'imobile_for_reactnative'
import React from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'
import {  getImage } from '@/assets'
import { AppEvent, AppStyle, AppToolBar, dp } from '@/utils'
import { ModuleViewProps } from '@/Toolbar'
import AnimationList from './AnimationList'
import { ARElement } from 'imobile_for_reactnative/types/interface/ar'
import * as ARMapModule from './ModuleData'


type Props = ModuleViewProps<unknown>

interface State {
  addAnimations: string[]
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
    AppEvent.addListener('ar_map_on_add_element', async () => {
      const currentAddElement = AppToolBar.getData().addARElement
      currentAddElement && ARMapModule.getAddElements().push(currentAddElement)
      if(
        AppToolBar.getCurrentOption()?.key === 'AR_MAP_ADD_MODEL'
      ) {
        if(currentAddElement?.type === ARElementType.AR_MODEL) {
          const animations = await SARMap.getModelAnimation(currentAddElement.layerName, currentAddElement.id)
          if(animations.length > 0) {
            this.setState({addAnimations: animations, currentArElement: currentAddElement})
          }
        }
      }
    })
    AppEvent.addListener('ar_map_add_end', () => {
      ARMapModule.clearAddList()
      this.setState({addAnimations: [], currentArElement: undefined, showAdd: false})
    })
    AppEvent.addListener('ar_map_add_start', () => {
      this.setState({showAdd: true})
    })
    AppEvent.addListener('ar_map_add_undo', () => {
      this.setState({addAnimations: [], currentArElement: undefined,})
    })
  }

  componentWillUnmount() {
    AppEvent.removeListener('ar_map_on_add_element')
    AppEvent.removeListener('ar_map_add_end')
    AppEvent.removeListener('ar_map_add_start')
    AppEvent.removeListener('ar_map_add_undo')
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
          source={getImage().add_white_big}
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