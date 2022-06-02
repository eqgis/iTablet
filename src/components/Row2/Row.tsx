/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { Component } from 'react'
import { View, Text, TextInput, StyleProp, ViewStyle, TextStyle } from 'react-native'
import RadioGroup from './RadioGroup'
import Radio, { ActionParams } from './Radio'
import ChooseNumber from './ChooseNumber'
import LabelBtn from './LabelBtn'
import ChooseColor from './ChooseColor'
import styles from './styles'
import Input from '../Input'

interface Props {
  style?: StyleProp<ViewStyle>, // 自定义Row样式
  titleStyle?: StyleProp<TextStyle>, // 左侧文字样式
  customRightStyle?: StyleProp<ViewStyle>, // 右侧内容样式
  disableStyle?: StyleProp<ViewStyle>, // 右侧内容不可用样式
  title: string, // 左侧文字
  defaultValue?: boolean | string | number | undefined | unknown, // 默认值
  renderRightView?: () => JSX.Element, // 自定义右侧内容
  type?: string, // Row.Type
  inputType?: string, // Row.InputType
  orientation?: string, // 横竖屏
  value?: string | number | undefined, // 值
  radioArr?: Array<{title: string, value: unknown}>, // 单选框组[{title, value}]
  radioColumn?: number, // 单选框组列数
  separatorHeight?: number, // 单选框行间隔
  minValue?: number, // CHOOSE_NUMBER 最小值
  maxValue?: number, // CHOOSE_NUMBER 最大值
  commonDifference?: number, // CHOOSE_NUMBER 公差，值之间差值
  times?: number, // CHOOSE_NUMBER 倍数
  unit?: string, // CHOOSE_NUMBER 单位
  labelChange?: (data: Params1) => void, // 获取值的回调
  getValue?: (value: string) => void, // 获取值的回调
  getSelected?: (data: Params2) => void, // 获取值的回调
  disable: boolean, // 是否可操作
}

interface State {
  value: string,
  defaultValue: unknown,
  disable: boolean,
}

export interface Params1 { title: string, text: string }
export interface Params2 {
  labelTitle: string,
  title: string,
  value: string,
  selected: boolean,
  index: number,
}
export interface Params3 { title: string, text: string }

export default class Row extends Component<Props, State> {

  static Type = {
    INPUT: 'input', // 普通输入框
    INPUT_WRAP: 'input_wrap', // 含删除输入框Input
    RADIO: 'radio', // 一个单选框
    RADIO_GROUP: 'radio_group', // 多个单选框
    CHOOSE_NUMBER: 'choose_number', // 含数字增减按钮
    CHOOSE_COLOR: 'choose_color', // 色板
    TEXT_BTN: 'text_btn', // 文字按钮
  }

  // 输入框内容，键盘类型
  static InputType = {
    NUMERIC: 'numeric', // 数字键盘
    DEFAULT: 'default', // 默认
  }

  static defaultProps = {
    type: 'input',
    inputType: 'default',
    value: '',
    disable: false,
  }

  constructor(props: Props) {
    super(props)
    const value = this.props.value || this.props.defaultValue
    this.state = {
      value: value === undefined ? '' : value + '',
      defaultValue: this.props.defaultValue === undefined ? '' : this.props.defaultValue,
      disable: !!this.props.disable,
    }
  }

  shouldComponentUpdate(prevProps: Props, prevState: State) {
    if (
      JSON.stringify(prevProps) !== JSON.stringify(this.props) ||
      JSON.stringify(prevState) !== JSON.stringify(this.state)
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      prevProps.defaultValue !== this.props.defaultValue ||
      this.state.defaultValue !== prevState.defaultValue
    ) {
      const value = this.props.value || this.props.defaultValue
      this.setState({
        value: value === undefined ? '' : value + '',
        defaultValue: this.props.defaultValue === undefined ? '' : this.props.defaultValue,
        disable: !!this.props.disable,
      })
    }
  }

  labelChange = (text: string) => {
    if (this.props.disable) return
    this.setState({
      value: text,
    })
    this.props.labelChange &&
      this.props.labelChange({ title: this.props.title, text })
  }

  getSelected = ({ title, selected, index, value }: ActionParams) => {
    this.props.getSelected &&
      this.props.getSelected({
        labelTitle: this.props.title,
        // value: title,
        title,
        value,
        selected,
        index,
      })
  }

  getValue = (value: string) => {
    this.props.getValue && this.props.getValue(value)
  }

  renderRight = () => {
    let right = <View />
    if (this.props.renderRightView) {
      right = this.props.renderRightView()
    } else if (this.props.type === 'input') {
      right = (
        <View style={styles.inputView}>
          <TextInput
            keyboardType={
              this.props.inputType === 'numeric' ? 'numeric' : 'default'
            }
            style={[styles.input, this.props.customRightStyle]}
            accessible={true}
            value={this.state.value + ''}
            defaultValue={this.state.defaultValue + ''}
            accessibilityLabel={this.props.title}
            underlineColorAndroid="transparent"
            onChangeText={this.labelChange}
          />
          {this.props.disable && <View style={[styles.inputOverLayer, this.props.disableStyle]} />}
        </View>
      )
    } else if (this.props.type === 'input_wrap') {
      right = (
        <View style={[styles.inputView]}>
          <Input
            inputStyle={this.props.customRightStyle}
            style={this.props.customRightStyle}
            accessible={true}
            accessibilityLabel={'输入框'}
            value={this.state.value + ''}
            onChangeText={text => {
              this.labelChange(text)
            }}
            onClear={() => {
              this.labelChange('')
            }}
            returnKeyType={'done'}
            showClear={!this.props.disable}
          />
          {this.props.disable && <View style={[styles.inputOverLayer, this.props.disableStyle]} />}
        </View>
      )
    } else if (this.props.type === 'radio_group') {
      right = (
        <RadioGroup
          style={this.props.customRightStyle}
          data={this.props.radioArr}
          column={this.props.radioColumn}
          getSelected={this.getSelected}
          disable={this.state.disable}
          defaultValue={this.state.defaultValue}
          separatorHeight={this.props.separatorHeight}
        />
      )
    } else if (this.props.type === 'choose_number') {
      right = (
        <ChooseNumber
          style={this.props.customRightStyle}
          maxValue={this.props.maxValue}
          minValue={this.props.minValue}
          defaultValue={typeof this.props.defaultValue === 'number' ? this.props.defaultValue : 0}
          value={this.props.value}
          disable={this.props.disable}
          getValue={this.getValue}
          unit={this.props.unit}
          times={this.props.times}
          commonDifference={this.props.commonDifference}
        />
      )
    } else if (this.props.type === 'text_btn') {
      right = (
        <LabelBtn
          style={this.props.customRightStyle}
          title={this.props.title}
          value={this.props.value + ''}
          getValue={this.getValue}
        />
      )
    } else if (this.props.type === 'choose_color') {
      right = (
        <ChooseColor
          style={this.props.customRightStyle}
          title={this.props.title}
          value={this.props.value + ''}
          getValue={this.getValue}
        />
      )
    } else if (this.props.type === 'radio') {
      // TODO 完善单选
      right = <Radio title={this.props.title} style={this.props.customRightStyle} />
    }
    return right
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Text style={[styles.rowLabel, this.props.titleStyle]}>{this.props.title}</Text>
        {this.renderRight()}
      </View>
    )
  }
}
