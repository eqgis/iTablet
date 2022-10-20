import React from 'react'
import { ModuleViewProps } from '@/Toolbar'
import Home from './views/Home'
import PresentationView from './views/PresentationView'
import ScanView from './views/ScanView'
import CoverView from './views/CoverView'
import SuperMapBuilding from './views/SuperMapBuilding'
import FlatMapView from './views/FlatMapView'

export interface ExhibitionViewOption {
  page: 'home' //首页
  | 'show' // 地图集模块
  | 'scan' // AR识别模块
  | 'infra' // 隐蔽设置，室内管线模块
  | 'dr_supermap' // 超超博士
  | 'supermap_building' //超图大厦
  | 'ar_3d_map' // 立体地图
  | 'flat' // 平面地图模块
}

type Props = ModuleViewProps<ExhibitionViewOption>

class ExhibitionView extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  renderHome = () => {
    return <Home windowSize={this.props.windowSize} />
  }

  renderScan = () => {
    return <ScanView windowSize={this.props.windowSize} />
  }

  renderPresentation = () => {
    return <PresentationView windowSize={this.props.windowSize}/>
  }

  renderInfa = () => {
    return <CoverView windowSize={this.props.windowSize}/>
  }

  renderFlatMap = () => {
    return <FlatMapView windowSize={this.props.windowSize}/>
  }

  render3DMap = () => {
    return null
  }

  renderDrSuperMap = () => {
    return null
  }

  renderSuerMapBuilding = () => {
    return <SuperMapBuilding windowSize={this.props.windowSize}/>
    // return null
  }

  render() {
    return(
      <>
        {this.props.data?.page === 'home' && this.renderHome()}
        {this.props.data?.page === 'scan' && this.renderScan()}
        {this.props.data?.page === 'show' && this.renderPresentation()}
        {this.props.data?.page === 'infra' && this.renderInfa()}
        {this.props.data?.page === 'flat' && this.renderFlatMap()}
        {this.props.data?.page === 'dr_supermap' && this.renderDrSuperMap()}
        {this.props.data?.page === 'supermap_building' && this.renderSuerMapBuilding()}
        {this.props.data?.page === 'ar_3d_map' && this.render3DMap()}
      </>
    )
  }
}

export default ExhibitionView

