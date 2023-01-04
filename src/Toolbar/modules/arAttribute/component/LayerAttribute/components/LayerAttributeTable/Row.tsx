/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

// import { FieldInfo2 } from 'imobile_for_reactnative/types/data'
import { FieldInfoValue } from 'imobile_for_reactnative/NativeModule/interfaces/data/SDataType'
import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle, GestureResponderEvent, StyleProp, Image } from 'react-native'
import { getImage } from '../../../../../../../assets'
import { getLanguage } from '../../../../../../../language'
import { scaleSize, AppStyle, dp } from '../../../../../../../utils'
import Cell from './Cell'
import { CellData } from './types'

const ROW_HEIGHT = scaleSize(80)
const CELL_WIDTH = 100

const styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    height: ROW_HEIGHT,
    backgroundColor: AppStyle.Color.WHITE,
    flexDirection: 'row',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: AppStyle.Color.LIGHT_GRAY,
    // borderBottomWidth: 1,
    //borderBottomColor: AppStyle.Color.bgG,
  },
  cell: {
    height: ROW_HEIGHT,
    backgroundColor: 'transparent',
    paddingHorizontal: scaleSize(4),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  selectedCell: {
    flexDirection: 'row',
    height: ROW_HEIGHT,
    backgroundColor: AppStyle.Color.BLUE,
    paddingHorizontal: scaleSize(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexCell: {
    height: ROW_HEIGHT,
    backgroundColor: AppStyle.Color.LIGHT_GRAY,
    paddingHorizontal: scaleSize(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    color: AppStyle.Color.Text_Dark,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  selectedCellText: {
    color: AppStyle.Color.WHITE,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  indexCellText: {
    color: AppStyle.Color.WHITE,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
})

interface RowDataType {
  index: number,
  name: string,
  data: any,
  value: string | number | boolean,
  fieldInfo: FieldInfoValue,
  isSystemField: boolean,
}

interface Props {
  data: RowDataType[] | RowDataType,
  index: number,
  dismissIndexes?: number[], // 隐藏的元素
  buttonIndexes?: number[], // Cell 为button的列的index
  buttonActions?: ((data?: any) => void)[], // Cell 为button的列的点击事件
  buttonTitles?: string[], // Cell 为button列对应的title, buttonTitles必须不为空，buttonIndexes才生效
  selected?: boolean,
  hasInputText?: boolean,
  hasChecked?: boolean, // 表格是否有多选按钮
  renderCell?: (data: { item: any, index: number }) => React.ReactNode,
  style?: StyleProp<ViewStyle>,
  cellStyle?: StyleProp<ViewStyle>,
  disableCellStyle?: StyleProp<ViewStyle>, // 不可编辑Cell的样式
  cellTextStyle?: StyleProp<TextStyle>,
  selectedCellStyle?: StyleProp<ViewStyle>, // 被选中行的样式
  selectedCellTextStyle?: StyleProp<TextStyle>, // 被选中行字体的样式
  cellWidthArr?: number[], // cell的宽度数组
  indexColumn?: number, // 每一行index所在的列，indexColumn >= 0 则所在列为Text
  indexCellStyle?: any, // 每一行index所在的列，indexColumn >= 0 则所在列样式
  indexCellTextStyle?: any, // 每一行index所在的列，indexColumn >= 0 则所在列文字样式
  onPress?: (data: {
    data: any,
    index: number,
    columnIndex: number,
    pressView: TouchableOpacity | null,
  }) => void,
  onFocus?: (params: GestureResponderEvent) => void,
  separatorColor?: string,
  onChangeEnd?: (data: {
    rowData: any,
    index: number,
    columnIndex: number,
    cellData: any,
    value: string,
  }) => void,
  onChecked?: (selected: string) => void,
  isShowSystemFields?: boolean,
}

interface State {
  selected: string[],
}

export default class Row extends Component<Props, State> {

  static defaultProps = {
    separatorColor: AppStyle.Color.GRAY,
    indexColumn: -1,
    hasInputText: true,
    isShowSystemFields: true,
    selected: false,
    hasChecked: false,
    dismissIndexes: [],
    buttonIndexes: [],
    buttonActions: [],
    buttonTitles: [],
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      selected: [],
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (
      JSON.stringify(this.state) !== JSON.stringify(nextState) ||
      this.props.isShowSystemFields !== nextProps.isShowSystemFields ||
      JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data) ||
      this.props.selected !== nextProps.selected
    ) {
      return true
    }
    return false
  }

  _onFocus = (evt: GestureResponderEvent) => {
    this.props.onFocus && this.props.onFocus(evt)
  }
  _action = (iTemView: TouchableOpacity | null, columnIndex: number) => {
    if (this.props.onPress && typeof this.props.onPress === 'function') {
      return this.props.onPress({
        data: this.props.data,
        index: this.props.index,
        columnIndex: columnIndex,
        pressView: iTemView,
      })
    }
  }

  _isSystomField = (fieldInfo: FieldInfoValue | RowDataType) => {
    return fieldInfo?.isSystemField || fieldInfo?.name?.toUpperCase().indexOf('SS_') === 0 || fieldInfo?.name?.toUpperCase().indexOf('SM') === 0
    || fieldInfo?.name?.toUpperCase().indexOf('AR_') === 0
  }

  changeEnd = (data: CellData) => {
    if (
      this.props.onChangeEnd &&
      typeof this.props.onChangeEnd === 'function'
    ) {
      this.props.onChangeEnd({
        rowData: this.props.data,
        index: this.props.index,
        columnIndex: data.index,
        cellData: data.data,
        value: data.value + '',
      })
    }
  }

  onChecked = (value: string) => {
    const _selected = new Set(this.state.selected)
    if (_selected.has(value)) {
      _selected.delete(value)
    } else {
      _selected.add(value)
    }
    this.setState({
      selected: Array.from(_selected),
    }, () => {
      if (
        this.props.onChecked &&
        typeof this.props.onChecked === 'function'
      ) {
        this.props.onChecked(value)
      }
    })
  }

  _renderCheck = (value: string) => {
    const icon = this.state.selected.includes(value)
      ? getImage().icon_check
      : getImage().icon_uncheck
    return (
      <TouchableOpacity
        onPress={() => this.onChecked(value)}
      >
        <Image
          style={AppStyle.Image_Style}
          source={icon}
        />
      </TouchableOpacity>
    )
  }

  _renderCell = (item: any, index: number): React.ReactNode => {
    let isButton = false, // 属性表cell显示 查看 按钮
      buttonTitle = '',
      buttonAction: (arg0: { data: any; index: number; columnIndex: number }) => void
    if (
      this.props.buttonTitles && this.props.buttonActions &&
      this.props.buttonTitles.length === this.props.buttonIndexes?.length &&
      this.props.buttonIndexes.indexOf(index) >= 0 &&
      this.props.buttonTitles.length > 0
    ) {
      isButton = true
      buttonTitle = this.props.buttonTitles[index] || this.props.buttonTitles[0]
      buttonAction =
        this.props.buttonActions[index] || this.props.buttonActions[0]
    }

    let width
    if (this.props.cellWidthArr && this.props.cellWidthArr.length > index) {
      width = this.props.cellWidthArr[index]
    } else if (this.props.data instanceof Array && this.props.data.length > 4) {
      width = CELL_WIDTH
    }
    if (this.props.renderCell && typeof this.props.renderCell === 'function') {
      return this.props.renderCell({ item, index })
    }
    const isSingleData = item === null || item === undefined || item.fieldInfo === undefined
    const value = item instanceof Object ? item.value : item
    let editable, isRequired, defaultValue
    if (isSingleData && !(this.props.data instanceof Array)) {
      // 单个属性，第一列为名称
      if (index === 0) {
        editable = false
      } else {
        const isHead = this.props.data.fieldInfo === undefined
        editable = !isHead && !this._isSystomField(this.props.data.fieldInfo)
        isRequired = !isHead && this.props.data.fieldInfo.isRequired
        defaultValue =
          !isHead && this.props.data.fieldInfo.defaultValue !== undefined
            ? this.props.data.fieldInfo.defaultValue
            : ''
      }
    } else {
      editable = item.fieldInfo && !this._isSystomField(item.fieldInfo)
      isRequired = item.fieldInfo && item.fieldInfo.isRequired
      defaultValue =
        item.fieldInfo && item.fieldInfo.defaultValue !== undefined
          ? item.fieldInfo.defaultValue
          : ''
    }

    let cellStyle = [
        styles.cell,
        this.props.cellStyle || {},
        !editable ? this.props.disableCellStyle : {},
      ],
      textStyle = [styles.cellText, this.props.cellTextStyle || {}]
    if (this.props.selected) {
      cellStyle = [styles.selectedCell, this.props.selectedCellStyle || {}]
      textStyle = [styles.selectedCellText, this.props.selectedCellTextStyle || {}]
    }
    let isLastCell = false
    if (this.props.data instanceof Array) {
      isLastCell = (this.props.data.length - 1) === index
    } else {
      isLastCell = index === 1
    }
    const borderStyle = {
      // borderLeftWidth: index === 0 ? 1 : 0,
      borderRightWidth: isLastCell ? 0 : 1,
      borderBottomWidth: 1,
      borderColor: this.props.separatorColor,
      // overflow: 'hidden',
    }
    if (isButton) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          key={index}
          style={[
            width ? { width } : { flex: 1 },
            borderStyle,
            cellStyle,
            // { width },
          ]}
          onPress={() =>
            buttonAction({
              data: this.props.data,
              index: this.props.index,
              columnIndex: index,
            })
          }
        >
          <Text
            style={[
              textStyle,
              width ? { width: width - 4 } : {},
              { color: AppStyle.Color.BLUE },
            ]}
          >
            {buttonTitle}
          </Text>
        </TouchableOpacity>
      )
    } else if (
      (this.props.indexColumn !== undefined && this.props.indexColumn >= 0 && this.props.indexColumn === index) ||
      !this.props.hasInputText
    ) {
      if (!this.props.selected) {
        if (this.props.indexCellStyle) {
          cellStyle = [styles.cell, this.props.indexCellStyle]
        }
        if (this.props.indexCellTextStyle) {
          textStyle = [styles.cellText, this.props.indexCellTextStyle]
        }
      }
      let iTemView: TouchableOpacity | null
      const hasChecked = this.props.hasChecked && (isSingleData && index !== 1 || !isSingleData && this.props.indexColumn !== index) && item.value !== getLanguage().ATTRIBUTE_NO
      return (
        <TouchableOpacity
          ref={ref => (iTemView = ref)}
          activeOpacity={1}
          key={index}
          style={[
            width ? { width } : { flex: 1 },
            borderStyle,
            cellStyle,
            // {backgroundColor: 'ywllow'}
            // { width },
          ]}
          onPress={() => this._action(iTemView, index)}
        >
          <View style={{flex: 1}}>
            <Text style={[textStyle, width ? { width: width - 4 - (hasChecked ? dp(25) : 0) } : {}]}>
              {value + ''}
            </Text>
          </View>
          {hasChecked && this._renderCheck(value)}
        </TouchableOpacity>
      )
    } else {
      return (
        <Cell
          key={index}
          index={index}
          style={[
            !editable ? { backgroundColor: AppStyle.Color.Background_Container } : {},
            cellStyle,
            this.props.cellStyle || {},
            width ? { width } : { flex: 1 },
            borderStyle,
            // { width },
          ]}
          cellTextStyle={[
            textStyle,
            this.props.selected ? styles.selectedCellText : {},
          ]}
          value={value}
          data={this.props.data instanceof Array ? item : this.props.data}
          editable={editable}
          isRequired={isRequired}
          defaultValue={defaultValue}
          keyboardType={typeof value === 'number' ? 'decimal-pad' : 'default'}
          changeEnd={this.changeEnd}
          onPress={() => this._action(null, index)}
          onFocus={this._onFocus}
        />
      )
    }
  }

  _renderCells = () => {
    if (this.props.data instanceof Array && this.props.data.length <= 0 || !this.props.data) return <View />
    const cells: React.ReactNode[] = []
    if (this.props.data instanceof Array) {
      this.props.data.forEach((item, index) => {
        if (
          this.props.dismissIndexes &&
          this.props.dismissIndexes.indexOf(index) < 0 && (
            this.props.isShowSystemFields ||
            typeof item === 'string' ||
            typeof item === 'number' ||
            (
              item.fieldInfo ? !this._isSystomField(item.fieldInfo) : (
                item.isSystemField !== undefined && !this._isSystomField(item)
              )
            )
            // (item.fieldInfo && !this._isSystomField(item.fieldInfo)) ||
            // (item.isSystemField !== undefined && !this._isSystomField(item))
          )
        ) {
          cells.push(this._renderCell(item, index))
        }
      })
    } else if (this.props.data instanceof Object) {
      if (
        this.props.isShowSystemFields ||
        !this._isSystomField(this.props.data.fieldInfo)
      ) {
        cells.push(this._renderCell(this.props.data['name'], 0))
        cells.push(this._renderCell(this.props.data['value'], 1))
      }
    }
    return <>{cells}</>
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.rowContainer, this.props.style]}
      >
        {this._renderCells()}
      </TouchableOpacity>
    )
  }
}
