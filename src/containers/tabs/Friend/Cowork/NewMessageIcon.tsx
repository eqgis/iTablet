import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Animated } from 'react-native'
import { getLanguage } from '../../../../language/index'
import { scaleSize } from '../../../../utils'
import { color, size } from '../../../../styles'
import NavigationService from '../../../NavigationService'
import { connect } from 'react-redux'

interface Props {
  language: string,
  navigation: any,
  newMessage: number,
  coworkInfo: any,
  currentTask: any,
  currentUser: any,
}

const DEFAULT_LEFT = scaleSize(0)
class NewMessageIcon extends Component<Props, {}> {

  left: Animated.Value
  visible: boolean

  constructor(props: Props) {
    super(props)
    this.left = new Animated.Value(scaleSize(DEFAULT_LEFT))
    this.visible = true
  }

  setVisible = (visible: boolean) => {
    if (visible !== this.visible) {
      Animated.timing(this.left, {
        toValue: visible ? scaleSize(DEFAULT_LEFT) : -500,
        duration: 300,
      }).start()
      this.visible = visible
    }
  }

  render() {
    let number = this.props.coworkInfo?.[this.props.currentUser.userName]?.[this.props.currentTask.groupID]?.[this.props.currentTask.id]?.unread || 0
    // let number = this.props.newMessage
    if (number > 99) {
      number = '99+'
    }
    return (
      <Animated.View
        style={{
          position: 'absolute',
          left: this.left,
          top: scaleSize(150),
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: color.contentColorGray,
            height: scaleSize(60),
            justifyContent: 'center',
            alignItems: 'center',
            borderTopRightRadius: scaleSize(30),
            borderBottomRightRadius: scaleSize(30),
          }}
          onPress={() => {
            NavigationService.navigate('CoworkMessage')
          }}
        >
          <View
            style={{
              paddingHorizontal: scaleSize(20),
            }}
          >
            <Text style={{ color: 'white', fontSize: size.fontSize.fontSizeLg }}>
              {`${
                getLanguage(GLOBAL.language).Friends.COWORK_MESSAGE
              }(${number})`}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }
}

const mapStateToProps = state => ({
  newMessage: state.cowork.toJS().coworkNewMessage,
  currentUser: state.user.toJS().currentUser,
  coworkInfo: state.cowork.toJS().coworkInfo,
  currentTask: state.cowork.toJS().currentTask,
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    forwardRef: true,
  },
)(NewMessageIcon)
