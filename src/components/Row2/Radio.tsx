/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
  StyleProp,
  ViewProps,
  TextProps,
  TextInputProps,
  ReturnKeyTypeOptions,
  KeyboardTypeOptions,
} from 'react-native'
import { getImage } from '../../assets'
import { AppStyle } from '../../utils'

import styles from './styles'

interface Props {
  style?: StyleProp<ViewProps>,
  titleStyle?: StyleProp<TextProps>,
  inputStyle?: StyleProp<TextInputProps>,
  placeholder?: string,
  inputValue?: string,
  title: string,
  value?: string,
  selected: boolean,
  selectable: boolean,
  hasInput?: boolean,
  keyboardType?: KeyboardTypeOptions,
  returnKeyLabel?: string,
  returnKeyType?: ReturnKeyTypeOptions,
  index: number,
  onPress?: (params: ActionParams) => void,
  onFocus?: (params: ActionParams) => void,
  onBlur?: (params: ActionParams) => void,
  onSubmitEditing?: (params: ActionParams) => void,
  onChangeText?: (params: ActionParams) => void,
}

interface Selection {
  start: number,
  end: number,
}

interface State {
  selected: boolean,
  inputValue: string,
  selection: Selection,
}

export interface ActionParams {
  title: string,
  value: any,
  inputValue: string,
  selected: boolean,
  index: number,
}

export default class Radio extends PureComponent<Props, State> {

  static defaultProps = {
    type: 'input',
    keyboardType: 'default',
    returnKeyLabel: '完成',
    returnKeyType: 'done',
    placeholder: '',
    selected: false,
    hasInput: false,
    selectable: true,
    index: -1,
  }

  submitting: boolean
  input: TextInput | null | undefined

  constructor(props: Props) {
    super(props)
    const inputValue = props.inputValue !== undefined ? props.inputValue : ''
    this.state = {
      selected: props.selected,
      inputValue,
      selection: { start: 0, end: inputValue.length - 1 },
    }
    this.submitting = false // android防止onblur和submit依次触发
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.state.selected !== this.props.selected &&
      prevProps.selected !== this.props.selected
    ) {
      const state: State = {...this.state}
      state.selected = this.props.selected
      if (this.props.selected) {
        state.selection = { start: 0, end: this.state.inputValue.length - 1 }
      }
      this.setState(state)
    }
  }

  select = (selected?: boolean) => {
    let sel = selected
    if (selected === undefined) {
      sel = !this.state.selected
    }
    this.setState(
      {
        selected: !!sel,
      },
      () => {
        if (this.state.selected && this.props.hasInput) {
          this.input && this.input.focus()
        }
      },
    )
  }

  selectAction = (selected?: boolean) => {
    if (this.state.selected) return
    this.select(selected)
    // let sel = selected
    // if (selected === undefined) {
    //   sel = !this.state.selected
    // }
    this.onPress()
  }

  onPress = () => {
    this.props.onPress &&
      this.props.onPress({
        title: this.props.title,
        value: this.props.value,
        inputValue: this.state.inputValue,
        selected: this.state.selected,
        index: this.props.index,
      })
  }

  onFocus = () => {
    this.props.onFocus &&
      this.props.onFocus({
        title: this.props.title,
        value: this.props.value,
        inputValue: this.state.inputValue,
        selected: this.state.selected,
        index: this.props.index || -1,
      })
    this.input && this.input.focus()
  }

  onSubmitEditing = () => {
    if (Platform.OS === 'ios' || !this.submitting) {
      this.props.onSubmitEditing &&
        this.props.onSubmitEditing({
          title: this.props.title,
          value: this.props.value,
          inputValue: this.state.inputValue,
          selected: this.state.selected,
          index: this.props.index,
        })
    } else {
      this.submitting = false
    }
  }

  onChangeText = (text: string) => {
    if (
      this.props.keyboardType === 'number-pad' ||
      this.props.keyboardType === 'decimal-pad' ||
      this.props.keyboardType === 'numeric'
    ) {
      if (isNaN(parseFloat(text)) && text !== '' && text !== '-') {
        text = this.state.inputValue
      }
    }
    if (
      this.props.onChangeText &&
      typeof this.props.onChangeText === 'function'
    ) {
      this.props.onChangeText({
        title: this.props.title,
        value: text,
        inputValue: this.state.inputValue,
        selected: this.state.selected,
        index: this.props.index,
      })
    }
    this.setState({ inputValue: text })
  }

  onBlur = () => {
    // Android blur不会触发onSubmitEditing
    if (Platform.OS === 'android') {
      this.submitting = true
      // this.props.onSubmitEditing &&
      // this.props.onSubmitEditing({
      //   title: this.props.title,
      //   value: this.props.value,
      //   inputValue: this.state.inputValue,
      //   selected: this.state.selected,
      //   index: this.props.index,
      // })
    }
    this.props.onBlur &&
      this.props.onBlur({
        title: this.props.title,
        value: this.props.value,
        inputValue: this.state.inputValue,
        selected: this.state.selected,
        index: this.props.index,
      })
  }

  render() {
    // let viewStyle = styles.radioView,
    //   dotStyle = styles.radioSelected
    // if (!this.props.selectable) {
    //   viewStyle = styles.radioViewGray
    //   dotStyle = styles.radioSelectedGray
    // }

    let dotImg = getImage().icon_single_check
    if (this.props.selectable) {
      dotImg = this.state.selected
        ? getImage().icon_single_check
        : getImage().icon_disable_none
    } else {
      dotImg = this.state.selected
        ? getImage().icon_disable_single_check
        : getImage().icon_disable_none
    }

    if (this.props.selectable) {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.radioContainer, this.props.style]}
          accessible={true}
          accessibilityLabel={this.props.title}
          onPress={() => this.selectAction()}
        >
          {/*<View style={viewStyle}>*/}
          {/*{this.state.selected && <View style={dotStyle} />}*/}
          {/*</View>*/}
          <Image style={styles.radioImg} source={dotImg}/>
          {this.props.title && (
            <Text style={[styles.radioTitle, this.props.titleStyle]}>
              {this.props.title}
            </Text>
          )}
          {this.props.hasInput &&
            (this.state.selected ? (
              <TextInput
                ref={ref => (this.input = ref)}
                underlineColorAndroid={'transparent'}
                style={[styles.input2, this.props.inputStyle]}
                placeholder={this.props.placeholder}
                keyboardType={this.props.keyboardType}
                value={this.state.inputValue + ''}
                returnKeyLabel={this.props.returnKeyLabel}
                returnKeyType={this.props.returnKeyType}
                onChangeText={this.onChangeText}
                onSubmitEditing={this.onSubmitEditing}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                selectTextOnFocus={true}
              />
            ) : (
              <View
                style={[styles.textView, { borderColor: AppStyle.Color.GRAY }]}
              >
                <Text
                  style={[
                    styles.text,
                    { color: AppStyle.Color.GRAY },
                    this.props.inputStyle,
                  ]}
                >
                  {this.state.inputValue}
                </Text>
              </View>
            ))}
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={[styles.radioContainer, this.props.style]}>
          {/*<View style={viewStyle}>*/}
          {/*{this.state.selected && <View style={dotStyle} />}*/}
          {/*</View>*/}
          <Image style={styles.radioImg} source={dotImg}/>
          {this.props.title && (
            <Text style={[styles.radioTitle, this.props.titleStyle]}>
              {this.props.title}
            </Text>
          )}
          {this.props.hasInput && (
            <View style={styles.textView}>
              <Text style={[styles.text, this.props.inputStyle]}>
                {this.state.inputValue}
              </Text>
            </View>
          )}
        </View>
      )
    }
  }
}
