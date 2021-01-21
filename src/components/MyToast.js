
import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Platform,
  TouchableOpacity,
} from 'react-native'

export const DURATION = {
  TOAST_SHOT: 1000,
  TOAST_LONG: 2000,
}

export const POSITION = {
  CENTER: 0,
  // TOP: Toast.positions.TOP,
  TOP: 1,
  BOTTOM: 2,
}

export default class MyToast extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      duration: DURATION.TOAST_SHOT, // 模态框持续时间
      modalTxt: '',
      visible: false,
      position: POSITION.TOP,
    }
  }
  componentDidMount() {
    const { onRef } = this.props
    if (typeof onRef === 'function') onRef(this)
  }
  // 模态框打开，过一段时间再消失
  show = (modalTxt, option = {}) => {
    this.setState({
      modalTxt:modalTxt,
      visible:true,
      ...option,
    })
    this.timer = setTimeout(() => {
      this.setState({
        visible: false,
        duration: DURATION.TOAST_SHOT,
        position: POSITION.TOP,
      })
      this.timer = null
    }, this.state.duration)
  }
  render() {
    let position = {}
    switch (this.state.position) {
      case 1: {
        position = styles.topView
        break
      }
      case 2: {
        position = styles.bottomView
        break
      }
      default: {
        break
      }
    }
    return (
      <Modal
        onRequestClose={Platform.OS !== "ios" ? this._onRequestClose : null}
        animationType={'fade'}
        transparent={true}
        visible={this.state.visible}
        pointerEvents={'box-none'}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modal}
          onPress={() => {
            this.timer = null
            this.setState({
              visible: false,
              duration: DURATION.TOAST_SHOT,
              position: POSITION.TOP,
            })
          }}
        >
          <View style={[styles.modalContent, position]}>
            <Text style={styles.modalTxt} >{this.state.modalTxt}</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  modal: {
    flex:1,
    backgroundColor: 'transparent',
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#00000088',
    borderRadius:15,
    paddingHorizontal:20,
  },
  centerView: {
    alignSelf:'center',
    marginTop:100,
  },
  topView: {
    position: 'absolute',
    top: 100,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  bottomView: {
    position: 'absolute',
    bottom: 100,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  modalTxt: {
    color: '#fff',
    textAlign: 'center',
    backgroundColor: '#0000',
    lineHeight: 30,
  },
})