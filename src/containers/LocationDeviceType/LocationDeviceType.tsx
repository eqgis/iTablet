/**
 * 设备厂家页面  设计里的定位设备
 */
import React, { Component } from "react"
import { Text, Image, TouchableOpacity, ScrollView, View } from 'react-native'
import Container from '../../components/Container'
import { dp, scaleSize} from '../../utils'
import NavigationService from '../NavigationService'
import { getLanguage } from '../../language'
import { DeviceType } from '@/redux/models/location'
import styles from "./styles"
import { MainStackScreenNavigationProps } from "@/types"


const radio_on = require('../../assets/public/radio_select.png')
const radio_off = require('../../assets/public/radio_select_no.png')

interface Props {
	navigation: MainStackScreenNavigationProps<'LocationDeviceType'>,
	deviceType: DeviceType,
	setDeviceType: (devicetype: DeviceType) => void
}

interface State {
	curDeviceType: DeviceType,
}

class LocationDeviceType extends Component<Props, State> {
  devicetypes: Array<DeviceType> = ['GPS', 'RTK']

  constructor(props: Props) {
    super(props)
    this.state = {
      curDeviceType: this.props.deviceType || "GPS",
    }
  }

  changeDeviceType = () => {
    this.props?.setDeviceType(this.state.curDeviceType)
    NavigationService.goBack()
  }

  /** 确认按钮 */
  renderRight = () => {
    const textColor = 'black'
    return (
      <TouchableOpacity
        onPress={this.changeDeviceType}
        style={[{
          marginRight: scaleSize(30),
        }]}
      >
        <Text style={[styles.headerRightText]}>
          {getLanguage(global.language).Profile.CONFIRM}
        </Text>
      </TouchableOpacity>
    )
  }

  /** 分割线 */
  renderSeperator = () => {
    return  <View style={styles.seperator} />
  }

  /** 列表项 */
  renderItem = (devicetype: DeviceType, index: number) => {
    return (
      <TouchableOpacity
        style={[styles.itemView,
          index === this.devicetypes.length - 1 && {
            borderBottomColor: '#fff',
          }
        ]}
        activeOpacity={0.9}
        onPress={() => {
          this.setState({
            curDeviceType: devicetype,
          })
        }}
      >
        <Text style={styles.text}>{devicetype}</Text>
        <Image
          style={styles.image}
          source={this.state.curDeviceType === devicetype? radio_on : radio_off}
        />
      </TouchableOpacity>
    )
  }

  /** 渲染列表 */
  renderItems = () => {
    return this.devicetypes.map((devicetype: DeviceType, index: number) => {
      return this.renderItem(devicetype, index)
    })
  }

  render() {
    return (
      <Container
        // ref={(ref: typeof Container) => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Profile.DEVICE_TYPE,
          withoutBack: false,
          navigation: this.props.navigation,
          headerRight: this.renderRight(),
          isResponseHeader: true,
        }}
        style={styles.container}
      >
        {/* 列表 */}
        <ScrollView
          style={[styles.listContentView]}
        >
          {this.renderItems()}
          {this.renderSeperator()}
        </ScrollView>
      </Container>
    )
  }
}

export default LocationDeviceType