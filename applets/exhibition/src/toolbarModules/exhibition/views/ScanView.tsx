import { AppToolBar, dp } from '@/utils'
import React from 'react'
import { EmitterSubscription, Image, ScaledSize, TouchableOpacity } from 'react-native'
import Scan from '../components/Scan'
import { getImage } from '../../../assets'
import { SARMap } from 'imobile_for_reactnative'

interface Props {
  windowSize: ScaledSize
}

interface State {
  tracked: boolean
}

class ScanView extends React.Component<Props, State> {

  imgListener: EmitterSubscription | null = null

  constructor(props: Props) {
    super(props)

    this.state = {
      tracked: false
    }
  }

  componentDidMount(): void {
    this.imgListener = SARMap.addImgTrackingStateChangeListener(state => {
      this.setState({
        tracked: state.tracked
      })
    })
  }

  componentWillUnmount(): void {
    this.imgListener?.remove()
  }

  back = () => {
    SARMap.stopAREnhancePosition()
    AppToolBar.goBack()
  }

  renderBack = () => {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: dp(20),
          left: dp(20),
          width: dp(60),
          height: dp(60),
          borderRadius: dp(25),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
        onPress={this.back}
      >
        <Image
          style={{ position: 'absolute', width: '100%', height: '100%' }}
          source={getImage().icon_return}
        />
      </TouchableOpacity>
    )
  }

  renderScan = () => {
    return <Scan windowSize={this.props.windowSize} />
  }

  render() {
    return(
      <>
        {!this.state.tracked && this.renderScan()}
        {this.renderBack()}
      </>
    )
  }
}

export default ScanView