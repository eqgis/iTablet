import * as React from 'react'
import { SARWeather, SMARWeatherView, SMap } from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import { Container } from '../../components'
import { scaleSize } from '../../utils'
import { View, TouchableOpacity, Image } from 'react-native'
import { getThemeAssets, getPublicAssets } from '../../assets'
import NavigationService from '../NavigationService'
import { getLanguage } from '../../language'
import { FileTools } from '../../native'

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
    this.state = {
      current: '',
      visible: true,
    }
  }

  // eslint-disable-next-line
  componentWillMount() {
    SMap.setDynamicviewsetVisible(false)
    Orientation.lockToPortrait()
  }

  componentDidMount() {
    setTimeout(this.showDefault, 500)
  }

  componentWillUnmount() {}

  setCurrent = key => {
    this.setState({
      current: key,
    })
  }

  setVisible = () => {
    let visible = !this.state.visible
    SARWeather.showWeather(visible)
    this.setState({
      visible: visible,
    })
  }

  showDefault = async () => {
    let path = global.homePath + '/iTablet/Common/Weather/winter.mp4'
    if (await FileTools.fileIsExist(path)) {
      SARWeather.setWeather(path)
      this.setCurrent('winter')
    }
  }

  back = () => {
    NavigationService.goBack()
    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(false)
    GLOBAL.toolBox.switchAr()
  }

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
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: scaleSize(40),
        }}
      >
        {this.state.current !== '' && (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: scaleSize(80),
            }}
            onPress={() => {
              this.setVisible()
            }}
          >
            <Image
              source={
                this.state.visible
                  ? getPublicAssets().mapTools.tools_legend_off
                  : getPublicAssets().mapTools.tools_legend_on
              }
              style={{ width: scaleSize(60), height: scaleSize(60) }}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: scaleSize(80),
          }}
          onPress={() => {
            NavigationService.navigate('ChooseWeather', {
              currentItemKey: this.state.current,
              onSelectCallback: key => this.setCurrent(key),
            })
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
          title: getLanguage(global.language).Map_Main_Menu.MAP_AR_EFFECT,
          navigation: this.props.navigation,
          backAction: this.back,
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
