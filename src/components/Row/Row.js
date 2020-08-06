/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { Component } from 'react'
import { View, Text, TextInput } from 'react-native'
import RadioGroup from './RadioGroup'
import Radio from './Radio'
import ChooseNumber from './ChooseNumber'
import LabelBtn from './LabelBtn'
import ChooseColor from './ChooseColor'
import styles from './styles'
import { Input } from '../../components'

export default class Row extends Component {
  props: {
    style?: Object, // 自定义Row样式
    titleStyle?: Object, // 左侧文字样式
    customRightStyle?: Object, // 右侧内容样式
    disableStyle?: Object, // 右侧内容不可用样式
    title: string, // 左侧文字
    defaultValue?: any, // 默认值
    renderRightView?: any, // 自定义右侧内容
    type?: string, // Row.Type
    inputType?: string, // Row.InputType
    orientation?: string, // 横竖屏
    value?: any, // 值
    radioArr?: Array, // 单选框组[{title, value}]
    radioColumn?: number, // 单选框组列数
    separatorHeight?: number, // 单选框行间隔
    minValue?: number, // CHOOSE_NUMBER 最小值
    maxValue?: number, // CHOOSE_NUMBER 最大值
    commonDifference?: number, // CHOOSE_NUMBER 公差，值之间差值
    times?: number, // CHOOSE_NUMBER 倍数
    unit?: string, // CHOOSE_NUMBER 单位
    getValue?: () => {}, // 获取值的回调
    disable?: boolean, // 是否可操作
  }

  static defaultProps = {
    type: 'input',
    inputType: 'default',
    value: '',
    disable: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value || props.defaultValue,
      defaultValue: this.props.defaultValue || '',
      disable: this.props.disable,
    }
  }
  
  shouldComponentUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevProps) !== JSON.stringify(this.props) ||
      JSON.stringify(prevState) !== JSON.stringify(this.state)
    ) {
      return true
    }
    return false
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.defaultValue !== this.props.defaultValue ||
      this.state.defaultValue !== prevState.defaultValue
    ) {
      this.setState({
        value: this.props.value || this.props.defaultValue,
        defaultValue: this.props.defaultValue || '',
        disable: this.props.disable,
      })
    }
  }

  labelChange = text => {
    if (this.props.disable) return
    this.setState({
      value: text,
    })
    this.props.getValue &&
      this.props.getValue({ title: this.props.title, text })
  }

  getSelected = ({ title, selected, index, value }) => {
    this.props.getValue &&
      this.props.getValue({
        labelTitle: this.props.title,
        // value: title,
        title,
        value,
        selected,
        index,
      })
  }

  getValue = value => {
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
            disable={this.state.disable}
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
          data={this.props.radioArr}
          column={this.props.radioColumn}
          getSelected={this.getSelected}
          disable={this.state.disable}
          defaultValue={this.state.value}
          separatorHeight={this.props.separatorHeight}
        />
      )
    } else if (this.props.type === 'choose_number') {
      right = (
        <ChooseNumber
          maxValue={this.props.maxValue}
          minValue={this.props.minValue}
          defaultValue={this.props.defaultValue}
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
          value={this.props.value}
          getValue={this.getValue}
        />
      )
    } else if (this.props.type === 'choose_color') {
      right = (
        <ChooseColor
          disable={this.props.disable}
          title={this.props.title}
          value={this.props.value}
          getValue={this.getValue}
        />
      )
    } else if (this.props.type === 'radio') {
      // TODO 完善单选
      right = <Radio title={this.props.title} />
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

Row.Type = {
  INPUT: 'input', // 普通输入框
  INPUT_WRAP: 'input_wrap', // 含删除输入框Input
  RADIO: 'radio', // 一个单选框
  RADIO_GROUP: 'radio_group', // 多个单选框
  CHOOSE_NUMBER: 'choose_number', // 含数字增减按钮
  CHOOSE_COLOR: 'choose_color', // 色板
  TEXT_BTN: 'text_btn', // 文字按钮
}

// 输入框内容，键盘类型
Row.InputType = {
  NUMERIC: 'numeric', // 数字键盘
  DEFAULT: 'default', // 默认
}
