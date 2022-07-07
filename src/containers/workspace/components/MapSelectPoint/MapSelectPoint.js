import * as React from 'react'
import { View, Image, Text, StyleSheet, Platform } from 'react-native'
import { SMap } from 'imobile_for_reactnative'
import HardwareBackHandler from '../../../../components/HardwareBackHandler'
import Header from '../../../../components/Header'
import MapSelectPointLatitudeAndLongitude from '../MapSelectPointLatitudeAndLongitude/MapSelectPointLatitudeAndLongitude'
import Input from '../../../../components/Input'
import { getThemeAssets } from '../../../../assets'
import { getLanguage } from '../../../../language'
import { scaleSize } from '../../../../utils' 
export default class MapSelectPoint extends React.Component {
  props: {
    headerProps: Object,
    openSelectPointMap: () => any,
    selectPointType: 'string',
  }

  static defaultProps = {
    headerProps: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      show: false,
      longitude: '',
      latitude: '',
    }
  }

  componentDidMount = async () => {
    let position
    if (global.SELECTPOINTLATITUDEANDLONGITUDE) {
      position = global.SELECTPOINTLATITUDEANDLONGITUDE
    } else {
      position = await SMap.getCurrentPosition()
    }
    this.setState({
      longitude: position.x,
      latitude: position.y,
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.warn(this.props.selectPointType, nextProps.selectPointType)
    return (
      nextState.show !== this.state.show ||
      nextProps.selectPointType !== this.props.selectPointType ||
      nextState.latitude !== this.state.latitude ||
      nextState.longitude !== this.state.longitude
    )
  }

  updateLatitudeAndLongitude = point => {
    // if(this.pointLatitudeAndLongitude)
    // {
    //   this.pointLatitudeAndLongitude.updateLatitudeAndLongitude(point)
    //   global.SELECTPOINTLATITUDEANDLONGITUDE = point
    // }
    this.setState({
      longitude: point.x,
      latitude: point.y,
    })
    global.SELECTPOINTLATITUDEANDLONGITUDE = point
  }

  setVisible = (iShow, title = this.props.headerProps.title || '') => {
    this.setState({ show: iShow, title })
  }

  openSelectPointMap(wsData, point) {
    this.props.headerProps.openSelectPointMap(wsData, point)
  }

  onBack = () => {
    if(this.props.headerProps.backAction) {
      this.props.headerProps.backAction()
    }
    return true
  }

  renderBottom() {
    if (
      // this.props.headerProps.selectPointType &&
      // (this.props.headerProps.selectPointType === 'selectPoint' ||
      //   this.props.headerProps.selectPointType ===
      this.props.selectPointType &&
      (this.props.selectPointType === 'selectPoint' || // 普通地图地图选点
        this.props.selectPointType ===
          'SELECTPOINTFORARNAVIGATION_INDOOR') || // 室内导航地图选点
          this.props.selectPointType === 'DatumPointCalibration' // 新位置校准
    ) {
      return (
        // <MapSelectPointLatitudeAndLongitude
        //   style={{
        //     alignItems: 'flex-end',
        //   }}
        //   ref={ref => (this.pointLatitudeAndLongitude = ref)}
        //   isEdit={false}
        // />
        <View style={styles.inputView}>
          <View style={styles.inputBox}>
            <Image style={styles.inputIcon} source={getThemeAssets().setting.icon_location}/>
            <Text>{global.language ==='CN' ? getLanguage(global.language).Profile.X_COORDINATE : 'X'}</Text>
            <Input style={styles.input} editable={false} showClear={false} value={this.state.longitude} textAlign="left"/>
          </View>
          <View style={styles.line}></View>
          <View style={styles.inputBox}>
            <Image style={styles.inputIcon} source={getThemeAssets().setting.icon_location}/>
            <Text>{global.language ==='CN' ? getLanguage(global.language).Profile.X_COORDINATE : 'Y'}</Text>
            <Input style={styles.input} editable={false} showClear={false} value={this.state.latitude} textAlign="left"/>
          </View>
        </View>
      )
    } else {
      return <View />
    }
  }

  render() {
    if (this.state.show) {
      return (
        <View
          style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%',
            justifyContent: 'flex-end',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
          pointerEvents={'box-none'}
        >
          <HardwareBackHandler onBackPress={this.onBack}/>
          <Header
            ref={ref => (this.containerHeader = ref)}
            {...this.props.headerProps}
            title={this.state.title}
          />
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'flex-end',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            pointerEvents={'none'}
          >
            {this.renderBottom()}
          </View>
        </View>
      )
    } else {
      return <View />
    }
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
    marginBottom: scaleSize(36),
    justifyContent: 'space-around',
    ...Platform.select({
      android: {elevation: scaleSize(5)},
      ios:{}
    }),
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
})