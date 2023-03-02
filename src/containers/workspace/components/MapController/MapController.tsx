/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, Animated } from 'react-native'
import { MTBtn } from '../../../../components'
import { Const, ChunkType, TouchType } from '../../../../constants'
import { scaleSize, Toast, screen } from '../../../../utils'
import { getThemeAssets } from '../../../../assets'
import { SMap, SNavigation, SScene } from 'imobile_for_reactnative'
import styles from './styles'
import { getLanguage } from '../../../../language'
import { SNavigationInner } from 'imobile_for_reactnative/NativeModule/interfaces/navigation/SNavigationInner'

const DEFAULT_BOTTOM = scaleSize(135)
const DEFAULT_BOTTOM_LAND = scaleSize(26)
const DEFAULT_LEFT = scaleSize(34)

export default class MapController extends React.Component {
  props: {
    style?: any,
    type?: any,
    compassStyle?: any,
    device: any,
    currentFloorID: string,
    bottomHeight?: any,
    selectLocation?: any,
    selectZoomIn?: any,
    selectZoomOut?: any,
  }

  constructor(props) {
    super(props)
    this.deg = 0
    this.state = {
      left: new Animated.Value(DEFAULT_LEFT),
      //在导航界面缩放时，bottom高度为scaleSize(240)避免mapController被遮盖
      bottom:
        (global.NAV_PARAMS && global.NAV_PARAMS.length > 0) ||
        (global.PoiInfoContainer && global.PoiInfoContainer.state.visible) ||
        (global.NAVIGATIONSTARTBUTTON &&
          global.NAVIGATIONSTARTBUTTON.state.show)
          ? new Animated.Value(scaleSize(240))
          : this.props.device.orientation.indexOf('LANDSCAPE') === 0
            ? new Animated.Value(DEFAULT_BOTTOM_LAND)
            : new Animated.Value(DEFAULT_BOTTOM),
      compass: new Animated.Value(0),
      isGuiding: false,
    }
    this.visible = true
    this.compassInterval = null // 指北针监听
  }

  componentDidMount() {
    if (this.props.type === 'MAP_3D') {
      if (this.compassInterval) {
        clearInterval(this.compassInterval)
        this.compassInterval = null
      }
      this.compassInterval = setInterval(async () => {
        const deg = await SScene.getHeading()
        this.setCompass(deg)
      }, 600)
    } else {
      return
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.device.orientation !== prevProps.device.orientation) {
      this.onOrientationChange()
    }
  }

  componentWillUnmount() {
    if (this.compassInterval) {
      clearInterval(this.compassInterval)
      this.compassInterval = null
    }
  }

  onOrientationChange = () => {
    const animatedList = []
    let newBottom, newLeft
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      newBottom = DEFAULT_BOTTOM_LAND
    } else {
      newBottom = DEFAULT_BOTTOM
    }
    if (
      screen.isIphoneX() &&
      this.props.device.orientation.indexOf('LANDSCAPE') === 0
    ) {
      newLeft = DEFAULT_LEFT
    }
    animatedList.push(
      Animated.timing(this.state.bottom, {
        toValue: newBottom,
        duration: 300,
        useNativeDriver: false,
      }),
    )
    newLeft !== undefined &&
      animatedList.push(
        Animated.timing(this.state.left, {
          toValue: newLeft,
          duration: 300,
          useNativeDriver: false,
        }),
      )
    Animated.sequence(animatedList).start()
  }

  stopCompass = () => {
    if (this.compassInterval) {
      clearInterval(this.compassInterval)
      this.compassInterval = null
    }
  }

  /**
   * 设置导航状态
   * @param isGuiding
   */
  setGuiding = isGuiding => {
    if (isGuiding !== this.state.isGuiding) {
      this.setState({
        isGuiding,
      })
    }
  }
  /**
   * 改变bottom位置 导航路径界面使用
   * @param isBottom
   */
  changeBottom = isBottom => {
    const value = isBottom ? scaleSize(240) : DEFAULT_BOTTOM
    Animated.timing(this.state.bottom, {
      toValue: value,
      duration: Const.ANIMATED_DURATION,
      useNativeDriver: false,
    }).start()
  }

  setVisible = (visible, immediately = false) => {
    if (visible) {
      Animated.timing(this.state.left, {
        toValue: DEFAULT_LEFT,
        duration: immediately ? 0 : Const.ANIMATED_DURATION,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(this.state.left, {
        toValue: scaleSize(-200),
        duration: immediately ? 0 : Const.ANIMATED_DURATION,
        useNativeDriver: false,
      }).start()
    }
  }

  // 归位
  reset = (immediately = false) => {
    const animatedList = []
    const bottom =
      this.props.device.orientation.indexOf('LANDSCAPE') === 0
        ? DEFAULT_BOTTOM_LAND
        : DEFAULT_BOTTOM
    if (this.state.bottom._value !== bottom) {
      animatedList.push(
        Animated.timing(this.state.bottom, {
          toValue: bottom,
          duration: immediately ? 0 : Const.ANIMATED_DURATION,
          useNativeDriver: false,
        }),
      )
    }
    if (this.state.left._value !== DEFAULT_LEFT) {
      animatedList.push(
        Animated.timing(this.state.left, {
          toValue: DEFAULT_LEFT,
          duration: immediately ? 0 : Const.ANIMATED_DURATION,
          useNativeDriver: false,
        }),
      )
    }
    Animated.sequence(animatedList).start()
  }

  // 移动
  move = ({ bottom, left }, immediately = false) => {
    const animatedList = []
    if (bottom !== undefined) {
      let _bottom = this.state.bottom._value + bottom
      if (bottom === 'default') _bottom = DEFAULT_BOTTOM
      animatedList.push(
        Animated.timing(this.state.bottom, {
          toValue: _bottom,
          duration: immediately ? 0 : Const.ANIMATED_DURATION,
          useNativeDriver: false,
        }),
      )
    }
    if (left !== undefined) {
      let _left = this.state.left._value + left
      if (left === 'default') _left = DEFAULT_LEFT
      animatedList.push(
        Animated.timing(this.state.left, {
          toValue: _left,
          duration: immediately ? 0 : Const.ANIMATED_DURATION,
          useNativeDriver: false,
        }),
      )
    }
    Animated.sequence(animatedList).start()
  }

  setCompass = deg => {
    this.state.compass.setValue(this.deg)
    if (this.deg === deg) return
    deg &&
      Animated.timing(this.state.compass, {
        toValue: deg,
        duration: 1,
        useNativeDriver: false,
      }).start()
    this.deg = deg
  }

  plus = () => {
    if(this.props.selectZoomIn){
      this.props.selectZoomIn()
      return
    }
    if (this.props.type === 'MAP_3D') {
      return
    }
    SMap.zoom(2)
  }

  minus = () => {
    if(this.props.selectZoomOut){
      this.props.selectZoomOut()
      return
    }
    if (this.props.type === 'MAP_3D') {
      return
    }
    SMap.zoom(0.5)
  }

  map3Dplus = async () => {
    if (this.props.type !== 'MAP_3D') return
    clearInterval(this.timer)
    this.timer = setInterval(async () => {
      await SScene.zoom(0.025)
    }, 4)
  }

  map3Dminus = async () => {
    if (this.props.type !== 'MAP_3D') return
    clearInterval(this.timer)
    this.timer = setInterval(async () => {
      await SScene.zoom(-0.025)
    }, 4)
  }

  cloestimer = async () => {
    if (this.props.type !== 'MAP_3D') return
    clearInterval(this.timer)
  }

  location = async () => {
    if(this.props.selectLocation){
      this.props.selectLocation()
      return
    }
    if (this.props.type === 'MAP_3D') {
      // 平面场景不进行当前点定位 add jiakai
      if(!(await SScene.isEarthScene())){
        const layers = await SScene.getLayers()
        const visibleLayer = layers.filter(layer => layer.visible)
        if(visibleLayer.length < 1) return
        //这里原来接口遍历到了最后一个可见图层，暂时不改这个逻辑
        SScene.ensureVisibleByLayer(visibleLayer[visibleLayer.length - 1])
        return
      }
      await SScene.setHeading()
      // 定位到当前位置
      await SScene.flyToCurrent()
      // await SScene.resetCamera()
      this.setCompass(0)
      return
    }

    //通讯录点击定位和显示位置冲突
    SMap.deleteMarker(global.markerTag)

    // 将定位位置移动到当前定位
    const result = await SMap.moveToCurrent()

    //{{ 更新地图选点控件 add jiakai
    const map = await SMap.getCurrentLocation()
    const point = {
      x: map.longitude,
      y: map.latitude,
    }

    if (global.Type === ChunkType.MAP_NAVIGATION){
      // const point = await SMap.getCurrentLocation()

      // 当触摸状态为 ‘NORMAL’ 且在地图选点页面里面时，点击定位到当前位置起始点位置也跟着变化
      if(global.TouchType === TouchType.NORMAL
          && global.MAPSELECTPOINT.state.show
      ){
        // 导航采集里选择起始点

        await SMap.removeCallout('startPoint')
        await SMap.addCallout('startPoint', {x: point.x, y: point.y}, {type: 'image', resource: 'start_point'})

        global.STARTX = point.x
        global.STARTY = point.y
        //显示选点界面的顶部 底部组件
        global.MAPSELECTPOINT.setVisible(true)
        global.MAPSELECTPOINTBUTTON.setVisible(true, {
          button: getLanguage(global.language).Map_Main_Menu.SET_AS_START_POINT,
        })
        //全幅
        global.toolBox.showFullMap(true)
        //导航选点 全屏时保留mapController
        global.mapController && global.mapController.setVisible(true)

      } else if(global.TouchType === TouchType.NAVIGATION_TOUCH_END) {
        // 导航采集里选择结束点

        await SMap.removeCallout('endPoint')
        await SMap.addCallout('endPoint', {x: point.x, y: point.y}, {type: 'image', resource: 'destination_point'})

        global.ENDX = point.x
        global.ENDY = point.y
      }
    }

    !result &&
        Toast.show(
          getLanguage(global.language).Prompt.OUT_OF_MAP_BOUNDS,
        )

    global.MAPSELECTPOINT.updateLatitudeAndLongitude(point)
    // }}
  }

  renderCompass = () => {
    const spin = this.state.compass.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg'],
    })
    if (this.props.type === 'MAP_3D') {
      return (
        <View
          style={[styles.compassView, this.props.compassStyle, styles.shadow]}
        >
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <MTBtn
              style={styles.compass}
              imageStyle={styles.btnImg}
              key={'controller_minus'}
              textColor={'black'}
              size={MTBtn.Size.NORMAL}
              image={getThemeAssets().mapTools.icon_navigation}
              onPress={this.location}
            />
          </Animated.View>
        </View>
      )
    } else {
      return <View />
    }
  }

  renderLocation = () => {
    if (this.props.type === 'MAP_3D') {
      return <View />
    } else {
      return (
        <MTBtn
          style={[styles.btn, styles.separator, styles.shadow]}
          imageStyle={styles.btnImg}
          key={'controller_location'}
          textColor={'black'}
          size={MTBtn.Size.NORMAL}
          image={getThemeAssets().mapTools.icon_location}
          onPress={this.location}
        />
      )
    }
  }

  render() {
    if (this.state.isGuiding || this.props.currentFloorID) return null
    return (
      <Animated.View
        style={[
          styles.container,
          this.props.style,
          { left: this.state.left },
          { bottom: this.state.bottom },
          this.props.bottomHeight&&{ bottom: this.props.bottomHeight},
        ]}
      >
        <View style={[styles.topView, styles.shadow]}>
          <MTBtn
            style={styles.btn}
            imageStyle={styles.btnImg}
            key={'controller_plus'}
            textColor={'black'}
            size={MTBtn.Size.NORMAL}
            image={getThemeAssets().mapTools.icon_enlarge}
            onPress={this.plus}
            onPressIn={this.map3Dplus}
            onPressOut={this.cloestimer}
          />
          <MTBtn
            style={styles.btn}
            imageStyle={styles.btnImg}
            key={'controller_minus'}
            textColor={'black'}
            size={MTBtn.Size.NORMAL}
            image={getThemeAssets().mapTools.icon_narrow}
            onPress={this.minus}
            onPressIn={this.map3Dminus}
            onPressOut={this.cloestimer}
          />
        </View>
        {this.renderLocation()}
        {this.renderCompass()}
      </Animated.View>
    )
  }
}
