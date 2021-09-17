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
  KeyboardTypeOptions,
} from 'react-native'
import Dialog from './Dialog'
import { color } from '../../styles'
import styles from './styles'
import { scaleSize, dataUtil } from '../../utils'
import { getLanguage } from '../../language'

type ValueType = 'default' | 'http' | 'number' | 'name'

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
  errorInfo?: string | null,
  type?: ValueType,
}

export interface TempData {
  title?: string,
  label?: string,
  value?: string,
  placeholder?: string,
  legalCheck?: boolean,
  type?: ValueType,
  confirmAction?: (data?: any) => void,
  cancelAction?: (data?: any) => void,
  /** 检查输入是否有错并返回错误提示，无错误返回空字符串 */
  checkSpell?: (text: string) => string
}

export default class InputDialog extends PureComponent<Props, State> {

  static defaultProps = {
    label: '',
    value: '',
    keyboardAppearance: 'dark',
    returnKeyType: 'done',
    placeholder: '',
    confirmBtnTitle: '',
    cancelBtnTitle: '',
    legalCheck: true,
    multiline: false,
  }

  params: TempData = {} // 临时数据
  dialog: Dialog | undefined | null

  constructor(props: Props) {
    super(props)
    let { result, error } = this.checkValue(props.value, 'default')
    this.state = {
      value: props.value,
      placeholder: props.placeholder,
      isLegalName: result,
      errorInfo: error,
      title: props.title,
      legalCheck: props.legalCheck,
      type: 'default',
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
      if (params.value !== undefined || params.placeholder !== undefined || params.title !== this.state.title|| params.type !== this.state.type) {
        let _value = params.value || ''
        let _type = params.type || 'default'
        let { result, error } = this.checkValue(_value, _type)
        this.setState({
          value: _value,
          placeholder: params.placeholder || '',
          title: params.title,
          isLegalName: result,
          errorInfo: error,
          type: _type,
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

  getKeyboardType = (): KeyboardTypeOptions => {
    let keyboardType: KeyboardTypeOptions
    switch (this.state.type) {
      case 'number':
        keyboardType = 'numeric'
        break
      case 'name':
      case 'http':
      default:
        keyboardType = 'default'
        break
    }
    return keyboardType
  }

  checkValue = (text: string, type = this.state.type): {result: boolean, error?: string | null} => {
    let res
    if(this.params.checkSpell) {
      const info = this.params.checkSpell(text)
      return { result: info === '', error: info === '' ? null : info}
    }
    switch (type) {
      case 'number': {
        let isNumber = text !== '' && !isNaN(text) && text !== undefined
        res = {
          result: isNumber,
          error: isNumber
            ? null
            : getLanguage(GLOBAL.language).Prompt.ERROR_INFO_NOT_A_NUMBER,
        }
        break
      }
      case 'name':
        res = dataUtil.isLegalName(text, GLOBAL.language)
        break
      case 'http':
        if (text === '') {
          res = { result: true }
        } else {
          res = dataUtil.isLegalURL(text, GLOBAL.language)
        }
        break
      default:
        res = { result: text !== '', error: text === '' ? getLanguage(GLOBAL.language).Prompt.ERROR_INFO_EMPTY : '' }
        break
    }
    return res
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
              let { result, error } = this.checkValue(text)
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
          keyboardType={this.getKeyboardType()}
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
        confirmBtnTitle={this.props.confirmBtnTitle || getLanguage(GLOBAL.language).Prompt.YES}
        cancelBtnTitle={this.props.cancelBtnTitle || getLanguage(GLOBAL.language).Prompt.NO}
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
