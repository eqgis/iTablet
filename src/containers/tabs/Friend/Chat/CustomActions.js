/**
 * Created by imobile-xzy on 2019/3/9.
 */
import PropTypes from 'prop-types'
import React from 'react'
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Text,
  Image,
  NativeModules,
  NetInfo,
  Platform,
  PermissionsAndroid,
  ScrollView,
  Dimensions,
} from 'react-native'
import { getLanguage } from '../../../../language/index'
import { SOnlineService, SMap } from 'imobile_for_reactnative'
import { scaleSize } from '../../../../utils/screen'
import NavigationService from '../../../NavigationService'
import { SimpleDialog } from '../Component'
import { Toast, screen} from '../../../../utils'
import { getThemeAssets } from '../../../../assets'
import { ImagePicker } from '../../../../components'
let AppUtils = NativeModules.AppUtils

// if (Platform.OS === 'android') {
//   var AMapGeolocation = require('react-native-amap-geolocation')
// } else {
//   var GeolocationIOS = require('Geolocation')
// }

// eslint-disable-next-line no-unused-vars
const ICONS = context => {
  const data = [
    {
      name: require('../../../../assets/lightTheme/friend/app_chat_map.png'),
      type: 'ionicon',
      text: getLanguage(GLOBAL.language).Friends.MAP,
      onPress: () => {
        NavigationService.navigate('MyMap', {
          title: getLanguage(GLOBAL.language).Profile.MAP,
          chatCallback: (_path, fileName) => {
            context.props.sendCallBack(1, _path, fileName)
          },
        })
        context.setModalVisible()
      },
    },
    {
      name: getThemeAssets().mine.my_armap,
      type: 'ionicon',
      text: getLanguage(GLOBAL.language).Profile.ARMAP,
      onPress: () => {
        NavigationService.navigate('MyARMap', {
          title: getLanguage(GLOBAL.language).Profile.ARMAP,
          chatCallback: (_path, fileName) => {
            context.props.sendCallBack(4, _path, fileName)
          },
        })
        context.setModalVisible()
      },
    },
    // {
    //   name: require('../../../../assets/lightTheme/friend/app_chat_data.png'),
    //   type: 'ionicon',
    //   text: getLanguage(GLOBAL.language).Friends.TEMPLATE,
    //   onPress: () => {
    //     NavigationService.navigate('MyModule', {
    //       formChat: true,
    //       // eslint-disable-next-line
    //       chatCallBack: _path => {},
    //     })
    //     context.setModalVisible()
    //   },
    // },
    {
      name: require('../../../../assets/lightTheme/friend/app_chat_location.png'),
      type: 'material',
      text: getLanguage(GLOBAL.language).Friends.LOCATION,
      onPress: () => {
        context.setModalVisible()
        context.handleLocationClick()
      },
    },
    {
      name: require('../../../../assets/lightTheme/friend/app_chat_pic.png'),
      type: 'material',
      text: getLanguage(GLOBAL.language).Friends.PICTURE,
      onPress: () => {
        context.setModalVisible()
        ImagePicker.AlbumListView.defaultProps.showDialog = false
        ImagePicker.AlbumListView.defaultProps.assetType = 'Photos'
        ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'
        ImagePicker.getAlbum({
          maxSize: 1,
          callback: async data => {
            // console.log(data)
            if (data.length > 0) {
              context.props.sendCallBack(2, data[0])
            }
          },
        })
      },
    },
    {
      name: getThemeAssets().mine.my_data,
      type: 'ionicon',
      text: getLanguage(GLOBAL.language).Analyst_Labels.DATA_SOURCE,
      onPress: () => {
        NavigationService.navigate('MyDatasource', {
          title: getLanguage(GLOBAL.language).Profile.DATA,
          chatCallback: (_path, fileName) => {
            context.props.sendCallBack(5, _path, fileName)
          },
        })
        context.setModalVisible()
      },
    },
    {
      name: getThemeAssets().mine.my_symbol,
      type: 'ionicon',
      text: getLanguage(GLOBAL.language).Profile.SYMBOL,
      onPress: () => {
        NavigationService.navigate('MySymbol', {
          title: getLanguage(GLOBAL.language).Profile.SYMBOL,
          chatCallback: (_path, fileName) => {
            context.props.sendCallBack(6, _path, fileName)
          },
        })
        context.setModalVisible()
      },
    },
    {
      name: getThemeAssets().mine.my_color,
      type: 'ionicon',
      text: getLanguage(GLOBAL.language).Profile.COLOR_SCHEME,
      onPress: () => {
        NavigationService.navigate('MyColor', {
          title: getLanguage(GLOBAL.language).Profile.COLOR_SCHEME,
          chatCallback: (_path, fileName) => {
            context.props.sendCallBack(7, _path, fileName)
          },
        })
        context.setModalVisible()
      },
    },
    {
      name: getThemeAssets().mine.my_ai,
      type: 'ionicon',
      text: getLanguage(GLOBAL.language).Profile.AIMODEL,
      onPress: () => {
        NavigationService.navigate('MyAIModel', {
          title: getLanguage(GLOBAL.language).Profile.AIMODEL,
          chatCallback: (_path, fileName) => {
            context.props.sendCallBack(8, _path, fileName)
          },
        })
        context.setModalVisible()
      },
    },
    {
      name: getThemeAssets().ar.armap.ar_effect,
      type: 'ionicon',
      text: getLanguage(GLOBAL.language).Profile.AREFFECT,
      onPress: () => {
        NavigationService.navigate('MyAREffect', {
          title: getLanguage(GLOBAL.language).Profile.AREFFECT,
          chatCallback: (_path, fileName) => {
            context.props.sendCallBack(9, _path, fileName)
          },
        })
        context.setModalVisible()
      },
    },
    {
      name: getThemeAssets().ar.armap.ar_model,
      type: 'ionicon',
      text: getLanguage(GLOBAL.language).Profile.ARMODEL,
      onPress: () => {
        NavigationService.navigate('MyARModel', {
          title: getLanguage(GLOBAL.language).Profile.ARMODEL,
          chatCallback: (_path, fileName) => {
            context.props.sendCallBack(10, _path, fileName)
          },
        })
        context.setModalVisible()
      },
    },
    {
      name: getThemeAssets().mine.icon_my_template,
      type: 'ionicon',
      text: getLanguage(GLOBAL.language).Profile.TEMPLATE,
      onPress: () => {
        NavigationService.navigate('MyTemplate', {
          title: getLanguage(GLOBAL.language).Profile.TEMPLATE,
          chatCallback: (_path, fileName, tempType) => {
            context.props.sendCallBack(11, _path, fileName, tempType)
          },
        })
        context.setModalVisible()
      },
    },
  ]

  if(Platform.OS === 'ios') {
    data.splice(9, 1)
  }

  return data
}
export default class CustomActions extends React.Component {
  props: {
    callBack: () => {},
    sendCallBack: () => {},
  }

  constructor(props) {
    super(props)
    this._images = []
    this.state = {
      modalVisible: false,
    }
    // this.onActionsPress = this.onActionsPress.bind(this)
    // this.selectImages = this.selectImages.bind(this)
  }

  componentDidMount() {}
  componentWillUnmount() {}
  setModalVisible(visible = false) {
    if (visible) {
      this.props.callBack(scaleSize(400))
    } else {
      this.props.callBack(scaleSize(0))
    }
    this.setState({ modalVisible: visible })
  }

  handleLocationClick = async () => {
    let isConnected = await NetInfo.isConnected.fetch()
    if (!isConnected) {
      Toast.show(getLanguage(GLOBAL.language).Prompt.NO_NETWORK)
      return
    }
    if (!(await AppUtils.isLocationOpen())) {
      this.SimpleDialog.set({
        text: getLanguage(GLOBAL.language).Prompt.OPEN_LOCATION,
        confirmAction: () => {
          AppUtils.startAppLoactionSetting()
        },
      })
      this.SimpleDialog.setVisible(true)
      return
    }

    let allowed = true
    if (Platform.OS === 'ios') {
      if (!(await AppUtils.isLocationAllowed())) {
        allowed = false
      }
    } else {
      let granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )
      if (PermissionsAndroid.RESULTS.GRANTED !== granted) {
        allowed = false
      }
    }
    if (!allowed) {
      this.SimpleDialog.set({
        text: getLanguage(GLOBAL.language).Prompt.REQUEST_LOCATION,
        confirmAction: () => {
          AppUtils.startAppLoactionSetting()
        },
      })
      this.SimpleDialog.setVisible(true)
      return
    }

    let location = await SMap.getCurrentLocation()
    if (location.longitude === 0 && location.latitude === 0) {
      Toast.show(getLanguage(GLOBAL.language).Prompt.LOCATION_ERROR)
      return
    }
    SOnlineService.reverseGeocoding(location.longitude, location.latitude, {
      onResult: result => {
        this.props.sendCallBack(3, {
          address: result,
          longitude: location.longitude,
          latitude: location.latitude,
        })
      },
    })
  }

  renderIcon() {
    if (this.props.icon) {
      return this.props.icon()
    }
    return (
      <View style={[styles.wrapper, this.props.wrapperStyle]}>
        <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
      </View>
    )
  }

  renderSimpleDialog = () => {
    return <SimpleDialog ref={ref => (this.SimpleDialog = ref)} />
  }

  _getMargin = () => {
    const screenWidth = screen.getScreenSafeWidth(GLOBAL.getDevice().orientation)
    const number = Math.floor(screenWidth / ITEM_WIDTH)
    const space = screenWidth - number * ITEM_WIDTH
    return space / 2 / number
  }

  renderMenu = () => {
    return (
      <Modal
        transparent={true}
        visible={this.state.modalVisible}
        animationType={'fade'}
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}
        onRequestClose={() => this.setModalVisible()}
      >
        <View style={{flex: 1, justifyContent: 'flex-end'}}>

          <TouchableOpacity
            style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent'}]}
            onPress={() => this.setModalVisible()}
          />

          <View style={{
            height: scaleSize(400),
          }}>
            <ScrollView
              style={{
                width: '100%',
                backgroundColor: 'white',
              }}
              contentContainerStyle={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
              showsVerticalScrollIndicator={false}
            >
              {ICONS(this).map((v, i) => (
                <View
                  key={i}
                  style={[
                    modalStyles.itemView,
                    {
                      marginHorizontal:  this._getMargin(),
                    },
                  ]}
                >
                  <TouchableOpacity onPress={() => v.onPress(this)}>
                    <Image
                      source={v.name}
                      style={{ width: scaleSize(85), height: scaleSize(85) }}
                    />
                  </TouchableOpacity>
                  <Text style={modalStyles.textStyle}>{v.text}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    )
  }

  render() {
    return (
      <>
        <TouchableOpacity
          style={[styles.container, this.props.containerStyle]}
          onPress={() => {
            this.setModalVisible(true)
          }}
        >
          {this.renderIcon()}
          {this.renderSimpleDialog()}
        </TouchableOpacity>
        {this.renderMenu()}
      </>
    )
  }
}

const ITEM_WIDTH = scaleSize(120)

const modalStyles = StyleSheet.create({
  itemView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scaleSize(20),
    width: ITEM_WIDTH,
    height: scaleSize(120),
  },
  textStyle: {
    color: 'black',
    fontSize: scaleSize(25),
    // marginLeft: scaleSize(6),
    textAlign: 'center',
  },
  imgStyle: {
    width: 20,
    height: 20,
  },
})
const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
})

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
}

CustomActions.defaultProps = {
  onSend: () => {},
  options: {},
  icon: null,
  containerStyle: {},
  wrapperStyle: {},
  iconTextStyle: {},
}

CustomActions.propTypes = {
  onSend: PropTypes.func,
  options: PropTypes.object,
  icon: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  wrapperStyle: ViewPropTypes.style,
  iconTextStyle: Text.propTypes.style,
}
