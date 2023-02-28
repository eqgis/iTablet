import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { scaleSize } from '@/utils'
import { size, color } from '@/styles'

interface Props {
  language: string,
}

interface State {
  status: number,
}

export default class TourEditView extends React.Component<Props, State> {

  static defaultProps = {
    language: 'CN',
  }

  constructor (props: Props) {
    super(props)
    this.state = {
      status: 0,
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return nextState.status !== this.state.status || nextProps.language !== this.props.language
  }

  render() {
    return (
      <View
        style={{
          marginTop: 20,
          flexDirection: 'row',
          width: '70%',
          height: scaleSize(60),
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          borderRadius: 6,
          borderColor: color.itemColorBlack,
          borderWidth: 2,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this.setState({
              status: 0,
            })
          }}
          style={[
            {
              flex: 1,
              height: '100%',
              alignItems: 'center',
              borderTopLeftRadius: 1,
              borderBottomLeftRadius: 1,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              borderColor: color.borderColorBlack,
              justifyContent: 'center',
              backgroundColor: this.state.status === 0 ? color.itemColorBlack : color.itemColorWhite,
            },
          ]}
        >
          <Text style={{
            color: color.fontColorGray,
            fontSize: size.fontSize.fontSizeLg,
            textAlign: 'center',
          }}>
            {'按时间顺序'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.setState({
              status: 1,
            })
          }}
          style={{
            flex: 1,
            height: '100%',
            alignItems: 'center',
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: 1,
            borderBottomRightRadius: 1,
            borderColor: color.borderColorBlack,
            justifyContent: 'center',
            backgroundColor: this.state.status === 1 ? color.itemColorBlack : color.itemColorWhite,
          }}
        >
          <Text style={{
            color: color.fontColorGray,
            fontSize: size.fontSize.fontSizeLg,
            textAlign: 'center',
          }}>
            {'按添加顺序'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}
