import * as React from 'react'
import { SARWeather, SMARWeatherView, SMap } from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import { Container } from '../../components'
import { scaleSize, screen } from '../../utils'
import { View, TouchableOpacity, Image } from 'react-native'
import { getThemeAssets } from '../../assets'
import { color } from '../../styles'
import NavigationService from '../NavigationService'
import { getLanguage } from '../../language'
import { FileTools } from '../../native'
import { NavigationScreenProp } from 'react-navigation'

interface IProps {
  navigation: NavigationScreenProp<{}>
}

interface IState {
  /** 当前使用特效文件名（不含扩展名） */
  current: string,
  /** 显示或隐藏特效 */
  visible: boolean,
}

export default class ARWeatherView extends React.Component<IProps, IState> {
  /** */
  clickAble: boolean

  constructor(props: IProps) {
    super(props)
    this.state = {
      current: '',
      visible: true,
    }
    this.clickAble = true // 防止重复点击
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

  /**
   * 设置当前使用的文件名（不含扩展名）
   * @param {string} key
   */
  setCurrent = (key: string) => {
    this.setState({
      current: key,
    })
  }

  /**
   * 设置显示或隐藏特效
   */
  setVisible = () => {
    let visible = !this.state.visible
    SARWeather.showWeather(visible)
    this.setState({
      visible: visible,
    })
  }

  /**
   * 进入页面默认显示一个特效（如果文件存在）
   */
  showDefault = async () => {
    let path = GLOBAL.homePath + '/iTablet/Common/Weather/Snow.mp4'
    if (await FileTools.fileIsExist(path)) {
      SARWeather.setWeather(path)
      this.setCurrent('Snow')
    }
  }

  /**
   * 返回事件
   */
  back = () => {
    if(this.clickAble){
      this.clickAble = false
      SARWeather.onDestroy()
      NavigationService.goBack()
      GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(false)
      GLOBAL.toolBox.switchAr()
    }
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
          backgroundColor: color.white,
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
              height: scaleSize(60),
              width: scaleSize(60),
            }}
            onPress={() => {
              this.setVisible()
            }}
          >
            <Image
              source={
                this.state.visible
                  ? getThemeAssets().toolbar.icon_toolbar_invisible
                  : getThemeAssets().toolbar.icon_toolbar_visible
              }
              style={{ width: scaleSize(45), height: scaleSize(45) }}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: scaleSize(60),
            width: scaleSize(60),
          }}
          onPress={() => {
            NavigationService.navigate('ChooseWeather', {
              currentItemKey: this.state.current,
              onSelectCallback: (key: string) => this.setCurrent(key),
            })
          }}
        >
          <Image
            source={getThemeAssets().toolbar.icon_toolbar_switch}
            style={{ width: scaleSize(45), height: scaleSize(45) }}
          />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_EFFECT,
          navigation: this.props.navigation,
          backAction: this.back,
          type: 'fix',
        }}
        bottomProps={{ type: 'fix' }}
      >
        <SMARWeatherView style={{ top: screen.getHeaderHeight() }} />
        {this.renderBottom()}
      </Container>
    )
  }
}
