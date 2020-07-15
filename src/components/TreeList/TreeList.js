/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { ScrollView } from 'react-native'
import TreeListItem from './TreeListItem'

import styles from './styles'

export default class TreeList extends React.Component {
  props: {
    data: Array,
    numColumns?: number,
    itemTextColor?: string,
    itemTextSize?: number,
    itemStyle?: Object,
    itemRightView?: Object,
    separator?: boolean,
    separatorStyle?: any,
    style?: Object,
    cellStyle?: Object,
    rowStyle?: Object,
    iconStyle?: Object,
    renderItem: () => {},
    renderChild: () => {},
    onPress: () => {},
  }

  static defaultProps = {
    data: [],
    numColumns: 2,
  }

  _onPress = ({ data, index }) => {
    if (this.props.onPress) {
      this.props.onPress({ data, index })
    }
  }

  renderRows = () => {
    let rows = []
    this.props.data.forEach((data, index) => {
      rows.push(this.renderRow({ data, index }))
    })
    return rows
  }

  renderRow = ({ data, index, parent }) => {
    if (this.props.renderItem) {
      return this.props.renderItem({ data, index, parent })
    }
    let key = index
    if (parent) {
      if (parent.key !== undefined && data.code !== undefined) {
        key = parent.key + '_' + data.code
      } else {
        key = parent.key
      }
    } else {
      key = data.code || data.id
    }
    return (
      <TreeListItem
        key={key}
        data={data}
        index={index}
        style={[styles.row, this.props.itemStyle]}
        textColor={this.props.itemTextColor}
        fontSize={this.props.itemTextSize}
        separatorStyle={this.props.separatorStyle}
        separator={this.props.separator}
        rightView={this.props.itemRightView}
        childrenStyle={[styles.children]}
        // childrenData={row.childGroups}
        keyExtractor={data => data.path}
        renderChild={this.renderChild}
        onPress={this._onPress}
      />
    )
  }

  renderChild = ({ data, index, parent }) => {
    if (this.props.renderItem) {
      return this.props.renderChild({ data, index, parent })
    }
    let key = index
    if (parent) {
      if (parent.key !== undefined && data.code !== undefined) {
        key = parent.key + '_' + data.code
      } else {
        key = parent.key
      }
    } else {
      key = data.code || data.id
    }
    return (
      <TreeListItem
        key={key}
        data={data}
        index={index}
        style={[styles.row, this.props.itemStyle]}
        textColor={this.props.itemTextColor}
        fontSize={this.props.itemTextSize}
        separatorStyle={this.props.separatorStyle}
        separator={this.props.separator}
        rightView={this.props.itemRightView}
        childrenStyle={[styles.children]}
        iconStyle={this.props.iconStyle}
        // childrenData={item.childGroups}
        keyExtractor={data => data.path || (data.$ && data.$.name) || index}
        renderChild={this.renderChild}
        onPress={this._onPress}
      />
    )
  }

  renderItem = (row, rowIndex) => {
    this.props.renderItem && this.props.renderItem(row, rowIndex)
  }

  render() {
    return (
      <ScrollView style={[styles.container, this.props.style]}>
        {this.renderRows()}
      </ScrollView>
    )
  }
}
