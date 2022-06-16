import * as React from 'react'
import { SMARNavigationView, SARNavigationView,SMap  } from 'imobile_for_reactnative'
import { Container } from '../../components'
import { Toast, screen } from '../../utils'
import { SimpleDialog } from '../tabs/Friend'
import { getLanguage } from '../../language'

export default class ARNavigationView extends React.Component {
  props: {
    navigation: Object,
    language: String,
    user: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    let params = this.props.route.params || {}
    this.point = params.point
    this.floorID = params.floorID || ''
  }

  // eslint-disable-next-line
  componentWillMount() {
    SMap.setDynamicviewsetVisible(false)
    screen.lockToPortrait()
  }

  componentDidMount() {
    this.addListener()
    setTimeout(async () => {
      if (!this.point) {
        await SARNavigationView.getPosition()
        await SARNavigationView.getNavPath(0)
      } else {
        await SARNavigationView.setPosition(this.point.x, this.point.y)
        await SARNavigationView.getNavPath(1, this.floorID)
      }
    }, 1000)
  }

  componentWillUnmount() {
    SMap.setDynamicviewsetVisible(true)
    screen.unlockAllOrientations()
    SARNavigationView.removeListener()
  }

  addListener = () => {
    SARNavigationView.addListener({
      onDestination: () => {
        this.Dialog.set({
          text: getLanguage(global.language).Prompt.ARRIVE_DESTINATION,
        })
        this.Dialog.setVisible(true)
      },
      onDeviated: () => {
        Toast.show(getLanguage(global.language).Prompt.DEVIATE_NAV_PATH)
      },
    })
  }

  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        headerProps={{
          title: getLanguage(global.language).Prompt.AR_NAVIGATION,
          navigation: this.props.navigation,
          type: 'fix',
        }}
        bottomProps={{ type: 'fix' }}
      >
        <SMARNavigationView
          style={{ flex: 1 }}
          ref={ref => (this.SMARNavigationView = ref)}
        />
        <SimpleDialog ref={ref => (this.Dialog = ref)} />
      </Container>
    )
  }
}
