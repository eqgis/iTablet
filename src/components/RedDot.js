/**
 * Created by ysl 2021/1/28.
 */

import React, { PureComponent } from 'react'
import { scaleSize } from '../utils'
import { View } from 'react-native'
export default class ReadDot extends PureComponent {
  props: {
    style: any,
  }

  render() {
    return (
      <View
        style={[
          {
            position: 'absolute',
            backgroundColor: 'red',
            justifyContent: 'center',
            height: scaleSize(15),
            width: scaleSize(15),
            borderRadius: scaleSize(25),
            top: scaleSize(0),
            right: scaleSize(0),
          },
          this.props.style,
        ]}
      />
    )
  }
}
