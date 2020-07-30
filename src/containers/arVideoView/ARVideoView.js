import * as React from 'react'
import { SMARVideoView, SARVideoView } from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import { Container, BottomBar } from '../../components'
import { getLanguage } from '../../language'
import MenuData from './MenuData'

export default class ARVideoView extends React.Component {
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

  componentDidMount() {
    setTimeout(async () => {
      if (this.point) {
        await SARVideoView.setPosition(this.point.x, this.point.y)
      }
    }, 1000)
  }

  componentWillUnmount() {}

  renderBottom = () => {
    return <BottomBar getData={MenuData.getPage} />
  }

  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        headerProps={{
          title: getLanguage(global.language).Map_Main_Menu.MAP_AR_VIDEO,
          navigation: this.props.navigation,
          type: 'fix',
        }}
        bottomProps={{ type: 'fix' }}
      >
        <SMARVideoView style={{ flex: 1 }} />
        {this.renderBottom()}
      </Container>
    )
  }
}
