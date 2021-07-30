import React from 'react'
import { ViewStyle, View, Animated } from 'react-native'
import { getThemeAssets } from '../assets'
import { scaleSize } from '../utils'
import { SLocation } from 'imobile_for_reactnative'


interface Props {
  style: ViewStyle,
  orientation: "LANDSCAPE" | "PORTRAIT" | "LANDSCAPE-LEFT" | "LANDSCAPE-RIGHT" | "UNKNOWN" | "PORTRAITUPSIDEDOWN",
}

interface State {
  available: boolean,
  direction: number,
}

class CompassView extends React.Component<Props, State> {
  listener: any

  constructor(props: Props) {
    super(props)

    this.state = {
      available: false,
      direction: 0,
    }
  }

  componentDidMount() {
    this.addListener()
  }

  componentWillUnmount() {
    this.removeListener()
  }

  getScreenRotation = (): number => {
    switch(this.props.orientation) {
      case 'LANDSCAPE-LEFT':
        return -90
      case 'LANDSCAPE-RIGHT':
        return 90
      case 'PORTRAITUPSIDEDOWN':
        return 180
      case 'LANDSCAPE':
        return -90
      default:
        return 0
    }
  }

  updateCompass = (degree: number) => {
    this.setState({
      direction: - degree,
    })
  }

  addListener = () => {
    SLocation.startCompassSensor().then(result => {
      SLocation.addCompassListener(this.updateCompass)
      this.setState({
        available: result,
      })
    })
  }

  removeListener = () => {
    SLocation.removeCompassListener()
    SLocation.stopCompassSensor()
  }

  render() {
    if(!this.state.available) return null
    return(
      <View style={this.props.style}>
        <Animated.Image
          source={getThemeAssets().publicAssets.compass}
          style={{
            width: scaleSize(80),
            height: scaleSize(80),
            transform:[
              {rotate: this.state.direction + this.getScreenRotation() + 'deg'},
            ],
          }}
        />
      </View>
    )
  }
}

export default CompassView