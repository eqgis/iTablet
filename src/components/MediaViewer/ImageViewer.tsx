/**
 * 图片预览界面
 */
import * as React from 'react'
import { Image } from 'react-native'
// import PhotoView from 'react-native-image-zoom-viewer'
import styles from './styles'
import ImageZoom from 'react-native-image-pan-zoom'
import { screen } from '@/utils'

interface Props {
  uri: string,
  containerStyle: any,
  orientation: string,
  maxOverflow: number,
  onClick?: () => void,
  onSwipeDown?: () => void,
  horizontalOuterRangeOffset?: (offsetX: number) => void,
}

interface State {
  width: number,
  height: number,
}

export default class ImageViewer extends React.Component<Props, State> {

  imageZoom: ImageZoom | null | undefined
  width = 0
  height = 0
  imageWidth = 0
  imageHeight = 0

  static defaultProps = {
    containerStyle: styles.container,
    maxOverflow: 200,
  }

  constructor(props: Props) {
    super(props)
    this.width = screen.getScreenSafeWidth(this.props.orientation)
    this.height = screen.getScreenSafeHeight(this.props.orientation)
    this.state = {
      width: this.width,
      height: this.height,
    }
  }

  componentDidMount() {
    this._getContentSize()
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.orientation !== prevProps.orientation) {
      this._getContentSize()
      this.reset()
    }
  }

  _getContentSize = () => {
    Image.getSize(this.props.uri, (width, height) => {
      this.width = screen.getScreenSafeWidth(this.props.orientation)
      this.height = screen.getScreenSafeHeight(this.props.orientation)
      this.imageWidth = 200
      this.imageHeight = 200
      if (this.imageWidth !== width || this.imageHeight !== height) {
        this.imageWidth = width
        this.imageHeight = height

        if (width > this.width || height > this.height) {
          const imgScale = this.imageHeight / this.imageWidth
          const imgViewScale = this.height / this.width

          if (imgScale > imgViewScale) {
            this.imageHeight = this.height
            this.imageWidth = this.height / imgScale
          } else {
            this.imageWidth = this.width
            this.imageHeight = this.width * imgScale
          }
        }
      }

      if (this.state.width !== this.imageWidth || this.state.height !== this.imageHeight) {
        this.setState({
          width: this.imageWidth,
          height: this.imageHeight,
        })
      }

      // 强制刷新
      // (imageZoomShouldUpdate || imageShouldUpdate) && this.forceUpdate()
    })
  }

  _handleLayout = () => {
    this._getContentSize()
  }

  _onClick = () => {
    this.props.onClick?.()
  }

  _onSwipeDown = () => {
    this.props.onSwipeDown?.()
  }

  /**
   * 重置图片大小
   */
  reset = () => {
    this.imageZoom?.reset()
  }

  render() {
    return (
      <ImageZoom
        ref={ref => this.imageZoom = ref}
        style={{ backgroundColor: 'black', flex: 1 }}
        cropWidth={screen.getScreenWidth(this.props.orientation)}
        cropHeight={screen.getScreenHeight(this.props.orientation)}
        imageWidth={this.state.width}
        imageHeight={this.state.height}
        enableCenterFocus={false}
        minScale={0.2}
        // maxScale={2}
        enableSwipeDown={!!this.props.onSwipeDown}
        onSwipeDown={this._onSwipeDown}
        onClick={this._onClick}
        // onDoubleClick={this.reset}
        maxOverflow={this.props.maxOverflow || 200}
        horizontalOuterRangeOffset={(offsetX) => {
          this.props.horizontalOuterRangeOffset?.(offsetX)
        }}
      >
        <Image style={{width:this.state.width, height:this.state.height}} source={{uri: this.props.uri}}/>
      </ImageZoom>
    )
  }
}
