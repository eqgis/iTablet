import { ConstPath } from '@/constants'
import { dp } from '@/utils'
import { FileTools, SARMap } from 'imobile_for_reactnative'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

interface Props {
  show: boolean
  animationName: string
  onSkip: () => void
  onGuideEnd: () => void
}

class ARGuide extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if(prevProps.show != this.props.show) {
      if(this.props.show) {
        this.startGuide()
      } else {
        this.endGuide()
      }
    }
  }

  startGuide = async () => {
    const mapName = 'AR超超博士'
    const homePath = await FileTools.getHomeDirectory()
    const mapPath = homePath + ConstPath.UserPath + 'Customer' + '/' + ConstPath.RelativePath.ARMap
    const path = mapPath + mapName + '.arxml'
    await SARMap.open(path)

    const animations = await SARMap.getARAnimations()

    const animation = animations.find(item => item.name === this.props.animationName)

    if(animation !== undefined) {
      SARMap.playARAnimation(animation)
    } else {
      this.props.onSkip()
    }
  }

  endGuide = async () => {
    await SARMap.stopARAnimation()
    setTimeout(() => {
      SARMap.close()
    }, 500)
    this.props.onGuideEnd()
  }


  renderSkip = () => {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: dp(50),
          right: dp(80),
          width: dp(40),
          height: dp(40),
          borderRadius: dp(10),
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onPress={this.props.onSkip}
      >
        <Text>
          {'跳过'}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return this.props.show && this.renderSkip()
  }
}

export default ARGuide