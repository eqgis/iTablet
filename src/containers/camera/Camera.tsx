/**
 * 相机界面
 */
import * as React from 'react'
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  BackHandler,
  Platform,
  StyleSheet,
} from 'react-native'
import { ConstPath } from '../../constants'
import { FileTools } from '../../native'
import NavigationService from '../NavigationService'
import { getPublicAssets } from '../../assets'
import { Progress, MediaViewer, ImagePicker } from '../../components'
import { Camera as RNCamera, CameraCaptureError, CameraDevice, Frame, PhotoFile, RecordVideoOptions, TakePhotoOptions, useCameraDevices, useFrameProcessor, VideoFile } from 'react-native-vision-camera'
import { SMediaCollector,SMap  } from 'imobile_for_reactnative'
import { getLanguage } from '../../language'

import styles from './styles'
import ImageButton from '../../components/ImageButton'
import { MainStackScreenNavigationProps, MainStackScreenRouteProp } from '@/types'

import { connect, ConnectedProps } from 'react-redux'
import {
  setBackAction,
  removeBackAction,
} from '../../redux/models/backActions'
import { RooteState } from '@/redux/types'
import { CAREMA_MEDIA_TYPE, CAREMA_RECORD_STATUS, RECORD_STATUS, TYPE } from './types'
import { LayerInfo } from 'imobile_for_reactnative/types/interface/mapping/SMap'

const TIME_LIMIT = 60

interface Props extends ReduxProps {
  navigation: MainStackScreenNavigationProps<'Camera'>,
  route: MainStackScreenRouteProp<'Camera'>,
}

interface State {
  data: PhotoFile | VideoFile | null,
  videoPaused: true, // 视频是否暂停
  showVideoController: false, // 视频控制器是否显示
  type: CAREMA_MEDIA_TYPE,
  recordStatus: CAREMA_RECORD_STATUS, // 拍摄状态
  device: CameraDevice | undefined,
}

class Camera extends React.Component<Props, State> {
  datasourceAlias = ''
  datasetName = 'MediaDataset'
  limit = 9
  cb: ((params: {
    datasourceName: string,
    datasetName: string,
    mediaPaths: string[],
  }) => void) | null | undefined = null
  cancelCb: (() => void) | null | undefined = null
  camera: RNCamera | null | undefined
  index = 0
  attribute = false
  atcb: ((params: {
    datasourceName: string,
    datasetName: string,
    mediaPaths: string[],
  }) => void) | null | undefined = null
  selectionAttribute = false
  ids: number[] = []
  layerAttribute = false
  qrCb: ((params: unknown) => void) | null | undefined = null // 二维码/条形码 回调
  qrCodeData?: {
    data: string,
    rawData?: string,
  }
  recordTimer: NodeJS.Timer | null | undefined
  mProgress: Progress | null | undefined
  mediaViewer: MediaViewer | null | undefined

  constructor(props: Props) {
    super(props)
    const { params } = this.props.route || {}
    this.datasourceAlias = params.datasourceAlias || ''
    this.datasetName = params.datasetName || 'MediaDataset'
    this.limit = params.limit !== undefined && params.limit >= 0 ? params.limit : 9
    this.cb = params.cb
    this.cancelCb = params.cancelCb
    this.camera = null
    this.index = params.index || 0
    this.attribute = params.attribute || false
    this.atcb = params.atcb
    this.selectionAttribute = params.selectionAttribute || false
    this.ids = []
    this.layerAttribute = params.layerAttribute || false
    this.qrCb = params.qrCb // 二维码/条形码 回调

    this.state = {
      data: null,
      videoPaused: true, // 视频是否暂停
      showVideoController: false, // 视频控制器是否显示
      type: params?.type || TYPE.PHOTO,
      recordStatus: RECORD_STATUS.UN_RECORD, // 拍摄状态
      device: undefined,
    }

    // this.qrCodeData = null
  }

  componentWillUnmount() {
    if (this.recordTimer) {
      clearInterval(this.recordTimer)
      this.recordTimer = null
    }
    Platform.OS === 'android' && BackHandler.removeEventListener('hardwareBackPress', this.back)
  }

  async componentDidMount() {
    let targetPath = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath +
        this.props.user.currentUser.userName +
        '/' +
        ConstPath.RelativeFilePath.Media,
    )
    
    const devices = await RNCamera.getAvailableCameraDevices()
    const sorted = devices.sort()
    const device = sorted.find((d) => d.position === "back")
    this.setState({
      device: device,
    })
    SMediaCollector.initMediaCollector(targetPath)
    Platform.OS === 'android' &&
      BackHandler.addEventListener('hardwareBackPress', this.back)
  }

  back = () => {
    if (this.cancelCb && typeof this.cancelCb === 'function') {
      this.cancelCb()
    }
    NavigationService.goBack('Camera')
    return false
  }

  /** 照相 **/
  takePicture = async () => {
    try {
      if (
        !this.camera ||
        this.state.type !== TYPE.PHOTO ||
        this.state.recordStatus === RECORD_STATUS.RECORDING
      ) {
        return
      }
      this.setState({
        recordStatus: RECORD_STATUS.RECORDING,
      })
      const options: TakePhotoOptions = { qualityPrioritization: 'balanced' }
      // let data = await this.camera.takePictureAsync(options)
      let data = await this.camera.takePhoto(options)
      if (data.path.indexOf('file://') !== 0) {
        data.path = 'file://' + data.path
      }
      this.setState({
        data,
        recordStatus: RECORD_STATUS.RECORDED,
      })
      this.mediaViewer && this.mediaViewer.setVisible(true, data.path)
    } catch (e) {
      console.warn(e)
      this.mediaViewer && this.mediaViewer.setVisible(true)
    }
  }

  /** 开始录制视频 **/
  recordAsync = async () => {
    if (
      !this.camera ||
      this.state.type !== TYPE.VIDEO ||
      this.state.recordStatus === RECORD_STATUS.RECORDING
    )
      return
    const options: RecordVideoOptions = {
      onRecordingError: (error: CameraCaptureError) => {

      },
      onRecordingFinished: (data: VideoFile) => {
        if (this.recordTimer) {
          clearInterval(this.recordTimer)
          this.recordTimer = null
        }
        if (this.mProgress) {
          this.mProgress.progress = 0
        }
        this.setState({
          data,
          recordStatus: RECORD_STATUS.RECORDED,
        })
        this.mediaViewer && this.mediaViewer.setVisible(true, data.path)
      }
    }

    let startTime = new Date().getTime()
    this.setState(
      {
        recordStatus: RECORD_STATUS.RECORDING,
      },
      () => {
        this.recordTimer = setInterval(() => {
          let currentTime = new Date().getTime()
          let progress = (currentTime - startTime) / 1000 / TIME_LIMIT
          if (this.mProgress) {
            this.mProgress.progress = progress
          }
        }, 1000)
      },
    )

    let data = await this.camera.startRecording(options)

    
  }

  /** 结束录制视频 **/
  stopRecording = async () => {
    if (
      (!this.camera && this.state.type === TYPE.VIDEO) ||
      this.state.recordStatus !== RECORD_STATUS.RECORDING
    )
      return
    this.camera && this.camera.stopRecording()
  }

  /** 重拍 **/
  remake = () => {
    // InteractionManager.runAfterInteractions(() => {
    // 重置数据
    // this.state.type === TYPE.PHOTO &&
    //   this.camera &&
    //   this.camera.resumePreview()
    this.setState({
      data: null,
      recordStatus: RECORD_STATUS.UN_RECORD,
    })
    this.mediaViewer && this.mediaViewer.setVisible(false)
    // })
  }

  addMedia = async (mediaPaths: string[] = []) => {
    if(global.layerSelection !== undefined){
      this.ids = global.layerSelection.ids
    }
    // TODO 添加提示
    if (!this.datasourceAlias) return false
    let result = await SMediaCollector.addMedia({
      datasourceName: this.datasourceAlias,
      datasetName: this.datasetName,
      mediaPaths,
    }, !this.attribute, { index: this.index, selectionAttribute: this.selectionAttribute, ids: this.ids ,layerAttribute:this.layerAttribute})
    
    if (await SMediaCollector.isTourLayer((this.props.currentLayer as LayerInfo).name)&&!this.attribute) {
      result = await SMediaCollector.updateTour((this.props.currentLayer as LayerInfo).name)
    }
    if(this.atcb){
      this.atcb({
        datasourceName: this.datasourceAlias,
        datasetName: this.datasetName,
        mediaPaths,
      })
    }
    return result
  }

  /** 确认 **/
  confirm = async () => {
    let sourcePath = this.state.data?.path.replace('file://', '')
    if (!sourcePath) return
    let result = false
    if (this.cb && typeof this.cb === 'function') {
      result = true
      this.cb({
        datasourceName: this.datasourceAlias,
        datasetName: this.datasetName,
        mediaPaths: [sourcePath],
      })
    } else {
      result = await this.addMedia([sourcePath])
    }

    // this.state.type === TYPE.PHOTO &&
    //   this.camera &&
    //   this.camera.resumePreview()
    if (result) {
      // this.setState({
      //   recordStatus: RECORD_STATUS.RECORDED,
      // })
      NavigationService.goBack()
    }
  }

  openAlbum = () => {
    ImagePicker.AlbumListView.defaultProps.showDialog = false
    ImagePicker.AlbumListView.defaultProps.dialogConfirm = null
    ImagePicker.AlbumListView.defaultProps.assetType = 'All'
    ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'
    ImagePicker.getAlbum({
      maxSize: this.limit,
      callback: async (data: {uri: string}[]) => {
        let mediaPaths: string[] = []
        if (data.length > 0) {
          data.forEach(item => {
            // mediaPaths.push(item.uri.replace(Platform.OS === 'ios' ? 'assets-library://' : 'contents://', ''))
            mediaPaths.push(item.uri)
          })
          if (this.cb && typeof this.cb === 'function') {
            this.cb({
              datasourceName: this.datasourceAlias,
              datasetName: this.datasetName,
              mediaPaths: mediaPaths,
            })
            NavigationService.goBack()
          } else {
            let result = await this.addMedia(mediaPaths)
            result && NavigationService.goBack()
          }
        }
      },
    })
  }

  changeType = (type: CAREMA_MEDIA_TYPE, cb = () => {}) => {
    if (!type || type === this.state.type) return

    if (this.state.type === TYPE.VIDEO) {
      this.state.recordStatus === RECORD_STATUS.RECORDING &&
        this.stopRecording()
    }

    this.setState(
      {
        data: null,
        recordStatus: RECORD_STATUS.UN_RECORD,
        videoPaused: true,
        type,
      },
      () => {
        cb && cb()
      },
    )
  }

  /**
   * 
   * @param {*} event {
        data: string;
        rawData?: string;
        type: keyof BarCodeType;
        // @description For Android use `[Point<string>, Point<string>]`
        // @description For iOS use `{ origin: Point<string>, size: Size<string> }`
        bounds: [Point<string>, Point<string>] | { origin: Point<string>; size: Size<string> };
      }
   */
  // _onBarCodeRead = event => {
    // if (this.state.type !== TYPE.BARCODE || this.state.recordStatus === RECORD_STATUS.RECORDED) {
    //   return
    // }
    // if (this.qrCodeData?.data === event.data && this.qrCodeData?.rawData === event.rawData) {
    //   return
    // }
    // this.qrCodeData = event
    // if (this.qrCb && typeof this.qrCb === 'function') {
    //   this.qrCb(event)
    // }
  // }
  
  renderProgress = () => {
    if (
      !(
        this.state.type === TYPE.VIDEO &&
        (!this.state.videoPaused ||
          this.state.recordStatus === RECORD_STATUS.RECORDING)
      )
    )
      return null

    return (
      <Progress
        ref={ref => (this.mProgress = ref)}
        style={styles.progressView}
        progressAniDuration={0}
        progressColor={'#rgba(123, 183, 54, 0.5)'}
      />
    )
  }

  renderBottomBtns = () => {
    if (this.state.recordStatus === RECORD_STATUS.RECORDING) return null
    if (this.state.recordStatus === RECORD_STATUS.RECORDED) {
      return (
        <View style={styles.buttonView}>
          <TouchableOpacity
            onPress={() => this.remake()}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              source={getPublicAssets().common.icon_rephotograph}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.confirm()}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              source={getPublicAssets().common.icon_confirm}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View style={styles.buttonView}>
          <TouchableOpacity
            onPress={this.back}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              source={getPublicAssets().common.icon_back_white}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
          {
            this.state.type === TYPE.BARCODE
              ? <View style={styles.iconView} />
              : (
                <TouchableOpacity
                  onPress={() => this.openAlbum()}
                  style={styles.iconView}
                >
                  <Image
                    resizeMode={'contain'}
                    source={getPublicAssets().common.icon_album}
                    style={styles.smallIcon}
                  />
                </TouchableOpacity>
              )
          }
        </View>
      )
    }
  }

  renderCenterBtn = () => {
    // 照片/视频拍摄完成不显示此按钮
    if (this.state.type === TYPE.BARCODE || this.state.recordStatus === RECORD_STATUS.RECORDED) return null
    return (
      <ImageButton
        containerStyle={styles.capture}
        iconStyle={styles.iconView}
        icon={getPublicAssets().common.icon_take_camera}
        onPress={() => {
          if (this.state.type === TYPE.VIDEO) {
            if (this.state.recordStatus === RECORD_STATUS.RECORDING) {
              this.stopRecording()
            } else {
              this.recordAsync()
            }
          } else {
            this.takePicture()
          }
        }}
      />
    )
  }

  renderChangeBtns = () => {
    if (this.state.type === TYPE.BARCODE || this.state.recordStatus !== RECORD_STATUS.UN_RECORD) return null
    return (
      <View style={styles.changeView}>
        <TouchableOpacity
          onPress={() => this.changeType(TYPE.VIDEO)}
          style={styles.typeBtn}
        >
          <Text
            style={
              this.state.type === TYPE.VIDEO
                ? styles.typeTextSelected
                : styles.typeText
            }
          >
            {getLanguage(this.props.language as string).Map_Tools.VIDEO}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.changeType(TYPE.PHOTO)}
          style={styles.typeBtn}
        >
          <Text
            style={
              this.state.type === TYPE.PHOTO
                ? styles.typeTextSelected
                : styles.typeText
            }
          >
            {getLanguage(this.props.language as string).Map_Tools.PHOTO}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'black'}} />
        <MyCamera
          {...this.props}
          getRef={(ref: RNCamera | undefined) => this.camera = ref}
          type={this.state.type}
        />
        {this.renderProgress()}

        <MediaViewer ref={ref => (this.mediaViewer = ref)} />
        {this.renderBottomBtns()}
        {this.renderCenterBtn()}
        {this.renderChangeBtns()}
      </View>
    )
  }
}

const mapStateToProps = (state: RooteState) => ({
  nav: state.nav.toJS(),
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  currentLayer: state.layers.toJS().currentLayer,
})

const connector = connect(
  mapStateToProps,
  [
    setBackAction,
    removeBackAction,
  ],
)

type ReduxProps = ConnectedProps<typeof connector>

export default connector(Camera)

function MyCamera(props) {
  const devices = useCameraDevices('wide-angle-camera')
  const device = devices.back
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'
    // const isHotdog = detectIsHotdog(frame)
    // TODO QRCode
  }, [])
  if (!device) return <View style={{backgroundColor: 'yellow'}} />

  return (
    <RNCamera
      style={StyleSheet.absoluteFill}
      isActive
      device={device}
      ref={props.getRef}
      photo={props.type === TYPE.PHOTO}
      video={props.type === TYPE.VIDEO}
      // frameProcessor={props.type === TYPE.BARCODE ? frameProcessor : undefined}
    />
  )
}