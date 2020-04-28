/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */

import * as React from 'react'
import { Animated, View, Text, Platform ,requireNativeComponent} from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import { SMap } from 'imobile_for_reactnative'
import { color } from '../../../../styles'

export default class ScaleView extends React.Component {
  props: {
    device: Object,
    language: String,
    isShow: boolean,
    mapNavigation: Object,
    device: Object,
  }

  constructor(props) {
    super(props)
    this.left = new Animated.Value(scaleSize(120))
    this.bottom =
      this.props.device.orientation.indexOf('LANDSCAPE') === 0
        ? new Animated.Value(scaleSize(30))
        : new Animated.Value(scaleSize(120))
    this.state = {
      width: scaleSize(65),
      title: '',
      isAddedListener: false,
      visible: true,
    }
    this.startTime = 0
    this.endTime = 0
    this.INTERVAL = 300
  }

  componentDidMount() {
    if (!this.state.isAddedListener) {
      SMap.addScaleChangeDelegate({
        scaleViewChange: this.scaleViewChange,
      })
      this.setState({
        isAddedListener: !this.state.isAddedListener,
      })
    }
    //获取比例尺、图例数据
    this.getInitialData()
  }

  componentDidUpdate(prevProps) {
    if (this.props.isShow && !prevProps.isShow) {
      SMap.getScaleData().then(data => {
        this.scaleViewChange(data)
      })
    }
    if (this.props.device.orientation !== prevProps.device.orientation) {
      this.onOrientationChange()
    }
  }

  componentWillUnmount() {
    if (this.state.isAddedListener) {
      SMap.addScaleChangeDelegate({
        scaleViewChange: () => {},
      })
    }
  }

  onOrientationChange = () => {
    if (this.state.visible) {
      let newBottom
      if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
        newBottom = scaleSize(30)
      } else {
        newBottom = scaleSize(120)
      }
      Animated.timing(this.bottom, {
        toValue: newBottom,
        duration: 300,
      }).start()
    }
  }

  showFullMap = (visible, immediately = false) => {
    if (this.state.visible === visible) return
    if (this.props.device.orientation.indexOf('LANDSCAPE') < 0) {
      Animated.parallel([
        Animated.timing(this.left, {
          toValue: visible ? scaleSize(120) : scaleSize(30),
          duration: immediately ? 0 : 300,
        }),
        Animated.timing(this.bottom, {
          toValue: visible ? scaleSize(120) : scaleSize(30),
          duration: immediately ? 0 : 300,
        }),
      ]).start()
    } else {
      Animated.timing(this.left, {
        toValue: visible ? scaleSize(120) : scaleSize(30),
        duration: immediately ? 0 : 300,
      }).start()
    }
    this.setState({
      visible,
    })
  }

  getInitialData = async () => {
    let data = await SMap.getScaleData()
    await this.scaleViewChange(data)
  }

  scaleViewChange = data => {
    this.endTime = +new Date()
    if (
      data &&
      data.title &&
      data.width &&
      this.endTime - this.startTime > this.INTERVAL
    ) {
      let width = ~~this.state.width
      let title = this.state.title
      if (width !== ~~data.width || title !== data.title) {
        this.setState(
          {
            width: data.width,
            title: data.title,
          },
          () => {
            this.startTime = this.endTime
          },
        )
      }
    }
  }

  render() {
    if (this.props.mapNavigation.isShow) return null

    var props = { ...this.props }

    return (
      <Animated.View
        style={{
          position: 'absolute',
          left: this.left,
          bottom: this.bottom,
          width: scaleSize(150),
          height: scaleSize(60),
        }}
      >
        <RCTSMScaleView
          ref={ref => this.SMScaleView = ref}
          {...props}
          style={{
            flex: 1,
            alignSelf: 'stretch',
          }}
        />
      </Animated.View>
    )
  }
}
var RCTSMScaleView = requireNativeComponent('RCTSMScaleView', RCTSMScaleView)

