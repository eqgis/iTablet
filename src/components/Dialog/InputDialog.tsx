/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ReturnKeyTypeOptions,
} from 'react-native'
import Dialog from './Dialog'
import { color } from '../../styles'
import styles from './styles'
import { scaleSize, dataUtil } from '../../utils'

interface Props {
  confirmAction?: (data?: any) => void,
  cancelAction?: (data?: any) => void,
  placeholder: string,
  title?: string,
  label: string,
  value: string,
  defaultValue?: string,
  keyboardAppearance?: 'default' | 'light' | 'dark',
  returnKeyType?: ReturnKeyTypeOptions,
  confirmBtnTitle?: string,
  cancelBtnTitle?: string,
  legalCheck: boolean,
  multiline?: boolean,
}

interface State {
  title?: string,
  value: string,
  placeholder: string,
  isLegalName: boolean,
  legalCheck: boolean,
  errorInfo?: string,
}

export interface TempData {
  title?: string,
  label?: string,
  value?: string,
  placeholder?: string,
  legalCheck?: boolean,
  confirmAction?: (data?: any) => void,
  cancelAction?: (data?: any) => void,
}

export default class InputDialog extends PureComponent<Props, State> {

  static defaultProps = {
    label: '',
    value: '',
    keyboardAppearance: 'dark',
    returnKeyType: 'done',
    placeholder: '',
    confirmBtnTitle: '是',
    cancelBtnTitle: '否',
    legalCheck: true,
    multiline: false,
  }

  params: TempData = {} // 临时数据
  dialog: Dialog | undefined | null

  constructor(props: Props) {
    super(props)
    let { result, error } = dataUtil.isLegalName(props.value, GLOBAL.language)
    this.state = {
      value: props.value,
      placeholder: props.placeholder,
      isLegalName: result,
      errorInfo: error,
      title: props.title,
      legalCheck: props.legalCheck,
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      JSON.stringify(prevProps.value) !== JSON.stringify(this.props.value) ||
      prevProps.placeholder !== this.props.placeholder
    ) {
      this.setState({
        value: this.props.value,
        placeholder: this.props.placeholder,
      })
    }
  }

  setDialogVisible(visible: boolean, params: TempData = {}) {
    this.dialog && this.dialog.setDialogVisible(visible)
    if (!visible) {
      this.params = {}
      if (this.state.value !== '' || this.state.placeholder !== '' || this.state.title !== undefined) {
        this.setState({
          value: '',
          placeholder: '',
          title: undefined,
        })
      }
    } else {
      this.params = params
      if (params.value !== undefined || params.placeholder !== undefined || params.title !== this.state.title) {
        this.setState({
          value: params.value || '',
          placeholder: params.placeholder || '',
          title: params.title,
        })
      }
    }
  }

  confirm = () => {
    if (this.props.legalCheck && !this.state.isLegalName) return
    if (this.params.confirmAction) {
      this.params.confirmAction(this.state.value)
    } else if (this.props.confirmAction) {
      this.props.confirmAction(this.state.value)
    }
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
        {this.props.label ? (
          <Text style={styles.label}>{this.props.label}</Text>
        ) : null}
        <TextInput
          accessible={true}
          accessibilityLabel={
            this.props.placeholder ? this.props.placeholder : '输入框'
          }
          multiline={this.props.multiline}
          style={[styles.input, this.props.multiline && {textAlign: 'left', paddingHorizontal: scaleSize(8)}]}
          placeholder={this.state.placeholder}
          underlineColorAndroid="transparent"
          placeholderTextColor={color.themePlaceHolder}
          value={this.state.value + ''}
          onChangeText={text => {
            if (this.props.legalCheck) {
              let { result, error } = dataUtil.isLegalName(text, GLOBAL.language)
              this.setState({
                isLegalName: result,
                errorInfo: error,
                value: text,
              })
            } else {
              this.setState({
                value: text,
              })
            }
          }}
          keyboardAppearance={this.props.keyboardAppearance}
          returnKeyType={this.props.multiline ? 'next' : this.props.returnKeyType}
        />
      </View>
    )
  }

  render() {
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        title={this.state.title}
        // style={{ height: scaleSize(250) }}
        // opacityStyle={{ height: scaleSize(250) }}
        confirmAction={this.confirm}
        cancelAction={this.cancel}
        confirmBtnTitle={this.props.confirmBtnTitle}
        cancelBtnTitle={this.props.cancelBtnTitle}
        confirmBtnDisable={this.props.legalCheck && !this.state.isLegalName}
      >
        <KeyboardAvoidingView
          style={{ marginTop: scaleSize(20) }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
          enabled
        >
          {this.renderInput()}
          <View style={styles.errorView}>
            { this.state.legalCheck && !this.state.isLegalName && this.state.errorInfo && (
              <Text numberOfLines={2} style={styles.errorInfo}>
                {this.state.errorInfo}
              </Text>
            )}
          </View>
        </KeyboardAvoidingView>
      </Dialog>
    )
  }
}