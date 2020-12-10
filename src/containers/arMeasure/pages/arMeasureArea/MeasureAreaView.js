import * as React from 'react'
import {
  InteractionManager,
  TouchableOpacity,
  View,
  Image,
  Text,
  ScrollView,
  Platform,
  DeviceEventEmitter,
  NativeModules,
  NativeEventEmitter,
} from 'react-native'
import NavigationService from '../../../../containers/NavigationService'
import { getThemeAssets } from '../../../../assets'
import {
  SMMeasureAreaView,
  SMeasureAreaView,
  SMap,
} from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import styles from './styles'
import ImageButton from '../../../../components/ImageButton'
import { Container, Dialog } from '../../../../components'
import { Toast, scaleSize } from '../../../../utils'
import { getLanguage } from '../../../../language'
import { color } from '../../../../styles'
const SMeasureViewiOS = NativeModules.SMeasureAreaView
const iOSEventEmi = new NativeEventEmitter(SMeasureViewiOS)

/*
 * AR高精度采集界面
 */
export default class MeasureAreaView extends React.Component {
  props: {
    navigation: Object,
    language: String,
    user: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state || {}

    this.measureType = params.measureType

    this.isDrawing = false

    if (this.measureType) {
      if (this.measureType === 'measureArea') {
        this.title = getLanguage(
          GLOBAL.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_AREA
      } else if (this.measureType === 'measureLength') {
        this.title = getLanguage(
          GLOBAL.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_LENGTH
      } else if (this.measureType === 'drawLine') {
        this.title = getLanguage(
          GLOBAL.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_DRAW_LINE
      } else if (this.measureType === 'arDrawArea') {
        this.title = getLanguage(
          GLOBAL.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_DRAW_AREA
      } else if (this.measureType === 'arDrawPoint') {
        this.title = getLanguage(
          GLOBAL.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_DRAW_POINT
      } else if (this.measureType === 'arMeasureHeight') {
        this.title = getLanguage(
          GLOBAL.language,
        ).Map_Main_Menu.MAP_AR_AI_ASSISTANT_MEASURE_MEASURE_HEIGHT
      }

      if (
        this.measureType === 'drawLine' ||
        this.measureType === 'arDrawArea' ||
        this.measureType === 'arDrawPoint'
      ) {
        this.isDrawing = true

        this.datasourceAlias = params.datasourceAlias || ''
        this.datasetName = params.datasetName
        this.point = params.point
      }
      if (
        this.measureType === 'measureLength' ||
        this.measureType === 'measureArea'
      ) {
        this.canContinuousDraw = true
      }
    }

    this.state = {
      currentLength: 0,
      totalLength: 0,
      tolastLength: 0,
      totalArea: 0,
      showModelViews: false,
      SearchingSurfacesSucceed: false,
      showSwithchButtons: false,

      showCurrentHeightView: false,
      currentHeight: '0m',
      showADDPoint:false,
      showADD:false,
      isfirst:true,
      showLog:false,
      dioLog:'',
      diologStyle:{},
    }
  }

  // eslint-disable-next-line
  componentWillMount() {
    SMap.setDynamicviewsetVisible(false)
    Orientation.lockToPortrait()
  }

  componentDidMount() {
   
    // InteractionManager.runAfterInteractions(() => {//这里表示下面代码是在动画结束后才执行，但是外面有动画在执行就会导致下面代码一直不执行，开发者需要自己考虑 add xiezhy
      // 初始化数据
      (async function() {
        //提供测量等界面添加按钮及提示语的回调方法 add jiakai
        if (Platform.OS === 'ios') {
          iOSEventEmi.addListener(
            'com.supermap.RN.SMeasureAreaView.ADD',
            this.onAdd,
          )
          iOSEventEmi.addListener(
            'com.supermap.RN.SMeasureAreaView.CLOSE',
            this.onshowLog,
          )
        }else{
          SMeasureAreaView.setAddListener({
            callback: async result => {
              if (result) {
                // Toast.show("add******")
                if(this.state.isfirst){
                  this.setState({showADD:true,showADDPoint:true})
                }else{
                  this.setState({showADD:true})
                }
              }else{
                this.setState({showADD:false,showADDPoint:false})
              }
            },
          })

          SMeasureAreaView.setDioLogListener({
            callback: async result => {
              this.onshowLog(result)
            },
          })
        }   

        if (this.isDrawing) {
          SMeasureAreaView.initMeasureCollector(
            this.datasourceAlias,
            this.datasetName,
          )
          let fixedPoint = this.point
          setTimeout(function() {
            //设置基点
            SMeasureAreaView.fixedPosition(false, fixedPoint.x, fixedPoint.y, 0)
          }, 1000)
        }

        //注册监听
        if (Platform.OS === 'ios') {
          iOSEventEmi.addListener(
            'onCurrentHeightChanged',
            this.onCurrentHeightChanged,
          )
        } else {
          DeviceEventEmitter.addListener(
            'onCurrentHeightChanged',
            this.onCurrentHeightChanged,
          )
        }
      }.bind(this)())
    // })
  }

  componentWillUnmount() {
    //移除监听
    DeviceEventEmitter.removeListener(
      'onCurrentHeightChanged',
      this.onCurrentHeightChanged,
    )
  }

  /**高度变化 */
  onCurrentHeightChanged = params => {
    this.setState({
      currentHeight: params.currentHeight,
    })
  }

  /**添加按钮 */
  onAdd = result => {
    if (result.add) {
      if(this.state.isfirst){
        this.setState({showADD:true,showADDPoint:true})
      }else{
        this.setState({showADD:true})
      }
    }else{
      this.setState({showADD:false,showADDPoint:false})
    }
  }

   /**提示语回调 */
  onshowLog = result => {
    if(result.close){
      this.setState({dioLog:getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_LAYOUT_CLOSE,showLog:true})
    }

    if(result.dark){
      this.setState({dioLog:getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_LAYOUT_DARK,showLog:true})
    }

    if(result.fast){
      this.setState({dioLog:getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_LAYOUT_FAST,showLog:true})
    }

    if(result.nofeature){
      if(this.state.dioLog!=getLanguage(GLOBAL.language).Map_Main_Menu
      .MAP_AR_AI_ASSISTANT_LAYOUT_DARK)
      this.setState({dioLog:getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_LAYOUT_NOFEATURE,showLog:true})
    }

    if(result.none){
      this.setState({dioLog:'',showLog:false})
    }
  }

  /** 添加 **/
  addNewRecord = async () => {
    await SMeasureAreaView.addNewRecord()
    this.setState({showADDPoint:false,isfirst:false})
  }

  /** 添加 **/
  switchModelViews = async () => {
    if (Platform.OS === 'ios') {
      this.setState({
        showModelViews: !this.state.showModelViews,
      })
    } else {
      this.setState({
        showSwithchButtons: !this.state.showSwithchButtons,
      })
    }
  }

  /** 撤销 **/
  undo = async () => {
    await SMeasureAreaView.undoDraw()
  }

  /** 连续测量 **/
  continuousDraw = async () => {
    await SMeasureAreaView.continuousDraw()
  }

  /** 清除 **/
  clearAll = async () => {
    await SMeasureAreaView.clearAll()
    if (this.measureType === 'arMeasureHeight') {
      this.setState({
        currentHeight: '0m',
      })
    }
  }

  /** 保存 **/
  save = async () => {
    if (!this.datasourceAlias && !this.datasetName) return
    let result = await SMeasureAreaView.saveDataset()
    if (result) {
      await SMeasureAreaView.clearAll()
      Toast.show(getLanguage(GLOBAL.language).Prompt.SAVE_SUCCESSFULLY)
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
    //返回时立即释放资源，以免ai检测冲突 zhangxt
    SMeasureAreaView.dispose()
    // eslint-disable-next-line
    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(false)
    // eslint-disable-next-line
    GLOBAL.toolBox.switchAr()

    NavigationService.goBack()
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
    await SMeasureAreaView.setFlagType(type)
  }

  setMeasureMode = async mode => {
    await SMeasureAreaView.setMeasureMode(mode)
  }

  /** 设置 */
  setting = () => {
    NavigationService.navigate('CollectSceneFormSet', {
      point: this.point,
      fixedPositions: point => {
        NavigationService.goBack()
        SMeasureAreaView.fixedPosition(false, point.x, point.y, 0)
      },
    })
  }

  renderDialog = () => {
    return (
      <Dialog
        ref={ref => (this.DatumPointDialog = ref)}
        type={'modal'}
        cancelBtnVisible={false}
        confirmBtnTitle={getLanguage(GLOBAL.language).Prompt.CONFIRM}
        confirmAction={async () => {
          let fixedPoint = this.point
          //设置基点
          SMeasureAreaView.fixedPosition(false, fixedPoint.x, fixedPoint.y, 0)
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
          source={require('../../../../assets/home/Frenchgrey/icon_prompt.png')}
          style={styles.dialogHeaderImg}
        />
        <Text style={styles.promptTitle}>
          {
            getLanguage(GLOBAL.language).Profile
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

          {this.canContinuousDraw && (
            <TouchableOpacity
              onPress={() => this.continuousDraw()}
              style={styles.iconView}
            >
              <Image
                resizeMode={'contain'}
                source={getThemeAssets().ar.toolbar.icon_ar_toolbar_submit}
                style={styles.smallIcon}
              />
            </TouchableOpacity>
          )}
          {this.isDrawing && (
            <TouchableOpacity
              onPress={() => this.save()}
              style={styles.iconView}
            >
              <Image
                resizeMode={'contain'}
                source={getThemeAssets().ar.toolbar.icon_ar_toolbar_submit}
                style={styles.smallIcon}
              />
            </TouchableOpacity>
          )}
          {this.isDrawing && (
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
          )}
        </View>
      </View>
    )
  }

  renderADDPoint = () => {
    let image 
    GLOBAL.language === 'CN' ? image= getThemeAssets().ar.icon_ar_measure_add_toast : image= getThemeAssets().ar.icon_ar_measure_add_toast_en
    return (
      <ImageButton
        containerStyle={styles.addcapture}
        iconStyle={styles.addiconView}
        activeOpacity={0.3}
        icon={image}
      />
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

  renderDioLog = () => {
    return (
      <View style={[{
        top: scaleSize(300),
        borderRadius: 15,
        opacity: 0.5,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf:'center',
      }]}>
        <Text style={styles.dioLog}>
          {this.state.dioLog}
        </Text>
      </View>)
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
      </TouchableOpacity>
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
      </TouchableOpacity>
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
            getLanguage(GLOBAL.language).Map_Main_Menu
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
                  getLanguage(GLOBAL.language).Map_Main_Menu
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
                  getLanguage(GLOBAL.language).Map_Main_Menu
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
          {getLanguage(GLOBAL.language).Map_Main_Menu
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
          {getLanguage(GLOBAL.language).Map_Main_Menu
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
          {getLanguage(GLOBAL.language).Map_Main_Menu
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
          {getLanguage(GLOBAL.language).Map_Main_Menu
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
            getLanguage(GLOBAL.language).Map_Main_Menu
              .MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT_SEARCHING
          }
        </Text>
      </View>
    )
  }

  renderCurrentHeightChangeView() {
    return (
      <View style={styles.currentHeightChangeView}>
        <Text style={styles.titleCurrentHeight}>
          {this.state.currentHeight}
        </Text>
      </View>
    )
  }

  /** 原生mapview加载完成回调 */
  _onGetInstance = async () => {
    //设置类型需要放到原生空间初始化完成，放到componentDidMount 也不靠谱 add xiezhy
    if (this.measureType) {
      if (this.measureType === 'measureArea') {
        SMeasureAreaView.setMeasureMode('MEASURE_AREA')
        // SMeasureAreaView.setMeasureMode('DRAW_AREA')
      } else if (this.measureType === 'measureLength') {
        SMeasureAreaView.setMeasureMode('MEASURE_LINE')
      } else if (this.measureType === 'drawLine') {
        SMeasureAreaView.setMeasureMode('DRAW_LINE')
      } else if (
        this.measureType === 'arDrawArea' ||
        this.measureType === 'arArea'
      ) {
        SMeasureAreaView.setMeasureMode('DRAW_AREA')
      } else if (this.measureType === 'arDrawPoint') {
        SMeasureAreaView.setMeasureMode('DRAW_POINT')
      } else if (this.measureType === 'arMeasureHeight') {
        SMeasureAreaView.setMeasureMode('MEASURE_HEIGHT')
        this.setState({
          showCurrentHeightView: true,
        })
      }
      this.setState({isfirst:true})
    }
  }
  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        headerProps={{
          title: this.title,
          navigation: this.props.navigation,
          backAction: this.back,
          type: 'fix',
        }}
        bottomProps={{ type: 'fix' }}
      >
        <SMMeasureAreaView 
          ref={ref => (this.SMMeasureAreaView = ref)}
          onGetInstance={this._onGetInstance}
         />
        {this.state.showSwithchButtons && this.renderBottomSwitchBtns()}
        {this.renderBottomBtns()}
        {this.state.showModelViews && this.renderSwitchModels()}
        {this.state.SearchingSurfacesSucceed &&
          this.renderTotalLengthChangeView()}
        {this.state.SearchingSurfacesSucceed &&
          this.renderCurrentLengthChangeView()}
        {this.state.SearchingSurfacesSucceed &&
          this.renderToLastLengthChangeView()}
        {this.state.SearchingSurfacesSucceed &&
          this.renderTotalAreaChangeView()}
        {this.state.showCurrentHeightView &&
          this.renderCurrentHeightChangeView()}
          {this.state.showADDPoint&&this.renderADDPoint()}
          {this.state.showADD&&this.renderCenterBtn()}
          {this.state.showLog&&this.renderDioLog()}
      </Container>
    )
  }
}
