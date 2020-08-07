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
  FlatList,
} from 'react-native'
// import { getPublicAssets } from '../../assets'
import { getLanguage } from '../../language'
import NavigationService from '../../containers/NavigationService'
import styles from './styles'
import { getThemeAssets, getPublicAssets } from '../../assets'
import { color } from '../../styles'
import { scaleSize } from '../../utils'

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

      poseData: this.poseData,
      poseMode: 'MODE_PAN', //默认漫游姿态
      selectPoseMode: false, //是否是选择姿态模式
    }
  }

  // eslint-disable-next-line
  componentWillMount() {
    SMap.setDynamicviewsetVisible(false)
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
                // selectPoseMode: !this.state.selectPoseMode,
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

  poseData = [
    {
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AI_POSE_ESTIMATION_ZOOM,
      mode: 'MODE_ZOOM',
      index: 0,
    },
    {
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AI_POSE_ESTIMATION_PAN,
      mode: 'MODE_PAN',
      index: 1,
    },
    {
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AI_POSE_ESTIMATION_OVERLOOK,
      mode: 'MODE_OVERLOOK',
      index: 2,
    },
  ]
  onPressItem = item => {
    SPoseEstimationView.setOperMode(item.mode)
    this.setState({
      poseMode: item.mode,
    })
  }

  renderItem = ({ item }) => {
    return (
      <View style={styles.itemView}>
        <TouchableOpacity
          onPress={() => {
            this.onPressItem(item)
          }}
        >
          <Image
            style={styles.image}
            source={
              item.poseMode === this.state.poseMode
                ? getPublicAssets().common.icon_check
                : getPublicAssets().common.icon_uncheck
            }
          />
        </TouchableOpacity>
        <Text style={styles.text}>{item.title}</Text>
      </View>
    )
  }
  _keyExtractor = item => item.title + item.type

  _renderItemSeparatorComponent = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: color.gray5,
        }}
      />
    )
  }

  renderModelList = () => {
    return (
      <View
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: color.transOverlay,
            height: '60%',
          }}
          onPress={() => {
            this.setState({
              selectPoseMode: false,
            })
          }}
        />
        <View
          style={{
            backgroundColor: color.white,
            height: scaleSize(480),
          }}
        >
          <View style={styles.titleView}>
            <Text style={[styles.text, { color: color.white }]}>
              {
                getLanguage(global.language).Map_Main_Menu
                  .MAP_AI_POSE_ESTIMATION_LOOK
              }
            </Text>
          </View>

          <FlatList
            style={{
              height: '100%',
            }}
            data={this.state.poseData}
            renderItem={this.renderItem}
            keyExtractor={this._keyExtractor}
            ItemSeparatorComponent={this._renderItemSeparatorComponent}
          />
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={[styles.container, { backgroundColor: color.transView }]}>
        <View style={[styles.container, { backgroundColor: color.transView }]}>
          <View
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
            }}
          >
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
              {/* {this.renderBottomBtns()} */}
            </Container>
          </View>
          {this.state.selectPoseMode && this.renderModelList()}
        </View>
        {this.renderBottomBtns()}
      </View>
    )
  }
}
