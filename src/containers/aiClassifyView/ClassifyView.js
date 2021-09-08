import * as React from 'react'
import {
  InteractionManager,
  TouchableOpacity,
  View,
  Image,
  Text,
  DeviceEventEmitter,
  Platform,
  NativeModules,
  NativeEventEmitter,
  AppState,
} from 'react-native'
import NavigationService from '../../containers/NavigationService'
import { getThemeAssets, getPublicAssets } from '../../assets'
import { SAIClassifyView, SMediaCollector, SMap } from 'imobile_for_reactnative'
import { getLanguage } from '../../language'
import { Container, ImagePicker, Loading, MTBtn } from '../../components'
import styles from './styles'
import ImageButton from '../../components/ImageButton'
import { FileTools } from '../../native'
import { ConstPath } from '../../constants'
import RadioButton from './RadioButton'
import { scaleSize, Toast, LayerUtils, DateUtil } from '../../utils'
import { RNCamera } from 'react-native-camera'
import Orientation from 'react-native-orientation'
// const { ClassifyView }= NativeModules;
// const iOSEventEmitter = new NativeEventEmitter(ClassifyView)
const SMessageServiceClassifyiOS = NativeModules.SAIClassifyView
const iOSEventEmi = new NativeEventEmitter(SMessageServiceClassifyiOS)

/*
 * AI分类
 */
export default class ClassifyView extends React.Component {
  props: {
    navigation: Object,
    language: String,
    user: Object,
    nav: Object,
    currentLayer: Object,
    isClassifyView:Object,
    setIsClassifyView: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state || {}
    this.datasourceAlias = params.datasourceAlias
    this.datasetName = params.datasetName
    this.checkedItem = 0

    this.state = {
      imgUri: '',
      isCameraVisible: true,
      isClassifyInfoVisible: false,
      first_result: '',
      first_result_confidence: '',
      isFirstShow: false,
      second_result: '',
      second_result_confidence: '',
      isSecondShow: false,
      third_result: '',
      third_result_confidence: '',
      isThirdShow: false,
      bgImageSource: '',
    }
    AppState.addEventListener('change', this.handleStateChange)
    this.stateChangeCount = 0
  }

  // eslint-disable-next-line
  componentWillMount() {
    SMap.setDynamicviewsetVisible(false)
    Orientation.lockToPortrait()
  }

  componentDidMount() {
    this.props.setIsClassifyView(true)
    this.Loading.setLoading(true)
    InteractionManager.runAfterInteractions(() => {
      // 初始化数据
      (async function() {
        await SAIClassifyView.initAIClassify(
          this.datasourceAlias,
          this.datasetName,
          this.props.language,
        )
        //注册监听
        if (Platform.OS === 'ios') {
          this.recognizeImageListener = iOSEventEmi.addListener(
            'recognizeImage',
            this.recognizeImage,
          )
        } else {
          this.recognizeImageListener = DeviceEventEmitter.addListener(
            'recognizeImage',
            this.recognizeImage,
          )
        }
        this.Loading.setLoading(false)
      }.bind(this)())
    })
  }

  componentWillUnmount() {
    SMap.setDynamicviewsetVisible(false)
    //移除监听
    // DeviceEventEmitter.removeListener('recognizeImage', this.recognizeImage)

    AppState.removeEventListener('change', this.handleStateChange)
    this.recognizeImageListener && this.recognizeImageListener.remove()
  }

  /************************** 处理状态变更 ***********************************/

  handleStateChange = async appState => {
    if (Platform.OS === 'android') {
      return
    }
    if (appState === 'inactive') {
      return
    }
    let count = this.stateChangeCount + 1
    this.stateChangeCount = count
    if (this.stateChangeCount !== count) {
      return
    } else if (this.prevAppstate === appState) {
      return
    } else {
      this.prevAppstate = appState
      this.stateChangeCount = 0
      if (appState === 'active') {
        this.clear()
        this.startPreview()
      } else if (appState === 'background') {
        this.pausePreview()
        // this.back()
      }
    }
  }

  /**
   * 图片分类后的回调
   */
  recognizeImage = params => {
    this.Loading.setLoading(false)
    if (params === 'License Invalid') {
      Toast.show('License Invalid\nPlease Check Your License')
      return
    }
    this.results = params.results
    if (this.results && this.results.length > 0) {
      this.setState({
        isClassifyInfoVisible: true,
      })
    } else {
      Toast.show(
        getLanguage(GLOBAL.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_CLASSIFY_FAILED,
      )
      this.clear()
      return
    }
    if (this.results[0]) {
      let item = this.results[0]
      this.setState(
        {
          isFirstShow: true,
          first_result: item.Title,
          first_result_confidence: item.Confidence,
        },
        () => {
          if (this.FirstRB) {
            this.checkedItem = 0
            this.FirstRB.setChecked(true) //默认选中第一个
          }
        },
      )
    } else {
      this.setState({
        isFirstShow: false,
      })
    }
    if (this.results[1]) {
      let item = this.results[1]
      this.setState({
        isSecondShow: true,
        second_result: item.Title,
        second_result_confidence: item.Confidence,
      })
    } else {
      this.setState({
        isSecondShow: false,
      })
    }
    if (this.results[2]) {
      let item = this.results[2]
      this.setState({
        isThirdShow: true,
        third_result: item.Title,
        third_result_confidence: item.Confidence,
      })
    } else {
      this.setState({
        isThirdShow: false,
      })
    }
  }

  startPreview = async () => {
    this.camera && this.camera.resumePreview()
  }

  pausePreview = async () => {
    this.camera && this.camera.pausePreview()
  }

  dispose = async () => {
    await SAIClassifyView.dispose()
  }

  /**
   * 照相
   */
  captureImage = async () => {
    if (!this.camera) return
    this.Loading.setLoading(
      true,
      getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_CLASSIFY_LOADING,
    )
    const options = {
      quality: 1,
      base64: true,
      pauseAfterCapture: true,
      orientation: 'portrait',
      fixOrientation: true,
      notCropImage: true,
    }
    let data = await this.camera.takePictureAsync(options)
    this.setState({
      imgUri: data.uri,
    })
    let sourcePath = this.state.imgUri.replace('file://', '')
    let result = await SAIClassifyView.loadImageUri(sourcePath)
    if (!result) {
      this.Loading.setLoading(false)
      Toast.show(
        getLanguage(GLOBAL.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_CLASSIFY_FAILED,
      )
      this.clear()
      await this.startPreview()
      return
    }
    if (Platform.OS === 'ios') {
      this.recognizeImage(result)
    }
  }

  save = async () => {
    //保存数据->跳转
    (async function() {
      let currentLayer = this.props.currentLayer
      // let reg = /^Label_(.*)#$/
      let isTaggingLayer = false
      if (currentLayer) {
        let layerType = LayerUtils.getLayerType(currentLayer)
        isTaggingLayer = layerType === 'TAGGINGLAYER'
        // && currentLayer.datasourceAlias.match(reg)
      }
      if (isTaggingLayer) {
        const datasourceAlias = currentLayer.datasourceAlias // 标注数据源名称
        const datasetName = currentLayer.datasetName // 标注图层名称
        let targetPath = await FileTools.appendingHomeDirectory(
          ConstPath.UserPath +
            this.props.user.currentUser.userName +
            '/' +
            ConstPath.RelativeFilePath.Media,
        )
        SMediaCollector.initMediaCollector(targetPath)

        let mediaName = this.results[this.checkedItem]?.Title // 目标类别
        let classifyTime = this.results[this.checkedItem]?.Time
        let mediaFileName = mediaName // 图片文件名字
        if (!mediaFileName) {
          const timeStr = new Date().getTime()
          mediaFileName = timeStr.toString()
          classifyTime = DateUtil.formatDate(timeStr, 'yyyy-MM-dd hh:mm:ss')
        }
        let imagePath = targetPath + mediaFileName + '.jpg'
        const mediaData = JSON.stringify({
          type: 'AI_CLASSIFY',
          mediaName: mediaFileName,
        })
        let result = await SMediaCollector.addAIClassifyMedia({
          layerName: currentLayer.name,
          datasourceName: datasourceAlias,
          datasetName: datasetName,
          mediaName: mediaFileName,
          mediaData: mediaData,
        })
        if (result) {
          // Toast.show(
          //   madiaName +
          //     ':' +
          //     getLanguage(this.props.language).Prompt.SAVE_SUCCESSFULLY,
          // )
          if (
            Platform.OS === 'android' &&
            imagePath.toLowerCase().indexOf('content://') !== 0
          ) {
            imagePath = 'file://' + imagePath
          }
          NavigationService.navigate('ClassifyResultEditView', {
            datasourceAlias,
            datasetName,
            imagePath,
            mediaName,
            classifyTime,
            cb: async () => {
              // NavigationService.goBack()
              // await this.clear()
              // await this.startPreview()
              //保存后回到地图
              // NavigationService.goBack()
              // NavigationService.goBack()
              this.clear()
              // GLOBAL.Toolbar?.switchAr()
            },
          })
        }
      } else {
        Toast.show(
          getLanguage(this.props.language).Prompt.PLEASE_SELECT_PLOT_LAYER,
        )
        this.props.navigation.navigate('LayerManager')
      }
    }.bind(this)())
  }

  /** 重置/切换模式 **/
  remake = () => {
    //安排任务在交互和动画完成之后执行
    InteractionManager.runAfterInteractions(() => {
      // 重置数据
    })
  }

  back = () => {
    NavigationService.goBack()
    this.props.setIsClassifyView(false)
    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(false)
    GLOBAL.toolBox.switchAr()
    return true
  }

  clear = async () => {
    this.setState({
      isClassifyInfoVisible: false,
      isCameraVisible: true,
    })
    this.startPreview()
    await SAIClassifyView.clearBitmap()
  }

  showClassifySettingsView = async () => {
    const datasourceAlias = 'currentLayer.datasourceAlias' // 标注数据源名称
    const datasetName = 'currentLayer.datasetName' // 标注图层名称
    NavigationService.navigate('ClassifySettingsView', {
      datasourceAlias,
      datasetName,
    })
  }

  openAlbum = () => {
    ImagePicker.AlbumListView.defaultProps.showDialog = false
    ImagePicker.AlbumListView.defaultProps.dialogConfirm = null
    ImagePicker.AlbumListView.defaultProps.assetType = 'Photos'
    ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'
    ImagePicker.getAlbum({
      maxSize: 1,
      callback: async data => {
        let mediaPaths = []
        if (data.length > 0) {
          data.forEach(item => {
            mediaPaths.push(item.uri)
          })
          let path =
            Platform.OS === 'ios'
              ? await SAIClassifyView.getImagePath(mediaPaths[0])
              : 'file://' + (await SAIClassifyView.getImagePath(mediaPaths[0]))
          this.setState(
            {
              isCameraVisible: false,
              bgImageSource: path,
            },
            () => {
              this.pausePreview()
            },
          )
        } else {
          Toast.show(
            getLanguage(GLOBAL.language).Map_Main_Menu
              .MAP_AR_AI_ASSISTANT_CLASSIFY_NOPICS,
          )
        }
      },
    })
  }

  RadioButtonOnChange = index => {
    if (index === 0) {
      this.FirstRB?.setChecked(true)
      this.SecondRB?.setChecked(false)
      this.ThridRB?.setChecked(false)
      this.FourthRB?.setChecked(false)
    } else if (index === 1) {
      this.FirstRB?.setChecked(false)
      this.SecondRB?.setChecked(true)
      this.ThridRB?.setChecked(false)
      this.FourthRB?.setChecked(false)
    } else if (index === 2) {
      this.FirstRB?.setChecked(false)
      this.SecondRB?.setChecked(false)
      this.ThridRB?.setChecked(true)
      this.FourthRB?.setChecked(false)
    } else if (index === 3) {
      this.FirstRB?.setChecked(false)
      this.SecondRB?.setChecked(false)
      this.ThridRB?.setChecked(false)
      this.FourthRB?.setChecked(true)
    }
    this.checkedItem = index
  }

  renderBottomBtns = () => {
    return (
      <View style={styles.buttonView}>
        {this.state.isClassifyInfoVisible && (
          <TouchableOpacity
            onPress={() => this.clear()}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().edit.icon_delete}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
        )}
        {this.state.isClassifyInfoVisible && (
          <TouchableOpacity
            onPress={() => this.save()}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().start.icon_save}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    )
  }

  renderAlbumBtn = () => {
    return (
      <ImageButton
        containerStyle={styles.albumBtn}
        iconStyle={styles.albumImgBtn}
        activeOpacity={0.8}
        icon={getThemeAssets().toolbar.icon_photo_picture}
        onPress={() => {
          this.openAlbum()
        }}
      />
    )
  }

  renderCenterBtn = () => {
    return (
      <ImageButton
        containerStyle={styles.capture}
        iconStyle={styles.cameraIcon}
        activeOpacity={0.8}
        icon={getThemeAssets().toolbar.icon_tool_photograph}
        onPress={() => {
          this.captureImage()
        }}
      />
    )
  }

  renderOverlayPreview = () => {
    return (
      <View style={styles.preview}>
        {<View style={styles.overlayPreviewLeft} />}
        {<View style={styles.overlayPreviewTop} />}
        {<View style={styles.overlayPreviewRight} />}
        {<View style={styles.overlayPreviewBottom} />}
        <View
          style={{
            position: 'absolute',
            left: scaleSize(60),
            top: scaleSize(145),
          }}
        >
          <View
            style={{
              height: 2,
              width: scaleSize(60),
              backgroundColor: '#37b44a',
            }}
          />
          <View
            style={{
              height: scaleSize(60),
              width: 2,
              backgroundColor: '#37b44a',
            }}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            right: scaleSize(61),
            top: scaleSize(144),
            transform: [{ rotate: '90deg' }],
          }}
        >
          <View
            style={{
              height: 2,
              width: scaleSize(60),
              backgroundColor: '#37b44a',
            }}
          />
          <View
            style={{
              height: scaleSize(60),
              width: 2,
              backgroundColor: '#37b44a',
            }}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            left: scaleSize(60),
            bottom: scaleSize(600),
          }}
        >
          <View
            style={{
              height: scaleSize(60),
              width: 2,
              backgroundColor: '#37b44a',
            }}
          />
          <View
            style={{
              height: 2,
              width: scaleSize(60),
              backgroundColor: '#37b44a',
            }}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            right: scaleSize(61),
            bottom: scaleSize(599),
            transform: [{ rotate: '-90deg' }],
          }}
        >
          <View
            style={{
              height: scaleSize(60),
              width: 2,
              backgroundColor: '#37b44a',
            }}
          />
          <View
            style={{
              height: 2,
              width: scaleSize(60),
              backgroundColor: '#37b44a',
            }}
          />
        </View>
      </View>
    )
  }

  renderClassifyTitle = () => {
    return (
      <View style={styles.classifyTitleView}>
        <View style={styles.takeplace} />
        <Text style={styles.title}>
          {
            getLanguage(GLOBAL.language).Map_Main_Menu
              .MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT
          }
        </Text>
        <Text style={styles.titleConfidence}>
          {
            getLanguage(GLOBAL.language).Map_Main_Menu
              .MAP_AR_AI_ASSISTANT_CLASSIFY_CONFIDENCE
          }
        </Text>
      </View>
    )
  }

  renderImgPickerView = () => {
    let show = this.state.bgImageSource && this.state.bgImageSource !== ''
    if (!show) return
    return (
      <View style={styles.newcontainer}>
        <Image
          style={styles.backImg}
          // resizeMode={'contain'}
          resizeMode={'cover'}
          source={{ uri: this.state.bgImageSource }}
        />
      </View>
    )
  }

  renderClassifyInfoView() {
    return (
      <View style={styles.InfoChangeView}>
        {this.renderClassifyTitle()}
        {this.state.isFirstShow && (
          <TouchableOpacity
            onPress={() => this.RadioButtonOnChange(0)}
            style={styles.classifyTitleView}
          >
            <RadioButton
              ref={ref => (this.FirstRB = ref)}
              onChange={() => {
                this.RadioButtonOnChange(0)
              }}
            />
            <Text style={styles.title}>{this.state.first_result}</Text>
            <Text style={styles.titleConfidence}>
              {this.state.first_result_confidence}
            </Text>
          </TouchableOpacity>
        )}
        {this.state.isSecondShow && (
          <TouchableOpacity
            onPress={() => this.RadioButtonOnChange(1)}
            style={styles.classifyTitleView}
          >
            <RadioButton
              ref={ref => (this.SecondRB = ref)}
              onChange={() => {
                this.RadioButtonOnChange(1)
              }}
            />
            <Text style={styles.title}>{this.state.second_result}</Text>
            <Text style={styles.titleConfidence}>
              {this.state.second_result_confidence}
            </Text>
          </TouchableOpacity>
        )}
        {this.state.isThirdShow && (
          <TouchableOpacity
            onPress={() => this.RadioButtonOnChange(2)}
            style={styles.classifyTitleView}
          >
            <RadioButton
              ref={ref => (this.ThridRB = ref)}
              onChange={() => {
                this.RadioButtonOnChange(2)
              }}
            />
            <Text style={styles.title}>{this.state.third_result}</Text>
            <Text style={styles.titleConfidence}>
              {this.state.third_result_confidence}
            </Text>
          </TouchableOpacity>
        )}
        {(
          <TouchableOpacity
            onPress={() => this.save(this.state.third_result)}
            style={styles.classifyTitleView}
          >
            <RadioButton
              ref={ref => (this.FourthRB = ref)}
              onChange={() => {
                this.RadioButtonOnChange(3)
              }}
            />
            <Text style={styles.title}>{getLanguage(GLOBAL.language).AI.ALL_WRONG}</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  renderCamera() {
    return (
      <RNCamera
        style={styles.cameraview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.auto}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      >
        {({ camera, status }) => {
          // recordAudioPermissionStatus
          if (status === 'READY') this.camera = camera
        }}
      </RNCamera>
    )
  }

  renderHeaderLeft = () => {
    return (
      <MTBtn
        key={'backTo'}
        image={getPublicAssets().common.icon_back}
        style={styles.headerBtn}
        imageStyle={styles.headerImgBtn}
        onPress={async() => {
          NavigationService.goBack()
          this.props.setIsClassifyView(false)
          GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(false)
          GLOBAL.toolBox.switchAr()
          return true
        }}
      />
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        headerProps={{
          type: 'floatNoTitle',
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_CLASSIFY,
          navigation: this.props.navigation,
          headerLeft: this.renderHeaderLeft(),
          headerRight: [
            <MTBtn
              key={'settings'}
              style={styles.headerBtn}
              image={getThemeAssets().toolbar.icon_toolbar_setting}
              imageStyle={styles.headerImgBtn}
              onPress={() => this.showClassifySettingsView()}
            />,
          ],
        }}
        bottomProps={{ type: 'fix' }}
      >
        {this.renderCamera()}
        {!this.state.isCameraVisible && this.renderImgPickerView()}
        {this.state.isCameraVisible && this.renderOverlayPreview()}
        {this.state.isClassifyInfoVisible && this.renderBottomBtns()}
        {!this.state.isClassifyInfoVisible && this.renderAlbumBtn()}
        {!this.state.isClassifyInfoVisible && this.renderCenterBtn()}
        {this.state.isClassifyInfoVisible && this.renderClassifyInfoView()}
        <Loading ref={ref => (this.Loading = ref)} initLoading={false} />
      </Container>
    )
  }
}
