import * as React from 'react'
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import { scaleSize, screen } from '../../../../utils'
import { getLanguage } from '../../../../language/index'
import RootSiblings from 'react-native-root-siblings'

let elements = [], imageViewer
function show(urls = []) {
  let sibling = new RootSiblings()
  sibling.update(
    <ChatImageViewer
      ref={ref => (imageViewer = ref)}
      receivePicture={this.receivePicture}
      imageUrls={urls}
    />
  )
  elements.push({sibling, imageViewer})
}

function hide () {
  let { sibling } = elements.pop()
  sibling && sibling.destroy()
  sibling = null
}

function isShow() {
  return elements.length > 0
}

class ChatImageViewer extends React.Component {
  props: {
    receivePicture: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      imageUrls: props.imageUrls || [],
      visible: false,
      showCover: true,
    }
    this.screenWidth = Dimensions.get('window').width
  }

  setVisible = visible => {
    if (visible !== this.state.visible) {
      this.setState({ visible })
    }
  }

  close = () => {
    this.setVisible(false)
    this.setState({ showCover: true })
  }

  receivePicture = () => {
    if (this.message && !this.message.originMsg.message.message.filePath) {
      this.props.receivePicture && this.props.receivePicture(this.message)
    }
  }

  renderCover = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ showCover: !this.state.showCover })
        }}
        style={styles.coverView}
      >
        {this.renderHeader()}
        {this.renderFooter()}
      </TouchableOpacity>
    )
  }

  renderHeader = () => {
    return (
      <TouchableOpacity
        style={[styles.headerStyle, {
          top: screen.isIphoneX() && GLOBAL.getDevice().orientation.indexOf('PORTRAIT') >= 0
            ? screen.X_TOP
            : 0,
        }]}
        onPress={hide}
      >
        <Image
          source={require('../../../../assets/public/Frenchgrey/icon-back-white.png')}
          style={styles.image}
        />
      </TouchableOpacity>
    )
  }

  renderFooter = () => {
    if (this.message && !this.message.originMsg.message.message.filePath) {
      let fileSize = this.message.originMsg.message.message.fileSize
      let fileSizeText = fileSize.toFixed(2) + 'B'
      if (fileSize > 1024) {
        fileSize = fileSize / 1024
        fileSizeText = fileSize.toFixed(2) + 'KB'
      }
      if (fileSize > 1024) {
        fileSize = fileSize / 1024
        fileSizeText = fileSize.toFixed(2) + 'MB'
      }
      return (
        <TouchableOpacity
          onPress={this.receivePicture}
          style={styles.bottomMenuStyle}
        >
          <Text style={styles.text}>
            {getLanguage(GLOBAL.language).Friends.LOAD_ORIGIN_PIC +
              '(' +
              fileSizeText +
              ')'}
          </Text>
        </TouchableOpacity>
      )
    } else {
      return null
    }
  }

  render() {
    this.screenWidth = Dimensions.get('window').width
    return (
      <View
        style={{
          position: 'absolute',
          backgroundColor: 'black',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          flex: 1,
        }}
      >
        <ImageViewer
          ref={ref => (this.ImageViewer = ref)}
          imageUrls={this.props.imageUrls}
          saveToLocalByLongPress={false}
          style={styles.coverView}
          onClick={() => {
            this.setState({ showCover: !this.state.showCover })
          }}
        />
        {this.state.showCover && this.renderCover()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  coverView: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  headerStyle: {
    position: 'absolute',
    // top: 0,
    height: scaleSize(100),
    width: scaleSize(100),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  bottomMenuStyle: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    height: scaleSize(50),
    borderRadius: scaleSize(10),
    justifyContent: 'center',
    alignItems: 'center',
    padding: scaleSize(10),
  },
  text: {
    fontSize: scaleSize(24),
    color: 'black',
  },
  image: {
    width: scaleSize(60),
    height: scaleSize(60),
  },
})

export default {
  show,
  hide,
  isShow,
}
