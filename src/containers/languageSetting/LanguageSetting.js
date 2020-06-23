import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native'
import Container from '../../components/Container'
import { scaleSize } from '../../utils'
import NavigationService from '../NavigationService'
import { getLanguage } from '../../language'

const radio_on = require('../../assets/public/radio_select.png')
const radio_off = require('../../assets/public/radio_select_no.png')
const option = {
  auto: 'AUTO',
  CN: 'CN',
  EN: 'EN',
  TR: 'TR',
  JA: 'JA',
  FR: 'FR',
  AR: 'AR',
}

class LanguageSetting extends React.Component {
  props: {
    navigation: Object,
    language: String,
    autoLanguage: Boolean,
    setLanguage: () => {},
    appConfig: Object,
  }

  constructor(props) {
    super(props)
    this.prevOption = this.props.autoLanguage
      ? option.auto
      : this.props.language
    this.state = {
      currentOption: this.prevOption,
    }
  }

  getData = () => {
    let data = [
      {
        key: option.CN,
        title: '中文',
      },
      {
        key: option.EN,
        title: 'English',
      },
      {
        key: option.FR,
        title: 'Français',
      },
      {
        key: option.TR,
        title: 'Türkçe',
      },
      {
        key: option.AR,
        title: 'العربية',
      },
      {
        key: option.JA,
        title: '日本語',
      },
    ]
    let supportedLanguage = this.props.appConfig.supportLanguage
    if (!supportedLanguage) supportedLanguage = []
    const allSupportLanguage = data.map(item => {
      return item.key
    })
    supportedLanguage = supportedLanguage.filter(item => {
      return allSupportLanguage.indexOf(item) > -1
    })
    data = data.filter(value => {
      return (
        supportedLanguage.length === 0 ||
        supportedLanguage.indexOf(value.key) > -1
      )
    })
    data.unshift({
      key: option.auto,
      title: getLanguage(this.props.language).Profile.SETTING_LANGUAGE_AUTO,
    })
    return data
  }

  changeLanguage = async () => {
    let currentOption = this.state.currentOption
    if (currentOption !== this.prevOption) {
      this.props.setLanguage(currentOption)
    }
    NavigationService.goBack()
  }

  renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.itemView}
          activeOpacity={0.9}
          onPress={() => {
            this.setState({ currentOption: item.key })
          }}
        >
          <Text style={styles.text}>{item.title}</Text>
          <Image
            style={styles.image}
            source={
              this.state.currentOption === item.key ? radio_on : radio_off
            }
          />
        </TouchableOpacity>
        {this.renderSeperator()}
      </View>
    )
  }

  renderList = () => {
    let data = this.getData()
    return (
      <View style={{ flexDirection: 'column' }}>
        <FlatList data={data} renderItem={this.renderItem} />
      </View>
    )
  }

  renderSeperator = () => {
    return <View style={styles.seperator} />
  }

  renderRight = () => {
    let textColor
    if (this.state.currentOption === this.prevOption) {
      textColor = '#A0A0A0'
    } else {
      textColor = '#FFFFFF'
    }
    return (
      <View>
        <TouchableOpacity
          disabled={this.state.currentOption === this.prevOption}
          onPress={this.changeLanguage}
        >
          <Text style={[styles.headerRightText, { color: textColor }]}>
            {getLanguage(this.props.language).Profile.SAVE}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(this.props.language).Profile.SETTING_LANGUAGE,
          withoutBack: false,
          navigation: this.props.navigation,
          headerRight: this.renderRight(),
        }}
      >
        {this.renderList()}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(20),
    marginVertical: scaleSize(10),
  },
  text: {
    fontSize: scaleSize(26),
  },
  image: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
  seperator: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  headerRightText: {
    fontSize: scaleSize(26),
  },
})
export default LanguageSetting
