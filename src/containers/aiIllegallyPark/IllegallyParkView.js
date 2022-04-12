import * as React from 'react'
import { Platform, InteractionManager,AppState, } from 'react-native'
import NavigationService from '../../containers/NavigationService'
import Orientation from 'react-native-orientation'
import { Container } from '../../components'
import { getLanguage } from '../../language'
import {
  SMap,
  SMediaCollector,
  SMIllegallyParkView,
  SIllegallyParkView,
} from 'imobile_for_reactnative'
import { ConstPath } from '../../constants'
import { FileTools } from '../../native'
import { Toast } from '../../utils'

/*
 * 违章采集界面
 */
export default class IllegallyParkView extends React.Component {
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
      mediaName: params.mediaName || '',
    }
    AppState.addEventListener('change', this.handleStateChange)
  }

  handleStateChange = async appState => {
    if (Platform.OS === 'android') {
        if(appState === 'background'){
          SIllegallyParkView.onPause()
      }

      if (appState === 'active') {
        SIllegallyParkView.onResume()
      }
    }
  }

  // eslint-disable-next-line
  componentWillMount() {
    SMap.setDynamicviewsetVisible(false)
    Orientation.lockToPortrait()
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      // 初始化数据
      (async function() {}.bind(this)())
    })

    {
      (async function() {
        let targetPath = await FileTools.appendingHomeDirectory(
          ConstPath.UserPath +
            this.props.user.currentUser.userName +
            '/' +
            ConstPath.RelativeFilePath.Media,
        )
        SMediaCollector.initMediaCollector(targetPath)
      }.bind(this)())
    }

    if (Platform.OS === 'ios') {
      SIllegallyParkView.setIllegallyParkListener({
        callback: async result => {
          let mediaPaths = [result]
          let add = await SMediaCollector.addMedia({
            datasourceName: this.datasourceAlias,
            datasetName: this.datasetName,
            mediaPaths,
          })
          if (add) {
            Toast.show(getLanguage(this.props.language).Prompt.COLLECT_SUCCESS)
          }
        },
      })
    } else {
      SMap.setIllegallyParkListener({
        callback: async result => {
          let mediaPaths = [result]
          let add = await SMediaCollector.addMedia({
            datasourceName: this.datasourceAlias,
            datasetName: this.datasetName,
            mediaPaths,
          })
          if (add) {
            Toast.show(getLanguage(this.props.language).Prompt.COLLECT_SUCCESS)
          }
        },
      })
    }
  }

  componentWillUnmount() {
    SMap.setDynamicviewsetVisible(true)
    Orientation.unlockAllOrientations()
    AppState.removeEventListener('change', this.handleStateChange)
    //移除监听
  }

  back = () => {
    NavigationService.goBack('IllegallyParkView')

    global.toolBox && global.toolBox.removeAIDetect(false)
    global.toolBox.switchAr()
    return true
  }

  save = async () => {}

  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        headerProps={{
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_VIOLATION_COLLECT,
          navigation: this.props.navigation,
          backAction: this.back,
          type: 'fix',
        }}
        bottomProps={{ type: 'fix' }}
      >
        <SMIllegallyParkView
          ref={ref => (this.SMIllegallyParkView = ref)}
          language={this.props.language}
        />
      </Container>
    )
  }
}
