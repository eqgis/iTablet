import * as React from 'react'
// import { InteractionManager } from 'react-native'
import NavigationService from '../../containers/NavigationService'
import { Container } from '../../components'
import { getLanguage } from '../../language'
import { screen } from '../../utils'
import {
  // SMediaCollector,
  SMCastModelOperateView,
  SMap,
  // SCastModelOperateView,
} from 'imobile_for_reactnative'
// import { ConstPath } from '../../constants'
// import { FileTools } from '../../native'

/*
 * AR投放界面
 */
export default class CastModelOperateView extends React.Component {
  props: {
    navigation: Object,
    language: String,
    user: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.route || {}
    this.datasourceAlias = params.datasourceAlias || ''
    this.datasetName = params.datasetName || ''

    this.state = {
      // mediaName: params.mediaName || '',
    }
  }

  // eslint-disable-next-line
  componentWillMount() {
    SMap.setDynamicviewsetVisible(false)
    screen.lockToPortrait()
  }

  back = () => {
    // SCastModelOperateView.onDestroy()
    NavigationService.goBack()
    return true
  }

  save = async () => {}

  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        headerProps={{
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_CAST_MODEL_OPERATE,
          navigation: this.props.navigation,
          backAction: this.back,
          type: 'fix',
        }}
        bottomProps={{ type: 'fix' }}
      >
        <SMCastModelOperateView
          ref={ref => (this.SMCastModelOperateView = ref)}
          language={this.props.language}
        />
      </Container>
    )
  }
}
