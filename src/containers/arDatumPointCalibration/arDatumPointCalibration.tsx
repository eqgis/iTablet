import React, { Component } from 'react'
import {  View, Image, Text, TouchableOpacity, Animated, Dimensions } from 'react-native'
import { getThemeAssets } from '../../assets'
import { getLanguage } from '../../language'
import Input from '../../components/Input'
import { AppStyle, scaleSize, Toast } from '../../utils/index'
import { SMap, Action ,SARMap} from 'imobile_for_reactnative'
import NavigationService from '../../containers/NavigationService'
import { ChunkType, TouchType } from '../../constants'
import { Container } from '../../components'
import styles from './styles'
import { dp } from '../../utils'
import AREnhancePosition from './AREnhancePosition'
import Orientation from 'react-native-orientation'


interface IState {
  close: boolean,
  showStatus: 'main' | 'scan' | 'setting' | 'arEnhance',
  scanning: boolean,
  activeBtn: number,
  latitude: string,
  longitude: string,
  animValue: any,
}

interface IProps {
  onClose: Function, // 选点结束回调
  onConfirm: Function, // 选点确认
  startScan: Function, // 调用各自界面的camera进行二维码扫描
  routeName: string,
  routeData: Object,
  imageTrackingresultTag: string, // ar增强定位的返回结果
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
    if (global.SELECTPOINTLATITUDEANDLONGITUDE) {
      position = global.SELECTPOINTLATITUDEANDLONGITUDE
    }else {
      position = await SMap.getCurrentPosition()
    }
    this.setState({
      longitude: position.x,
      latitude: position.y,
    })
  }

  _onClose = async () => {
    // 点击关闭使用当前定位
    const { onClose } = this.props
    const curPoint = await SMap.getCurrentPosition()
    curPoint.h = 1.5
    onClose && onClose(curPoint)
    this.setState({
      close: true,
    })
  }

  _onConfirm = () => {
    // 定义确定使用修改过的值定位
    const { longitude, latitude, height } = this.state
    const { onConfirm } = this.props
    onConfirm && onConfirm({
      x: longitude,
      y: latitude,
      h: height,
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
      x: Number(longitude),
      y: Number(latitude),
      h: Number(height),
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
      Toast.show(getLanguage(global.language).Profile.MAR_AR_PICTURE_LOCATION_SUCCEED)
    }else if(this.scanTimes < 100){
      this.scanTimes++
      setTimeout(()=>{
        this._startScan()
      },100)
    }else{
      this._stopAnim()
      this.setState({
        scanning: false,
      })
      this.scanTimes = 0
      Toast.show(getLanguage(global.language).Profile.MAR_AR_QR_INVALID)
    }
  }

  _onScanClick = () => {
    this.setState({
      scanning: true,
      activeBtn: 0,
    })
    this._startAnim()
    // 让动画先显示
    setTimeout(()=>{
      this._startScan()
    }, 500)
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
    global.Loading.setLoading(
      true,
      getLanguage(global.language).Profile.MAP_AR_DATUM_AUTO_LOCATIONING,
    )
    const position = await SMap.getCurrentPosition()

    this.setState({
      longitude: position.x,
      latitude: position.y,
      height: position.h || 1.5,
      activeBtn: 2,
    })

    global.Loading.setLoading(false)
    Toast.show(
      getLanguage(global.language).Profile.MAP_AR_DATUM_AUTO_LOCATION_SUCCEED,
    )
  }

  // 地图选点
  _mapSelectPoint = async () => {
    const { longitude, latitude } = this.state
    this.setState({
      activeBtn: 1,
    })
    if (this.props.routeName === "MapView") {
      NavigationService.navigate('SelectLocation', {
        cb: () => {
          this.setState({
            longitude: global.SELECTPOINTLATITUDEANDLONGITUDETEMP.x,
            latitude: global.SELECTPOINTLATITUDEANDLONGITUDETEMP.y,
          })
        },
      })
      global.SELECTPOINTLATITUDEANDLONGITUDETEMP = { x: Number(longitude), y: Number(latitude) }
    } else {
      if (this.state.type === 'ARNAVIGATION_INDOOR') {
        //暂存点，返回地图选点时使用
        global.SELECTPOINTLATITUDEANDLONGITUDETEMP = { x: Number(longitude), y: Number(latitude) }

        global.TouchType = TouchType.MAP_SELECT_POINT
        global.MAPSELECTPOINT.setVisible(true)

        NavigationService.navigate('MapView', {selectPointType: 'SELECTPOINTFORARNAVIGATION_INDOOR'})
        SMap.setAction(Action.PAN)
      } else {
        //暂存点，返回地图选点时使用
        global.SELECTPOINTLATITUDEANDLONGITUDETEMP = {x: Number(longitude), y: Number(latitude)}

        global.ToolBar.setVisible(false)

        global.MapXmlStr = await SMap.mapToXml()

        global.TouchType = TouchType.MAP_SELECT_POINT
        global.MAPSELECTPOINT.setVisible(true)

        //导航选点 全屏时保留mapController
        global.mapController && global.mapController.setVisible(true)

        // let map = await SMap.getCurrentPosition()
        // let wsData = JSON.parse(JSON.stringify(ConstOnline.Google))
        // wsData.layerIndex = 3
        const licenseStatus = await SMap.getEnvironmentStatus()
        global.isLicenseValid = licenseStatus.isLicenseValid
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
          routeData: this.props.routeData,
        })
        global.toolBox.showFullMap(true)
        global.TouchType = TouchType.MAP_SELECT_POINT
        // let point = {
        // x: map.x,
        // y: map.y,
        // }
        // global.MAPSELECTPOINT.openSelectPointMap(wsData, point)
        SMap.setAction(Action.PAN)
        global.scaleView.isvisible(false)
        global.mapController.setVisible(true)
        global.mapController.move({
          bottom: scaleSize(50),
          left: 'default',
        })
      }
    }
  }

  _renderInputs01 = () => {
    const { longitude, latitude, height } = this.state
    return (
      <View style={{marginTop: scaleSize(40), marginBottom: scaleSize(20)}}>
        <View style={styles.inputBox}>
          <Image source={getThemeAssets().collection.icon_lines} style={styles.inputIcon}/>
          <Text style={{paddingLeft: scaleSize(8)}}>{getLanguage(global.language).Profile.MAP_AR_DATUM_LONGITUDE}</Text>
          <Input style={styles.input} showClear={longitude != 0} textAlign={'left'} keyboardType={'number-pad'}
            value={longitude + ''}
            onChangeText={text => {
              this.setState({longitude: this.clearNoNum(text)})
            }}
            onClear={() => {
              // 多次clear value都是0 不会引起Input更新 但是Input自己把value设置为了‘’
              // 所以值为0时 不显示clear按钮
              this.setState({longitude: "0"})
            }}/>
        </View>
        <View style={styles.inputBox}>
          <Image source={getThemeAssets().collection.icon_latitudes} style={styles.inputIcon}/>
          <Text style={{paddingLeft: scaleSize(8)}}>{getLanguage(global.language).Profile.MAP_AR_DATUM_LATITUDE}</Text>
          <Input style={styles.input} showClear={latitude != 0} textAlign={'left'} keyboardType={'number-pad'}
            value={latitude + ''}
            onChangeText={text => {
              this.setState({latitude: this.clearNoNum(text)})
            }}
            onClear={() => {
              this.setState({latitude: "0"})
            }}/>
        </View>
        <View style={styles.inputBox}>
          <Image source={getThemeAssets().collection.icon_ar_height} style={styles.inputIcon}/>
          <Text style={{paddingLeft: scaleSize(8)}}>{getLanguage(global.language).Profile.MAP_AR_DATUM_HEIGHT}</Text>
          <Input style={styles.input} showClear={height != 0} textAlign={'left'} keyboardType={'number-pad'}
            value={height + ''}
            onChangeText={text => {
              this.setState({height: this.clearNoNum(text)})
            }}
            onClear={() => {
              this.setState({height: "0"})
            }}/>
        </View>
      </View>
    )
  }

  _renderBtns01 = () => {
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
          <Text style={styles.buttonText}>{getLanguage(global.language).Profile.MAR_AR_DATUM_PICTURE_LOCATION}</Text>
        </TouchableOpacity>

        {/* 地图选点 */}
        <TouchableOpacity style={{
          justifyContent: 'center',
          alignItems: 'center',
        }} onPress={this._mapSelectPoint}>
          <View style={[styles.button, activeBtn == 1 && {borderWidth: 1, borderColor: '#007aff'}]}>
            <Image source={getThemeAssets().collection.icon_map_selection} style={styles.buttonIcon}/>
          </View>
          <Text style={styles.buttonText}>{getLanguage(global.language).Profile.MAP_AR_DATUM_MAP_SELECT_POINT}</Text>
        </TouchableOpacity>

        {/* 自动定位 */}
        <TouchableOpacity style={{
          justifyContent: 'center',
          alignItems: 'center',
        }} onPress={this._autoLocation}>
          <View style={[styles.button, activeBtn == 2 && {borderWidth: 1, borderColor: '#007aff'}]}>
            <Image source={getThemeAssets().collection.icon_location} style={styles.buttonIcon}/>
          </View>
          <Text style={styles.buttonText}>{getLanguage(global.language).Profile.MAP_AR_DATUM_AUTO_LOCATION}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderInputs = () => {
    const { longitude, latitude, height } = this.state
    return (
      <View style={{marginTop: scaleSize(40), marginBottom: scaleSize(20)}}>
        <View style={styles.inputBox}>
          {/* <Image source={getThemeAssets().collection.icon_lines} style={styles.inputIcon}/> */}
          <Text style={{paddingRight: scaleSize(18)}}>{"X"}</Text>
          <Input style={styles.input} showClear={longitude != 0} textAlign={'left'} keyboardType={'number-pad'}
            value={longitude + ''}
            onChangeText={text => {
              this.setState({longitude: this.clearNoNum(text)})
            }}
            onClear={() => {
              // 多次clear value都是0 不会引起Input更新 但是Input自己把value设置为了‘’
              // 所以值为0时 不显示clear按钮
              this.setState({longitude: "0"})
            }}/>
        </View>
        <View style={styles.inputBox}>
          {/* <Image source={getThemeAssets().collection.icon_latitudes} style={styles.inputIcon}/> */}
          <Text style={{paddingRight: scaleSize(18)}}>{"Y"}</Text>
          <Input style={styles.input} showClear={latitude != 0} textAlign={'left'} keyboardType={'number-pad'}
            value={latitude + ''}
            onChangeText={text => {
              this.setState({latitude: this.clearNoNum(text)})
            }}
            onClear={() => {
              this.setState({latitude: "0"})
            }}/>
        </View>
        <View style={styles.inputBox}>
          {/* <Image source={getThemeAssets().collection.icon_ar_height} style={styles.inputIcon}/> */}
          <Text style={{paddingRight: scaleSize(18)}}>{"H"}</Text>
          <Input style={styles.input} showClear={height != 0} textAlign={'left'} keyboardType={'number-pad'}
            value={height + ''}
            onChangeText={text => {
              this.setState({height: this.clearNoNum(text)})
            }}
            onClear={() => {
              this.setState({height: "0"})
            }}/>
        </View>
      </View>
    )
  }

  _renderBtns = () => {
    const { activeBtn } = this.state
    const titleWidth = 80
    return (
      <View
        style={{
          flexDirection: 'row',
          // marginTop: dp(6),
          marginBottom: dp(6),
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flex:1
        }}
      >
        {/* 自动定位部分 */}
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flex:1,
            borderRightWidth: dp(1),
            borderColor: '#F8F8F8',
            paddingRight: dp(2),
          }}
        >
          <Text
            numberOfLines={2}
            style={[AppStyle.h3c,
              { color: '#707070',
                maxWidth: dp(titleWidth + 20),
                width: dp(titleWidth),
                fontSize: dp(14),
                textAlign: 'left',
                paddingBottom: dp(6),
              },
              // styleTemp
            ]
            }
          >
            {getLanguage(global.language).Profile.MAP_AR_DATUM_AUTO_LOCATION}
          </Text>

          <View style={styles.buttons}>
            {/* ar增强定位 */}
            <TouchableOpacity style={{
              justifyContent: 'center',
              alignItems: 'center',
            }} onPress={() => {

              // 调用ar增强定位的方法获取定位
              SARMap.setAREnhancePosition()
              // 跳转到扫描界面
              this.setState({
                showStatus: 'arEnhance',
              })
            }}>
              <View style={[styles.button, activeBtn == 3 && {borderWidth: 1, borderColor: '#ccc'}]}>
                <Image source={getThemeAssets().collection.icon_ar_enhance} style={styles.buttonIcon}/>
              </View>
              <Text style={styles.buttonText}>{getLanguage(global.language).Profile.MAP_AR_ENHANCE_POSITION}</Text>
            </TouchableOpacity>
          </View>



        </View>

        {/* 手动定位部分 */}
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flex:3,
            paddingLeft: dp(6),
          }}
        >
          <Text
            numberOfLines={2}
            style={[AppStyle.h3,
              { color: '#707070',
                maxWidth: dp(titleWidth + 20),
                width: dp(titleWidth),
                fontSize: dp(14),
                textAlign: 'center',
                paddingBottom: dp(6),
              },
              // styleTemp
            ]}
          >
            {getLanguage(global.language).Profile.MAP_AR_DATUM_MANUAL_LOCATION}
          </Text>

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
              <View style={[styles.button, activeBtn == 0 && {borderWidth: 1, borderColor: '#ccc'}]}>
                <Image source={getThemeAssets().collection.icon_scan} style={styles.buttonIcon}/>
              </View>
              <Text style={styles.buttonText}>{getLanguage(global.language).Profile.MAR_AR_DATUM_PICTURE_LOCATION}</Text>
            </TouchableOpacity>

            {/* 地图选点 */}
            <TouchableOpacity style={{
              justifyContent: 'center',
              alignItems: 'center',
            }} onPress={this._mapSelectPoint}>
              <View style={[styles.button, activeBtn == 1 && {borderWidth: 1, borderColor: '#ccc'}]}>
                <Image source={getThemeAssets().collection.icon_map_selection} style={styles.buttonIcon}/>
              </View>
              <Text style={styles.buttonText}>{getLanguage(global.language).Profile.MAP_AR_DATUM_MAP_SELECT_POINT}</Text>
            </TouchableOpacity>

            {/* GPS定位 */}
            <TouchableOpacity style={{
              justifyContent: 'center',
              alignItems: 'center',
            }} onPress={this._autoLocation}>
              <View style={[styles.button, activeBtn == 2 && {borderWidth: 1, borderColor: '#ccc'}]}>
                <Image source={getThemeAssets().collection.icon_location} style={styles.buttonIcon}/>
              </View>
              <Text style={styles.buttonText}>{getLanguage(global.language).Profile.MAP_AR_DATUM_GPS_LOCATION}</Text>
            </TouchableOpacity>
          </View>

        </View>

      </View>




    )
  }

  _renderContent = () => {

    // 获取屏幕的宽高
    const screenWidth = Dimensions.get('window').width
    const screemHeight = Dimensions.get('window').height

    //设置宽度的最大最小值
    let widthTemp = 616
    if(screenWidth > 500) {
      widthTemp = 656
    }
    // 设置高度的最大最小值
    let heightTemp = 990
    if(screemHeight > 900){
      heightTemp = 1000
    }
    // 判断当前屏幕的横竖屏
    const orientation = Orientation.getInitialOrientation()
    // 横屏状态下，将
    if(orientation === 'LANDSCAPE') {
      if(screenWidth > 1000) {
        widthTemp = 1000
        heightTemp = 960
      }
    }

    return (
      <View style={styles.container}>
        <View style={[styles.viewBox, {
          height: scaleSize(heightTemp),
          width: scaleSize(widthTemp),
        }]}>
          <View style={styles.titleBox}>
            <Image style={{
              height: scaleSize(150),
              width: scaleSize(150),
            }}
            source={getThemeAssets().mapTools.icon_mobile}
            />

            {/* <Text style={styles.title}>{getLanguage(global.language).Profile.MAR_AR_POSITION_CORRECT}</Text> */}
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: scaleSize(-20),
                top: scaleSize(16),
              }}
              onPress={this._onClose}
            >
              <Image style={styles.titleBtn} source={getThemeAssets().mapTools.icon_tool_cancel} />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>{getLanguage(global.language).Profile.MAR_AR_POSITION_CORRECT}</Text>
          <Text style={styles.subTitle}>{getLanguage(global.language).Profile.MAP_AR_TOWARDS_NORTH}</Text>
          {this._renderInputs()}
          {this._renderBtns()}
          <TouchableOpacity style={{
            width: scaleSize(200),
            height: scaleSize(60),
            borderRadius: scaleSize(30),
            backgroundColor: '#505050',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: scaleSize(100),
          }} onPress={this._onConfirm}>
            <Text style={{
              color: '#ffffff',
              fontSize: scaleSize(22),
            }}>{getLanguage(global.language).Profile.MAP_AR_DATUM_SURE}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _renderScan = () => {
    if(global.Type === ChunkType.MAP_AR_MAPPING){
      SARMap.measuerPause(true)
    }
    const { scanning } = this.state
    const transY = this.state.animValue.interpolate({
      inputRange: [0,1],
      outputRange: [scaleSize(0),scaleSize(512 - 100)],
    })
    const opacity = this.state.animValue.interpolate({
      inputRange: [0,0.25,0.75,1],
      outputRange: [0,1,1,0],
    })
    return (
      <View style={styles.scanContainer}>
        <View style={styles.scanMask}>
          <Image source={getThemeAssets().collection.scan_tip} style={styles.scanTipImg} />
          <Text style={styles.scanTip}>{getLanguage(global.language).Profile.MAP_AR_SCAN_TIP}</Text>
        </View>
        <View style={styles.scanMaskCenter}>
          <View style={styles.scanMask}></View>
          <View style={styles.scanWindow}>
            {/* 图片有间隙 用View实现四个角 */}
            <View style={styles.windowCornerLT}></View>
            <View style={styles.windowCornerLB}></View>
            <View style={styles.windowCornerRT}></View>
            <View style={styles.windowCornerRB}></View>
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
            <Text style={{color: '#ffffff', textAlign: 'center'}}>{getLanguage(global.language).Profile.MAP_AR_SCAN_IT}</Text>
          </TouchableOpacity>}
        </View>
        <TouchableOpacity style={{
          position: 'absolute',
          top: scaleSize(20),
          left: scaleSize(20)}} onPress={()=>{
          this.scanTimes = 0
          this.setState({
            scanning: false,
            showStatus: 'main',
          })
        }}>
          <Image source={getThemeAssets().collection.icon_ar_scan_back} style={styles.closeIcon}/>
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
            title: getLanguage(global.language).Profile.MAP_AR_DATUM_SETTING,
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
              <Text>{getLanguage(global.language).Profile.MAP_AR_DATUM_POSITION}</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.itemL}>{getLanguage(global.language).Profile.MAP_AR_DATUM_LONGITUDE}</Text>
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
              <Text style={styles.itemL}>{getLanguage(global.language).Profile.MAP_AR_DATUM_LATITUDE}</Text>
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
              <Text style={styles.itemL}>{getLanguage(global.language).Profile.MAP_AR_DATUM_HEIGHT}</Text>
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
              <Text style={styles.itemL}>{getLanguage(global.language).Profile.MAP_AR_DATUM_DIRECTION}</Text>
              <Text style={[styles.itemR,{ paddingHorizontal: scaleSize(20)}]}>{getLanguage(global.language).Profile.MAR_AR_DATUM_NORTH}</Text>
            </View>
            <View style={{marginTop: scaleSize(60)}}>
              {this._renderBtns()}
            </View>
          </View>
        </Container>
      </View>
    )
  }

  /** ar增强定位的扫描界面的渲染 */
  _renderEnhanceScan = () => {
    if(global.Type === ChunkType.MAP_AR_MAPPING){
      SARMap.measuerPause(true)
    }
    return (
      <AREnhancePosition
        ref ={(ref) => {this.arEnhancePosition = ref}}
        imageTrackingresultTag = {this.props.imageTrackingresultTag}
        onBack = {() => {
          SARMap.stopAREnhancePosition()
          this.setState({
            showStatus: 'main'
          })

        }}
        onSuccess = {() => {
          // 定位成功走的方法
          // 关闭校准界面
          this._onClose()
        }}
      />
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
      case 'arEnhance' : content = this._renderEnhanceScan()
        break
    }
    return (
      <>{close ? null : content}</>
    )
  }
}
