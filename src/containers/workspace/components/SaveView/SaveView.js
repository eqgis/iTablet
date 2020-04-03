/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { Button } from '../../../../components'
import { scaleSize, screen } from '../../../../utils'
import { color, zIndexLevel, size } from '../../../../styles'

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    zIndex: zIndexLevel.FOUR,
    backgroundColor: '#rgba(0, 0, 0, 0.3)',
  },
  container: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  topContainer: {
    flexDirection: 'column',
    backgroundColor: color.contentColorWhite,
  },
  item: {
    flex: 1,
    backgroundColor: color.contentColorWhite,
    height: scaleSize(80),
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    // flex: 1,
    // marginHorizontal: scaleSize(16),
    height: 1,
    backgroundColor: color.separateColorGray,
  },
  title: {
    // fontSize: size.fontSize.fontSizeLg,
    fontSize: size.fontSize.fontSizeSm,
    color: color.bgG,
  },
  btnTitle: {
    // fontSize: size.fontSize.fontSizeLg,
    fontSize: size.fontSize.fontSizeXl,
    color: color.contentColorBlack,
  },
})

const bottomStyle = {
  bottom: 0,
  left: 0,
  right: 0,
}

export default class SaveView extends React.Component {
  props: {
    save?: () => {},
    notSave?: () => {},
    cancel?: () => {},
    device?: Object,
    backHide?: boolean,
    animated?: boolean,
  }

  static defaultProps = {
    animated: 'fade',
    backHide: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      title: '是否保存当前地图？',
      save_yes: '保存',
      save_no: '不保存',
      cancel: '取消',
      position: {},
    }
    this.cb = () => {}
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.device) !== JSON.stringify(this.props.device)
    ) {
      this.cancel()
    }
  }

  setTitle = (title, save_yes, save_no, cancel) => {
    this.setState({
      title: title,
      save_yes: save_yes,
      save_no: save_no,
      cancel: cancel,
    })
  }

  save = () => {
    (async function() {
      this.props.save && (await this.props.save())
      this.setVisible(false)

      this.cb && typeof this.cb === 'function' && this.cb()
      this.cb = null
    }.bind(this)())
  }

  notSave = () => {
    (async function() {
      this.props.notSave && this.props.notSave()
      this.setVisible(false)

      this.cb && typeof this.cb === 'function' && this.cb()
      this.cb = null
    }.bind(this)())
  }

  cancel = () => {
    this.props.cancel && this.props.cancel()
    this.setVisible(false)
    this.cb = null
  }

  getPosition = position => {
    let positonStyle
    if (
      !position ||
      (!global.isPad && this.props.device.orientation !== 'LANDSCAPE')
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
        height = scaleSize(320)
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
      }
      positonStyle = {
        left: left,
        top: top,
        width: width,
      }
    }
    return positonStyle
  }

  setVisible = (visible, setLoading, cb, position) => {
    // if (this.state.visible === visible) return
    if (setLoading && typeof setLoading === 'function') {
      this._setLoading = setLoading
    }
    let positonStyle = this.getPosition(position)
    this.setState({
      visible,
      position: positonStyle,
    })
    this.cb = cb || this.cb
  }

  setLoading = (loading = false, info, extra) => {
    this._setLoading && this._setLoading(loading, info, extra)
  }

  getVisible = () => {
    return this.state.visible
  }

  render() {
    let animationType = this.props.animated ? 'fade' : 'none'
    const deviceHeight = screen.getScreenSafeHeight()
    return (
      <Modal
        animationType={animationType}
        transparent={true}
        visible={this.state.visible}
        onRequestClose={() => {
          //点击物理按键需要隐藏对话框
          if (this.props.backHide) {
            this.setVisible(false)
            this.cb = null
          }
        }}
      >
        <TouchableOpacity
          style={[
            styles.overlay,
            Platform.OS === 'android' && {
              height: deviceHeight,
            },
          ]}
          activeOpacity={1}
          onPress={this.cancel}
        >
          <View
            ref={ref => (this.view = ref)}
            style={[styles.container, this.state.position]}
          >
            <View style={styles.topContainer}>
              <View style={styles.item}>
                <Text style={styles.title}>{this.state.title}</Text>
              </View>
              <View style={styles.separator} />
              <Button
                style={styles.item}
                titleStyle={styles.btnTitle}
                title={this.state.save_yes}
                onPress={this.save}
                activeOpacity={0.5}
              />
              <View style={styles.separator} />
              <Button
                style={[styles.item, { marginTop: 1 }]}
                titleStyle={styles.btnTitle}
                title={this.state.save_no}
                onPress={this.notSave}
                activeOpacity={0.5}
              />
              <View style={styles.separator} />
              <Button
                style={[styles.item, { marginTop: 1 }]}
                titleStyle={styles.btnTitle}
                title={this.state.cancel}
                onPress={this.cancel}
                activeOpacity={0.5}
              />
            </View>
            {/*<Button*/}
            {/*style={[styles.item, { marginTop: scaleSize(15) }]}*/}
            {/*titleStyle={styles.btnTitle}*/}
            {/*title="取消"*/}
            {/*onPress={this.cancel}*/}
            {/*activeOpacity={0.5}*/}
            {/*/>*/}
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}
