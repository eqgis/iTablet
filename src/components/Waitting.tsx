import React, { PureComponent } from 'react'
import { Animated, StyleSheet, Easing } from 'react-native'
import { scaleSize } from '../utils'
import { getPublicAssets } from '../assets'

const styles = StyleSheet.create({
  cornerMark: {
    width: scaleSize(32),
    height: scaleSize(32),
  },
})


interface Props {
  size?: number,
  isLoading?: boolean,
}

interface State {
  loading: Animated.Value,
}

class Waitting extends PureComponent<Props, State> {
  aniMotion: Animated.CompositeAnimation | undefined | null
  loadingValue: Animated.Value


  static defaultProps = {
    size: 0,
  }

  constructor(props: Props) {
    super(props)
    this.loadingValue = new Animated.Value(0)
    this.aniMotion = undefined
  }

  componentDidMount() {
    if (this.props.isLoading) {
      this.loading()
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.isLoading !== this.props.isLoading) {
      this.props.isLoading ? this.loading() : this.stop()
    }
  }

  componentWillUnmount() {
    this.stop()
  }

  loading = () => {
    if (!this.aniMotion) {
      this.loadingValue.setValue(0)
      this.aniMotion = Animated.timing(this.loadingValue, {
        toValue: this.loadingValue._value === 0 ? 1 : 0,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
      Animated.loop(this.aniMotion).start()
    }
  }

  stop = () => {
    if (this.aniMotion) {
      this.aniMotion.stop()
      this.aniMotion = null
    }
  }

  render() {
    return (
      <Animated.Image
        resizeMode={'contain'}
        style={[
          styles.cornerMark,
          this.props.size !== undefined && this.props.size > 0 && {
            width: this.props.size,
            height: this.props.size,
          },
          {
            transform: [{rotate: this.loadingValue
              .interpolate({inputRange: [0, 1],outputRange: ['0deg', '360deg']}),
            }],
          },
        ]}
        source={getPublicAssets().common.icon_downloading}
      />
    )
  }
}


export default Waitting