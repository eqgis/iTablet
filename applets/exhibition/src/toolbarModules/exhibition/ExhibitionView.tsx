import { SARMap } from 'imobile_for_reactnative'
import React from 'react'
import { ModuleViewProps } from '@/Toolbar'
import { EmitterSubscription } from 'react-native'
import Scan from './components/Scan'
import Home from './components/Home'
import Presentation from './components/Presentation'


export interface ExhibitionViewOption {
  page: 'home' | 'show' | 'infrastructure' | 'scan'
}

type Props = ModuleViewProps<ExhibitionViewOption>

interface State {
  tracked: boolean
}

class ExhibitionView extends React.Component<Props, State> {

  imgListener: EmitterSubscription | null = null

  constructor(props: Props) {
    super(props)

    this.state = {
      tracked: false
    }
  }

  componentDidMount(): void {
    this.imgListener = SARMap.addImgTrackingStateChangeListener(state => {
      this.setState({
        tracked: state.tracked
      })
    })
  }

  componentWillUnmount(): void {
    this.imgListener?.remove()
  }

  renderHome = () => {
    return <Home windowSize={this.props.windowSize} />
  }

  renderScan = () => {
    return <Scan windowSize={this.props.windowSize} />
  }

  renderPresentation = () => {
    return <Presentation windowSize={this.props.windowSize}/>
  }

  render() {
    return(
      <>
        {this.props.data?.page === 'home' && this.renderHome()}
        {this.props.data?.page === 'scan' &&!this.state.tracked && this.renderScan()}
        {this.props.data?.page === 'show' && this.renderPresentation()}
      </>
    )
  }
}

export default ExhibitionView

