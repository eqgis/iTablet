import React, { Component } from "react"
import { Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import Container from '../../components/Container'
import { dp} from '../../utils'
import NavigationService from '../NavigationService'
import { getLanguage } from '../../language'
import { PositionServerTypes, DeviceManufacturer } from '@/redux/models/location'
import styles from "./styles"
import { MainStackScreenNavigationProps } from "@/types"
import { PositionAccuracyType } from "imobile_for_reactnative/NativeModule/interfaces/SLocation"


const radio_on = require('../../assets/public/radio_select.png')
const radio_off = require('../../assets/public/radio_select_no.png')


interface PositionServerType {
  label: string
  value: PositionServerTypes
}

interface Props {
	navigation: MainStackScreenNavigationProps<'NtripServerType'>
  positionServerType: PositionServerTypes
  setPositionServerType: (agreementType: PositionServerTypes) => void
}

interface State {
  /** 当前选择的服务协议类型 */
	curAgreementType: PositionServerTypes,
}


class NtripServerType extends Component<Props, State> {

  agreementArray: Array<PositionServerType> = [
    {label: '其他', value: 'NTRIPV1'},
    {label: "千寻知寸", value:'qianxun'},
    {label: "华测", value:'huace'},
    {label: '中国移动', value: 'China Mobile'},
  ]

  constructor(props: Props) {
    super(props)
    this.state = {
      curAgreementType: this.props.positionServerType || 'NTRIPV1',
    }
  }

  confirm = () => {
    this.props?.setPositionServerType(this.state.curAgreementType)
    NavigationService.goBack()
  }

  /** 确认按钮 */
  renderRight = () => {
    const textColor = 'black'
    return (
      <TouchableOpacity
        onPress={this.confirm}
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

  /** 列表项 */
  renderItem = (agreementArray: PositionServerType) => {
    return (
      <TouchableOpacity
        style={styles.itemView}
        activeOpacity={0.9}
        onPress={() => {
          this.setState({
            curAgreementType: agreementArray.value,
          })
        }}
      >
        <Text style={styles.text}>{agreementArray.label}</Text>
        <Image
          style={styles.image}
          source={this.state.curAgreementType === agreementArray.value?  radio_on : radio_off}
        />
      </TouchableOpacity>
    )
  }

  /** 渲染列表 */
  renderItems = () => {
    return this.agreementArray.map(agreementArray => {
      return this.renderItem(agreementArray)
    })
  }

  render() {
    return (
      <Container
        // ref={(ref: typeof Container) => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Profile.SERVICE_TYPE,
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
        </ScrollView>
      </Container>
    )
  }
}

export default NtripServerType