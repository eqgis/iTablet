/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, Animated } from 'react-native'
import styles, * as stylesConst from './styles'
import { scaleSize, setSpText } from '../../utils'

class NavigationHeader extends Component {
  props: {
    header?: any, // 自定义Header
    headerStyle?: StyleSheet, // 自定义Header Style
    withoutBack?: boolean, // 是否有返回按钮
    backBtnType?: string, // 返回按钮类型（white, gray）
    backAction?: any, // 返回事件
    title?: string, // 标题
    subTitle?: string, //副标题
    subTitleStyle?: StyleSheet, //副标题样式
    headerViewStyle?: StyleSheet, // Header Style
    headerLeftStyle?: StyleSheet, //
    headerRightStyle?: StyleSheet, //
    headerTitleViewStyle?: StyleSheet, //
    headerTitleStyle?: StyleSheet, //
    headerLeft?: any, // Header左端组件，可为Array
    headerRight?: any, // Header右端组件，可为Array
    opacity?: number, // 透明度
    activeOpacity?: number, // 返回键点击透明度
    type?: string, // default | float:浮动Header | floatNoTitle:浮动无title,透明背景 | fix:固定顶部，绝对定位
    navigation?: any, // navigation
    count?: any,
    darkBackBtn?: boolean, // 黑色透明背景，返回按钮
    headerCenter?: any,
    backImg?: any, // 返回按钮图片

    /** 转态栏是否可见*/
    statusVisible?: boolean,
  }

  static defaultProps = {
    title: '',
    withoutBack: false,
    backBtnType: 'gray',
    opacity: 1,
    activeOpacity: 0.2,
    type: 'default',
    headerViewStyle: styles.navigationHeader,
    headerLeftStyle: styles.headerLeftView,
    headerTitleViewStyle: styles.headerTitleView,
    headerTitleStyle: styles.headerTitle,
    subTitleStyle: styles.subTitle,
    count: 0,
    darkBackBtn: false,
    headerCenter: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      headerTop: new Animated.Value(0),
      headerHeight:
        global.getDevice().orientation &&
        global.getDevice().orientation.indexOf('LANDSCAPE') === 0
          ? new Animated.Value(stylesConst.HEADER_HEIGHT_LANDSCAPE)
          : new Animated.Value(stylesConst.HEADER_HEIGHT),
    }
    this.visible = true
    this.clickable = true
  }

  componentDidUpdate() {
    this.onOrientationChange()
  }

  onOrientationChange = () => {
    let height =
      global.getDevice().orientation &&
      global.getDevice().orientation.indexOf('LANDSCAPE') === 0
        ? stylesConst.HEADER_HEIGHT_LANDSCAPE
        : stylesConst.HEADER_HEIGHT
    Animated.timing(this.state.headerHeight, {
      toValue: height,
      duration: 300,
    }).start()
  }

  setVisible = visible => {
    if (this.visible === visible) return
    Animated.timing(this.state.headerTop, {
      toValue: visible ? 0 : -stylesConst.HEADER_HEIGHT,
      duration: 300,
    }).start()
    this.visible = visible
  }

  handleBack = (navigation, event) => {
    if (this.props.backAction && typeof this.props.backAction === 'function') {
      this.props.backAction(event)
    } else if (!this.props.backAction && navigation) {
      if (this.clickable) {
        this.clickable = false
        navigation.goBack(null)
      }
    }
  }

  renderDefaultHeader = () => {
    const {
      title,
      subTitle,
      headerLeft,
      darkBackBtn,
      headerRight,
      withoutBack,
      activeOpacity,
      type,
      headerViewStyle,
      headerLeftStyle,
      headerTitleViewStyle,
      headerTitleStyle,
      subTitleStyle,
      headerRightStyle,
      navigation,
      count,
      headerCenter,
      backImg,
    } = this.props

    let fontSize =
      global.getDevice().orientation &&
      global.getDevice().orientation.indexOf('LANDSCAPE') === 0
        ? setSpText(26)
        : setSpText(36)
    let imgSize =
      global.getDevice().orientation &&
      global.getDevice().orientation.indexOf('LANDSCAPE') === 0
        ? scaleSize(40)
        : scaleSize(60)

    let backBtnSource =
      backImg || require('../../assets/public/Frenchgrey/icon-back-white.png')
    // backBtnType === 'white'
    //   ? require('../../assets/common/icon-back-white.png')
    //   : require('../../assets/common/icon-back-gray.png')
    let backBtn = (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel={'返回'}
        style={styles.backBtn}
        activeOpacity={activeOpacity}
        onPress={event => {
          this.handleBack(navigation, event)
        }}
      >
        {count ? <Text style={styles.count}>({count})</Text> : null}
        <View
          style={[styles.iconBtnBg, darkBackBtn && styles.iconBtnBgDarkColor]}
        >
          <Image
            source={backBtnSource}
            style={[styles.backIcon, { width: imgSize, height: imgSize }]}
          />
        </View>
      </TouchableOpacity>
    )
    let titleView = null
    if (type !== 'floatNoTitle') {
      titleView = (
        <View style={headerTitleViewStyle}>
          {headerCenter ? (
            headerCenter
          ) : (
            <View>
              <Text
                style={[headerTitleStyle, { fontSize: fontSize }]}
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {title}
                {subTitle ? (
                  <Text style={subTitleStyle}>{subTitle}</Text>
                ) : null}
              </Text>
            </View>
          )}
        </View>
      )
    }

    return (
      <View style={[styles.navigationHeader, headerViewStyle]}>
        {headerLeft ? (
          <View style={[styles.headerLeftView, headerLeftStyle]}>
            {headerLeft}
          </View>
        ) : (
          !withoutBack && backBtn
        )}
        {titleView}
        {headerRight && (
          <View style={[styles.headerRightView, headerRightStyle]}>
            {headerRight}
          </View>
        )}
      </View>
    )
  }

  render() {
    const {
      header,
      // backAction,
      opacity,
      type,
      headerStyle,
    } = this.props

    let currentHeaderStyle
    switch (type) {
      case 'floatNoTitle':
        currentHeaderStyle = styles.floatNoTitleHeaderView
        break
      case 'float':
        currentHeaderStyle = styles.floatHeaderView
        break
      case 'fix':
        currentHeaderStyle = styles.fixHeaderView
        break
      default:
        currentHeaderStyle = styles.defaultHeaderView
        break
    }
    let padding = {}
    if (
      global.getDevice().orientation &&
      global.getDevice().orientation.indexOf('LANDSCAPE') === 0
    ) {
      padding = { paddingTop: 0 }
    }
    return (
      <Animated.View
        style={[
          currentHeaderStyle,
          { height: this.state.headerHeight },
          headerStyle,
          padding,
          { opacity: opacity, top: this.state.headerTop },
        ]}
      >
        {header ? header : this.renderDefaultHeader()}
      </Animated.View>
    )
  }
}

export default NavigationHeader
