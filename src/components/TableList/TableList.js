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
 * table类型根据orientation来限制行或列，PORTRAIT时列固定，行自适应；LANDSCAPE时行固定，列自适应
 * scrollTable类型始终固定列数
 */
export default class TableList extends React.Component {
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
    device?: string,
    isAutoType?: Boolean,
    column?: number, // 列数
    numberOfRows?: number, // 行数限制
  }

  static defaultProps = {
    data: [],
    column: 2,
    numberOfRows: 6,
    type: 'table', // normal | scroll
    lineSeparator: 5,
    isAutoType: true,
  }

  shouldComponentUpdate(nextProps) {
    return JSON.stringify(nextProps) !== JSON.stringify(this.props)
  }

  getOrientation = () => {
    return (this.props.device && this.props.device.orientation) || 'PORTRAIT'
  }

  getType = () => {
    let type = this.props.type
    if (this.props.isAutoType) {
      if (
        type === 'table' &&
        this.props.numberOfRows &&
        this.props.data.length <= this.props.column * this.props.numberOfRows
      ) {
        type = 'table'
      } else {
        type = 'scrollTable'
      }
    }
    return type
  }

  renderRows = () => {
    // this.getDeviceWidth()
    // console.log(this.props)
    let rows = [],
      rowsView = []
    this.props.data.forEach((item, index) => {
      let column = this.props.column
      let orientation = this.getOrientation()
      if (
        orientation.indexOf('LANDSCAPE') === 0 &&
        // this.props.type !== 'scrollTable'
        this.getType() !== 'scrollTable'
      ) {
        column = Math.ceil(this.props.data.length / this.props.numberOfRows)
      }
      let rowIndex = Math.floor(index / column)
      let cellIndex = index % column
      if (!rows[rowIndex]) {
        rows[rowIndex] = []
      }
      rows[rowIndex].push(this.renderCell(item, rowIndex, cellIndex))
    })

    let limit = this.props.column
    if (rows.length >= 1 && rows[rows.length - 1].length < limit) {
      let num = limit - rows[rows.length - 1].length
      for (let i = 0; i < num; i++) {
        rows[rows.length - 1].push(
          <View
            style={[
              {
                width: 100 / limit + '%',
              },
              this.props.cellStyle,
            ]}
            key={rows.length - 1 + '-' + (rows[rows.length - 1].length + i)}
          />,
        )
      }
    }

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
          styles.row,
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
    let size = {
      justifyContent: 'flex-start',
      width: 100 / this.props.column + '%',
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
    if (this.getType() === 'scrollTable') {
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
