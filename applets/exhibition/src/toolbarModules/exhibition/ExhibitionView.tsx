import { SARMap } from 'imobile_for_reactnative'
import React from 'react'
import { ModuleViewProps } from '@/Toolbar'
import { EmitterSubscription } from 'react-native'
import Scan from './components/Scan'


export interface ExhibitionViewOption {
  tracked: boolean
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

  renderScan = () => {
    return <Scan windowSize={this.props.windowSize} />
  }

  render() {
    return(
      <>
        {!this.state.tracked && this.renderScan()}
      </>
    )
  }
}

export default ExhibitionView

