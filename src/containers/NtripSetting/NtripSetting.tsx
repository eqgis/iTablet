import { Container, Input } from '../../components'
import { getLanguage } from "@/language"
import { MainStackScreenNavigationProps } from "@/types/NavigationTypes"
import React, {Component} from "react"
import { Image, TouchableOpacity, View, Text } from "react-native"
import { SLocation } from "imobile_for_reactnative"
import styles from "./style"
import { Picker } from '@react-native-picker/picker'
import { ScrollView } from 'react-native-gesture-handler'
import { DialogUtils } from '@/utils'
import { NtripMountPoint } from 'imobile_for_reactnative/NativeModule/interfaces/SLocation'

interface Props{
  navigation: MainStackScreenNavigationProps<'NtripSetting'>,
  // route: MainStackScreenRouteProp<'BluetoothDevices'>,
}

interface State {
  /** 协议 */
  agreement: 'NTRIPVE'
  address: string
  port: string
  userName: string
  password: string
  /** 当前选中的加载点 */
  selectLoadPoint: NtripMountPoint
  /** 加载点数组 */
  loadPointArray: Array<NtripMountPoint>
}

class NtripSetting extends Component<Props, State> {

  agreementArray = [
    {label: 'NTRIPVE', value: 'NTRIPVE'},
  ]

  constructor(props: Props) {
    super(props)
    this.state = {
      agreement: 'NTRIPVE',
      address: '',
      port: '',
      userName: '',
      password: '',
      selectLoadPoint: {
        name: '',
        requireGGA: false,
      },
      loadPointArray:[],
    }
  }

  /** 确认按钮 */
  renderRight = () => {
    const textColor = 'black'
    return (
      <View>
        <TouchableOpacity
          // disabled={isDisabled}
          // onPress={this.changeDevice}
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
    return <View style={styles.seperator} />
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


  renderInputList = () => {
    return (
      <View>
        {/* 头 */}
        <View
          style={[styles.listTitleView, styles.marginT40]}
        >
          <Text style={[styles.listTitle]} >{'基本信息'}</Text>
        </View>
        {/* 用户名 */}
        <View
          style={[styles.itemView]}
        >
          <Text style={styles.text}>{"用户名"}</Text>
          <TouchableOpacity
            style={styles.itemValueBtn}
            activeOpacity={0.9}
            onPress={() => {

              DialogUtils.showInputDailog({
                value: this.state.userName,
                confirmAction: async (value: string) => {
                  this.setState({
                    userName: value,
                  })
                  DialogUtils.hideInputDailog()
                },
              })
            }}
          >
            <Text style={[styles.itemValueBtnText]}>{this.state.userName}</Text>
          </TouchableOpacity>
        </View>
        {this.renderSeperator()}

        {/* 密码 */}
        <View
          style={[styles.itemView]}
        >
          <Text style={styles.text}>{"密码"}</Text>
          <TouchableOpacity
            style={styles.itemValueBtn}
            activeOpacity={0.9}
            onPress={() => {

              DialogUtils.showInputDailog({
                value: this.state.password,
                confirmAction: async (value: string) => {
                  this.setState({
                    password: value,
                  })
                  DialogUtils.hideInputDailog()
                },
              })
            }}
          >
            <Text style={[styles.itemValueBtnText]}>{this.state.password}</Text>
          </TouchableOpacity>
        </View>
        {this.renderSeperator()}
        {/* 地址 */}
        <View
          style={[styles.itemView]}
        >
          <Text style={styles.text}>{"服务地址"}</Text>
          <TouchableOpacity
            style={styles.itemValueBtn}
            activeOpacity={0.9}
            onPress={() => {

              DialogUtils.showInputDailog({
                value: this.state.address,
                confirmAction: async (value: string) => {
                  this.setState({
                    address: value,
                  })
                  DialogUtils.hideInputDailog()
                },
              })
            }}
          >
            <Text style={[styles.itemValueBtnText]}>{this.state.address}</Text>
          </TouchableOpacity>
        </View>
        {this.renderSeperator()}
        {/* 端口号 */}
        <View
          style={[styles.itemView]}
        >
          <Text style={styles.text}>{"端口号"}</Text>
          <TouchableOpacity
            style={styles.itemValueBtn}
            activeOpacity={0.9}
            onPress={() => {

              DialogUtils.showInputDailog({
                value: this.state.port,
                confirmAction: async (value: string) => {
                  this.setState({
                    port: value,
                  })
                  DialogUtils.hideInputDailog()
                },
              })
            }}
          >
            <Text style={[styles.itemValueBtnText]}>{this.state.port}</Text>
          </TouchableOpacity>
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
          style={[styles.listTitleView, styles.marginT40]}
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
              // setValue(value)
              // value !== null && props.onValueChange(value)
              this.setState({selectLoadPoint: value})
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
          {this.renderLoadPoint()}
        </View>
      </Container>
    )
  }
}

export default NtripSetting
