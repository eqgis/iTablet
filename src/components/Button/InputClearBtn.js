import React from "react"
import { TouchableOpacity, Image, StyleSheet, Platform, TextInput } from "react-native"
import { scaleSize } from "../../utils"
const btnImg = require("../../assets/public/icon_input_clear.png")

class InputClearBtn extends React.Component {
  props: {
    onPress?: () => {}, // 按钮点击回调
    os?: String, // 在某平台下显示，默认both，android | ios | both
    style?: StyleSheet, // 按钮样式
    inputRef?: Object, // 对应的输入框的引用，用于onPress的默认事件
  }

  static defaultProps = {
    os: "both",
  }

  constructor(props) {
    super(props)
  }

  _onPress = () => {
    const { inputRef, onPress } = this.props
    if (inputRef) {
      inputRef.clear && inputRef.clear()
    }
    onPress && onPress()
  }

  render() {
    const { os, style } = this.props
    if (os !== "both" && os !== Platform.OS) return null
    return (
      <TouchableOpacity style={[styles.btn, style]} onPress={this._onPress}>
        <Image source={btnImg} style={styles.img} />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  btn: {
    width: scaleSize(25),
    height: scaleSize(25),
    justifyContent: "center",
    alignItems: "center",
    // position: "absolute",
    // right: scaleSize(10),
    // borderWidth: 1,
    // borderColor: "#f00",
  },
  img: {
    width: scaleSize(20),
    height: scaleSize(20),
  },
})

export default InputClearBtn
