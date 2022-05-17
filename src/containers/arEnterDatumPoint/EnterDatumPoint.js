import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  // AsyncStorage,
  FlatList,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
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
    let params = this.props.route.params || {}
    let type = params.type || ''

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
    global.Loading.setLoading(
      true,
      getLanguage(global.language).Profile.MAP_AR_DATUM_AUTO_LOCATIONING,
    )
    let map = await SMap.getCurrentPosition()

    global.DATUMPOINTVIEW.updateLatitudeAndLongitude(map)

    global.Loading.setLoading(false)
    Toast.show(
      getLanguage(global.language).Profile.MAP_AR_DATUM_AUTO_LOCATION_SUCCEED,
    )
  }

  mapSelectPoint = async () => {
    if (this.state.type === 'ARNAVIGATION_INDOOR') {
      //暂存点，返回地图选点时使用
      global.SELECTPOINTLATITUDEANDLONGITUDETEMP = global.DATUMPOINTVIEW.getLatitudeAndLongitude()

      global.TouchType = TouchType.MAP_SELECT_POINT
      global.MAPSELECTPOINT.setVisible(true)

      NavigationService.navigate('MapView', {selectPointType: 'SELECTPOINTFORARNAVIGATION_INDOOR'})
      SMap.setAction(Action.PAN)
    } else {
      //暂存点，返回地图选点时使用
      global.SELECTPOINTLATITUDEANDLONGITUDETEMP = global.DATUMPOINTVIEW.getLatitudeAndLongitude()

      global.ToolBar.setVisible(false)

      global.MapXmlStr = await SMap.mapToXml()

      global.TouchType = TouchType.MAP_SELECT_POINT
      global.MAPSELECTPOINT.setVisible(true)

      //导航选点 全屏时保留mapController
      global.mapController && global.mapController.setVisible(true)

      let map = await SMap.getCurrentPosition()
      let wsData = JSON.parse(JSON.stringify(ConstOnline.Google))
      wsData.layerIndex = 3
      let licenseStatus = await SMap.getEnvironmentStatus()
      global.isLicenseValid = licenseStatus.isLicenseValid
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
      global.toolBox.showFullMap(true)
      global.TouchType = TouchType.MAP_SELECT_POINT
      // let point = {
      // x: map.x,
      // y: map.y,
      // }
      // global.MAPSELECTPOINT.openSelectPointMap(wsData, point)
      SMap.setAction(Action.PAN)
      global.scaleView.isvisible(false)
      global.mapController.setVisible(true)
      global.mapController.move({
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
            {getLanguage(global.language).Profile.MAP_AR_DATUM_AUTO_LOCATION}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonTouable}
          onPress={this.mapSelectPoint}
        >
          <Text style={styles.itemButton}>
            {getLanguage(global.language).Profile.MAP_AR_DATUM_MAP_SELECT_POINT}
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
              getLanguage(global.language).Profile
                .MAP_AR_DATUM_ENTER_CURRENT_POSITION
            }
          </Text>
        </View>

        <MapSelectPointLatitudeAndLongitude
          ref={ref => (global.DATUMPOINTVIEW = ref)}
          isEdit={true}
        />
      </View>
    )
  }

  submit = async () => {
    let point = global.DATUMPOINTVIEW.getLatitudeAndLongitude()
    // 保存选点
    global.SELECTPOINTLATITUDEANDLONGITUDE = point
    if (!point) {
      Toast.show(
        getLanguage(global.language).Profile
          .MAP_AR_DATUM_ENTER_CURRENT_POSITION,
      )
      return
    }

    if (global.EnterDatumPointType === 'arMeasureCollect') {
      global.MeasureCollectData.point = point
      global.toolBox && global.toolBox.removeAIDetect(true)
      NavigationService.replace('MeasureView', global.MeasureCollectData)
      global.EnterDatumPointType = undefined
      return
    } else if (global.EnterDatumPointType === 'arCollectSceneForm') {
      global.EnterDatumPointType = undefined
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
          global.toolBox && global.toolBox.removeAIDetect(true)
          NavigationService.replace('CollectSceneFormView', {
            datasourceAlias,
            datasetName,
            datasetPointName,
            point,
          })
        })
        .catch(() => {})
    } else if (global.EnterDatumPointType === 'arNavigation') {
      global.EnterDatumPointType = undefined
      global.NAVIGATIONSTARTBUTTON?.setVisible(true)
      global.NAVIGATIONSTARTHEAD?.setVisible(true)
      NavigationService.replace('ARNavigationView', {
        point: point,
        floorID: this.state.floorData[this.state.selectFloor].id,
      })
    } else if (global.EnterDatumPointType === 'arVideo') {
      global.EnterDatumPointType = undefined
      global.toolBox && global.toolBox.removeAIDetect(true)
      global.toolBox?.setVisible(false)
      NavigationService.replace('ARVideoView', {
        point: point,
      })
    } else if (global.EnterDatumPointType === 'arImage') {
      global.EnterDatumPointType = undefined
      global.toolBox && global.toolBox.removeAIDetect(true)
      global.toolBox?.setVisible(false)
      NavigationService.replace('ARImageView', {
        point: point,
      })
    } else if (global.EnterDatumPointType === 'arWebView') {
      global.EnterDatumPointType = undefined
      global.toolBox?.setVisible(false)
      global.toolBox && global.toolBox.removeAIDetect(true)
      NavigationService.replace('ARWebView', {
        point: point,
      })
    } else if (global.EnterDatumPointType === 'arText') {
      global.EnterDatumPointType = undefined
      global.toolBox?.setVisible(false)
      global.toolBox && global.toolBox.removeAIDetect(true)
      NavigationService.replace('ARTextView', {
        point: point,
      })
    }

    // let time = await SCollectSceneFormView.getSystemTime()
    // global.mapView.setState({ map: { height: 0 } })
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
            title={getLanguage(global.language).Profile.MAP_AR_DATUM_SURE}
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
    if (global.arSwitchToMap) {
      global.arSwitchToMap = false
      global.toolBox && global.toolBox.switchAr()
    }
    global.NAVIGATIONSTARTBUTTON?.setVisible(true)
    global.NAVIGATIONSTARTHEAD?.setVisible(true)
    // 选点不再清除，二次进入默认填入
    // global.SELECTPOINTLATITUDEANDLONGITUDE = undefined
    NavigationService.goBack()
    return true
  }

  renderHintText() {
    return (
      <View>
        <Text style={styles.itemSubTitle}>
          {
            getLanguage(global.language).Profile
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
            {getLanguage(global.language).Prompt.FLOOR}
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
          title: getLanguage(global.language).Profile.MAP_AR_DATUM_POSITION,
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
