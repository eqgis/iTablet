import * as React from 'react'
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  FlatList,
  // AppState,
} from 'react-native'
import NavigationService from '../../containers/NavigationService'
import { getThemeAssets, getPublicAssets } from '../../assets'
import {
  SMProjectModelView,
  SProjectModelView,
  SMap,
} from 'imobile_for_reactnative'
import styles from './styles'
import { Container } from '../../components'
import { getLanguage } from '../../language'
import { color } from '../../styles'
import { scaleSize } from '../../utils'
import Orientation from 'react-native-orientation'

/*
 * AR投射页面
 */
export default class ARProjectModeView extends React.Component {
  props: {
    navigation: Object,
    language: String,
    user: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)

    let _moduleListData = this.getModuleListData()

    this.state = {
      currentLength: 0,
      totalLength: 0,
      tolastLength: 0,
      totalArea: 0,
      showModelViews: false,
      SearchingSurfacesSucceed: false,
      showSwithchButtons: false,

      moduleListData: _moduleListData,
      bmoduleListDataShow: false,
      showSandTable: true,
    }

    this.flage = false
  }

  // eslint-disable-next-line
  componentWillMount() {
    SMap.setDynamicviewsetVisible(false)
    Orientation.lockToPortrait()
  }

  componentDidMount() {
    this.getModuleShowState()

    // SProjectModelView.onResume()
    // AppState.addEventListener('change', this._handleAppStateChange)
  }

  // _handleAppStateChange = nextAppState => {
  //   if (nextAppState != null && nextAppState === 'active') {
  //     if (this.flage) {
  //       SProjectModelView.onResume()
  //     }
  //     this.flage = false
  //   } else if (nextAppState != null && nextAppState === 'background') {
  //     this.flage = true
  //     SProjectModelView.onPause()
  //   }
  // }

  componentWillUnmount() {
    // SProjectModelView.onDestory()
    // AppState.removeEventListener('change', this._handleAppStateChange)
  }

  getModuleShowState = async () => {
    let state = await SProjectModelView.getShowState()
    let _moduleListData = this.state.moduleListData
    _moduleListData[0].show = state.architecture
    _moduleListData[1].show = state.path
    _moduleListData[2].show = state.marker
  }

  getModuleListData() {
    let data = []
    data.push({
      title: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_OPREATE_MODEL_ARCHITECTURE,
      type: 'architecture',
      show: false,
      action: SProjectModelView.showInnerScenicSpot,
      index: 0,
    })
    data.push({
      title: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_OPREATE_MODEL_PATH,
      type: 'path',
      show: false,
      action: SProjectModelView.showTourLine,
      index: 1,
    })
    data.push({
      title: getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_OPREATE_MODEL_MARKER,
      type: 'maker',
      show: false,
      action: SProjectModelView.showMarker,
      index: 2,
    })
    return data
  }

  onPressItem = item => {
    item.action()
    let _moduleListData = this.state.moduleListData
    _moduleListData[item.index].show = !_moduleListData[item.index].show
    this.setState({
      moduleListData: _moduleListData,
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
              item.show
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
            flex: 1,
            backgroundColor: color.transOverlay,
          }}
          onPress={() => {
            this.setState({
              bmoduleListDataShow: false,
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
                  .MAP_AR_AI_ASSISTANT_OPREATE_MODEL
              }
            </Text>
          </View>

          <FlatList
            style={{
              height: '100%',
            }}
            data={this.state.moduleListData}
            renderItem={this.renderItem}
            keyExtractor={this._keyExtractor}
            ItemSeparatorComponent={this._renderItemSeparatorComponent}
          />
        </View>
      </View>
    )
  }

  back = () => {
    SProjectModelView.onPause()

    NavigationService.goBack('ARProjectModeView')

    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(false)
    GLOBAL.toolBox.switchAr()
  }

  renderBottomBtns = () => {
    return (
      <View style={styles.toolbar}>
        <View style={styles.buttonView}>
          <TouchableOpacity
            onPress={() => {
              SProjectModelView.contraRotate()
              this.setState({
                bmoduleListDataShow: false,
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
                source={getThemeAssets().publicAssets.icon_undo_dark}
                style={styles.smallIcon}
              />

              <Text style={styles.buttonname}>
                {
                  getLanguage(GLOBAL.language).Map_Main_Menu
                    .MAP_AR_AI_ASSISTANT_LEFT_ROTATE
                }
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              SProjectModelView.clockwiseRotation()
              this.setState({
                bmoduleListDataShow: false,
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
                source={getThemeAssets().publicAssets.icon_redo_dark}
                style={styles.smallIcon}
              />
              <Text style={styles.buttonname}>
                {
                  getLanguage(GLOBAL.language).Map_Main_Menu
                    .MAP_AR_AI_ASSISTANT_RIGHT_ROTATE
                }
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              SProjectModelView.showTourModel()
              let _showSandTable = this.state.showSandTable
              this.setState({
                showSandTable: !_showSandTable,
                bmoduleListDataShow: false,
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
                source={
                  getThemeAssets().layer3dType.layer3d_type_image_selected
                }
                style={styles.smallIcon}
              />
              <Text style={styles.buttonname}>
                {this.state.showSandTable
                  ? getLanguage(GLOBAL.language).Map_Main_Menu
                    .MAP_AR_AI_ASSISTANT_SAND_TABLE_HIDE
                  : getLanguage(GLOBAL.language).Map_Main_Menu
                    .MAP_AR_AI_ASSISTANT_SAND_TABLE}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              //如果沙盘没有显示
              if (!this.state.showSandTable) {
                return
              }
              this.setState({
                bmoduleListDataShow: !this.state.bmoduleListDataShow,
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
                // source={getThemeAssets().ar.toolbar.icon_ar_toolbar_save_point}
                source={
                  this.state.showSandTable
                    ? getThemeAssets().layerType.layer_group_selected
                    : getThemeAssets().layerType.layer_group
                }
                style={styles.smallIcon}
              />
              <Text
                style={[
                  styles.buttonname,
                  {
                    color: this.state.showSandTable ? color.white : color.gray,
                  },
                ]}
              >
                {
                  getLanguage(GLOBAL.language).Map_Main_Menu
                    .MAP_AR_AI_ASSISTANT_SAND_TABLE_MODEL
                }
              </Text>
            </View>
          </TouchableOpacity>
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
                  .MAP_AR_AI_ASSISTANT_CAST_MODEL_OPERATE,
                navigation: this.props.navigation,
                backAction: this.back,
                type: 'fix',
              }}
              bottomProps={{ type: 'fix' }}
            >
              <SMProjectModelView
                // <View
                ref={ref => (this.SMProjectModelView = ref)}
                style={{ height: '100%', width: '100%' }}
              />
            </Container>
          </View>
          {this.state.bmoduleListDataShow && this.renderModelList()}
        </View>
        {this.renderBottomBtns()}
      </View>
    )
  }
}
