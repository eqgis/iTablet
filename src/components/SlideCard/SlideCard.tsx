import React from 'react'
import CustomModal from '../CustomModal'

interface Props extends Partial<DefaultProps> {
  visible: boolean
  onClose?(): void
}

interface DefaultProps {
  transparent: boolean
}

const defautlProps: DefaultProps = {
  transparent: false,
}

class SlideCard extends React.Component<Props & DefaultProps> {

  static defaultProps = defautlProps

  constructor(props: Props & DefaultProps) {
    super(props)
  }

  render() {
    return(
      <CustomModal
        visible={this.props.visible}
        transparent={this.props.transparent}
        animationType={'slide'}
        onBackPress={this.props.onClose}
      >
        {this.props.children}
      </CustomModal>
    )
  }
}

export default SlideCard
