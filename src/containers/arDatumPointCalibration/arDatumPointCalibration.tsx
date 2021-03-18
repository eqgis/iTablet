import React, { Component } from 'react'
import {  View, Image, Text, TouchableOpacity, Animated, Platform } from 'react-native'
import { getThemeAssets } from '../../assets'
import { getLanguage } from '../../language'
import Input from '../../components/Input'
import { scaleSize, Toast } from '../../utils/index'
import { SMap, SCollectSceneFormView, Action } from 'imobile_for_reactnative'
import NavigationService from '../../containers/NavigationService'
import { ConstOnline, TouchType } from '../../constants'
import { Container } from '../../components'
import styles from './styles'

interface IState {
  close: boolean,
  showStatus: 'main' | 'scan' | 'setting',
  scanning: boolean,
  activeBtn: number,
  latitude: string,
  longitude: string,
  animValue: any,
}

interface IProps {
  onClose: Function, // 选点结束回调
  startScan: Function, // 调用各自界面的camera进行二维码扫描
  routeName: string,
}

export default class DatumPointCalibration extends Component<IProps,IState> {
  constructor(props) {
    super(props)
    this.state = {
      close: false,
      showStatus: 'main',
      scanning: false,
      activeBtn: 2,
      longitude: '',
      latitude: '',
      height: 1.5,
      animValue: new Animated.Value(0),
    }
    this.scanAnimation = null
    this.scanTimes = 0 // 扫描次数
  }

  async componentDidMount(){
    let position
    if (GLOBAL.SELECTPOINTLATITUDEANDLONGITUDE) {
      position = GLOBAL.SELECTPOINTLATITUDEANDLONGITUDE
    }else {
      position = await SMap.getCurrentPosition()
    }
    this.setState({
      longitude: position.x,
      latitude: position.y,
    })
  }

  _onClose = () => {
    const { longitude, latitude } = this.state
    const { onClose } = this.props
    onClose && onClose({
      x: longitude,
      y: latitude,
    })
    this.setState({
      close: true,
    })
  }

  _startAnim = () => {
    this.scanAnimation = Animated.timing(this.state.animValue, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    })
    this.scanAnimation.start(({ finished }) => {
      if(finished){
        this.state.animValue.setValue(0)
        this._startAnim()
      }
    })
  }

  _stopAnim = () => {
    this.scanAnimation && this.scanAnimation.reset()
    this.state.animValue.setValue(0)
  }

  // 父组件回调扫描结果
  // onScanCallback = result => {
  //   const valid = this._checkInfoValid(result)
  //   let point
  //   if(valid){
  //     point = JSON.parse(result)
  //   }
  //   if(valid){
  //     this.setState({
  //       scanning: false,
  //       showStatus: 'main',
  //       longitude: point.x,
  //       latitude: point.y,
  //       height: point.h,
  //     })
  //     Toast.show("定位成功")
  //   }else{
  //     this._stopAnim()
  //     this.setState({
  //       scanning: false,
  //     })
  //     Toast.show("未识别到二维码信息")
  //   }
  // }

  getPositionData = () => {
    const { longitude, latitude, height } = this.state
    return {
      x: longitude,
      y: latitude,
      h: height,
    }
  }

  _checkInfoValid = info => {
    try {
      if(info == "" || info == undefined || info == null) return false
      const obj = typeof info === 'string' ? JSON.parse(info) : info
      return !isNaN(Number(obj.x))  && !isNaN(Number(obj.y)) && !isNaN(Number(obj.h))
    } catch (error) {
      return false
    }
  }

  _startScan = async () => {
    const { startScan } = this.props
    // 父组件完成扫描逻辑
    const result = await startScan()
    let point
    if(this._checkInfoValid(result)){
      point = JSON.parse(result)
      this.setState({
        scanning: false,
        showStatus: 'main',
        longitude: point.x,
        latitude: point.y,
        height: point.h,
      })
      this.scanTimes = 0
      this._stopAnim()
      Toast.show(getLanguage(GLOBAL.language).Profile.MAR_AR_PICTURE_LOCATION_SUCCEED)
    }else if(this.scanTimes < 10){
      this.scanTimes++
      setTimeout(()=>{
        this._startScan()
      },200)
    }else{
      this._stopAnim()
      this.setState({
        scanning: false,
      })
      this.scanTimes = 0
      Toast.show(getLanguage(GLOBAL.language).Profile.MAR_AR_QR_INVALID)
    }
  }

  _onScanClick = () => {
    this.setState({
      scanning: true,
      activeBtn: 0,
    })
    this._startAnim()
    this._startScan()
  }

  // 过滤输入值
  clearNoNum = value => {
    value = value.replace(/[^\d.]/g, '') //清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, '.') //只保留第一个. 清除多余的
    value = value
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
    // value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
    if (value.indexOf('.') < 0 && value != '') {
      //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      value = parseFloat(value)
    } else if (value == '') {
      value = 0
    }
    return value + ''
  }

  // 自动定位
  _autoLocation = async () => {
    GLOBAL.Loading.setLoading(
      true,
      getLanguage(GLOBAL.language).Profile.MAP_AR_DATUM_AUTO_LOCATIONING,
    )
    let position = await SMap.getCurrentPosition()

    this.setState({
      longitude: position.x,
      latitude: position.y,
      height: position.h || 1.5,
      activeBtn: 2,
    })

    GLOBAL.Loading.setLoading(false)
    Toast.show(
      getLanguage(GLOBAL.language).Profile.MAP_AR_DATUM_AUTO_LOCATION_SUCCEED,
    )
  }

  // 地图选点
  _mapSelectPoint = async () => {
    const { longitude, latitude } = this.state
    this.setState({
      activeBtn: 1,
    })
    if (this.state.type === 'ARNAVIGATION_INDOOR') {
      //暂存点，返回地图选点时使用
      GLOBAL.SELECTPOINTLATITUDEANDLONGITUDETEMP = {x: Number(longitude), y: Number(latitude)}

      GLOBAL.TouchType = TouchType.MAP_SELECT_POINT
      GLOBAL.MAPSELECTPOINT.setVisible(true)

      NavigationService.navigate('MapView', {selectPointType: 'SELECTPOINTFORARNAVIGATION_INDOOR'})
      SMap.setAction(Action.PAN)
    } else {
      //暂存点，返回地图选点时使用
      GLOBAL.SELECTPOINTLATITUDEANDLONGITUDETEMP = {x: Number(longitude), y: Number(latitude)}

      GLOBAL.ToolBar.setVisible(false)

      GLOBAL.MapXmlStr = await SMap.mapToXml()

      GLOBAL.TouchType = TouchType.MAP_SELECT_POINT
      GLOBAL.MAPSELECTPOINT.setVisible(true)

      //导航选点 全屏时保留mapController
      GLOBAL.mapController && GLOBAL.mapController.setVisible(true)

      let map = await SMap.getCurrentPosition()
      let wsData = JSON.parse(JSON.stringify(ConstOnline.Google))
      wsData.layerIndex = 3
      let licenseStatus = await SMap.getEnvironmentStatus()
      GLOBAL.isLicenseValid = licenseStatus.isLicenseValid
      NavigationService.navigate('MapView', {
        // NavigationService.navigate('MapViewSingle', {
        // wsData,
        isExample: true,
        noLegend: true,
        // mapName: message.originMsg.message.message.message,
        // showMarker: {
        //   x: map.x,
        //   y: map.y,
        // },
        // selectPointType: 'selectPoint',
        selectPointType: 'DatumPointCalibration',
        backPage: this.props.routeName,
      })
      GLOBAL.toolBox.showFullMap(true)
      GLOBAL.TouchType = TouchType.MAP_SELECT_POINT
      // let point = {
      // x: map.x,
      // y: map.y,
      // }
      // GLOBAL.MAPSELECTPOINT.openSelectPointMap(wsData, point)
      SMap.setAction(Action.PAN)
      GLOBAL.scaleView.isvisible(false)
      GLOBAL.mapController.setVisible(true)
      GLOBAL.mapController.move({
        bottom: scaleSize(80),
        left: 'default',
      })
    }
  }

  _renderInputs = () => {
    const { longitude, latitude } = this.state
    return (
      <View>
        <View style={styles.inputBox}>
          <Image source={getThemeAssets().collection.icon_lines} style={styles.inputIcon}/>
          <Text style={{paddingLeft: scaleSize(8)}}>{getLanguage(GLOBAL.language).Profile.X_COORDINATE}</Text>
          <Input style={styles.input} showClear={true} textAlign={'left'} keyboardType={'number-pad'}
            value={longitude}
            onChangeText={text => {
              this.setState({longitude: this.clearNoNum(text)})
            }}
            onClear={() => {
              this.setState({longitude: ""})
            }}/>
        </View>
        <View style={styles.inputBox}>
          <Image source={getThemeAssets().collection.icon_latitudes} style={styles.inputIcon}/>
          <Text style={{paddingLeft: scaleSize(8)}}>{getLanguage(GLOBAL.language).Profile.Y_COORDINATE}</Text>
          <Input style={styles.input} showClear={true} textAlign={'left'} keyboardType={'number-pad'}
            value={latitude}
            onChangeText={text => {
              this.setState({latitude: this.clearNoNum(text)})
            }}
            onClear={() => {
              this.setState({latitude: ""})
            }}/>
        </View>
      </View>
    )
  }

  _renderBtns = () => {
    const { activeBtn } = this.state
    return (
      <View style={styles.buttons}>
        {/* 图片定位 */}
        <TouchableOpacity style={{
          justifyContent: 'center',
          alignItems: 'center',
        }} onPress={() => {
          this.setState({
            showStatus: 'scan',
          })
        }}>
          <View style={[styles.button, activeBtn == 0 && {borderWidth: 1, borderColor: '#007aff'}]}>
            <Image source={getThemeAssets().collection.icon_scan} style={styles.buttonIcon}/>
          </View>
          <Text style={styles.buttonText}>{getLanguage(GLOBAL.language).Profile.MAR_AR_DATUM_PICTURE_LOCATION}</Text>
        </TouchableOpacity>

        {/* 地图选点 */}
        <TouchableOpacity style={{
          justifyContent: 'center',
          alignItems: 'center',
        }} onPress={this._mapSelectPoint}>
          <View style={[styles.button, activeBtn == 1 && {borderWidth: 1, borderColor: '#007aff'}]}>
            <Image source={getThemeAssets().collection.icon_map_selection} style={styles.buttonIcon}/>
          </View>
          <Text style={styles.buttonText}>{getLanguage(GLOBAL.language).Profile.MAP_AR_DATUM_MAP_SELECT_POINT}</Text>
        </TouchableOpacity>

        {/* 自动定位 */}
        <TouchableOpacity style={{
          justifyContent: 'center',
          alignItems: 'center',
        }} onPress={this._autoLocation}>
          <View style={[styles.button, activeBtn == 2 && {borderWidth: 1, borderColor: '#007aff'}]}>
            <Image source={getThemeAssets().collection.icon_location} style={styles.buttonIcon}/>
          </View>
          <Text style={styles.buttonText}>{getLanguage(GLOBAL.language).Profile.MAP_AR_DATUM_AUTO_LOCATION}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderContent = () => {
    return (
      <View style={styles.container}>
        <View style={styles.viewBox}>
          <View style={styles.titleBox}>
            <Text style={styles.title}>{getLanguage(GLOBAL.language).Profile.MAR_AR_POSITION_CORRECT}</Text>
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: scaleSize(-20),
              }}
              onPress={()=>{
                this.setState({
                  showStatus: 'setting',
                })
              }}
            >
              <Image style={styles.titleBtn} source={getThemeAssets().collection.icon_general_full} />
            </TouchableOpacity>
          </View>
          <Text style={styles.subTitle}>{getLanguage(GLOBAL.language).Profile.MAP_AR_TOWARDS_NORTH}</Text>
          <Image source={getThemeAssets().collection.icon_mobile_position} style={styles.iconPhone} />
          {this._renderInputs()}
          {this._renderBtns()}
        </View>
        <TouchableOpacity style={styles.closeBtn} onPress={this._onClose}>
          <Image source={getThemeAssets().mapTools.icon_tool_cancel} style={styles.closeIcon}/>
        </TouchableOpacity>
      </View>
    )
  }

  _renderScan = () => {
    const { scanning } = this.state
    const transY = this.state.animValue.interpolate({
      inputRange: [0,1],
      outputRange: [scaleSize(0),scaleSize(540)],
    })
    const opacity = this.state.animValue.interpolate({
      inputRange: [0,0.25,0.75,1],
      outputRange: [0,1,1,0],
    })
    return (
      <View style={styles.scanContainer}>
        <View style={styles.scanMask}>
          <Text style={[styles.scanTip, {marginBottom: scaleSize(20)}]}>{getLanguage(GLOBAL.language).Profile.MAP_AR_SCAN_TIP}</Text>
        </View>
        <View style={styles.scanMaskCenter}>
          <View style={styles.scanMask}></View>
          <View style={styles.scanWindow}>
            <Animated.View style={{
              opacity,
              transform: [{ translateY: transY }],
            }}>
              <Image source={getThemeAssets().collection.bg_scan_line} style={styles.scanLine} />
            </Animated.View>
          </View>
          <View style={styles.scanMask}></View>
        </View>
        <View style={styles.scanMask}>
          {!scanning && <TouchableOpacity style={styles.scanButton} onPress={this._onScanClick}>
            <Image source={getThemeAssets().collection.icon_scanit} style={styles.scanButtonImg} />
            <Text style={styles.scanTip}>{getLanguage(GLOBAL.language).Profile.MAP_AR_SCAN_IT}</Text>
          </TouchableOpacity>}
        </View>
        <TouchableOpacity style={[styles.closeBtn,{
          position: 'absolute',
          top: scaleSize(100),
          right: scaleSize(50),
        }]} onPress={()=>{
          this.scanTimes = 0
          this.setState({
            scanning: false,
            showStatus: 'main',
          })
        }}>
          <Image source={getThemeAssets().mapTools.icon_tool_cancel} style={styles.closeIcon}/>
        </TouchableOpacity>
      </View>
    )
  }

  _renderSetting = () => {
    const { longitude, latitude, height } = this.state
    return (
      <View style={styles.bgContainer}>
        <Container
          headerProps={{
            title: getLanguage(GLOBAL.language).Profile.MAP_AR_DATUM_SETTING,
            backAction:()=>{
              this.setState({
                showStatus: 'main',
              })
            },
          }}
        >
          <View style={{paddingHorizontal: scaleSize(60)}}>
            <View style={styles.listItem}>
              <Image source={getThemeAssets().collection.icon_coordinate} style={styles.listIcon} />
              <Text>{getLanguage(GLOBAL.language).Profile.MAP_AR_DATUM_POSITION}</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.itemL}>{getLanguage(GLOBAL.language).Profile.MAP_AR_DATUM_LONGITUDE}</Text>
              <Input style={styles.itemR} showClear={true} textAlign={'left'} keyboardType={'number-pad'}
                value={longitude}
                onChangeText={text => {
                  this.setState({longitude: this.clearNoNum(text)})
                }}
                onClear={() => {
                  this.setState({longitude: ""})
                }}/>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.itemL}>{getLanguage(GLOBAL.language).Profile.MAP_AR_DATUM_LATITUDE}</Text>
              <Input style={styles.itemR} showClear={true} textAlign={'left'} keyboardType={'number-pad'}
                value={latitude}
                onChangeText={text => {
                  this.setState({latitude: this.clearNoNum(text)})
                }}
                onClear={() => {
                  this.setState({latitude: ""})
                }}/>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.itemL}>{getLanguage(GLOBAL.language).Profile.MAP_AR_DATUM_HEIGHT}</Text>
              <Input style={styles.itemR} showClear={true} textAlign={'left'} keyboardType={'number-pad'}
                value={height}
                onChangeText={text => {
                  this.setState({height: text})
                }}
                onClear={() => {
                  this.setState({height: ""})
                }}/>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.itemL}>{getLanguage(GLOBAL.language).Profile.MAP_AR_DATUM_DIRECTION}</Text>
              <Text style={[styles.itemR,{ paddingHorizontal: scaleSize(20)}]}>{getLanguage(GLOBAL.language).Profile.MAR_AR_DATUM_NORTH}</Text>
            </View>
            <View style={{marginTop: scaleSize(60)}}>
              {this._renderBtns()}
            </View>
          </View>
        </Container>
      </View>
    )
  }

  render() {
    const { close, showStatus } = this.state
    let content = null
    switch(showStatus){
      case 'main': content = this._renderContent()
        break
      case 'scan': content = this._renderScan()
        break
      case 'setting': content = this._renderSetting()
        break
    }
    return (
      <>{close ? null : content}</>
    )
  }
}
