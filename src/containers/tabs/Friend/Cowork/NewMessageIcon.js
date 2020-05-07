import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
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
  }

  render() {
    let number = this.props.newMessage
    if (number > 99) {
      number = '99+'
    }
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          left: scaleSize(10),
          top: scaleSize(140),
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
)(NewMessageIcon)
