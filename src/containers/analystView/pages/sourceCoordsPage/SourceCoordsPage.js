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
    const { params } = this.props.route
    this.paramsData = params && params.paramsData
    let tempData = this.getData(this.paramsData)

    this.state = {
      data: tempData,
    }
  }

  getUnitName(coordUnitType) {
    let unitName = ''
    switch (coordUnitType) {
      case 10:
        unitName = getLanguage(global.language).Convert_Unit.MILIMETER
        break
      case 11:
        unitName = getLanguage(global.language).Convert_Unit.SQUAREMILIMETER
        break
      case 100:
        unitName = getLanguage(global.language).Convert_Unit.CENTIMETER
        break
      case 101:
        unitName = getLanguage(global.language).Convert_Unit.SQUARECENTIMETER
        break
      case 254:
        unitName = getLanguage(global.language).Convert_Unit.INCH
        break
      case 255:
        unitName = getLanguage(global.language).Convert_Unit.SQUAREINCH
        break
      case 1000:
        unitName = getLanguage(global.language).Convert_Unit.DECIMETER
        break
      case 1001:
        unitName = getLanguage(global.language).Convert_Unit.SQUAREDECIMETER
        break
      case 3048:
        unitName = getLanguage(global.language).Convert_Unit.FOOT
        break
      case 3049:
        unitName = getLanguage(global.language).Convert_Unit.SQUAREFOOT
        break
      case 9144:
        unitName = getLanguage(global.language).Convert_Unit.YARD
        break
      case 9145:
        unitName = getLanguage(global.language).Convert_Unit.SQUAREYARD
        break
      case 10000:
        unitName = getLanguage(global.language).Convert_Unit.METER
        break
      case 10001:
        unitName = getLanguage(global.language).Convert_Unit.SQUAREMETER
        break
      case 10000000:
        unitName = getLanguage(global.language).Convert_Unit.KILOMETER
        break
      case 10000001:
        unitName = getLanguage(global.language).Convert_Unit.SQUAREKILOMETER
        break
      case 16090000:
        unitName = getLanguage(global.language).Convert_Unit.MILE
        break
      case 16090001:
        unitName = getLanguage(global.language).Convert_Unit.SQUAREMILE
        break
      case 1000000000 + 485:
        unitName = getLanguage(global.language).Convert_Unit.SECOND
        break
      case 1000000000 + 29089:
        unitName = getLanguage(global.language).Convert_Unit.MINUTE
        break
      case 1000000000 + 1745329:
        unitName = getLanguage(global.language).Convert_Unit.DEGREE
        break
      case 100000000 + 1000000000:
        unitName = getLanguage(global.language).Convert_Unit.RADIAN
        break
    }
    return unitName
  }

  getData(paramsData) {
    let data = []
    data.push({
      title: getLanguage(global.language).Analyst_Labels.PROJECTION_COORDS_NAME,
      value: paramsData.coordName,
    })
    data.push({
      title: getLanguage(global.language).Analyst_Labels.PROJECTION_COORDS_UNIT,
      // value: paramsData.coordUnit,
      value: this.getUnitName(paramsData.coordUnit),
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
            .PROJECTION_SOURCE_COORDS,
          navigation: this.props.navigation,
          backAction: this.back,
        }}
      >
        {this.renderRows()}
      </Container>
    )
  }
}
