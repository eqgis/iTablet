/**
 * 设备厂家页面  设计里的定位设备
 */
import React, { Component } from "react"
import { Text, Image, TouchableOpacity, ScrollView, Switch, View, FlatList, ActivityIndicator, Platform } from 'react-native'
import Container from '../../components/Container'
import { dp, scaleSize, Toast} from '../../utils'
import NavigationService from '../NavigationService'
import { getLanguage } from '../../language'
import { BluetoothDeviceInfoType, DeviceManufacturer, DeviceType } from '@/redux/models/location'
import styles from "./styles"
import { MainStackScreenNavigationProps } from "@/types"
import { LocationConnectionParam } from "imobile_for_reactnative/NativeModule/interfaces/SLocation"
import { SLocation } from "imobile_for_reactnative"
import { color } from "@/styles"
import { getImage, getThemeAssets } from "@/assets"


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

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if(this.props.isOpenBlutooth !== prevProps.isOpenBlutooth) {
      if(this.props.isOpenBlutooth) {
        this.bluetoothStateOpen()
      } else {
        this.bluetoothStateClose()
      }
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

      if(this.props.deviceManufacturer === 'woncan' && Platform.OS === 'android') {
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
      this.props?.setDeviceConnectionMode(this.state.isOpenBlutooth)
      NavigationService.goBack()
    }
  }

  bluetoothStateOpen = () => {
    this.getDevice()
    this.setState({
      isOpenBlutooth: true,
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

  bluetoothStateClose = () => {
    this.setState({
      isOpenBlutooth: false,
      pairedBTDevices: [],
      otherBTDevices: [],
      isSearch: false,
    })
    if(this.timer) {
      SLocation.setBTScanListner()
      clearTimeout(this.timer)
    }
  }

  /** 蓝牙开关按钮点击事件 */
  blueSwitchAction = async (value: boolean) => {
    if(value) {
      // 调打开蓝牙的方法
      const result = await SLocation.openBluetooth()
      if(result) {
        // 处理界面
        const tempTimer = setInterval(async () => {
          const isOpen = await SLocation.bluetoothIsOpen()
          if(isOpen) {
            this.getDevice()
            clearInterval(tempTimer)
          }
        },500)
        this.setState({
          isOpenBlutooth: value,
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

    } else {
      // 调蓝牙关闭方法
      const isStopScan = await SLocation.stopScanBluetooth()
      if(isStopScan) {
        const result = await SLocation.closeBluetooth()
        if(result) {
          this.setState({
            isOpenBlutooth: value,
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
          marginRight: scaleSize(26),
        }]}
      >
        <Text style={[styles.headerRightText]}>
          {getLanguage(global.language).Profile.CONFIRM}
        </Text>
      </TouchableOpacity>
    )
  }

  /** 蓝牙开关 */
  renderBluetoothSwitch = () => {
    return (
      <View style={[styles.itemView]}>
        <Text style={styles.text}>{getLanguage(global.language).Profile.SETTING_LOCATION_BLUETOOTH}</Text>
        <Switch
          // style={styles.switch}
          trackColor={{ false: '#F0F0F0', true: "#2D2D2D" }}
          thumbColor={this.state.isOpenBlutooth ? "#fff" : "#fff"}
          ios_backgroundColor={this.state.isOpenBlutooth ? "#2D2D2D" : '#F0F0F0'}
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
          marginLeft: dp(60),
        }]}
        activeOpacity={0.9}
        onPress={() => {
          this.setState({
            curBlueToothDevice: item,
          })
        }}
      >
        <Text style={[styles.text, {
          flex: 1,
        }]}>{item.name}</Text>
        {/* <Image
          style={styles.image}
          source={isSelect? radio_on : radio_off}
        /> */}
        <Text>{isSelect? "已连接": "未连接"}</Text>
        <Image
          source={getImage().arrow}
          style={[{
            width: dp(16),
            height: dp(16),
            marginLeft: dp(10),
          }]}
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

  renderItemSeperator = () => {
    return (
      <View style={[styles.itemSeperator]}>
        <View style={[styles.itemSeperatorLine]}></View>
      </View>
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
            // width: '100%',
            height: dp(60),
            flexDirection: 'row',
            justifyContent:'space-between',
            alignItems: 'center',
            marginRight: scaleSize(33),
            marginLeft: scaleSize(60),
            // backgroundColor: '#f00',
          }]}
        >
          <Text
            style={[styles.text]}
          >{getLanguage(global.language).Profile.PAIRED_BT_DEVICE_LIST}</Text>
          {this.state.isOpenBlutooth && (
            <TouchableOpacity
              style={[{
                width: dp(23),
                height:dp(30),
                justifyContent: 'center',
                alignItems: 'center',
              }]}
              onPress={this.searchAction}
            >
              {!this.state.isSearch && (
                <Image
                  source={getThemeAssets().edit.icon_refresh}
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
            // height: dp(200),
            flexDirection: 'column',
          }]}
          renderItem={this._renderItem}
          data={this.state.pairedBTDevices}
          keyExtractor={(item, index) => item.address + index}
          ItemSeparatorComponent={this.renderItemSeperator}
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