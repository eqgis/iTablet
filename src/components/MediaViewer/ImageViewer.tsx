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
  horizontalOuterRangeOffset?: (offsetX: number) => void,
}

interface State {
  width: number,
  height: number,
}

export default class ImageViewer extends React.Component<Props, State> {

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
    }
  }

  _getContentSize = () => {
    Image.getSize(this.props.uri, (width, height) => {
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

  render() {
    return (
      <ImageZoom
        style={{ backgroundColor: 'black'}}
        cropWidth={screen.getScreenSafeWidth(this.props.orientation)}
        cropHeight={screen.getScreenSafeHeight(this.props.orientation)}
        imageWidth={this.state.width}
        imageHeight={this.state.height}
        enableSwipeDown
        enableCenterFocus={false}
        minScale={0.2}
        // maxScale={2}
        onSwipeDown={this._onClick}
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
