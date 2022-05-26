/**
 * 图片预览界面
 */
import * as React from 'react'
import { View, Image, LayoutChangeEvent } from 'react-native'
import PhotoView from 'react-native-image-zoom-viewer'
import styles from './styles'

interface Props {
  uri: string,
  containerStyle: any,
  backAction: () => void,
}

export default class ImageViewer extends React.Component<Props> {

  width = 0
  height = 0
  imageWidth = 200
  imageHeight = 200
  
  static defaultProps = {
    containerStyle: styles.container,
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      JSON.stringify(this.props) !== JSON.stringify(nextProps)
    )
  }

  handleLayout = (event: LayoutChangeEvent) => {
    let imageZoomShouldUpdate = false
    let imageShouldUpdate = false
    if (event.nativeEvent.layout.width !== this.width) {
      this.width = event.nativeEvent.layout.width
      this.height = event.nativeEvent.layout.height
      imageZoomShouldUpdate = true
    }
    Image.getSize(this.props.uri, (width, height) => {
      this.imageWidth = 200
      this.imageHeight = 200
      if (this.imageWidth !== width || this.imageHeight !== height) {
        imageShouldUpdate = true
        this.imageWidth = width
        this.imageHeight = height

        if (width > this.width || height > this.height) {
          let imgScale = this.imageHeight / this.imageWidth
          let imgViewScale = this.height / this.width

          if (imgScale > imgViewScale) {
            this.imageHeight = this.height
            this.imageWidth = this.height / imgScale
          } else {
            this.imageWidth = this.width
            this.imageHeight = this.width * imgScale
          }
        }
      }

      // 强制刷新
      (imageZoomShouldUpdate || imageShouldUpdate) && this.forceUpdate()
    })

    // this.forceUpdate()
  }

  render() {
    const images = [{
      url: this.props.uri,
    }]
    return (
      <PhotoView
        imageUrls={images}
        enableSwipeDown={true}
        saveToLocalByLongPress={false}
        onCancel={() => {
          if (typeof this.props.backAction === 'function') {
            this.props.backAction()
          }
        }}
        renderIndicator={() => <View />}
      />
    )
  }
}
