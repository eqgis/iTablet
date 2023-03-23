import React, { Component } from "react"
import { Text, Image, TouchableOpacity, ScrollView, View } from 'react-native'
import Container from '../../components/Container'
import { dp, scaleSize} from '../../utils'
import NavigationService from '../NavigationService'
import { getLanguage } from '../../language'
import styles from "./styles"
import { MainStackScreenNavigationProps, MainStackScreenRouteProp } from "@/types"
import { SLocation } from "imobile_for_reactnative"


const radio_on = require('../../assets/public/radio_select.png')
const radio_off = require('../../assets/public/radio_select_no.png')

interface Props {
	navigation: MainStackScreenNavigationProps<'LocationLoadPoint'>
  route: MainStackScreenRouteProp<'LocationLoadPoint'>
}

interface State {
  loadPointArr:Array<SLocation.NtripMountPoint>
  selectLoadPoint:SLocation.NtripMountPoint
}


class LocationLoadPoint extends Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      loadPointArr: this.props.route.params?.loadPointArr || [],
      selectLoadPoint: this.props.route.params?.selectLoadPoint,
    }
  }

  confirm = () => {
    this.state.selectLoadPoint && this.props.route.params?.action?.(this.state.selectLoadPoint)
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
  renderItem = (loadPoint: SLocation.NtripMountPoint, index: number) => {
    return (
      <TouchableOpacity
        style={[styles.itemView,
          index === this.state.loadPointArr.length - 1 && {
            borderBottomColor: '#fff',
          }
        ]}
        activeOpacity={0.9}
        onPress={() => {
          this.setState({
            selectLoadPoint: loadPoint,
          })
        }}
      >
        <Text style={styles.text}>{loadPoint.name}</Text>
        <Image
          style={styles.image}
          source={this.state.selectLoadPoint.name === loadPoint.name?  radio_on : radio_off}
        />
      </TouchableOpacity>
    )
  }

  /** 渲染列表 */
  renderItems = () => {
    return this.state.loadPointArr.map((loadPoint: SLocation.NtripMountPoint, index: number) => {
      return this.renderItem(loadPoint, index)
    })
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(global.language).Profile.LOADING_POINT,
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

export default LocationLoadPoint