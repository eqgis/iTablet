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
  xClearHiden: boolean
  yClearHiden: boolean
  zClearHiden: boolean
	/** 当前操作的定位点 */
	curPoint: 'p1' | 'p2'
	/** 定位点2的经度 */
	p2x: string
	/** 定位点2的纬度 */
	p2y: string
	/** 定位点2的高程 */
	p2z: string
  p2xClearHiden: boolean
  p2yClearHiden: boolean
  p2zClearHiden: boolean

	/** AR点1 */
	anchorARPoint1: Point3D | null
	/** AR点2 */
	anchorARPoint2:Point3D | null

  /** 提示是否显示 */
  isTipsShow: boolean
  /** 当前正在添加的点标识 */
  curAddPoint: 'p1' | 'p2'

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
      xClearHiden: true,
      yClearHiden: true,
      zClearHiden: true,
      curPoint: 'p1',
      p2x: '0',
      p2y: '0',
      p2z: '0',
      p2xClearHiden: true,
      p2yClearHiden: true,
      p2zClearHiden: true,
      anchorARPoint1: null,
      anchorARPoint2: null,
      isTipsShow: true,
      curAddPoint: 'p1',
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
    // await SARMap.setAction(ARAction.FOCUS)

    // 提示五秒后消失
    this.tipTimer = setTimeout(async () => {
      this.setState({
        isTipsShow: false,
      })
      // await SARMap.setAction(ARAction.FOCUS)
      if(this.tipTimer) {
        clearTimeout(this.tipTimer)
        this.tipTimer = null
      }
    }, 3000)
  }

  componentDidUpdate = async (prevProps: Readonly<Props>, prevState: Readonly<State>): Promise<void>  => {
    if(this.state.showStatus !== prevState.showStatus || this.state.isTipsShow !== prevState.isTipsShow) {
      if(this.state.showStatus === "main" && !this.state.isTipsShow) {
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
        // 清除已添加到实景中的所有图片
        await SARMap.removeAllTrackingMarker()
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
            // 清除已添加到实景中的所有图片
            await SARMap.removeAllTrackingMarker()
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

  /** 打点按钮的点击响应方法 */
  addPointBtnAction = async() => {
    if(this.state.curAddPoint === 'p1') {
      this.selectAnchorOne()
    } else {
      this.selectAnchorTwo()
    }
  }

  /** 定位点一的点击方法 */
  selectAnchorOne = async () => {
    const arPoint1 =  await SARMap.getFocusPosition()
    const result = await SMap.getCurrentLocation()
    if(result && arPoint1 && JSON.stringify(arPoint1) !== "{}") {
      await SARMap.addTrackingMarker("icon_ar_point01.png", arPoint1, 'point1')
      this.setState({
        anchorARPoint1: arPoint1,
        x: result.longitude + '',
        y: result.latitude + '',
        curAddPoint: 'p2',
        isTipsShow: true,
      })
      if(this.tipTimer) {
        clearTimeout(this.tipTimer)
        this.tipTimer = null
      }
      this.tipTimer = setTimeout(() => {
        this.setState({
          isTipsShow: false,
        })
        if(this.tipTimer) {
          clearTimeout(this.tipTimer)
          this.tipTimer = null
        }
      }, 3000)
    }

  }

  /** 定位点二的点击方法 */
  selectAnchorTwo = async () => {
    const arPoint2 =  await SARMap.getFocusPosition()
    const result = await SMap.getCurrentLocation()

    if(result && arPoint2 && JSON.stringify(arPoint2) !== "{}") {
      await SARMap.addTrackingMarker("icon_ar_point02.png", arPoint2, 'point2')
      this.setState({
        anchorARPoint2: arPoint2,
        p2x: result.longitude + '',
        p2y: result.latitude + '',
      })
    }

  }

  /** 撤销按钮响应方法 */
  cancelBtnAction = async() => {
    try {
      // 当定位点二已经存在了，才撤销定位点二，撤销点二 ，为打点二状态
      if(this.state.anchorARPoint2 && JSON.stringify(this.state.anchorARPoint2) !== "{}") {
        await SARMap.removeTrackingMarker("point2")
        this.setState({
          anchorARPoint2: null,
          curAddPoint: 'p2',
        })
      }else if(this.state.anchorARPoint1 && JSON.stringify(this.state.anchorARPoint1) !== "{}"){
        // 当定位点二不存在，定位点一存在时，才撤销定位点一，撤销点一 ，为打点一状态
        await SARMap.removeTrackingMarker("point1")
        if(this.state.curAddPoint === 'p2') {
          if(this.tipTimer) {
            clearTimeout(this.tipTimer)
            this.tipTimer = null
          }
          this.tipTimer = setTimeout(() => {
            this.setState({
              isTipsShow: false,
            })
            if(this.tipTimer) {
              clearTimeout(this.tipTimer)
              this.tipTimer = null
            }
          }, 3000)
          this.setState({
            anchorARPoint1: null,
            curAddPoint: 'p1',
            isTipsShow: true,
          })
        } else {
          this.setState({
            anchorARPoint1: null,
            curAddPoint: 'p1',
          })
        }
      }
    } catch (error) {
      console.error("cancelbtn Action error: " + JSON.stringify(error))
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
        <Image source={getImage().icon_nav_back_white} style={{ width: dp(30), height: dp(30) }} />
      </TouchableOpacity>
    )
  }

  /** 提交按钮 */
  renderSubmitBtn = () => {
    return (
      <TouchableOpacity
        style={[styles.submitBtn,
          !this.horizontal && {
            bottom: dp(35),
            right: dp(10),
          },
          this.horizontal && {
            top: dp(10),
            right: dp(20),
          },
        ]}
        onPress={this.submitAction}>
        <Image source={getThemeAssets().collection.icon_function_ok} style={{ width: dp(35), height: dp(35) }} />
        <Text
          style={[{
            fontSize: dp(12),
            color: '#fff',
            textShadowOffset:{
              width:dp(1),
              height:dp(1),
            },
            textShadowRadius:dp(1),
            textShadowColor:'#000',
          }]}
        >{getLanguage().MAP_AR_AI_CONFIRM}</Text>
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
        styles.inputContainer]}>
        {this.renderSelectHeaderView()}
        <View
          style={[{
            flexDirection: 'row',
          }]}
        >
          <View
            style={[{
              flex: 1,
              height: dp(102),
              backgroundColor: '#f9f9f9',
              paddingHorizontal: dp(8),
              borderRadius: dp(16),

            }]}
          >
            {/* 定位点一的界面 */}
            {this.state.curPoint === 'p1' && this.renderInput({
              image:getThemeAssets().collection.icon_lines,
              text: getLanguage().MAP_AR_DATUM_LONGITUDE + ':',
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
            {this.state.curPoint === 'p1' && this.renderInput({
              image:getThemeAssets().collection.icon_latitudes,
              text: getLanguage().MAP_AR_DATUM_LATITUDE + ':',
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
            {this.state.curPoint === 'p1' && this.renderInput({
              image:getThemeAssets().collection.icon_ar_height,
              text: getLanguage().ABSOLUTE_HEIGHT + ':',
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

            {this.state.curPoint === 'p2' && this.renderInput({
              image:getThemeAssets().collection.icon_lines,
              text: '经度:',
              value: this.state.p2x,
              onChange: text => {
                this.setState({p2x: text})
              },
              onClear: () => {
                this.setState({p2x: '0'})
              },
              isHidenClearBtn: this.state.p2xClearHiden,
              onFocus: () => {
                // 获取焦点 显示
                this.setState({
                  p2xClearHiden: false,
                })
              },
              onBlur: () => {
                // 失去焦点 隐藏
                this.setState({
                  p2xClearHiden: true,
                })
              },
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
              },
              isHidenClearBtn: this.state.p2yClearHiden,
              onFocus: () => {
                // 获取焦点 显示
                this.setState({
                  p2yClearHiden: false,
                })
              },
              onBlur: () => {
                // 失去焦点 隐藏
                this.setState({
                  p2yClearHiden: true,
                })
              },
            })}
            {this.state.curPoint === 'p2' && this.renderInput({
              image:getThemeAssets().collection.icon_ar_height,
              text: '高程:',
              value: this.state.p2z,
              isHidenBottomLine: true,
              onChange: text => {
                this.setState({p2z: text})
              },
              onClear: () => {
                this.setState({p2z: '0'})
              },
              isHidenClearBtn: this.state.p2zClearHiden,
              onFocus: () => {
                // 获取焦点 显示
                this.setState({
                  p2zClearHiden: false,
                })
              },
              onBlur: () => {
                // 失去焦点 隐藏
                this.setState({
                  p2zClearHiden: true,
                })
              },
            })}
          </View>
          <View
            style={[{
              width: dp(46),
              height: dp(102),
              justifyContent: 'center',
              alignItems:'center',
              marginLeft: dp(10),
            }]}
          >
            <TouchableOpacity
              style={[{
                width: dp(40),
                height: dp(80),
                flexDirection: 'column',
                backgroundColor: '#505050',
                borderRadius:dp(23),
                justifyContent: 'center',
                alignItems: 'center',
              }]}
              onPress={this.submitAction}
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
          marginTop: dp(-7),
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
            getLanguage().SCAN,
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


  /** 打点按钮 */
  renderAddButton = () => {
    return (
      <TouchableOpacity
        style={[styles.addButton,
          !this.horizontal && {
            bottom: dp(30),
          },
          this.horizontal && {
            alignItems: 'center',
            right: dp(8),
            top: this.props.windowSize.height / 2 - dp(70) / 2,          }
        ]}
        onPress={this.addPointBtnAction}
      >
        <Image
          style={{width: dp(70), height: dp(70)}}
          source={getImage().icon_ar_measure_add}
        />
      </TouchableOpacity>
    )
  }

  /** 撤销按钮 */
  renderCancelBtn = () => {
    return (
      <TouchableOpacity
        style={[styles.cancelBtn,
          !this.horizontal && {
            bottom: dp(35),
            right: dp(65),
          },
          this.horizontal && {
            top: dp(65),
            right: dp(20),
          },
        ]}
        onPress={this.cancelBtnAction}
      >
        <Image
          style={{width: dp(35), height: dp(35)}}
          source={getThemeAssets().collection.icon_function_undo}
        />
        <Text
          style={[{
            fontSize: dp(12),
            color: '#fff',
            textShadowOffset:{
              width:dp(1),
              height:dp(1),
            },
            textShadowRadius:dp(1),
            textShadowColor:'#000',
          }]}
        >{getLanguage().COLLECTION_UNDO}</Text>
      </TouchableOpacity>
    )
  }


  /** 去往坐标参数界面的按钮 */
  renderCoordBtn = () => {
    return (
      <TouchableOpacity
        style={[{
          position: 'absolute',
          width: dp(33),
          height: dp(33),
          borderRadius: dp(40),
          // backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
        },
        !this.horizontal ? {
          bottom: dp(35),
          left: dp(10),
        } : {
          right: dp(25),
          bottom: dp(10),
        },
        ]}
        onPress={this.gotoCoordpage}
      >
        <Image
          source={getThemeAssets().collection.icon_ar_coord}
          style={[{
            width: dp(35),
            height: dp(35),
          }]}
        />
        <Text
          style={[{
            fontSize: dp(12),
            color: '#fff',
            textShadowOffset:{
              width:dp(1),
              height:dp(1),
            },
            textShadowRadius:dp(1),
            textShadowColor:'#000',
          }]}
        >{getLanguage().COORD_PARAM}</Text>
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
            borderRadius: dp(16),
            justifyContent: 'center',
            alignItems: 'center',
          }]}
        >
          <View
            style={[{
              width: dp(66),
              height: dp(66),
              backgroundColor: '#232324',
              borderRadius: dp(33),
              justifyContent:'center',
              alignItems:'center',
            }]}
          >
            <Image
              source={getThemeAssets().collection.icon_tips_select_location_point}
              style={[{
                width: dp(60),
                height: dp(60),
              }]}
            />
          </View>
          <Text
            style={[{
              fontSize: dp(16),
              color:"#fff",
              textShadowOffset:{
                width:dp(1),
                height:dp(1),
              },
              textShadowRadius:dp(1),
              textShadowColor:'#000',
            }]}
          >{getLanguage().AIM_REAL_POSITION}</Text>
          <Text
            style={[{
              fontSize: dp(16),
              color: '#fff',
              textShadowOffset:{
                width:dp(1),
                height:dp(1),
              },
              textShadowRadius:dp(1),
              textShadowColor:'#000',
            }]}
          >{this.state.curAddPoint === 'p1' ? getLanguage().SELECT_FIRST_POSITION_POINT : getLanguage().SELECT_SECOND_POSITION_POINT}</Text>
        </View>

      </View>
    )
  }

  /** 两点定位的主界面 */
  renderMainView = () => {
    return (
      <View style={[styles.container]}>
        {/* {this.renderAnchorView()} */}
        {this.renderAddButton()}
        {/* {this.state.anchorARPoint1 && JSON.stringify(this.state.anchorARPoint1) !== "{}" && this.renderCancelBtn()} */}
        {this.renderCancelBtn()}
        {this.renderCoordBtn()}
        {this.renderBackBtn()}
        {this.renderSubmitBtn()}
        {this.state.isTipsShow && this.renderTipsView()}
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
          height: dp(35),
          backgroundColor: '#fff',
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexDirection: 'row',
          borderRadius: dp(16),
          // paddingHorizontal: dp(5),
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
          <View
            style={[{
              width: '100%',
              height: dp(20),
              justifyContent: 'flex-start',
              alignItems:'center',
            }]}
          >
            <Text
              style={[styles.selectHeaderText,
                this.state.curPoint === 'p1' && {
                  fontWeight: 'bold',
                }
              ]}
            >{getLanguage().ANCHOR_POINT_ONE}</Text>
          </View>
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
          <View
            style={[{
              width: '100%',
              height: dp(20),
              justifyContent: 'center',
              alignItems:'center',
            }]}
          >
            <Text
              style={[styles.selectHeaderText,
                this.state.curPoint === 'p2' && {
                  fontWeight: 'bold',
                }
              ]}
            >{getLanguage().ANCHOR_POINT_TWO}</Text>
          </View>

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
      <View style={[styles.content,
        !this.horizontal && {
          bottom: dp(20),
          left:0,
        },
        this.horizontal && {
          width: dp(335),
          height: dp(185),
          bottom: dp(10),
          right: dp(10),
        }]}>
        <View style={[{
          width: '90%',
          height: '100%',
          backgroundColor: 'rgba(255,255,255,.9)',
          borderRadius: dp(16),
        },
        this.horizontal && {
          width: '100%',
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
        {/* {this.renderSubmitBtn()} */}
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
    top: dp(16),
    left: dp(10),
    // backgroundColor: '#fff',
    width: dp(45),
    height: dp(45),
    justifyContent:'center',
    alignItems: 'center',
    borderRadius: dp(10),
  },
  submitBtn: {
    position: 'absolute',
    // backgroundColor: '#fff',
    width: dp(45),
    height: dp(45),
    justifyContent:'center',
    alignItems: 'center',
    borderRadius: dp(10),
  },
  cancelBtn: {
    position: 'absolute',
    // backgroundColor: '#fff',
    width: dp(45),
    height: dp(45),
    justifyContent:'center',
    alignItems: 'center',
    borderRadius: dp(10),
  },

  content: {
    position: 'absolute',
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
    paddingHorizontal: dp(8),
    paddingBottom: dp(8),
    paddingTop: dp(5),
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
    height: dp(34),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: dp(10),
    // backgroundColor: '#f00',
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
    width: dp(60),
    height: dp(30),
    // backgroundColor: '#f00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: dp(8),
  },
  selectHeaderText: {
    fontSize: dp(14),
  },
  addButton: {
    // ...AppStyle.FloatStyle,
    position: 'absolute',
    alignSelf: 'center',
  },

})
