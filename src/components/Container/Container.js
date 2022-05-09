/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { Component } from 'react'
import {
  View,
  ScrollView,
  Animated,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  Platform,
} from 'react-native'
import Header from '../Header'
import Loading from './Loading'
import { scaleSize , screen, Toast} from '../../utils'
import { Const } from '../../constants'

import styles from './styles'
import NavigationService from '../../containers/NavigationService'
import { ChunkType } from '../../constants'
import { getLanguage } from '../../language/index'
import { useNavigation, useRoute } from '@react-navigation/native'

const AnimatedView = Animated.View


export default class Container extends Component {
  props: {
    style?: StyleSheet, // 自定义内容样式
    headStyle?: StyleSheet, // 头部自定义内容样式
    children: any, // Component自带属性，子组件
    header?: any, // 自定义导航栏
    bottomBar?: any, // 自定义底部栏
    withoutHeader?: boolean, // 设置没有导航栏
    headerProps?: Object, // 导航栏属性（参照Header.js）
    bottomProps?: Object, // {type: 'fix'} 底部栏和内容是同一级的
    // 若不是fix，则底部栏是压盖在内容上的
    navigation: Object, // react-navigation的导航
    initWithLoading?: boolean, // 初始化显示加载
    dialogInfo?: boolean, // 加载的文字
    scrollable?: boolean, // 内容是ScrollView或者View
    showFullInMap?: boolean, // 横屏时，地图上层界面是否显示半屏
    blankOpacity?: Number, // 横屏时，半屏遮罩透明度
    hideInBackground?: boolean, // 在mapview和map3d中,StackNavigator中有新页面时是否隐藏本页面
    orientation?: String, // redux中的实时横竖屏数据
    onOverlayPress?: () => {}, // 横屏时，半屏遮罩点击事件
    isOverlayBefore?: boolean, // 横屏是，遮罩的位置，true为左，反之为右
  }

  static defaultProps = {
    orientation:
      Dimensions.get('screen').height > Dimensions.get('screen').width
        ? 'PORTRAIT'
        : 'LANDSCAPE',
    withoutHeader: false,
    sideMenu: false,
    initWithLoading: false,
    scrollable: false,
    showFullInMap: false, //是否在mapview和map3d中显示全屏页面，默认半屏
    blankOpacity: 0, //透明半屏的透明度
    hideInBackground: true, //在mapview和map3d中,StackNavigator中有新页面时是否隐藏本页面
    isOverlayBefore: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      top: new Animated.Value(0),
      bottom: new Animated.Value(0),
    }
    this.headerVisible = true
    this.bottomVisible = true
    this.overlayWidth = new Animated.Value(this.getCurrentOverlayWidth())
    this.viewX = new Animated.Value(0)
    this.visible = true
    this.overlayCanClick = true

    // 是否显示选点的提示标识，true(显示)，false(不显示)
    this.isShowPointToast = false
  }

  setHeaderVisible = (visible, immediately = false) => {
    if (this.props.header) {
      if (this.headerVisible === visible) return
      Animated.timing(this.state.top, {
        toValue: visible ? 0 : scaleSize(-200),
        duration: immediately ? 0 : Const.ANIMATED_DURATION,
        useNativeDriver: false,
      }).start()
      this.headerVisible = visible
    } else {
      this.containerHeader && this.containerHeader.setVisible(visible)
    }
  }

  setBottomVisible = (visible, immediately = false) => {
    // if (this.bottomVisible === visible) return
    Animated.timing(this.state.bottom, {
      toValue: visible ? 0 : scaleSize(-200),
      duration: immediately ? 0 : Const.ANIMATED_DURATION,
      useNativeDriver: false,
    }).start()
    this.bottomVisible = visible
  }

  componentDidMount() {
    this.props.initWithLoading && this.setLoading(true)
    this.addNavigationListener()
    this.addBackListener()
  }

  componentWillUnmount() {
    this.removeNavigationListener()
    this.removeBackListener()
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.device) !== JSON.stringify(this.props.device)
    ) {
      this.onOrientationChange()
    }
  }

  onOrientationChange = () => {
    // 解决横屏收起bottomView 竖屏显示 再次横屏bottomView不显示
    if(this.bottomVisible){
      this.setBottomVisible(true, true)
    }
    let width = this.getCurrentOverlayWidth()
    Animated.timing(this.overlayWidth, {
      toValue: width,
      duration: 300,
      useNativeDriver: false,
    }).start()
    this.setPageVisible(this.visible)
  }

  getCurrentOverlayWidth = () => {
    let width
    if (global.getDevice().orientation.indexOf('LANDSCAPE') === 0) {
      if (!global.isPad && this.getAspectRation() < 1.8) {
        width = 40
      } else {
        width = 40
      }
    } else {
      width = 0
    }
    if (
      !(NavigationService.isInMap() || NavigationService.isInMap3D()) ||
      this.props.showFullInMap
    ) {
      width = 0
    }
    return width
  }

  addBackListener = () => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onBackPress)
    }
  }

  removeBackListener = () => {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackPress)
    }
  }

  onBackPress = () => {
    let navigation =
      this.props.navigation ||
      (this.props.headerProps && this.props.headerProps.navigation)
    let backAction
    let headerProps = this.props.headerProps
    if (headerProps) {
      if (
        headerProps.backAction &&
        typeof headerProps.backAction === 'function'
      ) {
        backAction = headerProps.backAction
      }
    }
    //todo 所有container添加navigation属性
    // if (navigation) {
    //   const navState = navigation.getState()
    //   let name = navState.routes[navState.index].name
    //   let current = NavigationService.isCurrent(name)
    //   if (!current) {
    //     return false
    //   }
    // }
    if (backAction) {
      backAction()
      return true
    }
    if (navigation) {
      navigation.goBack(null)
      return true
    }
    return false
  }

  addNavigationListener = () => {
    if (
      this.props.navigation ||
      (this.props.headerProps && this.props.headerProps.navigation)
    ) {
      let navigation =
        this.props.navigation || this.props.headerProps.navigation
      this.unsubscribeFocus = () => {
        this.setPageVisible(true)
      }
      navigation.addListener('willFocus', this.unsubscribeFocus)

      this.unsubscribeBlur = () => {
        this.setPageVisible(false)
      }
      navigation.addListener('willBlur', this.unsubscribeBlur)
    }
  }

  removeNavigationListener = () => {
    if (
      this.props.navigation ||
      (this.props.headerProps && this.props.headerProps.navigation)
    ) {
      let navigation =
        this.props.navigation || this.props.headerProps.navigation
      this.unsubscribeFocus && navigation.removeListener('willFocus', this.unsubscribeFocus)
      this.unsubscribeBlur && navigation.removeListener('willBlur', this.unsubscribeBlur)
    }
  }

  setPageVisible = visible => {
    //todo 处理返回时没有动画
    this.visible = visible
    if (this.props.hideInBackground) {
      if (NavigationService.isInMap() || NavigationService.isInMap3D()) {
        let isLandscape =
          global.getDevice() &&
          global.getDevice().orientation.indexOf('LANDSCAPE') === 0
        let x = visible ? 0 : isLandscape ? global.getDevice().width : 0
        let duration = isLandscape ? 300 : 0
        // 解决遮罩层在右时，View跳出两次 zcj
        if(!this.props.isOverlayBefore){
          x = x * (-1)
        }

        Animated.timing(this.viewX, {
          toValue: x,
          duration: duration,
          useNativeDriver: false,
        }).start()
      }
    }
  }

  setLoading = async (loading, info, extra = {}) => {
    await this.loading.setLoading(loading, info, extra)
    // 当加载状态为不加载，是否显示选点的提示标识为true，且当前模块儿为导航采集时，就给一个“长按选点”的提示
    if (!loading 
      && this.isShowPointToast
      && global.Type === ChunkType.MAP_NAVIGATION) {  
      // 导航采集选点提示
      Toast.show(getLanguage(this.props.language).Prompt.LONG_PRESS_SELECT_POINT, {duration: 2500})
    }
    // 当加载的文字信息为“加载中”，将是否显示选点的提示标识设为true
    if(info === getLanguage(this.props.language).Prompt.LOADING && global.Type === ChunkType.MAP_NAVIGATION){
      this.isShowPointToast = true 
    } else {
      this.isShowPointToast = false
    }
  }

  getAspectRation = () => {
    let height = Math.max(
      Dimensions.get('screen').height,
      Dimensions.get('screen').width,
    )
    let width = Math.min(
      Dimensions.get('screen').height,
      Dimensions.get('screen').width,
    )
    return height / width
  }

  onOverlayPress = () => {
    // 防止动画过程中重复点击
    if(this.overlayCanClick){
      this.overlayCanClick = false
    }else return

    if (this.props.onOverlayPress) {
      this.props.onOverlayPress()
    } else if (this.props.headerProps) {
      if (
        this.props.headerProps.backAction &&
        typeof this.props.headerProps.backAction === 'function'
      ) {
        this.props.headerProps.backAction()
      } else if (this.props.headerProps.navigation) {
        this.props.headerProps.navigation.goBack()
      }
    } else {
      if (NavigationService.isInMap()) {
        NavigationService.navigate('MapStack', {screen: 'MapView', params: param})
      }
      if (NavigationService.isInMap3D()) {
        NavigationService.navigate('Map3DStack', {screen: 'Map3D', params: param})
      }
    }
  }

  renderHeader = fixHeader => {
    return this.props.withoutHeader ? // ) //   <View /> // ) : ( //   <View style={styles.iOSPadding} /> // Platform.OS === 'ios' ? (
      null : this.props.header ? (
        <AnimatedView
          style={[fixHeader && styles.fixHeader, { top: this.state.top }]}
        >
          {this.props.header}
        </AnimatedView>
      ) : (
        <Header
          ref={ref => (this.containerHeader = ref)}
          navigation={this.props.navigation}
          {...this.props.headerProps}
          headStyle = {this.props.headStyle}
        />
      )
  }

  renderBottom = fixBottom => {
    if (!this.props.bottomBar) return null
    let isLandscape =
      global.getDevice() &&
      global.getDevice().orientation.indexOf('LANDSCAPE') === 0
    let style = []
    if (fixBottom) {
      if (isLandscape) {
        style.push(styles.fixRightBar)
      } else {
        style.push(styles.fixBottomBar)
      }
    } else {
      if (isLandscape) {
        style.push(styles.flexRightBar)
      } else {
        style.push(styles.flexBottomBar)
      }
    }
    // if (isLandscape && fixBottom) {
    //   style.push({ top: screen.getHeaderHeight() })
    // }
    if (this.props.bottomProps && this.props.bottomProps.style) {
      style.push(this.props.bottomProps.style)
    }
    let bottom = isLandscape
      ? { right: this.state.bottom, height: Platform.OS === 'android' ? screen.getScreenSafeHeight(this.props.device.orientation) :this.props.device.height }
      : { bottom: this.state.bottom, width: this.props.device.width }
    return (
      <AnimatedView style={[style, bottom]}>
        {this.props.bottomBar}
      </AnimatedView>
    )
  }

  render() {
    let ContainerView = this.props.scrollable ? ScrollView : View

    // 是否为flex布局的header
    let fixHeader =
      this.props.headerProps && this.props.headerProps.type === 'fix'
    let fixBottom =
      this.props.bottomProps && this.props.bottomProps.type === 'fix'
    let headerOnTop =
      (this.props.headerProps && this.props.headerProps.headerOnTop) || false
    let direction = {
      flexDirection:
        global.getDevice() &&
        global.getDevice().orientation.indexOf('LANDSCAPE') === 0
          ? 'row'
          : 'column',
    }
    let width
    width = this.overlayWidth.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '1%'],
    })
    return (
      <AnimatedView
        style={[styles.view, { transform: [{ translateX: this.viewX }] }]}
      >
        {this.props.isOverlayBefore && (
          <AnimatedView style={{ width: width }}>
            <TouchableOpacity
              onPress={this.onOverlayPress}
              activeOpacity={this.props.blankOpacity}
              style={[styles.overlay, { opacity: 0.5 }]}
            />
          </AnimatedView>
        )}
        <View style={{ flex: 1 }}>
          <StatusBar animated={true} hidden={false} />
          {headerOnTop && this.renderHeader(fixHeader)}
          <View style={[{ flex: 1, overflow: 'hidden' }, direction]}>
            <ContainerView style={[styles.container]}>
              <View style={[styles.container, this.props.style]}>
                {!headerOnTop && this.renderHeader(fixHeader)}
                {this.props.children}
              </View>
              {/*{fixBottom && this.renderBottom(fixBottom)}*/}
            </ContainerView>
            {this.renderBottom(fixBottom)}
          </View>
          <Loading
            ref={ref => (this.loading = ref)}
            info={this.props.dialogInfo}
            initLoading={this.props.initWithLoading}
          />
        </View>
        {!this.props.isOverlayBefore && (
          <AnimatedView style={{ width: width }}>
            <TouchableOpacity
              onPress={this.onOverlayPress}
              activeOpacity={this.props.blankOpacity}
              style={[styles.overlay, { opacity: this.props.blankOpacity }]}
            />
          </AnimatedView>
        )}
      </AnimatedView>
    )
  }
}