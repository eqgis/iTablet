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
import { SMap } from 'imobile_for_reactnative'
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
      }).start()
    }
  }

  setVisible = iShow => {
    this.setState({ show: iShow })
  }

  close = async () => {
    await SMap.clearTrackingLayer()
    this.setVisible(false)
    let { orientation } = this.props.device
    GLOBAL.NAVIGATIONSTARTBUTTON.setState({
      show: false,
      isroad: orientation.indexOf('LANDSCAPE') !== 0,
      isLandScape: orientation.indexOf('LANDSCAPE') === 0,
      road: getLanguage(GLOBAL.language).Map_Main_Menu.ROAD_DETAILS,
      height:
        orientation.indexOf('LANDSCAPE') === 0
          ? new Animated.Value(
            screen.getScreenHeight(orientation) - HEADER_HEIGHT,
          )
          : new Animated.Value(scaleSize(200)),
      length: '',
      path: [],
    })
    GLOBAL.toolBox.existFullMap()
    this.props.setMapNavigation({
      isShow: false,
      name: '',
    })
    GLOBAL.STARTNAME = getLanguage(
      GLOBAL.language,
    ).Map_Main_Menu.SELECT_START_POINT
    GLOBAL.ENDNAME = getLanguage(
      GLOBAL.language,
    ).Map_Main_Menu.SELECT_DESTINATION
    GLOBAL.STARTX = undefined
    GLOBAL.STARTY = undefined
    GLOBAL.ENDX = undefined
    GLOBAL.ENDY = undefined
    GLOBAL.CURRENT_NAV_MODE = ''
    GLOBAL.NAV_PARAMS = []
    GLOBAL.TouchType = TouchType.NORMAL
    await SMap.clearPoint()
    GLOBAL.mapController?.changeBottom(false)
    GLOBAL.FloorListView?.floatToRight(false)
    GLOBAL.FloorListView?.changeBottom(false)
  }

  _onSelectPointPress = async isStart => {
    let button = isStart
      ? getLanguage(GLOBAL.language).Map_Main_Menu.SET_AS_START_POINT
      : getLanguage(GLOBAL.language).Map_Main_Menu.SET_AS_DESTINATION
    GLOBAL.TouchType = isStart
      ? TouchType.NAVIGATION_TOUCH_BEGIN
      : TouchType.NAVIGATION_TOUCH_END
    GLOBAL.mapController && GLOBAL.mapController.setVisible(true)
    GLOBAL.MAPSELECTPOINT.setVisible(true)
    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(
      true,
      {
        button,
      },
      false,
    )
    this.setVisible(false)
    GLOBAL.NAVIGATIONSTARTBUTTON.setVisible(false)
    await SMap.clearTrackingLayer()
    await SMap.clearPoint()
    if (isStart) {
      GLOBAL.STARTX = null
      GLOBAL.STARTY = null
      GLOBAL.STRATNAME = null
    } else {
      GLOBAL.ENDX = null
      GLOBAL.ENDY = null
      GLOBAL.ENDNAME = null
    }
  }

  renderButtom = (type, text) => {
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
          marginTop: scaleSize(20),
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

  renderBottons = () => {
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
      }}>
        {GLOBAL.CURRENT_NAV_MODE === 'OUTDOOR' && this.renderButtom(
          0,
          getLanguage().Map_Main_Menu.CAR_NAVIGATION,
        )}
        {this.renderButtom(
          3,
          getLanguage().Map_Main_Menu.WALK_NAVIGATION,
        )}
        {GLOBAL.CURRENT_NAV_MODE === 'OUTDOOR' && this.renderButtom(
          2,
          getLanguage().Map_Main_Menu.CRUISE_NAVIGATION ,
        )}
        {this.renderButtom(
          1,
          getLanguage(GLOBAL.language).Map_Main_Menu.SIMULATED_NAVIGATION,
        )}
        {Platform.OS === 'ios' && this.renderButtom(
          4,
          getLanguage(GLOBAL.language).Prompt.AR_NAVIGATION,
        )}
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
                      style={{
                        fontSize: setSpText(24),
                        // lineHeight: scaleSize(26),
                        padding: 0,
                      }}
                    >
                      {GLOBAL.STARTNAME}
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
                      style={{
                        fontSize: setSpText(24),
                        // lineHeight: scaleSize(26),
                        padding: 0,
                      }}
                    >
                      {GLOBAL.ENDNAME}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View>
            {this.renderBottons()}
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
