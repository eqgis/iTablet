import * as React from 'react'
import {
  SMAIPoseEstimationView,
  SPoseEstimationView,
  SMap,
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
      poseOverLook: true, //忽略姿态
      poseTitle: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AI_POSE_ESTIMATION_PAN, //姿态标题

      poseData: this.poseData,
      poseMode: 'MODE_PAN', //默认漫游姿态
      selectPoseMode: false, //是否是选择姿态模式

      poseCallBackData: [],
    }
  }

  // eslint-disable-next-line
  componentWillMount() {
    SMap.setDynamicviewsetVisible(false)
    SPoseEstimationView.setOperMode(this.state.poseMode)
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
    // let title = null
    // if (info.poseType === 'ZOOM') {
    //   title = getLanguage(GLOBAL.language).Map_Main_Menu
    //     .MAP_AI_POSE_ESTIMATION_ZOOM
    // } else if (info.poseType === 'PAN') {
    //   title = getLanguage(GLOBAL.language).Map_Main_Menu
    //     .MAP_AI_POSE_ESTIMATION_PAN
    // } else {
    //   title = ''
    // }
    // this.setState({
    //   poseTitle: title,
    // })
    // setTimeout(() => {
    //   this.setState({
    //     poseTitle: '',
    //   })
    // }, 1000)

    let poseCallBack = info.poseType
    let _poseCallBackData = this.state.poseCallBackData

    let _poseTitle = this.getPoseSubTitle(poseCallBack)

    if (this.state.poseMode === 'MODE_ZOOM') {
      _poseCallBackData.push(
        getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AI_POSE_ESTIMATION_ZOOM +
          ':' +
          _poseTitle,
      )
    } else if (this.state.poseMode === 'MODE_PAN') {
      _poseCallBackData.push(
        getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AI_POSE_ESTIMATION_PAN +
          ':' +
          _poseTitle,
      )
    }
    if (_poseCallBackData.length > 5) {
      _poseCallBackData.shift()
    }
    this.setState({
      poseCallBackData: _poseCallBackData,
    })
  }

  getPoseSubTitle(subPoseTitle) {
    let arrStrs = subPoseTitle.split(',')
    let _poseTitle = ''
    switch (arrStrs[0]) {
      case 'up':
        _poseTitle = getLanguage(GLOBAL.language).Map_Main_Menu
          .MAP_AI_POSE_ESTIMATION_ASSOCIATION_UP
        break
      case 'down':
        _poseTitle = getLanguage(GLOBAL.language).Map_Main_Menu
          .MAP_AI_POSE_ESTIMATION_ASSOCIATION_DOWN
        break
      case 'left':
        _poseTitle = getLanguage(GLOBAL.language).Map_Main_Menu
          .MAP_AI_POSE_ESTIMATION_ASSOCIATION_LEFT
        break
      case 'right':
        _poseTitle = getLanguage(GLOBAL.language).Map_Main_Menu
          .MAP_AI_POSE_ESTIMATION_ASSOCIATION_RIGHT
        break
      case 'shrink':
        _poseTitle = getLanguage(GLOBAL.language).Map_Main_Menu
          .MAP_AI_POSE_ESTIMATION_ASSOCIATION_SHRINK
        break
      case 'magnify':
        _poseTitle = getLanguage(GLOBAL.language).Map_Main_Menu
          .MAP_AI_POSE_ESTIMATION_ASSOCIATION_MAGNIFY
        break
    }

    return _poseTitle + '->' + arrStrs[1]
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
                selectPoseMode: false,
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
                  ? getLanguage(GLOBAL.language).Map_Main_Menu
                    .MAP_AI_POSE_ESTIMATION_ASSOCIATION_CANCEL
                  : getLanguage(GLOBAL.language).Map_Main_Menu
                    .MAP_AI_POSE_ESTIMATION_ASSOCIATION}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // SPoseEstimationView.setPoseOverlook(!this.state.poseOverLook)
              this.setState({
                // poseOverLook: !this.state.poseOverLook,
                selectPoseMode: !this.state.selectPoseMode,
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
                  ? getLanguage(GLOBAL.language).Map_Main_Menu
                    .MAP_AI_POSE_ESTIMATION_LOOK
                  : getLanguage(GLOBAL.language).Map_Main_Menu
                    .MAP_AI_POSE_ESTIMATION_OVERLOOK}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              SPoseEstimationView.switchCamera()
              this.setState({
                selectPoseMode: false,
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
                source={getThemeAssets().ar.toolbar.icon_ar_toolbar_switch}
                style={styles.smallIcon}
              />
              <Text style={styles.buttonname}>
                {
                  getLanguage(GLOBAL.language).Map_Main_Menu
                    .MAP_AI_POSE_ESTIMATION_SWITCH_CAMERA
                }
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderPoseTitleItem = ({ item, index }) => {
    let _color =
      index === this.state.poseCallBackData.length - 1
        ? color.selected_blue
        : 'black'
    return (
      <Text style={{ fontSize: setSpText(24), color: _color }}>{item}</Text>
    )
  }

  renderPoseTitle() {
    return (
      <View style={styles.titlePose} pointerEvents="none">
        {/* <Text style={{ fontSize: setSpText(30), color: 'black' }}>
          {this.state.poseTitle + (this.state.poseCallBackData.length >0 ? this.state.poseCallBackData[0] : '')}
        </Text> */}
        <FlatList
          style={{ height: '100%' }}
          data={this.state.poseCallBackData}
          renderItem={this.renderPoseTitleItem}
          keyExtractor={(item, index) => String(index)}
        />
      </View>
    )
  }

  poseData = [
    {
      title: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AI_POSE_ESTIMATION_ZOOM,
      mode: 'MODE_ZOOM',
      index: 0,
    },
    {
      title: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AI_POSE_ESTIMATION_PAN,
      mode: 'MODE_PAN',
      index: 1,
    },
    {
      title: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AI_POSE_ESTIMATION_OVERLOOK,
      mode: 'MODE_OVERLOOK',
      index: 2,
    },
  ]
  onPressItem = item => {
    SPoseEstimationView.setOperMode(item.mode)
    // let _poseData = this.state.poseData.concat()
    this.setState({
      poseMode: item.mode,
      poseTitle: item.title,
      // poseData: _poseData,
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
              item.mode === this.state.poseMode
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
                getLanguage(GLOBAL.language).Map_Main_Menu
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
                title: getLanguage(GLOBAL.language).Map_Main_Menu
                  .MAP_AI_POSE_ESTIMATION,
                navigation: this.props.navigation,
                type: 'fix',
                backAction: this.back,
              }}
              bottomProps={{ type: 'fix' }}
            >
              <SMAIPoseEstimationView style={{ flex: 1 }} />
              {// this.state.associationMap &&
              // !this.state.poseOverLook &&
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
