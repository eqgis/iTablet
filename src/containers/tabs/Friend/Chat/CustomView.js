import PropTypes from 'prop-types'
import React from 'react'
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ViewPropTypes,
  Text,
  View,
  Platform,
} from 'react-native'
import { scaleSize } from '../../../../utils/screen'
import MSGConstant from '../../../../constants/MsgConstant'
import CoworkInviteView from '../Cowork/CoworkInviteView'
import { getLanguage } from '../../../../language'

export default class CustomView extends React.Component {
  props: {
    user: Object,
    currentMessage: any,
    position: '',
    onTouch: () => {},
  }

  touchCallback = (type, message) => {
    this.props.onTouch(type, message)
  }

  renderUnsupported = () => {
    let textColor = 'white'
    if (this.props.position === 'left') {
      textColor = 'black'
    }
    return (
      <Text
        style={{
          textAlign: 'center',
          fontSize: scaleSize(20),
          color: textColor,
          padding: scaleSize(10),
        }}
      >
        {getLanguage().Friends.UNSUPPORTED_MESSAGE}
      </Text>
    )
  }

  render() {
    let type = this.props.currentMessage.type
    /*
     * 文本消息，不渲染customview
     */
    if (type === MSGConstant.MSG_TEXT) {
      return null
    }
    /**
     * 图片
     */
    if (type === MSGConstant.MSG_PICTURE) {
      let homePath = GLOBAL.homePath
      let uri = this.props.currentMessage.originMsg.message.message.filePath
      if (uri !== undefined && uri !== '') {
        if (Platform.OS === 'android') {
          if (uri.indexOf('content://') === -1) {
            uri = 'file://' + homePath + uri
          }
        } else {
          if (uri.indexOf('assets-library://') === -1) {
            uri = homePath + uri
          }
        }
      } else {
        let imgdata = this.props.currentMessage.originMsg.message.message
          .imgdata
        if (imgdata !== undefined) {
          uri = `data:image/png;base64,${imgdata}`
        }
      }
      return (
        <TouchableOpacity
          onPress={() => {
            this.touchCallback(type, this.props.currentMessage)
          }}
        >
          <Image
            source={{ uri: uri }}
            style={{
              width: scaleSize(300),
              height: scaleSize(300),
            }}
          />
        </TouchableOpacity>
      )
    }
    /*
     * 文件下载通知消息，包括图层，数据集等
     */
    if (
      type === MSGConstant.MSG_MAP ||
      type === MSGConstant.MSG_AREFFECT ||
      (type === MSGConstant.MSG_ARMODAL && Platform.OS=== 'android')||
      type === MSGConstant.MSG_ARMAP ||
      type === MSGConstant.MSG_DATASOURCE ||
      type === MSGConstant.MSG_SYMBOL ||
      type === MSGConstant.MSG_COLORSCHEME ||
      type === MSGConstant.MSG_AI_MODEL ||
      type === MSGConstant.MSG_TEMPLATE_PLOT ||
      type === MSGConstant.MSG_TEMPLATE_MAP
      // ||
      // type === MSGConstant.MSG_LAYER ||
      // type === MSGConstant.MSG_DATASET
    ) {
      let fileSize = this.props.currentMessage.originMsg.message.message
        .fileSize
      let fileSizeText = ''
      if (fileSize === undefined) {
        return this.renderUnsupported()
      }
      fileSizeText = fileSize.toFixed(2) + 'B'
      if (fileSize > 1024) {
        fileSize = fileSize / 1024
        fileSizeText = fileSize.toFixed(2) + 'KB'
      }
      if (fileSize > 1024) {
        fileSize = fileSize / 1024
        fileSizeText = fileSize.toFixed(2) + 'MB'
      }
      let typeText = ''
      switch (type) {
        case MSGConstant.MSG_MAP:
          typeText = 'Map'
          break
        case MSGConstant.MSG_LAYER:
          typeText = 'Layer'
          break
        case MSGConstant.MSG_DATASET:
          typeText = 'Dataset'
          break
        case MSGConstant.MSG_ARMAP:
          typeText = 'AR Map'
          break
        case MSGConstant.MSG_AREFFECT:
          typeText = 'AR Effect'
          break
        case MSGConstant.MSG_ARMODAL:
          typeText = 'AR Modal'
          break
        case MSGConstant.MSG_DATASOURCE:
          typeText = 'Datasouce'
          break
        case MSGConstant.MSG_SYMBOL:
          typeText = 'Symbol'
          break
        case MSGConstant.MSG_COLORSCHEME:
          typeText = 'Color Scheme'
          break
        case MSGConstant.MSG_AI_MODEL:
          typeText = 'AI Model'
          break
        case MSGConstant.MSG_TEMPLATE_PLOT:
          typeText = 'Plot Template'
          break
        case MSGConstant.MSG_TEMPLATE_MAP:
          typeText = 'Map Template'
          break
      }
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            this.touchCallback(type, this.props.currentMessage)
          }}
        >
          <View
            style={
              this.props.currentMessage.user._id !== this.props.user._id
                ? [styles.fileContainer, styles.fileContainerLeft]
                : [styles.fileContainer, styles.fileContainerRight]
            }
          >
            <Text
              style={
                this.props.position === 'left'
                  ? styles.fileName
                  : [styles.fileName, { color: 'white' }]
              }
            >
              {this.props.currentMessage.originMsg.message.message.fileName}
            </Text>
            <Text
              style={
                this.props.position === 'left'
                  ? styles.fileSize
                  : [styles.fileSize, { color: 'white' }]
              }
            >
              {typeText + '  ' + fileSizeText}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      )
    }
    /*
     * 定位消息
     */
    if (type === MSGConstant.MSG_LOCATION) {
      let text = this.props.currentMessage.originMsg.message.message.message
      // 'LOCATION(' +
      // this.props.currentMessage.originMsg.message.message.longitude.toFixed(
      //   6,
      // ) +
      // ',' +
      // this.props.currentMessage.originMsg.message.message.latitude.toFixed(
      //   6,
      // ) +
      // ')'
      let textColor = 'white'
      if (this.props.position === 'left') {
        textColor = 'black'
      }
      return (
        <TouchableOpacity
          style={[styles.container, this.props.containerStyle]}
          onPress={() => {
            this.touchCallback(type, this.props.currentMessage)
          }}
        >
          <View
            style={{
              width: scaleSize(340),
              padding: scaleSize(5),
              alignItems: 'center',
            }}
          >
            <Image
              source={require('../../../../assets/lightTheme/friend/app_chat_pin.png')}
              style={{
                width: scaleSize(45),
                height: scaleSize(45),
              }}
            />
            <Text
              style={{
                // textAlign: 'center',
                fontSize: scaleSize(20),
                color: textColor,
              }}
            >
              {text}
            </Text>
          </View>
        </TouchableOpacity>
      )
    }
    /**
     * 协作邀请
     */
    if (type === MSGConstant.MSG_INVITE_COWORK) {
      let coworkType = this.props.currentMessage.originMsg.message.module
      let mapName = this.props.currentMessage.originMsg.message.mapName || ''
      if (coworkType) {
        let info = {
          module: coworkType,
          mapName: mapName,
          coworkId: this.props.currentMessage.originMsg.message.coworkId,
          time: this.props.currentMessage.originMsg.time,
          talkId: this.props.currentMessage.originMsg.user.groupId,
        }
        return <CoworkInviteView data={info} style={styles.item} />
      } else {
        return this.renderUnsupported()
      }
    }
    /*
     * 未在上面处理的消息
     */
    return this.renderUnsupported()
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  fileContainer: {
    // backgroundColor: 'white',
    width: scaleSize(300),
    justifyContent: 'flex-start',
  },
  fileContainerLeft: {
    alignItems: 'flex-end',
    // borderTopRightRadius: scaleSize(10),
  },
  fileContainerRight: {
    alignItems: 'flex-start',
    // borderTopLeftRadius: scaleSize(10),
  },
  fileName: {
    marginTop: scaleSize(10),
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
    fontSize: scaleSize(24),
    color: 'black',
  },
  fileSize: {
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
    marginBottom: scaleSize(10),
    fontSize: scaleSize(20),
  },
  // mapView: {
  //   width: 150,
  //   height: 100,
  //   borderRadius: 13,
  //   margin: 3,
  //   backgroundColor:'red',
  // },
  item: {
    padding: scaleSize(20),
    width: scaleSize(500),
  },
})

CustomView.defaultProps = {
  currentMessage: {},
  containerStyle: {},
  mapViewStyle: {},
}

CustomView.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  mapViewStyle: ViewPropTypes.style,
}
