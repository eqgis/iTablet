/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import {
  StyleSheet,
  View,
  Animated,
  Text,
  TouchableOpacity,
  Easing,
  Image,
  ScrollView,
} from 'react-native'
import { scaleSize, setSpText } from '../../utils'
import { color } from '../../styles'
import { getPublicAssets, getThemeAssets } from '../../assets'

const ROW_HEIGHT = scaleSize(40)
export default class TreeListItem extends React.Component {
  props: {
    key: string,
    parent: Object,
    data: Object,
    index: number,
    fontSize?: number,
    textColor?: string,
    children?: Object,
    rightView?: Object,
    separator?: boolean,
    separatorStyle?: Object,
    // childrenData: Array,
    style: Object,
    childrenStyle: Object,
    iconStyle: Object,
    keyExtractor?: () => {},
    onPress?: () => {},
    renderChild: () => {},
    defaultShowChildren: boolean,
    scrool?: boolean,
  }

  static defaultProps = {
    defaultShowChildren: false,
    separator: false,
    textColor: 'white',
    scrool:false,
  }

  constructor(props) {
    super(props)
    this.state = {
      // height: new Animated.Value(0),
      imgRotate: new Animated.Value(props.defaultShowChildren ? 0 : -0.5),
      isVisible: props.defaultShowChildren,
    }
  }

  renderIcon = () => {
    const arrowImg = getThemeAssets().publicAssets.icon_common_expanded
    if (this.props.data.childGroups && this.props.data.childGroups.length > 0) {
      return (
        <TouchableOpacity
          style={styles.btn}
          onPress={() => this.showChild(!this.state.isVisible)}
        >
          <Animated.Image
            resizeMode={'contain'}
            style={[
              styles.arrowImg,
              {
                transform: [
                  {
                    rotate: this.state.imgRotate.interpolate({
                      inputRange: [-1, 1],
                      outputRange: ['-180deg', '180deg'],
                    }),
                  },
                ],
              },
            ]}
            source={arrowImg}
          />
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={styles.btn}>
          <Image
            style={styles.circleImg}
            // source={getPublicAssets().common.icon_circle_dot}
            source={getThemeAssets().publicAssets.icon_common_bullet}
          />
        </View>
      )
    }
  }

  renderContent = () => {
    if (this.props.children) {
      return this.props.children
    }
    let icon
    if (this.props.data.$ && this.props.data.$.type) {
      switch (this.props.data.$.type) {
        case 'Region':
          icon = getThemeAssets().layerType.layer_region
          break
        case 'Line':
          icon = getThemeAssets().layerType.layer_line
          break
        case 'Point':
          icon = getThemeAssets().layerType.layer_point
          break
      }
    }
    if(this.props.scrool){
      return (
        <View style={[styles.row, this.props.style]}>
          <ScrollView
            horizontal={true}
            style={{ flex: 1 }}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={styles.row}
              onPress={() =>
                this._onPress({
                  data: this.props.data,
                  index: this.props.index,
                })
              }
            >
              {this.renderIcon()}
              {icon && (
                <Image
                  resizeMode={'contain'}
                  source={icon}
                  style={[styles.icon, this.props.iconStyle]}
                />
              )}
              <Text
                style={[
                  styles.title,
                  icon && { marginLeft: scaleSize(20) },
                  this.props.textColor && { color: this.props.textColor },
                  this.props.fontSize && {
                    fontSize: this.props.fontSize,
                  },
                ]}
              >
                {this.props.data.title ||
                  this.props.data.name ||
                  this.props.data.$.code + ' ' + this.props.data.$.name}
              </Text>
            </TouchableOpacity>
          </ScrollView>
          {this.props.rightView &&
            this.props.rightView({
              data: this.props.data,
              index: this.props.index,
            })}
        </View>
      )
    }else{
      return (
        <View style={[styles.row, this.props.style]}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.row}
            onPress={() =>
              this._onPress({
                data: this.props.data,
                index: this.props.index,
              })
            }
          >
            {this.renderIcon()}
            {icon && (
              <Image
                resizeMode={'contain'}
                source={icon}
                style={[styles.icon, this.props.iconStyle]}
              />
            )}
            <Text
              style={[
                styles.title,
                icon && { marginLeft: scaleSize(20) },
                this.props.textColor && { color: this.props.textColor },
                this.props.fontSize && {
                  fontSize: this.props.fontSize,
                },
              ]}
            >
              {this.props.data.title ||
                this.props.data.name ||
                this.props.data.$.code + ' ' + this.props.data.$.name}
            </Text>
          </TouchableOpacity>
          {this.props.rightView &&
            this.props.rightView({
              data: this.props.data,
              index: this.props.index,
            })}
        </View>
      )
    }
  }

  renderChildGroups = () => {
    let childGroups =
      this.props.data.childGroups || this.props.data.feature || []
    if (!childGroups || childGroups.length === 0 || !this.state.isVisible)
      return null
    let children = []
    for (let i = 0; i < childGroups.length; i++) {
      let data = childGroups[i]
      if (this.props.renderChild) {
        children.push(
          this.props.renderChild({ data, index: i, parent: this.props.data }),
        )
      } else {
        children.push(
          <TreeListItem
            parent={this.props.data}
            key={data.key || data.path || (data.$ && data.$.name) || i}
            data={data}
            style={this.props.style}
            iconStyle={this.props.iconStyle}
            // childrenData={this.props.data.childGroups[i].childGroups}
            keyExtractor={this._keyExtractor}
            onPress={() => this._onPress({ data, index: i })}
          />,
        )
      }
    }
    return (
      <Animated.View style={[styles.children, this.props.childrenStyle]}>
        {children}
        {this.props.separator && (
          <View style={[styles.separator, this.props.separatorStyle]} />
        )}
      </Animated.View>
    )
  }

  showChild = isVisible => {
    if (this.state.isVisible === isVisible) return
    isVisible = isVisible === undefined ? !this.state.isVisible : isVisible
    Animated.timing(this.state.imgRotate, {
      toValue: isVisible ? 0 : -0.5,
      duration: 200,
      easing: Easing.out(Easing.quad), // 一个用于定义曲线的渐变函数
      delay: 0, // 在一段时间之后开始动画（单位是毫秒），默认为0。
    }).start()
    this.setState({
      isVisible: isVisible,
    })
  }

  _onPress = ({ data, index }) => {
    if (this.props.onPress) {
      this.props.onPress({ data, index })
    }
  }

  _keyExtractor = () => {
    if (this.props.key) {
      return this.props.key
    } else if (this.props.keyExtractor) {
      return this.props.keyExtractor(this.props.data)
    }
  }

  render() {
    return (
      <View key={this._keyExtractor} style={[styles.item]}>
        {this.renderContent()}
        {this.renderChildGroups()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'column',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    height: ROW_HEIGHT,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  children: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: scaleSize(80),
  },
  btn: {
    // paddingVertical: scaleSize(20),
    height: scaleSize(80),
    width: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    color: 'white',
    fontSize: setSpText(20),
    backgroundColor: 'transparent',
  },
  arrowImg: {
    marginRight: scaleSize(24),
    height: scaleSize(44),
    width: scaleSize(44),
  },
  circleImg: {
    marginRight: scaleSize(24),
    height: scaleSize(44),
    width: scaleSize(44),
  },
  icon: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: color.bgG,
  },
})
