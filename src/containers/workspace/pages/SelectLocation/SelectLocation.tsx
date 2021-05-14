
import React from 'react'
import {
  Text,
  View,
  Image,
  Platform,
  StyleSheet,
  NativeModules,
  NativeEventEmitter,
  TouchableOpacity,
} from 'react-native'
import { MapController } from '../../components'
import {
  Container,
  Button,
} from '../../../../components'
import { SMMapView2, SMap2, SMap } from 'imobile_for_reactnative'
import {
  scaleSize,
  Toast,
} from '../../../../utils'
import AppStyle from './AppStyle'
import OnlineDS from './OnlineDS'
import { getLanguage } from '../../../../language/index'
import Input from '../../../../components/Input'
import { getThemeAssets } from '../../../../assets'

interface Props {
  navigation: any,
  device: any,
}

interface State {
  x: number,
  y: number,
}

const iOSEventEmi = new NativeEventEmitter(NativeModules.SMap)

export default class SelectLocation extends React.Component<Props, State>{
  homePath: string
  cb: () => void

  constructor(props: Props) {
    super(props)
    this.homePath = ''
    this.state = {
      x: GLOBAL.SELECTPOINTLATITUDEANDLONGITUDETEMP.x,
      y: GLOBAL.SELECTPOINTLATITUDEANDLONGITUDETEMP.y,
    }
    this.cb = this.props.navigation?.state?.params?.cb
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      SMap2.removeLocationCallout()
    } else {
      iOSEventEmi.removeListener(
        'com.supermap.RN.Mapcontrol.single_tap_event_two',
        this.onSingleTap,
      )
    }
  }

  componentDidMount() {
    if (Platform.OS === 'ios') {
      iOSEventEmi.addListener(
        'com.supermap.RN.Mapcontrol.single_tap_event_two',
        this.onSingleTap,
      )
    }
  }

  onSingleTap = async (event: SMap2.ITouchEvent) => {
    let point
    if (Platform.OS === 'ios') {
      point = event.LLPoint
      SMap.addSelectPoint(event.mapPoint)
    } else {
      point = await SMap2.pixelToLL(event.screenPoint)
      SMap2.addLocationCallout(event.mapPoint)
    }

    if (point) {
      this.setState({
        x: point.x,
        y: point.y,
      })
      GLOBAL.SELECTPOINTLATITUDEANDLONGITUDETEMP = { x: Number(this.state.x), y: Number(this.state.y) }
    }
  }

  openMap = async () => {
    if (Platform.OS === 'android') {
      //刚初始化完mapview后添加会导致第一次的地图范围不对，设置个延时
      setTimeout(() => {
        SMap2.addToMap(OnlineDS.tianditu.alias, 0)
      }, 1)
    } else {
      let datasourceParams = {
        server: OnlineDS.tianditu.server,
        engineType: OnlineDS.tianditu.engineType,
        alias: OnlineDS.tianditu.alias,
        driver: OnlineDS.tianditu.driver,
      }
      SMap.addToMap(datasourceParams, 0)
    }
  }

  renderBottom() {
    return (
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: scaleSize(140),
          // backgroundColor: "#fff",
          bottom: scaleSize(20),
          justifyContent: 'center',
          alignItems: 'center',
        }}
        pointerEvents={'none'}
      >
        <View style={styles.inputView}>
          <View style={styles.inputBox}>
            <Image style={styles.inputIcon} source={getThemeAssets().setting.icon_location} />
            <Text>{GLOBAL.language === 'CN' ? getLanguage(GLOBAL.language).Profile.X_COORDINATE : 'X'}</Text>
            <Input style={styles.input} editable={false} showClear={false} value={this.state.x} textAlign="left" />
          </View>
          <View style={styles.line}></View>
          <View style={styles.inputBox}>
            <Image style={styles.inputIcon} source={getThemeAssets().setting.icon_location} />
            <Text>{GLOBAL.language === 'CN' ? getLanguage(GLOBAL.language).Profile.Y_COORDINATE : 'Y'}</Text>
            <Input style={styles.input} editable={false} showClear={false} value={this.state.y} textAlign="left" />
          </View>
        </View>
      </View>
    )
  }

  back = () => {
    this.props.navigation.goBack()
  }

  location = async () => {
    let point
    if (Platform.OS === 'ios') {
      SMap.moveToCurrent2().then(result => {
        !result &&
          Toast.show(getLanguage(GLOBAL.language).Prompt.OUT_OF_MAP_BOUNDS)
      })
      point = await SMap.getCurrentPoint2()
    } else {
      SMap2.moveToCurrent()
      point = await SMap2.getCurrentPoint()
    }
    this.setState({
      x: point.x,
      y: point.y,
    })
    GLOBAL.SELECTPOINTLATITUDEANDLONGITUDETEMP = { x: Number(this.state.x), y: Number(this.state.y) }
  }

  zoomin = () => {
    if (Platform.OS === 'ios') {
      SMap.zoom2(2)
    } else {
      SMap2.zoom(2)
    }
  }

  zoomout = () => {
    if (Platform.OS === 'ios') {
      SMap.zoom2(0.5)
    } else {
      SMap2.zoom(0.5)
    }
  }

  /** 地图选点header右边确定view */
  renderHeaderRight = () => {
    return (
      <TouchableOpacity
        key={'search'}
        onPress={async () => {
          this.props.navigation.goBack()
          this.cb && this.cb()
          if (Platform.OS === 'ios') {
            SMap.closeMapControl2()
          }
        }}
      >
        <Text style={styles.textConfirm}>
          {getLanguage(GLOBAL.language).Map_Settings.CONFIRM}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Container
        showFullInMap={true}
        hideInBackground={false}
        headerProps={{
          title: getLanguage().Profile.MAP_AR_DATUM_MAP_SELECT_POINT,
          backAction: () => {
            this.back()
          },
          headerRight: this.renderHeaderRight(),
        }}
      >
        <SMMapView2
          onLoad={this.openMap}
          workspace={{
            datasource: OnlineDS.tianditu,
          }}
          onSingleTap={this.onSingleTap}
        />
        <MapController
          bottomHeight={scaleSize(200)}
          selectLocation={this.location}
          selectZoomIn={this.zoomin}
          selectZoomOut={this.zoomout}
          device={this.props.device}
        />
        {this.renderBottom()}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  inputView: {
    width: scaleSize(656),
    height: scaleSize(140),
    borderRadius: scaleSize(48),
    paddingHorizontal: scaleSize(20),
    paddingVertical: scaleSize(10),
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    width: scaleSize(44),
    height: scaleSize(44),
  },
  input: {
    flex: 1,
    height: scaleSize(44),
  },
  line: {
    width: scaleSize(572),
    height: 1,
    alignSelf: 'flex-end',
    backgroundColor: '#f2f2f2',
  },
  textConfirm: {
    fontSize: scaleSize(25),
    color: 'black',
    padding: scaleSize(10),
  },
})
