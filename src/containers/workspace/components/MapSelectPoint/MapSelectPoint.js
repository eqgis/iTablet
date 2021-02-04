import * as React from 'react'
import { View } from 'react-native'
import HardwareBackHandler from '../../../../components/HardwareBackHandler'
import Header from '../../../../components/Header'
import MapSelectPointLatitudeAndLongitude from '../MapSelectPointLatitudeAndLongitude/MapSelectPointLatitudeAndLongitude'

export default class MapSelectPoint extends React.Component {
  props: {
    headerProps: Object,
    openSelectPointMap: () => any,
    selectPointType: 'string',
  }

  static defaultProps = {
    headerProps: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      show: false,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.warn(this.props.selectPointType, nextProps.selectPointType)
    return (
      nextState.show !== this.state.show ||
      nextProps.selectPointType !== this.props.selectPointType
    )
  }

  updateLatitudeAndLongitude = point => {
    if(this.pointLatitudeAndLongitude)
    {
      this.pointLatitudeAndLongitude.updateLatitudeAndLongitude(point)
      GLOBAL.SELECTPOINTLATITUDEANDLONGITUDE = point
    }
  }

  setVisible = (iShow, title = this.props.headerProps.title || '') => {
    this.setState({ show: iShow, title })
  }

  openSelectPointMap(wsData, point) {
    this.props.headerProps.openSelectPointMap(wsData, point)
  }

  onBack = () => {
    if(this.props.headerProps.backAction) {
      this.props.headerProps.backAction()
    }
    return true
  }

  renderBottom() {
    if (
      // this.props.headerProps.selectPointType &&
      // (this.props.headerProps.selectPointType === 'selectPoint' ||
      //   this.props.headerProps.selectPointType ===
      this.props.selectPointType &&
      (this.props.selectPointType === 'selectPoint' || // 普通地图地图选点
        this.props.selectPointType ===
          'SELECTPOINTFORARNAVIGATION_INDOOR') // 室内导航地图选点
    ) {
      return (
        <MapSelectPointLatitudeAndLongitude
          style={{
            alignItems: 'flex-end',
          }}
          ref={ref => (this.pointLatitudeAndLongitude = ref)}
          isEdit={false}
        />
      )
    } else {
      return <View />
    }
  }

  render() {
    if (this.state.show) {
      return (
        <View
          style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%',
            justifyContent: 'flex-end',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
          pointerEvents={'box-none'}
        >
          <HardwareBackHandler onBackPress={this.onBack}/>
          <Header
            ref={ref => (this.containerHeader = ref)}
            {...this.props.headerProps}
            title={this.state.title}
          />
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'flex-end',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
            pointerEvents={'none'}
          >
            {this.renderBottom()}
          </View>
        </View>
      )
    } else {
      return <View />
    }
  }
}
