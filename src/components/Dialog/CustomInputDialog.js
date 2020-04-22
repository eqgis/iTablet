/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import React, { PureComponent } from 'react'
import { View, TextInput, KeyboardAvoidingView } from 'react-native'
import Dialog from './Dialog'
import { color } from '../../styles'
import styles from './styles'
import { scaleSize } from '../../utils'

export default class CustomInputDialog extends PureComponent {
  props: {
    confirmAction?: () => {}, //return true弹框消失 false不消失
    cancelAction?: () => {},
    placeholder?: string,
    title?: string, //标题
    value?: string,
    confirmBtnTitle?: string,
    cancelBtnTitle?: string,
    keyboardType?: string,
    keyboardAppearance?: string,
    returnKeyType?: string,
  }

  static defaultProps = {
    keyboardType: 'default',
    title: '',
    value: '',
    keyboardAppearance: 'dark',
    returnKeyType: 'done',
    placeholder: '',
    confirmBtnTitle: '是',
    cancelBtnTitle: '否',
  }

  constructor(props) {
    super(props)
    this.state = {
      title: props.title,
      value: props.value,
      placeholder: props.placeholder,
      confirmBtnTitle: props.confirmBtnTitle,
      cancelBtnTitle: props.cancelBtnTitle,
      keyboardAppearance: props.keyboardAppearance,
      returnKeyType: props.returnKeyType,
      keyboardType: props.keyboardType,
    }
    this.params = {} // 临时数据
  }

  /**
   * 设置Dialog显隐 如果visible为true 且要更改dialog内容 那么params所有参数为必须
   * @param visible
   * @param params
   */
  setDialogVisible(visible, params = {}) {
    if (visible) {
      let {
        title,
        value,
        confirmBtnTitle,
        cancelBtnTitle,
        placeholder,
        returnKeyType,
        keyboardAppearance,
        keyboardType,
      } = this.state
      if (
        params.title !== title ||
        params.value !== value ||
        params.confirmBtnTitle !== confirmBtnTitle ||
        params.cancelBtnTitle !== cancelBtnTitle ||
        params.placeholder !== placeholder ||
        params.returnKeyType !== returnKeyType ||
        params.keyboardAppearance !== keyboardAppearance ||
        params.keyboardType !== keyboardType
      ) {
        let {
          title,
          value,
          confirmBtnTitle,
          cancelBtnTitle,
          placeholder,
          returnKeyType,
          keyboardAppearance,
          keyboardType,
        } = params
        this.setState(
          {
            title,
            value,
            confirmBtnTitle,
            cancelBtnTitle,
            placeholder,
            returnKeyType,
            keyboardAppearance,
            keyboardType,
          },
          () => {
            this.params = params
            //数据发生改变 显示必须放在setState后，不然报错
            this.dialog?.setDialogVisible(true)
            setTimeout(() => {
              this.input?.focus()
            }, 100)
          },
        )
      } else {
        //数据未发生改变 直接显示
        this.dialog?.setDialogVisible(true)
        setTimeout(() => {
          this.input?.focus()
        }, 100)
      }
    } else {
      this.dialog?.setDialogVisible(false)
    }
  }

  confirm = () => {
    let result
    if (this.params.confirmAction) {
      result = this.params.confirmAction(this.state.value)
    } else if (this.props.confirmAction) {
      result = this.props.confirmAction(this.state.value)
    }
    //返回false弹框不消失
    result && this.setDialogVisible(false)
  }

  cancel = () => {
    if (this.params.cancelAction) {
      this.params.cancelAction()
    } else if (this.props.cancelAction) {
      this.props.cancelAction()
    }
    this.setDialogVisible(false)
  }

  renderInput = () => {
    return (
      <View style={styles.inputDialogContainer}>
        <TextInput
          ref={ref => (this.input = ref)}
          style={styles.input}
          placeholder={this.state.placeholder}
          underlineColorAndroid="transparent"
          placeholderTextColor={color.themePlaceHolder}
          value={this.state.value + ''}
          keyboardType={this.state.keyboardType}
          onChangeText={text => {
            this.setState({
              value: text,
            })
          }}
          keyboardAppearance={this.state.keyboardAppearance}
          returnKeyType={this.state.returnKeyType}
        />
      </View>
    )
  }

  render() {
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        title={this.state.title}
        style={{ height: scaleSize(250) }}
        opacityStyle={{ height: scaleSize(250) }}
        confirmAction={this.confirm}
        cancelAction={this.cancel}
        confirmBtnTitle={this.state.confirmBtnTitle}
        cancelBtnTitle={this.state.cancelBtnTitle}
      >
        <KeyboardAvoidingView behavior="padding" enabled>
          {this.renderInput()}
        </KeyboardAvoidingView>
      </Dialog>
    )
  }
}
