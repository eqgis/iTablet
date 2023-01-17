import * as React from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Platform,
  Animated,
} from 'react-native'
import { scaleSize, screen, setSpText } from '../../../../utils'
import styles from './styles'
import { TouchType } from '../../../../constants'
import { getPublicAssets } from '../../../../assets'
import { color } from '../../../../styles'
import { SMap, SNavigation } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language'
const TOOLBARHEIGHT = Platform.OS === 'ios' ? scaleSize(20) : 0
const HEADER_HEIGHT = TOOLBARHEIGHT + scaleSize(270)
export default class NavigationStartHead extends React.Component {
  props: {
    device: Object,
    setMapNavigation: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      naviType: 0,
      show: false,
      width:
        props.device.orientation.indexOf('LANDSCAPE') === 0
          ? new Animated.Value(
            screen.getScreenWidth(props.device.orientation) / 2,
          )
          : new Animated.Value(screen.getScreenWidth(props.device.orientation)),
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.device.orientation !== this.props.device.orientation) {
      let width =
        this.props.device.orientation.indexOf('LANDSCAPE') === 0
          ? screen.getScreenWidth(this.props.device.orientation) / 2
          : screen.getScreenWidth(this.props.device.orientation)
      Animated.timing(this.state.width, {
        toValue: width,
        duration: 300,
        useNativeDriver: false,
      }).start()
    }
  }

  setVisible = iShow => {
    this.setState({ show: iShow })
  }

  close = async () => {
    await SNavigation.clearTrackingLayer()
    this.setVisible(false)
    let { orientation } = this.props.device
    global.NAVIGATIONSTARTBUTTON.setState({
      show: false,
      isroad: orientation.indexOf('LANDSCAPE') !== 0,
      isLandScape: orientation.indexOf('LANDSCAPE') === 0,
      road: getLanguage(global.language).Map_Main_Menu.ROAD_DETAILS,
      height:
        orientation.indexOf('LANDSCAPE') === 0
          ? new Animated.Value(
            screen.getScreenHeight(orientation) - HEADER_HEIGHT,
          )
          : new Animated.Value(scaleSize(200)),
      length: '',
      path: [],
    })
    global.toolBox.existFullMap()
    this.props.setMapNavigation({
      isShow: false,
      name: '',
    })
    global.STARTNAME = getLanguage(
      global.language,
    ).Map_Main_Menu.SELECT_START_POINT
    global.ENDNAME = getLanguage(
      global.language,
    ).Map_Main_Menu.SELECT_DESTINATION
    global.STARTX = undefined
    global.STARTY = undefined
    global.ENDX = undefined
    global.ENDY = undefined
    global.CURRENT_NAV_MODE = ''
    global.NAV_PARAMS = []
    global.TouchType = TouchType.NORMAL
    await SNavigation.clearPoint()
    global.mapController?.changeBottom(false)
    global.FloorListView?.floatToRight(false)
    global.FloorListView?.changeBottom(false)
  }

  _onSelectPointPress = async isStart => {
    let button = isStart
      ? getLanguage(global.language).Map_Main_Menu.SET_AS_START_POINT
      : getLanguage(global.language).Map_Main_Menu.SET_AS_DESTINATION
    global.TouchType = isStart
      ? TouchType.NAVIGATION_TOUCH_BEGIN
      : TouchType.NAVIGATION_TOUCH_END
    global.mapController && global.mapController.setVisible(true)
    global.MAPSELECTPOINT.setVisible(true)
    global.MAPSELECTPOINTBUTTON.setVisible(
      true,
      {
        button,
      },
      false,
    )
    this.setVisible(false)
    global.NAVIGATIONSTARTBUTTON.setVisible(false)
    await SNavigation.clearTrackingLayer()
    await SNavigation.clearPoint()
    if (isStart) {
      global.STARTX = null
      global.STARTY = null
      global.STRATNAME = null
    } else {
      global.ENDX = null
      global.ENDY = null
      global.ENDNAME = null
    }
  }

  renderButton = (type, text) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={[{
          height: scaleSize(60),
          flex: 1,
          borderRadius: scaleSize(30),
          // backgroundColor: color.background,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: scaleSize(5),
        },
        this.state.naviType === type && {
          backgroundColor: color.blue1,
        }]}
        onPress={() => {
          this.setState({
            naviType: type,
          })
        }}
      >
        <Text
          style={[{
            fontSize: setSpText(20),
            color: color.black,
            textAlign: 'center',
          },
          this.state.naviType === type && {
            color: color.white,
          }]}
        >
          {text}
        </Text>
      </TouchableOpacity>
    )
  }

  renderButtons = () => {
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: scaleSize(5),
        marginVertical: scaleSize(10),
      }}>
        {global.CURRENT_NAV_MODE === 'OUTDOOR' && this.renderButton(
          0,
          getLanguage().Map_Main_Menu.CAR_NAVIGATION,
        )}
        {this.renderButton(
          3,
          getLanguage().Map_Main_Menu.WALK_NAVIGATION,
        )}
        {/* {global.CURRENT_NAV_MODE === 'OUTDOOR' && this.renderButton(
          2,
          getLanguage().Map_Main_Menu.CRUISE_NAVIGATION ,
        )} */}
        {this.renderButton(
          1,
          getLanguage(global.language).Map_Main_Menu.SIMULATED_NAVIGATION,
        )}
        {/* {Platform.OS === 'ios' && this.renderButton(
          4,
          getLanguage(global.language).Prompt.AR_NAVIGATION,
        )} */}
      </View>
    )
  }

  _renderSearchView = () => {
    if (this.state.show) {
      return (
        <Animated.View
          style={{
            paddingTop: TOOLBARHEIGHT + scaleSize(20),
            height: HEADER_HEIGHT,
            width: this.state.width,
            backgroundColor: color.content_white,
            position: 'absolute',
            top: 0,
          }}
        >
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                this.close()
              }}
              style={{
                width: scaleSize(60),
                alignItems: 'center',
                paddingTop: scaleSize(10),
                justifyContent: 'flex-start',
              }}
            >
              <Image
                resizeMode={'contain'}
                source={getPublicAssets().common.icon_back}
                style={styles.backbtn}
              />
            </TouchableOpacity>
            <View style={styles.pointAnalystView}>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  flex: 1,
                  marginHorizontal: scaleSize(20),
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      width: scaleSize(12),
                      height: scaleSize(12),
                      borderRadius: scaleSize(6),
                      marginRight: scaleSize(20),
                      backgroundColor: '#0dc66d',
                    }}
                  />
                  <TouchableOpacity
                    style={styles.onInput}
                    onPress={() => {
                      this._onSelectPointPress(true)
                    }}
                  >
                    <Text
                      numberOfLines={2}
                      ellipsizeMode={'tail'}
                      style={[{
                        fontSize: setSpText(24),
                        padding: 0,
                      },
                      Platform.OS === 'android' && {
                        lineHeight: setSpText(25),
                        paddingTop: setSpText(6),
                      },
                      ]}
                    >
                      {global.STARTNAME}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: 2,
                    backgroundColor: color.separateColorGray,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      width: scaleSize(12),
                      height: scaleSize(12),
                      borderRadius: scaleSize(6),
                      marginRight: scaleSize(20),
                      backgroundColor: '#f14343',
                    }}
                  />
                  <TouchableOpacity
                    style={styles.secondInput}
                    onPress={() => {
                      this._onSelectPointPress(false)
                    }}
                  >
                    <Text
                      numberOfLines={2}
                      ellipsizeMode={'tail'}
                      style={[{
                        fontSize: setSpText(24),
                        padding: 0,
                      },
                      Platform.OS === 'android' && {
                        lineHeight: setSpText(25),
                        paddingTop: setSpText(6),
                      },
                      ]}
                    >
                      {global.ENDNAME}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View>
            {this.renderButtons()}
          </View>
        </Animated.View>
      )
    } else {
      return <View />
    }
  }

  render() {
    return this._renderSearchView()
  }
}
