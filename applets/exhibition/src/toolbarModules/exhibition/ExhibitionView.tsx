import React from 'react'
import { ModuleViewProps } from '@/Toolbar'
import Home from './components/Home'
import PresentationView from './components/PresentationView'
import ScanView from './components/ScanView'
import CoverView from './components/CoverView'

export interface ExhibitionViewOption {
  page: 'home' | 'show' | 'infrastructure' | 'scan' | 'infa'
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

  render() {
    return(
      <>
        {this.props.data?.page === 'home' && this.renderHome()}
        {this.props.data?.page === 'scan' && this.renderScan()}
        {this.props.data?.page === 'show' && this.renderPresentation()}
        {this.props.data?.page === 'infa' && this.renderInfa()}
      </>
    )
  }
}

export default ExhibitionView

