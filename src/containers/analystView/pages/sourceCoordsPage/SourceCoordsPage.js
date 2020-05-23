import React, { Component } from 'react'
import { Container } from '../../../../components'

import styles from './styles'
import { getLanguage } from '../../../../language'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'
import { View, Text } from 'react-native'

export default class SourceCoordsPage extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.paramsData = params && params.paramsData
    let tempData = this.getData(this.paramsData)

    this.state = {
      data: tempData,
    }
  }

  getData(paramsData) {
    let data = []
    data.push({
      title: getLanguage(global.language).Analyst_Labels.PROJECTION_COORDS_NAME,
      value: paramsData.coordName,
    })
    data.push({
      title: getLanguage(global.language).Analyst_Labels.PROJECTION_COORDS_UNIT,
      value: paramsData.coordUnit,
    })
    data.push({
      title: getLanguage(global.language).Analyst_Labels
        .PROJECTION_GROUND_DATUM,
      value: paramsData.geoDatumName,
    })
    data.push({
      title: getLanguage(global.language).Analyst_Labels
        .PROJECTION_REFERENCE_ELLIPSOID,
      value: paramsData.geoSpheroid,
    })
    return data
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
        <View style={styles.leftWrap}>
          <Text style={styles.rightItem} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.rightText} numberOfLines={1}>
            {item.value}
          </Text>
        </View>
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
