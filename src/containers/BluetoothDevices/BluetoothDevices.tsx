import { Container } from '../../components'
import { getLanguage } from "@/language"
import { MainStackScreenNavigationProps } from "@/types/NavigationTypes"
import React, {Component} from "react"
import { Image, TouchableOpacity, View, Text, ActivityIndicator } from "react-native"
import { SLocation } from "imobile_for_reactnative"
import styles from "./style"
import { Picker } from '@react-native-picker/picker'
import { ScrollView } from 'react-native-gesture-handler'
import { getSelectDevice, setSelectDevice } from '../locationSetting/deviceUtil'
import NavigationService from '../NavigationService'


const radio_on = require('../../assets/public/radio_select.png')
const radio_off = require('../../assets/public/radio_select_no.png')

interface Props{
  navigation: MainStackScreenNavigationProps<'BluetoothDevices'>,
  // route: MainStackScreenRouteProp<'BluetoothDevices'>,
  peripheralDevice: SLocation.LocationConnectionParam,
  setDevice: (param: SLocation.LocationConnectionParam) => void
}

interface State {
  devices: SLocation.LocationConnectionParam[],
  currentOption: SLocation.LocationConnectionParam,
  showSearch: boolean
  searchNotify: string
  gnssTppe: 'rtk'
  brand: 'other' | 'situoli'
}

interface BluedeviceMainInfo {
  name: string
  address: string
}

class BluetoothDevices extends Component<Props, State> {

  prevOption: SLocation.LocationConnectionParam
  brandArray = [
    {label: '思拓力', value: 'situoli'},
    {label: '其它', value: 'other'},
  ]
  gnssTppeArray = [
    {label: 'rtk', value: 'rtk'},
  ]

  constructor(props: Props) {
    super(props)
    this.prevOption = this.props.peripheralDevice
    this.state = {
      devices: [],
      currentOption: this.prevOption,
      showSearch: true,
      searchNotify: getLanguage(global.language).Prompt.SEARCHING,
      gnssTppe: 'rtk',
      brand: 'situoli',
    }
  }

  componentDidMount = () => {
    try {
      // await SLocation.connectNtrip()
      this.getData()
    } catch (error) {
      console.warn("BluetoothDevices mount error!")
    }
  }

  componentWillUnmount = async () => {
    // await SLocation.disconnectNtrip()

  }

  getData = async () => {
    try {
      const devicesSym: BluedeviceMainInfo[] = await SLocation.getPairedBTDevices()
      const devices: SLocation.LocationConnectionParam[] = []

      devicesSym.map((item: BluedeviceMainInfo) => {
        const device: SLocation.LocationConnectionParam = {
          type: 'bluetooth',
          name: item.name,
          mac: item.address,
          gnssTppe: this.state.gnssTppe,
          brand: this.state.brand,
        }
        devices.push(device)
      })
      this.setState({
        devices,
      })
    } catch (error) {
      console.warn('Bluetooth Devices get error!')
    }
  }

  /** 修改redux里的设备 */
  changeDevice = () => {
    const currentOption = this.state.currentOption
    if(currentOption.type === 'bluetooth') {
      setSelectDevice(currentOption)
    }
    NavigationService.goBack()
  }

  /** 确认按钮 */
  renderRight = () => {
    const textColor = 'black'
    // const isDisabled = JSON.stringify(this.state.currentOption) === JSON.stringify(this.prevOption)
    // if (isDisabled) {
    //   textColor = '#A0A0A0'
    // }
    return (
      <View>
        <TouchableOpacity
          // disabled={isDisabled}
          onPress={this.changeDevice}
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

  renderPickers = () => {
    return (
      <View
        style={[styles.pickerView, styles.marginT40]}
      >
        {/* 头 */}
        <View
          style={[styles.listTitleView]}
        >
          <Text style={[styles.listTitle]} >{getLanguage(global.language).Profile.DEVICE_INFORMATION_SETTING}</Text>
        </View>
        {/* 仪器厂家 */}
        <View
          style={[styles.pickerItem]}
        >
          <Text style={styles.text}>{getLanguage(global.language).Profile.INSTRUMENT_MANUFACTURER}</Text>
          <Picker
            selectedValue={this.state.brand}
            mode={'dropdown'}
            style={[styles.pickerSize]}
            onValueChange={value => {
              // setValue(value)
              // value !== null && props.onValueChange(value)
              this.setState({brand: value})
            } }
          >
            {this.brandArray.map((item, index) => {
              return <Picker.Item label={item.label} value={item.value} key={item.label + index} />
            })}

          </Picker>
        </View>

        {/* 仪器类型 */}
        <View
          style={[styles.pickerItem]}
        >
          <Text style={styles.text}>{getLanguage(global.language).Profile.INSTRUMENT_TYPE}</Text>
          <Picker
            selectedValue={this.state.gnssTppe}
            mode={'dropdown'}
            style={[styles.pickerSize]}
            onValueChange={value => {
              // setValue(value)
              // value !== null && props.onValueChange(value)
              this.setState({gnssTppe: value})
            } }
          >
            {this.gnssTppeArray.map((item, index) => {
              return <Picker.Item label={item.label} value={item.value} key={item.label + index} />
            })}

          </Picker>
        </View>

        {this.renderSeperator()}

      </View>
    )
  }

  /** 列表项 */
  renderItem = (device: SLocation.LocationConnectionParam) => {
    if(device.type !== 'bluetooth') {
      return null
    }
    if(device.mac === 'null'){
      return null
    }
    const title = device.name
    return (
      <View key = {device.mac}>
        <TouchableOpacity
          style={styles.itemView}
          activeOpacity={0.9}
          onPress={() => {
            this.setState({ currentOption: device })
          }}
        >
          <Text style={styles.text}>{title}</Text>
          <Image
            style={styles.image}
            source={JSON.stringify(this.state.currentOption) === JSON.stringify(device) || JSON.stringify(getSelectDevice()) === JSON.stringify(device) ? radio_on : radio_off}
          />
        </TouchableOpacity>
      </View>
    )
  }

  /** 渲染列表 */
  renderItems = () => {
    return this.state.devices.map(device => {
      return this.renderItem(device)
    })
  }

  /** 蓝牙列表部分 */
  renderList = () => {
    return (
      <View
        style={[styles.listContainer]}
      >
        {/* 头 */}
        <View
          style={[styles.listTitleView, styles.marginT40]}
        >
          <Text style={styles.text}>{getLanguage(global.language).Profile.BLUETOOTH_DEVICE_LIST}</Text>
        </View>
        {/* 列表 */}
        <ScrollView
          style={[styles.listContentView]}
        >
          {this.renderItems()}
        </ScrollView>
        {this.renderSeperator()}
      </View>
    )
  }

  // /** 搜素 */
  // renderSearch() {
  //   return (
  //     <View style={styles.searchItem}>
  //       {this.state.searchNotify === getLanguage(global.language).Prompt.SEARCHING && (<ActivityIndicator size="small" color="#505050" />)}
  //       <Text style={styles.searchText}>
  //         {this.state.searchNotify}
  //       </Text>

  //     </View>
  //   )
  // }

  render() {
    return (
      <Container
        // ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Profile.SETTING_LOCATION_BLUETOOTH,
          withoutBack: false,
          navigation: this.props.navigation,
          headerRight: this.renderRight(),
          isResponseHeader: true,
        }}
      >
        <View style={styles.container}>
          {this.renderPickers()}
          {/* 蓝牙设备列表 */}
          {this.renderList()}
          {/* 搜索 */}
          {/* {this.state.showSearch && this.renderSearch()} */}
        </View>
      </Container>
    )
  }
}

export default BluetoothDevices
