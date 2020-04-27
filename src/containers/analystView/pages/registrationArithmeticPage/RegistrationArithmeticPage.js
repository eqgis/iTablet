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

    let tempData = this.getData()

    this.state = {
      data: tempData,
    }
  }

  getData() {
    let data = []
    data.push({
      title: getLanguage(global.language).Analyst_Labels.REGISTRATION_LINE,
      arithmeticMode: 1,
    })
    data.push({
      title: getLanguage(global.language).Analyst_Labels.REGISTRATION_QUADRATIC,
      arithmeticMode: 2,
    })
    data.push({
      title: getLanguage(global.language).Analyst_Labels.REGISTRATION_RECTANGLE,
      arithmeticMode: 3,
    })
    data.push({
      title: getLanguage(global.language).Analyst_Labels.REGISTRATION_OFFSET,
      arithmeticMode: 4,
    })

    return data
  }

  // onPressItem(item) {
  onPressItem() {
    NavigationService.navigate('RegistrationPage')
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
            // this.onPressItem(item)
            this.onPressItem()
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
          title: getLanguage(global.language).Analyst_Labels
            .REGISTRATION_ARITHMETIC,
          navigation: this.props.navigation,
          backAction: this.back,
        }}
      >
        {this.renderRows()}
      </Container>
    )
  }
}
