import React from 'react'
import { color } from '../../../../../styles'
import { scaleSize, setSpText } from '../../../../../utils'
import { ToolbarType } from '../../../../../constants'
import ToolbarModule from '../modules/ToolbarModule'
import { MTBtn, ColorBtn, TableList } from '../../../../../components'

export default class ToolbarTableList extends React.Component {
  props: {
    type: string,
    containerType: string,
    language: string,
    column?: number,
    row?: number,
    device: Object,
    data: Array,
    getMenuAlertDialogRef: () => {},
    getToolbarModule: () => {},
  }

  static defaultProps = {
    getToolbarModule: () => ToolbarModule,
  }

  itemAction = async item => {
    if (
      this.props.getToolbarModule().getData().actions &&
      this.props.getToolbarModule().getData().actions.tableAction
    ) {
      this.props
        .getToolbarModule()
        .getData()
        .actions.tableAction(this.props.type, item)
    } else if (item.action) {
      item.action(item)
    }
  }

  _renderColorItem = ({ item, rowIndex, cellIndex }) => {
    return (
      <ColorBtn
        key={rowIndex + '-' + cellIndex}
        background={item.background}
        onPress={() => {
          this.itemAction(item)
        }}
        device={this.props.device}
        numColumns={this.props.column}
      />
    )
  }

  _renderItem = ({ item, rowIndex, cellIndex }) => {
    // let column = this.props.column
    return (
      <MTBtn
        key={rowIndex + '-' + cellIndex}
        title={item.title}
        textColor={item.disable ? '#A0A0A0' : color.font_color_white}
        textStyle={{ fontSize: setSpText(20) }}
        size={MTBtn.Size.SMALL}
        image={item.image}
        background={item.background}
        onPressOut={() => {
          !item.disable && this.itemAction(item)
        }}
      />
    )
  }

  render() {
    return (
      <TableList
        style={{flex: 1}}
        data={this.props.data}
        column={this.props.column}
        numberOfRows={this.props.row}
        type={this.props.containerType}
        renderCell={
          this.props.containerType === '' ||
          this.props.containerType === ToolbarType.table ||
          this.props.containerType === ToolbarType.scrollTable ||
          this.props.containerType === ToolbarType.arMeasure
            ? this._renderItem
            : this._renderColorItem
        }
        device={this.props.device}
        cellStyle={
          {
            // flexDirection: 'row',
            // height: Height.TABLE_ROW_HEIGHT_4,
            // width:
            //   this.props.device.orientation.indexOf('LANDSCAPE') === 0
            //     ? Height.TABLE_ROW_HEIGHT_4
            //     : 100 / this.props.column + '%',
            // justifyContent: 'center',
            // alignItems: 'center',
          }
        }
      />
    )
  }
}
