import React, { PureComponent } from 'react'
import { StyleSheet, View, Modal, TouchableOpacity, Text } from 'react-native'
import { color, size } from '../../styles'
import { scaleSize } from '../../utils'
import { Button } from '../index'
import { getLanguage } from '../../language/index'

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
    this.setState({
      visible,
      position: this.getPosition(position),
      container: this.getContainer(position),
      overlay: this.getOverlay(position),
    })
  }

  getContainer = position => {
    let container
    if (
      !position ||
      (!global.isPad && this.props.device.orientation === 'PORTRAIT')
    ) {
      container = {}
    } else {
      container = {
        borderRadius: scaleSize(4),
        elevation: 20,
        shadowOffset: { width: 0, height: 0 },
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowRadius: 2,
      }
    }
    return container
  }

  getOverlay = position => {
    let overlay
    if (
      !position ||
      (!global.isPad && this.props.device.orientation === 'PORTRAIT')
    ) {
      overlay = {}
    } else {
      overlay = {
        backgroundColor: 'transparent',
      }
    }
    return overlay
  }

  getPosition = position => {
    let positonStyle
    if (
      !position ||
      (!global.isPad && this.props.device.orientation === 'PORTRAIT')
    ) {
      positonStyle = bottomStyle
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
      let x = position.x + 2
      let y = position.y + 2
      let left, top
      if (x + width < screenWidth) {
        left = x
      } else {
        left = x - width
      }
      if (y + height < screenHeight) {
        top = y
      } else {
        top = y - height
        if (top < 0) {
          top = 0
        }
      }
      positonStyle = {
        left: left,
        top: top,
        width: width,
      }
    }
    return positonStyle
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

  _renderSeparatorLine = info => {
    let key = info
      ? 'separator_' + info.item.title + '_' + info.index
      : new Date().getTime()
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
        list.push(this._renderSeparatorLine({ item, index }))
      }
    })
    if (this.props.title && this.props.title !== '') {
      list.unshift(this._renderSeparatorLine())
      list.unshift(this._renderHeader())
    }
    if (this.props.hasCancel) {
      list.push(this._renderSeparatorLine())
      list.push(this._renderCancelBtn())
    }
    return (
      <View style={[styles.topContainer, this.state.container]}>{list}</View>
    )
  }

  _renderHeader = () => {
    return (
      <View style={styles.item}>
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
        </TouchableOpacity>
      </Modal>
    )
  }
}
