import React, { PureComponent } from 'react'
import { StyleSheet, View, Modal, TouchableOpacity, Text } from 'react-native'
import { color, size } from '../../styles'
import { scaleSize } from '../../utils'
import { Button } from '../index'
import { getLanguage } from '../../language/index'

const ARROW_WIDTH = scaleSize(20)
const ARROW_COLOR = '#DDDDDD'

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: color.contentColorWhite,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#rgba(0, 0, 0, 0.3)',
  },
  item: {
    backgroundColor: 'transparent',
    height: scaleSize(80),
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    marginHorizontal: 0,
    height: 1,
    backgroundColor: color.separateColorGray,
  },
  title: {
    fontSize: size.fontSize.fontSizeSm,
    color: color.bgG,
  },
  btnTitle: {
    fontSize: size.fontSize.fontSizeXl,
    color: color.contentColorBlack,
  },
  arrow: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: ARROW_WIDTH,
    marginVertical: 2,
  },
})

const bottomStyle = {
  bottom: 0,
  left: 0,
  right: 0,
}

export default class PopMenu extends PureComponent {
  props: {
    hasCancel: boolean,
    data: Object,
    device: Object,
    title: String,
    getData: () => {},
  }

  static defaultProps = {
    hasCancel: true,
    data: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      position: {},
      container: {},
      overlay: {},
      indicatorPosition: {},
      arrow: {},
    }
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.device) !== JSON.stringify(this.props.device)
    ) {
      this.setVisible(false)
    }
  }

  setVisible = (visible, position) => {
    this._setVisible(visible, position)
  }

  _setVisible = (visible, position) => {
    let container
    let overlay
    let positionStyle
    let indicatorPosition
    let arrow
    if (!global.isPad && this.props.device.orientation === 'PORTRAIT') {
      container = {}
      overlay = {}
      positionStyle = bottomStyle
      indicatorPosition = {}
      arrow = {
        borderTopColor: 'transparent',
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: 'transparent',
      }
    } else if (!position) {
      let screenWidth = this.props.device.width
      let screenHeight = this.props.device.height
      let width = scaleSize(300)
      let height = scaleSize(80) * this._getItemNums()
      let left = (screenWidth - width) / 2
      let top = (screenHeight - height) / 2

      container = {}
      overlay = {}
      positionStyle = {
        left: left,
        top: top,
        width: width,
      }
      indicatorPosition = {}
      arrow = {
        borderTopColor: 'transparent',
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: 'transparent',
      }
    } else {
      let screenWidth = this.props.device.width
      let screenHeight = this.props.device.height
      let width, height
      if (position.width) {
        width = position.width
      } else {
        width = scaleSize(300)
      }
      if (position.height) {
        height = position.height
      } else {
        height = scaleSize(80) * this._getItemNums()
      }
      let x = position.x
      let y = position.y
      let MARGIN = ARROW_WIDTH * 2
      let marginTop = MARGIN
      let marginRight = 0
      let marginBottom = 0
      let left, top, iLeft, iTop
      let leftToRight = true
      let upToButtom = true
      let atTop = false
      let totolHeight = height + MARGIN
      if (x + width > screenWidth) {
        leftToRight = false
      }
      if (y + totolHeight > screenHeight) {
        upToButtom = false
        top = y - totolHeight
        marginTop = 0
        marginBottom = MARGIN
        if (top < 0) {
          atTop = true
          marginBottom = 0
          marginRight = MARGIN
        }
      }

      let borderTopColor = 'transparent' //下箭头颜色
      let borderLeftColor = 'transparent' //右箭头颜色
      let borderBottomColor = 'transparent' //上箭头颜色
      let borderRightColor = 'transparent' //左箭头颜色

      if (leftToRight && upToButtom) {
        //左上
        iLeft = x
        iTop = y
        left = x
        top = y
        borderBottomColor = ARROW_COLOR
      } else if (!leftToRight && upToButtom) {
        //右上
        iLeft = x - ARROW_WIDTH
        iTop = y
        left = iLeft - width + MARGIN
        top = iTop
        borderBottomColor = ARROW_COLOR
      } else if (leftToRight && !upToButtom) {
        if (atTop) {
          //左边
          iLeft = x
          iTop = y - ARROW_WIDTH
          left = iLeft + MARGIN
          top = 0
          if (y - height > 0) {
            top = iTop - height + MARGIN
          }
          borderRightColor = ARROW_COLOR
        } else {
          //左下
          iLeft = x - ARROW_WIDTH
          iTop = y - ARROW_WIDTH
          left = iLeft
          top = iTop - height
          borderTopColor = ARROW_COLOR
        }
      } else {
        if (atTop) {
          //右边
          iLeft = x - ARROW_WIDTH
          iTop = y - ARROW_WIDTH
          left = iLeft - width + MARGIN
          top = 0
          if (y - height > 0) {
            top = iTop - height + MARGIN
          }
          borderLeftColor = ARROW_COLOR
        } else {
          //右下
          iLeft = x - ARROW_WIDTH
          iTop = y - ARROW_WIDTH
          left = iLeft - width + MARGIN
          top = iTop - height
          borderTopColor = ARROW_COLOR
        }
      }

      positionStyle = {
        left: left,
        top: top,
        width: width,
      }

      indicatorPosition = {
        left: iLeft,
        top: iTop,
      }

      container = {
        borderRadius: scaleSize(4),
        elevation: 20,
        shadowOffset: { width: 0, height: 0 },
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowRadius: 2,
        marginTop: marginTop,
        marginRight: marginRight,
        marginBottom: marginBottom,
      }
      overlay = {
        backgroundColor: 'transparent',
      }

      arrow = {
        borderTopColor: borderTopColor,
        borderLeftColor: borderLeftColor,
        borderBottomColor: borderBottomColor,
        borderRightColor: borderRightColor,
      }
    }
    this.setState({
      visible,
      position: positionStyle,
      container: container,
      overlay: overlay,
      indicatorPosition: indicatorPosition,
      arrow: arrow,
    })
  }

  _getItemNums = () => {
    let data = this.props.data
    if (this.props.getData && typeof this.props.getData === 'function') {
      data = this.props.getData()
    }
    let nums = data.length
    if (this.props.title && this.props.title !== '') {
      nums++
    }
    if (this.props.hasCancel) {
      nums++
    }
    return nums
  }

  _renderSeparatorLine = (info, index) => {
    let key = info ? 'separator_' + info + '_' + index : new Date().getTime()
    return <View key={key} style={styles.separator} />
  }

  _renderList = () => {
    let list = []
    let data = this.props.data
    if (this.props.getData && typeof this.props.getData === 'function') {
      data = this.props.getData()
    }
    data.forEach((item, index) => {
      list.push(this._renderBtn(item))
      if (index < data.length - 1) {
        list.push(this._renderSeparatorLine('item', index))
      }
    })
    if (this.props.title && this.props.title !== '') {
      list.unshift(this._renderSeparatorLine('title', 0))
      list.unshift(this._renderHeader())
    }
    if (this.props.hasCancel) {
      list.push(this._renderSeparatorLine('cancel', 0))
      list.push(this._renderCancelBtn())
    }
    return (
      <View style={[styles.topContainer, this.state.container]}>{list}</View>
    )
  }

  _renderHeader = () => {
    return (
      <View key={this.props.title} style={styles.item}>
        <Text style={styles.title}>{this.props.title}</Text>
      </View>
    )
  }

  _renderCancelBtn = () => {
    return (
      <Button
        style={styles.item}
        titleStyle={styles.btnTitle}
        title={getLanguage(global.language).Prompt.CANCEL}
        // {'取消'}
        key={'取消'}
        onPress={() => {
          this.setVisible(false)
        }}
        activeOpacity={0.5}
      />
    )
  }

  _renderBtn = item => {
    return (
      <Button
        style={styles.item}
        titleStyle={styles.btnTitle}
        title={item.title}
        key={item.title}
        onPress={() => {
          item.action && item.action()
          this.setVisible(false)
        }}
        activeOpacity={0.5}
      />
    )
  }

  render() {
    return (
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={this.state.visible}
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}
        onRequestClose={() => {
          this.setVisible(false)
        }}
      >
        <TouchableOpacity
          style={[styles.overlay, this.state.overlay]}
          activeOpacity={1}
          onPress={() => {
            this.setVisible(false)
          }}
        >
          <View
            style={[
              {
                position: 'absolute',
              },
              this.state.position,
            ]}
          >
            {this._renderList()}
          </View>
          {/* <View
            style={[
              {
                position: 'absolute',
              },
              this.state.indicatorPosition,
            ]}
          >
            <View style={[styles.arrow, this.state.arrow]} />
          </View> */}
        </TouchableOpacity>
      </Modal>
    )
  }
}
