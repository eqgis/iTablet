/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { StyleProp, View, ViewProps } from 'react-native'
import Radio from './Radio'
import styles from './styles'
import { scaleSize } from '../../utils'


interface ActionParams {
  title: string,
  value: any,
  inputValue: string,
  selected: boolean,
  index: number,
  [key: string]: any,
}

interface Props {
  style?: StyleProp<ViewProps>,
  data: any[],
  column: number,
  defaultValue?: any,
  getSelected?: (params: ActionParams) => void,
  renderRadio?: (params: { data: any, index: number }) => void,
  onSubmitEditing?: (params: ActionParams) => void,
  onFocus?: (params: ActionParams) => void,
  onBlur?: (params: ActionParams) => void,
  separatorHeight?: number,
  disable?: boolean,
  radioStyle?: any,
}

export default class RadioGroup extends PureComponent<Props> {

  static defaultProps = {
    data: [],
    type: 'input',
    column: 2,
    defaultValue: -1,
    disable: false,
    separatorHeight: scaleSize(20),
  }

  current: number
  refArr: Array<Radio | null>

  constructor(props: Props) {
    super(props)
    this.current = this.getIndexByValue(props.defaultValue)
    this.refArr = []
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.defaultValue !== this.props.defaultValue) {
      this.current = this.getIndexByValue(this.props.defaultValue)
    }
  }

  getIndexByValue = (value: any) => {
    let index = -1
    for (let i = 0; i < this.props.data.length; i++) {
      if (this.props.data[i].value === value) {
        index = i
        break
      }
    }
    return index
  }

  select = ({ title, selected, index, value, ...other }: ActionParams) => {
    if (index === this.current || index === undefined) return
    this.current >= 0 &&
      this.refArr &&
      this.refArr[this.current] &&
      this.refArr[this.current]?.select(false)
    this.current = index
    this.props.getSelected &&
      this.props.getSelected({ title, selected, index, value, ...other })
  }

  onSubmitEditing = ({ title, selected, index, value, ...other }: ActionParams) => {
    this.props.onSubmitEditing &&
      this.props.onSubmitEditing({ title, selected, index, value, ...other })
  }

  onFocus = ({ title, selected, index, value, ...other }: ActionParams) => {
    this.props.onFocus &&
      this.props.onFocus({ title, selected, index, value, ...other })
  }

  onBlur = ({ title, selected, index, value, ...other }: ActionParams) => {
    this.props.onBlur &&
      this.props.onBlur({ title, selected, index, value, ...other })
  }

  setRefs = (ref: Radio | null, index: number) => {
    this.refArr[index] = ref
  }

  renderRows = () => {
    const group: any = [],
      groupView: any = []
    this.props.data.forEach((obj: any, index: number) => {
      const row = Math.floor(index / this.props.column)
      if (!group[row]) group[row] = []
      const { title, value, ...others } = obj
      if (
        this.props.renderRadio &&
        typeof this.props.renderRadio === 'function'
      ) {
        group[row].push(this.props.renderRadio({ data: obj, index }))
      }
      group[row].push(
        <Radio
          style={{ flex: 1 }}
          key={title + '-' + index}
          ref={ref => this.setRefs(ref, index)}
          index={index}
          selectable={!this.props.disable}
          title={title}
          value={value}
          selected={this.props.defaultValue === value}
          // selected={this.current === index}
          onPress={this.select}
          onSubmitEditing={this.onSubmitEditing}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          {...this.props.radioStyle}
          {...others}
        />,
      )
    })

    group.forEach((obj: any, index: number) => {
      groupView.push(
        <View
          key={'row-' + index}
          style={[
            styles.radioGroupRow,
            index !== 0 && { marginTop: this.props.separatorHeight },
          ]}
        >
          {obj}
        </View>,
      )
    })
    // group.forEach((obj, index) => {
    //   groupView.push(obj)
    // })

    return groupView
  }

  render() {
    return <View style={[styles.radioGroupContainer, this.props.style]}>{this.renderRows()}</View>
  }
}
