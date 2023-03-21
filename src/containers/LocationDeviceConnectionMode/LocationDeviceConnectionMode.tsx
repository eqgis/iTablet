/**
 * 设备厂家页面  设计里的定位设备
 */
import React, { Component } from "react"
import { Text, Image, TouchableOpacity, ScrollView, Switch, View, FlatList, ActivityIndicator, Platform } from 'react-native'
import Container from '../../components/Container'
import { dp, Toast} from '../../utils'
import NavigationService from '../NavigationService'
import { getLanguage } from '../../language'
import { BluetoothDeviceInfoType, DeviceManufacturer, DeviceType } from '@/redux/models/location'
import styles from "./styles"
import { MainStackScreenNavigationProps } from "@/types"
import { LocationConnectionParam } from "imobile_for_reactnative/NativeModule/interfaces/SLocation"
import { SLocation } from "imobile_for_reactnative"
import { color } from "@/styles"
import { getThemeAssets } from "@/assets"


const radio_on = require('../../assets/public/radio_select.png')
const radio_off = require('../../assets/public/radio_select_no.png')

interface Props {
	navigation: MainStackScreenNavigationProps<'LocationDeviceConnectionMode'>,
	deviceManufacturer: DeviceManufacturer,
  isOpenBlutooth: boolean,
  setDeviceConnectionMode: (isBluetoothMode: boolean) => void,
  bluetoohDevice: BluetoothDeviceInfoType,
  setBluetoothDeviceInfo: (bluetoothInfo: BluetoothDeviceInfoType | null) => void,
}

interface State {
	pairedBTDevices: BluetoothDeviceInfoType[],
  otherBTDevices: BluetoothDeviceInfoType[],
  isOpenBlutooth: boolean,
  curBlueToothDevice: BluetoothDeviceInfoType | null,
  isSearch: boolean,
}

class LocationDeviceConnectionMode extends Component<Props, State> {
  timer: NodeJS.Timeout | null = null
  constructor(props: Props) {
    super(props)
    this.state = {
      pairedBTDevices: [],
      otherBTDevices: [],
      isOpenBlutooth: this.props.isOpenBlutooth || false,
      curBlueToothDevice: this.props.bluetoohDevice || null,
      isSearch: false,
    }
  }

  componentDidMount = async () => {
    if(this.state.isOpenBlutooth) {
      this.getDevice()
    }
  }

  getDevice = async() => {
    try {
      Platform.OS === 'android' && this.addBtnScanlistner()
      // 已连接过的蓝牙
      const devicesSym: BluetoothDeviceInfoType[] = await SLocation.getPairedBTDevices()
      const pairedBTDevices: BluetoothDeviceInfoType[] = []
      devicesSym.map((item: BluetoothDeviceInfoType) => {
        const pairedBTDevice: BluetoothDeviceInfoType = {
          name: item.name,
          address: item.address,
        }
        pairedBTDevices.push(pairedBTDevice)
      })
      this.setState({
        pairedBTDevices,
        otherBTDevices: []
      })

      if(this.props.deviceManufacturer === '千寻' && Platform.OS === 'android') {
        SLocation.scanBluetooth()
        this.setState({
          isSearch: true,
        })
        this.timer = setTimeout(() => {
          if(this.timer) {
            SLocation.setBTScanListner()
            this.setState({
              isSearch: false,
            })
            clearTimeout(this.timer)
          }
        }, 10000)
      }

    } catch (error) {
      console.warn("BluetoothDevices mount error!")
    }

  }

  addBtnScanlistner = () => {
    SLocation.setBTScanListner(async (devicesResult: BluetoothDeviceInfoType) => {
      const devicesSym: BluetoothDeviceInfoType[] = await SLocation.getPairedBTDevices()
      const pairedBTDevices: BluetoothDeviceInfoType[] = []
      pairedBTDevices.push(devicesResult)
      devicesSym.map((item: BluetoothDeviceInfoType) => {
        const pairedBTDevice: BluetoothDeviceInfoType = {
          name: item.name,
          address: item.address,
        }
        pairedBTDevices.push(pairedBTDevice)
      })
      this.setState({
        pairedBTDevices,
        otherBTDevices: [devicesResult],
        isSearch: false,
      })
    })
  }

  changeDeviceType = () => {
    if(this.state.isOpenBlutooth && this.state.curBlueToothDevice) {
      this.props?.setDeviceConnectionMode(this.state.isOpenBlutooth)
      this.props?.setBluetoothDeviceInfo(this.state.curBlueToothDevice)
      NavigationService.goBack()
    }
    if(!this.state.isOpenBlutooth) {
      this.props?.setBluetoothDeviceInfo(this.state.curBlueToothDevice)
      NavigationService.goBack()
    }
  }

  /** 蓝牙开关按钮点击事件 */
  blueSwitchAction = (value: boolean) => {
    this.setState({ isOpenBlutooth: value})
    // 调打开蓝牙的方法 todo
    // 处理界面
    if(value) {
      this.getDevice()
      this.setState({
        isSearch: true,
      })
      this.timer = setTimeout(() => {
        if(this.timer) {
          SLocation.setBTScanListner()
          this.setState({
            isSearch: false,
          })
          clearTimeout(this.timer)
        }
      }, 10000)
    } else {
      this.setState({
        pairedBTDevices: [],
        otherBTDevices: [],
        isSearch: false,
      })
      if(this.timer) {
        SLocation.setBTScanListner()
        clearTimeout(this.timer)
      }
    }
  }

  /** 刷新按钮点击事件 */
  searchAction = () => {
    try {
      if(this.state.isSearch) {
        SLocation.setBTScanListner()
        this.setState({
          isSearch: false,
        })
        this.timer && clearTimeout(this.timer)
      } else {
        this.getDevice()
        this.setState({
          isSearch: true,
        })
        this.timer = setTimeout(() => {
          if(this.timer) {
            SLocation.setBTScanListner()
            this.setState({
              isSearch: false,
            })
            clearTimeout(this.timer)
          }
        }, 10000)
      }
    } catch (error) {
      // to do
    }
  }

  /** 确认按钮 */
  renderRight = () => {
    const textColor = 'black'
    return (
      <TouchableOpacity
        onPress={this.changeDeviceType}
        style={[{
          marginRight: dp(10),
        }]}
      >
        <Text style={[styles.headerRightText, { color: textColor }]}>
          {getLanguage(global.language).Profile.CONFIRM}
        </Text>
      </TouchableOpacity>
    )
  }

  /** 蓝牙开关 */
  renderBluetoothSwitch = () => {
    return (
      <View style={styles.itemView}>
        <Text style={styles.text}>{getLanguage(global.language).Profile.SETTING_LOCATION_BLUETOOTH}</Text>
        <Switch
        // style={styles.switch}
          trackColor={{ false: color.bgG, true: color.switch }}
          thumbColor={this.state.isOpenBlutooth ? color.bgW : color.bgW}
          ios_backgroundColor={this.state.isOpenBlutooth ? color.switch : color.bgG}
          value={this.state.isOpenBlutooth}
          onValueChange={this.blueSwitchAction}
        />
      </View>
    )
  }

  _renderItem = ({ item }: {item: BluetoothDeviceInfoType}) => {

    const isSelect = this.state.curBlueToothDevice && JSON.stringify(this.state.curBlueToothDevice) === JSON.stringify(item)

    return (
      <TouchableOpacity
        key = {item.address}
        style={[styles.itemView,{
          marginLeft: dp(30),
        }]}
        activeOpacity={0.9}
        onPress={() => {
          this.setState({
            curBlueToothDevice: item,
          })
        }}
      >
        <Text style={styles.text}>{item.name}</Text>
        <Image
          style={styles.image}
          source={isSelect? radio_on : radio_off}
        />
      </TouchableOpacity>
    )
  }

  renderInterval = () => {
    return (
      <View
        style={[{
          width: '100%',
          height: dp(5),
          backgroundColor: '#f9f9f9',
        }]}
      ></View>
    )
  }

  renderSearchview = () => {
    return (
      <ActivityIndicator size="small" color="#505050" />
    )
  }



  renderPairedBTDevices = () => {
    return (
      <View>
        <View
          style={[{
            width: '100%',
            height: dp(60),
            flexDirection: 'row',
            justifyContent:'space-between',
            alignItems: 'center',
            paddingHorizontal: dp(10),
          }]}
        >
          <Text
            style={[{
              fontSize: dp(16),
            }]}
          >{getLanguage(global.language).Profile.PAIRED_BT_DEVICE_LIST}</Text>
          {this.state.isOpenBlutooth && (
            <TouchableOpacity
              style={[{
                width: dp(30),
                height:dp(30),
                justifyContent: 'center',
                alignItems: 'center',
              }]}
              onPress={this.searchAction}
            >
              {!this.state.isSearch && (
                <Image
                  source={getThemeAssets().edit.icon_redo}
                  style={[{
                    width: dp(23),
                    height:dp(23),
                  }]}
                />
              )}
              {this.state.isSearch && this.renderSearchview()}
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          style={[{
            width: '100%',
            height: dp(200),
            flexDirection: 'column',
          }]}
          renderItem={this._renderItem}
          data={this.state.pairedBTDevices}
          keyExtractor={(item, index) => item.address + index}
        />
      </View>
    )
  }



  render() {
    return (
      <Container
        // ref={(ref: typeof Container) => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Profile.CONNECTION_MODE,
          withoutBack: false,
          navigation: this.props.navigation,
          headerRight: this.renderRight(),
          isResponseHeader: true,
        }}
        style={styles.container}
      >
        {this.renderBluetoothSwitch()}
        {this.renderInterval()}
        {/* 列表 */}
        {this.renderPairedBTDevices()}
        {this.renderInterval()}

      </Container>
    )
  }
}

export default LocationDeviceConnectionMode