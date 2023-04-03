import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import { getPublicAssets } from '../../assets'
import { Container, SwitchItem } from '../../components'
// import { RootState } from '../../redux/types'
import { AppDialog, AppEvent, dp, scaleSize } from '../../utils'
import { color, size } from '../../styles'
import { getLanguage } from '../../language'
import { setDatumPoint , arPoiSearch, set3dSceneFirst, setRTKAutoCalibration } from '../../redux/models/setting'
import { MapToolbar } from '../workspace/components'
import NavigationService from '../NavigationService'
import { requestAllPermission } from '@/utils/PermissionAndroidUtils'

type Props = ReduxProps

interface State {
  poiSearch?: boolean
}
class ARMapSetting extends React.Component<Props,State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      poiSearch: this.props.route?.params?.poiSearch
    }
  }

  renderCommonSettings = () => {
    return (
      <View style={styles.settingView}>
        <TouchableOpacity style={styles.settingItem}
          onPress={() => {
            NavigationService.navigate('MapStack', {screen: 'MapView'})
            this.props.setDatumPoint(true)
            if(this.state.poiSearch){
              this.props.arPoiSearch(true)
            }
          }}
        >
          <Text style={styles.itemText}>
            {getLanguage(global.language).Profile.MAR_AR_POSITION_CORRECT}
          </Text>
          <Image
            style={styles.itemImage}
            source={getPublicAssets().common.icon_move}
          />
        </TouchableOpacity>

        {/* 定位设置 */}
        <TouchableOpacity style={styles.settingItem}
          onPress={() => {
            NavigationService.navigate('LocationSetting')
            // 接入部分外部蓝牙设备需要先有定位权限
            requestAllPermission()
          }}
        >
          <Text style={styles.itemText}>
            {getLanguage(global.language).Profile.LOCATION_SETTING}
          </Text>
          <Image
            style={styles.itemImage}
            source={getPublicAssets().common.icon_move}
          />
        </TouchableOpacity>

        {Platform.OS === 'android' && (
          <SwitchItem
            textStyle={styles.itemText}
            text={getLanguage().RENDER_AR_SCENE_ON_3D}
            value={this.props.is3dSceneFirst}
            onPress={value => {
              AppDialog.show({
                text: getLanguage().RESTART_MODULE_INFO,
                confirm: () => {
                  AppEvent.emitEvent('on_exit_ar_map_module')
                  NavigationService.navigate('MapView')
                }
              })
              this.props.set3dSceneFirst(value)
            }}
          />
        )}

        {/* RTK自动校准 */}
        {Platform.OS === 'android' && (
          <SwitchItem
            textStyle={styles.itemText}
            text={getLanguage().RTK_AUTO_CALIBRATION}
            value={this.props.isRTKAutoCalibration}
            onPress={value => {
              this.props.setRTKAutoCalibration(value)
            }}
          />
        )}

        {/* 显示定位信息 */}
        {/* {Platform.OS === 'android' && (
          <SwitchItem
            textStyle={styles.itemText}
            text={getLanguage().SHOW_POINT_INFO}
            value={this.props.isPointParamShow}
            onPress={value => {
              this.props.setPointParamShow(value)
            }}
          />
        )} */}

      </View>
    )
  }

  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        type={global.Type}
        initIndex={2}
        mapModules={this.props.mapModules}
        ARView={true}
      />
    )
  }

  render() {
    return(
      <Container
        style={styles.conatiner}
        headerProps={{
          withoutBack: !this.state.poiSearch,
          title: getLanguage(global.language).Map_Label.SETTING,
          navigation: this.props.navigation,
          headerTitleViewStyle: {
            textAlign: 'left',
            marginLeft: scaleSize(80),
          },
        }}
        bottomBar={!this.state.poiSearch && this.renderToolBar()}
      >
        {this.renderCommonSettings()}
      </Container>
    )
  }
}

const mapStateToProp = (state: any) => ({
  mapModules: state.mapModules.toJS(),
  is3dSceneFirst: state.setting.toJS().is3dSceneFirst,
  isRTKAutoCalibration: state.setting.toJS().isRTKAutoCalibration,
  // isPointParamShow: state.setting.toJS().isPointParamShow,
})

const mapDispatch = {
  setDatumPoint,
  arPoiSearch,
  set3dSceneFirst,
  setRTKAutoCalibration,
  // setPointParamShow,
}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(ARMapSetting)

const styles = StyleSheet.create({
  conatiner: {
    backgroundColor: color.bgG3,
  },
  settingView: {
    backgroundColor: color.white,
    marginTop: scaleSize(20),
    marginHorizontal: scaleSize(20),
    borderRadius: scaleSize(10),
  },
  settingItem: {
    height: scaleSize(80),
    marginLeft: dp(20),
    paddingRight: scaleSize(16),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: color.WHITE,
  },
  itemText: {
    flex: 1,
    fontSize: size.fontSize.fontSizeMd,
    color: color.BLACK,
  },
  itemImage: {
    width: scaleSize(36),
    height: scaleSize(36),
  },
})