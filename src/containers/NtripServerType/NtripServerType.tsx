import React, { Component } from "react"
import { Text, Image, TouchableOpacity, ScrollView, View } from 'react-native'
import Container from '../../components/Container'
import { dp, scaleSize} from '../../utils'
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
    {label: getLanguage().OTHER_CORSE, value: 'NTRIPV1'},
    {label: getLanguage().QIANXUN_CORS, value:'qianxun'},
    {label: getLanguage().HUACHE, value:'huace'},
    {label: getLanguage().CHINESE_MOBILE, value: 'China Mobile'},
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
  renderItem = (agreementArray: PositionServerType, index: number) => {
    return (
      <TouchableOpacity
        style={[styles.itemView,
          index === this.agreementArray.length - 1 && {
            borderBottomColor: '#fff',
          }
        ]}
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
    return this.agreementArray.map((agreementArray: PositionServerType, index: number) => {
      return this.renderItem(agreementArray, index)
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
          {this.renderSeperator()}
        </ScrollView>
      </Container>
    )
  }
}

export default NtripServerType