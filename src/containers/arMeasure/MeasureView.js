import * as React from 'react'
import {
  InteractionManager,
  TouchableOpacity,
  View,
  Image,
  Text,
  DeviceEventEmitter,
  ScrollView,
  Platform,
  NativeModules,
  NativeEventEmitter,
} from 'react-native'
import NavigationService from '../../containers/NavigationService'
import { getThemeAssets } from '../../assets'
import { SMMeasureView, SMeasureView,SMap  } from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import styles from './styles'
import ImageButton from '../../components/ImageButton'
import { Container, Dialog } from '../../components'
import { Toast, scaleSize } from '../../utils'
import { getLanguage } from '../../language'
import { color } from '../../styles'
// import Button from '../../components/Button/Button'
const SMeasureViewiOS = NativeModules.SMeasureView
const iOSEventEmi = new NativeEventEmitter(SMeasureViewiOS)
/*
 * AR高精度采集界面
 */
export default class MeasureView extends React.Component {
  props: {
    navigation: Object,
    language: String,
    user: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.route || {}
    this.datasourceAlias = params.datasourceAlias || ''
    this.datasetName = params.datasetName
    this.point = params.point

    this.state = {
      currentLength: 0,
      totalLength: 0,
      tolastLength: 0,
      totalArea: 0,
      showModelViews: false,
      SearchingSurfacesSucceed: false,
      showSwithchButtons: false,
    }
  }

  // eslint-disable-next-line
  componentWillMount() {
    SMap.setDynamicviewsetVisible(false)
    Orientation.lockToPortrait()
  }

  componentDidMount() {
    this.DatumPointDialog.setDialogVisible(true)

    InteractionManager.runAfterInteractions(() => {
      // 初始化数据
      (async function() {
        SMeasureView.initMeasureCollector(
          this.datasourceAlias,
          this.datasetName,
        )
        let fixedPoint = this.point
        setTimeout(function() {
          //设置基点
          SMeasureView.fixedPosition(false, fixedPoint.x, fixedPoint.y, 0)
        }, 1000)
        //注册监听
        this.onCurrentLengthChangedListener = iOSEventEmi.addListener(
          'onCurrentLengthChanged',
          this.onCurrentLengthChanged,
        )
        this.onTotalLengthChangedListener =  iOSEventEmi.addListener(
          'onTotalLengthChanged',
          this.onTotalLengthChanged,
        )
        this.onCurrentToLastPntDstChangedListener = iOSEventEmi.addListener(
          'onCurrentToLastPntDstChanged',
          this.onCurrentToLastPntDstChanged,
        )
        this.onSearchingSurfacesListener = iOSEventEmi.addListener(
          'onSearchingSurfaces',
          this.onSearchingSurfaces,
        )
        this.onSearchingSurfacesSucceedListener = iOSEventEmi.addListener(
          'onSearchingSurfacesSucceed',
          this.onSearchingSurfacesSucceed,
        )
      }.bind(this)())
    })
  }

  componentWillUnmount() {
    SMap.setDynamicviewsetVisible(true)
    Orientation.unlockAllOrientations()
    //移除监听
    this.onSearchingSurfacesSucceedListener?.remove()
    this.onSearchingSurfacesSucceedListener = null

    this.onSearchingSurfacesListener?.remove()
    this.onSearchingSurfacesListener = null

    this.onCurrentToLastPntDstChangedListener?.remove()
    this.onCurrentToLastPntDstChangedListener = null

    this.onTotalLengthChangedListener?.remove()
    this.onTotalLengthChangedListener = null

    this.onCurrentLengthChangedListener?.remove()
    this.onCurrentLengthChangedListener = null
    //注册监听
    if (Platform.OS !== 'ios') {
      SMeasureView.dispose()
    }
  }

  onCurrentLengthChanged = params => {
    this.setState({
      currentLength: params.current,
    })
  }

  onTotalLengthChanged = params => {
    this.setState({
      totalLength: params.total,
    })
  }

  onTotalAreaChanged = params => {
    this.setState({
      totalArea: params.totalArea,
    })
  }

  onCurrentToLastPntDstChanged = params => {
    this.setState({
      tolastLength: params.tolast,
    })
  }

  onSearchingSurfaces = () => {
    this.setState({
      SearchingSurfacesSucceed: false,
    })
  }

  onSearchingSurfacesSucceed = () => {
    this.setState({
      SearchingSurfacesSucceed: true,
    })
  }

  /** 添加 **/
  addNewRecord = async () => {
    await SMeasureView.addNewRecord()
  }

  /** 添加 **/
  switchModelViews = async () => {
    // if (Platform.OS === 'ios') {
    //   this.setState({
    //     showModelViews: !this.state.showModelViews,
    //   })
    // } else {
    this.setState({
      showSwithchButtons: !this.state.showSwithchButtons,
    })
    //    }
  }

  /** 撤销 **/
  undo = async () => {
    await SMeasureView.undoDraw()
  }

  /** 清除 **/
  clearAll = async () => {
    await SMeasureView.clearAll()
  }

  /** 保存 **/
  save = async () => {
    if (!this.datasourceAlias && !this.datasetName) return
    let result = await SMeasureView.saveDataset()
    if (result) {
      await SMeasureView.clearAll()
      Toast.show(getLanguage(this.props.language).Prompt.SAVE_SUCCESSFULLY)
    }
  }

  /** 重置/切换模式 **/
  remake = () => {
    //安排任务在交互和动画完成之后执行
    InteractionManager.runAfterInteractions(() => {
      // 重置数据
    })
  }

  /** 确认 **/
  confirm = () => {}

  back = () => {
    NavigationService.goBack('MeasureView')

    global.toolBox && global.toolBox.removeAIDetect(false)
    global.toolBox.switchAr()
    return true
  }

  choseMoreModel = () => {
    const datasourceAlias = 'currentLayer.datasourceAlias' // 标注数据源名称
    const datasetName = 'currentLayer.datasetName' // 标注图层名称
    NavigationService.navigate('ModelChoseView', {
      datasourceAlias,
      datasetName,
    })
  }

  setFlagType = async type => {
    await SMeasureView.setFlagType(type)
  }

  setMeasureMode = async mode => {
    await SMeasureView.setMeasureMode(mode)
  }

  /** 设置 */
  setting = () => {
    NavigationService.navigate('CollectSceneFormSet', {
      point: this.point,
      fixedPositions: point => {
        NavigationService.goBack()
        SMeasureView.fixedPosition(false, point.x, point.y, 0)
      },
    })
  }

  renderDialog = () => {
    return (
      <Dialog
        ref={ref => (this.DatumPointDialog = ref)}
        type={'modal'}
        cancelBtnVisible={false}
        confirmBtnTitle={getLanguage(global.language).Prompt.CONFIRM}
        confirmAction={async () => {
          let fixedPoint = this.point
          //设置基点
          SMeasureView.fixedPosition(false, fixedPoint.x, fixedPoint.y, 0)
          this.DatumPointDialog.setDialogVisible(false)
        }}
        opacity={1}
        opacityStyle={styles.opacityView}
        style={styles.dialogBackground}
      >
        {this.renderLicenseDialogChildren()}
      </Dialog>
    )
  }

  renderLicenseDialogChildren = () => {
    return (
      <View style={styles.dialogHeaderView}>
        <Image
          source={require('../../assets/home/Frenchgrey/icon_prompt.png')}
          style={styles.dialogHeaderImg}
        />
        <Text style={styles.promptTitle}>
          {
            getLanguage(global.language).Profile
              .MAP_AR_DATUM_PLEASE_TOWARDS_NORTH
          }
        </Text>
      </View>
    )
  }

  renderBottomBtns = () => {
    return (
      <View style={styles.toolbar}>
        <View style={styles.buttonView}>
          <TouchableOpacity
            onPress={() => this.clearAll()}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.toolbar.icon_ar_toolbar_delete}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.undo()} style={styles.iconView}>
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.toolbar.icon_ar_toolbar_undo}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.switchModelViews()}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.toolbar.icon_ar_toolbar_switch}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.save()} style={styles.iconView}>
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.toolbar.icon_ar_toolbar_save}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setting()
            }}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.toolbar.ai_setting}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderCenterBtn = () => {
    return (
      <ImageButton
        containerStyle={styles.capture}
        iconStyle={styles.iconView}
        activeOpacity={0.5}
        icon={getThemeAssets().ar.icon_ar_measure_add}
        onPress={() => {
          this.addNewRecord()
        }}
      />
    )
  }

  renderModelItemFirst = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => this.setFlagType('PIN_BOWLING')}
        style={styles.ModelItemView}
      >
        <Image
          source={getThemeAssets().ar.navi_model_pin_bowling}
          style={styles.img}
        />
        {/*<Text style={styles.titleSwitchModelsView}>{'PIN_BOWLING'}</Text>*/}
      </TouchableOpacity>
      // <View style={styles.ModelItemView}>
      //   <Image
      //     source={getThemeAssets().ar.icon_ar_measure_add}
      //     style={styles.img}
      //   />
      //   <Text style={styles.titleSwitchModelsView}>{'PIN_BOWLING'}</Text>
      // </View>
    )
  }
  renderModelItemSecond = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => this.setFlagType('RED_FLAG')}
        style={styles.ModelItemView}
      >
        <Image
          source={getThemeAssets().ar.navi_model_red_flag}
          style={styles.img}
        />
        {/*<Text style={styles.titleSwitchModelsView}>{'RED_FLAG'}</Text>*/}
      </TouchableOpacity>
      // <View style={styles.ModelItemView}>
      //   <Image
      //     source={getThemeAssets().ar.icon_ar_measure_add}
      //     style={styles.img}
      //   />
      //   <Text style={styles.titleSwitchModelsView}>{'RED_FLAG'}</Text>
      // </View>
    )
  }
  renderModelItem = () => {
    return (
      <View style={styles.ModelItemView}>
        <Image
          source={getThemeAssets().ar.icon_ar_measure_add}
          style={styles.img}
        />
        <Text style={styles.titleSwitchModelsView}>{'一种模型'}</Text>
      </View>
    )
  }

  renderSwitchModels = () => {
    return (
      <View style={styles.SwitchModelsView}>
        <Text style={styles.titleSwitchModelsView}>
          {
            getLanguage(global.language).Map_Main_Menu
              .MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT_CHOOSE_MODEL
          }
        </Text>
        <View style={styles.DividingLine} />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContentContainer}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {this.renderModelItemFirst()}
          {this.renderModelItemSecond()}
          {/*{this.renderModelItem()}*/}
          {/*{this.renderModelItem()}*/}
          {/*{this.renderModelItem()}*/}
        </ScrollView>
        {/* <Button
          style={styles.btnSwitchModelsView}
          titleStyle={styles.txtBtnSwitchModelsView}
          title={'查看更多'}
          type={'BLUE'}
          activeOpacity={0.5}
          onPress={() => this.choseMoreModel()}
        />*/}
      </View>
    )
  }

  renderTopBtns = () => {
    return (
      <View style={styles.topView}>
        <TouchableOpacity
          onPress={() => NavigationService.goBack()}
          style={styles.iconView}
        >
          <Image
            resizeMode={'contain'}
            source={getThemeAssets().ar.icon_ar_measure_back}
            style={styles.smallIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.save()} style={styles.iconView}>
          <Image
            resizeMode={'contain'}
            source={getThemeAssets().ar.icon_ar_measure_save}
            style={styles.smallIcon}
          />
        </TouchableOpacity>
      </View>
    )
  }

  renderBottomSwitchBtns = () => {
    return (
      <View style={styles.SwitchMeasureModeView}>
        <View style={[styles.buttonView, { backgroundColor: color.white }]}>
          <TouchableOpacity
            onPress={() => {
              this.setMeasureMode('MEASURE_LINE')
              this.setState({
                showSwithchButtons: false,
              })
            }}
            style={styles.iconView}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                resizeMode={'contain'}
                source={getThemeAssets().mapTools.icon_dotted_lines}
                style={styles.smallIcon}
              />

              <Text style={styles.buttonname}>
                {
                  getLanguage(global.language).Map_Main_Menu
                    .MAP_AR_AI_MEASURE_LENGTH
                }
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              try {
                this.setMeasureMode('MEASURE_AREA')
                this.setState({
                  showSwithchButtons: false,
                })
              } catch (e) {
                () => {}
              }
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                resizeMode={'contain'}
                source={getThemeAssets().mark.icon_frame}
                style={styles.smallIcon}
              />
              <Text style={styles.buttonname}>
                {
                  getLanguage(global.language).Map_Main_Menu
                    .MAP_AR_AI_MEASURE_AREA
                }
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </View>
      </View>
    )
  }

  renderTotalLengthChangeView() {
    return (
      <View style={styles.totallengthChangeView}>
        <Text style={styles.titleTotal}>
          {getLanguage(global.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_TOTALLENGTH +
            this.state.totalLength +
            'm'}
        </Text>
      </View>
    )
  }

  renderTotalAreaChangeView() {
    return (
      <View style={[styles.totallengthChangeView, { top: scaleSize(200) }]}>
        <Text style={styles.titleTotal}>
          {getLanguage(global.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_TOTALLENGTH +
            this.state.totalArea +
            'm²'}
        </Text>
      </View>
    )
  }

  renderCurrentLengthChangeView() {
    return (
      <View style={styles.tolastlengthChangeView}>
        <Text style={styles.titleTotal}>
          {getLanguage(global.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT_VIEW_DISTANCE +
            this.state.currentLength +
            'm'}
        </Text>
      </View>
    )
  }

  renderToLastLengthChangeView() {
    return (
      <View style={styles.currentLengthChangeView}>
        <Text style={styles.title}>
          {getLanguage(global.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_TOLASTLENGTH +
            this.state.tolastLength +
            'm'}
        </Text>
      </View>
    )
  }

  renderSearchingView() {
    return Platform.OS === 'ios' ? null : (
      <View style={styles.currentLengthChangeView}>
        <Text style={styles.title}>
          {
            getLanguage(global.language).Map_Main_Menu
              .MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT_SEARCHING
          }
        </Text>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        headerProps={{
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT,
          navigation: this.props.navigation,
          backAction: this.back,
          type: 'fix',
        }}
        bottomProps={{ type: 'fix' }}
      >
        <SMMeasureView ref={ref => (this.SMMeasureView = ref)} />
        {this.state.showSwithchButtons && this.renderBottomSwitchBtns()}
        {this.renderBottomBtns()}
        {/*{this.renderCenterBtn()}*/}
        {/*{this.renderTopBtns()}*/}
        {this.state.showModelViews && this.renderSwitchModels()}
        {this.state.SearchingSurfacesSucceed &&
          this.renderTotalLengthChangeView()}
        {this.state.SearchingSurfacesSucceed &&
          this.renderCurrentLengthChangeView()}
        {this.state.SearchingSurfacesSucceed &&
          this.renderToLastLengthChangeView()}
        {this.state.SearchingSurfacesSucceed &&
          this.renderTotalAreaChangeView()}
        {/* {!this.state.SearchingSurfacesSucceed && this.renderSearchingView()} */}
        {this.renderDialog()}
      </Container>
    )
  }
}
