/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity, Image, StyleProp, ViewStyle, TextStyle } from 'react-native'
import { getImage } from '../../assets'

import styles from './styles'

interface Props {
  style?: StyleProp<ViewStyle>,
  valueStyle?: StyleProp<TextStyle>,
  value: number | string,
  defaultValue: number | string,
  getValue?: (value: string) => void,
  unit?: string,
  minValue: string | number,
  maxValue: string | number,
  times: number,
  commonDifference: number,
  disable?: boolean,
}

interface State {
  value: number | string,
  plusAble?: boolean,
  miusAble?: boolean,
}


export default class ChooseNumber extends PureComponent<Props, State> {

  static defaultProps = {
    unit: '',
    value: '',
    minValue: '',
    maxValue: '',
    defaultValue: 2,
    times: 1,
    commonDifference: 1,
    disable: false,
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      value: props.value !== '' && props.value || props.defaultValue,
      plusAble: props.maxValue === '' || props.defaultValue < props.maxValue,
      miusAble: props.minValue === '' || props.defaultValue > props.minValue,
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.value !== '' && (prevProps.value !== this.props.value || this.props.value !== this.state.value)) {
      this.setState({
        value: this.props.value,
        plusAble: this.props.maxValue === '' || this.props.value < this.props.maxValue,
        miusAble: this.props.minValue === '' || this.props.value > this.props.minValue,
      })
    }
  }

  minus = () => {
    if (this.props.disable) return
    if (this.props.minValue === '' || this.state.value > this.props.minValue) {
      let value = this.props.times > 1
        ? (parseFloat(this.state.value + '') / this.props.times)
        : (parseFloat(this.state.value + '') - this.props.commonDifference)
      const dec = this.props.commonDifference.toString().split(".")[1]
      if (dec) {
        value = parseFloat(value.toFixed(dec.length))
      }
      this.setState({
        value: this.props.minValue !== '' && value < this.props.minValue ? this.props.minValue : value,
        miusAble: this.props.minValue === '' || value > this.props.minValue,
        plusAble: this.props.maxValue === '' || value < this.props.maxValue,
      }, () => {
        this.props.getValue && this.props.getValue(this.state.value + '')
      })
    } else {
      this.props.getValue && this.props.getValue(this.state.value + '')
    }
  }

  plus = () => {
    if (this.props.disable) return
    if (this.props.maxValue === '' || this.state.value < this.props.maxValue) {
      let value = this.props.times > 1
        ? (parseFloat(this.state.value + '') * this.props.times)
        : (parseFloat(this.state.value + '') + parseFloat(this.props.commonDifference + ''))
      const dec = this.props.commonDifference.toString().split(".")[1]
      if (dec) {
        value = parseFloat(value.toFixed(dec.length))
      }
      this.setState({
        value: this.props.maxValue !== '' && value > this.props.maxValue ? this.props.maxValue : value,
        plusAble: this.props.maxValue === '' || value < this.props.maxValue,
        miusAble: this.props.minValue === '' || value > this.props.minValue,
      }, () => {
        this.props.getValue && this.props.getValue(this.state.value + '')
      })
    } else {
      this.props.getValue && this.props.getValue(this.state.value + '')
    }
  }

  render() {

    return (
      <View style={styles.chooseNumberContainer}>
        <TouchableOpacity
          disabled={!this.state.miusAble}
          style={this.state.miusAble && !this.props.disable ? styles.imageBtnView : styles.disableImageBtnView}
          accessible={true}
          accessibilityLabel={'减号'}
          onPress={() => this.minus()}
        >
          <Image style={styles.imageBtn} source={getImage().icon_minus_white} />
        </TouchableOpacity>
        <Text style={[styles.numberTitle, this.props.valueStyle]}>{this.state.value + ' ' + this.props.unit}</Text>
        <TouchableOpacity
          disabled={!this.state.plusAble}
          style={this.state.plusAble && !this.props.disable ? styles.imageBtnView : styles.disableImageBtnView}
          accessible={true}
          accessibilityLabel={'加号'}
          onPress={() => this.plus()}
        >
          <Image style={styles.imageBtn} source={getImage().icon_plus_white} />
        </TouchableOpacity>
      </View>
    )
  }
}