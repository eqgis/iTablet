import { SARMap } from 'imobile_for_reactnative'
import React from 'react'
import { getImage } from '../../../assets'
import { AppToolBar, dp } from '../../../utils'
import { ModuleViewProps } from '../../../Toolbar'
import { FloatBar } from '@/components'


export interface ARAnimationViewOption {
  arAnimation: 'null' | 'list' | 'add' | 'detail' | 'playing'
}

type Props = ModuleViewProps<ARAnimationViewOption>

interface State {
}

class ARAnimationView extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
    }
  }


  renderAnimationPlayingBack = () => {
    return (
      <FloatBar
        style={{
          position: 'absolute',
          bottom: dp(10),
          left: dp(10),
          width: dp(45),
          height: dp(45),
          borderRadius: dp(15),
          justifyContent: 'center',
        }}
        imageStyle={{
          width: dp(24),
          height: dp(24),
        }}
        data={[
          {
            image: getImage().back,
            key: 'back',
            action: () => {
              SARMap.stopARAnimation()
              AppToolBar.goBack()
            },
          }
        ]}
      />
    )
  }

  //推演动画相关自定义view
  renderAnimation = () => {
    return (
      <>
        {this.props.data?.arAnimation === 'playing' && this.renderAnimationPlayingBack()}
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

export default ARAnimationView

