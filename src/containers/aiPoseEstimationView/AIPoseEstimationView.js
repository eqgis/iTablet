import * as React from 'react'
import {
  SMAIPoseEstimationView,
  SPoseEstimationView,
} from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import { Container } from '../../components'
import { setSpText } from '../../utils'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  DeviceEventEmitter,
  Platform,
} from 'react-native'
// import { getPublicAssets } from '../../assets'
import { getLanguage } from '../../language'
import NavigationService from '../../containers/NavigationService'
import styles from './styles'
import { getThemeAssets, getPublicAssets } from '../../assets'

export default class AIPoseEstimationView extends React.Component {
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
      associationMap: false, //关联地图
      poseOverLook: false, //忽略姿态
      poseTitle: '', //姿态标题
    }
  }

  // eslint-disable-next-line
  componentWillMount() {
    Orientation.lockToPortrait()
  }

  componentDidMount() {
    //注册监听
    if (!(Platform.OS === 'ios')) {
      DeviceEventEmitter.addListener('onPoseChanged', this.onPoseChanged)
    }
  }

  componentWillUnmount() {
    //移除监听
    DeviceEventEmitter.removeListener('onPoseChanged', this.onPoseChanged)
  }

  onPoseChanged = info => {
    let title = null
    if (info.poseType === 'ZOOM') {
      title = getLanguage(global.language).Map_Main_Menu
        .MAP_AI_POSE_ESTIMATION_ZOOM
    } else if (info.poseType === 'PAN') {
      title = getLanguage(global.language).Map_Main_Menu
        .MAP_AI_POSE_ESTIMATION_PAN
    } else {
      title = ''
    }
    this.setState({
      poseTitle: title,
    })
    setTimeout(() => {
      this.setState({
        poseTitle: '',
      })
    }, 1000)
  }

  back = () => {
    NavigationService.goBack('AIPoseEstimationView')
    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(false)
    GLOBAL.toolBox.switchAr()
    return true
  }

  renderBottomBtns = () => {
    return (
      <View style={styles.toolbar}>
        <View style={styles.buttonView}>
          <TouchableOpacity
            onPress={() => {
              SPoseEstimationView.setAssociationMap(!this.state.associationMap)
              this.setState({
                associationMap: !this.state.associationMap,
              })
            }}
            style={styles.iconView}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                resizeMode={'contain'}
                source={getPublicAssets().mapTools.scene_tool_clip_out}
                style={styles.smallIcon}
              />

              <Text style={styles.buttonname}>
                {this.state.associationMap
                  ? getLanguage(global.language).Map_Main_Menu
                      .MAP_AI_POSE_ESTIMATION_ASSOCIATION_CANCEL
                  : getLanguage(global.language).Map_Main_Menu
                      .MAP_AI_POSE_ESTIMATION_ASSOCIATION}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              SPoseEstimationView.setPoseOverlook(!this.state.poseOverLook)
              this.setState({
                poseOverLook: !this.state.poseOverLook,
              })
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                resizeMode={'contain'}
                source={getPublicAssets().mapTools.tools_legend_off}
                style={styles.smallIcon}
              />
              <Text style={styles.buttonname}>
                {this.state.poseOverLook
                  ? getLanguage(global.language).Map_Main_Menu
                      .MAP_AI_POSE_ESTIMATION_LOOK
                  : getLanguage(global.language).Map_Main_Menu
                      .MAP_AI_POSE_ESTIMATION_OVERLOOK}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              SPoseEstimationView.switchCamera()
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                resizeMode={'contain'}
                source={getThemeAssets().ar.toolbar.icon_ar_toolbar_switch}
                style={styles.smallIcon}
              />
              <Text style={styles.buttonname}>
                {
                  getLanguage(global.language).Map_Main_Menu
                    .MAP_AI_POSE_ESTIMATION_SWITCH_CAMERA
                }
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderPoseTitle() {
    return (
      <View style={styles.titlePose}>
        <Text style={{ fontSize: setSpText(30), color: 'black' }}>
          {this.state.poseTitle}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        headerProps={{
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_AI_POSE_ESTIMATION,
          navigation: this.props.navigation,
          type: 'fix',
          backAction: this.back,
        }}
        bottomProps={{ type: 'fix' }}
      >
        <SMAIPoseEstimationView style={{ flex: 1 }} />
        {this.state.associationMap &&
          !this.state.poseOverLook &&
          this.renderPoseTitle()}
        {this.renderBottomBtns()}
      </Container>
    )
  }
}
