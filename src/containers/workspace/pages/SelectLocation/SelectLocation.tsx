
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
  Animated,
  TouchableHighlight,
} from 'react-native'
import { MapController } from '../../components'
import {
  Container,
  Input,
} from '../../../../components'
import { SMMapView2, SMap2, SMap } from 'imobile_for_reactnative'
import {
  scaleSize,
  Toast,
  setSpText,
} from '../../../../utils'
import { getLanguage } from '../../../../language/index'
import { getThemeAssets } from '../../../../assets'
import ToolBarSectionList from '../../../workspace/components/ToolBar/components/ToolBarSectionList'
import {
  layerManagerData,
  ConstToolType,
  OpenData2,
  ConstOnline,
} from '../../../../constants'

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
  isShow: boolean

  constructor(props: Props) {
    super(props)
    this.homePath = ''
    this.state = {
      x: global.SELECTPOINTLATITUDEANDLONGITUDETEMP.x,
      y: global.SELECTPOINTLATITUDEANDLONGITUDETEMP.y,
      bottom: new Animated.Value(
        -Math.max(this.props.device.height, this.props.device.width),
      ),
    }
    this.cb = this.props.navigation?.state?.params?.cb
    this.isShow = false
  }

  componentWillUnmount() {
    SMap2.removeLocationCallout()
    // else {
    //   iOSEventEmi.removeListener(
    //     "com.supermap.RN.Mapcontrol.single_tap_event_two",
    //     this.onSingleTap,
    //   )
    // }
  }

  componentDidMount() {
    // if (Platform.OS === 'ios') {
    //   debugger
    //   iOSEventEmi.addListener(
    //     "com.supermap.RN.Mapcontrol.single_tap_event_two",
    //     this.onSingleTap,
    //   )
    // }
  }

  onSingleTap = async (event: SMap2.ITouchEvent) => {
    let point
    if (Platform.OS === 'ios') {
      point = event.LLPoint
      // SMap.addSelectPoint(event.mapPoint)
    } else {
      point = await SMap2.pixelToLL(event.screenPoint)
      // SMap2.addLocationCallout(event.mapPoint)
    }
    SMap2.addLocationCallout(event.mapPoint)
    if (point) {
      this.setState({
        x: point.x,
        y: point.y,
      })
      global.SELECTPOINTLATITUDEANDLONGITUDETEMP = { x: Number(this.state.x), y: Number(this.state.y) }
    }
  }

  openMap = async () => {
    const map = ConstOnline.tianditu()
    //刚初始化完mapview后添加会导致第一次的地图范围不对，设置个延时
    setTimeout(() => {
      SMap2.addToMap(map.DSParams, map.layerIndex)
    }, 1)
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
            <Image style={styles.inputIcon} source={getThemeAssets().collection.icon_lines} />
            <Text style={{marginLeft:scaleSize(10)}}>{getLanguage(global.language).Profile.MAP_AR_DATUM_LONGITUDE + ': '}</Text>
            <Input style={styles.input} editable={false} showClear={false} value={this.state.x} textAlign="left" />
          </View>
          <View style={styles.line}></View>
          <View style={styles.inputBox}>
            <Image style={styles.inputIcon} source={getThemeAssets().collection.icon_latitudes} />
            <Text style={{marginLeft:scaleSize(10)}}>{getLanguage(global.language).Profile.MAP_AR_DATUM_LATITUDE + ': '}</Text>
            <Input style={styles.input} editable={false} showClear={false} value={this.state.y} textAlign="left" />
          </View>
        </View>
      </View>
    )
  }

  renderChangeMap = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          position: 'absolute',
          right: scaleSize(20),
          borderRadius: scaleSize(60),
          top: scaleSize(150),
        }}
        onPress={() => {
          // this.closeSample()
          this.showToolbarAndBox(true)
        }}
      >
        <Image
          style={{ width: scaleSize(120), height: scaleSize(120) }}
          resizeMode={'contain'}
          source={getThemeAssets().publicAssets.icon_tool_switch}
        />
      </TouchableOpacity>
    )
  }

  back = () => {
    this.props.navigation.goBack()
  }

  location = async () => {
    let point
    // if (Platform.OS === 'ios') {
    //   SMap.moveToCurrent2().then(result => {
    //     !result &&
    //       Toast.show(getLanguage(global.language).Prompt.OUT_OF_MAP_BOUNDS)
    //   })
    //   point = await SMap.getCurrentPoint2()
    // } else 
    {
      SMap2.moveToCurrent()
      point = await SMap2.getCurrentPoint()
    }
    this.setState({
      x: point.x,
      y: point.y,
    })
    global.SELECTPOINTLATITUDEANDLONGITUDETEMP = { x: Number(this.state.x), y: Number(this.state.y) }
  }

  zoomin = () => {
    // if (Platform.OS === 'ios') {
    //   SMap.zoom2(2)
    // } else 
    {
      SMap2.zoom(2)
    }
  }

  zoomout = () => {
    // if (Platform.OS === 'ios') {
    //   SMap.zoom2(0.5)
    // } else 
    {
      SMap2.zoom(0.5)
    }
  }

  /** 地图选点header右边确定view */
  renderHeaderRight = () => {
    // let moreImg = getThemeAssets().publicAssets.icon_move
    return (
      <View
        style={{flexDirection: 'row'}}
      >
        {/* <TouchableOpacity
          style={{
            height: scaleSize(50),
            width: scaleSize(60),
            marginLeft: scaleSize(6),
            marginRight: scaleSize(6),
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            this.showToolbarAndBox(true)
          }}
        >
          <Image
            resizeMode={'contain'}
            style={{height:scaleSize(40),width:scaleSize(40)}}
            source={moreImg}
          />
        </TouchableOpacity> */}

        <TouchableOpacity
          key={'search'}
          onPress={async () => {
            this.props.navigation.goBack()
            this.cb && this.cb()
            // if (Platform.OS === 'ios') {
            //   SMap.closeMapControl2()
            // }
          }}
        >
          <Text style={styles.textConfirm}>
            {getLanguage(global.language).Map_Settings.CONFIRM}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  showToolbarAndBox = isShow => {
    // Toolbar的显示和隐藏
    if (this.isShow !== isShow) {
      isShow = isShow === undefined ? true : isShow
      Animated.timing(this.state.bottom, {
        toValue: isShow
          ? 0
          : -Math.max(this.props.device.height, this.props.device.width),
        duration: 300,
        useNativeDriver: false,
      }).start()
      this.isShow = isShow
    }
  }

  renderList = () => {
    let layerManagerDataArr = [...layerManagerData()]
    let data= [
      {
        title: '',
        data: layerManagerDataArr,
      },
    ]
    return (
      <ToolBarSectionList
        sections={data}
        device={this.props.device}
        renderItem={this.renderItem}
      />
    )
  }


  renderItem = data => {
    const { item, section:{ type } } = data
    return (
      <View>
        <TouchableHighlight
          onPress={() => {
            this.listAction({ section: item, type })
          }}
          underlayColor={color.headerBackground}
        >
          <View
            style={{
              height: scaleSize(86),
              backgroundColor: color.content_white,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {item.image && (
              <Image
                resizeMode={'contain'}
                style={{
                  marginLeft: scaleSize(60),
                  height: scaleSize(40),
                  width: scaleSize(40),
                }}
                source={item.image}
              />
            )}
            <Text
              style={{
                fontSize: setSpText(24),
                marginLeft: scaleSize(60),
                textAlign: 'center',
                backgroundColor: 'transparent',
              }}
            >
              {item.title}
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }


  listAction = ({ section, type }) => {
    if (section.action) {
      try {
        switch (section.title) {
          case 'Google labelmap':
            OpenData2(ConstOnline.Google, 4)
            break
          case 'GaoDe':
            OpenData2(ConstOnline.GAODE, 0)
            break
          case 'GaoDe Image':
            OpenData2(ConstOnline.GAODE, 1)
            break
          case 'BingMap':
            OpenData2(ConstOnline.BingMap, 0)
            break
          case 'Tianditu':
            {
              let data = []
              if (global.language === 'CN') {
                data.push(ConstOnline.tiandituCN())
              } else {
                data.push(ConstOnline.tiandituEN())
              }
              data.push(ConstOnline.tianditu())
              OpenData2(data, 0)
            }
            break
          case 'Tianditu Image':
            {
              let data = []
              if (global.language === 'CN') {
                data.push(ConstOnline.tiandituImgCN())
              } else {
                data.push(ConstOnline.tiandituImgEN())
              }
              data.push(ConstOnline.tiandituImg())
              OpenData2(data, 0)
            }
            break
          case 'Tianditu Terrain':
            {
              let data = []
              data.push(ConstOnline.tiandituTerCN())
              data.push(ConstOnline.tiandituTer())
              OpenData2(data, 0)
            }
            break
          case 'OSM':
            OpenData2(ConstOnline.OSM, 0)
            break
        }
      } catch (error) {
        console
      }
      this.showToolbarAndBox(false)
    }
  }

  //这里外面新增的view styl是因为android全面屏手机必须留一点空间，不然会导致底部工具栏刷新不全
  //ios必须铺满屏幕不然会有一直刷新崩溃问题
  render() {
    let containerStyle = styles.fullContainer
    let styl
    if (Platform.OS === 'android') {
      styl = {
        width:'100%',
        height:'90%',
      }
    }else{
      styl =  {
        flex: 1,
      }
    }
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
        <View style={styl}>
          <SMMapView2
            onLoad={this.openMap}
            onSingleTap={this.onSingleTap}
          />
        </View>
        <MapController
          bottomHeight={scaleSize(200)}
          selectLocation={this.location}
          selectZoomIn={this.zoomin}
          selectZoomOut={this.zoomout}
          device={this.props.device}
        />
        {this.renderBottom()}
        {this.renderChangeMap()}

        <Animated.View
          style={[
            containerStyle,
            { height: this.props.device.height, bottom: this.state.bottom },
          ]}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              this.showToolbarAndBox(false)
            }}
            style={styles.overlay}
          />
          <View style={styles.containers}>{this.renderList()}</View>
          {/*{this.renderDialog()}*/}
        </Animated.View>
      </Container>
    )
  }
}
import { color } from '../../../../styles'
// 地图按钮栏默认高度
const BUTTON_HEIGHT = scaleSize(80)
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
    marginLeft:scaleSize(10),
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
  fullContainer: {
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: color.gray,
    zIndex: 1e4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    // zIndex: zIndexLevel.FOUR,
  },
  containers: {
    flexDirection: 'column',
    maxHeight: ConstToolType.HEIGHT[3] + BUTTON_HEIGHT,
    minHeight: BUTTON_HEIGHT,
    backgroundColor: color.content_white,
  },
})
