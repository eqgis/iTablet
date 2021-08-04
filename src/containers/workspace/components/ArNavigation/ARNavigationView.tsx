import { SARMap } from 'imobile_for_reactnative'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ARNaviModule } from '../ArNavigationModule'
import { scaleSize } from '../../../../../src/utils'
import { getThemeAssets } from '../../../../assets'
import { getLanguage } from '../../../../language'
import ToolbarModule from '../ToolBar/modules/ToolbarModule'
import NavigationService from '../../../../containers/NavigationService'

interface Props {
  toolbarVisible: boolean
  visible: boolean
}

interface State {
  remainDistance?: number
}

class ARNavigationView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      remainDistance: undefined
    }
  }


  componentDidUpdate(prevProps: Props) {
    // if(prevProps.toolbarVisible !== this.props.toolbarVisible || prevProps.visible !== this.props.visible) {
    //   if(this.isVisible()) {
    //     AppToolBar.addListener('ar_navi_location_change', this.onLocationChange)
    //   } else {
    //     AppToolBar.removeListener('ar_navi_location_change')
    //   }
    // }
  }

  isVisible = () => {
    return this.props.toolbarVisible && this.props.visible
  }

  onLocationChange = (naviRemain:any) => {
    const location = naviRemain
    if(location) {
      this.setState({remainDistance: location})
    }
  }

  back =  () => {
    SARMap.endNavigation()
    const _params: any = ToolbarModule.getParams()
    _params.showArNavi && _params.showArNavi(true)
    _params.showNavigation && _params.showNavigation(false)
  }

  render() {
    if(!this.isVisible()) return null
    const distance = this.state.remainDistance
    let disDes
    let time
    if(distance) {
      time = Math.round((distance / 1.3) / 60)
      if(distance > 1000) {
        disDes = (distance / 1000).toFixed(1) + ' km'
      } else {
        disDes = distance.toFixed(1) + 'm'
      }
    }
    return(
      <View style={styles.container}>
        <View style={styles.naviBar}>
          <TouchableOpacity
            style={styles.item}
            onPress={this.back}
          >
            <Image
              source={getThemeAssets().nav.close_white}
              style={{
                width: scaleSize(40),
                height: scaleSize(40)
              }}
            />
            <Text style={{
              fontSize: scaleSize(20),
              color: 'black', 
              marginTop: scaleSize(5)
            }}>{getLanguage(GLOBAL.language).Prompt.EXIT}</Text>
          </TouchableOpacity>
          <View style={styles.columnSep}/>
          <View style={{flex: 1}}>
            {disDes && (
              <Text style={{fontSize: scaleSize(28) ,color:'#959595' , textAlign: 'center'}}>
                {`${getLanguage(GLOBAL.language).ARMap.REMAIN} ${disDes}  ${time}min`}
              </Text>
            )}
          </View>
          <View style={styles.columnSep}/>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              const poi = ARNaviModule.getData().currentPOI
              const route = ARNaviModule.getData().currentRoute
              if (poi && route) {
                NavigationService.navigate('NavigationView2D', {
                  destinationName: poi.name,
                  analystResult: route
                })
              }
            }}
          >
            <Image
              source={getThemeAssets().nav.navigate}
              style={{
                width: scaleSize(40),
                height: scaleSize(40),
              }}
            />
            <Text style={{
              fontSize: scaleSize(20),
              color: 'black',
              marginTop: scaleSize(5)
            }}>
              {getLanguage(GLOBAL.language).ARMap.ROUTE_NAVI}</Text>
          </TouchableOpacity>
        </View>
      </View >
    )
  }
}

export default ARNavigationView

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  naviBar: {
    elevation: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#eee',
    shadowOpacity: 1,
    shadowRadius: 2,
    borderRadius: scaleSize(20),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: scaleSize(20),
    width: '90%',
    backgroundColor: '#F6F7F8',
    paddingHorizontal: scaleSize(20),
    paddingVertical: scaleSize(10),
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnSep: {
    backgroundColor: '#EBEBEB',
    width: 2,
    height: scaleSize(50),
    marginHorizontal: scaleSize(10)
  },
})