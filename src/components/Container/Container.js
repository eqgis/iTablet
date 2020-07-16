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
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import Header from '../Header'
import Loading from './Loading'
import { scaleSize, screen } from '../../utils'
import { Const } from '../../constants'

import styles from './styles'
import NavigationService from '../../containers/NavigationService'

const AnimatedView = Animated.View

export default class Container extends Component {
  props: {
    style?: StyleSheet, // 自定义内容样式
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
  }

  setHeaderVisible = (visible, immediately = false) => {
    if (this.props.header) {
      if (this.headerVisible === visible) return
      Animated.timing(this.state.top, {
        toValue: visible ? 0 : scaleSize(-200),
        duration: immediately ? 0 : Const.ANIMATED_DURATION,
      }).start()
      this.headerVisible = visible
    } else {
      this.containerHeader && this.containerHeader.setVisible(visible)
    }
  }

  setBottomVisible = (visible, immediately = false) => {
    if (this.bottomVisible === visible) return
    Animated.timing(this.state.bottom, {
      toValue: visible ? 0 : scaleSize(-200),
      duration: immediately ? 0 : Const.ANIMATED_DURATION,
    }).start()
    this.bottomVisible = visible
  }

  componentDidMount() {
    this.props.initWithLoading && this.setLoading(true)
    this.addNavigationListener()
  }

  componentWillUnmount() {
    this.removeNavigationListener()
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.device) !== JSON.stringify(this.props.device)
    ) {
      this.onOrientationChange()
    }
  }

  onOrientationChange = () => {
    let width = this.getCurrentOverlayWidth()
    Animated.timing(this.overlayWidth, {
      toValue: width,
      duration: 300,
    }).start()
    this.setPageVisible(this.visible)
  }

  getCurrentOverlayWidth = () => {
    let width
    if (GLOBAL.getDevice().orientation.indexOf('LANDSCAPE') === 0) {
      width = 55
      if (!GLOBAL.isPad && this.getAspectRation() < 1.8) {
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

  addNavigationListener = () => {
    if (
      this.props.navigation ||
      (this.props.headerProps && this.props.headerProps.navigation)
    ) {
      let navigation =
        this.props.navigation || this.props.headerProps.navigation
      this.unsubscribeFocus = navigation.addListener('willFocus', () => {
        this.setPageVisible(true)
      })

      this.unsubscribeBlur = navigation.addListener('willBlur', () => {
        this.setPageVisible(false)
      })
    }
  }

  removeNavigationListener = () => {
    this.unsubscribeFocus && this.unsubscribeFocus.remove()
    this.unsubscribeFocus && this.unsubscribeBlur.remove()
  }

  setPageVisible = visible => {
    //todo 处理返回时没有动画
    this.visible = visible
    if (this.props.hideInBackground) {
      if (NavigationService.isInMap() || NavigationService.isInMap3D()) {
        let isLandscape =
          GLOBAL.getDevice() &&
          GLOBAL.getDevice().orientation.indexOf('LANDSCAPE') === 0
        let x = visible ? 0 : isLandscape ? GLOBAL.getDevice().width : 0
        let duration = isLandscape ? 300 : 0
        Animated.timing(this.viewX, {
          toValue: x,
          duration: duration,
        }).start()
      }
    }
  }

  setLoading = (loading, info, extra = {}) => {
    this.loading.setLoading(loading, info, extra)
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
        NavigationService.navigate('MapView')
      }
      if (NavigationService.isInMap3D()) {
        NavigationService.navigate('Map3D')
      }
    }
  }

  renderHeader = fixHeader => {
    return this.props.withoutHeader ? (
      // Platform.OS === 'ios' ? (
      //   <View style={styles.iOSPadding} />
      // ) : (
      //   <View />
      // )
      null
    ) : this.props.header ? (
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
      />
    )
  }

  renderBottom = fixBottom => {
    if (!this.props.bottomBar) return null
    let isLandscape =
      GLOBAL.getDevice() &&
      GLOBAL.getDevice().orientation.indexOf('LANDSCAPE') === 0
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
    if (isLandscape && fixBottom) {
      style.push({ top: screen.getHeaderHeight() })
    }
    if (this.props.bottomProps && this.props.bottomProps.style) {
      style.push(this.props.bottomProps.style)
    }
    let bottom = isLandscape
      ? { right: this.state.bottom }
      : { bottom: this.state.bottom }
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
    let direction = {
      flexDirection:
        GLOBAL.getDevice() &&
        GLOBAL.getDevice().orientation.indexOf('LANDSCAPE') === 0
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
              style={[styles.overlay, { opacity: this.props.blankOpacity }]}
            />
          </AnimatedView>
        )}
        <View style={{ flex: 1 }}>
          <StatusBar animated={true} hidden={false} />
          {!fixHeader && this.renderHeader(fixHeader)}
          <View style={[{ flex: 1 }, direction]}>
            <ContainerView style={[styles.container, this.props.style]}>
              {this.props.children}
              {fixHeader && this.renderHeader(fixHeader)}
              {fixBottom && this.renderBottom(fixBottom)}
            </ContainerView>
            {!fixBottom && this.renderBottom(fixBottom)}
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
