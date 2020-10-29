import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Animated } from 'react-native'
import { getLanguage } from '../../../../language/index'
import { scaleSize } from '../../../../utils'
import NavigationService from '../../../NavigationService'
import { connect } from 'react-redux'

class NewMessageIcon extends Component {
  props: {
    language: String,
    navigation: Object,
    newMessage: Number,
  }

  constructor(props) {
    super(props)
    this.left = new Animated.Value(scaleSize(10))
    this.visible = true
  }

  setVisible = visible => {
    if (visible !== this.visible) {
      Animated.timing(this.left, {
        toValue: visible ? scaleSize(10) : -500,
        duration: 300,
      }).start()
      this.visible = visible
    }
  }

  render() {
    let number = this.props.newMessage
    if (number > 99) {
      number = '99+'
    }
    return (
      <Animated.View
        style={{
          position: 'absolute',
          left: this.left,
          top: scaleSize(140),
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: '#4680DF',
            height: scaleSize(50),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: scaleSize(10),
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
            <Text style={{ color: 'white' }}>
              {`${
                getLanguage(global.language).Friends.NEW_MESSAGE_SHORT
              }(${number})`}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }
}

const mapStateToProps = state => ({
  newMessage: state.chat.toJS().coworkNewMessage,
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
