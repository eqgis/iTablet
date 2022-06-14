/**
 * 多媒体预览界面
 */
import * as React from 'react'
import { View, Modal, Platform } from 'react-native'
import { checkType, screen } from '../../utils'
import { Swiper } from '../../components'
// import Swiper from 'react-native-swiper'
import styles from './styles'
import VideoViewer from './VideoViewer'
import ImageViewer from './ImageViewer'
import { DEVICE } from '@/redux/models/device'

interface Props {
  data: {uri: string}[],
  isModal: boolean,
  withBackBtn: boolean,
  backHide?: boolean,
  defaultIndex: number,
  device: DEVICE,
  onVisibleChange?: (visible: boolean) => void,
}

interface State {
  defaultIndex: number,
  visible: boolean,
}

export default class MediaPager extends React.Component<Props, State> {

  dataRef: (VideoViewer | ImageViewer | null)[] = []
  swiper: Swiper | undefined | null

  static defaultProps = {
    isModal: false,
    withBackBtn: false,
    defaultIndex: 0,
    data: [],
    backHide: true,
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      defaultIndex: props.defaultIndex,
      visible: false,
    }
    this.dataRef = []
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const shouldUpdate =
      JSON.stringify(this.props) !== JSON.stringify(nextProps) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
    if (shouldUpdate) this.dataRef = []
    return shouldUpdate
  }

  setVisible = (visible = !this.state.visible, index = 0) => {
    const newState = {
      defaultIndex: this.state.defaultIndex,
      visible: this.state.visible,
    }
    if (visible !== this.state.visible) {
      newState.visible = visible
    }
    if (index !== this.state.defaultIndex) {
      newState.defaultIndex = index
    }
    if (Object.keys(newState).length > 0) {
      this.setState(newState, () => {
        visible && this.forceUpdate()
      })
    }
    this.index = index
    this.props.onVisibleChange && this.props.onVisibleChange(visible)
  }

  getData = () => {
    const data = []
    this.dataRef = []
    for (let i = 0; i < this.props.data.length; i++) {
      const item = this.props.data[i]
      const type = checkType.getMediaTypeByPath(item.uri)
      let uri = item.uri
      if (
        Platform.OS === 'android' &&
        uri.toLowerCase().indexOf('content://') !== 0
      ) {
        uri = 'file://' + uri
      }
      if (type === 'video') {
        data.push(
          <VideoViewer
            ref={ref => (this.dataRef[i] = ref)}
            key={uri}
            uri={uri}
            withBackBtn={this.props.withBackBtn}
            backAction={() => this.setVisible(false)}
          />,
        )
      } else {
        data.push(
          <ImageViewer
            ref={ref => (this.dataRef[i] = ref)}
            key={uri}
            uri={uri}
            // containerStyle={this.props.containerStyle}
            onClick={() => this.setVisible(false)}
            orientation={this.props.device.orientation}
          />,
        )
      }
    }
    return data
  }

  renderScrollView = () => {
    return (
      <Swiper
        index={this.state.defaultIndex}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
        orientation={this.props.device.orientation}
        onScrollBegin={(e, state) => {
          let index = state.index
          if (index < 0) index = 0
          else if (index > this.props.data.length - 1) index = this.props.data.length - 1
          const type = checkType.getMediaTypeByPath(
            this.props.data[index].uri,
          )
          const currentView = this.dataRef[index]
          if (type === 'video' && currentView instanceof VideoViewer) {
            currentView.pause()
          }
        }}
      >
        {this.getData()}
      </Swiper>
    )
  }

  renderContent = () => {
    return (
      <View
        style={{
          flex: 1,
          paddingTop:
            screen.isIphoneX() &&
              this.props.device.orientation.indexOf('PORTRAIT') >= 0
              ? screen.X_TOP
              : 0,
          paddingBottom: screen.getIphonePaddingBottom(),
          ...screen.getIphonePaddingHorizontal(
            this.props.device.orientation,
          ),
        }}
      >
        {this.renderScrollView()}
        {/* <Swiper
          ref={ref => this.swiper = ref}
          // width={screen.getScreenSafeWidth(this.props.device.orientation)}
          // height={screen.getScreenSafeHeight(this.props.device.orientation)}
          width={this.state.swiperWdith}
          height={this.state.swiperHeight}
          onScrollBeginDrag={(e, state, context) => {
            let index = state.index
            if (index < 0) index = 0
            else if (index > this.props.data.length - 1) index = this.props.data.length - 1
            this.index = index
            const type = checkType.getMediaTypeByPath(
              this.props.data[index].uri,
            )
            const currentView = this.dataRef[index]
            if (type === 'video' && currentView instanceof VideoViewer) {
              currentView.pause()
            }
          }}
          pagingEnabled
          scrollEnabled={false}
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}
          index={this.state.defaultIndex}
          loop={false}
        >
          {this.getData()}
        </Swiper> */}
      </View>
    )
  }

  render() {
    if (this.props.data.length === 0 || !this.state.visible) return null
    if (this.props.isModal) {
      return (
        <Modal
          visible={this.state.visible}
          transparent={true}
          onRequestClose={() => {
            //点击物理按键需要隐藏对话框
            if (this.props.backHide) {
              this.setVisible(false)
            }
          }}
          supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
        >
          {this.renderContent()}
        </Modal>
      )
    }
    return this.renderContent()
  }
}
