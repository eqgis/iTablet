/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import React from 'react'
import { TouchableOpacity, View, FlatList, Text } from 'react-native'
import { scaleSize } from '../../../../utils/index'
import { color } from '../../../tabs/Mine/MyService/Styles'

export default class ColorTable extends React.Component {
  props: {
    language: string,
    column: number,
    // height: number,
    data: Array,
    device: Object,
    itemAction?: () => {},
    callback?: () => {},
  }

  static defaultProps = {
    column: 8,
    // height: Height.TABLE_ROW_HEIGHT_4 * 5,
  }

  constructor(props) {
    super(props)

    this.state = {
      data: this.dealData(this.props.data),
    }
  }

  shouldComponentUpdate(nextProps) {
    if (
      this.props.language !== nextProps.language ||
      JSON.stringify(this.props.device) !== JSON.stringify(nextProps.device) ||
      JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps) {
    // if (prevProps.device.orientation !== this.props.device.orientation) {
    //   this.height =
    //     prevProps.device.orientation.indexOf('LANDSCAPE') === 0
    //       ? ConstToolType.THEME_HEIGHT[7]
    //       : ConstToolType.THEME_HEIGHT[3]
    //   this.ColumnNums = prevProps.device.orientation.indexOf('LANDSCAPE') === 0 ? 12 : 8
    // }
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
      this.setState({
        data: this.dealData(this.props.data),
      })
    }
  }

  getColumn = () => {
    return this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? 4 : 8
  }

  getRow = () => {
    return this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? 8 : 4
  }

  dealData = data => {
    let newData = data.clone()
    while (newData.length % this.getColumn() !== 0) {
      newData.push({
        useSpace: true,
      })
    }
    return newData
  }

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   if (nextProps.device.orientation !== this.props.device.orientation) {
  //     this.height = Height.TABLE_ROW_HEIGHT_4 * 5
  //     this.ColumnNums = 8
  //   }
  // }

  itemAction = async item => {
    if (this.props.itemAction) {
      this.props.itemAction(item)
    } else {
      let isSuccess = await item.action()
      if (isSuccess) this.props.callback && this.props.callback(item.key)
    }
  }

  renderItem = ({ item }) => {
    let size =
      Math.min(this.props.device.height, this.props.device.width) / 8 -
      scaleSize(4)
    // (this.props.device.orientation.indexOf('LANDSCAPE') === 0
    //   ? this.props.device.height
    //   : this.props.device.width) /
    // this.getColumn() -
    // scaleSize(4)
    // let height = 100 / this.getRow() + '%'
    if (typeof item === 'object' && item.useSpace)
      return (
        <View
          style={{
            flex: 1,
            maxHeight: size,
            maxWidth: size,
            backgroundColor: color.white,
            borderWidth: scaleSize(2),
            borderColor: color.white,
            marginVertical: scaleSize(2),
            marginHorizontal: scaleSize(2),
          }}
        />
      )
    return (
      <TouchableOpacity
        onPress={() => {
          this.itemAction(item)
        }}
        style={{
          flex: 1,
          maxHeight: size,
          maxWidth: size,
          backgroundColor: typeof item === 'string' ? item : item.key,
          borderWidth: scaleSize(2),
          borderColor: color.gray,
          marginVertical: scaleSize(2),
          marginHorizontal: scaleSize(2),
        }}
      >
        <View
          style={{
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          {typeof item === 'object' && item.text ? (
            <Text
              style={{
                fontSize: scaleSize(25),
                color: 'black',
                textAlign: 'center',
              }}
            >
              {item.text}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <FlatList
        key={'color_list_' + this.props.device.orientation}
        renderItem={this.renderItem}
        data={this.state.data}
        keyExtractor={(item, index) =>
          (typeof item === 'string' ? item : item.key) + index
        }
        numColumns={this.getColumn()}
      />
    )
  }
}
