import { Container } from '../../components'
import { getLanguage } from "@/language"
import { MainStackScreenNavigationProps } from "@/types/NavigationTypes"
import React, {Component} from "react"
import { TouchableOpacity, View, Text, TextInput } from "react-native"
import { SLocation } from "imobile_for_reactnative"
import styles from "./style"
import { Picker } from '@react-native-picker/picker'
import { Toast } from '@/utils'
import { NtripMountPoint } from 'imobile_for_reactnative/NativeModule/interfaces/SLocation'
import NavigationService from '../NavigationService'

interface Props{
  navigation: MainStackScreenNavigationProps<'NtripSetting'>,
}

interface PickerItemType {
  label: string
  value: string | NtripMountPoint
}

interface State {
  /** 协议 */
  agreement: 'NTRIPV1'
  address: string
  port: string
  userName: string
  password: string
  /** 当前选中的加载点 */
  selectLoadPoint: NtripMountPoint
  /** 加载点数组 */
  // loadPointArray: Array<NtripMountPoint>
  loadPointNameArray: Array<PickerItemType>
}


class NtripSetting extends Component<Props, State> {

  agreementArray = [
    {label: 'NTRIPV1', value: 'NTRIPV1'},
  ]

  constructor(props: Props) {
    super(props)
    this.state = {
      agreement: 'NTRIPV1',
      address: 'www.geodetic.gov.hk',
      port: '2101',
      userName: 'sms01',
      password: 'sms711',
      selectLoadPoint: {
        name: '',
        requireGGA: false,
      },
      // loadPointArray:[],
      loadPointNameArray:[],
    }
  }

  componentDidMount = async () => {
    await this.refreshLoadPoint()
  }

  refreshLoadPoint = async () => {
    try {
      if(this.state.address !== '' && this.state.port !== '' && this.state.userName !== '' && this.state.password !== '') {
        const info = {
          address: this.state.address,
          port: Number(this.state.port),
          userName: this.state.userName,
          password: this.state.password,
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
          <Text style={[styles.listTitle]} >{'协议'}</Text>
        </View>
        {/* 协议类型 */}
        <View
          style={[styles.pickerItem]}
        >
          <Text style={styles.text}>{'协议类型'}</Text>
          <Picker
            selectedValue={this.state.agreement}
            mode={'dropdown'}
            style={[styles.pickerSize]}
            onValueChange={value => {
              this.setState({agreement: value})
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
          <Text style={[styles.listTitle]} >{'基本信息'}</Text>
        </View>
        {/* 地址 */}
        <View
          style={[styles.itemView]}
        >
          <Text style={styles.text}>{"服务地址:"}</Text>
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
          />

        </View>
        {this.renderItemSeperator()}
        {/* 端口号 */}
        <View
          style={[styles.itemView]}
        >
          <Text style={styles.text}>{"端口号:"}</Text>

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
          />
        </View>
        {this.renderItemSeperator()}

        {/* 用户名 */}
        <View
          style={[styles.itemView]}
        >
          <Text style={styles.text}>{"用户名:"}</Text>

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
          />
        </View>
        {this.renderItemSeperator()}

        {/* 密码 */}
        <View
          style={[styles.itemView]}
        >
          <Text style={styles.text}>{"密码:"}</Text>

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
          />

        </View>
        {this.renderSeperator()}
      </View>
    )
  }

  /** 加载点 */
  renderLoadPoint = () => {
    return (
      <View
        style={[styles.pickerView]}
      >
        {/* 头 */}
        <View
          style={[styles.listTitleView]}
        >
          <Text style={[styles.listTitle]} >{'加载点'}</Text>
        </View>
        {/* 加载点 */}
        <View
          style={[styles.pickerItem]}
        >
          <Text style={styles.text}>{'加载点'}</Text>
          <Picker
            selectedValue={this.state.selectLoadPoint}
            mode={'dropdown'}
            style={[styles.pickerSize]}
            onValueChange={value => {
              this.setState({selectLoadPoint: value})
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
        <View style={styles.container}>
          {this.renderAgreement()}
          {this.renderInputList()}
          {this.state.address !== '' && this.state.port !== '' && this.state.userName !== '' && this.state.password !== ''
          && this.renderLoadPoint()}
          {/* {this.renderLoadPoint()} */}
        </View>
      </Container>
    )
  }
}

export default NtripSetting
