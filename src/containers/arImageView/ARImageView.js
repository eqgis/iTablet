import * as React from 'react'
import { SARImage, SMARImageView,SMap } from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import { Container, BottomBar } from '../../components'
import { getLanguage } from '../../language'
import MenuData from './MenuData'
import NavigationService from '../NavigationService'

export default class ARImageView extends React.Component {
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
    SMap.setDynamicviewsetVisible(false)
    Orientation.lockToPortrait()
  }

  componentDidMount() {
    setTimeout(async () => {
      if (this.point) {
        await SARImage.setPosition(this.point.x, this.point.y)
      }
    }, 1000)
  }

  componentWillUnmount() {}

  back = () => {
    NavigationService.goBack()
    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(false)
    GLOBAL.toolBox.switchAr()
  }

  renderBottom = () => {
    return <BottomBar getData={MenuData.getPage} />
  }

  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        headerProps={{
          title: getLanguage(global.language).Map_Main_Menu.MAP_AR_IMAGE,
          navigation: this.props.navigation,
          backAction: this.back,
          type: 'fix',
        }}
        bottomProps={{ type: 'fix' }}
      >
        <SMARImageView style={{ flex: 1 }} />
        {this.renderBottom()}
      </Container>
    )
  }
}
