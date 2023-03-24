import React from 'react'
import { View, Image, StyleSheet, Animated, TouchableOpacity, Text, ScaledSize, TextInput, ImageRequireSource } from 'react-native'
import { SARMap, SMap } from "imobile_for_reactnative"
import { AppStyle, dp, Toast } from '../../utils'
import { getImage, getThemeAssets } from '../../assets'
import { getLanguage } from '../../language'
import { formatFloat } from '@/utils/CheckUtils'
import QRScan from './QRScan'
import { ChunkType } from '@/constants'
import NavigationService from '../NavigationService'
import { ARAction } from 'imobile_for_reactnative/NativeModule/interfaces/ar/SARMap'

interface Props {
	onBack?: () => void
	onSubmit?: (param: {x: string, y: string, z: string}) => void
	windowSize: ScaledSize
}
interface State {
	/** 该页面展示的内容类型 */
	showStatus: "scan" | 'main'
	/** 该页面是否关闭 */
	close: boolean
	/** 经度 */
	x: string
	/** 纬度 */
  y: string
	/** 高程 */
  z: string
  xClearHiden: boolean
  yClearHiden: boolean
  zClearHiden: boolean
}

class SinglePointPositionPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      showStatus: 'main',
      close: false,
      x: '0',
      y: '0',
      z: '1.5',
      xClearHiden: true,
      yClearHiden: true,
      zClearHiden: true,
    }
  }

  componentDidMount = async () => {
    let position
    if (global.SELECTPOINTLATITUDEANDLONGITUDE) {
      position = global.SELECTPOINTLATITUDEANDLONGITUDE
      this.setState({
        x: position.x + '',
        y: position.y + '',
      })
    }else {
      position = await SMap.getCurrentLocation()
      this.setState({
        x: position.longitude + '',
        y: position.latitude + '',
      })
    }
  }


  selectPoint = () => {
    const longitude = this.state.x
    const latitude = this.state.y

    NavigationService.navigate('SelectLocation', {
      cb: () => {
        this.setState({
          x: global.SELECTPOINTLATITUDEANDLONGITUDETEMP.x + '',
          y: global.SELECTPOINTLATITUDEANDLONGITUDETEMP.y + '',
        })
      },
    })
    global.SELECTPOINTLATITUDEANDLONGITUDETEMP = { x: Number(longitude), y: Number(latitude) }

  }


  gotoScan = () => {
    this.setState({
      showStatus: 'scan',
    })
  }

  getCurrentLocation = async () => {
    const result = await SMap.getCurrentLocation()
    result && this.setState({
      x: result.longitude + '',
      y: result.latitude + '',
    })

  }

  /** 返回按钮 */
  renderBackBtn = () => {
    return (
      <TouchableOpacity style={styles.closeBtn} onPress={() => {
        this.props.onBack?.()
      }}>
        <Image source={getImage().icon_nav_back_white} style={{ width: dp(30), height: dp(30) }} />
      </TouchableOpacity>
    )
  }

  renderInput = (props: {
    image: ImageRequireSource,
    text: string,
    value: string,
    isHidenClearBtn?: boolean, // true不显示  false显示
    isHidenBottomLine?: boolean,  // true不显示  false显示
    onChange: (text:string) => void
    onClear: () => void
    onFocus?: () => void
    onBlur?: () => void
  }) => {
    return (
      <View style={styles.inputItem}>
        <Image
          source={props.image}
          style={[{
            width:dp(26),
            height: dp(26),
            marginRight: dp(5),
          }]}
        />
        <Text style={[AppStyle.h2, {marginRight: dp(18)}]}>
          {props.text}
        </Text>
        <TextInput
          style={[{
            flex: 1,
            fontSize: dp(13),
            padding: 0,
            height: dp(39),
            borderBottomWidth: dp(1),
            borderBottomColor: 'transparent',

          },
          !props.isHidenBottomLine && {
            borderBottomColor: '#ECECEC',
          },]}
          keyboardType={'numeric'}
          returnKeyType={'done'}
          defaultValue={props.value}
          value={props.value}
          onChangeText={(text: string) => {
            if(text !== '' && text !== '-') {
              text = formatFloat(text)
            }
            props.onChange(text)
          }}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
        />
        {props.value !== '' && props.value !== "0" && !props.isHidenClearBtn && (
          <TouchableOpacity
            onPress={props.onClear}
            style={[{
              position: 'absolute',
              right: 0,
              top: 0,
              height: '100%',
              width: dp(18),
              justifyContent: 'center',
              alignItems: 'center',
            // backgroundColor: '#f00',
            }]}
          >
            <Image
              source={getImage().icon_close}
              style={{...AppStyle.Image_Style_Small, tintColor: AppStyle.Color.GRAY}}
            />
          </TouchableOpacity>
        )}

      </View>
    )
  }

  renderInputs = () => {
    return (
      <View style={[
        styles.inputContainer,
        {
          paddingVertical: dp(10),
          flexDirection: 'row',
        }]}>
        <View
          style={[{
            flex: 1,
            height: dp(120),
            backgroundColor: '#f9f9f9',
            paddingHorizontal: dp(8),
            borderRadius: dp(16),

          }]}
        >
          {this.renderInput({
            image:getThemeAssets().collection.icon_lines,
            text: '经度:',
            value: this.state.x,
            onChange: text => {
              this.setState({x: text})
            },
            onClear: () => {
              this.setState({x: '0'})
            },
            isHidenClearBtn: this.state.xClearHiden,
            onFocus: () => {
              // 获取焦点 显示
              this.setState({
                xClearHiden: false,
              })
            },
            onBlur: () => {
              // 失去焦点 隐藏
              this.setState({
                xClearHiden: true,
              })
            },
          })}
          {this.renderInput({
            image:getThemeAssets().collection.icon_latitudes,
            text: '纬度:',
            value: this.state.y,
            onChange: text => {
              this.setState({y: text})
            },
            onClear: () => {
              this.setState({y: '0'})
            },
            isHidenClearBtn: this.state.yClearHiden,
            onFocus: () => {
              // 获取焦点 显示
              this.setState({
                yClearHiden: false,
              })
            },
            onBlur: () => {
              // 失去焦点 隐藏
              this.setState({
                yClearHiden: true,
              })
            },
          })}
          {this.renderInput({
            image:getThemeAssets().collection.icon_ar_height,
            text: '高程:',
            value: this.state.z,
            isHidenBottomLine: true,
            onChange: text => {
              this.setState({z: text})
            },
            onClear: () => {
              this.setState({z: '0'})
            },
            isHidenClearBtn: this.state.zClearHiden,
            onFocus: () => {
              // 获取焦点 显示
              this.setState({
                zClearHiden: false,
              })
            },
            onBlur: () => {
              // 失去焦点 隐藏
              this.setState({
                zClearHiden: true,
              })
            },
          })}
        </View>
        <View
          style={[{
            width: dp(50),
            height: dp(120),
            justifyContent: 'center',
            alignItems:'center',
            marginLeft: dp(10),
          }]}
        >
          <TouchableOpacity
            style={[{
              width: dp(46),
              height: dp(90),
              flexDirection: 'column',
              backgroundColor: '#505050',
              borderRadius:dp(23),
              justifyContent: 'center',
              alignItems: 'center',
            }]}
            onPress={() => {
              this.props.onSubmit?.({
                x: this.state.x,
                y: this.state.y,
                z: this.state.z,
              })
            }}
          >
            <Image
              source={getImage().icon_ar_slide_down}
              style={[{
                width: dp(18),
                height:dp(18),
              }]}
            />
            <Text
              style={[{
                color: '#fff',
                marginTop: dp(8),
                fontSize: dp(13),
              }]}
            >{getLanguage().CONFIRM}</Text>
          </TouchableOpacity>


        </View>

      </View>
    )
  }

  renderItem = (text: string, image: ImageRequireSource, onPress: () => void) => {
    return (
      <TouchableOpacity
        style={[styles.selectItem]}
        onPress={onPress}
      >
        <Image
          source={image}
          style={styles.selectItemImage}
        />
        <Text
          numberOfLines={2}
          style={styles.selectItemText}
        >
          {text + ''}
        </Text>
      </TouchableOpacity>
    )
  }

  renderIntervalLine = () => {
    return (
      <View
        style={[{
          width: dp(1),
          height: dp(17),
          backgroundColor: '#DADBD9'
        }]}
      ></View>
    )
  }

  renderSelect = () => {
    return (
      <View
        style={[{
          marginBottom: dp(5),
        },
        styles.selectContainer
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            marginTop: dp(10),
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {this.renderItem(
            getLanguage().MAR_AR_DATUM_PICTURE_LOCATION,
            getImage().icon_scan,
            this.gotoScan,
          )}
          {this.renderIntervalLine()}
          {this.renderItem(
            getLanguage().MAP_AR_DATUM_MAP_SELECT_POINT,
            getImage().icon_map_selection,
            this.selectPoint,
          )}
          {this.renderIntervalLine()}
          {this.renderItem(
            getLanguage().MAP_AR_DATUM_GPS_LOCATION,
            getThemeAssets().collection.icon_gps_position,
            this.getCurrentLocation,
          )}

        </View>
      </View>

    )
  }

  /** 内容区 */
  renderContentView = () => {
    return (
      <View style={[styles.content]}>
        <View style={[{
          width: '90%',
          height: '100%',
          backgroundColor: 'rgba(255,255,255,.9)',
          borderRadius: dp(16),
        }]}>
          {this.renderInputs()}
          {this.renderSelect()}
        </View>

      </View>
    )
  }

  renderMainView = () => {
    return (
      <View style={[styles.container]}>
        {this.renderBackBtn()}
        {this.renderContentView()}
      </View>
    )
  }

  renderScanView = () => {
    if(global.Type === ChunkType.MAP_AR_MAPPING){
      SARMap.setAction(ARAction.NULL)
    }
    return (
      <QRScan
        onBack={() => {
          this.setState({
            showStatus: 'main',
          })
        }}
        onSuccess={point => {
          this.setState({
            showStatus: 'main',
            x: point.x +'',
            y: point.y + '',
            z: point.h + '',
          })
        }}
        windowSize={this.props.windowSize}
      />
    )
  }


  render() {
    const { close, showStatus } = this.state
    let content = null
    switch(showStatus){
      case 'main': content = this.renderMainView()
        break
      case 'scan': content = this.renderScanView()
        break
    }
    return (
      <>{close ? null : content}</>
    )
  }
}

export default SinglePointPositionPage

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 100,
    alignItems: 'center',
  },
  mask: {
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  closeBtn: {
    position: 'absolute',
    top: dp(16),
    left: dp(10),
    // backgroundColor: '#fff',
    width: dp(45),
    height: dp(45),
    justifyContent:'center',
    alignItems: 'center',
    borderRadius: dp(10),
  },

  content: {
    position: 'absolute',
    bottom: dp(20),
    left:0,
    width: '100%',
    height: dp(185),
    // backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    // marginHorizontal: dp(20),
    borderRadius: dp(16),
    backgroundColor: '#fff',
    paddingHorizontal: dp(10),
    textShadowOffset:{
      width:dp(2),
      hegith:dp(2),
    },
    textShadowRadius:dp(2),
    textShadowColor:'#000',
    shadowOffset: {
      width: dp(0),
      height: dp(3),
    },
    shadowColor: '#000',
    shadowRadius: dp(2),
  },
  inputItem: {
    height: dp(40),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: dp(10),
    // backgroundColor:"#f00",
  },
  selectItem: {
    width: dp(100),
    height: dp(30),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // backgroundColor: '#ccc',
  },
  selectItemImage: {
    width: dp(24),
    height: dp(24),
  },
  selectItemText: {
    fontSize: dp(12),
    color: AppStyle.Color.Text_Light,
    textAlign: 'center',
  },
  selectContainer: {
    flexDirection: 'row',
    // backgroundColor: '#ff0',
    marginHorizontal: dp(20),
    justifyContent: 'space-between'
  },

})
