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
    data: Array,
    device: Object,
    itemAction?: () => {},
    callback?: () => {},
  }

  static defaultProps = {
    column: 8,
  }

  constructor(props) {
    super(props)

    this.state = {
      data: this.dealData(this.props.data),
      itemSize: 0,
    }
    this.sizeTemp = -1
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.language !== nextProps.language ||
      JSON.stringify(this.props.device) !== JSON.stringify(nextProps.device) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState) ||
      this.sizeTemp !== this.state.itemSize ||
      JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
      this.setState({
        data: this.dealData(this.props.data),
      })
    }
  }

  getColumn = () => {
    if (GLOBAL.isPad) {
      return this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? 4 : 8
    } else {
      return this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? 4 : 6
    }
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

  _onLayout = event => {
    let { width } = event.nativeEvent.layout
    if (
      this.sizeTemp < width ||
      this.state.itemSize < this.sizeTemp / this.getColumn() - scaleSize(4)
    ) {
      this.sizeTemp = width
      this.setState({
        itemSize: width / this.getColumn() - scaleSize(4),
      })
    }
  }

  itemAction = async item => {
    if (this.props.itemAction) {
      this.props.itemAction(item)
    } else {
      let isSuccess = await item.action()
      if (isSuccess) this.props.callback && this.props.callback(item.key)
    }
  }

  renderItem = ({ item }) => {
    if (typeof item === 'object' && item.useSpace)
      return (
        <View
          style={{
            flex: 1,
            maxHeight: this.state.itemSize,
            maxWidth: this.state.itemSize,
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
          maxHeight: this.state.itemSize,
          maxWidth: this.state.itemSize,
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
        onLayout={this._onLayout}
        key={'color_list_' + this.props.device.orientation}
        renderItem={this.renderItem}
        data={this.state.data}
        keyExtractor={(item, index) =>
          (typeof item === 'string' ? item : item.key) + index
        }
        numColumns={this.getColumn()}
        extraData={this.state}
      />
    )
  }
}
