import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  AsyncStorage,
  FlatList,
} from 'react-native'
import { Container, Button } from '../../components'

import { color } from '../../styles'
import { getLanguage } from '../../language'
import { SMap, SCollectSceneFormView, Action } from 'imobile_for_reactnative'
import { Toast, scaleSize } from '../../utils'
import { ConstOnline, TouchType } from '../../constants'
import constants from '../../containers/workspace/constants'
import NavigationService from '../../containers/NavigationService'
import MapSelectPointLatitudeAndLongitude from '../workspace/components/MapSelectPointLatitudeAndLongitude/MapSelectPointLatitudeAndLongitude'

export default class EnterDatumPoint extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    let params = this.props.navigation.state.params || {}
    let type = params.type || ''

    let problemItems = []
    problemItems.push({
      title: getLanguage(GLOBAL.language).Profile.SUGGESTION_FUNCTION_ABNORMAL,
      checked: false,
    })
    problemItems.push({
      title: getLanguage(GLOBAL.language).Profile.SUGGESTION_PRODUCT_ADVICE,
      checked: false,
    })
    problemItems.push({
      title: getLanguage(GLOBAL.language).Profile.SUGGESTION_OTHER_PROBLEMS,
      checked: false,
    })
    this.state = {
      type: type,
      floorData: [],
      problemItems: problemItems,
      selectProblemItems: [],
      problemsDetail: '',
      contactWay: '',

      longitude: '',
      latitude: '',
      selectFloor: 0,
    }
  }

  componentDidMount() {
    if (this.state.type === 'ARNAVIGATION_INDOOR') {
      this.getFloorData()
    }
  }

  getFloorData = async () => {
    let result = await SMap.getFloorData()
    this.setState({
      floorData: result.data,
    })
  }

  getCurrentPosition = async () => {
    GLOBAL.Loading.setLoading(
      true,
      getLanguage(GLOBAL.language).Profile.MAP_AR_DATUM_AUTO_LOCATIONING,
    )
    let map = await SMap.getCurrentPosition()

    GLOBAL.DATUMPOINTVIEW.updateLatitudeAndLongitude(map)

    GLOBAL.Loading.setLoading(false)
    Toast.show(
      getLanguage(GLOBAL.language).Profile.MAP_AR_DATUM_AUTO_LOCATION_SUCCEED,
    )
  }

  mapSelectPoint = async () => {
    if (this.state.type === 'ARNAVIGATION_INDOOR') {
      //暂存点，返回地图选点时使用
      GLOBAL.SELECTPOINTLATITUDEANDLONGITUDETEMP = GLOBAL.DATUMPOINTVIEW.getLatitudeAndLongitude()

      GLOBAL.TouchType = TouchType.MAP_SELECT_POINT
      GLOBAL.MAPSELECTPOINT.setVisible(true)

      NavigationService.navigate('MapView', {selectPointType: 'SELECTPOINTFORARNAVIGATION_INDOOR'})
      SMap.setAction(Action.PAN)
    } else {
      //暂存点，返回地图选点时使用
      GLOBAL.SELECTPOINTLATITUDEANDLONGITUDETEMP = GLOBAL.DATUMPOINTVIEW.getLatitudeAndLongitude()

      GLOBAL.ToolBar.setVisible(false)

      GLOBAL.MapXmlStr = await SMap.mapToXml()

      GLOBAL.TouchType = TouchType.MAP_SELECT_POINT
      GLOBAL.MAPSELECTPOINT.setVisible(true)

      //导航选点 全屏时保留mapController
      GLOBAL.mapController && GLOBAL.mapController.setVisible(true)

      let map = await SMap.getCurrentPosition()
      let wsData = JSON.parse(JSON.stringify(ConstOnline.Google))
      wsData.layerIndex = 3
      let licenseStatus = await SMap.getEnvironmentStatus()
      GLOBAL.isLicenseValid = licenseStatus.isLicenseValid
      NavigationService.navigate('MapView', {
        // NavigationService.navigate('MapViewSingle', {
        // wsData,
        isExample: true,
        noLegend: true,
        // mapName: message.originMsg.message.message.message,
        // showMarker: {
        //   x: map.x,
        //   y: map.y,
        // },
        selectPointType: 'selectPoint',
      })
      GLOBAL.toolBox.showFullMap(true)
      GLOBAL.TouchType = TouchType.MAP_SELECT_POINT
      // let point = {
      // x: map.x,
      // y: map.y,
      // }
      // GLOBAL.MAPSELECTPOINT.openSelectPointMap(wsData, point)
      SMap.setAction(Action.PAN)
      GLOBAL.scaleView.isvisible(false)
      GLOBAL.mapController.setVisible(true)
      GLOBAL.mapController.move({
        bottom: scaleSize(50),
        left: 'default',
      })
    }
  }

  renderButtons() {
    return (
      <View style={styles.buttonItem}>
        <TouchableOpacity
          style={styles.buttonTouable}
          onPress={this.getCurrentPosition}
        >
          <Text style={styles.itemButton}>
            {getLanguage(GLOBAL.language).Profile.MAP_AR_DATUM_AUTO_LOCATION}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonTouable}
          onPress={this.mapSelectPoint}
        >
          <Text style={styles.itemButton}>
            {getLanguage(GLOBAL.language).Profile.MAP_AR_DATUM_MAP_SELECT_POINT}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderTitle() {
    return (
      <View style={{ backgroundColor: color.background }}>
        <View style={styles.itemHeader}>
          <Text style={styles.titleHeader}>
            {
              getLanguage(GLOBAL.language).Profile
                .MAP_AR_DATUM_ENTER_CURRENT_POSITION
            }
          </Text>
        </View>

        <MapSelectPointLatitudeAndLongitude
          ref={ref => (GLOBAL.DATUMPOINTVIEW = ref)}
          isEdit={true}
        />
      </View>
    )
  }

  submit = async () => {
    let point = GLOBAL.DATUMPOINTVIEW.getLatitudeAndLongitude()
    if (!point) {
      Toast.show(
        getLanguage(GLOBAL.language).Profile
          .MAP_AR_DATUM_ENTER_CURRENT_POSITION,
      )
      return
    }

    if (GLOBAL.EnterDatumPointType === 'arMeasureCollect') {
      GLOBAL.MeasureCollectData.point = point
      GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
      NavigationService.replace('MeasureView', GLOBAL.MeasureCollectData)
      GLOBAL.EnterDatumPointType = undefined
      return
    } else if (GLOBAL.EnterDatumPointType === 'arCollectSceneForm') {
      GLOBAL.EnterDatumPointType = undefined
      //查看历史数据源
      AsyncStorage.getItem(constants.COLLECT_SCENE_HISTORY_DATASOURCE_ALIAS_KEY)
        .then(async value => {
          let datasourceAlias
          if (value !== null) {
            let alias = SMap.isAvilableAlias(value)
            if (alias === value) {
              datasourceAlias = await SCollectSceneFormView.getSystemTime()
            } else {
              datasourceAlias = value
            }
          } else {
            datasourceAlias = await SCollectSceneFormView.getSystemTime()
          }
          AsyncStorage.setItem(
            constants.COLLECT_SCENE_HISTORY_DATASOURCE_ALIAS_KEY,
            datasourceAlias,
          )

          const datasetName = 'CollectSceneForm'
          const datasetPointName = 'CollectPointSceneForm'
          GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
          NavigationService.replace('CollectSceneFormView', {
            datasourceAlias,
            datasetName,
            datasetPointName,
            point,
          })
        })
        .catch(() => {})
    } else if (GLOBAL.EnterDatumPointType === 'arNavigation') {
      GLOBAL.EnterDatumPointType = undefined
      GLOBAL.NAVIGATIONSTARTBUTTON?.setVisible(true)
      GLOBAL.NAVIGATIONSTARTHEAD?.setVisible(true)
      NavigationService.replace('ARNavigationView', {
        point: point,
        floorID: this.state.floorData[this.state.selectFloor].id,
      })
    } else if (GLOBAL.EnterDatumPointType === 'arVideo') {
      GLOBAL.EnterDatumPointType = undefined
      GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
      GLOBAL.toolBox?.setVisible(false)
      NavigationService.replace('ARVideoView', {
        point: point,
      })
    } else if (GLOBAL.EnterDatumPointType === 'arImage') {
      GLOBAL.EnterDatumPointType = undefined
      GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
      GLOBAL.toolBox?.setVisible(false)
      NavigationService.replace('ARImageView', {
        point: point,
      })
    } else if (GLOBAL.EnterDatumPointType === 'arWebView') {
      GLOBAL.EnterDatumPointType = undefined
      GLOBAL.toolBox?.setVisible(false)
      GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
      NavigationService.replace('ARWebView', {
        point: point,
      })
    } else if (GLOBAL.EnterDatumPointType === 'arText') {
      GLOBAL.EnterDatumPointType = undefined
      GLOBAL.toolBox?.setVisible(false)
      GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
      NavigationService.replace('ARTextView', {
        point: point,
      })
    }

    // let time = await SCollectSceneFormView.getSystemTime()
    // GLOBAL.mapView.setState({ map: { height: 0 } })
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
        {/* {this.renderHintText()} */}
        {
          <Button
            title={getLanguage(GLOBAL.language).Profile.MAP_AR_DATUM_SURE}
            type="BLUE"
            style={{
              width: '94%',
              height: scaleSize(60),
              marginTop: scaleSize(20),
            }}
            titleStyle={{ fontSize: scaleSize(24) }}
            onPress={this.submit}
          />
        }
      </View>
    )
  }

  back = () => {
    if (GLOBAL.arSwitchToMap) {
      GLOBAL.arSwitchToMap = false
      GLOBAL.toolBox && GLOBAL.toolBox.switchAr()
    }
    GLOBAL.NAVIGATIONSTARTBUTTON?.setVisible(true)
    GLOBAL.NAVIGATIONSTARTHEAD?.setVisible(true)
    GLOBAL.SELECTPOINTLATITUDEANDLONGITUDE = undefined
    NavigationService.goBack()
    return true
  }

  renderHintText() {
    return (
      <View>
        <Text style={styles.itemSubTitle}>
          {
            getLanguage(GLOBAL.language).Profile
              .MAP_AR_DATUM_PLEASE_TOWARDS_NORTH
          }
        </Text>
      </View>
    )
  }

  renderFloorItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({
            selectFloor: index,
          })
        }}
        style={[
          { padding: 10, marginHorizontal: 20 },
          this.state.selectFloor === index && { backgroundColor: color.blue2 },
        ]}
      >
        <Text>{item.name}</Text>
      </TouchableOpacity>
    )
  }

  renderFloor() {
    if (this.state.type === 'ARNAVIGATION_INDOOR') {
      return (
        <View
          style={{
            height: scaleSize(80),
            backgroundColor: color.content_white,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text style={{ marginLeft: scaleSize(15) }}>
            {getLanguage(GLOBAL.language).Prompt.FLOOR}
          </Text>
          <FlatList
            data={this.state.floorData}
            renderItem={this.renderFloorItem}
            keyExtractor={(item, key) => key.toString()}
            horizontal={true}
            extraData={this.state.selectFloor}
          />
        </View>
      )
    } else {
      return null
    }
  }

  renderContent() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: color.background }}>
        <View style={{ flex: 1, backgroundColor: color.background }}>
          <View style={{ height: 10 }} />

          {this.renderTitle()}
          {this.renderFloor()}
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
          title: getLanguage(GLOBAL.language).Profile.MAP_AR_DATUM_POSITION,
          //'请选择当前位置坐标',
          navigation: this.props.navigation,
          backAction: this.back,
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
