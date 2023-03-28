/**
 * 设备厂家页面  设计里的定位设备
 */
import React, { Component } from "react"
import { Text, Image, TouchableOpacity, ScrollView, View, Platform } from 'react-native'
import Container from '../../components/Container'
import { dp, scaleSize} from '../../utils'
import NavigationService from '../NavigationService'
import { getLanguage } from '../../language'
import { DeviceManufacturer } from '@/redux/models/location'
import styles from "./styles"
import { MainStackScreenNavigationProps } from "@/types"


const radio_on = require('../../assets/public/radio_select.png')
const radio_off = require('../../assets/public/radio_select_no.png')

interface DeviceManufacturerItemType {
  label: string
  value: DeviceManufacturer
}

interface Props {
	navigation: MainStackScreenNavigationProps<'LocationDevice'>,
	deviceManufacturer: DeviceManufacturer,
	setDeviceManufacturer: (manufacturer: DeviceManufacturer) => void
}

interface State {
	curDeviceManufacturer: DeviceManufacturer,
}

class LocationDevice extends Component<Props, State> {
  manufacturers: Array<DeviceManufacturerItemType> =  Platform.OS === 'android' ? [
    {
      label: getLanguage().LOCAL_DEVICE,
      value: 'other',
    },
    {
      label: getLanguage().HUACHE,
      value: 'mijiaH20',
    },
    {
      label: getLanguage().QIANXUN,
      value: 'woncan',
    },
    {
      label: getLanguage().SITUOLI,
      value: 'situoli',
    },
  ]: [
    {
      label: getLanguage().LOCAL_DEVICE,
      value: 'other',
    },
  ]

  constructor(props: Props) {
    super(props)
    this.state = {
      curDeviceManufacturer: this.props.deviceManufacturer || "other",
    }
  }

  changeDeviceManufacturer = () => {
    this.props?.setDeviceManufacturer(this.state.curDeviceManufacturer)
    NavigationService.goBack()
  }

  /** 确认按钮 */
  renderRight = () => {
    const textColor = 'black'
    return (
      <TouchableOpacity
        onPress={this.changeDeviceManufacturer}
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
  renderItem = (manufacturer: DeviceManufacturerItemType, index: number) => {
    return (
      <TouchableOpacity
        style={[styles.itemView,
          index === this.manufacturers.length - 1 && {
            borderBottomColor: '#fff',
          }
        ]}
        activeOpacity={0.9}
        onPress={() => {
          this.setState({
            curDeviceManufacturer: manufacturer.value,
          })
        }}
      >
        <Text style={styles.text}>{manufacturer.label}</Text>
        <Image
          style={styles.image}
          source={this.state.curDeviceManufacturer === manufacturer.value? radio_on : radio_off}
        />
      </TouchableOpacity>
    )
  }

  /** 渲染列表 */
  renderItems = () => {
    return this.manufacturers.map((manufacturer: DeviceManufacturerItemType, index: number) => {
      return this.renderItem(manufacturer, index)
    })
  }

  render() {
    return (
      <Container
        // ref={(ref: typeof Container) => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Profile.SETTING_LOCATION_DEVICE,
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

export default LocationDevice