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
    limit?: number, // scrollTable limit始终表示列数
  }

  static defaultProps = {
    data: [],
    limit: 2,
    type: 'table', // normal | scroll
    lineSeparator: 10,
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
        (this.props.data.length > 10 &&
          this.props.limit === 2 &&
          this.getOrientation().indexOf('LANDSCAPE') === 0) ||
        (this.props.data.length > 8 &&
          this.props.limit === 4 &&
          this.getOrientation().indexOf('PORTRAIT') === 0)
      ) {
        type = 'scrollTable'
      } else {
        type = 'table'
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
      let column = this.props.limit
      let orientation = this.getOrientation()
      if (
        orientation.indexOf('LANDSCAPE') === 0 &&
        // this.props.type !== 'scrollTable'
        this.getType() !== 'scrollTable'
      ) {
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
    let orientation = this.getOrientation()
    return (
      <View
        key={'row-' + rowIndex}
        style={[
          orientation.indexOf('LANDSCAPE') === 0 ? styles.rowL : styles.rowP,
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
      width: 100 / limit + '%',
      height: 100 / limit + '%',
    }
    // let orientation = this.getOrientation()
    // if (orientation.indexOf('LANDSCAPE') === 0) {
    //   size.height = 100 / limit + '%'
    // }
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
    // let type = this.props.type
    // if (type === 'scrollTable') {
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
