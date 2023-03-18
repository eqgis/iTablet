import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity, Text, ScaledSize, TextInput, ImageRequireSource } from 'react-native'
import { SARMap, SMap } from "imobile_for_reactnative"
import { AppStyle, dp, Toast } from '../../utils'
import { getImage, getThemeAssets } from '../../assets'
import { getLanguage } from '../../language'
import { formatFloat } from '@/utils/CheckUtils'
import QRScan from './QRScan'
import { ChunkType } from '@/constants'
import NavigationService from '../NavigationService'
import { Point3D } from 'imobile_for_reactnative/NativeModule/interfaces/data/SData'
import { ARAction, TwoPointPositionParamType } from 'imobile_for_reactnative/NativeModule/interfaces/ar/SARMap'

interface Props {
	onBack?: () => void
	onSubmit?: () => void
	windowSize: ScaledSize
}
interface State {
	/** 该页面展示的内容类型 */
	showStatus: "scan" | 'coord' | 'main'
	/** 该页面是否关闭 */
	close: boolean
	/** 定位点1的经度 */
	x: string
	/** 定位点1的纬度 */
  y: string
	/** 定位点1的高程 */
  z: string
	/** 当前操作的定位点 */
	curPoint: 'p1' | 'p2'
	/** 定位点2的经度 */
	p2x: string
	/** 定位点2的纬度 */
	p2y: string
	/** 定位点2的高程 */
	p2z: string

	/** AR点1 */
	anchorARPoint1: Point3D | null
	/** AR点2 */
	anchorARPoint2:Point3D | null

  /** 提示是否显示 */
  isTipsShow: boolean

}

class TwoPointPositionPage extends React.Component<Props, State> {

  horizontal: boolean
  tipTimer: NodeJS.Timeout | null | undefined = null

  constructor(props: Props) {
    super(props)
    this.state = {
      showStatus: 'main',
      close: false,
      x: '0',
      y: '0',
      z: '0',
      curPoint: 'p1',
      p2x: '0',
      p2y: '0',
      p2z: '0',
      anchorARPoint1: null,
      anchorARPoint2: null,
      isTipsShow: true,
    }
    this.horizontal = this.props.windowSize.height < this.props.windowSize.width
  }

  componentDidMount = async () => {
    let position
    if (global.SELECTPOINTLATITUDEANDLONGITUDE) {
      position = global.SELECTPOINTLATITUDEANDLONGITUDE
      this.setState({
        x: position.x + '',
        y: position.y + '',
        p2x: position.x + '',
        p2y: position.y + '',
      })
    }else {
      position = await SMap.getCurrentLocation()
      this.setState({
        x: position.longitude + '',
        y: position.latitude + '',
        p2x: position.longitude + '',
        p2y: position.latitude + '',
      })
    }
    await SARMap.setAction(ARAction.FOCUS)

    // 提示五秒后消失
    this.tipTimer = setTimeout(() => {
      this.setState({
        isTipsShow: false,
      })
      if(this.tipTimer) {
        clearTimeout(this.tipTimer)
        this.tipTimer = null
      }
    }, 5000)
  }

  componentDidUpdate = async (prevProps: Readonly<Props>, prevState: Readonly<State>): Promise<void>  => {
    if(this.state.showStatus !== prevState.showStatus) {
      if(this.state.showStatus === "main") {
        await SARMap.setAction(ARAction.FOCUS)
      } else {
        await SARMap.setAction(ARAction.NULL)
      }
    }
  }

  /** 两点定位界面的返回按钮执行方法 */
  goBackAction = async () => {
    switch(this.state.showStatus) {
      case 'main':
        await SARMap.setAction(ARAction.NULL)
        this.props.onBack?.()
        break
      case 'coord':
        this.setState({
          showStatus: 'main',
        })
        break
    }
  }

  /** 字符类型转数字的工具方法 */
  stringToNumber = (text: string): number => {
    let number = Number(text)
    if(isNaN(number)) {
      number = 0
    }
    return number
  }

  /** 两点定位界面的提交按钮 */
  submitAction = async () => {
    switch(this.state.showStatus) {
      case 'main':
        if(this.state.anchorARPoint1 && this.state.anchorARPoint2) {
          const param:TwoPointPositionParamType = {
            gpsPnt1: {
              x: this.stringToNumber(this.state.x),
              y: this.stringToNumber(this.state.y),
            },
            gpsPnt2: {
              x: this.stringToNumber(this.state.p2x),
              y: this.stringToNumber(this.state.p2y),
            },
            arPnt1: this.state.anchorARPoint1,
            arPnt2: this.state.anchorARPoint2,
            height: this.stringToNumber(this.state.z),
          }

          const result =  await SARMap.twoPointPosition(param)
          if(result) {
            await SARMap.setAction(ARAction.NULL)
            this.props.onSubmit?.()
          }
        } else {
          Toast.show(getLanguage().LESS_TWO_POSITION_POINT)
        }
        break
      case 'coord':
        this.setState({
          showStatus: 'main',
        })
        break
    }
  }

  /** 定位点一的点击方法 */
  selectAnchorOne = async () => {
    if(this.state.anchorARPoint1) {
      this.setState({
        anchorARPoint1: null,
      })
    } else {
      const arPoint1 =  await SARMap.getFocusPosition()
      const result = await SMap.getCurrentLocation()
      if(result && arPoint1 && JSON.stringify(arPoint1) !== "{}") {
        this.setState({
          anchorARPoint1: arPoint1,
          x: result.longitude + '',
          y: result.latitude + '',
        })
      }
    }

  }

  /** 定位点二的点击方法 */
  selectAnchorTwo = async () => {
    if(this.state.anchorARPoint2) {
      this.setState({
        anchorARPoint2: null,
      })
    } else {
      const arPoint2 =  await SARMap.getFocusPosition()
      const result = await SMap.getCurrentLocation()

      if(result && arPoint2 && JSON.stringify(arPoint2) !== "{}") {
        this.setState({
          anchorARPoint2: arPoint2,
          p2x: result.longitude + '',
          p2y: result.latitude + '',
        })
      }
    }

  }

  /** 去往坐标参数界面 */
  gotoCoordpage = () => {
    if(this.tipTimer) {
      clearTimeout(this.tipTimer)
      this.tipTimer = null
      this.setState({
        showStatus: 'coord',
        isTipsShow: false,
      })
    } else {
      this.setState({
        showStatus: 'coord',
      })
    }
  }


  /** 地图选点定位 */
  selectPoint = () => {
    const longitude = this.state.x
    const latitude = this.state.y

    NavigationService.navigate('SelectLocation', {
      cb: () => {
        if(this.state.curPoint === 'p1') {
          this.setState({
            x: global.SELECTPOINTLATITUDEANDLONGITUDETEMP.x + '',
            y: global.SELECTPOINTLATITUDEANDLONGITUDETEMP.y + '',
          })
        } else {
          this.setState({
            p2x: global.SELECTPOINTLATITUDEANDLONGITUDETEMP.x + '',
            p2y: global.SELECTPOINTLATITUDEANDLONGITUDETEMP.y + '',
          })
        }
      },
    })
    global.SELECTPOINTLATITUDEANDLONGITUDETEMP = { x: Number(longitude), y: Number(latitude) }

  }

  /** 去往扫描界面 */
  gotoScan = () => {
    this.setState({
      showStatus: 'scan',
    })
  }

  /** 卫星定位 */
  getCurrentLocation = async () => {
    const result = await SMap.getCurrentLocation()
    if(result) {
      if(this.state.curPoint === 'p1') {
        this.setState({
          x: result.longitude + '',
          y: result.latitude + '',
        })
      } else {
        this.setState({
          p2x: result.longitude + '',
          p2y: result.latitude + '',
        })
      }
    }



  }

  /** 返回按钮 */
  renderBackBtn = () => {
    return (
      <TouchableOpacity style={styles.closeBtn} onPress={this.goBackAction}>
        <Image source={getImage().back} style={{ width: dp(26), height: dp(26) }} />
      </TouchableOpacity>
    )
  }

  /** 提交按钮 */
  renderSubmitBtn = () => {
    return (
      <TouchableOpacity style={styles.submitBtn} onPress={this.submitAction}>
        <Image source={getImage().icon_submit} style={{ width: dp(26), height: dp(26) }} />
      </TouchableOpacity>
    )
  }

  renderInput = (props: {
    image: ImageRequireSource,
    text: string,
    value: string,
    onChange: (text:string) => void
    onClear: () => void
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
          style={{
            flex: 1,
            fontSize: dp(13),
            padding: 0,
            borderBottomWidth: dp(1),
            borderBottomColor: '#ECECEC',
          }}
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
        />
        <TouchableOpacity
          onPress={props.onClear}
        >
          <Image
            source={getImage().icon_close}
            style={{...AppStyle.Image_Style_Small, tintColor: AppStyle.Color.GRAY}}
          />

        </TouchableOpacity>
      </View>
    )
  }

  renderInputs = () => {
    return (
      <View style={[
        styles.inputContainer]}>
        {this.renderSelectHeaderView()}
        {/* 定位点一的界面 */}
        {this.state.curPoint === 'p1' && this.renderInput({
          image:getThemeAssets().collection.icon_lines,
          text: '经度:',
          value: this.state.x,
          onChange: text => {
            this.setState({x: text})
          },
          onClear: () => {
            this.setState({x: '0'})
          }
        })}
        {this.state.curPoint === 'p1' && this.renderInput({
          image:getThemeAssets().collection.icon_latitudes,
          text: '纬度:',
          value: this.state.y,
          onChange: text => {
            this.setState({y: text})
          },
          onClear: () => {
            this.setState({y: '0'})
          }
        })}
        {this.state.curPoint === 'p1' && this.renderInput({
          image:getThemeAssets().collection.icon_ar_height,
          text: '高程:',
          value: this.state.z,
          onChange: text => {
            this.setState({z: text})
          },
          onClear: () => {
            this.setState({z: '0'})
          }
        })}

        {this.state.curPoint === 'p2' && this.renderInput({
          image:getThemeAssets().collection.icon_lines,
          text: '经度:',
          value: this.state.p2x,
          onChange: text => {
            this.setState({p2x: text})
          },
          onClear: () => {
            this.setState({p2x: '0'})
          }
        })}
        {this.state.curPoint === 'p2' && this.renderInput({
          image:getThemeAssets().collection.icon_latitudes,
          text: '纬度:',
          value: this.state.p2y,
          onChange: text => {
            this.setState({p2y: text})
          },
          onClear: () => {
            this.setState({p2y: '0'})
          }
        })}
        {this.state.curPoint === 'p2' && this.renderInput({
          image:getThemeAssets().collection.icon_ar_height,
          text: '高程:',
          value: this.state.p2z,
          onChange: text => {
            this.setState({p2z: text})
          },
          onClear: () => {
            this.setState({p2z: '0'})
          }
        })}
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


  /** 定位点按钮 */
  renderAnchorView = () => {
    return (
      <View
        style={[styles.anchorView]}
      >
        <TouchableOpacity
          style={[styles.anchorTouch, {
            borderBottomLeftRadius: dp(25),
            borderTopLeftRadius: dp(25),
          },
          this.state.anchorARPoint1 && {
            backgroundColor: 'rgba(40,120,255,1)',
          }
          ]}
          onPress={this.selectAnchorOne}
        >
          <Text
            style={[styles.anchorText,
              this.state.anchorARPoint1 && {
                color: '#fff',
              }
            ]}
          >{"P1"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.anchorTouch, {
            borderBottomRightRadius: dp(25),
            borderTopRightRadius: dp(25),
          },
          this.state.anchorARPoint2 && {
            backgroundColor: 'rgba(40,120,255,1)',
          }
          ]}
          onPress={this.selectAnchorTwo}
        >
          <Text
            style={[styles.anchorText,
              this.state.anchorARPoint2 && {
                color: '#fff',
              }
            ]}
          >{"P2"}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  /** 去往坐标参数界面的按钮 */
  renderCoordBtn = () => {
    return (
      <TouchableOpacity
        style={[{
          position: 'absolute',
          bottom: dp(30),
          right: dp(10),
          width: dp(75),
          height: dp(75),
          borderRadius: dp(40),
          // backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
        }]}
        onPress={this.gotoCoordpage}
      >
        <Image
          source={getThemeAssets().collection.icon_ar_coord}
          style={[{
            width: dp(75),
            height: dp(75),
          }]}
        />
      </TouchableOpacity>
    )
  }

  /** 提示框 */
  renderTipsView = () => {
    let top = dp(200)
    if(this.horizontal) {
      top = dp(30)
    }
    return (
      <View
        style={[{
          position: 'absolute',
          top: top,
          left: 0,
          width:'100%',
          height: dp(120),
          justifyContent: 'center',
          alignItems: 'center',
        }]}
      >
        <View
          style={[{
            width: dp(200),
            height: dp(140),
            backgroundColor: 'rgba(0,0,0,.5)',
            borderRadius: dp(16),
            justifyContent: 'center',
            alignItems: 'center',
          }]}
        >
          <Image
            source={getThemeAssets().collection.icon_tips_select_location_point}
            style={[{
              width: dp(60),
              height: dp(60),
            }]}
          />
          <Text
            style={[{
              fontSize: dp(16),
              color: '#fff',
            }]}
          >{getLanguage().AIM_REAL_POSITION}</Text>
          <Text
            style={[{
              fontSize: dp(16),
              color: '#fff',
            }]}
          >{getLanguage().SELECT_POSITION_POINT}</Text>
        </View>

      </View>
    )
  }

  /** 两点定位的主界面 */
  renderMainView = () => {
    return (
      <View style={[styles.container]}>
        {this.renderAnchorView()}
        {this.renderCoordBtn()}
        {this.renderBackBtn()}
        {this.renderSubmitBtn()}
        {this.state.isTipsShow && this.renderTipsView()}
      </View>
    )
  }

  renderScanView = () => {
    if(global.Type === ChunkType.MAP_AR_MAPPING){
      SARMap.measuerPause(true)
    }
    return (
      <QRScan
        onBack={() => {
          this.setState({
            showStatus: 'coord',
          })
        }}
        onSuccess={point => {
          if(this.state.curPoint === 'p1') {
            this.setState({
              showStatus: 'coord',
              x: point.x +'',
              y: point.y + '',
              z: point.h + '',
            })
          } else {
            this.setState({
              showStatus: 'coord',
              p2x: point.x +'',
              p2y: point.y + '',
              p2z: point.h + '',
            })
          }

        }}
        windowSize={this.props.windowSize}
      />
    )
  }

  renderSelectHeaderView = () => {
    return (
      <View
        style={[{
          width: '100%',
          height: dp(30),
          backgroundColor: '#fff',
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexDirection: 'row',
          borderRadius: dp(16),
        }]}
      >
        <TouchableOpacity
          style={[styles.selectHeader]}
          onPress={() => {
            this.setState({
              curPoint: 'p1',
            })
          }}
        >
          <Text
            style={[styles.selectHeaderText,
              this.state.curPoint === 'p1' && {
                fontWeight: 'bold',
              }
            ]}
          >{"p1"}</Text>
          <View
            style={[{
              marginTop: dp(3),
              width: dp(14),
              height: dp(1),
              backgroundColor: '#fff',
            },
            this.state.curPoint === 'p1' && {
              backgroundColor: '#333'
            }
            ]}
          ></View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.selectHeader]}
          onPress={() => {
            this.setState({
              curPoint: 'p2',
            })
          }}
        >
          <Text
            style={[styles.selectHeaderText,
              this.state.curPoint === 'p2' && {
                fontWeight: 'bold',
              }
            ]}
          >{"p2"}</Text>
          <View
            style={[{
              marginTop: dp(3),
              width: dp(14),
              height: dp(1),
              backgroundColor: '#fff',
            },
            this.state.curPoint === 'p2' && {
              backgroundColor: '#333'
            }
            ]}
          ></View>
        </TouchableOpacity>
      </View>
    )
  }

  /** 坐标参数的内容界面 */
  renderContentView = () => {
    return (
      <View style={[styles.content]}>
        <View style={[{
          width: '90%',
          height: '100%',
          backgroundColor: '#ECEDEB',
          borderRadius: dp(16),
        }]}>
          {this.renderInputs()}
          {this.renderSelect()}
        </View>
      </View>
    )
  }

  /** 坐标参数界面 */
  renderCoordView = () => {
    return (
      <View style={[styles.container]}>
        {this.renderBackBtn()}
        {this.renderSubmitBtn()}
        {this.renderContentView()}
      </View>
    )
  }


  render() {
    this.horizontal = this.props.windowSize.height < this.props.windowSize.width
    const { close, showStatus } = this.state
    let content = null
    switch(showStatus){
      case 'main':
        content = this.renderMainView()
        break
      case 'coord':
        content = this.renderCoordView()
        break
      case 'scan':
        content = this.renderScanView()
        break
    }
    return (
      <>{close ? null : content}</>
    )
  }
}

export default TwoPointPositionPage

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
    top: dp(30),
    left: dp(10),
    backgroundColor: '#fff',
    width: dp(45),
    height: dp(45),
    justifyContent:'center',
    alignItems: 'center',
    borderRadius: dp(10),
  },
  submitBtn: {
    position: 'absolute',
    top: dp(30),
    right: dp(10),
    backgroundColor: '#fff',
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
    height: dp(220),
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
      height: dp(0),
    },
    shadowColor: '#000',
    shadowRadius: dp(1),
  },
  inputItem: {
    height: dp(44),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: dp(10),
    // backgroundColor: '#f00',
  },
  selectItem: {
    width: dp(100),
    height: dp(40),
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
    justifyContent: 'space-between',
  },

  anchorView:{
    position: 'absolute',
    left: dp(10),
    bottom: dp(30),
    width: dp(120),
    height: dp(50),
    backgroundColor: '#fff',
    borderRadius: dp(25),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  anchorTouch: {
    width: dp(60),
    height: dp(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  anchorText: {
    fontSize: dp(18),
  },

  selectHeader: {
    width: dp(28),
    height: dp(28),
    // backgroundColor: '#f00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectHeaderText: {
    fontSize: dp(14),
  },

})