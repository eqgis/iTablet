import React from 'react'
import { ModuleViewProps } from '../..'
import { ARAnimationViewOption } from './ARAnimationView'
import AnimationDetail from './component/AnimationDetail'
import AnimatorParamSetting from './component/AnimatorParamSetting'
import ARAnimationList from './component/ARAnimationList'


type Props = ModuleViewProps<ARAnimationViewOption>

class BottomView extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  //推演动画相关自定义view
  renderAnimation = () => {
    return (
      <>
        <ARAnimationList visible={this.props.data?.arAnimation === 'list'} />
        <AnimatorParamSetting visible={this.props.data?.arAnimation === 'add'}/>
        <AnimationDetail visible={this.props.data?.arAnimation === 'detail'} />
      </>
    )
  }

  render() {
    return(
      <>
        {this.renderAnimation()}
      </>
    )
  }
}

export default BottomView