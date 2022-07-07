/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/

import { WIDTH } from '@/utils/constUtil'
import { dp } from 'imobile_for_reactnative/utils/size'
import * as React from 'react'
import { ScrollView, View, Dimensions } from 'react-native'
import styles from './styles'

/**
 * 表格列表
 * table类型根据orientation来限制行或列，PORTRAIT时列固定，行自适应；LANDSCAPE时行固定，列自适应
 * scrollTable类型始终固定列数
 */
export default class TableList extends React.Component {
  props: {
    data: Array, // 数据
    lineSeparator?: number, // 行间距
    style?: Object, // 表格样式
    cellStyle?: Object, // Cell样式
    rowStyle?: Object, // 行样式
    renderCell: (data: { item: any, rowIndex: number, cellIndex: number }) => any, // 自定义Cell， 必填
    type?: string, // normal 固定 | scroll 滚动
    device?: any, // 设备信息
    isAutoType?: boolean, // 是否根据个数，自适应滚动或固定表格
    column?: number, // 列数
    numberOfRows?: number, // 行数限制
    horizontal?: boolean, // 是否是横向滚动
  }

  static defaultProps = {
    data: [],
    column: 2,
    numberOfRows: 6,
    type: 'table', // normal | scroll
    lineSeparator: 5,
    isAutoType: true,
    horizontal: false,
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
    let rows = [],
      rowsView = []
    const isHorizontalScroll = this.props.horizontal && (this.props.column < this.props.data.length)
    if (isHorizontalScroll) {
      this.props.data.forEach((item, index) => {
        rows.push(this.renderCell(item, 0, index))
      })
      return rows
    }
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
    const isHorizontalScroll = this.props.horizontal && (this.props.column < this.props.data.length)
    const width = isHorizontalScroll ? Math.min(Dimensions.get('window').width / this.props.column, 100) : (100 / this.props.column + '%')
    let size = {
      justifyContent: 'flex-start',
      width: width,
    }
    return (
      <View
        style={[size, this.props.cellStyle, {backgroundColor: 'transparent'}]}
        key={rowIndex + '-' + cellIndex}
      >
        {this.props.renderCell({ item, rowIndex, cellIndex })}
      </View>
    )
  }

  render() {
    if (this.getType() === 'scrollTable') {
      const isHorizontalScroll = this.props.horizontal && (this.props.column < this.props.data.length)
      let style = {}
      if(isHorizontalScroll) {
        // 每一个项的宽度
        const cellWidth = isHorizontalScroll ? Math.min(Dimensions.get('window').width / this.props.column, 100) : (100 / this.props.column + '%')
        // 滑动部分的宽度（不是滑动部分显示的宽度，而是实际的宽度）
        const width = isHorizontalScroll ? Math.max(Dimensions.get('window').width, cellWidth * this.props.data.length) : (100 + '%')
        // console.warn(cellWidth + " - " + cellWidth * this.props.data.length + " - " + Dimensions.get('window').width)
        style = {
          flexDirection: 'row',
          // justifyContent: 'space-around',
          width: width,
        }
      }
      return (
        <ScrollView
          horizontal={this.props.horizontal}
          style={[
            styles.scrollContainer,
            isHorizontalScroll && {
              flexDirection: 'row',
            },
            this.props.style,
          ]}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={style}
        >
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
