import React, { Component } from 'react'
import { TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Container } from '../../../../components'
import { color, size } from '../../../../styles'
import { Toast, scaleSize, dataUtil } from '../../../../utils'
import { getLanguage } from '../../../../language'

export default class AddOnlineScense extends Component {
  props: {
    navigation: Object,
  }
  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.cb = params.cb

    this.state = {
      server: '',
      name: '',
    }
  }

  save = () => {
    // if (this.state.name === '') {
    //   Toast.show(getLanguage(global.language).Prompt.PLEASE_ENTER + getLanguage(global.language).Map_Setting.SCENE_NAME)
    //   return
    // }
    if (this.state.server === '') {
      Toast.show(getLanguage(global.language).Prompt.ENTER_SERVICE_ADDRESS)
      return
    }

    let _server = this.state.server
    if (_server.indexOf('http') !== 0) {
      _server = 'http://' + _server
    }

    let checkURL = dataUtil.isLegalURL(_server)
    if (!checkURL.result) {
      Toast.show(checkURL.error)
      return
    }

    let data = {}
    if (this.getServerAndName(_server, data)) {
      this.cb && this.cb(data)
    } else {
      Toast.show(
        getLanguage(global.language).Profile.ENTER_VALID_SERVER_ADDRESS,
      )
    }
  }

  getServerAndName = (url, data) => {
    let pat1 = /(.+\/rest\/realspace)\/scenes\/(.+)/
    if (pat1.test(url)) {
      let resutl = url.match(pat1)
      let server = resutl[1]
      let name = resutl[2]
      let pat2 = /(.+)\.openrealspace$/
      if (pat2.test(name)) {
        name = name.match(pat2)[1]
      }
      data.server = server
      data.name = name
      return true
    }
    return false
  }

  _renderHeaderBtn = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.save()
        }}
      >
        <Text style={[styles.text, { color: color.black1 }]}>
          {getLanguage(global.language).Profile.SAVE}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Profile.SERVICE_ADDRESS,
          //'服务地址',
          navigation: this.props.navigation,
          headerRight: this._renderHeaderBtn(),
        }}
      >
        {/* <TextInput
          value={this.state.name}
          placeholder={getLanguage(global.language).Map_Setting.SCENE_NAME}
          placeholderTextColor={color.fontColorGray}
          style={styles.textInput}
          ref={ref => (this.name = ref)}
          //   onChangeText={text => this.setState({ name: text })}
          onChangeText={text => {
            this.setState({
              name: text,
            })
          }}
        /> */}
        <TextInput
          value={this.state.server}
          placeholder={
            getLanguage(global.language).Profile.ENTER_SERVICE_ADDRESS
          }
          placeholderTextColor={color.fontColorGray}
          style={[styles.textInput, { marginTop: 20 }]}
          ref={ref => (this.server = ref)}
          onChangeText={text => {
            this.setState({
              server: text,
            })
          }}
        />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  textInput: {
    fontSize: size.fontSize.fontSizeMd,
    margin: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: color.fontColorGray,
  },
  text: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.reverseTheme,
  },
  itemView: {
    height: scaleSize(60),
    marginLeft: scaleSize(15),
    flexDirection: 'row',
  },
  image: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
  textRadio: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.black,
    marginLeft: scaleSize(20),
  },
  titleView: {
    height: scaleSize(60),
    justifyContent: 'center',
  },
  title: {
    fontSize: scaleSize(24),
    marginLeft: scaleSize(30),
    color: color.gray,
  },
  lineStyle: {
    width: '100%',
    height: 1,
    marginRight: scaleSize(20),
    backgroundColor: color.background,
  },
})
