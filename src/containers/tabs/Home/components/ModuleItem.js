import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color, size } from '../../../../styles'
import { getPublicAssets } from '../../../../assets'

export const itemWidth_P = scaleSize(308)
export const itemHeight_P = scaleSize(208)
export const itemWidth_L = scaleSize(240)
export const itemHeight_L = scaleSize(224)
export const itemGap = scaleSize(24)

export default class ModuleItem extends Component {
  props: {
    downloadData: Object,
    item: Object,
    style: Object,
    device: Object,
    showStar?: boolean,
    oldMapModules: Array,
    importWorkspace: () => {},
    showDialog: () => {},
    getModuleItem: () => {},
    itemAction: () => {},
    setOldMapModule: () => {},
  }

  constructor(props) {
    super(props)
    this.downloading = false
    this.state = {
      isShowProgressView: false,
      progress: '',
      disabled: false,
      dialogCheck: false,
      touch: false,
    }
    let size = this.getSize()
    this.itemWidth = new Animated.Value(size.width)
    this.itemHeight = new Animated.Value(size.height)
    this.itemBorderWidth = new Animated.Value(0)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(this.state) !== JSON.stringify(nextState) ||
      JSON.stringify(this.props) !== JSON.stringify(nextProps)
    ) {
      return true
    }
    return false
  }

  setNewState = data => {
    if (!data) return
    this.setState(data)
  }
  
  isLandscape = () => {
    return this.props.device.orientation.indexOf('LANDSCAPE') === 0
  }

  getDialogCheck = () => {
    return this.state.dialogCheck
  }

  getDownloading = () => {
    return this.downloading
  }
  
  getSize = () => {
    let width = this.props.style && this.props.style.width
      ? this.props.style.width
      : (this.isLandscape() ? itemWidth_L : itemWidth_P)
    let height = this.props.style && this.props.style.height
      ? this.props.style.height
      : (this.isLandscape() ? itemHeight_L : itemHeight_P)
    return { width, height }
  }
  
  setDownloading = (downloading = false) => {
    this.downloading = downloading
  }

  _renderProgressView = () => {
    if (!this.props.downloadData) return <View />
    let value = this.props.downloadData.progress + '%'
    return (
      <View
        style={[
          {
            marginTop: scaleSize(20),
            position: 'absolute',
            width: value,
            height: scaleSize(5),
            backgroundColor: '#4680DF',
            borderRadius: 5,
            bottom: 0,
            left: 0,
          },
        ]}
      />
    )
  }

  render() {
    let item = this.props.item
    let size = this.getSize()
    let itemStyle = JSON.parse(JSON.stringify(this.props.style))
    if (itemStyle) {
      if (itemStyle.width) delete itemStyle.width
      if (itemStyle.height) delete itemStyle.height
    }
    let width = size.width
    let height = size.height
    return (
      <TouchableOpacity
        activeOpacity={1}
        disabled={this.state.disabled}
        onPress={() => {
          this.props.itemAction && this.props.itemAction(item)
        }}
        onPressIn={() => {
          Animated.parallel([
            Animated.timing(this.itemWidth, {
              toValue: width + itemGap,
              duration: 100,
            }),
            Animated.timing(this.itemHeight, {
              toValue: height + itemGap,
              duration: 100,
            }),
            Animated.timing(this.itemBorderWidth, {
              toValue: 2,
              duration: 0,
            }),
          ]).start()
        }}
        onPressOut={() => {
          setTimeout(() => {
            Animated.parallel([
              Animated.timing(this.itemWidth, {
                toValue: width,
                duration: 100,
              }),
              Animated.timing(this.itemHeight, {
                toValue: height,
                duration: 100,
              }),
              Animated.timing(this.itemBorderWidth, {
                toValue: 0,
                duration: 0,
              }),
            ]).start()
          }, 500)
        }}
        style={[
          this.isLandscape() ? styles.moduleView_L : styles.moduleView_P,
          {
            backgroundColor: 'transparent',
            width: width + itemGap,
            height: height + itemGap,
          },
        ]}
      >
        <Animated.View
          style={[
            this.isLandscape() ? styles.moduleViewL : styles.moduleViewP,
            {
              width: this.itemWidth,
              height: this.itemHeight,
              borderColor: color.switch,
              borderWidth: this.itemBorderWidth,
              ...itemStyle,
            },
          ]}
        >
          <View style={[
            this.isLandscape() ? styles.moduleItemL : styles.moduleItemP,
            { width, height },
          ]}>
            <Image
              resizeMode={'contain'}
              source={item.moduleImage}
              style={styles.moduleImage}
            />
            {this._renderProgressView()}
            <Text style={styles.title}>{item.title}</Text>
            {this.props.oldMapModules.indexOf(item.key) < 0 && (
              <View style={styles.redDot} />
            )}
            {
              this.props.showStar &&
              <Image
                resizeMode={'contain'}
                source={getPublicAssets().common.icon_star}
                style={styles.starImage}
              />
            }
          </View>
        </Animated.View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  moduleImageView: {
    marginTop: scaleSize(25),
  },
  moduleImage: {
    marginTop: scaleSize(25),
    width: scaleSize(88),
    height: scaleSize(88),
  },
  starImage: {
    position: 'absolute',
    right: scaleSize(24),
    top: scaleSize(24),
    width: scaleSize(36),
    height: scaleSize(36),
  },
  moduleView_P: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleView_L: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleViewP: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaleSize(16),
    backgroundColor: color.itemColorGray2,
  },
  moduleViewL: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaleSize(12),
    backgroundColor: color.itemColorGray2,
  },
  moduleItemP: {
    alignItems: 'center',
  },
  moduleItemL: {
    alignItems: 'center',
  },
  title: {
    position: 'absolute',
    fontSize: size.fontSize.fontSizeLg,
    color: '#5E5E5E',
    left: scaleSize(20),
    bottom: scaleSize(8),
  },
  redDot: {
    position: 'absolute',
    left: scaleSize(40),
    top: scaleSize(24),
    width: scaleSize(16),
    height: scaleSize(16),
    borderRadius: scaleSize(8),
    backgroundColor: 'red',
  },
})
