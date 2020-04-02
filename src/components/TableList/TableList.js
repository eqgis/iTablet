/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { ScrollView, View } from 'react-native'
import styles from './styles'

/**
 * 表格列表
 * 根据orientation来限制行或列，PORTRAIT时列固定，行自适应；LANDSCAPE时行固定，列自适应
 */
export default class TableList extends React.PureComponent {
  props: {
    type: string,
    data: Array,
    // numColumns?: number,
    lineSeparator?: number,
    style?: Object,
    cellStyle?: Object,
    rowStyle?: Object,
    renderCell: () => {},
    type?: string,
    device: string,
    limit?: number,
  }

  static defaultProps = {
    data: [],
    // numColumns: 2,
    limit: 2,
    type: 'normal', // normal | scroll
    lineSeparator: 10,
  }

  renderRows = () => {
    // this.getDeviceWidth()
    // console.log(this.props)
    let rows = [],
      rowsView = []
    this.props.data.forEach((item, index) => {
      let column = this.props.limit
      if (this.props.device.orientation === 'LANDSCAPE') {
        column = Math.ceil(this.props.data.length / this.props.limit)
      }
      let rowIndex = Math.floor(index / column)
      let cellIndex = index % column
      if (!rows[rowIndex]) {
        rows[rowIndex] = []
      }
      rows[rowIndex].push(this.renderCell(item, rowIndex, cellIndex))
    })

    rows.forEach((row, rowIndex) => {
      rowsView.push(this.renderRow(row, rowIndex))
    })
    return rowsView
  }

  renderRow = (row, rowIndex) => {
    return (
      <View
        key={'row-' + rowIndex}
        style={[
          this.props.device.orientation === 'LANDSCAPE'
            ? styles.rowL
            : styles.rowP,
          this.props.rowStyle,
          rowIndex &&
            this.props.lineSeparator >= 0 && {
            marginTop: this.props.lineSeparator,
          },
        ]}
      >
        {row}
      </View>
    )
  }

  renderCell = (item, rowIndex, cellIndex) => {
    if (!this.props.renderCell) throw new Error('Please render cell')
    let limit = this.props.limit
    let size = {
      justifyContent: 'center',
      alignItems: 'center',
    }
    if (this.props.device.orientation === 'LANDSCAPE') {
      size.height = this.props.device.height / limit
    } else {
      size.width = this.props.device.width / limit
    }
    return (
      <View
        style={[size, this.props.cellStyle]}
        key={rowIndex + '-' + cellIndex}
      >
        {this.props.renderCell({ item, rowIndex, cellIndex })}
      </View>
    )
  }

  render() {
    if (this.props.type === 'scrollTable') {
      return (
        <ScrollView style={[styles.scrollContainer, this.props.style]}>
          {this.renderRows()}
        </ScrollView>
      )
    } else {
      return (
        <View style={[styles.normalContainer, this.props.style]}>
          {this.renderRows()}
        </View>
      )
    }
  }
}
