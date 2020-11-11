import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native'
import { Container } from '../../components'

import { color } from '../../styles'
import { getLanguage } from '../../language'
import { SMap, SCollectSceneFormView } from 'imobile_for_reactnative'
import { Toast, scaleSize } from '../../utils'
import { ConstOnline, TouchType } from '../../constants'
import NavigationService from '../../containers/NavigationService'
import MapSelectPointLatitudeAndLongitude from '../workspace/components/MapSelectPointLatitudeAndLongitude/MapSelectPointLatitudeAndLongitude'

export default class CollectSceneFormSet extends Component {
  props: {
    navigation: Object,
    fixedPositions: Function,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.fixedPositions = params && params.fixedPositions
    this.point = params && params.point

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
      problemItems: problemItems,
      selectProblemItems: [],
      problemsDetail: '',
      contactWay: '',

      longitude: '',
      latitude: '',
    }
  }

  componentDidMount() {
    // this.getFixedPosition()
    this.point &&
      this.DATUMPOINTVIEWSET.updateLatitudeAndLongitude(this.point)
  }

  getFixedPosition = async () => {
    let fiexdPoint = await SCollectSceneFormView.getFixedPosition()
    this.DATUMPOINTVIEWSET.updateLatitudeAndLongitude(fiexdPoint)
  }

  getCurrentPosition = async () => {
    GLOBAL.Loading.setLoading(
      true,
      getLanguage(GLOBAL.language).Profile.MAP_AR_DATUM_AUTO_LOCATIONING,
    )
    let map = await SMap.getCurrentPosition()

    this.DATUMPOINTVIEWSET.updateLatitudeAndLongitude(map)

    GLOBAL.Loading.setLoading(false)
    Toast.show(
      getLanguage(GLOBAL.language).Profile.MAP_AR_DATUM_AUTO_LOCATION_SUCCEED,
    )
  }

  mapSelectPoint = async () => {
    GLOBAL.MapSelectPointType = 'selectPoint'
    GLOBAL.OverlayView.setVisible(false)

    GLOBAL.ToolBar.setVisible(false)
    GLOBAL.MapXmlStr = await SMap.mapToXml()

    GLOBAL.TouchType = TouchType.MAP_SELECT_POINT
    GLOBAL.MAPSELECTPOINT.setVisible(true)
    // GLOBAL.SelectPointLatitudeAndLongitude.setVisible(true)

    //导航选点 全屏时保留mapController
    GLOBAL.mapController && GLOBAL.mapController.setVisible(true)

    GLOBAL.toolBox.showFullMap(true)
    GLOBAL.toolBox.showFullMap(false)
    GLOBAL.toolBox.showFullMap(true)

    //考虑搜索界面跳转，不能直接goBack
    let map = await SMap.getCurrentPosition()
    let wsData = JSON.parse(JSON.stringify(ConstOnline.Google))
    wsData.layerIndex = 3
    let licenseStatus = await SMap.getEnvironmentStatus()
    GLOBAL.isLicenseValid = licenseStatus.isLicenseValid
    NavigationService.navigate('MapView', {
      wsData,
      isExample: true,
      noLegend: true,
      showMarker: {
        x: map.x,
        y: map.y,
      },
    })
    GLOBAL.toolBox.showFullMap(true)
    GLOBAL.TouchType = TouchType.MAP_SELECT_POINT
    let point = {
      x: map.x,
      y: map.y,
    }
    GLOBAL.MAPSELECTPOINT.openSelectPointMap(wsData, point)
    GLOBAL.SELECTPOINTLATITUDEANDLONGITUDE = point
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

        {/** 暂时屏蔽掉地图选点 */}
        {/* <TouchableOpacity
    style={styles.buttonTouable}
    onPress={
      this.mapSelectPoint
    }>
    <Text style={styles.itemButton}>
      {getLanguage(GLOBAL.language).Profile.MAP_AR_DATUM_MAP_SELECT_POINT}
    </Text>

    </TouchableOpacity> */}
      </View>
    )
  }

  renderTitle() {
    return (
      <View style={{ backgroundColor: color.background }}>
        <View style={styles.item}>
          <Text style={styles.itemtitle}>
            {getLanguage(GLOBAL.language).Profile.MAP_AR_DATUM_POSITION}
          </Text>
          <Text style={styles.itemSubTitle}>
            {'(' +
              getLanguage(GLOBAL.language).Profile
                .MAP_AR_DATUM_PLEASE_TOWARDS_NORTH +
              ')'}
          </Text>
        </View>
        <View style={styles.separateLine} />
        <MapSelectPointLatitudeAndLongitude
          // style={{
          //   alignItems: 'flex-end'
          // }}
          ref={ref => (this.DATUMPOINTVIEWSET = ref)}
          isEdit={true}
        />

        {/* <View style={styles.separateLine} /> */}
      </View>
    )
  }

  _renderHeaderRight = () => {
    return (
      <TouchableOpacity
        key={'search'}
        onPress={async () => {
          let point = this.DATUMPOINTVIEWSET.getLatitudeAndLongitude()
          this.fixedPositions(point)
        }}
      >
        <Text style={styles.textConfirm}>
          {getLanguage(GLOBAL.language).Map_Settings.CONFIRM}
        </Text>
      </TouchableOpacity>
    )
  }

  renderContent() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: color.background }}>
        <View style={{ flex: 1, backgroundColor: color.background }}>
          <View style={{ height: 10 }} />

          {this.renderTitle()}
          {this.renderButtons()}
        </View>
      </ScrollView>
    )
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(GLOBAL.language).Profile.MAP_AR_DATUM_SETTING,
          //'设置',
          navigation: this.props.navigation,
          headerRight: this._renderHeaderRight(),
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
    // justifyContent: 'space-between',
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

    // textAlignVertical: 'center',

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
    // backgroundColor: color.content_white,
  },

  itemtitle: {
    fontSize: scaleSize(24),
    color: color.black,
    paddingLeft: scaleSize(15),
    backgroundColor: color.white,
  },
  itemSubTitle: {
    fontSize: scaleSize(18),
    color: color.gray,
    backgroundColor: color.white,
  },
  itemInput: {
    width: '100%',
    // height: scaleSize(120),
    fontSize: scaleSize(22),
    padding: scaleSize(15),

    // textAlignVertical: 'center',

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
    backgroundColor: color.white,
  },
  textConfirm: {
    fontSize: scaleSize(22),
    color: color.black,
    padding: scaleSize(10),
  },
})
