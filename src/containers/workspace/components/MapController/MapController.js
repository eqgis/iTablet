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
import { SMap, SScene } from 'imobile_for_reactnative'
import styles from './styles'
import { getLanguage } from '../../../../language'
import { getImage } from '../../../../../applets/langchaoDemo/src/assets/Image'

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
        let deg = await SScene.getcompass()
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
    let animatedList = []
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
    let value = isBottom ? scaleSize(240) : DEFAULT_BOTTOM
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
    let animatedList = []
    let bottom =
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
    let animatedList = []
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
        SScene.ensureVisibleLayer(await SScene.getVisableLayer())
        return
      }
      await SScene.setHeading()
      // 定位到当前位置
      await SScene.location()
      // await SScene.resetCamera()
      this.setCompass(0)
      return
    }

    //通讯录点击定位和显示位置冲突
    SMap.deleteMarker(global.markerTag)

    // 将定位位置移动到当前定位
    const result = await SMap.moveToCurrent()

    //{{ 更新地图选点控件 add jiakai
    let map = await SMap.getCurrentPosition()
    let point = {
      x: map.x,
      y: map.y,
    }

    if (global.Type === ChunkType.MAP_NAVIGATION){
      // const point = await SMap.getCurrentPosition()

      // 当触摸状态为 ‘NORMAL’ 且在地图选点页面里面时，点击定位到当前位置起始点位置也跟着变化
      if(global.TouchType === TouchType.NORMAL
          && global.MAPSELECTPOINT.state.show
      ){
        // 导航采集里选择起始点
        await SMap.getStartPoint(point.x, point.y, false)
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
        await SMap.getEndPoint(point.x, point.y, false)
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
          style={[styles.btn, styles.separator, styles.shadow,{
            elevation: 5,
            shadowOffset: { width: 0, height: 0 },
            shadowColor: 'rgba(0, 0, 0, 1)',
            shadowOpacity: 1,
            shadowRadius: scaleSize(10),
          }]}
          imageStyle={styles.btnImg}
          key={'controller_location'}
          textColor={'black'}
          size={MTBtn.Size.NORMAL}
          // image={getThemeAssets().mapTools.icon_location}
          image={getImage().icon_location}
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
        <View style={[styles.topView, styles.shadow,{
          elevation: 5,
          shadowOffset: { width: 0, height: 0 },
          shadowColor: 'rgba(0, 0, 0, 1)',
          shadowOpacity: 1,
          shadowRadius: scaleSize(10),
        }]}>
          <MTBtn
            style={styles.btn}
            imageStyle={[styles.btnImg,
              {
                width: scaleSize(32),
                height: scaleSize(32),
              }]}
            key={'controller_plus'}
            textColor={'black'}
            size={MTBtn.Size.NORMAL}
            // image={getThemeAssets().mapTools.icon_enlarge}
            image={getImage().icon_zoomUp}
            onPress={this.plus}
            onPressIn={this.map3Dplus}
            onPressOut={this.cloestimer}
          />
          <MTBtn
            style={styles.btn}
            imageStyle={[styles.btnImg,
              {
                width: scaleSize(32),
                height: scaleSize(32),
              }]}
            key={'controller_minus'}
            textColor={'black'}
            size={MTBtn.Size.NORMAL}
            // image={getThemeAssets().mapTools.icon_narrow}
            image={getImage().icon_zoomDown}
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
