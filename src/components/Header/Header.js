/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, Animated } from 'react-native'
import styles from './styles'
import { scaleSize, setSpText, screen } from '../../utils'
import { getPublicAssets } from '../../assets'
import { color } from '../../styles'
import BackButton from './BackButton'

class NavigationHeader extends Component {
  props: {
    header?: any, // 自定义Header
    headerStyle?: StyleSheet, // 自定义Header Style
    headStyle?: StyleSheet, // 自定义Header Style 上面那个传数据写死了有问题先开一个新的
    withoutBack?: boolean, // 是否有返回按钮
    backBtnType?: string, // 返回按钮类型（white, gray）
    backAction?: any, // 返回事件
    title?: string, // 标题
    subTitle?: string, // 副标题
    subTitleStyle?: StyleSheet, // 副标题样式
    headerViewStyle?: StyleSheet, // Header Style
    headerLeftStyle?: StyleSheet, // Header左边View样式
    headerRightStyle?: StyleSheet, // Header右边View样式
    headerTitleViewStyle?: StyleSheet, // Header中间Title View样式
    headerTitleStyle?: StyleSheet, // Header标题样式
    headerLeft?: any, // Header左端组件，可为Array
    headerRight?: any, // Header右端组件，可为Array
    opacity?: number, // 透明度
    activeOpacity?: number, // 返回键点击透明度
    type?: string, // default | float:浮动Header | floatNoTitle:浮动无title,透明背景 | fix:固定顶部，绝对定位
    navigation?: any, // navigation
    count?: any, // 消息提示数量
    darkBackBtn?: boolean, // 黑色透明背景，返回按钮
    headerCenter?: any, // 自定义Header中间View
    backImg?: any, // 返回按钮图片
    statusVisible?: boolean, // 状态栏是否可见
    isResponseHeader?: boolean, // 是否使用flex三栏布局（标题响应宽度）
    responseHeaderTitleStyle?: StyleSheet //  三栏布局时Title的覆盖样式
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
    isResponseHeader: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      headerTop: new Animated.Value(0),
      headerHeight: new Animated.Value(screen.getHeaderHeight()),
    }
    this.visible = true
    this.clickable = true
  }

  componentDidUpdate() {
    this.onOrientationChange()
  }

  onOrientationChange = () => {
    let height = screen.getHeaderHeight()
    Animated.timing(this.state.headerHeight, {
      toValue: height,
      duration: 300,
    }).start()
  }

  setVisible = visible => {
    if (this.visible === visible) return
    Animated.timing(this.state.headerTop, {
      toValue: visible ? 0 : -300,
      duration: 300,
    }).start()
    this.visible = visible
  }

  handleBack = (navigation, event) => {
    if (this.props.backAction && typeof this.props.backAction === 'function') {
      return this.props.backAction(event)
    } else if (!this.props.backAction && navigation) {
      if (this.clickable) {
        this.clickable = false
        return navigation.goBack(null)
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
      responseHeaderTitleStyle,
    } = this.props

    let fontSize =
      GLOBAL.getDevice().orientation &&
      GLOBAL.getDevice().orientation.indexOf('LANDSCAPE') === 0
        ? setSpText(26)
        : setSpText(36)
    let imgSize =
      GLOBAL.getDevice().orientation &&
      GLOBAL.getDevice().orientation.indexOf('LANDSCAPE') === 0
        ? scaleSize(40)
        : scaleSize(60)

    let backStyle = styles.backBtn
    let TitleViewStyle = headerTitleViewStyle
    let rightStyle = [styles.headerRightView, headerRightStyle]
    if (type === 'flex') {
      backStyle = styles.backBtnFlex
      TitleViewStyle = styles.headerTitleViewFlex
      rightStyle = [styles.headerRightViewFlex, headerRightStyle]
    }

    let backBtnSource = backImg || getPublicAssets().common.icon_back
    let backBtn = (
      <BackButton
        // style={this.props.isResponseHeader ? {} : backStyle}
        count={count}
        darkBackBtn={darkBackBtn}
        image={backBtnSource}
        imageStyle={[styles.backIcon, { width: imgSize, height: imgSize }]}
        activeOpacity={activeOpacity}
        onPress={event => {
          return this.handleBack(navigation, event)
        }}
      />
    )
    // let backBtn = (
    //   <TouchableOpacity
    //     accessible={true}
    //     accessibilityLabel={'返回'}
    //     style={this.props.isResponseHeader ? {} : backStyle}
    //     activeOpacity={activeOpacity}
    //     onPress={event => {
    //       this.handleBack(navigation, event)
    //     }}
    //   >
    //     {count ? <Text style={styles.count}>({count})</Text> : null}
    //     <View
    //       style={[styles.iconBtnBg, darkBackBtn && styles.iconBtnBgDarkColor]}
    //     >
    //       <Image
    //         source={backBtnSource}
    //         style={[styles.backIcon, { width: imgSize, height: imgSize }]}
    //       />
    //     </View>
    //   </TouchableOpacity>
    // )
    let titleView = null
    if (type !== 'floatNoTitle') {
      titleView = (
        <View style={TitleViewStyle}>
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
    <>
      {!this.props.isResponseHeader ? <View style={[styles.navigationHeader, headerViewStyle]}>
        {headerLeft ? (
          <View style={[styles.headerLeftView, headerLeftStyle]}>
            {headerLeft}
          </View>
        ) : (
          <View style={styles.headerLeftView}>
            {!withoutBack && backBtn}
          </View>
        )}
        {titleView}
        {headerRight && <View style={rightStyle}>{headerRight}</View>}
      </View> :
        (
          <View style={styles.responseHeader}>
            {headerLeft ? (
              <View style={styles.responseHeaderLeft}>
                {headerLeft}
              </View>
            ) : (
              <View style={styles.responseHeaderLeft}>
                {!withoutBack && backBtn}
              </View>
            )}
            <View style={styles.responseHeaderTitle}>
              <Text
                style={{
                  ...styles.headerTitle,
                  fontSize: fontSize, textAlign:'left' ,
                  paddingLeft: scaleSize(withoutBack ? 70 : 0),
                  ...responseHeaderTitleStyle,
                }}
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {title}
                {subTitle ? (
                  <Text style={subTitleStyle}>{subTitle}</Text>
                ) : null}
              </Text>
            </View>

            {headerRight && <View style={[styles.responseHeaderRight, headerRightStyle]}>{headerRight}</View>}
          </View>)}
    </>
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

    let padding = { paddingTop: screen.getIphonePaddingTop() }
    let hasBorderBottomWidth = type !== 'floatNoTitle'

    return (
      <Animated.View
        style={[
          currentHeaderStyle,
          {
            height: this.state.headerHeight,
            borderBottomWidth: hasBorderBottomWidth ? 2 : 0,
            borderBottomColor: color.itemColorGray2,
          },
          headerStyle,
          padding,
          { opacity: opacity, top: this.state.headerTop },
          this.props.headStyle,
        ]}
      >
        {header ? header : this.renderDefaultHeader()}
      </Animated.View>
    )
  }
}

export default NavigationHeader
