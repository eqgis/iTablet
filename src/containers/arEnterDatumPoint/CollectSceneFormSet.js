import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
  TextInput,
  Image,
} from 'react-native'
import { Container } from '../../components'
import { getThemeAssets } from '../../assets'
import { color } from '../../styles'
import { getLanguage } from '../../language'
import { SMap, SCollectSceneFormView, SARMap} from 'imobile_for_reactnative'
import { Toast, scaleSize } from '../../utils'
import { ConstOnline, TouchType } from '../../constants'
import NavigationService from '../../containers/NavigationService'
import MapSelectPointLatitudeAndLongitude from '../workspace/components/MapSelectPointLatitudeAndLongitude/MapSelectPointLatitudeAndLongitude'
import { setShowARSceneNotify, setARLabel } from '../../redux/models/setting'
import { connect } from 'react-redux'
class CollectSceneFormSet extends Component {
  props: {
    navigation: Object,
    fixedPositions: Function,
    autoCatch: Function,//AR测量等方法调用开启捕捉 add jiakai
    setTolerance: Function,//AR测量等方法设置捕捉容限 add jiakai
    showARSceneNotify: boolean,
    /** 是否显示标注结果标识 add lyx */
    showARLabel: boolean,
    setShowARSceneNotify(value: boolean): Promise<void>,
    setARLabel(value: boolean): Promise<void>,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.route
    this.fixedPositions = params && params.fixedPositions
    this.point = params && params.point
    this.autoCatch = params && params.autoCatch
    this.isSnap = params && params.isSnap//AR测量等方法调用开启捕捉 add jiakai
    this.tole = params && params.tole//AR测量等捕捉容限 add jiakai
    this.setTolerance = params && params.setTolerance//AR测量等方法设置捕捉容限 add jiakai
    this.isMeasure = params && params.isMeasure//量算等界面不显示定位点 add jiakai
    this.showGenera = params && params.showGenera || false//测量界面开启绘制窗口
    this.showGeneracb = params && params.showGeneracb//测量界面开启绘制窗口回调
    this.collectScene = params && params.collectScene || false//高静采集跳转设置参数

    this.showType = params && params.showType // 是否是新的校准界面
    this.reshowDatumPoint = params && params.reshowDatumPoint // 点击设置里的位置校准 回到上一页并且重新显示位置校准
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
      isSnap:this.isSnap,//AR测量等方法调用开启捕捉 add jiakai
      Tolerance: this.tole,//AR测量等捕捉容限 add jiakai
      showGenera: this.showGenera,
    }
  }

  componentDidMount() {
    // this.getFixedPosition()
    // 如果之前输入过点，就不再根据this.point更新界面 而是使用之前的输入
    if(!global.SELECTPOINTLATITUDEANDLONGITUDE) {
      this.point &&
      this.DATUMPOINTVIEWSET && this.DATUMPOINTVIEWSET.updateLatitudeAndLongitude(this.point)
    }
  }

  getFixedPosition = async () => {
    let fiexdPoint = await SCollectSceneFormView.getFixedPosition()
    this.DATUMPOINTVIEWSET && this.DATUMPOINTVIEWSET.updateLatitudeAndLongitude(fiexdPoint)
  }

  getCurrentPosition = async () => {
    global.Loading.setLoading(
      true,
      getLanguage(global.language).Profile.MAP_AR_DATUM_AUTO_LOCATIONING,
    )
    let map = await SMap.getCurrentPosition()

    this.DATUMPOINTVIEWSET && this.DATUMPOINTVIEWSET.updateLatitudeAndLongitude(map)

    global.Loading.setLoading(false)
    Toast.show(
      getLanguage(global.language).Profile.MAP_AR_DATUM_AUTO_LOCATION_SUCCEED,
    )
  }

  mapSelectPoint = async () => {
    global.OverlayView.setVisible(false)

    global.ToolBar.setVisible(false)
    global.MapXmlStr = await SMap.mapToXml()

    global.TouchType = TouchType.MAP_SELECT_POINT
    global.MAPSELECTPOINT.setVisible(true)
    // global.SelectPointLatitudeAndLongitude.setVisible(true)

    //导航选点 全屏时保留mapController
    global.mapController && global.mapController.setVisible(true)

    global.toolBox.showFullMap(true)
    global.toolBox.showFullMap(false)
    global.toolBox.showFullMap(true)

    //考虑搜索界面跳转，不能直接goBack
    let map = await SMap.getCurrentPosition()
    let wsData = JSON.parse(JSON.stringify(ConstOnline.Google))
    wsData.layerIndex = 3
    let licenseStatus = await SMap.getEnvironmentStatus()
    global.isLicenseValid = licenseStatus.isLicenseValid
    NavigationService.navigate('MapView', {
      wsData,
      isExample: true,
      noLegend: true,
      showMarker: {
        x: map.x,
        y: map.y,
      },
      selectPointType: 'selectPoint',
    })
    global.toolBox.showFullMap(true)
    global.TouchType = TouchType.MAP_SELECT_POINT
    let point = {
      x: map.x,
      y: map.y,
    }
    global.MAPSELECTPOINT.openSelectPointMap(wsData, point)
    global.SELECTPOINTLATITUDEANDLONGITUDE = point
  }

  //AR测量等方法调用开启捕捉 add jiakai
  renderSwitch() {
    return (
      <View style={{ backgroundColor: color.background }}>
        <View style={styles.separateLine} />
        <View style={styles.item}>
          <Text style={styles.itemtitle}>
            {getLanguage(global.language).Profile.MAP_AR_DATUM_AUTO_CATCH}
          </Text>

          <View style={styles.switchItem}>

            <Switch
              trackColor={{ false: color.bgG, true: color.switch }}
              thumbColor={color.bgW}
              ios_backgroundColor={
                this.state.isSnap ? color.switch : color.bgG
              }
              value={this.state.isSnap}
              onValueChange={value => {
                this.setState({ isSnap: value })
                this.autoCatch(value)
              }}
            />
          </View>
        </View>
      </View>
    )
  }

  //AR测量等方法捕捉容限 add jiakai
  renderSnapTolerance() {
    return (
      <View style={{ backgroundColor: color.background }}>
        <View style={styles.separateLine} />
        <View style={styles.item}>
          <Text style={styles.itemtitle}>
            {getLanguage(global.language).Profile.MAP_AR_DATUM_AUTO_CATCH_TOLERANCE}
          </Text>

          <View style={styles.switchItem}>
            <TextInput
              editable={true}
              style={styles.itemInput}
              keyboardType="numeric"
              onChangeText={text => {
                let Tolerance = this.clearNoNum(text)
                this.setState({
                  Tolerance: Tolerance,
                })
              }}
              value={this.state.Tolerance + ''}
            />
          </View>
        </View>
      </View>
    )
  }

  //ar测图是否开启小窗口
  renderShowGenera() {
    return (
      <View style={{ backgroundColor: color.background }}>
        <View style={styles.separateLine} />
        <View style={styles.item}>
          <Text style={styles.itemtitle}>
            {getLanguage(global.language).Profile.MAP_AR_DRAW_WINDOW}
          </Text>

          <View style={styles.switchItem}>

            <Switch
              trackColor={{ false: color.bgG, true: color.switch }}
              thumbColor={color.bgW}
              ios_backgroundColor={
                this.state.showGenera ? color.switch : color.bgG
              }
              value={this.state.showGenera}
              onValueChange={value => {
                this.setState({ showGenera: value })
                this.showGeneracb(value)
              }}
            />
          </View>
        </View>
      </View>
    )
  }

  clearNoNum = value => {
    value = value.replace(/[^\d.]/g, '') //清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, '.') //只保留第一个. 清除多余的
    value = value
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
    // value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
    if (value.indexOf('.') < 0 && value != '') {
      //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      value = parseFloat(value)
    } else if (value == '') {
      value = 0
    }
    return value
  }

  renderButtons() {
    return this.showType !== 'newDatumPoint' ?  (
      <View style={styles.buttonItem}>
        <TouchableOpacity
          style={styles.buttonTouable}
          onPress={this.getCurrentPosition}
        >
          <Text style={styles.itemButton}>
            {getLanguage(global.language).Profile.MAP_AR_DATUM_AUTO_LOCATION}
          </Text>
        </TouchableOpacity>

        {/** 暂时屏蔽掉地图选点 */}
        {/* <TouchableOpacity
    style={styles.buttonTouable}
    onPress={
      this.mapSelectPoint
    }>
    <Text style={styles.itemButton}>
      {getLanguage(global.language).Profile.MAP_AR_DATUM_MAP_SELECT_POINT}
    </Text>

    </TouchableOpacity> */}
      </View>
    ) :
      (
        <View style={{ backgroundColor: color.background }}>
          <View style={styles.separateLine} />
          <View style={styles.item}>
            <Text style={styles.itemtitle}>
              {getLanguage(global.language).Profile.MAR_AR_POSITION_CORRECT}
            </Text>
            <TouchableOpacity
              style={styles.switchItem}
              onPress={()=>{
                this.reshowDatumPoint && this.reshowDatumPoint()
              }}
            >
              <Image source={getThemeAssets().publicAssets.icon_arrow_right} style={{
                width: scaleSize(40),
                height: scaleSize(40),
              }} />
            </TouchableOpacity>
          </View>
        </View>
      )
  }

  renderTitle() {
    return (
      <View style={{ backgroundColor: color.background }}>
        <View style={styles.item}>
          <Text style={styles.itemtitle}>
            {getLanguage(global.language).Profile.MAP_AR_DATUM_POSITION}
          </Text>
          <Text style={styles.itemSubTitle}>
            {'(' +
              getLanguage(global.language).Profile
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
          if(this.fixedPositions){
            let point = this.DATUMPOINTVIEWSET && this.DATUMPOINTVIEWSET.getLatitudeAndLongitude()
            this.fixedPositions(point)
            global.SELECTPOINTLATITUDEANDLONGITUDE = point
          }
          if(this.setTolerance){
            this.setTolerance(this.state.Tolerance)
          }
        }}
      >
        <Text style={styles.textConfirm}>
          {getLanguage(global.language).CONFIRM}
        </Text>
      </TouchableOpacity>
    )
  }

  /**
   * ar场景提示
   */
  _renderShowToast = () => {
    return (
      <View style={{ backgroundColor: color.background }}>
        <View style={styles.separateLine} />
        <View style={styles.item}>
          <Text style={styles.itemtitle}>
            {getLanguage(global.language).Prompt.SHOW_AR_SCENE_NOTIFY}
          </Text>

          <View style={styles.switchItem}>

            <Switch
              trackColor={{ false: color.bgG, true: color.switch }}
              thumbColor={color.bgW}
              ios_backgroundColor={
                this.props.showARSceneNotify ? color.switch : color.bgG
              }
              value={this.props.showARSceneNotify}
              onValueChange={value => {
                this.props.setShowARSceneNotify(value)
              }}
            />
          </View>
        </View>
      </View>
    )
  }

  /**
   * ar显示标注结果
   */
  _renderShowARLabel = () => {
    return (
      <View style={{ backgroundColor: color.background }}>
        <View style={styles.separateLine} />
        <View style={styles.item}>
          <Text style={styles.itemtitle}>
            {getLanguage().Prompt.SHOW_AR_LABEL}
          </Text>

          <View style={styles.switchItem}>

            <Switch
              trackColor={{ false: color.bgG, true: color.switch }}
              thumbColor={color.bgW}
              ios_backgroundColor={
                this.props.showARLabel ? color.switch : color.bgG
              }
              value={this.props.showARLabel}
              onValueChange={value => {
                this.props.setARLabel(value)
                SARMap.showARLabel(value)
              }}
            />
          </View>
        </View>
      </View>
    )
  }

  renderContent() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: color.background }}>
        <View style={{ flex: 1, backgroundColor: color.background }}>
          <View style={{ height: 10 }} />

          {!this.isMeasure && this.showType !== 'newDatumPoint' && this.renderTitle()}
          {!this.isMeasure&&this.renderButtons()}
          {this.autoCatch&&this.renderSwitch()}
          {this.autoCatch&&this.state.isSnap&&this.renderSnapTolerance()}
          {!this.collectScene&&!this.isMeasure&&this.renderShowGenera()}
          {this._renderShowToast()}
          {this._renderShowARLabel()}
        </View>
      </ScrollView>
    )
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(global.language).Profile.MAP_AR_DATUM_SETTING,
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


const mapStateToProps = state => ({
  showARSceneNotify: state.setting.toJS().showARSceneNotify,
  showARLabel: state.setting.toJS().showARLabel,
})


const mapDispatchToProps = {
  setShowARSceneNotify,
  setARLabel,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CollectSceneFormSet)

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
    width: scaleSize(100),
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
  switchItem: {
    height: scaleSize(80),
    paddingRight: scaleSize(15),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: color.white,
    flex:1,
  },
})
