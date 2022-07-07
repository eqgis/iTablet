import { getImage } from '@/assets'
import React from 'react'
import { Text, TextInput, View ,TouchableOpacity,Image, KeyboardTypeOptions} from 'react-native'
import { AppStyle, dp ,scaleSize} from '../utils'
import Dialog from './Dialog2'

export interface InputDialogOption {
  /** 默认输入 */
  defaultValue?: string
  /** 提示文字 */
  placeholder?: string
  /** 确定回调 */
  confirm: (text: string) => void
  /** 检查输入是否有错并返回错误提示，无错误返回空字符串 */
  checkSpell?: (text: string) => string
  /** 标题 */
  title?: string
  /** 描述文字 */
  descripton?: string
  /** 键盘输入类型 */
  keyboardType?: KeyboardTypeOptions
}


interface State extends InputDialogOption {
  /** 输入的文字 */
  text: string
  /** 错误提示 */
  error: string
}

class InputDialog extends React.Component<unknown, State> {
  dialog = React.createRef<Dialog>()

  constructor(props: unknown) {
    super(props)
    const initOption = this.getCurrentOption({})
    this.state = {
      text: '',
      error: '',
      ...initOption,
    }
  }

  _getDefaultOption = (): InputDialogOption => {
    return {
      defaultValue: '',
      placeholder: '',
      confirm: () => {},
      checkSpell: () => '',
      title: undefined,
      descripton: undefined,
      keyboardType: 'default',
    }
  }

  /** 获取当前设置，优先顺序：当前参数 > this.props > 默认参数 */
  getCurrentOption = (currentOption: Partial<InputDialogOption>): InputDialogOption => {
    const option: InputDialogOption = {
      ...this._getDefaultOption(),
      ...this.props,
      ...currentOption,
    }

    return option
  }

  setVisible = (visible: boolean) => {
    this.dialog.current?.setVisible(visible)
  }

  set = (option: InputDialogOption) => {
    this.dialog.current?.set({})
    const currentOption = this.getCurrentOption(option)
    this.setState({
      text: option.defaultValue || '',
      error: option.defaultValue ? (currentOption.checkSpell ? currentOption.checkSpell(option.defaultValue) : '') : '',
      ...currentOption
    })
  }

  clear = () => {
    this.setState({
      text: '',
      error: '',
    })
  }

  renderInput = () => {
    return (
      <View style={{width: '100%', alignItems: 'center', paddingTop: dp(20)}}>
        {this.state.title != undefined && (
          <Text style={{...AppStyle.h1, alignSelf: 'center', marginBottom: dp(10)}} numberOfLines={1}>
            {this.state.title}
          </Text>
        )}
        {this.state.descripton != undefined && (
          <Text style={{...AppStyle.h2g, paddingHorizontal: dp(15),  marginBottom: dp(10),}}>
            {this.state.descripton}
          </Text>
        )}
        <View
          style={{
            padding: dp(5),
            flexDirection: 'row',
            backgroundColor: AppStyle.Color.Background_Container,
            borderRadius: dp(10),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TextInput
            style={{
              width: dp(200),
              backgroundColor: AppStyle.Color.Background_Container,
              color: AppStyle.Color.Text_Input,
              textAlign: 'center',
              padding: dp(5),
              // marginTop: dp(20),
              // borderRadius: dp(10),
            }}
            keyboardType={this.state.keyboardType}
            autoFocus={true}
            placeholder={this.state.placeholder}
            value={this.state.text}
            onChangeText={text => {
              let error = ''
              if (this.state.checkSpell) {
                error = this.state.checkSpell(text)
              }
              this.setState({
                text: text,
                error: error
              })
            }}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              width: scaleSize(52),
              height: scaleSize(52),
              // marginTop: dp(20),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'transparent',
            }}
            onPress={this.clear}
          >
            <Image
              style={{
                width: scaleSize(52),
                height: scaleSize(52),
              }}
              resizeMode={'contain'}
              source={getImage().icon_close}
            />
          </TouchableOpacity>
        </View>
        <Text style={{...AppStyle.Text_Style_Small, color: AppStyle.Color.Button_Alert}}>
          {this.state.error}
        </Text>
      </View>
    )
  }

  render() {
    return(
      <Dialog
        ref={this.dialog}
        renderCustomerView={this.renderInput}
        confirm={() => {
          this.state.confirm(this.state.text)
        }}
        confirmAvailable={this.state.text !== '' && this.state.error === ''}
      />
    )
  }
}

export default InputDialog