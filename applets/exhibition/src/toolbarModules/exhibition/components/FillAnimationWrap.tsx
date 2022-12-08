import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import AnimationWrap, { AnimationWrapProps } from './AnimationWrap'

interface Props extends AnimationWrapProps {
  onHide: () => void
}


class FillAnimationWrap extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    return(
      <>
        {this.props.visible && !this.props.hide &&(
          <TouchableOpacity
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'transparent'
            }}
            activeOpacity={1}
            onPress={() => {
              this.props.onHide()
            } }
          />
        )}

        <AnimationWrap {...this.props} />

      </>
    )
  }
}

export default FillAnimationWrap