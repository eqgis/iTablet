import React, { PureComponent } from 'react'
import { Modal, Platform, TouchableOpacity, Text, View } from 'react-native'
import { color, size } from '../../styles'
import { scaleSize } from '../../utils'
import ConstToolType from '../../constants/ConstToolType'
import Const from '../../constants/Const'

export default class PopModal extends PureComponent {
  props: {
    children: any,
    type?: string,
    contentStyle?: Object,
    onCloseModal: () => {},
  }

  defaultProps: {
    type: 'table',
  }

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
    }
  }

  setVisible = (visible, cb) => {
    if (visible === undefined) {
      visible = !this.state.modalVisible
    } else if (visible === this.state.modalVisible) {
      return
    }
    this.setState(
      {
        modalVisible: visible,
      },
      () => {
        if (cb && typeof cb === 'function') {
          cb()
        }
      },
    )
  }
  
  getVisible = () => {
    return this.state.modalVisible
  }

  _onRequestClose = () => {
    if (Platform.OS === 'android') {
      this._onCloseModal()
    }
  }

  _onCloseModal = () => {
    if (
      this.props.onCloseModal &&
      typeof this.props.onCloseModal === 'function'
    ) {
      this.props.onCloseModal()
    }
    this.setState({
      modalVisible: false,
    })
  }

  _renderContent = () => {
    return (
      <View
        style={[{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#rgba(0, 0, 0, 0)',
        }, this.props.contentStyle]}
      >
        {this.props.children}
      </View>
    )
  }

  render() {
    // let animationType = Platform.OS === 'ios' ? 'slide' : 'fade'
    let animationType = 'fade'
    return (
      <Modal
        animationType={animationType}
        transparent={true}
        onRequestClose={this._onRequestClose}
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}
        style={{ flex: 1 }}
        visible={this.state.modalVisible}
      >
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              this._onCloseModal()
            }}
            style={{ flex: 1, backgroundColor: color.modalBgColor }}
          />
          {this._renderContent()}
        </View>
      </Modal>
    )
  }
}
