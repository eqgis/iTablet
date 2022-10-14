/**
 * 该组件用于解决ios的输入框被键盘遮挡的问题
 */

import React, { Component } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Keyboard,
  Dimensions,
} from 'react-native'


interface Props {
  scrollViewstyle?: any,
  checkY?: number,
}

interface State {
  keyboardHeight: number,
  isNotShow: boolean,
}

class KeyboardScrollView extends Component<Props, State> {
  ScrollView: ScrollView | null | undefined
  pageY: number
  offsetY: number
  diff: number

  keyboardDidShowListener
  keyboardDidHideListener

  constructor(props: Props) {
    super(props)
    this.state = {
      keyboardHeight: 0,
      isNotShow: false,
    }

    this.ScrollView = null
    this.pageY = 0
    this.offsetY = 0
    this.diff = 0

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',
      this._keyboardDidShow.bind(this))
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',
      this._keyboardDidHide.bind(this))
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    //this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow(e: any){ // 类型未知
    // const { getKeyBoardHeight } = this.props+
    // getKeyBoardHeight && getKeyBoardHeight(e.endCoordinates.height)
    // let isLandscape = this.props.windowSize.height < this.props.windowSize.width
    const ScHeight = Dimensions.get('window').height
    // 键盘以上的位置的高度
    console.warn(ScHeight + " - " + e.endCoordinates.height + " - " + this.pageY)
    this.diff =  this.pageY - (ScHeight - e.endCoordinates.height)
    // this.pageY > ScHeight - e.endCoordinates.height

    if(this.diff >= 0) {
      this.setState({
        isNotShow: true,
        keyboardHeight:e.endCoordinates.height,
      })
    } else {
      this.setState({
        isNotShow: false,
        keyboardHeight:e.endCoordinates.height,
      })
    }
  }

  _keyboardDidHide(e: any){  // 类型未知
    this.setState({
      isNotShow: false,
      keyboardHeight:0,
    })
  }

  /**
   * 暴露给外部的设置滑动到的位置的方法
   * 外部使用方法：
   *   1. 拿到此组件的句柄，通过句柄调用该方法
   *   2. 然后传的值是滚动到的位置，在这里面主要是指输入框的位置
   *   3. 获取输入框的位置，自定义组件可以通过以下方法获取
   * UIManager.measure(findNodeHandle(e.target),(x,y,width,height,pageX,pageY)=>{ // to do })
   */
  setPageY = (pageY: number) => {
    if(pageY && Number(pageY).toString() !== "NaN") {
      this.pageY = pageY
    }
  }


  render = () => {
    // console.log(this.props.children)
    return (
      <View
        style={[styles.container]}
      >
        <ScrollView
          ref={ref => (this.ScrollView = ref)}
          onScroll={event => {
            this.offsetY = event.nativeEvent.contentOffset.y
          }}
          style={[styles.Scrollstyle, this.props.scrollViewstyle]}
        >
          {/* 将外部传进来的内容全放到scrollView里 */}
          {this.props.children}
        </ScrollView>

        {this.state.keyboardHeight > 0 && this.state.isNotShow && Platform.OS === "ios" && (
          <View
            style={{height: this.diff}}
            onLayout={()=> {
              if(this.state.keyboardHeight > 0 && this.state.isNotShow) {

                this.ScrollView?.scrollTo({
                  // y: this.offsetY + this.state.keyboardHeight
                  y: this.offsetY + this.diff
                })
              }
            }}
          ></View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    // height: '100%',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  Scrollstyle: {},
})

export default KeyboardScrollView