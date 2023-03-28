import { Container } from '../../components'
import { getLanguage } from "@/language"
import { MainStackScreenNavigationProps } from "@/types/NavigationTypes"
import React, {Component} from "react"
import { TouchableOpacity, View, Text, TextInput, Image, ScrollView } from "react-native"
import { SLocation } from "imobile_for_reactnative"
import styles from "./style"
import { Picker } from '@react-native-picker/picker'
import { dp, scaleSize, Toast } from '@/utils'
import { NtripMountPoint } from 'imobile_for_reactnative/NativeModule/interfaces/SLocation'
import NavigationService from '../NavigationService'
import { PositionServerTypes, EssentialInfo, DeviceManufacturer } from '@/redux/models/location'
import { getImage } from '@/assets'
import { LocationConnectionParam } from '../BluetoothDevices/BluetoothDevices'

interface Props{
  navigation: MainStackScreenNavigationProps<'NtripSetting'>,
  essentialInfo: EssentialInfo
  selectLoadPoint: NtripMountPoint
  peripheralDevice: LocationConnectionParam
  updateNtripInfo: (essentialInfo:EssentialInfo, selectLoadPoint: NtripMountPoint) => void
  positionServerType: PositionServerTypes
  setPositionServerType: (positionServerType: PositionServerTypes) => void
  deviceManufacturer: DeviceManufacturer,
}

export interface PickerItemType {
  label: string
  value: string | NtripMountPoint
}

interface RowType {
  title: string,
  value?: string,
  action?: () => void,
}

interface State extends EssentialInfo {
  /** 当前选中的加载点 */
  selectLoadPoint: NtripMountPoint
  /** 加载点数组 */
  // loadPointArray: Array<NtripMountPoint>
  loadPointNameArray: Array<NtripMountPoint>
  // requireGGA: string,
}


class NtripSetting extends Component<Props, State> {
  serverAgreement = {
    ["NTRIPV1"]: '其他',
    ["qianxun"]: '千寻知寸',
    ["huace"]: '华测',
    ['China Mobile']: '中国移动',
  }

  chinaMobileLoadPoint:Array<NtripMountPoint> = [
    {
      name: "RTCM33_GRCEJ",
      requireGGA:true,
    },
    {
      name: "RTCM33_GRCEpro",
      requireGGA:true,
    },
    {
      name: "RTCM33_GRCE",
      requireGGA:true,
    },
    {
      name: "RTCM33_GRC",
      requireGGA:true,
    },
    {
      name: "RTCM30_GR",
      requireGGA:true,
    },
  ]

  constructor(props: Props) {
    super(props)
    const essentialInfo: EssentialInfo =  this.props.essentialInfo
    const selelectLoadPoint: NtripMountPoint = this.props.selectLoadPoint
    this.state = {
      agreement: essentialInfo.agreement,
      address: essentialInfo.address,
      port: essentialInfo.port,
      userName: essentialInfo.userName,
      password: essentialInfo.password,
      selectLoadPoint: selelectLoadPoint,
      // loadPointArray:[],
      loadPointNameArray:[],
      // requireGGA: selelectLoadPoint.requireGGA + "",
    }
  }

  componentDidMount = async () => {
    await this.refreshLoadPoint()
    this.getAddressAndPort()
    if(this.props.deviceManufacturer === 'mijiaH20') {
      Toast.show(getLanguage(global.language).Profile.CHECK_DEVICE_SUPPORTS_DIFFERENTIAL_SERVICE)
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if(this.props.positionServerType !== prevProps.positionServerType) {
      this.getAddressAndPort(true)
    }
  }

  getAddressAndPort = (isClear?: boolean) => {
    const value = this.props.positionServerType
    if(value === 'China Mobile') {
      const nameArray: Array<NtripMountPoint> = JSON.parse(JSON.stringify(this.chinaMobileLoadPoint))
      // 修改state里的值
      this.setState({
        // loadPointArray: tempArray,
        loadPointNameArray: nameArray,
        // agreement: value,
        address: "sdk.pnt.10086.cn",
        port: '8002',
      })
    } else {
      let addressTemp = ""
      let portTemp = ""
      switch (value) {
        case "qianxun":
          addressTemp = "rtk.ntrip.qxwz.com"
          portTemp = "8002"
          break
        case "huace":
          addressTemp = "rtk.huacenav.com"
          portTemp = "8002"
      }
      this.setState({
        // agreement: value,
        address:addressTemp,
        port: portTemp,
      }, () => {
        this.refreshLoadPoint()
      })
    }
  }

  refreshLoadPoint = async () => {
    try {
      // && (this.state.agreement === 'China Mobile' || (this.state.userName !== '' && this.state.password !== ''))
      if(this.state.address !== '' && this.state.port !== '' && this.props.positionServerType !== 'China Mobile') {
        const info = {
          address: this.state.address,
          port: Number(this.state.port),
        }
        const tempArray = await SLocation.getNtripSourceTable(info)
        const nameArray: Array<NtripMountPoint> = []
        // 构造picker的item的类型
        for(let i = 0; i < tempArray.length; i ++) {
          const item = tempArray[i]
          nameArray.push(item)
        }
        // 修改state里的值
        this.setState({
          // loadPointArray: tempArray,
          loadPointNameArray: nameArray,
        })
      } else {
        if(this.state.agreement !== "China Mobile") {
          this.setState({
            // loadPointArray: tempArray,
            loadPointNameArray: [],
          })
        }
      }

    } catch (error) {
      console.warn("refreshLoadPoint: " + JSON.stringify(error))
    }
  }

  setNtrip = async () => {
    try {
      const info = {
        address: this.state.address,
        port: Number(this.state.port),
        userName: this.state.userName,
        password: this.state.password,
        name: this.state.selectLoadPoint.name,
        requireGGA: this.state.selectLoadPoint.requireGGA,
      }
      const isSetSuccess = await SLocation.setNtripInfo(info)
      if(isSetSuccess) {
        const essentialInfo = {
          agreement: this.state.agreement,
          address: this.state.address,
          port: this.state.port,
          userName: this.state.userName,
          password: this.state.password,
        }
        this.props.updateNtripInfo(essentialInfo, this.state.selectLoadPoint)
        Toast.show(getLanguage().SUCCESS)
        NavigationService.goBack()
      } else {
        Toast.show(getLanguage().FAILED)
      }
    } catch (error) {
      console.warn("setNtrip: " + JSON.stringify(error))
    }
  }


  /** 去往服务类型设置页面 */
  gotoChangeServerTypePage = () => {
    NavigationService.navigate("NtripServerType")
  }

  /** 修改协议类型 */
  changeAgreementType = (text: string) => {
    this.setState({
      agreement: text,
    })
  }

  /** 去加载点页面后的回调方法 */
  changeLoadPoint = (tempLoadPoint: SLocation.NtripMountPoint) => {
    this.setState({
      selectLoadPoint: tempLoadPoint,
    })
  }


  /** 确认按钮 */
  renderRight = () => {
    const textColor = 'black'
    return (
      <View>
        <TouchableOpacity
          // disabled={isDisabled}
          style={[{
            marginRight: scaleSize(30),
          }]}
          onPress={this.setNtrip}
        >
          <Text style={[styles.headerRightText]}>
            {getLanguage(global.language).Profile.CONFIRM}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderRowItem = (param: RowType) => {
    return (
      <TouchableOpacity
        style={styles.itemView}
        onPress={param.action}
      >
        <Text style={styles.titletext}>{param.title}</Text>
        {param.value && (
          <View
            style={[{
              flex: 1,
              height: '100%',
              justifyContent:'center',
              alignItems:'flex-end',
            }]}
          >
            <Text style={styles.text}>{param.value}</Text>
          </View>
        )}

        <Image
          source={getImage().arrow}
          style={[{
            width: dp(15),
            height: dp(15),
            // marginRight: dp(10),
          }]}
        />
      </TouchableOpacity>
    )
  }

  renderInputItem = (props: {
    title: string,
    value: string,
    secureTextEntry?:boolean,
    showArray?:boolean,
    diseditable?:boolean,
    onChangeText: (text: string) => void,
    onEndEditing?: () => void,
    onSubmitEditing?: () => void,
    onRightBtn?: () => void
  }) => {
    return (
      <View
        style={[styles.itemView]}
      >
        <Text style={styles.titletext}>{props.title}</Text>
        <TextInput
          style={[styles.itemValueBtn]}
          autoFocus={false}
          // placeholder={this.state.placeholder}
          secureTextEntry={props.secureTextEntry || false}
          value={props.value}
          editable={!props.diseditable}
          onChangeText={props.onChangeText}
          onEndEditing={() => {
            props?.onEndEditing?.()
          }}
          onSubmitEditing={() => {
            props?.onSubmitEditing?.()
          }}
        />

        {props.showArray && (
          <TouchableOpacity
            style={[{
              width: dp(20),
              height: dp(30),
              // marginRight: dp(10),
              justifyContent: 'center',
              alignItems: 'flex-end',
              // backgroundColor: '#f00',
            }]}
            onPress={() => {
              props?.onRightBtn?.()
            }}
          >
            <Image
              source={getImage().arrow}
              style={[{
                width: dp(15),
                height: dp(15),
              }]}
            />
          </TouchableOpacity>
        )}

      </View>
    )
  }

  /** 分割线 */
  renderSeperator = () => {
    return  <View style={styles.seperator} />
  }

  /** 协议 */
  renderAgreement = () => {
    return (
      <View
        style={[styles.pickerView]}
      >

        {/* 服务类型 */}
        {this.renderRowItem({
          title:getLanguage(global.language).Profile.SERVICE_TYPE,
          value: this.serverAgreement[this.props.positionServerType],
          action: this.gotoChangeServerTypePage,
        })}
        {this.renderItemSeperator()}

        {/* 协议类型 */}
        {this.renderInputItem({
          title:getLanguage(global.language).Profile.PROTOCOL_TYPE,
          value: this.state.agreement,
          diseditable: true,
          onChangeText: this.changeAgreementType.bind(this),
        })}
        {/* {this.renderItemSeperator()} */}
        {this.renderSeperator()}

      </View>
    )
  }

  renderItemSeperator = () => {
    return (
      <View style={[styles.itemSeperator]}>
        <View style={[styles.itemSeperatorLine]}></View>
      </View>
    )
  }


  renderInputList = () => {
    return (
      <View>
        {/* 地址 */}
        {this.renderInputItem({
          title:getLanguage(global.language).Profile.SERVICE_ADDRESS,
          value: this.state.address,
          onChangeText: async (text: string) => {
            this.setState({
              address: text,
            })
            await this.refreshLoadPoint()
          },
          onEndEditing: async () => {
            await this.refreshLoadPoint()
          },
          onSubmitEditing:async () => {
            await this.refreshLoadPoint()
          },
        })}

        {this.renderItemSeperator()}
        {/* 端口号 */}
        {this.renderInputItem({
          title:getLanguage(global.language).Profile.PORT_NUMBER,
          value: this.state.port,
          onChangeText: async (text: string) => {
            // 类型验证，限制输入非法字符
            if(Number(text).toString() !== 'NaN') {
              this.setState({
                port: text,
              })
              await this.refreshLoadPoint()
            }
          },
          onEndEditing: async () => {
            await this.refreshLoadPoint()
          },
          onSubmitEditing:async () => {
            await this.refreshLoadPoint()
          },
        })}

        {this.renderItemSeperator()}

        {/* 用户名 */}
        {this.renderInputItem({
          title:getLanguage(global.language).Profile.USERNAME,
          value: this.state.userName,
          onChangeText: async (text: string) => {
            this.setState({
              userName: text,
            })
            // await this.refreshLoadPoint()
          },
          onEndEditing: async () => {
            // await this.refreshLoadPoint()
          },
          onSubmitEditing:async () => {
            // await this.refreshLoadPoint()
          },
        })}

        {this.renderItemSeperator()}

        {/* 密码 */}
        {this.renderInputItem({
          title:getLanguage(global.language).Profile.PASSWORD,
          value: this.state.password,
          secureTextEntry: true,
          onChangeText: async (text: string) => {
            this.setState({
              password: text,
            })
            // await this.refreshLoadPoint()
          },
          onEndEditing: async () => {
            // await this.refreshLoadPoint()
          },
          onSubmitEditing:async () => {
            // await this.refreshLoadPoint()
          },
        })}

        {/* {this.renderItemSeperator()} */}
        {this.renderSeperator()}
      </View>
    )
  }


  /** 当前加载点 */
  renderCurLoadPoint = () => {
    return (
      <View
        style={[styles.pickerView]}
      >
        {this.renderInputItem({
          title:getLanguage(global.language).Profile.LOADING_POINT_NAME,
          value: this.state.selectLoadPoint.name,
          showArray:this.state.loadPointNameArray.length > 0 ? true: false,
          onChangeText: async (text: string) => {
            const tempLoadPoint: SLocation.NtripMountPoint = {
              name:text,
              requireGGA:true,
            }
            this.setState({
              selectLoadPoint: tempLoadPoint,
            })
          },
          onRightBtn: () => {
            NavigationService.navigate("LocationLoadPoint",{
              loadPointArr:this.state.loadPointNameArray,
              selectLoadPoint: this.state.selectLoadPoint,
              action: this.changeLoadPoint,
            })
          },
        })}
        {/* {this.renderItemSeperator()} */}

        {this.renderSeperator()}

      </View>
    )
  }



  render() {
    return (
      <Container
        // ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Profile.NTRIP_SETTING,
          withoutBack: false,
          navigation: this.props.navigation,
          headerRight: this.renderRight(),
          isResponseHeader: true,
        }}
      >
        <ScrollView style={styles.container}>
          {this.renderAgreement()}
          {this.renderInputList()}
          {this.renderCurLoadPoint()}
          {/* this.state.address !== '' && this.state.port !== '' && this.state.userName !== '' && this.state.password !== '' */}
        </ScrollView>
      </Container>
    )
  }
}

export default NtripSetting
