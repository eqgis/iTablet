import { Container } from '../../components'
import { getLanguage } from "@/language"
import { MainStackScreenNavigationProps } from "@/types/NavigationTypes"
import React, {Component} from "react"
import { TouchableOpacity, View, Text, TextInput, Image, ScrollView } from "react-native"
import { SLocation } from "imobile_for_reactnative"
import styles from "./style"
import { Picker } from '@react-native-picker/picker'
import { dp, Toast } from '@/utils'
import { NtripMountPoint } from 'imobile_for_reactnative/NativeModule/interfaces/SLocation'
import NavigationService from '../NavigationService'
import { EssentialInfo } from '@/redux/models/location'
import { getImage } from '@/assets'
import { LocationConnectionParam } from '../BluetoothDevices/BluetoothDevices'

interface Props{
  navigation: MainStackScreenNavigationProps<'NtripSetting'>,
  essentialInfo: EssentialInfo
  selectLoadPoint: NtripMountPoint
  peripheralDevice: LocationConnectionParam
  updateNtripInfo: (essentialInfo:EssentialInfo, selectLoadPoint: NtripMountPoint) => void
}

export interface PickerItemType {
  label: string
  value: string | NtripMountPoint
}

interface State extends EssentialInfo {
  /** 当前选中的加载点 */
  selectLoadPoint: NtripMountPoint
  /** 加载点数组 */
  // loadPointArray: Array<NtripMountPoint>
  loadPointNameArray: Array<PickerItemType>
  // requireGGA: string,
}


class NtripSetting extends Component<Props, State> {

  agreementArray = [
    {label: 'NTRIPV1', value: 'NTRIPV1'},
    {label: '中国移动', value: 'China Mobile'},
  ]

  chinaMobileLoadPoint:Array<PickerItemType> = [
    {
      label: "RTCM33_GRCEJ",
      value: {
        name: "RTCM33_GRCEJ",
        requireGGA:true,
      },
    },
    {
      label: "RTCM33_GRCEpro",
      value: {
        name: "RTCM33_GRCEpro",
        requireGGA:true,
      },
    },
    {
      label: "RTCM33_GRCE",
      value: {
        name: "RTCM33_GRCE",
        requireGGA:true,
      },
    },
    {
      label: "RTCM33_GRC",
      value: {
        name: "RTCM33_GRC",
        requireGGA:true,
      },
    },
    {
      label: "RTCM30_GR",
      value: {
        name: "RTCM30_GR",
        requireGGA:true,
      },
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
    if(this.props.peripheralDevice.type === 'bluetooth' && this.props.peripheralDevice.brand === 'mijiaH20') {
      Toast.show(getLanguage(global.language).Profile.CHECK_DEVICE_SUPPORTS_DIFFERENTIAL_SERVICE)
    }
  }

  refreshLoadPoint = async () => {
    try {
      // && (this.state.agreement === 'China Mobile' || (this.state.userName !== '' && this.state.password !== ''))
      if(this.state.address !== '' && this.state.port !== '' && this.state.agreement !== 'China Mobile') {
        const info = {
          address: this.state.address,
          port: Number(this.state.port),
          // userName: this.state.userName,
          // password: this.state.password,
        }
        const tempArray = await SLocation.getNtripSourceTable(info)
        const nameArray: Array<PickerItemType> = []
        // 构造picker的item的类型
        for(let i = 0; i < tempArray.length; i ++) {
          const item = tempArray[i]
          const obj = {
            label: item.name,
            value: item,
          }
          nameArray.push(obj)
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
  /** 确认按钮 */
  renderRight = () => {
    const textColor = 'black'
    return (
      <View>
        <TouchableOpacity
          // disabled={isDisabled}
          onPress={this.setNtrip}
        >
          <Text style={[styles.headerRightText, { color: textColor }]}>
            {getLanguage(global.language).Profile.CONFIRM}
          </Text>
        </TouchableOpacity>
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
        {/* 头 */}
        <View
          style={[styles.listTitleView]}
        >
          <Text style={[styles.listTitle]} >{getLanguage(global.language).Profile.NTRIP_AGREEMENT}</Text>
        </View>
        {/* 协议类型 */}
        <View
          style={[styles.pickerItem]}
        >
          <Text style={styles.text}>{getLanguage(global.language).Profile.PROTOCOL_TYPE}</Text>
          <Picker
            selectedValue={this.state.agreement}
            mode={'dropdown'}
            style={[styles.pickerSize]}
            onValueChange={value => {
              // this.setState({agreement: value})
              // console.warn("value: " + value)
              if(value === 'China Mobile') {
                const nameArray: Array<PickerItemType> = JSON.parse(JSON.stringify(this.chinaMobileLoadPoint))
                // console.warn("nameArray:  " + JSON.stringify(nameArray))
                // 修改state里的值
                this.setState({
                  // loadPointArray: tempArray,
                  loadPointNameArray: nameArray,
                  agreement: value,
                })
              } else {
                this.setState({agreement: value}, () => {
                  this.refreshLoadPoint()
                })
              }
            } }
          >
            {this.agreementArray.map((item, index) => {
              return <Picker.Item label={item.label} value={item.value} key={item.label + index} />
            })}

          </Picker>
        </View>

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
        {/* 头 */}
        <View
          style={[styles.listTitleView]}
        >
          <Text style={[styles.listTitle]} >{getLanguage(global.language).Profile.ESSENTIAL_INFORMATION}</Text>
        </View>
        {/* 地址 */}
        <View
          style={[styles.itemView]}
        >
          <Text style={styles.text}>{getLanguage(global.language).Profile.SERVICE_ADDRESS + ":"}</Text>
          <TextInput
            style={[styles.itemValueBtn]}
            autoFocus={false}
            // placeholder={this.state.placeholder}
            value={this.state.address}
            onChangeText={async (text: string) => {
              this.setState({
                address: text,
              })
              await this.refreshLoadPoint()
            }}
            onEndEditing={async () => {
              await this.refreshLoadPoint()
            }}
            onSubmitEditing={async () => {
              await this.refreshLoadPoint()
            }}
          />

        </View>
        {this.renderItemSeperator()}
        {/* 端口号 */}
        <View
          style={[styles.itemView]}
        >
          <Text style={styles.text}>{getLanguage(global.language).Profile.PORT_NUMBER + ":"}</Text>

          <TextInput
            style={[styles.itemValueBtn]}
            autoFocus={false}
            // placeholder={this.state.placeholder}
            value={this.state.port}
            onChangeText={async (text: string) => {
              // 类型验证，限制输入非法字符
              if(Number(text).toString() !== 'NaN') {
                this.setState({
                  port: text,
                })
                await this.refreshLoadPoint()
              }
            }}
            onEndEditing={async () => {
              await this.refreshLoadPoint()
            }}
            onSubmitEditing={async () => {
              await this.refreshLoadPoint()
            }}
          />
        </View>
        {this.renderItemSeperator()}

        {/* 用户名 */}
        <View
          style={[styles.itemView]}
        >
          <Text style={styles.text}>{getLanguage(global.language).Profile.USERNAME + ":"}</Text>

          <TextInput
            style={[styles.itemValueBtn]}
            autoFocus={false}
            // placeholder={this.state.placeholder}
            value={this.state.userName}
            onChangeText={async (text: string) => {
              this.setState({
                userName: text,
              })
              await this.refreshLoadPoint()
            }}
            onEndEditing={async () => {
              await this.refreshLoadPoint()
            }}
            onSubmitEditing={async () => {
              await this.refreshLoadPoint()
            }}
          />
        </View>
        {this.renderItemSeperator()}

        {/* 密码 */}
        <View
          style={[styles.itemView]}
        >
          <Text style={styles.text}>{getLanguage(global.language).Profile.PASSWORD + ":"}</Text>

          <TextInput
            style={[styles.itemValueBtn]}
            autoFocus={false}
            // placeholder={this.state.placeholder}
            textContentType = {'password'}
            secureTextEntry = {true}
            value={this.state.password}
            onChangeText={async (text: string) => {
              this.setState({
                password: text,
              })
              await this.refreshLoadPoint()
            }}
            onEndEditing={async () => {
              await this.refreshLoadPoint()
            }}
            onSubmitEditing={async () => {
              await this.refreshLoadPoint()
            }}
          />

        </View>
        {this.renderItemSeperator()}
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
        {/* 头 */}
        <View
          style={[styles.listTitleView]}
        >
          <Text style={[styles.listTitle]} >{getLanguage(global.language).Profile.CURRENT_LOADING_POINT}</Text>
        </View>


        <View style={[styles.pickerItem]}>
          <Text style={styles.text}>{getLanguage(global.language).Profile.LOADING_POINT_NAME + ":"}</Text>
          <View
            style={[{
              flex:1,
              height: dp(40),
              flexDirection: 'row',
              paddingTop: dp(5),
            }]}
          >
            <TextInput
              style={[styles.itemValueBtn]}
              autoFocus={false}
              // placeholder={this.state.placeholder}
              value={this.state.selectLoadPoint.name}
              onChangeText={async (text: string) => {
                const tempLoadPoint: SLocation.NtripMountPoint = {
                  name:text,
                  requireGGA:true,
                }
                this.setState({
                  selectLoadPoint: tempLoadPoint,
                })
              }}
            />
            {/* <Image
              style={[{
                marginRight: dp(12)
              }]}
              source={getImage().icon_close}
            /> */}
          </View>
        </View>
        {this.renderItemSeperator()}


        {/* <View style={[styles.pickerItem]}>
          <Text style={styles.text}>{"requireGGA" + ":"}</Text>
          <View
            style={[{
              flex:1,
              height: dp(40),
              flexDirection: 'row',
              paddingTop: dp(5),
            }]}
          >
            <TextInput
              style={[styles.itemValueBtn]}
              autoFocus={false}
              placeholder={"true or false"}
              value={this.state.requireGGA}
              onChangeText={async (text: string) => {
                this.setState({
                  requireGGA: text,
                })
              }}
              onEndEditing={async (event) => {
                const text = event.nativeEvent.text
                const tempLoadPoint: SLocation.NtripMountPoint = {
                  name:this.state.selectLoadPoint.name,
                  requireGGA: text === 'true' || text === "True" || this.state.selectLoadPoint.requireGGA,
                }
                this.setState({
                  selectLoadPoint: tempLoadPoint,
                  requireGGA: (text === 'true' || text === "True" || this.state.selectLoadPoint.requireGGA) + "",
                })
              }}
              onSubmitEditing={async (event) => {
                const text = event.nativeEvent.text
                const tempLoadPoint: SLocation.NtripMountPoint = {
                  name:this.state.selectLoadPoint.name,
                  requireGGA: text === 'true' || text === "True" || this.state.selectLoadPoint.requireGGA,
                }
                this.setState({
                  selectLoadPoint: tempLoadPoint,
                  requireGGA: (text === 'true' || text === "True" || this.state.selectLoadPoint.requireGGA) + "",
                })
              }}
            />
            <Image
              style={[{
                marginRight: dp(12)
              }]}
              source={getImage().icon_close}
            />
          </View>
        </View>
        {this.renderItemSeperator()} */}

        {this.renderSeperator()}

      </View>
    )
  }

  /** 系统加载点 */
  renderLoadPoint = () => {
    return (
      <View
        style={[styles.pickerView]}
      >
        {/* 头 */}
        <View
          style={[styles.listTitleView]}
        >
          <Text style={[styles.listTitle]} >{getLanguage(global.language).Profile.LOADING_POINT}</Text>
        </View>
        {/* 系统自带加载点 */}
        <View
          style={[styles.pickerItem]}
        >
          <Text style={styles.text}>{getLanguage(global.language).Profile.LOADING_POINT}</Text>
          <Picker
            selectedValue={this.state.selectLoadPoint}
            mode={'dropdown'}
            style={[styles.pickerSize]}
            onValueChange={value => {
              this.setState({
                selectLoadPoint: value,
                // requireGGA: value.requireGGA + "",
              })
            } }
          >
            {this.state.loadPointNameArray.map((item, index) => {
              return <Picker.Item label={item.label} value={item.value} key={item.label + index} />
            })}

          </Picker>
        </View>

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
          {this.state.loadPointNameArray.length >0 && this.renderLoadPoint()}
        </ScrollView>
      </Container>
    )
  }
}

export default NtripSetting
