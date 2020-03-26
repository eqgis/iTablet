import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, Text ,TouchableOpacity,AsyncStorage} from 'react-native'
import { Container ,Button} from '../../components'

import { color } from '../../styles'
import { getLanguage } from '../../language'
import { SMap ,SCollectSceneFormView,Action} from 'imobile_for_reactnative'
import { Toast, scaleSize } from '../../utils'
import { ConstOnline ,TouchType} from '../../constants'
import constants from '../../containers/workspace/constants'
import NavigationService from '../../containers/NavigationService'
import MapSelectPointLatitudeAndLongitude from '../workspace/components/MapSelectPointLatitudeAndLongitude/MapSelectPointLatitudeAndLongitude';


export default class EnterDatumPoint extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)

    let problemItems = []
    problemItems.push({
      title: getLanguage(global.language).Profile.SUGGESTION_FUNCTION_ABNORMAL,
      checked: false,
    })
    problemItems.push({
      title: getLanguage(global.language).Profile.SUGGESTION_PRODUCT_ADVICE,
      checked: false,
    })
    problemItems.push({
      title: getLanguage(global.language).Profile.SUGGESTION_OTHER_PROBLEMS,
      checked: false,
    })
    this.state = {
      problemItems: problemItems,
      selectProblemItems: [],
      problemsDetail: '',
      contactWay: '',

      longitude: '',
      latitude: '',
    }
  }

  getCurrentPosition =async() =>{
    GLOBAL.Loading.setLoading(
      true,
      getLanguage(global.language).Profile
        .MAP_AR_DATUM_AUTO_LOCATIONING,
    )
    let map = await SMap.getCurrentPosition()

    GLOBAL.DATUMPOINTVIEW.updateLatitudeAndLongitude(map)

    GLOBAL.Loading.setLoading(false)
    Toast.show(
      getLanguage(global.language).Profile
        .MAP_AR_DATUM_AUTO_LOCATION_SUCCEED,
    )
  }

  mapSelectPoint =async() =>{
    
    //暂存点，返回地图选点时使用
    GLOBAL.SELECTPOINTLATITUDEANDLONGITUDETEMP=GLOBAL.DATUMPOINTVIEW.getLatitudeAndLongitude()

    GLOBAL.MapSelectPointType = 'selectPoint'
    GLOBAL.OverlayView.setVisible(false)

   

    GLOBAL.ToolBar.setVisible(false)
    
    GLOBAL.MapXmlStr=await SMap.mapToXml()
    
    GLOBAL.TouchType = TouchType.MAP_SELECT_POINT
    GLOBAL.MAPSELECTPOINT.setVisible(true)
    
    //导航选点 全屏时保留mapController
    GLOBAL.mapController && GLOBAL.mapController.setVisible(true)

    GLOBAL.toolBox.showFullMap(true)
    GLOBAL.toolBox.showFullMap(false)
    GLOBAL.toolBox.showFullMap(true)
    
    let map = await SMap.getCurrentPosition()
    let wsData = JSON.parse(JSON.stringify(ConstOnline.Google))
      wsData.layerIndex = 3
      let licenseStatus = await SMap.getEnvironmentStatus()
      global.isLicenseValid = licenseStatus.isLicenseValid
      NavigationService.navigate('MapView', {
      // NavigationService.navigate('MapViewSingle', {
        wsData,
        isExample: true,
        noLegend: true,
        // mapName: message.originMsg.message.message.message,
        showMarker: {
          x:map.x,
          y:map.y,
        },
      })
      GLOBAL.toolBox.showFullMap(true)
      GLOBAL.TouchType = TouchType.MAP_SELECT_POINT
      let point={
        x:map.x,
        y:map.y,
      }
      GLOBAL.MAPSELECTPOINT.openSelectPointMap(wsData,point)
      SMap.setAction(Action.PAN)
  }

  renderButtons () {
    return(
    <View style={styles.buttonItem}>
    
    <TouchableOpacity
    style={styles.buttonTouable}
    onPress={
        this.getCurrentPosition
    }>
    <Text style={styles.itemButton}>
      {getLanguage(global.language).Profile.MAP_AR_DATUM_AUTO_LOCATION}
    </Text>

    </TouchableOpacity>


    <TouchableOpacity
    style={styles.buttonTouable}
    onPress={
      this.mapSelectPoint
    }>
    <Text style={styles.itemButton}>
      {getLanguage(global.language).Profile.MAP_AR_DATUM_MAP_SELECT_POINT}
    </Text>

    </TouchableOpacity>


    
    
    </View>
    )
  }

  renderTitle(){
    return (
        <View style={{ backgroundColor: color.background }}>
          <View style={styles.itemHeader}>
            <Text style={styles.titleHeader}>
              {getLanguage(global.language).Profile.MAP_AR_DATUM_ENTER_CURRENT_POSITION}
            </Text>
          </View>

          <MapSelectPointLatitudeAndLongitude
              
              ref={ref => (GLOBAL.DATUMPOINTVIEW = ref)}
                isEdit={true}
            ></MapSelectPointLatitudeAndLongitude>

        </View>
      )
  }


  submit= async()=>{
    let point=GLOBAL.DATUMPOINTVIEW.getLatitudeAndLongitude()
    if(!point || point.x===0 || point.y===0){
      Toast.show(
        getLanguage(global.language).Profile
          .MAP_AR_DATUM_ENTER_CURRENT_POSITION,
      )
      return
    }
    //查看历史数据源
    AsyncStorage.getItem(constants.COLLECT_SCENE_HISTORY_DATASOURCE_ALIAS_KEY)
      .then( async value => {
        let datasourceAlias
        if (value !== null) {

          let alias=SMap.isAvilableAlias(value)
          if(alias === value){
            datasourceAlias = await SCollectSceneFormView.getSystemTime()
          }else{
            datasourceAlias = value
          }
        }else{
          datasourceAlias = await SCollectSceneFormView.getSystemTime()
        }
        AsyncStorage.setItem(constants.COLLECT_SCENE_HISTORY_DATASOURCE_ALIAS_KEY, datasourceAlias)

        let time = await SCollectSceneFormView.getSystemTime()
        GLOBAL.mapView.setState({ map: { height: 0 } })
        // GLOBAL.newcollectData = time
        GLOBAL.newcollectData = datasourceAlias
        // const datasourceAlias = time
        const datasetName = 'CollectSceneForm'
        const datasetPointName = 'CollectPointSceneForm'
        NavigationService.navigate('CollectSceneFormView', {
          datasourceAlias,
          datasetName,
          datasetPointName,
          point,
        })

      })
      .catch(() => {})
    
    // let time = await SCollectSceneFormView.getSystemTime()
    // GLOBAL.mapView.setState({ map: { height: 0 } })
    // GLOBAL.newcollectData = time
    // const datasourceAlias = time
    // const datasetName = 'CollectSceneForm'
    // const datasetPointName = 'CollectPointSceneForm'
    // NavigationService.navigate('CollectSceneFormView', {
    //   datasourceAlias,
    //   datasetName,
    //   datasetPointName,
    //   point,
    // })
  }


  //提交按钮
  renderButton() {
    return (
      <View style={{ alignItems: 'center' }}>
        {this.renderHintText()}
        {<Button
          title={getLanguage(global.language).Profile.MAP_AR_DATUM_SURE}
          type="BLUE"
          style={{
            width: '94%',
            height: scaleSize(60),
            marginTop: scaleSize(20),
          }}
          titleStyle={{ fontSize: scaleSize(24) }}
          onPress={this.submit}
        /> }
      </View>
    )
  }

  renderHintText(){
    return (
      <View>
        <Text style={styles.itemSubTitle}>
        {getLanguage(global.language).Profile.MAP_AR_DATUM_PLEASE_TOWARDS_SOUTH}
        </Text>
      </View>
    )
  }
  
  renderContent() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: color.background }}>
        <View style={{ flex: 1, backgroundColor: color.background }}>
          <View style={{ height: 10 }} />

            {this.renderTitle()}
            {this.renderButtons()}

            {this.renderButton()}
        </View>
      </ScrollView>
    )
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(global.language).Profile
            .MAP_AR_DATUM_POSITION,
          //'请选择当前位置坐标',
          navigation: this.props.navigation,
        }}
      >
        {this.renderContent()}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgW,
  },

  item: {
    width: '100%',
    height: scaleSize(80),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.white,
  },
  title: {
    fontSize: scaleSize(18),
    color: color.gray,
    marginLeft: 15,
  },
  subTitle: {
    fontSize: scaleSize(20),
    marginLeft: 15,
  },
  separateLine: {
    width: '100%',
    height: scaleSize(1),
    backgroundColor: color.item_separate_white,
  },
  input: {
    width: '100%',
    height: scaleSize(120),
    fontSize: scaleSize(22),
    padding: scaleSize(15),


    backgroundColor: color.white,
  },


  titleHeader: {
    fontSize: scaleSize(24),
    color: color.gray,
  },
  itemHeader: {
    width: '100%',
    height: scaleSize(240),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  itemtitle: {
    fontSize: scaleSize(20),
    color: color.black,
    paddingLeft: scaleSize(15),
    paddingRight: scaleSize(15),
    backgroundColor: color.white,
  },
  itemInput: {
    width: '100%',
    fontSize: scaleSize(22),
    padding: scaleSize(15),

    backgroundColor: color.white,
  },
  itemButton: {
    fontSize: scaleSize(20),
    padding: scaleSize(15),
    color: color.blue1,
    paddingLeft: scaleSize(15),
    paddingRight: scaleSize(15),
  },
  buttonTouable: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonItem: {
    width: '100%',
    height: scaleSize(80),
    paddingRight: scaleSize(15),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  itemSubTitle: {
    fontSize: scaleSize(18),
    color: color.gray,
  },
})

