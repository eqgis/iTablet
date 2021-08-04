import { SMap2, SMMapView2, SARMap } from 'imobile_for_reactnative'
import { Point2D } from 'imobile_for_reactnative/types/data'
import { RouteAnalyzeResult } from 'imobile_for_reactnative/types/interface/ar'
import React from 'react'
import { View, Text ,StyleSheet} from 'react-native'
import Button from './Button'
import { getLanguage } from '../../../../language'
import { scaleSize } from '../../../../utils'
import {
  Container,
} from '../../../../components'
import {
  ConstOnline,
} from '../../../../constants'
import ToolbarModule from '../ToolBar/modules/ToolbarModule'

interface Props {
  navigation: any,
}

interface State {
  destinationName?: string
  result?: RouteAnalyzeResult
  points?: Point2D[]
  length?: number
}

class NavigationView2D extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      destinationName: this.props.navigation?.state?.params?.destinationName,
      result: this.props.navigation?.state?.params?.analystResult
    }
  }

  componentWillUnmount() {
    SMap2.removeNaviTrack()
  }

  openMap = async () => {
    const map = ConstOnline.tianditu()
    await SMap2.addToMap(map.DSParams, map.layerIndex)
    this.addNaviTrack()
  }

  addNaviTrack = async () => {
    const result = this.state.result
    if (result) {
      const location = await SARMap.getCurrentLocation()
      let points: Point2D[] = []
      let distance = 0
      //当前位置离起始点太远则将当前位置到起点的路径添加进去
      if (location && result.pathPoints.length > 0) {
        const point = result.pathPoints[0]
        distance = Math.sqrt(Math.pow(point.x - location.mercator.x, 2) + Math.pow(point.y - location.mercator.y, 2))
        if (distance > 8) {
          points.push(location.mercator)
        }
      }
      points = points.concat(result.pathPoints)
      SMap2.addNaviTrack(points)
      this.setState({
        points: points,
        length: result.pathLength + distance
      })
    }
  }

  renderInfo = () => {
    if (!this.state.destinationName || !this.state.length || !this.state.points) return null
    let distance = this.state.length
    let disUnit = 'm'
    if (distance > 1000) {
      distance = distance / 1000
      disUnit = 'km'
    }
    //步行花费时间(分钟)
    const time = Math.ceil((this.state.length / 1.3) / 60)

    return (
      <View style={styles.info}>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: scaleSize(32),
            color: 'black',
          }} numberOfLines={1}>
            {this.state.destinationName}
          </Text>
          <View style={{ flexDirection: 'row', marginTop: scaleSize(20), marginRight: scaleSize(20) }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={{
                fontSize: scaleSize(22),
                color: '#959595', marginRight: scaleSize(5)
              }}>
                {getLanguage(GLOBAL.language).ARMap.DISTANCE}
              </Text>
              <Text style={{
                fontSize: scaleSize(32),
                color: 'black',
              }}>
                {distance.toFixed(2)}
              </Text>
              <Text style={{
                fontSize: scaleSize(24),
                color: 'black',
              }}>
                {disUnit}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'baseline', marginLeft: scaleSize(20) }}>
              <Text style={{ fontSize: scaleSize(22), color: '#959595', marginRight: scaleSize(5) }}>
                {getLanguage(GLOBAL.language).ARMap.DURATION}
              </Text>
              <Text style={{
                fontSize: scaleSize(32),
                color: 'black',
              }}>
                {time}
              </Text>
              <Text style={{
                fontSize: scaleSize(24),
                color: 'black',
              }}>
                {'min'}
              </Text>
            </View>
          </View>
        </View>

        <Button
          title={getLanguage(GLOBAL.language).Prompt.AR_NAVIGATION}
          style={{ width: scaleSize(150), height: scaleSize(80), paddingHorizontal: scaleSize(20) ,borderRadius: scaleSize(50)}}
          onPress={() => {
            if (this.state.result) {
              SARMap.startNavigation(this.state.result)
              const _params: any = ToolbarModule.getParams()
              _params.showArNavi && _params.showArNavi(false)
              _params.showNavigation && _params.showNavigation(true)
              this.props.navigation.goBack()
            }
          }}
        />
      </View>
    )
  }

  render() {
    return (
      <Container
      headerProps={{
        backAction: () => {
          this.props.navigation.goBack()
        },
      }}
      >
        <SMMapView2
          onLoad={this.openMap}
        />
        {this.renderInfo()}
      </Container>
    )
  }
}

export default NavigationView2D


const styles = StyleSheet.create({
  info: {
    elevation: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#eee',
    shadowOpacity: 1,
    shadowRadius: 2,
    position: 'absolute',
    width: '90%',
    height:scaleSize(150),
    bottom: scaleSize(20),
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    borderRadius: scaleSize(30),
    padding: scaleSize(20),
    flexDirection: 'row',
  }
})