import * as React from 'react'
import { SMARWeatherView } from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import { Container } from '../../components'
import { scaleSize } from '../../utils'
import { View, TouchableOpacity, Image } from 'react-native'
import { getThemeAssets } from '../../assets'
import NavigationService from '../NavigationService'

export default class ARWeatherView extends React.Component {
  props: {
    navigation: Object,
    language: String,
    user: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    let params = this.props.navigation.state.params || {}
    this.point = params.point
  }

  // eslint-disable-next-line
  componentWillMount() {
    Orientation.lockToPortrait()
  }

  componentDidMount() {}

  componentWillUnmount() {}

  renderBottom = () => {
    return (
      <View
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          height: scaleSize(80),
          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: scaleSize(80),
          }}
          onPress={() => {
            NavigationService.navigate('ChooseWeather')
          }}
        >
          <Image
            source={getThemeAssets().collection.icon_collection_change}
            style={{ width: scaleSize(60), height: scaleSize(60) }}
          />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        headerProps={{
          title: '天气特效',
          navigation: this.props.navigation,
          type: 'fix',
        }}
        bottomProps={{ type: 'fix' }}
      >
        <SMARWeatherView style={{ flex: 1 }} />
        {this.renderBottom()}
      </Container>
    )
  }
}
