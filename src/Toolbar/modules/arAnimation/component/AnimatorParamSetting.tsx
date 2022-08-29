import { ARAnimatorCategory, ARAnimatorPlayOrder, ARAnimatorType } from 'imobile_for_reactnative/NativeModule/dataTypes'
import { ARAnimatorParameter, ARGroupAnimatorParameter, ARModelAnimatorParameter, ARNodeAnimatorParameter, ModelAnimation } from 'imobile_for_reactnative/NativeModule/interfaces/ar/SARMap'
import { TARElementType } from 'imobile_for_reactnative/types/data'
import React from 'react'
import { AppToolBar } from '../../../../utils'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../../../../redux/types'
import { ARAnimatorWithID, editARAnimation, setARAnimation } from '@/redux/models/aranimation'
import { SARMap } from 'imobile_for_reactnative'
import { ToolbarSlideCard } from 'imobile_for_reactnative/components/ToolbarKit'

import * as ModuleData from '../Actions'
import AnimationSetting from './AnimationSetting/AnimationSetting'


interface Props extends ReduxProps {
  visible: boolean
}

interface State {
  modelAnimationList: ModelAnimation[]
  editAnimator?: ARAnimatorParameter
  listVisible: boolean
}

export interface ARAnimatorSettingParam {
  arModelAnimations: ModelAnimation[] | undefined
  editAnimator?: ARAnimatorWithID
  element: {layerName: string, id: number, type: TARElementType}
}


class AnimatorParamSetting extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      modelAnimationList: [],
      listVisible: this.props.visible,
    }

  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.visible !== this.props.visible) {
      if(this.props.visible) {
        this.onVisible()
      } else {
        this.setState({
          listVisible: false
        })
      }
    }
  }

  onVisible = () => {
    const setting = ModuleData.getARAnimatorSettingParam()
    const editAnimator = setting.editAnimator
    const modelAnimation = setting.arModelAnimations

    this.setState({
      modelAnimationList: modelAnimation || [],
      editAnimator,
      listVisible: true,
    })
  }

  onCommit = (param: ARNodeAnimatorParameter | ARModelAnimatorParameter) => {
    const setting = ModuleData.getARAnimatorSettingParam()
    param.layerName = setting.element.layerName
    param.elementID = setting.element.id
    let animation: ARGroupAnimatorParameter<ARAnimatorParameter> | undefined = this.props.arAnimaton
    if(setting.editAnimator === undefined) {
      if(animation === undefined) {
        //直接新建动画，创建动画列表
        animation = {
          name: 'New Animation List',
          category: ARAnimatorCategory.CUSTOM,
          type: ARAnimatorType.GROUP_TYPE,
          delay: 0,
          order: ARAnimatorPlayOrder.AFTER_PREVIOUS,
          repeatCount: 0,
          animations: []
        }
        animation.animations.push(param)
        this.props.setARAnimation(animation)
      } else {
        //现有动画中添加
        animation.animations.push(param)
        this.props.setARAnimation({...animation})
      }
    } else {
      const editId = setting.editAnimator.eid
      this.props.editARAnimation(editId, param)
    }

    SARMap.clearSelection()
    AppToolBar.goBack()
  }

  goBack = () => {
    AppToolBar.goBack()
  }

  render() {
    return(
      <ToolbarSlideCard
        visible={this.state.listVisible}
      >
        <AnimationSetting
          onSave={this.onCommit}
          onCancel={this.goBack}
          animationType={'aranimation'}
          editAnimator={this.state.editAnimator}
          modelAnimationList={this.state.modelAnimationList}
          windowSize={this.props.windowSize}
        />
      </ToolbarSlideCard>
    )
  }
}

const mapStateToProp = (state: RootState) => ({
  arAnimaton: state.aranimation.arAnimation,
  windowSize: state.device.toJS().windowSize
})

const mapDispatch = {
  setARAnimation,
  editARAnimation
}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(AnimatorParamSetting)
