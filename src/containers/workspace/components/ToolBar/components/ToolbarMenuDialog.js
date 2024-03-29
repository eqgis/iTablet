import React from 'react'
import { MenuDialog } from '../../../../../components'
import ToolbarModule from '../modules/ToolbarModule'

export default class ToolbarMenuDialog extends React.Component {
  props: {
    type: string,
    themeType: string,
    language: string,
    selectKey: string,
    device: Object,
    mapLegend: Object,
    getToolbarModule: () => {},
  }

  static defaultProps = {
    getToolbarModule: () => ToolbarModule,
  }

  constructor(props) {
    super(props)
    this.ToolbarModule = this.props.getToolbarModule()
    this.state = {
      data: this.getData(),
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.type !== nextProps.type ||
      JSON.stringify(this.state.data) !== JSON.stringify(nextState.data) ||
      JSON.stringify(this.props.device) !== JSON.stringify(nextProps.device)
    ) {
      return true
    }
    return false
  }

  componentDidUpdate() {
    let data = this.getData()
    if (JSON.stringify(data) !== JSON.stringify(this.state.data)) {
      this.setState({
        data: data,
      })
    }
  }

  getData = () => {
    let list = this.ToolbarModule.getMenuDialogData(
      this.props.type,
      this.props.themeType,
    )
    return list
  }

  render() {
    return (
      <MenuDialog
        ref={ref => (this.menuDialog = ref)}
        data={this.state.data}
        selectKey={this.props.selectKey}
        autoSelect={true}
        device={this.props.device}
        onSelect={item => {
          this.setState({
            selectKey: item.selectKey || item.key,
            selectName: item.selectName || item.key,
          })
        }}
      />
    )
  }
}
