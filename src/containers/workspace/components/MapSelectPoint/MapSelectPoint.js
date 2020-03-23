import * as React from 'react'
import { View } from 'react-native'
import Header from '../../../../components/Header'
import { color } from '../../../../styles'
import MapSelectPointLatitudeAndLongitude from '../MapSelectPointLatitudeAndLongitude/MapSelectPointLatitudeAndLongitude';

export default class MapSelectPoint extends React.Component {
  props: {
    headerProps: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      show: false,
    }
  }

  updateLatitudeAndLongitude = point =>{
    this.pointLatitudeAndLongitude.updateLatitudeAndLongitude(point)
    GLOBAL.SELECTPOINTLATITUDEANDLONGITUDE=point
  }


  setVisible = iShow => {
    this.setState({ show: iShow })
  }

  openSelectPointMap(wsData,point){
    this.props.headerProps.openSelectPointMap(wsData,point)
  }

  renderBottom(){

    return(
      (this.props.headerProps.selectPointType&&this.props.headerProps.selectPointType==='selectPoint')?
        <MapSelectPointLatitudeAndLongitude
                style={{
                  alignItems: 'flex-end'
                }}
                ref={ref => (this.pointLatitudeAndLongitude = ref)}
                  isEdit={false}
              ></MapSelectPointLatitudeAndLongitude>
        :<View></View>
        
    )
  }

  render() {
    if (this.state.show) {
      return (
        <View
          style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            // height: '100%',
            justifyContent: 'space-between',
            // flexDirection:'column',
            // alignItems: 'flex-end',
          }}
        >
          <Header
            ref={ref => (this.containerHeader = ref)}
            {...this.props.headerProps}
          />
          <View
            style={{
              position: 'absolute',
              marginTop: '100%',
              width: '100%',
              // height: '100%',
              // justifyContent: 'flex-end',
              // flexDirection:'column',
              // alignItems: 'flex-end',
            }}
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
