import React, { Component } from 'react'
import { Container } from '../../../../components'

import styles from './styles'
import { getLanguage } from '../../../../language'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'
import NavigationService from '../../../NavigationService'
import { View, Text, TouchableOpacity } from 'react-native'

export default class RegistrationArithmeticPage extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.cb = params && params.cb

    let tempData = this.getData()

    this.state = {
      data: tempData,
    }
  }

  getData() {
    let data = []
    data.push({
      title: getLanguage(GLOBAL.language).Analyst_Labels.REGISTRATION_LINE,
      arithmeticMode: 1,
    })
    data.push({
      title: getLanguage(GLOBAL.language).Analyst_Labels.REGISTRATION_QUADRATIC,
      arithmeticMode: 2,
    })
    data.push({
      title: getLanguage(GLOBAL.language).Analyst_Labels.REGISTRATION_RECTANGLE,
      arithmeticMode: 0,
    })
    data.push({
      title: getLanguage(GLOBAL.language).Analyst_Labels.REGISTRATION_OFFSET,
      arithmeticMode: 4,
    })

    //判断是否含有CAD图层，如果有CAD图层，屏蔽线性和二次线配准
    if (GLOBAL.IsHaveCadDataset) {
      data.splice(0, 2)
    }
    return data
  }

  onPressItem(item) {
    this.cb && this.cb(item)
  }

  exit() {
    NavigationService.goBack()
    NavigationService.goBack()
    NavigationService.goBack()
  }

  renderRows() {
    let rows = []
    for (let i = 0; i < this.state.data.length; i++) {
      rows.push(this.renderItem(this.state.data[i], i))
    }
    return <View style={{ backgroundColor: color.content_white }}>{rows}</View>
  }

  renderItem(item, index) {
    return (
      <View
        style={{
          width: '100%',
          height: scaleSize(80),
        }}
      >
        {index != 0 ? <View style={styles.lineStyle} /> : null}
        <TouchableOpacity
          style={styles.leftWrap}
          onPress={() => {
            this.onPressItem(item)
            // this.onPressItem()
          }}
        >
          <Text style={styles.rightItem} numberOfLines={1}>
            {item.title}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(GLOBAL.language).Analyst_Labels
            .REGISTRATION_ARITHMETIC,
          navigation: this.props.navigation,
          backAction: this.back,
          // headerRight: (
          //   <TextBtn
          //     btnText={getLanguage(GLOBAL.language).Profile.LICENSE_EXIT}
          //     textStyle={styles.headerBtnTitle}
          //     btnClick={this.exit}
          //   />
          // ),
        }}
      >
        {this.renderRows()}
      </Container>
    )
  }
}
