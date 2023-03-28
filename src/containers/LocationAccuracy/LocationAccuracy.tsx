import React, { Component } from "react"
import { Text, Image, TouchableOpacity, ScrollView, View } from 'react-native'
import Container from '../../components/Container'
import { dp, scaleSize} from '../../utils'
import NavigationService from '../NavigationService'
import { getLanguage } from '../../language'
import { DeviceManufacturer } from '@/redux/models/location'
import styles from "./styles"
import { MainStackScreenNavigationProps } from "@/types"
import { PositionAccuracyType } from "imobile_for_reactnative/NativeModule/interfaces/SLocation"


const radio_on = require('../../assets/public/radio_select.png')
const radio_off = require('../../assets/public/radio_select_no.png')

interface positionAccuracyItemType {
  label: string
  value: PositionAccuracyType
}

interface Props {
	navigation: MainStackScreenNavigationProps<'LocationAccuracy'>,
	positionAccuracy: PositionAccuracyType
  setPositionAccuracy: (type: PositionAccuracyType) => void
}

interface State {
	positionAccuracy: PositionAccuracyType,
}


class LocationAccuracy extends Component<Props, State> {
  positionAccuracyArray: Array<positionAccuracyItemType> = [
    {label: getLanguage().METER_LEVEL, value:1},
    {label: getLanguage().SUBMETER_LEVEL, value:5},
    {label: getLanguage().CENTIMETER_LEVEL, value:4},
  ]

  constructor(props: Props) {
    super(props)
    this.state = {
      positionAccuracy: this.props.positionAccuracy || 5,
    }
  }

  confirm = () => {
    this.props?.setPositionAccuracy(this.state.positionAccuracy)
    NavigationService.goBack()
  }

  /** 确认按钮 */
  renderRight = () => {
    const textColor = 'black'
    return (
      <TouchableOpacity
        onPress={this.confirm}
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
  renderItem = (positionAccuracy: positionAccuracyItemType, index: number) => {
    return (
      <TouchableOpacity
        style={[styles.itemView,
          index === this.positionAccuracyArray.length - 1 && {
            borderBottomColor: '#fff',
          }
        ]}
        activeOpacity={0.9}
        onPress={() => {
          this.setState({
            positionAccuracy: positionAccuracy.value,
          })
        }}
      >
        <Text style={styles.text}>{positionAccuracy.label}</Text>
        <Image
          style={styles.image}
          source={this.state.positionAccuracy === positionAccuracy.value?  radio_on : radio_off}
        />
      </TouchableOpacity>
    )
  }

  /** 渲染列表 */
  renderItems = () => {
    return this.positionAccuracyArray.map((positionAccuracy: positionAccuracyItemType, index: number) => {
      return this.renderItem(positionAccuracy, index)
    })
  }

  render() {
    return (
      <Container
        // ref={(ref: typeof Container) => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Profile.POSITION_ACCURACY,
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

export default LocationAccuracy