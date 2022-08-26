import React from 'react'
import { ModuleViewProps } from '../..'
import { ARMapEditViewOption } from './ARMapEditView'
import AddElementAnimation from './component/AddElementAnimation'


type Props = ModuleViewProps<ARMapEditViewOption>


class ARMapEditBottom extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    return(
      <>
        <AddElementAnimation
          windowSize={this.props.windowSize}
          type={this.props.data?.addAnimationType || 'null'}
        />
      </>
    )
  }
}

export default ARMapEditBottom