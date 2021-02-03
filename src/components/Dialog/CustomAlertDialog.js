/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import React, { PureComponent } from 'react'
import { View, Text, Image } from 'react-native'
import Dialog from './Dialog'
import styles from './styles'
import { scaleSize } from '../../utils'
import { getLanguage } from '../../language/index'

export default class CustomAlertDialog extends PureComponent {
  props: {
    confirmAction?: () => {},
    cancelAction?: () => {},
    title?: string, //标题
    value?: string, //内容
    contentStyle?: Object, //内容样式
    contentHeight?: number, //内容高度
    confirmBtnTitle?: string,
    cancelBtnTitle?: string,
  }

  static defaultProps = {
    title: '',
    value: '',
    confirmBtnTitle: getLanguage(GLOBAL.language).Prompt.YES,
    cancelBtnTitle: getLanguage(GLOBAL.language).Prompt.NO,
  }

  constructor(props) {
    super(props)
    this.state = {
      title: props.title,
      value: props.value,
      confirmBtnTitle: props.confirmBtnTitle,
      cancelBtnTitle: props.cancelBtnTitle,
    }
    this.params = {} // 临时数据
  }

  /**
   * 设置Dialog显隐 如果visible为true 且要更改dialog内容 那么params所有参数 除title外均为必须
   * @param visible
   * @param params
   */
  setDialogVisible(visible, params = {}) {
    if (visible) {
      let { title, value, confirmBtnTitle, cancelBtnTitle } = this.state
      if (
        params.title !== title ||
        params.value !== value ||
        params.confirmBtnTitle !== confirmBtnTitle ||
        params.cancelBtnTitle !== cancelBtnTitle
      ) {
        let { title, value, confirmBtnTitle, cancelBtnTitle } = params
        this.setState(
          {
            title,
            value,
            confirmBtnTitle,
            cancelBtnTitle,
          },
          () => {
            this.params = params
            //数据发生改变 显示必须放在setState后，不然报错
            this.dialog?.setDialogVisible(true)
          },
        )
      } else {
        //数据未发生改变 直接显示
        this.dialog?.setDialogVisible(true)
      }
    } else {
      this.dialog?.setDialogVisible(false)
    }
  }

  confirm = () => {
    if (this.params.confirmAction) {
      this.params.confirmAction()
    } else if (this.props.confirmAction) {
      this.props.confirmAction()
    }
    this.setDialogVisible(false)
  }

  cancel = () => {
    if (this.params.cancelAction) {
      this.params.cancelAction()
    } else if (this.props.cancelAction) {
      this.props.cancelAction()
    }
    this.setDialogVisible(false)
  }

  render() {
    let contentStyle = styles.content
    if (this.props.contentStyle) {
      contentStyle = [contentStyle, this.props.contentStyle]
    }
    if (this.props.contentHeight) {
      contentStyle = [contentStyle, { height: this.props.contentHeight }]
    }
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        title={this.state.title}
        style={{ height: scaleSize(300) }}
        opacityStyle={{ height: scaleSize(250) }}
        confirmAction={this.confirm}
        cancelAction={this.cancel}
        confirmBtnTitle={this.state.confirmBtnTitle}
        cancelBtnTitle={this.state.cancelBtnTitle}
      >
        <View style={contentStyle}>
          <Image
            source={require('../../assets/home/Frenchgrey/icon_prompt.png')}
            style={{
              width: scaleSize(80),
              height: scaleSize(80),
            }}
          />
          <Text style={styles.title}>{this.state.value}</Text>
        </View>
      </Dialog>
    )
  }
}
