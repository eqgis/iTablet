/**
 * 相机界面
 */
import React, { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useMemo } from 'react'
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
import { AppToolBar, LayerUtils, screen } from '../../utils'
import { Progress, MediaViewer, ImagePicker } from '../../components'
import { Camera as RNCamera, CameraCaptureError, CameraDevice, PhotoFile, RecordVideoOptions, TakePhotoOptions, useCameraDevices, useFrameProcessor, VideoFile, CameraDeviceFormat } from 'react-native-vision-camera'
import { SMediaCollector } from 'imobile_for_reactnative'
import { getLanguage } from '../../language'
import { DBRConfig, decode, TextResult } from 'vision-camera-dynamsoft-barcode-reader'
import * as REA from 'react-native-reanimated'

import styles from './styles'
import ImageButton from '../../components/ImageButton'
import { MainStackScreenNavigationProps, MainStackScreenRouteProp } from '@/types'

import { connect, ConnectedProps } from 'react-redux'
import {
  setBackAction,
  removeBackAction,
} from '../../redux/models/backActions'
import { RootState } from '@/redux/types'
import { CAREMA_MEDIA_TYPE, CAREMA_RECORD_STATUS, RECORD_STATUS, TYPE } from './types'
import { LayerInfo } from 'imobile_for_reactnative/types/interface/mapping/SMap'
import TourAction from '../../../applets/langchaoDemo/src/mapFunctionModules/Langchao/TourAction'

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
  camera2: IRefProps | null | undefined
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
  qrCodeData?: TextResult[]
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
    this.props.navigation.removeListener('focus', this.cameraFocus)
    this.props.navigation.removeListener('blur', this.cameraBlur)
    Platform.OS === 'android' && BackHandler.removeEventListener('hardwareBackPress', this.back)
  }

  async componentDidMount() {
    const targetPath = await FileTools.appendingHomeDirectory(
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

    // 设置监听,相机进入后台,停止相机;相机进入前台,则打开相机
    this.props.navigation.addListener('focus', this.cameraFocus)
    this.props.navigation.addListener('blur', this.cameraBlur)
  }

  cameraFocus = () => {
    this.camera2?.setActive(true)
  }

  cameraBlur = () => {
    this.camera2?.setActive(false)
  }

  back = () => {
    if (this.cancelCb && typeof this.cancelCb === 'function') {
      this.cancelCb()
    }
    this.cameraBackHandler()
    return false
  }

  /** 停止相机,并返回,否则会导致AR摄像头卡顿 */
  cameraBackHandler = () => {
    this.camera2?.setActive(false)
    setTimeout(() => {
      NavigationService.goBack()
    }, 100)
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
      const data = await this.camera.takePhoto(options)
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
        __DEV__ && console.warn(error)
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

    const startTime = new Date().getTime()
    this.setState(
      {
        recordStatus: RECORD_STATUS.RECORDING,
      },
      () => {
        this.recordTimer = setInterval(() => {
          const currentTime = new Date().getTime()
          const progress = (currentTime - startTime) / 1000 / TIME_LIMIT
          if (this.mProgress) {
            this.mProgress.progress = progress
          }
        }, 1000)
      },
    )

    await this.camera.startRecording(options)

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
    if (global.layerSelection !== undefined) {
      this.ids = global.layerSelection.ids
    }
    // TODO 添加提示
    if (!this.datasourceAlias) return false
    let result = await SMediaCollector.addMedia({
      datasourceName: this.datasourceAlias,
      datasetName: this.datasetName,
      mediaPaths,
    }, !this.attribute, { index: this.index, selectionAttribute: this.selectionAttribute, ids: this.ids, layerAttribute: this.layerAttribute })

    if (await SMediaCollector.isTourLayer((this.props.currentLayer as LayerInfo).name) && !this.attribute) {
      result = await SMediaCollector.updateTour((this.props.currentLayer as LayerInfo).name)
    }
    {
      // langchao code
      const result = await LayerUtils.getLayerAttribute(
        {
          data: [],
          head: [],
        },
        "marker_322@langchao",
        0,
        30,
        {
          // filter: this.filter,
        },
        "refresh",
      )

      const layerAttributedataArray = result.attributes.data
      // const columnIndex = result.total !== 0 ? 0 : result.total
      const columnIndex = layerAttributedataArray.length - 1
      const layerAttributedata = layerAttributedataArray[columnIndex]

      let smID = 0
      let isUploadedIndex = 0

      const length = layerAttributedata.length
      for(let i = 0; i < length; i ++) {
        const item = layerAttributedata[i]
        if(item.name === "SmID") {
          smID = Number(item.value)
        } else if(item.name === "isUploaded") {
          isUploadedIndex = i
        }
      }

      const altData = [
        {
          mapName: "langchao",
          layerPath: "marker_322@langchao",
          fieldInfo: [
            {
              name: 'isUploaded',
              value: false,
              index: isUploadedIndex,
              columnIndex: columnIndex,
              smID: smID,
            },
          ],
          params: {
            // index: int,      // 当前对象所在记录集中的位置
            filter: `SmID=${smID}`, // 过滤条件
            cursorType: 2, // 2: DYNAMIC, 3: STATIC
          },
        },
      ]

      await AppToolBar.getProps().setLayerAttributes(altData)
      await TourAction.uploadDialog(smID, 'media')
    }
    if (this.atcb) {
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
    const sourcePath = this.state.data?.path.replace('file://', '')
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

    if (result) {
      this.cameraBackHandler()
    }
  }

  openAlbum = () => {
    ImagePicker.AlbumListView.defaultProps.showDialog = false
    ImagePicker.AlbumListView.defaultProps.dialogConfirm = null
    ImagePicker.AlbumListView.defaultProps.assetType = 'All'
    ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'
    ImagePicker.getAlbum({
      maxSize: this.limit,
      callback: async (data: { uri: string }[]) => {
        const mediaPaths: string[] = []
        if (data.length > 0) {
          data.forEach(item => {
            mediaPaths.push(item.uri)
          })
          if (this.cb && typeof this.cb === 'function') {
            this.cb({
              datasourceName: this.datasourceAlias,
              datasetName: this.datasetName,
              mediaPaths: mediaPaths,
            })
            this.cameraBackHandler()
          } else {
            const result = await this.addMedia(mediaPaths)
            result && this.cameraBackHandler()
          }
        }
      },
    })
  }

  changeType = (type: CAREMA_MEDIA_TYPE, cb = () => { }) => {
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
   * 读取二维码
   * @param {TextResult[]} event
   */
  _onBarCodeRead = (event: TextResult[]) => {
    if (this.state.type !== TYPE.BARCODE || this.state.recordStatus === RECORD_STATUS.RECORDED) {
      return
    }
    if (JSON.stringify(this.qrCodeData) === JSON.stringify(event)) {
      return
    }
    this.qrCodeData = event
    if (this.qrCb && typeof this.qrCb === 'function') {
      this.qrCb(event)
    }
  }

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
        <View style={[styles.buttonView, screen.isIphoneX() && {paddingBottom: styles.buttonView.bottom + screen.X_BOTTOM}]}>
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
        containerStyle={[styles.capture, screen.isIphoneX() && this.props.device.orientation.indexOf('PORTRAIT') >= 0 && {paddingBottom: styles.capture.bottom + screen.X_BOTTOM}]}
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
      <View style={[styles.changeView, screen.isIphoneX() && {paddingBottom: styles.changeView.bottom + screen.X_BOTTOM}]}>
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
      <View
        style={[
          styles.container,
          Platform.OS === 'android' && { flex: 1 },
          Platform.OS === 'ios' && {
            width: screen.getScreenSafeWidth(this.props.device.orientation),
            height: screen.getScreenSafeHeight(this.props.device.orientation),
          }]
        }
      >
        <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'black' }} />
        <MyCamera2
          {...this.props}
          ref={ref => this.camera2 = ref}
          getRef={ref => this.camera = ref}
          type={this.state.type}
          qrCb={this._onBarCodeRead}
        />
        {this.renderProgress()}

        <MediaViewer ref={ref => (this.mediaViewer = ref)} device={this.props.device} />
        {this.renderBottomBtns()}
        {this.renderCenterBtn()}
        {this.renderChangeBtns()}
      </View>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
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

interface MyCameraProps {
  getRef: React.LegacyRef<RNCamera> | undefined,
  type: CAREMA_MEDIA_TYPE,
  qrCb?: (params: TextResult[]) => void
}

interface IRefProps {
  setActive: (active: boolean) => void,
  getActive: () => boolean,
}

const MyCamera: ForwardRefRenderFunction<IRefProps, MyCameraProps> = (props, ref) => {
  // 获取可用多媒体设备
  const devices = useCameraDevices('wide-angle-camera')
  // 获取后置摄像头
  const device = devices.back
  const [isActive, setIsActive] = React.useState(true)

  useImperativeHandle(ref, () => ({
    setActive: async (active: boolean) => {
      setIsActive(active)
    },
    getActive: () => isActive,
  }))

  let frameProcessor = undefined
  if (props.type === TYPE.BARCODE) {
    // 帧处理
    frameProcessor = useFrameProcessor((frame) => {
      'worklet'
      const config: DBRConfig = {}
      config.template = "{\"ImageParameter\":{\"BarcodeFormatIds\":[\"BF_QR_CODE\"],\"Description\":\"\",\"Name\":\"Settings\"},\"Version\":\"3.0\"}" //scan qrcode only

      // 二维码解码
      const results: TextResult[] = decode(frame, config)
      if (props.qrCb && results.length > 0) {
        REA.runOnJS(props.qrCb)(results)
        // props.qrCb(results)
      }
    }, [])
  }

  function getMaxFps(format: CameraDeviceFormat): number {
    return format.frameRateRanges.reduce((prev, curr) => {
      if (curr.maxFrameRate > prev) return curr.maxFrameRate
      else return prev
    }, 0)
  }

  const format = useMemo(() => {
    return device?.formats.reduce((prev, curr) => {
      if (prev == null) return curr
      if (getMaxFps(curr) > getMaxFps(prev)) return curr
      else return prev
    }, undefined)
  }, [device?.formats])

  if (!device) return <View style={{ backgroundColor: 'black' }} />

  const _formart = Object.assign({}, format)

  const rate = _formart.photoHeight / props.device.height

  _formart.photoWidth = props.device.width * rate
  _formart.videoWidth = props.device.width * rate

  return (
    <RNCamera
      style={StyleSheet.absoluteFill}
      isActive={isActive}
      device={device}
      ref={props.getRef}
      photo={props.type === TYPE.PHOTO}
      video={props.type === TYPE.VIDEO}
      frameProcessor={props.type === TYPE.BARCODE ? frameProcessor : undefined}
      frameProcessorFps={1}
      format={_formart}
    />
  )
}

const MyCamera2 = forwardRef(MyCamera)
