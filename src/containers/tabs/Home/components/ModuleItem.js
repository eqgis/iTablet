import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from 'react-native'
import { fixedSize } from '../../../../utils'
import { color, size } from '../../../../styles'
import { getPublicAssets } from '../../../../assets'
import { ChunkType } from '../../../../constants'
import SizeUtil from '../SizeUtil'

export default class ModuleItem extends Component {
  props: {
    downloadData: Object,
    item: Object,
    style: Object,
    device: Object,
    showStar?: boolean,
    isNew?: boolean,
    importWorkspace: () => {},
    showDialog: () => {},
    getModuleItem: () => {},
    itemAction: () => {},
    setOldMapModule: () => {},
  }

  static defaultProps = {
    style: {},
    isNew: false,
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
    let width =
      this.props.style && this.props.style.width
        ? this.props.style.width
        : SizeUtil.getItemWidth(this.props.device.orientation, GLOBAL.isPad)
    let height =
      this.props.style && this.props.style.height
        ? this.props.style.height
        : SizeUtil.getItemHeight(this.props.device.orientation, GLOBAL.isPad)
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
            marginTop: fixedSize(20),
            position: 'absolute',
            width: value,
            height: fixedSize(5),
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
    let itemStyle = JSON.parse(JSON.stringify(this.props.style)) || {}
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
              toValue: width + SizeUtil.getItemGap(),
              duration: 100,
            }),
            Animated.timing(this.itemHeight, {
              toValue: height + SizeUtil.getItemGap(),
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
            width: width + SizeUtil.getItemGap(),
            height: height + SizeUtil.getItemGap(),
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
          <View
            style={[
              this.isLandscape() ? styles.moduleItemL : styles.moduleItemP,
              { width, height },
            ]}
          >
            <Image
              resizeMode={'contain'}
              source={item.moduleImage}
              style={styles.moduleImage}
            />
            {this._renderProgressView()}
            <Text style={styles.title}>{item.title}</Text>
            {this.props.isNew && (
                <View style={styles.redDot} />
              )}
            {this.props.showStar && (
              <Image
                resizeMode={'contain'}
                source={getPublicAssets().common.icon_star}
                style={styles.starImage}
              />
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  moduleImageView: {
    marginTop: fixedSize(25),
  },
  moduleImage: {
    marginTop: fixedSize(25),
    width: SizeUtil.getImageSize(),
    height: SizeUtil.getImageSize(),
  },
  starImage: {
    position: 'absolute',
    right: fixedSize(24),
    top: fixedSize(24),
    width: SizeUtil.getStarImageSize(),
    height: SizeUtil.getStarImageSize(),
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
    borderRadius: fixedSize(16),
    backgroundColor: color.itemColorGray2,
  },
  moduleViewL: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: fixedSize(12),
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
    left: fixedSize(20),
    bottom: fixedSize(8),
    minWidth: fixedSize(100),
    textAlign: 'left',
  },
  redDot: {
    position: 'absolute',
    left: fixedSize(40),
    top: fixedSize(24),
    width: fixedSize(16),
    height: fixedSize(16),
    borderRadius: fixedSize(8),
    backgroundColor: 'red',
  },
})
