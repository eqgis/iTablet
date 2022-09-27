import React from 'react'
import { ScaledSize } from 'react-native'
import Scan from './Scan'

interface Props {
  windowSize: ScaledSize
}

interface State {

}

class Presentation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    return(
      <Scan windowSize={this.props.windowSize} auto color='red' />
    )
  }
}

export default Presentation