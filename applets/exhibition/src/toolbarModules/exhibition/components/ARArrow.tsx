import { getImage } from '../../../assets/'
import React from 'react'
import { Animated, Easing, EmitterSubscription, Image } from 'react-native'
import { dp } from '@/utils'
import { SExhibition } from 'imobile_for_reactnative'


interface State {
  targetPosition: 0 | 1 | 2 | 3 | 4
}

class ARArrow extends React.Component<unknown, State> {

  moveValue = new Animated.Value(0)

  event: EmitterSubscription | null = null

  constructor(props: unknown) {
    super(props)

    this.state = {
      targetPosition: 0
    }
  }

  componentDidMount(): void {
    this.event = SExhibition.addExhibitionTargetPositionChangeListener(mode => {
      if(this.state.targetPosition === 0 && mode !== 0) {
        this._startMoveArrow()
      }
      this.setState({targetPosition: mode})
    })
  }

  componentWillUnmount(): void {
    this.event?.remove()
  }

  _startMoveArrow = () => {
    const animation = Animated.timing(this.moveValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
    Animated.loop(animation).start()
  }

  renderArrow = () => {
    if(this.state.targetPosition == 0) return null
    const move = this.moveValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, this.state.targetPosition === 1 ? -dp(30) : dp(30)]
    })
    const moveUpDown = this.moveValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, this.state.targetPosition === 3 ? -dp(30) : dp(30)]
    })
    const isLR = this.state.targetPosition === 1 || this.state.targetPosition === 2
    return (
      <Animated.View
        style={{
          position: 'absolute',
          top: '40%',
          alignSelf: 'center',
          width: dp(100),
          height: dp(100),
          transform:
            isLR ? [{translateX: move}, {rotateY: this.state.targetPosition === 1 ? '0deg' : '180deg'}]
              : [{translateY: moveUpDown}, {rotate: this.state.targetPosition === 3 ? '90deg' : '270deg'}]
        }}
      >
        <Image
          source={getImage().guide_arrow}
          style={{width: '100%', height: '100%' }}
        />
      </Animated.View>
    )
  }

  render() {
    return this.renderArrow()
  }
}

export default ARArrow