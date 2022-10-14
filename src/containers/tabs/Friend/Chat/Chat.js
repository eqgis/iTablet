/**
 * Created by imobile-xzy on 2019/3/8.
 */
import React from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  BackHandler,
  NativeModules,
  PermissionsAndroid,
} from 'react-native'
import {
  GiftedChat,
  Bubble,
  MessageText,
  SystemMessage,
  InputToolbar,
} from 'react-native-gifted-chat'
import { SimpleDialog, ImageViewer } from '../Component/index'
import { SMap, EngineType, DatasetType,RNFS, SLocation } from 'imobile_for_reactnative'
import { Container, MTBtn } from '../../../../components'
import { scaleSize } from '../../../../utils/screen'
import NavigationService from '../../../NavigationService'
import CustomActions from './CustomActions'
import CustomView from './CustomView'
import { ConstPath, ConstOnline } from '../../../../constants'
import { FileTools  } from '../../../../native'
import { Toast, LayerUtils } from '../../../../utils'
import { getPublicAssets, getThemeAssets } from '../../../../assets'
import { ReadMsgParams } from '../../../../redux/models/cowork'
import { color, zIndexLevel } from '../../../../styles'
import MSGConstant from '../../../../constants/MsgConstant'
import { getLanguage } from '../../../../language/index'
import FriendListFileHandle from '../FriendListFileHandle'
// eslint-disable-next-line import/no-unresolved
import ImageResizer from 'react-native-image-resizer'
import DataHandler from '../../../../utils/DataHandler'
import 'moment/locale/zh-cn'
import CoworkInfo from '../Cowork/CoworkInfo'
const AppUtils = NativeModules.AppUtils

let Top = scaleSize(38)
if (Platform.OS === 'ios') {
  Top = scaleSize(80)
}

class Chat extends React.Component {
  props: {
    navigation: Object,
    device: Object,
    currentTask: Object,
    setBackAction: () => {},
    removeBackAction: () => {},
    closeMap: () => {},
    getLayers: () => {},
    readCoworkGroupMsg: (params: ReadMsgParams) => Promise<any>,
  }
  constructor(props) {
    super(props)
    this.openTime = new Date().getTime()
    this.friend = global.getFriend()
    this.curUser = this.friend.props.user.currentUser
    this.targetId = this.props.route.params.targetId
    this.targetUser = this.friend.getTargetUser(this.targetId)
    this.friend.setCurChat(this, this.openTime)
    this.action = this.props.route.params.action
    this._isMounted = false
    this.state = {
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
      showUserAvatar: true,
      messageInfo: this.props.route.params.messageInfo,
      showInformSpot: false,
      chatBottom: 0,
      title: this.props.route.params.title || this.targetUser.title,
      coworkMode: global.coworkMode,
    }

    this.onSend = this.onSend.bind(this)
    this.onSendFile = this.onSendFile.bind(this)
    // this.onSendLocation = this.onSendLocation.bind(this)
    this.onReceive = this.onReceive.bind(this)
    this.renderCustomActions = this.renderCustomActions.bind(this)
    this.renderBubble = this.renderBubble.bind(this)
    this.renderSystemMessage = this.renderSystemMessage.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
    this.onLoadEarlier = this.onLoadEarlier.bind(this)
    this.onReceiveProgress = this.onReceiveProgress.bind(this)
    this.renderTicks = this.renderTicks.bind(this)
  }

  onFriendListChanged = () => {
    let newTitle = this.isGroupChat()
      ? FriendListFileHandle.getGroup(this.targetUser.id).groupName
      : FriendListFileHandle.getFriend(this.targetUser.id)?.markName
    this.setState({ title: newTitle })
  }
  componentDidMount() {
    this.setPermission()
    Platform.OS === 'android' && BackHandler.addEventListener('hardwareBackPress', this.back)
    // Platform.OS === 'android' && this.props.setBackAction({
    //   key: this.props.route.name,
    //   action: () => this.back(),
    // })
    if (this.state.coworkMode) {
      this.props.readCoworkGroupMsg({
        target: { //若存在，则为群组消息
          groupId: this.props.currentTask.groupID,
          taskId: this.props.currentTask.id,
        },
        type: MSGConstant.MSG_ONLINE_GROUP_CHAT,
      })
    }
    let curMsg = []

    //加载两条
    let n = 0
    for (let i = this.targetUser.message.length - 1; i >= 0; i--) {
      if (n++ > 3) {
        break
      }
      let msg = this.targetUser.message[i]
      let chatMsg = this._loadChatMsg(msg)
      curMsg.push(chatMsg)
    }

    this._isMounted = true
    this.setState(() => {
      return {
        messages: curMsg,
      }
    })

    this.action && this._handleAciton(this.action)
  }

  setPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const permissionList = [
          'android.permission.READ_PHONE_STATE',
          'android.permission.ACCESS_FINE_LOCATION',
        ]
        const results = await PermissionsAndroid.requestMultiple(permissionList)

        let isAllGranted = true
        for (let key in results) {
          isAllGranted = results[key] === 'granted' && isAllGranted
        }
        if (isAllGranted) {
          await SLocation.openGPS()
        }
      }
    } catch (error) {
      __DEV__ && console.warn(error)
    }
  }

  _handleAciton = async action => {
    NavigationService.getTopLevelNavigator()
    if (action.length > 0) {
      for (let i = 0; i < action.length; i++) {
        if (action[i].name === 'onSendFile') {
          await this.onSendFile(
            action[i].type,
            action[i].filePath,
            action[i].fileName,
            action[i].extraInfo,
          )
        }
      }
    }
  }

  onReceiveProgress(value) {
    this.setState({
      messages: this.state.messages.map(m => {
        if (m._id === value.msgId) {
          m.originMsg.message.message.progress = value.percentage
          m.downloading = true
          if (value.percentage === 100 || value.percentage === 0) {
            m.downloading = false
          }
        }
        return {
          ...m,
        }
      }),
    })
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.back)
      // this.props.removeBackAction({
      //   key: this.props.route.name,
      // })
    }
    this.friend.setCurChat(undefined, this.openTime)
    this._isMounted = false
  }

  back = () => {
    if (ImageViewer.isShow()) {
      ImageViewer.hide()
    } else {
      NavigationService.goBack('Chat')
    }
    return true
    // if (this.state.coworkMode) {
    //   // this.SimpleDialog.set({
    //   //   text: getLanguage(global.language).Friends.ALERT_EXIT_COWORK,
    //   //   confirmAction: () => {
    //   //     this.endCowork()
    //   //   },
    //   // })
    //   // this.SimpleDialog.setVisible(true)
    //   // this.friend.curMod.action(this.curUser)
    //   // NavigationService.navigate('CoworkMapStack')
    //   NavigationService.goBack('Chat')
    // }
  }

  // setCoworkMode = value => {
  //   this.setState({ coworkMode: value })
  //   if (Platform.OS === 'android') {
  //     if (value) {
  //       this.props.setBackAction({
  //         key: this.props.route.name,
  //         action: () => this.back(),
  //       })
  //     } else {
  //       this.props.removeBackAction({
  //         key: this.props.route.name,
  //       })
  //     }
  //   }
  // }

  // endCowork = async () => {
  //   let close = () => {
  //     this.friend.setCurMod(undefined)
  //     this.setCoworkMode(false)
  //     global.coworkMode = false
  //     this.friend.leaveCowork()
  //     this.props.navigation.replace('CoworkTabs', {
  //       targetId: this.targetId,
  //     })
  //   }
  //   let mapOpen
  //   try {
  //     mapOpen = await SMap.isAnyMapOpened()
  //   } catch (error) {
  //     mapOpen = false
  //   }
  //   if (mapOpen) {
  //     SMap.mapIsModified().then(async result => {
  //       if (result) {
  //         global.SaveMapView &&
  //           global.SaveMapView.setVisible(true, null, async () => {
  //             await this.props.closeMap()
  //             close()
  //             this.props.navigation.pop()
  //           })
  //       } else {
  //         await this.props.closeMap()
  //         close()
  //         this.props.navigation.pop()
  //       }
  //     })
  //   } else {
  //     await this.props.closeMap()
  //     close()
  //     this.props.navigation.pop()
  //   }
  // }

  // eslint-disable-next-line
  onPressAvator = data => {}

  onLoadEarlier() {
    // eslint-disable-next-line
    this.setState(previousState => {
      return {
        isLoadingEarlier: true,
      }
    })

    let oldMsg = []
    if (this.targetUser.message.length > 4) {
      for (let i = this.targetUser.message.length - 1 - 4; i >= 0; i--) {
        let msg = this.targetUser.message[i]
        let chatMsg = this._loadChatMsg(msg)
        oldMsg.push(chatMsg)
      }
    }

    if (this._isMounted === true) {
      this.setState(previousState => {
        return {
          messages: GiftedChat.prepend(previousState.messages, oldMsg),
          loadEarlier: false,
          isLoadingEarlier: false,
        }
      })
    }
  }
  //将redux中取出消息转为chat消息
  _loadChatMsg = message => {
    let msgStr = JSON.stringify(message)
    let msg = JSON.parse(msgStr)
    msg = this.friend.loadMsg(msg)
    let chatMsg = {
      _id: msg.msgId,
      createdAt: new Date(msg.originMsg.time),
      user: {
        _id: msg.originMsg.user.id,
        name: msg.originMsg.user.name,
      },
      type: msg.type,
      originMsg: msg.originMsg,
      text: msg.text,
      system: msg.system,
    }

    return chatMsg
  }

  isGroupChat = () => {
    let bGroup = false
    if (this.targetUser.id.indexOf('Group_') != -1) {
      bGroup = true
    }
    return bGroup
  }

  showNoFriendNotify = msgId => {
    msgId += 1
    let ctime = new Date()
    let time = Date.parse(ctime)
    let message = {
      message: '',
      type: MSGConstant.MSG_REJECT,
      user: {
        name: this.targetUser.userName,
        id: this.targetUser.userId,
        groupID: this.targetUser.userId,
        groupName: '',
      },
      time: time,
    }
    //保存
    let storeMsg = this.friend.storeMessage(message, this.targetUser.id, msgId)
    //显示
    let chatMsg = this._loadChatMsg(storeMsg)
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, chatMsg),
      }
    })
  }

  //发送普通消息
  onSend(messages = []) {
    let bGroup = 1
    let groupID = messages[0].user._id
    let groupName = ''
    if (this.targetUser.id.indexOf('Group_') != -1) {
      bGroup = 2
      groupID = this.targetUser.id
      groupName = this.targetUser.title
    }
    let ctime = new Date()
    let time = Date.parse(ctime)
    //要发送/保存的消息
    let message = {
      message: messages[0].text,
      type: bGroup,
      user: {
        name: messages[0].user.name,
        id: messages[0].user._id,
        groupID: groupID,
        groupName: groupName,
      },
      time: time,
    }
    if (CoworkInfo.coworkId !== '') {
      message.user.coworkGroupId = this.props.currentTask.groupID
    }
    let msgId = this.friend.getMsgId(this.targetUser.id)
    //保存
    let storeMsg = this.friend.storeMessage(message, this.targetUser.id, msgId)
    //显示
    let chatMsg = this._loadChatMsg(storeMsg)
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, chatMsg),
      }
    })
    //发送
    let isFriend = FriendListFileHandle.getIsFriend(this.targetUser.id)
    if (isFriend === 0 && bGroup !== 2) {
      //对方还未添加您为好友
      this.showNoFriendNotify(msgId)
      return
    }
    this.friend._sendMessage(JSON.stringify(message), this.targetUser.id, false)
  }

  onSendLocation = async (value) => {
    let positionStr = value.address
    let bGroup = 1
    let groupID = this.curUser.userName
    let groupName = ''
    if (this.targetUser.id.indexOf('Group_') != -1) {
      bGroup = 2
      groupID = this.targetUser.id
      groupName = this.targetUser.title
    }
    let ctime = new Date()
    let time = Date.parse(ctime)
    let message = {
      message: {
        type: MSGConstant.MSG_LOCATION,
        message: {
          message: positionStr,
          longitude: value.longitude,
          latitude: value.latitude,
        },
      },
      type: bGroup,
      user: {
        name: this.curUser.nickname,
        id: this.curUser.userName,
        groupID: groupID,
        groupName: groupName,
      },
      time: time,
    }
    if (CoworkInfo.coworkId !== '') {
      message.user.coworkGroupId = this.props.currentTask.groupID
    }
    let msgId = this.friend.getMsgId(this.targetUser.id)
    //保存
    let storeMsg = this.friend.storeMessage(message, this.targetUser.id, msgId)
    //显示
    let chatMsg = this._loadChatMsg(storeMsg)
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, chatMsg),
      }
    })
    //发送
    let isFriend = FriendListFileHandle.getIsFriend(this.targetUser.id)
    if (isFriend === 0) {
      //对方还未添加您为好友
      this.showNoFriendNotify(msgId)
      return
    }
    this.friend._sendMessage(JSON.stringify(message), this.targetUser.id, false)
  }

  async onSendFile(type, filePath, fileName, extraInfo) {
    let bGroup = 1
    let groupID = this.curUser.userName
    let groupName = ''
    if (this.targetUser.id.indexOf('Group_') != -1) {
      bGroup = 2
      groupID = this.targetUser.id
      groupName = this.targetUser.title
    }
    let ctime = new Date()
    let time = Date.parse(ctime)
    //要发送的文件,发送到rabbitMQ时使用
    // let message = {
    //   type: bGroup,
    //   user: {
    //     name: this.curUser.nickname,
    //     id: this.curUser.userName,
    //     groupID: groupID,
    //     groupName: groupName,
    //   },
    //   time: time,
    //   message: {
    //     type: MSGConstant.MSG_FILE, //文件本体
    //     message: {
    //       data: '',
    //       index: 0,
    //       length: 0,
    //     },
    //   },
    // }

    fileName = fileName + '.zip'
    let statResult = await RNFS.stat(filePath)
    //文件接收提醒
    let informMsg = {
      type: bGroup,
      time: time,
      user: {
        name: this.curUser.nickname,
        id: this.curUser.userName,
        groupID: groupID,
        groupName: groupName,
      },
      message: {
        type: type,
        message: {
          // message: '[文件]',
          fileName: fileName,
          fileSize: statResult.size,
          filePath: filePath,
          progress: 0,
        },
      },
    }
    if (extraInfo) {
      Object.assign(informMsg.message.message, extraInfo)
    }
    if (CoworkInfo.coworkId !== '') {
      informMsg.user.coworkGroupId = this.props.currentTask.groupID
    }

    let msgId = this.friend.getMsgId(this.targetUser.id)
    //保存
    let storeMsg = this.friend.storeMessage(
      informMsg,
      this.targetUser.id,
      msgId,
    )
    //显示
    let chatMsg = this._loadChatMsg(storeMsg)
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, chatMsg),
      }
    })
    //发送文件及提醒
    let isFriend = FriendListFileHandle.getIsFriend(this.targetUser.id)
    if (isFriend === 0) {
      //对方还未添加您为好友
      this.showNoFriendNotify(msgId)
      return
    }
    informMsg.message.message.filePath = ''
    this.friend.sendFile(
      informMsg,
      filePath,
      this.targetUser.id,
      msgId,
      result => {
        FileTools.deleteFile(filePath)
        if (!result) {
          this.friend.onReceiveProgress({
            talkId: this.targetUser.id,
            msgId: msgId,
            percentage: 0,
          })
          Toast.show(getLanguage(global.language).Friends.SEND_FAIL_NETWORK)
        } else {
          Toast.show(getLanguage(global.language).Friends.SEND_SUCCESS)
        }
      },
    )
  }

  /**
   * 发送图片
   */
  onSendPicture = async (data, sendToServer = true) => {
    // sendToServer = false

    let userPath = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath + this.curUser.userName + '/Data/Temp',
    )
    /**
     * uri
     * android:
     * 1. /iTablet/Common/Images/02.png
     * 2. content://media/external/images/media/214684
     *    ==> /storage/emulated/0/ttt.fw
     *
     * ios:
     * 1. /iTablet/Common/Images/02.png
     * 2. assets-library://asset/asset.PNG?id=381993E0-7631-4BA0-A351-0536E30FAED0&ext=PNG
     *   ==> X
     */
    let uri = data.uri
    let filePath = uri
    let fileName
    let hasTempFile = false
    if (uri.indexOf('assets-library://') === 0 || uri.indexOf('ph://') === 0) {
      // let destPath = userPath + '/' + data.filename
      // await RNFS.copyAssetsFileIOS(uri, destPath, 0, 0)
      // if (uri.toLowerCase().indexOf('.gif') == -1) {
      //   hasTempFile = true
      // }
      const newPaths = await FileTools.copyFiles([uri], userPath)
      filePath = newPaths[0]
      fileName = filePath.substr(filePath.lastIndexOf('/') + 1)
    } else if (uri.indexOf('content://') === 0) {
      filePath = await FileTools.getContentAbsolutePath(uri)
      fileName = filePath.substr(filePath.lastIndexOf('/') + 1)
    } else if (uri.indexOf('file://') === 0) {
      filePath = filePath.replace('file://', '')
      fileName = filePath.substr(filePath.lastIndexOf('/') + 1)
    } else {
      uri = uri.substr(uri.indexOf('/iTablet'))
    }

    let imgData
    if (sendToServer) {
      //获取缩略图
      let resizedImageUri = await ImageResizer.createResizedImage(
        filePath,
        60,
        100,
        'PNG',
        1,
        0,
        userPath,
      )
      imgData = await RNFS.readFile(resizedImageUri.path, 'base64')
      await RNFS.unlink(resizedImageUri.path)
    } else {
      imgData = await RNFS.readFile(filePath, 'base64')
    }

    let bGroup = 1
    let groupID = this.curUser.userName
    let groupName = ''
    if (this.targetUser.id.indexOf('Group_') != -1) {
      bGroup = 2
      groupID = this.targetUser.id
      groupName = this.targetUser.title
    }
    let ctime = new Date()
    let time = Date.parse(ctime)

    let statResult = await RNFS.stat(filePath)
    let message = {
      type: bGroup,
      user: {
        name: this.curUser.nickname,
        id: this.curUser.userName,
        groupID: groupID,
        groupName: groupName,
      },
      time: time,
      message: {
        type: MSGConstant.MSG_PICTURE,
        message: {
          fileName: data.filename || fileName,
          fileSize: statResult.size,
          filePath: hasTempFile ? uri : filePath.replace(global.homePath, ''),
          imgdata: imgData,
          progress: 0,
        },
      },
    }
    if (CoworkInfo.coworkId !== '') {
      message.user.coworkGroupId = this.props.currentTask.groupID
    }

    let msgId = this.friend.getMsgId(this.targetUser.id)
    //保存
    let storeMsg = this.friend.storeMessage(message, this.targetUser.id, msgId)
    //显示
    let chatMsg = this._loadChatMsg(storeMsg)
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, chatMsg),
      }
    })
    //发送文件及提醒
    let isFriend = FriendListFileHandle.getIsFriend(this.targetUser.id)
    if (isFriend === 0) {
      //对方还未添加您为好友
      this.showNoFriendNotify(msgId)
      return
    }
    message.message.message.filePath = ''
    let callback = result => {
      if (hasTempFile) {
        RNFS.unlink(filePath)
      }
      if (!result) {
        Toast.show(getLanguage(global.language).Friends.SEND_FAIL)
      }
    }
    if (sendToServer) {
      this.friend.sendFile(
        message,
        filePath,
        this.targetUser.id,
        msgId,
        callback,
      )
    } else {
      this.friend._sendMessage(
        JSON.stringify(message),
        this.targetUser.id,
        false,
        callback,
      )
    }
  }

  showInformSpot = b => {
    this.setState({ showInformSpot: b })
  }
  onReceive(msgId) {
    let talkId = this.targetUser.id
    // let msg = this.friend.getMsgByMsgId(talkId, msgId)
    // let chatMsg = this._loadChatMsg(msg)
    const lastMsg = this.state.messages[0]
    const msgs = this.friend.getMsgFromTime(talkId, lastMsg.createdAt.getTime())
    const chatMsgs = []
    for (let msg of msgs) {
      chatMsgs.push(this._loadChatMsg(msg))
    }

    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, chatMsgs),
        showInformSpot: false,
      }
    })
  }

  receiveFile = async (message, receivePath, cb) => {
    let storeFileName = await this.getAvailableFileName(
      receivePath,
      message.originMsg.message.message.fileName,
    )

    message.downloading = true

    this.friend.receiveFile(
      message,
      receivePath,
      storeFileName,
      this.targetUser.id,
      async res => {
        message.originMsg.message.message.filePath =
          receivePath + '/' + storeFileName
        if (res === false) {
          message.downloading = false
          this.friend.onReceiveProgress({
            talkId: this.targetUser.id,
            msgId: message._id,
            percentage: 0,
          })
          let absolutePath = global.homePath + receivePath + '/' + storeFileName
          if (await FileTools.fileIsExist(absolutePath)) {
            FileTools.deleteFile(absolutePath)
          }
        }
        cb && cb(res)
      },
    )
  }

  receivePicture = async message => {
    if (message.download) {
      Toast.show(getLanguage(global.language).Friends.WAIT_DOWNLOADING)
      return
    }
    let homePath = await FileTools.appendingHomeDirectory()
    let userPath = ConstPath.UserPath + this.curUser.userName
    let receivePath = userPath + '/ReceivedFiles'
    if (Platform.OS === 'android') {
      homePath = 'file://' + homePath
    }

    this.receiveFile(message, receivePath, res => {
      if (res === true) {
        // this.ImageViewer.setImageUri(
        //   homePath + message.originMsg.message.message.filePath,
        // )
        this.setState({
          messages: this.state.messages.map(m => {
            return {
              ...m,
            }
          }),
        })
      }
    })
  }

  getAvailableFileName = async (filePath, fullFileName) => {
    let homePath = await FileTools.appendingHomeDirectory()
    let fileName = fullFileName.substr(0, fullFileName.lastIndexOf('.'))
    let suffix = fullFileName.substr(fullFileName.lastIndexOf('.'))
    let tempFullName = ''
    if (await FileTools.fileIsExist(homePath + filePath + '/' + fullFileName)) {
      for (let i = 1; ; i++) {
        tempFullName = fileName + '_' + i + suffix
        if (
          !(await FileTools.fileIsExist(
            homePath + filePath + '/' + tempFullName,
          ))
        ) {
          return tempFullName
        }
      }
    } else {
      return fullFileName
    }
  }

  onCustomViewTouch = async (type, message) => {
    switch (type) {
      case MSGConstant.MSG_MAP:
      case MSGConstant.MSG_LAYER:
      case MSGConstant.MSG_DATASET:
      case MSGConstant.MSG_ARMAP:
      case MSGConstant.MSG_AREFFECT:
      case MSGConstant.MSG_ARMODAL:
      case MSGConstant.MSG_DATASOURCE:
      case MSGConstant.MSG_SYMBOL:
      case MSGConstant.MSG_COLORSCHEME:
      case MSGConstant.MSG_AI_MODEL:
      case MSGConstant.MSG_TEMPLATE_PLOT:
      case MSGConstant.MSG_TEMPLATE_MAP:
        this.onCustomViewFileTouch(type, message)
        break
      case MSGConstant.MSG_LOCATION:
        this.onCustomViewLocationTouch(message)
        break
      case MSGConstant.MSG_PICTURE:
        this.onCustomViewPictureTouch(message)
        break
      default:
        break
    }
  }

  onCustomViewPictureTouch = async message => {
    let homePath = await FileTools.appendingHomeDirectory()
    if (message.downloading) {
      Toast.show(getLanguage(global.language).Friends.WAIT_DOWNLOADING)
    } else if (!message.originMsg.message.message.filePath) {
      let fileSize = message.originMsg.message.message.fileSize
      let fileSizeText = fileSize.toFixed(2) + 'B'
      if (fileSize > 1024) {
        fileSize = fileSize / 1024
        fileSizeText = fileSize.toFixed(2) + 'KB'
      }
      if (fileSize > 1024) {
        fileSize = fileSize / 1024
        fileSizeText = fileSize.toFixed(2) + 'MB'
      }
      this.SimpleDialog.set({
        text:
          getLanguage(global.language).Friends.LOAD_ORIGIN_PIC +
          '(' +
          fileSizeText +
          ')？',
        confirmAction: () => {
          this.receivePicture(message)
        },
      })
      this.SimpleDialog.setVisible(true)
      return
    }
    let uri = message.originMsg.message.message.filePath
    if (uri !== undefined && uri !== '') {
      if (Platform.OS === 'android') {
        if (uri.indexOf('content://') === -1 && uri.indexOf('file://') === -1) {
          uri = 'file://' + homePath + uri
        }
      } else {
        if (uri.indexOf('assets-library://') === -1 && uri.indexOf('ph://') === -1) {
          uri = homePath + uri
        }
      }
    } else {
      let imgdata = message.originMsg.message.message.imgdata
      if (imgdata !== undefined) {
        uri = `data:image/png;base64,${imgdata}`
      }
    }
    ImageViewer.show([{url: uri}])
  }

  onCustomViewLocationTouch = async message => {
    if (global.coworkMode) {
      Toast.show(getLanguage(global.language).Friends.LOCATION_COWORK_NOTIFY)
    } else if (this.action) {
      Toast.show(getLanguage(global.language).Friends.LOCATION_SHARE_NOTIFY)
    } else {
      let wsData = JSON.parse(JSON.stringify(global.language === 'CN'? ConstOnline.OSM:ConstOnline.Google))
      wsData.layerIndex = 0
      let licenseStatus = await SMap.getEnvironmentStatus()
      global.isLicenseValid = licenseStatus.isLicenseValid
      NavigationService.navigate('MapViewSingle', {
        wsData,
        isExample: true,
        noLegend: true,
        viewEntire:false,
        mapName: message.originMsg.message.message.message,
        showMarker: {
          longitude: message.originMsg.message.message.longitude,
          latitude: message.originMsg.message.message.latitude,
        },
      })
    }
  }

  onCustomViewFileTouch = async (type, message) => {
    let userPath = ConstPath.UserPath + this.curUser.userName
    let receivePath = userPath + '/ReceivedFiles'

    if (message.user._id !== this.curUser.userName) {
      if (message.downloading) {
        Toast.show(getLanguage(global.language).Friends.WAIT_DOWNLOADING)
      } else if (message.originMsg.message.message.progress !== 100) {
        this.SimpleDialog.set({
          text: getLanguage(global.language).Friends.RECEIVE_CONFIRM,
          confirmAction: () => {
            this.receiveFile(message, receivePath)
          },
        })
        this.SimpleDialog.setVisible(true)
      } else if (message.originMsg.message.message.progress === 100) {
        let homePath = await FileTools.appendingHomeDirectory()
        let filePath = homePath + message.originMsg.message.message.filePath
        if (!(await FileTools.fileIsExist(filePath))) {
          this.SimpleDialog.set({
            text: getLanguage(global.language).Friends.DATA_NOT_FOUND,
            confirmAction: () => {
              this.receiveFile(message, receivePath)
            },
          })
          this.SimpleDialog.setVisible(true)
          return
        }
        switch (type) {
          case MSGConstant.MSG_ARMAP:
            this.showImportDataDialog('armap', message)
            break
          case MSGConstant.MSG_AREFFECT:
            this.showImportDataDialog('areffect', message)
            break
          case MSGConstant.MSG_ARMODAL:
            this.showImportDataDialog('armodel', message)
            break
          case MSGConstant.MSG_MAP:
            this.showImportDataDialog('workspace', message)
            break
          case MSGConstant.MSG_DATASOURCE:
            this.showImportDataDialog('datasource', message)
            break
          case MSGConstant.MSG_SYMBOL:
            this.showImportDataDialog('symbol', message)
            break
          case MSGConstant.MSG_COLORSCHEME:
            this.showImportDataDialog('color', message)
            break
          case MSGConstant.MSG_AI_MODEL:
            this.showImportDataDialog('aimodel', message)
            break
          case MSGConstant.MSG_TEMPLATE_PLOT:
            this.showImportDataDialog('plotting', message)
            break
          case MSGConstant.MSG_TEMPLATE_MAP:
            this.showImportDataDialog('xml_template', message)
            break
          case MSGConstant.MSG_LAYER:
            if (!global.coworkMode) {
              this.showOpenCoworkDialog()
            } else {
              this.SimpleDialog.set({
                text: getLanguage(global.language).Friends.IMPORT_CONFIRM,
                confirmAction: () => {
                  this.importLayer(message)
                },
              })
              this.SimpleDialog.setVisible(true)
            }
            break
          case MSGConstant.MSG_DATASET:
            if (!global.coworkMode) {
              this.showOpenCoworkDialog()
            } else {
              this.SimpleDialog.set({
                text: getLanguage(global.language).Friends.IMPORT_CONFIRM,
                confirmAction: () => {
                  this.importDataset(message)
                },
              })
              this.SimpleDialog.setVisible(true)
            }

            break
          default:
            break
        }
      }
    }
  }

  importDataset = async message => {
    if (CoworkInfo.coworkId !== '') {
      Toast.show(
        getLanguage(global.language).Friends.ONLINECOWORK_DISABLE_OPERATION,
      )
      return
    }
    let mapOpen
    try {
      mapOpen = await SMap.isAnyMapOpened()
    } catch (error) {
      mapOpen = false
    }
    if (!(global.coworkMode && mapOpen)) {
      Toast.show(getLanguage(global.language).Friends.OPENCOWORKFIRST)
      return
    }
    let homePath = await FileTools.appendingHomeDirectory()
    let filePath = homePath + message.originMsg.message.message.filePath
    let fileDir = filePath.substr(0, filePath.lastIndexOf('.'))
    await FileTools.unZipFile(filePath, fileDir)
    //要导入的文件
    let fileList = await FileTools.getPathList(fileDir)

    if (fileList.length > 0) {
      let datasourceList = await SMap.getDatasources()
      let isDatasourceOpen = false
      //是否打开了对应的数据源
      for (let i = 0; i < datasourceList.length; i++) {
        if (
          datasourceList[i].alias ===
          message.originMsg.message.message.datasourceAlias
        ) {
          isDatasourceOpen = true
          break
        }
      }
      //没有对应的数据源则新建一个
      if (!isDatasourceOpen) {
        let datasourcePath =
          homePath +
          ConstPath.AppPath +
          'User/' +
          this.curUser.userName +
          '/' +
          ConstPath.RelativePath.Datasource
        let time = Date.parse(new Date())
        let newDatasourcePath = datasourcePath + 'import_' + time + '.udb'
        let datasourceParams = {}
        datasourceParams.server = newDatasourcePath
        datasourceParams.engineType = EngineType.UDB
        datasourceParams.alias =
          message.originMsg.message.message.datasourceAlias
        await SMap.createDatasource(datasourceParams)
        await SMap.openDatasource(datasourceParams)
      }
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].path.indexOf('.json') !== -1) {
          let jstr = await FileTools.readFile(homePath + fileList[i].path)
          let properties
          let hasPoint, hasLine, hasPolygon
          try {
            let items = jstr.split('\n')
            for (let i = 0; i < items.length; i++) {
              if (items[i] !== '') {
                let item = JSON.parse(items[i])
                if (!properties) {
                  properties = item.properties
                }
                if (item.geometry.type === 'Point') {
                  hasPoint = true
                } else if (item.geometry.type === 'LineString') {
                  hasLine = true
                } else if (item.geometry.type === 'Polygon') {
                  hasPolygon = true
                }
              }
            }
          } catch (error) {
            // console.log(error)
          }
          let type = 1
          let typeCount = 0
          if (hasPolygon) {
            type = DatasetType.REGION
            typeCount++
          }
          if (hasLine) {
            type = DatasetType.LINE
            typeCount++
          }
          if (hasPoint) {
            type = DatasetType.POINT
            typeCount++
          }
          if (typeCount !== 1) {
            type = DatasetType.CAD
          }
          await SMap.importDatasetFromGeoJson(
            message.originMsg.message.message.datasourceAlias,
            fileList[i].name.substr(0, fileList[i].name.lastIndexOf('.')),
            homePath + fileList[i].path,
            type,
            properties,
          )
        }
      }
    }

    await FileTools.deleteFile(fileDir)
    Toast.show(getLanguage(global.language).Friends.IMPORT_SUCCESS)
  }

  importLayer = async message => {
    if (CoworkInfo.coworkId !== '') {
      Toast.show(
        getLanguage(global.language).Friends.ONLINECOWORK_DISABLE_OPERATION,
      )
      return
    }
    let mapOpen
    try {
      mapOpen = await SMap.isAnyMapOpened()
    } catch (error) {
      mapOpen = false
    }
    if (!(global.coworkMode && mapOpen)) {
      Toast.show(getLanguage(global.language).Friends.OPENCOWORKFIRST)
      return
    }
    let homePath = await FileTools.appendingHomeDirectory()
    let filePath = homePath + message.originMsg.message.message.filePath
    let fileDir = filePath.substr(0, filePath.lastIndexOf('.'))
    await FileTools.unZipFile(filePath, fileDir)
    let fileList = await FileTools.getPathList(fileDir)
    let layer
    if (fileList.length > 0) {
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].path.indexOf('.xml') !== -1) {
          layer = await FileTools.readFile(homePath + fileList[i].path)
          await SMap.insertXMLLayer(0, layer)
        }
      }
    }
    await FileTools.deleteFile(fileDir)
    this.props.getLayers(-1, async layers => {
      for (let i = layers.length; i > 0; i--) {
        if (LayerUtils.getLayerType(layers[i]) === 'TAGGINGLAYER') {
          await SMap.moveToTop(layers[i].name)
        }
      }
      SMap.refreshMap()
    })
    // NavigationService.navigate('MapView')
    Toast.show(getLanguage(global.language).Friends.IMPORT_SUCCESS)
  }

  importFileData = async (type, message) => {
    if (!type) return
    global.Loading.setLoading(
      true,
      getLanguage(global.language).Friends.IMPORTING_DATA,
    )
    let homePath = await FileTools.appendingHomeDirectory()
    let receivePath = homePath + message.originMsg.message.message.filePath
    let importPath = homePath + '/iTablet/Import'
    try {
      let result = await FileTools.unZipFile(receivePath, importPath)
      let isImport = false
      if (result) {
        let dataList = await DataHandler.getExternalData(importPath, [type])
        let results = []
        for (let i = 0; i < dataList.length; i++) {
          results.push(await DataHandler.importExternalData(this.curUser, dataList[i]))
        }
        isImport = results.some(value => value === true)
      }
      isImport
        ? Toast.show(getLanguage(this.props.language).Prompt.IMPORTED_SUCCESS)
        : Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_IMPORT)
    } catch (error) {
      Toast.show(getLanguage(global.language).Friends.IMPORT_FAIL)
    } finally {
      global.Loading.setLoading(false)
      FileTools.deleteFile(importPath)
    }
  }

  showImportDataDialog = (type, message) => {
    this.SimpleDialog.set({
      text: getLanguage(global.language).Friends.IMPORT_CONFIRM,
      confirmAction: () => {
        this.importFileData(type, message)
      },
    })
    this.SimpleDialog.setVisible(true)
  }

  showOpenCoworkDialog = () => {
    this.SimpleDialog.set({
      text: getLanguage(global.language).Friends.OPENCOWORKFIRST,
      confirmAction: () => {
        NavigationService.navigate('SelectModule')
      },
    })
    this.SimpleDialog.setVisible(true)
  }

  _headerLeft = () => {
    let imgSize, dotLeft
    if (global.getDevice().orientation && global.getDevice().orientation.indexOf('LANDSCAPE') === 0) {
      imgSize = scaleSize(40)
      dotLeft = scaleSize(35)
    } else {
      imgSize = scaleSize(60)
      dotLeft = scaleSize(55)
    }
    return (
      <View style={[styles.headerLeft]}>
        <MTBtn
          key={'backTo'}
          image={getPublicAssets().common.icon_back}
          style={styles.backView}
          imageStyle={[styles.backImg, {width: imgSize, height: imgSize}]}
          onPress={() => {
            NavigationService.goBack('Chat')
          }}
        />
        {this.state.showInformSpot && !this.state.coworkMode ? (
          <View style={[styles.newDot, { left: dotLeft }]} />
        ) : null}
      </View>
    )
  }

  render() {
    let moreImg = getPublicAssets().common.icon_nav_imove
    return (
      <Container
        style={{ backgroundColor: 'rgba(240,240,240,1.0)' }}
        ref={ref => (this.container = ref)}
        showFullInMap={true}
        hideInBackground={false}
        headerProps={{
          title: this.state.title,
          withoutBack: false,
          backAction: this.state.coworkMode && this.back,
          navigation: this.props.navigation,
          headerStyle: {
            zIndex: zIndexLevel.THREE,
          },
          headerLeft: this._headerLeft(),
          headerLeftStyle: {marginLeft: scaleSize(25)},
          headerRight:
              this.targetUser.id.indexOf('Group_') === -1 ||
              FriendListFileHandle.isInGroup(
                this.targetUser.id,
                this.curUser.userName,
              ) ? (
                /* eslint-disable*/
                <TouchableOpacity
                  onPress={() => {
                    let route = this.isGroupChat()
                      ? 'ManageGroup'
                      : 'ManageFriend'
                    NavigationService.navigate(route, {
                      user: this.curUser,
                      targetId: this.targetId,
                      friend: this.friend,
                      chat: this,
                    })
                  }}
                  style={styles.moreView}
                >
                  <Image
                    resizeMode={'contain'}
                    source={moreImg}
                    style={styles.moreImg}
                  />
                </TouchableOpacity>
              ) : null,
            /* eslint-enable */
        }}
      >
        <Animated.View style={{ flex: 1, bottom: this.state.chatBottom }}>
          {/* {this.state.coworkMode ? (
            <CoworkTouchableView
              screen="Chat"
              onPress={async () => {
                // let mapOpen
                // try {
                //   mapOpen = await SMap.isAnyMapOpened()
                // } catch (error) {
                //   mapOpen = false
                // }
                // if (!mapOpen) {
                this.friend.curMod.action(this.curUser)
                // } else {
                //   NavigationService.navigate('MapView')
                // }
              }}
            />
          ) : null} */}
          <GiftedChat
            ref={ref => (this.GiftedChat = ref)}
            locale={getLanguage(global.language).Friends.LOCALE}
            placeholder={getLanguage(global.language).Friends.INPUT_MESSAGE}
            messages={this.state.messages}
            showAvatarForEveryMessage={true}
            onSend={this.onSend}
            loadEarlier={this.state.loadEarlier}
            onLoadEarlier={this.onLoadEarlier}
            isLoadingEarlier={this.state.isLoadingEarlier}
            label={getLanguage(global.language).Friends.LOAD_EARLIER}
            showUserAvatar={this.state.showUserAvatar}
            renderAvatarOnTop={false}
            user={{
              _id: this.curUser.userName, // sent messages should have same user._id
              name: this.curUser.nickname,
            }}
            renderActions={this.renderCustomActions}
            //被移出群组后不显示输入栏
            renderInputToolbar={props => {
              if (
                this.targetUser.id.indexOf('Group_Task') > -1 || // 在线协作任务群
                this.targetUser.id.indexOf('Group_') === -1 ||   // 普通聊天群
                  FriendListFileHandle.isInGroup(
                    this.targetUser.id,
                    this.curUser.userName,
                  )
              ) {
                return (
                  <InputToolbar
                    {...props}
                    textStyle={{color: color.fontColorGray2}}
                    label={getLanguage(global.language).Friends.SEND}
                  />
                )
              }
              return null
            }}
            renderBubble={this.renderBubble}
            renderTicks={this.renderTicks}
            renderSystemMessage={this.renderSystemMessage}
            renderCustomView={this.renderCustomView}
            renderFooter={this.renderFooter}
            renderAvatar={this.renderAvatar}
            renderMessageText={props => {
              if (props.currentMessage.type !== MSGConstant.MSG_TEXT) {
                return null
              }
              return (
                <MessageText
                  {...props}
                  customTextStyle={{
                    fontSize: scaleSize(20),
                    lineHeight: scaleSize(25),
                  }}
                />
              )
            }}
          />
          {this.renderSimpleDialog()}
        </Animated.View>
      </Container>
    )
  }

  renderCustomActions(props) {
    return (
      <CustomActions
        {...props}
        device={this.props.device}
        callBack={value => this.setState({ chatBottom: value })}
        sendCallBack={(type, value, fileName, tempType = undefined) => {
          if (type === 1) {
            this.onSendFile(MSGConstant.MSG_MAP, value, fileName)
          } else if (type === 3) {
            this.onSendLocation(value)
          } else if (type === 2) {
            this.onSendPicture(value)
          } else if (type === 4) {
            this.onSendFile(MSGConstant.MSG_ARMAP, value, fileName)
          } else if (type === 5) {
            this.onSendFile(MSGConstant.MSG_DATASOURCE, value, fileName)
          } else if (type === 6) {
            this.onSendFile(MSGConstant.MSG_SYMBOL, value, fileName)
          } else if (type === 7) {
            this.onSendFile(MSGConstant.MSG_COLORSCHEME, value, fileName)
          } else if (type === 8) {
            this.onSendFile(MSGConstant.MSG_AI_MODEL, value, fileName)
          } else if (type === 9) {
            this.onSendFile(MSGConstant.MSG_AREFFECT, value, fileName)
          } else if (type === 10) {
            this.onSendFile(MSGConstant.MSG_ARMODAL, value, fileName)
          } else if (type === 11) {
            const msgType = tempType === 'plotting' ? MSGConstant.MSG_TEMPLATE_PLOT : MSGConstant.MSG_TEMPLATE_MAP
            this.onSendFile(msgType, value, fileName)
          }
        }}
      />
    )
  }

  renderAvatar = props => {
    // let backColor = 'rgba(229,125,33,1.0)'
    // if (props.currentMessage.user._id !== 1) {
    //   backColor = 'rgba(51,151,218,1.0)'
    // }

    // let headerStr = ''
    // if (props.currentMessage.user.name) {
    //   headerStr = props.currentMessage.user.name[0]
    // }
    return (
      <TouchableOpacity
        {...props}
        // eslint-disable-next-line
        onPress={user => {
          this.onPressAvator(props.currentMessage.user)
        }}
      >
        <Image
          style={{
            height: scaleSize(60),
            width: scaleSize(60),
            borderRadius: scaleSize(30),
            alignItems: 'center',
            justifyContent: 'center',
          }}
          resizeMode={'contain'}
          source={getThemeAssets().friend.contact_photo}
        />
        {/*<View*/}
        {/*style={{*/}
        {/*height: scaleSize(60),*/}
        {/*width: scaleSize(60),*/}
        {/*borderRadius: scaleSize(60),*/}
        {/*backgroundColor: backColor,*/}
        {/*alignItems: 'center',*/}
        {/*justifyContent: 'center',*/}
        {/*}}*/}
        {/*>*/}
        {/*<Text*/}
        {/*style={{*/}
        {/*fontSize: scaleSize(30),*/}
        {/*color: 'white',*/}
        {/*textAlign: 'center',*/}
        {/*}}*/}
        {/*>*/}
        {/*{headerStr}*/}
        {/*</Text>*/}
        {/*</View>*/}
      </TouchableOpacity>
    )
  }
  renderBubble(props) {
    return (
      <View>
        {
          this.isGroupChat() && (
            !props.previousMessage ||
            !props.previousMessage.user ||
            props.previousMessage.user.name !== props.currentMessage.user.name
          ) &&
          <Text
            style={{
              textAlign: props.currentMessage.user.name === this.curUser.nickname
                ? 'right'
                : 'left',
            }}
          >{props.currentMessage.user.name}</Text>
        }
        <Bubble
          {...props}
          wrapperStyle={{
            left: {
              //对方的气泡
              marginTop: scaleSize(1),
              backgroundColor: '#rgba(255, 255, 255, 1.0)',
              overflow: 'hidden',
              borderRadius: scaleSize(10),
            },
            right: {
              //我方的气泡
              marginTop: scaleSize(1),
              backgroundColor: color.gray,
              overflow: 'hidden',
              borderRadius: scaleSize(10),
            },
          }}
          //与下一条自己的消息连接处的样式
          containerToNextStyle={{
            left: {
              borderBottomLeftRadius: scaleSize(10),
            },
            right: {
              borderBottomRightRadius: scaleSize(10),
            },
          }}
          //与上一条自己的消息连接处的样式
          containerToPreviousStyle={{
            left: {
              borderTopLeftRadius: scaleSize(10),
            },
            right: {
              borderTopRightRadius: scaleSize(10),
            },
          }}
          //底栏样式
          bottomContainerStyle={{
            right: {
              flexDirection: 'row-reverse',
              justifyContent: 'space-between',
            },
            left: {
              justifyContent: 'space-between',
            },
          }}
        />
      </View>
    )
  }
  //渲染标记
  renderTicks(props) {
    let currentMessage = props

    if (
      (currentMessage.type && currentMessage.type === MSGConstant.MSG_MAP) ||
      currentMessage.type === MSGConstant.MSG_ARMAP ||
      currentMessage.type === MSGConstant.MSG_AREFFECT ||
      currentMessage.type === MSGConstant.MSG_ARMODAL ||
      currentMessage.type === MSGConstant.MSG_LAYER ||
      currentMessage.type === MSGConstant.MSG_DATASET ||
      currentMessage.type === MSGConstant.MSG_PICTURE
      || currentMessage.type === MSGConstant.MSG_DATASOURCE
      || currentMessage.type === MSGConstant.MSG_SYMBOL
      || currentMessage.type === MSGConstant.MSG_COLORSCHEME
      || currentMessage.type === MSGConstant.MSG_AI_MODEL
      || currentMessage.type === MSGConstant.MSG_TEMPLATE_PLOT
      || currentMessage.type === MSGConstant.MSG_TEMPLATE_MAP
    ) {
      let progress = currentMessage.originMsg.message.message.progress
      if (progress === undefined) {
        progress = 0
      }
      return (
        <View style={styles.tickView}>
          <Text
            style={
              currentMessage.user._id !== this.curUser.userName
                ? styles.tickLeft
                : [styles.tickLeft, styles.tickRight]
            }
          >
            {progress === 100 ? '✓' : progress === 0 ? '' : progress + '%'}
          </Text>
        </View>
      )
    }
  }

  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: scaleSize(20),
        }}
      />
    )
  }

  renderCustomView = props => {
    return <CustomView {...props} onTouch={this.onCustomViewTouch} />
  }

  // eslint-disable-next-line
  renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>{this.state.typingText}</Text>
        </View>
      )
    }
    return null
  }

  renderSimpleDialog = () => {
    return <SimpleDialog ref={ref => (this.SimpleDialog = ref)} />
  }
}

const styles = StyleSheet.create({
  moreView: {
    flex: 1,
    // marginRight: scaleSize(10),
  },
  moreImg: {
    width: scaleSize(60),
    height: scaleSize(60),
  },
  footerContainer: {
    marginTop: scaleSize(5),
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
    marginBottom: scaleSize(10),
  },
  footerText: {
    fontSize: scaleSize(14),
    color: '#aaa',
  },
  tickView: {
    flexDirection: 'row',
    marginRight: scaleSize(20),
    marginLeft: scaleSize(20),
    marginBottom: scaleSize(10),
  },
  tickLeft: {
    fontSize: scaleSize(18),
    color: 'gray',
  },
  tickRight: {
    color: 'white',
  },
  headerLeft: {
    width: 60,
  },
  backView: {
    alignItems: 'flex-start',
  },
  backImg: {
    width: scaleSize(60),
    height: scaleSize(60),
    marginRight: 3,
  },
  newDot: {
    position: 'absolute',
    backgroundColor: 'red',
    height: scaleSize(15),
    width: scaleSize(15),
    borderRadius: scaleSize(15),
    top: 0,
  },
})
export default Chat
