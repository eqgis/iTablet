import React, { Component } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import { Container } from '../../../../components'
import { getLanguage } from '../../../../language/index'
import { scaleSize, Toast } from '../../../../utils'
import { getPublicAssets } from '../../../../assets'
import CoworkInfo from './CoworkInfo'
import { connect } from 'react-redux'

class CoworkMessage extends Component {
  props: {
    language: String,
    navigation: Object,
    newMessage: Number,
  }

  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      selected: [],
    }
  }

  componentDidMount() {
    this.getMessage()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.newMessage !== this.props.newMessage) {
      this.getMessage()
    }
  }

  getMessage = () => {
    try {
      if (global.coworkMode) {
        let messages = CoworkInfo.newMessages
        this.setState({ messages: messages })
      }
    } catch (error) {
      //
    }
  }

  selecteAll = () => {
    if (this.state.messages.length !== 0) {
      let selected = []
      if (this.state.messages.length !== this.state.selected.length) {
        for (let i = 0; i < this.state.messages.length; i++) {
          selected.push(i)
        }
      }
      this.setState({ selected })
    }
  }

  add = async () => {
    try {
      if (this.state.selected.length > 0) {
        Toast.show('todo')
      }
    } catch (error) {
      //
    }
  }

  update = async () => {
    try {
      if (this.state.selected.length > 0) {
        Toast.show('todo')
      }
    } catch (error) {
      //
    }
  }

  ignore = async () => {
    try {
      if (this.state.selected.length > 0) {
        Toast.show('todo')
      }
    } catch (error) {
      //
    }
  }

  renderButtoms = () => {
    return (
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: scaleSize(120),
          bottom: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          backgroundColor: 'rgba(240,240,240,1.0)',
        }}
      >
        <TouchableOpacity
          onPress={this.update}
          style={{
            backgroundColor: 'white',
            width: scaleSize(160),
            height: scaleSize(80),
            borderRadius: 2,
            borderWidth: 1,
            borderColor: '#4680DF',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: scaleSize(26), color: '#4680DF' }}>
            {getLanguage(global.language).Friends.COWORK_UPDATE}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.add}
          style={{
            backgroundColor: 'white',
            width: scaleSize(160),
            height: scaleSize(80),
            borderRadius: 2,
            borderWidth: 1,
            borderColor: '#4680DF',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: scaleSize(26), color: '#4680DF' }}>
            {getLanguage(global.language).Friends.COWORK_ADD}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.ignore}
          style={{
            backgroundColor: 'white',
            width: scaleSize(160),
            height: scaleSize(80),
            borderRadius: 2,
            borderWidth: 1,
            borderColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: scaleSize(26), color: 'red' }}>
            {getLanguage(global.language).Friends.COWORK_IGNORE}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderItem = ({ item, index }) => {
    let message = item
    let time = new Date(message.time).toLocaleString()
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          height: scaleSize(180),
          alignItems: 'center',
          marginBottom: scaleSize(20),
        }}
        onPress={() => {
          let selected = this.state.selected.clone()
          if (selected.includes(index)) {
            selected.splice(selected.indexOf(index), 1)
          } else {
            selected.push(index)
          }
          this.setState({ selected })
        }}
      >
        <Image
          source={
            this.state.selected.includes(index)
              ? getPublicAssets().common.icon_check
              : getPublicAssets().common.icon_uncheck
          }
          style={{ height: scaleSize(50), width: scaleSize(50) }}
        />
        <View style={{ flex: 1, marginHorizontal: scaleSize(20) }}>
          <View>
            <View>
              <Text>{message.user.name}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ flex: 1, fontSize: scaleSize(26) }}>
                {message.message.type}
              </Text>
              <Text style={{ fontSize: scaleSize(26), color: 'grey' }}>
                {'layer'}
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: scaleSize(26), color: 'grey' }}>{time}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderHeaderRight = () => {
    return (
      <TouchableOpacity onPress={this.selecteAll}>
        <Text style={{ fontSize: scaleSize(26), color: 'white' }}>
          {getLanguage(global.language).Profile.SELECT_ALL}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Container
        style={{ backgroundColor: 'rgba(240,240,240,1.0)' }}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Friends.NEW_MESSAGE,
          withoutBack: false,
          navigation: this.props.navigation,
          headerRight: this.renderHeaderRight(),
        }}
      >
        <FlatList
          style={{ marginBottom: scaleSize(120) }}
          data={this.state.messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderItem}
          extraData={this.state.selected}
        />
        {this.renderButtoms()}
      </Container>
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
)(CoworkMessage)
