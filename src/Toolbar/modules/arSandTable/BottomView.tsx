import React from 'react'
import { ModuleViewProps } from '../..'
import SandTableAlignView from './component/SandTableAlignView'
import SandTableModelList from './component/SandTableModelList'

export interface ARSAndTableViewOption {
  showDelete: boolean
  sandTable: 'null' | 'align' | 'modelList'
}

type Props = ModuleViewProps<ARSAndTableViewOption>

class BottomView extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }



  //沙盘相关自定义view
  renderSandTable = () => {
    return (
      <>
        <SandTableAlignView
          visible={this.props.data?.sandTable === 'align'}
        />
        <SandTableModelList
          visible={this.props.data?.sandTable === 'modelList'}
          windowSize={this.props.windowSize}
        />
      </>
    )
  }

  render() {
    return(
      <>
        {this.renderSandTable()}
      </>
    )
  }
}

export default BottomView