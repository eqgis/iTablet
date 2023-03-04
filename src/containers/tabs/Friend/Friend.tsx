/**
 * Created by imobile-xzy on 2019/3/4.
 */
/* global GLOBAL */
import React, { Component } from 'react'
import Container from '../../../components/Container'
import {
  TouchableOpacity,
  Image,
  View,
  Text,
  NativeModules,
  NativeEventEmitter,
  Platform,
  AppState,
  // AsyncStorage,
  Switch,
  DeviceEventEmitter,
} from 'react-native'
import { TabView, SceneMap, TabBar as FriendTabBar } from 'react-native-tab-view'
import AsyncStorage from '@react-native-async-storage/async-storage'

// eslint-disable-next-line
import { SMessageService, SOnlineService, SIPortalService, SMap, SCoordination } from 'imobile_for_reactnative'
import NavigationService from '../../NavigationService'
import screen, { scaleSize } from '../../../utils/screen'
import { Toast, OnlineServicesUtils } from '../../../utils'
import { size, color } from '../../../styles'
import { styles } from './Styles'

import { getThemeAssets } from '../../../assets'
import FriendMessage from './FriendMessage/FriendMessage'
import FriendGroup from './FriendGroup/FriendGroup'
import FriendList from './FriendList/FriendList'
import UserType from '../../../constants/UserType'
// import Chat from './Chat/Chat'
import FriendListFileHandle from './FriendListFileHandle'
import InformSpot from './InformSpot'
import AddMore from './AddMore'
import MSGConstant from '../../../constants/MsgConstant'
import { getLanguage } from '../../../language/index'
import MessageDataHandle from './MessageDataHandle'
import { FileTools } from '../../../native'
import { RNFS  } from 'imobile_for_reactnative'
import ConstPath from '../../../constants/ConstPath'
// eslint-disable-next-line import/no-unresolved
import { EventConst } from '../../../constants'
import JPushService from './JPushService'
import { Buffer } from 'buffer'
import SMessageServiceHTTP from './SMessageServiceHTTP'
import TabBar from '../TabBar'
import CoworkInfo from './Cowork/CoworkInfo'
import {
  TaskMemberLocationParams,
  TaskMemberDeleteParams,
} from '../../../redux/models/cowork'
import { getService } from '@/utils/OnlineServicesUtils'
import { LongitudeAndLatitude } from 'imobile_for_reactnative/NativeModule/interfaces/data/SData'
const SMessageServiceiOS = NativeModules.SMessageService
const appUtilsModule = NativeModules.AppUtils
const iOSEventEmitter = new NativeEventEmitter(SMessageServiceiOS)

let g_connectService = false
let count = 0
export default class Friend extends Component {
  props: {
    language: string,
    navigation: Object,
    user: Object,
    appConfig: Object,
    chat: Array,
    device: Object,
    cowork: Object,
    addChat: () => {},
    editChat: () => {},
    setConsumer: () => {},
    setUser: () => {},
    deleteUser: () => {},
    openWorkspace: () => {},
    closeWorkspace: () => {},
    setCoworkNewMessage: () => {},
    readTaskMessage: (params: any) => Promise<any>,
    addInvite: () => {},
    addCoworkMsg: () => void,
    setCoworkGroup: () => void,
    addTaskMessage: () => any,
    addMemberLocation: (params: TaskMemberLocationParams) => any,
    deleteTaskMembers: (params: TaskMemberDeleteParams) => any,
    exitGroup: (params: { groupID: number | string }) => Promise<any>,
  }

  constructor(props) {
    super(props)
    this.friendMessage = {}
    this.friendList = {}
    this.friendGroup = {}
    this.curChat = undefined
    this.curMod = undefined
    MessageDataHandle.setHandle(this.props.addChat)
    // CoworkInfo.setNewMsgHandle(this.props.setCoworkNewMessage)
    CoworkInfo.setReadMsgHandle(this.props.readTaskMessage)
    CoworkInfo.setDeleteHandle(this.props.deleteTaskMembers)
    CoworkInfo.setExitGroupHandle(this.props.exitGroup)
    FriendListFileHandle.refreshCallback = this.refreshList
    FriendListFileHandle.refreshMessageCallback = this.refreshMsg
    this.state = {
      data: [{}],
      bHasUserInfo: false,
      showPop: false,
      openFriends: false,
      currentPage: 1,
      routes: [{
        key: 'FriendMessage',
        title: getLanguage(this.props.language).Friends.MESSAGES,
      }, {
        key: 'FriendList',
        title: getLanguage(this.props.language).Friends.FRIENDS,
      }, {
        key: 'FriendGroup',
        title: getLanguage(this.props.language).Friends.GROUPS,
      }],
    }
    this.messageQueue = []
    AppState.addEventListener('change', this.handleStateChange)
    this.addFileListener()
    this.stateChangeCount = 0
    this._receiveMessage = this._receiveMessage.bind(this)
    global.getFriend = this._getFriend
    this._setHomePath()
  }

  componentDidMount() {
    if (UserType.isOnlineUser(this.props.user.currentUser) || UserType.isIPortalUser(this.props.user.currentUser)) {
      FriendListFileHandle.initLocalFriendList(this.props.user.currentUser)
      //TODO 临时处理，app加载流程修改后在此处进行第一次连接服务
      this.updateServices()
    }
  }

  shouldComponentUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevProps.user) !== JSON.stringify(this.props.user) ||
      JSON.stringify(prevProps.navigation) !== JSON.stringify(this.props.navigation) ||
      JSON.stringify(prevProps.chat) !== JSON.stringify(this.props.chat) ||
      JSON.stringify(prevState) !== JSON.stringify(this.state) ||
      prevProps.language !== this.props.language ||
      JSON.stringify(prevProps.device) !== JSON.stringify(this.props.device)
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.user.currentUser.userName) !==
      JSON.stringify(this.props.user.currentUser.userName)
    ) {
      this.updateServices()
    }
    if (prevProps.language !== this.props.language) {
      this.setState({
        routes: [{
          key: 'FriendMessage',
          title: getLanguage(this.props.language).Friends.MESSAGES,
        }, {
          key: 'FriendList',
          title: getLanguage(this.props.language).Friends.FRIENDS,
        }, {
          key: 'FriendGroup',
          title: getLanguage(this.props.language).Friends.GROUPS,
        }],
      })
    }
  }

  componentWillUnmount() {
    this.removeFileListener()
    AppState.removeEventListener('change', this.handleStateChange)
  }

  _getWidth = () => {
    let width = screen.getScreenWidth(this.props.device.orientation)
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      width = width - scaleSize(96)
    }
    return width
  }

  refreshMsg = () => {
    if (this.friendMessage && this.friendMessage.refresh)
      this.friendMessage.refresh()
  }

  refreshList = () => {
    if (this.friendList && this.friendList.refresh) this.friendList.refresh()
    if (this.friendGroup && this.friendGroup.refresh) this.friendGroup.refresh()
  }

  _getFriend = () => {
    return this
  }

  _setHomePath = async () => {
    global.homePath = await FileTools.appendingHomeDirectory()
  }

  getOnlineGroup = async type => {
    if (type !== 'online' && type !== 'iportal') return
    const servicesUtils = new SCoordination(type)
    servicesUtils.getGroupInfos({
      orderBy: 'CREATETIME',
      orderType: 'DESC',
      pageSize: 10000,
      currentPage: 1,
      keywords: '',
      joinTypes: ['CREATE', 'JOINED'],
    }).then(result => {
      if (result && result.content) {
        const _data = result.content
        this.props.setCoworkGroup(_data)
      }
    })
  }

  initServerInfo = async type => {
    if (type !== 'online' && type !== 'iportal') return
    try {
      this.getOnlineGroup(type)
      const commonPath = await FileTools.appendingHomeDirectory(
        '/iTablet/Common/',
      )
      const servicesUtils = getService(type)
      let data
      let Info, useConfigServer = false
      if (type === 'iportal' && this.props.appConfig.messageServer) {
        data = this.props.appConfig.messageServer
        if (
          data.MSG_IP &&
          data.MSG_Port &&
          data.MSG_HostName &&
          data.MSG_UserName &&
          data.MSG_Password &&
          data.MSG_HTTP_Port &&
          data.FILE_UPLOAD_SERVER_URL &&
          data.FILE_DOWNLOAD_SERVER_URL
        ) {
          Info = data
        }
      } else if (this.props.appConfig.infoServer?.url && this.props.appConfig.infoServer?.fileName) {
        data = this.props.appConfig.infoServer
        useConfigServer = true
      } else {
        data = await servicesUtils.getPublicDataByName(
          '927528',
          'ServerInfo.geojson',
        )
      }
      if (!Info && data && (data.url || data.id !== undefined)) {
        const url =
        data.url || `${servicesUtils.serverUrl}/datas/${data.id}/download`

        const filePath = commonPath + data.fileName

        if (await RNFS.exists(filePath)) {
          await RNFS.unlink(filePath)
        }

        const downloadOptions = {
          fromUrl: url,
          toFile: filePath,
          background: true,
          fileName: data.fileName,
          progressDivider: 1,
        }

        await RNFS.downloadFile(downloadOptions).promise
        let info = await RNFS.readFile(filePath)
        info = await FileTools.decoder(info)
        RNFS.unlink(filePath)
        const serverInfo = JSON.parse(info)
        Info = serverInfo
      }
      if (Info) {
        // Info.MSG_IP = '10.10.192.84'
        SMessageServiceHTTP.setService(Info)
      } else {
        SMessageServiceHTTP.setService()
      }
    } catch (error) {
      SMessageServiceHTTP.setService()
    }
  }

  setCurChat = (chat, time) => {
    //防止replace chat页面时变量设置错误
    if (chat === undefined && time !== this.chatOpenTime) {
      return
    }
    this.curChat = chat
    this.chatOpenTime = time
    if (this.curChat) {
      MessageDataHandle.readMessage({
        //清除未读信息
        userId: this.props.user.currentUser.userName, //当前登录账户的id
        talkId: this.curChat.targetUser.id, //会话ID
      })
    }
  }

  //设置协作模块
  setCurMod = async Module => {
    this.curMod = Module
  }

  addFileListener = () => {
    if (Platform.OS === 'ios') {
      this.receiveFileListener = iOSEventEmitter.addListener(
        EventConst.MESSAGE_SERVICE_RECEIVE_FILE,
        this.onReceiveProgress,
      )
      this.sendFileListener = iOSEventEmitter.addListener(
        EventConst.MESSAGE_SERVICE_SEND_FILE,
        this.onReceiveProgress,
      )
    } else {
      this.receiveFileListener = DeviceEventEmitter.addListener(
        EventConst.MESSAGE_SERVICE_RECEIVE_FILE,
        this.onReceiveProgress,
      )
      this.sendFileListener = DeviceEventEmitter.addListener(
        EventConst.MESSAGE_SERVICE_SEND_FILE,
        this.onReceiveProgress,
      )
    }
  }

  removeFileListener = () => {
    this.receiveFileListener && this.receiveFileListener.remove()
    this.sendFileListener && this.sendFileListener.remove()
  }

  /************************** 处理状态变更 ***********************************/

  handleStateChange = async appState => {
    if (UserType.isOnlineUser(this.props.user.currentUser) || UserType.isIPortalUser(this.props.user.currentUser)) {
      if (appState === 'inactive') {
        return
      }
      const count = this.stateChangeCount + 1
      this.stateChangeCount = count
      await appUtilsModule.pause(2)
      if (this.stateChangeCount !== count) {
        return
      } else if (this.prevAppstate === appState) {
        return
      } else {
        this.prevAppstate = appState
        this.stateChangeCount = 0
        if (appState === 'active') {
          this.restartService()
        } else if (appState === 'background') {
          //切后台延迟断开，应对频繁切后台操作

          this.disconnectService(false,true)
        }
      }
    }
  }

  // eslint-disable-next-line no-unused-vars
  handleNetworkState = state => {
    if (UserType.isOnlineUser(this.props.user.currentUser) || UserType.isIPortalUser(this.props.user.currentUser)) {
      this.restartService()
    }
  }

  startCheckAvailability = async () => {
    //记录本次连接的consumer
    const consumer = await SMessageServiceHTTP.getConsumer(
      this.props.user.currentUser.userName,
    )
    //服务器还没来得及生成，等待
    if (!consumer) {
      setTimeout(this.startCheckAvailability, 2000)
      return
    }
    this.props.setConsumer(consumer)
    this.endCheckAvailability()
    this.checkAvailability = true
    //每隔一分钟查询连接到服务器的consumer
    this.interval = setInterval(async () => {
      try {
        if (!this.checkAvailability) return
        const consumer = await SMessageServiceHTTP.getConsumer(
          this.props.user.currentUser.userName,
        )
        if (!consumer || consumer !== this.props.chat.consumer) {
          this.restartService()
        } else {
          //每分钟发送心跳消息
          this._sendMessage(
            JSON.stringify({
              type: 0,
              user: {
                id: this.props.user.currentUser.userName,
              },
            }),
            this.props.user.currentUser.userName,
            true,
          )
        }
      } catch (e) {
        // console.log(e)
      }
    }, 60000)
  }

  endCheckAvailability = () => {
    this.checkAvailability = false
    this.interval && clearInterval(this.interval)
  }

  /************************** 处理网络连接 ***********************************/

  onUserLoggedin = async () => {
    this.updateServices()
  }

  /**
   * 用户登陆后再更新服务
   * 1.用户登陆：连接服务，开启推送
   * 2.用户登出：断开连接，关闭推送, 重置好友列表
   * 3.用户切换：断开连接，新建连接，更新推送
   */
  updateServices = async () => {
    if(g_connectService){

      await this.disconnectService()
    }
    this.restartService()
    JPushService.init(this.props.user.currentUser.userName)

    // iportal管理员获取是否公开用户列表
    if (UserType.isIPortalUser(this.props.user.currentUser) && this.props.user.currentUser.roles.indexOf('ADMIN') >= 0) {
      const iportalAdminInfoId = await FriendListFileHandle.isAdminOpenFriends()
      if (this.state.openFriends !== !!iportalAdminInfoId) {
        this.setState({
          openFriends: !!iportalAdminInfoId,
        })
      }
    }
    if (this.props.user.currentUser.userName === undefined) {
      FriendListFileHandle.initFriendList(this.props.user.currentUser)
      // CoworkFileHandle.initCoworkList(this.props.user.currentUser)
    }
  }

  restartService = async () => {
    //重复调用，退出
    if (this.restarting) {
      return
    }
    //正在断开连接，等待完成
    if (this.disconnecting) {
      //如果断开中断，就不再重启
      if(this.disconnectBreak){
        return
      }
      setTimeout(this.restartService, 60000)
    } else {
      this.restarting = true
      if(g_connectService){

        (await this.disconnectService(true))
      }

      await this.connectService()
      this.restarting = false
    }
  }

  disconnectService = async (fromRestarting,bDelay) => {
    //重复调用，退出
    if (this.disconnecting) {
      return
    }
    //重启中，等待重启完成
    if (!fromRestarting && this.restarting) {

      setTimeout(this.disconnectService, 3000)
    } else {
      if (!g_connectService) {
        return
      }
      this.disconnecting = true
      this.endCheckAvailability()
      if(bDelay){
        setTimeout(async ()=>{

          if (this.prevAppstate === 'background') {



            await SMessageService.stopReceiveMessage()
            await SMessageService.disconnectionService()
            g_connectService = false
            this.disconnecting = false
          }else if (this.prevAppstate === 'active'){

            this.disconnectBreak = true
          }
        }, 1000*20)
      }else{

        await SMessageService.stopReceiveMessage()
        await SMessageService.disconnectionService()
        g_connectService = false
        this.disconnecting = false
      }

    }
  }

  connectService = async () => {
    if (UserType.isOnlineUser(this.props.user.currentUser) || UserType.isIPortalUser(this.props.user.currentUser)) {
      try {
        await this.initServerInfo(UserType.isOnlineUser(this.props.user.currentUser) ? 'online' : 'iportal')
        const res = await SMessageService.connectService(
          SMessageServiceHTTP.serviceInfo.MSG_IP,
          Number(SMessageServiceHTTP.serviceInfo.MSG_Port),
          SMessageServiceHTTP.serviceInfo.MSG_HostName,
          SMessageServiceHTTP.serviceInfo.MSG_UserName,
          SMessageServiceHTTP.serviceInfo.MSG_Password,
          this.props.user.currentUser.userName,
        )
        if (!res) {
          if(count%600 === 0 || count === 0){
            Toast.show(
              getLanguage(this.props.language).Friends.MSG_SERVICE_FAILED,
            )
          }
          count++
          this.connectService()
        } else {
          count = 0
          //是否有其他连接
          const connection = await SMessageServiceHTTP.getConnection(
            this.props.user.currentUser.userName,
          )
          //是否是login和启动App时调用
          if (global.isLogging) {
            this.loginTime = Date.parse(new Date().toString())
            await this._sendMessage(
              JSON.stringify({
                type: MSGConstant.MSG_LOGOUT,
                user: {},
                time: this.loginTime,
                message: '',
              }),
              this.props.user.currentUser.userName,
            )
            // TODO 防止ios顶号失败
            // 定时器,延迟执行关闭链接操作
            // 等待被顶号的一端接收到消息,并登出后,顶号的一端再创建Connection
            const _time = async function() {
              return new Promise(function(resolve, reject) {
                const timer = setTimeout(function() {
                  resolve('waitting send close message')
                  timer && clearTimeout(timer)
                }, 1000)
              })
            }
            await _time()

            if (connection) {
              // await SMessageService.stopReceiveMessage()
              await SMessageServiceHTTP.closeConnection(connection)
            }
            global.isLogging = false
          } else {
            if (connection) {
              //检查是否之前consumer
              const consumer = await SMessageServiceHTTP.getConsumer(
                this.props.user.currentUser.userName,
              )
              if (this.props.chat.consumer === consumer) {
                await SMessageService.stopReceiveMessage()
                await SMessageServiceHTTP.closeConnection(connection)
              } else {
                this._logout()
                return
              }
            }
          }

          await SMessageService.startReceiveMessage(
            this.props.user.currentUser.userName,
            { callback: this._enqueueMessage },
          )

          this.startCheckAvailability()
          // this._closeCowork()
          g_connectService = true
        }
      } catch (error) {

        // Toast.show(getLanguage(this.props.language).Friends.MSG_SERVICE_FAILED)
        this.disconnectService()
        // this.connectService()
      }
    }
  }

  /**
   * 每次连接时检查是否有未退出的协作
   */
  _closeCowork = async () => {
    try {
      const coworkId = await AsyncStorage.getItem('COWORKID')
      if (this.props.cowork.currentTask.id === '' && coworkId && coworkId !== '') {
        await SMessageService.exitSession(
          this.props.user.currentUser.userName,
          coworkId,
        )
        CoworkInfo.reset()
      }
    } catch (error) {
      //
    }
  }

  /************************** 处理消息 ***********************************/

  _enqueueMessage = message => {
    this.messageQueue.push(message)
    if (!this.consumingMessage) {
      this._startConsumeMessage()
    }
  }

  _startConsumeMessage = async () => {
    this.consumingMessage = true
    try {
      for (; this.messageQueue.length > 0;) {
        await this._receiveMessage(this.messageQueue.shift())
      }
      this.consumingMessage = false
    } catch (error) {
      this.consumingMessage = false
    }
  }

  onReceiveProgress = value => {
    const msg = this.getMsgByMsgId(value.talkId, value.msgId)
    if (msg?.originMsg?.message?.message) {
      msg.originMsg.message.message.progress = value.percentage
      MessageDataHandle.editMessage({
        userId: this.props.user.currentUser.userName,
        talkId: value.talkId,
        msgId: value.msgId,
        editItem: msg,
      })

      if (this.curChat && this.curChat.targetUser.id === value.talkId) {
        this.curChat.onReceiveProgress(value)
      }
    }
  }

  //构造chat页面等需要的targetUser对象
  getTargetUser = targetId => {
    let name = ''
    if (targetId.indexOf('Group_') != -1 && targetId.indexOf('Group_Task_') === -1) {
      name = FriendListFileHandle.getGroup(targetId)?.groupName
    } else if (targetId.indexOf('Group_Task_') === -1) {
      name = FriendListFileHandle.getFriend(targetId)?.markName
    }

    let chatObj = {}
    let friend = {
      id: targetId,
      message: chatObj,
      title: name,
    }

    // eslint-disable-next-line no-prototype-builtins
    if (this.props.chat.hasOwnProperty(this.props.user.currentUser.userName)) {
      const chats = this.props.chat[this.props.user.currentUser.userName]
      // eslint-disable-next-line no-prototype-builtins
      if (chats.hasOwnProperty(targetId)) {
        chatObj = chats[targetId].history
        friend = {
          id: targetId,
          message: chatObj,
          title: name,
        }
      }
    }
    return friend
  }

  createGroupTalk = members => {
    const ctime = new Date()
    const time = Date.parse(ctime)
    const newMembers = JSON.parse(JSON.stringify(members))

    members.unshift({
      id: this.props.user.currentUser.userName,
      name: this.props.user.currentUser.nickname,
    })
    const groupId = 'Group_' + time + '_' + this.props.user.currentUser.userName

    let groupName = ''
    for (let i = 0; i < members.length; i++) {
      if (i > 3) break
      if (i === 0) {
        groupName += members[i].name
      } else {
        groupName += '、' + members[i].name
      }
    }
    FriendListFileHandle.addToGroupList({
      id: groupId,
      members: members,
      groupName: groupName,
      masterID: this.props.user.currentUser.userName,
    })
    const msgObj = {
      user: {
        name: this.props.user.currentUser.nickname,
        id: this.props.user.currentUser.userName,
        groupID: groupId,
        groupName: groupName, //群组消息带个群组名
      },
      type: MSGConstant.MSG_CREATE_GROUP,
      time: time,
      message: {
        oldMembers: [
          {
            id: this.props.user.currentUser.userName,
            name: this.props.user.currentUser.nickname,
          },
        ],
        newMembers: newMembers,
      },
    }
    const msgStr = JSON.stringify(msgObj)
    this._sendMessage(msgStr, groupId, false)
    NavigationService.navigate('Chat', {
      targetId: groupId,
    })
  }

  addGroupMember = (groupId, members) => {
    const ctime = new Date()
    const time = Date.parse(ctime)

    const oldMembers = FriendListFileHandle.readGroupMemberList(groupId)
    FriendListFileHandle.addGroupMember(groupId, members)
    const group = FriendListFileHandle.getGroup(groupId)
    const msgObj = {
      user: {
        name: this.props.user.currentUser.nickname,
        id: this.props.user.currentUser.userName,
        groupID: groupId,
        groupName: group.groupName, //群组消息带个群组名
      },
      type: MSGConstant.MSG_CREATE_GROUP,
      time: time,
      message: {
        oldMembers: oldMembers,
        newMembers: members,
      },
    }
    const msgStr = JSON.stringify(msgObj)
    this._sendMessage(msgStr, groupId, false)
  }

  removeGroupMember = async (groupId, members) => {
    const ctime = new Date()
    const time = Date.parse(ctime)

    const group = FriendListFileHandle.getGroup(groupId)
    const msgObj = {
      user: {
        name: this.props.user.currentUser.nickname,
        id: this.props.user.currentUser.userName,
        groupID: groupId,
        groupName: group.groupName, //群组消息带个群组名
      },
      type: MSGConstant.MSG_REMOVE_MEMBER,
      time: time,
      message: {
        members: members,
      },
    }
    const msgStr = JSON.stringify(msgObj)
    await this._sendMessage(msgStr, groupId, false)

    FriendListFileHandle.removeGroupMember(groupId, members)
    for (let member = 0; member < members.length; member++) {
      SMessageService.exitSession(members[member].id, groupId)
    }
  }

  /**
   * 向好友或群组发送协作邀请
   * @Deprecated
   */
  sendCoworkInvitation = async (talkId, moduleId, mapName) => {
    const time = new Date().getTime()
    const coworkId =
      'Group_' + 'Cowork_' + time + '_' + this.props.user.currentUser.userName
    try {
      const isGroup = talkId.indexOf('Group_') === 0
      let groupId = this.props.user.currentUser.userName
      let groupName = ''
      if (isGroup) {
        const group = FriendListFileHandle.getGroup(talkId)
        groupId = talkId
        groupName = group.groupName
      }
      const msgObj = {
        type: isGroup ? MSGConstant.MSG_GROUP : MSGConstant.MSG_SINGLE,
        time: time,
        user: {
          name: this.props.user.currentUser.nickname,
          id: this.props.user.currentUser.userName,
          groupID: groupId,
          groupName: groupName,
        },
        message: {
          type: MSGConstant.MSG_INVITE_COWORK,
          module: moduleId,
          mapName: mapName,
          coworkId: coworkId,
        },
      }

      CoworkInfo.setId(coworkId)
      CoworkInfo.setGroupId(talkId)
      const member = {
        id: this.props.user.currentUser.userName,
        name: this.props.user.currentUser.nickname,
      }
      // CoworkInfo.addMember(member)
      await SMessageService.declareSession([member], coworkId)
      this.startSendLocation()

      const msgStr = JSON.stringify(msgObj)
      await this._sendMessage(msgStr, talkId, false)
      const msgId = this.getMsgId(talkId)
      this.storeMessage(msgObj, talkId, msgId)
      this.curChat && this.curChat.onReceive(msgId)

      this.props.addInvite({
        userId: this.props.user.currentUser.userName,
        module: moduleId,
        mapName: mapName,
        coworkId: coworkId,
        time: time,
        talkId: talkId,
        user: {
          name: this.props.user.currentUser.nickname,
          id: this.props.user.currentUser.userName,
          groupID: groupId,
          groupName: groupName,
        },
      })
    } catch (error) {
      CoworkInfo.reset()
      SMessageService.exitSession(this.props.user.currentUser.userName, coworkId)
      this.locationTimer && clearInterval(this.locationTimer)
    }
  }

  /**
   * 加入协作
   */
  joinCowork = async (coworkId, talkId) => {
    try {
      const masterId = coworkId.split('_').pop()
      const result = await SMessageServiceHTTP.checkBinding(masterId, coworkId)
      if (result) {
        const msgObj = {
          type: MSGConstant.MSG_COWORK,
          time: new Date().getTime(),
          user: {
            name: this.props.user.currentUser.nickname,
            id: this.props.user.currentUser.userName,
            groupID: coworkId,
            groupName: '',
          },
          message: {
            type: MSGConstant.MSG_JOIN_COWORK,
          },
        }
        const msgStr = JSON.stringify(msgObj)
        await this._sendMessage(msgStr, coworkId, false)
        CoworkInfo.setId(coworkId)
        CoworkInfo.setGroupId(talkId)
        const member = {
          id: this.props.user.currentUser.userName,
          name: this.props.user.currentUser.nickname,
        }
        // CoworkInfo.addMember(member)
        await SMessageService.declareSession([member], coworkId)
        return true
      } else {
        Toast.show(getLanguage(this.props.language).Friends.COWORK_IS_END)
        return false
      }
    } catch (error) {
      CoworkInfo.reset()
      Toast.show(getLanguage(this.props.language).Friends.COWORK_JOIN_FAIL)
      return false
    }
  }

  /**
   * 离开或解散协作
   */
  leaveCowork = async () => {
    try {
      if (this.props.cowork.currentTask.id !== '') {
        const coworkId = this.props.cowork.currentTask.id
        const id = this.props.user.currentUser.userName
        const msgObj = {
          type: MSGConstant.MSG_COWORK,
          time: new Date().getTime(),
          user: {
            name: this.props.user.currentUser.nickname,
            id: id,
            groupID: coworkId,
            groupName: '',
          },
          message: {
            type: MSGConstant.MSG_LEAVE_COWORK,
          },
        }
        const msgStr = JSON.stringify(msgObj)
        await this._sendMessage(msgStr, coworkId, false)
        // await SMessageService.exitSession(id, coworkId)
        CoworkInfo.reset()
        this.locationTimer && clearInterval(this.locationTimer)
      }
    } catch (error) {
      //
    }
  }

  onGeometryAdd = async layerInfo => {
    try {
      if (this.props.cowork.currentTask.id !== '') {
        const geoInfo = await SMap.getUserAddGeometry(
          layerInfo.path,
          this.props.user.currentUser.userName,
        )
        const geometry = geoInfo.geometry
        const geoType = geoInfo.geoType
        const geoID = geoInfo.geoID
        const msgObj = {
          type: MSGConstant.MSG_COWORK,
          time: new Date().getTime(),
          user: {
            name: this.props.user.currentUser.nickname,
            id: this.props.user.currentUser.userName,
            groupID: this.props.cowork.currentTask.id,
            groupName: '',
            coworkGroupId: this.props.cowork.currentTask.groupID,     // online协作群组
            coworkGroupName: this.props.cowork.currentTask.groupName,
            taskId: this.props.cowork.currentTask.id,
          },
          message: {
            type: MSGConstant.MSG_COWORK_ADD,
            layerPath: layerInfo.path,
            layerName: layerInfo.name,
            caption: layerInfo.caption,
            id: geoID,
            geoUserID: this.props.user.currentUser.userName,
            geometry: geometry,
            geoType: geoType,
          },
        }
        const msgStr = JSON.stringify(msgObj)
        await this._sendMessage(msgStr, this.props.cowork.currentTask.id, false)
      }
    } catch (error) {
      //
    }
  }

  onGeometryEdit = async (layerInfo, fieldInfos, id, geoType) => {
    try {
      if (this.props.cowork.currentTask.id !== '') {
        const geometry = await SMap.getUserEditGeometry(layerInfo.path, id)
        let geoUserID = ''
        let geoID = id
        if (fieldInfos) {
          for (let i = 0; i < fieldInfos.length; i++) {
            const fieldInfo = fieldInfos[i]
            if (fieldInfo.name === 'userID') {
              geoUserID = fieldInfo.value
              break
            }
          }
          for (let i = 0; i < fieldInfos.length; i++) {
            const fieldInfo = fieldInfos[i]
            if (fieldInfo.name === 'geoID') {
              geoID = isNaN(fieldInfo.value) || fieldInfo.value === '' ? id : parseInt(fieldInfo.value)
              break
            }
          }
        }
        const msgObj = {
          type: MSGConstant.MSG_COWORK,
          time: new Date().getTime(),
          user: {
            name: this.props.user.currentUser.nickname,
            id: this.props.user.currentUser.userName,
            groupID: this.props.cowork.currentTask.id,     // 任务群组
            groupName: '',
            coworkGroupId: this.props.cowork.currentTask.groupID,     // online协作群组
            coworkGroupName: this.props.cowork.currentTask.groupName,
            taskId: this.props.cowork.currentTask.id,
          },
          message: {
            type: MSGConstant.MSG_COWORK_UPDATE,
            layerPath: layerInfo.path,
            layerName: layerInfo.name,
            caption: layerInfo.caption,
            id: geoID,
            geoUserID: geoUserID,
            geometry: geometry,
            geoType: geoType,
          },
        }
        const msgStr = JSON.stringify(msgObj)
        await this._sendMessage(msgStr, this.props.cowork.currentTask.id, false)
      }
    } catch (error) {
      //
    }
  }

  onThemeLayerAdd = async layerInfo => {
    try {
      if (this.props.cowork.currentTask.id !== '') {
        const layerXML = await SMap.getLayerAsXML(layerInfo.path)
        // let themeXML = await SMap.getLayerThemeXML(layerInfo.path)
        const msgObj = {
          type: MSGConstant.MSG_COWORK,
          time: new Date().getTime(),
          user: {
            name: this.props.user.currentUser.nickname,
            id: this.props.user.currentUser.userName,
            groupID: this.props.cowork.currentTask.id,
            groupName: '',
            coworkGroupId: this.props.cowork.currentTask.groupID,     // online协作群组
            coworkGroupName: this.props.cowork.currentTask.groupName,
            taskId: this.props.cowork.currentTask.id,
          },
          message: {
            type: MSGConstant.MSG_COWORK_ADD,
            layerPath: layerInfo.path,
            layerName: layerInfo.name,
            caption: layerInfo.caption,
            layer: layerXML, // 专题图图层xml
            themeType: layerInfo.themeType,
            isHeatmap: layerInfo.isHeatmap,
            DatasetName: layerInfo.datasetName,
            DatasourceAlias: layerInfo.datasourceAlias,
          },
        }
        // 若创建的是热力图，则传入热力图数据
        if (layerInfo.isHeatmap) {
          msgObj.message.layerHeatmap = layerInfo.layerHeatmap
        }
        const msgStr = JSON.stringify(msgObj)
        await this._sendMessage(msgStr, this.props.cowork.currentTask.id, false)
      }
    } catch (error) {
      //
    }
  }

  /**
   * 发送专题图修改信息
   * @param {*} layerInfo 图层信息
   */
  onThemeEdit = async layerInfo => {
    try {
      if (this.props.cowork.currentTask.id !== '') {
        const msgObj = {
          type: MSGConstant.MSG_COWORK,
          time: new Date().getTime(),
          user: {
            name: this.props.user.currentUser.nickname,
            id: this.props.user.currentUser.userName,
            groupID: this.props.cowork.currentTask.id,     // 任务群组
            groupName: '',
            coworkGroupId: this.props.cowork.currentTask.groupID,     // online协作群组
            coworkGroupName: this.props.cowork.currentTask.groupName,
            taskId: this.props.cowork.currentTask.id,
          },
          message: {
            type: MSGConstant.MSG_COWORK_UPDATE,
            layerPath: layerInfo.path,
            layerName: layerInfo.name,
            caption: layerInfo.caption,
            // theme: themeXML, // 专题图xml
            themeType: layerInfo.themeType,
            isHeatmap: layerInfo.isHeatmap,
          },
        }
        if (layerInfo.isHeatmap) {
          const _layerInfo = await SMap.getLayerInfo(layerInfo.path)
          msgObj.message.layerHeatmap = _layerInfo.layerHeatmap
        } else {
          const themeXML = await SMap.getLayerThemeXML(layerInfo.path)
          msgObj.message.theme = themeXML
        }
        const msgStr = JSON.stringify(msgObj)
        await this._sendMessage(msgStr, this.props.cowork.currentTask.id, false)
      }
    } catch (error) {
      //
    }
  }

  onGeometryDelete = async (layerInfo, fieldInfos, geoID, geoType) => {
    try {
      if (this.props.cowork.currentTask.id !== '') {
        let geoUserID = ''
        if (fieldInfos) {
          for (let i = 0; i < fieldInfos.length; i++) {
            const fieldInfo = fieldInfos[i]
            if (fieldInfo.name === 'userID') {
              geoUserID = fieldInfo.value
              break
            }
          }
        }
        const msgObj = {
          type: MSGConstant.MSG_COWORK,
          time: new Date().getTime(),
          user: {
            name: this.props.user.currentUser.nickname,
            id: this.props.user.currentUser.userName,
            groupID: this.props.cowork.currentTask.id,
            groupName: '',
            coworkGroupId: this.props.cowork.currentTask.groupID,     // online协作群组
            coworkGroupName: this.props.cowork.currentTask.groupName,
            taskId: this.props.cowork.currentTask.id,
          },
          message: {
            type: MSGConstant.MSG_COWORK_DELETE,
            layerPath: layerInfo.path,
            layerName: layerInfo.name,
            caption: layerInfo.caption,
            id: geoID,
            geoUserID: geoUserID,
            // geometry: geoXML,
            geoType: geoType,
          },
        }
        const msgStr = JSON.stringify(msgObj)
        await this._sendMessage(msgStr, this.props.cowork.currentTask.id, false)
      }
    } catch (error) {
      //
    }
  }

  /**
   * 开始发送位置
   * @param {*} forceShow 第一次是否强制显示
   */
  startSendLocation = (forceShow = false) => {
    this.sendCurrentLocation(forceShow)
    this.locationTimer = setInterval(() => {
      this.sendCurrentLocation()
    }, 3000)
  }

  getDistance = (p1: LongitudeAndLatitude, p2: LongitudeAndLatitude) => {
    //经纬度差值转距离 单位 m
    const R = 6371393
    return Math.abs(
      ((p2.longitude - p1.longitude) *
        Math.PI *
        R *
        Math.cos((((p2.latitude + p1.latitude) / 2) * Math.PI) / 180)) /
      180,
    )
  }

  /**
   * 发送当前位置
   * @param {*} forceShow 是否强制显示
   */
  sendCurrentLocation = async (forceShow = false) => {
    try {
      if (this.props.cowork.currentTask.id !== '') {
        const location = await SMap.getCurrentLocation()
        if (
          !forceShow &&
          this.lastLocation &&
          this.getDistance(location, this.lastLocation) < 5
        ) {
          return
        }

        let initial = getLanguage(this.props.language).Friends.SELF
        if (initial.length > 2) {
          initial = initial.slice(0, 2)
        }
        this.props.addMemberLocation({
          groupId: this.props.cowork.currentTask.groupID,
          taskId: this.props.cowork.currentTask.id,
          memberId: this.props.user.currentUser.userName,
          show: true,
          location: {
            longitude: location.longitude,
            latitude: location.latitude,
            initial,
          },
        }).then(async result => {
          const coworkId = this.props.cowork.currentTask.id
          const msgObj = {
            type: MSGConstant.MSG_COWORK,
            time: new Date().getTime(),
            user: {
              name: this.props.user.currentUser.nickname,
              id: this.props.user.currentUser.userName,
              groupID: coworkId,
              groupName: '',
              coworkGroupId: this.props.cowork.currentTask.groupID,     // online协作群组
              coworkGroupName: this.props.cowork.currentTask.groupName,
              taskId: this.props.cowork.currentTask.id,
            },
            message: {
              type: MSGConstant.MSG_COWORK_GPS,
              longitude: location.longitude,
              latitude: location.latitude,
            },
          }
          const msgStr = JSON.stringify(msgObj)
          await this._sendMessage(msgStr, coworkId, false)

          this.lastLocation = location
        })
        // let currentTaskInfo = this.props.cowork.coworkInfo?.[this.props.user.currentUser.userName]?.[this.props.cowork.currentTask.groupID]?.[this.props.cowork.currentTask.id]
        // let isRealTime = currentTaskInfo?.isRealTime === undefined ? false : currentTaskInfo.isRealTime
        // if (
        //   isRealTime &&
        //   // CoworkInfo.isRealTime &&
        //   CoworkInfo.isUserShow(this.props.user.currentUser.userName)
        // ) {
        //   let initial = getLanguage(this.props.language).Friends.SELF
        //   if (initial.length > 2) {
        //     initial = initial.slice(0, 2)
        //   }
        //   this.props.setMemberShow()
        //   CoworkInfo.setUserLocation(this.props.user.currentUser.userName, {
        //     longitude: location.longitude,
        //     latitude: location.latitude,
        //     initial,
        //   })
        //   SMap.addLocationCallout(
        //     location.longitude,
        //     location.latitude,
        //     this.props.user.currentUser.nickname,
        //     this.props.user.currentUser.userName,
        //     initial,
        //   )
        // }
        // SMap.addUserTrack(
        //   location.longitude,
        //   location.latitude,
        //   this.props.user.currentUser.userName,
        // )
      }
    } catch (error) {
      //
    }
  }

  isGroupMsg = messageObj => {
    const type = messageObj.type
    if (
      type === MSGConstant.MSG_GROUP ||
      type === MSGConstant.MSG_MODIFY_GROUP_NAME ||
      type === MSGConstant.MSG_CREATE_GROUP ||
      type === MSGConstant.MSG_REMOVE_MEMBER ||
      type === MSGConstant.MSG_DISBAND_GROUP
    ) {
      return true
    }
    return false
  }

  _sendMessage = async (messageStr, talkId, bSilent = false, cb) => {
    try {
      const messageObj = JSON.parse(messageStr)
      const talkIds = []
      let queueExist = true
      if (this.isGroupMsg(messageObj)) {
        const members = FriendListFileHandle.readGroupMemberList(talkId)
        await SMessageService.declareSession(members, talkId)
        for (let key = 0; key < members.length; key++) {
          talkIds.push(members[key].id)
        }
        queueExist = await SMessageServiceHTTP.declareSession(talkId, members, true)

      } else if (messageObj.type !== MSGConstant.MSG_COWORK) {
        talkIds.push(talkId)
        queueExist = await SMessageServiceHTTP.declare('Message_' + talkId, true)

      } else if (talkId.includes('Group_Task_') && global.coworkMode) {
        const currentTaskInfo = this.props.cowork.coworkInfo?.[this.props.user.currentUser.userName]?.[this.props.cowork.currentTask.groupID]?.[this.props.cowork.currentTask.id]
        queueExist = currentTaskInfo.members && await SMessageServiceHTTP.declareSession(talkId, currentTaskInfo.members, true)

      }
      if (!queueExist) {

        Toast.show(getLanguage(this.props.language).Friends.MSG_SERVICE_FAILED)
        return
      }
      //对接桌面
      if (messageObj.type < 10 && typeof messageObj.message === 'string') {
        messageObj.message = Buffer.from(messageObj.message).toString('base64')
      }
      const generalMsg = JSON.stringify(messageObj)

      let result = SMessageService.sendMessage(generalMsg, talkId)

      const timeout = sec => {
        return new Promise(resolve => {
          let timer = setTimeout(() => {
            resolve('timeout')
            clearTimeout(timer)
            timer = null
          }, 1000 * sec)
        })
      }

      const res = await new Promise.race([result, timeout(5)])

      if (res === 'timeout') result = false

      if (messageObj.type !== MSGConstant.MSG_COWORK) {
        result && JPushService.push(messageStr, talkIds)
      }
      if (!bSilent && !result) {
        let option = null
        if (Platform.OS === 'android' && this.curChat) {
          option =
            this.curChat.GiftedChat?._keyboardHeight > 0
              ? { position: 0 }
              : null
        }

        // Toast.show(
        //   getLanguage(this.props.language).Friends.MSG_SERVICE_FAILED,
        //   option,
        // )
      }

      cb && cb(result)
      return result
    } catch (e) {
      if (!bSilent) {
        let option = null
        if (Platform.OS === 'android' && this.curChat) {
          option =
            this.curChat.GiftedChat?._keyboardHeight > 0
              ? { position: 0 }
              : null
        }

        // Toast.show(
        //   getLanguage(this.props.language).Friends.MSG_SERVICE_FAILED,
        //   option,
        // )
      }
      cb && cb(false)
      return false
    }
  }

  storeMessage = (messageObj, talkId, msgId) => {
    const userId = this.props.user.currentUser.userName
    let type = 0
    if (
      messageObj.type === MSGConstant.MSG_SINGLE ||
      messageObj.type === MSGConstant.MSG_GROUP
    ) {
      type = messageObj.message.type
        ? messageObj.message.type
        : MSGConstant.MSG_TEXT
    } else {
      type = messageObj.type
    }
    let bSystem = false
    if (messageObj.type > 9) {
      bSystem = true
    }
    const storeMsg = {
      userId: userId, //用户id
      talkId: talkId, //对方或群组id
      msgId: msgId, //消息id
      type: type,
      originMsg: messageObj, //原始消息体
      text: '', //消息要显示的文字信息
      unReadMsg: messageObj.unReadMsg, //消息已读未读
      system: bSystem,
    }

    MessageDataHandle.pushMessage(storeMsg)
    return storeMsg
  }

  loadMsgByMsgId = (talkId, msgId) => {
    const msg = this.getMsgByMsgId(talkId, msgId)
    return this.loadMsg(msg)
  }

  loadMsg = msg => {
    let text = ''
    switch (msg.type) {
      case MSGConstant.MSG_TEXT:
        text = msg.originMsg.message
        break
      case MSGConstant.MSG_ACCEPT_FRIEND:
        text = getLanguage(this.props.language).Friends.SYS_FRIEND_REQ_ACCEPT
        break
      case MSGConstant.MSG_REJECT:
        text = getLanguage(this.props.language).Friends.SYS_MSG_REJ
        break
      case MSGConstant.MSG_PICTURE:
        text = getLanguage(this.props.language).Friends.SYS_MSG_PIC
        break
      case MSGConstant.MSG_MAP:
        text = getLanguage(this.props.language).Friends.SYS_MSG_MAP
        break
      case MSGConstant.MSG_LAYER:
        text = getLanguage(this.props.language).Friends.SYS_MSG_LAYER
        break
      case MSGConstant.MSG_DATASET:
        text = getLanguage(this.props.language).Friends.SYS_MSG_DATASET
        break
      case MSGConstant.MSG_LOCATION:
        text = msg.originMsg.message.message.message
        break
      case MSGConstant.MSG_ADD_FRIEND:
        text = getLanguage(this.props.language).Friends.SYS_MSG_ADD_FRIEND
        break
      case MSGConstant.MSG_REMOVE_MEMBER:
        {
          const memberList = []
          let isInList = false
          for (
            let member = 0;
            member < msg.originMsg.message.members.length;
            member++
          ) {
            memberList.push(msg.originMsg.message.members[member].name)
            if (
              msg.originMsg.message.members[member].id ===
              this.props.user.currentUser.userName
            ) {
              isInList = true
            }
          }
          if (isInList) {
            text =
              msg.originMsg.user.name +
              getLanguage(this.props.language).Friends
                .SYS_MSG_REMOVED_FROM_GROUP
          } else if (
            msg.originMsg.message.members.length === 1 &&
            msg.originMsg.message.members[0].id === msg.originMsg.user.id
          ) {
            text =
              msg.originMsg.user.name +
              getLanguage(this.props.language).Friends.SYS_MSG_LEAVE_GROUP
          } else {
            let memberStr = ''
            for (let key = 0; key < memberList.length; key++) {
              memberStr += memberList[key] + ' '
              if (key > 5) {
                memberStr += getLanguage(this.props.language).Friends
                  .SYS_MSG_ETC
                break
              }
            }
            text =
              msg.originMsg.user.name +
              getLanguage(this.props.language).Friends
                .SYS_MSG_REMOVE_OUT_GROUP +
              memberStr +
              getLanguage(this.props.language).Friends.SYS_MSG_REMOVE_OUT_GROUP2
          }
        }
        break
      case MSGConstant.MSG_CREATE_GROUP:
        {
          let memberStr = ''
          for (
            let member = 0;
            member < msg.originMsg.message.newMembers.length;
            member++
          ) {
            memberStr += msg.originMsg.message.newMembers[member].name + ' '
            if (member > 5) {
              memberStr += getLanguage(this.props.language).Friends.SYS_MSG_ETC
              break
            }
          }
          text =
            msg.originMsg.user.name +
            getLanguage(this.props.language).Friends.SYS_MSG_ADD_INTO_GROUP +
            memberStr +
            getLanguage(this.props.language).Friends.SYS_MSG_ADD_INTO_GROUP2
        }
        break
      case MSGConstant.MSG_MODIFY_GROUP_NAME:
        text =
          msg.originMsg.user.name +
          getLanguage(this.props.language).Friends.SYS_MSG_MOD_GROUP_NAME +
          msg.originMsg.message.name
        break
      case MSGConstant.MSG_INVITE_COWORK:
        text =
          msg.originMsg.user.name +
          getLanguage(this.props.language).Friends.SYS_INVITE_TO_COWORK
        break
      case MSGConstant.MSG_ARMAP:
        text = `[${getLanguage().Profile.ARMAP}]`
        break
      case MSGConstant.MSG_AREFFECT:
        text = `[${getLanguage().Profile.AREFFECT}]`
        break
      case MSGConstant.MSG_ARMODAL:
        text = `[${getLanguage().Profile.ARMODEL}]`
        break
      case MSGConstant.MSG_DATASOURCE:
        text = `[${getLanguage().Analyst_Labels.DATA_SOURCE}]`
        break
      case MSGConstant.MSG_SYMBOL:
        text = `[${getLanguage().Profile.SYMBOL}]`
        break
      case MSGConstant.MSG_COLORSCHEME:
        text = `[${getLanguage().Profile.COLOR_SCHEME}]`
        break
      case MSGConstant.MSG_AI_MODEL:
        text = `[${getLanguage().Profile.AIMODEL}]`
        break
      case MSGConstant.MSG_TEMPLATE_PLOT:
        text = `[${getLanguage().Profile.PLOTTING_TEMPLATE}]`
        break
      case MSGConstant.MSG_TEMPLATE_MAP:
        text = `[${getLanguage().Profile.MAP_TEMPLATE}]`
        break
      default:
        break
    }
    msg.text = text
    return msg
  }

  getMsgId = talkId => {
    const userId = this.props.user.currentUser.userName
    let msgId = 0
    let chatHistory = []
    if (this.props.chat[userId] && this.props.chat[userId][talkId]) {
      chatHistory = this.props.chat[userId][talkId].history
    }
    if (chatHistory.length !== 0) {
      msgId = chatHistory[chatHistory.length - 1].msgId + 1
    }
    return msgId
  }

  getMsgByMsgId = (talkId, msgId) => {
    const userId = this.props.user.currentUser.userName
    let chatHistory = []
    let msg = undefined
    if (this.props.chat[userId] && this.props.chat[userId][talkId]) {
      chatHistory = this.props.chat[userId][talkId].history
    }
    if (chatHistory.length !== 0) {
      msg = chatHistory[msgId]
    }
    return msg
  }

  getMsgFromTime = (talkId, fromTime) => {
    const userId = this.props.user.currentUser.userName
    let chatHistory = []
    const msgs = []
    if (this.props.chat[userId] && this.props.chat[userId][talkId]) {
      chatHistory = this.props.chat[userId][talkId].history
    }
    if (chatHistory.length !== 0) {
      for (let i = chatHistory.length - 1; i >= 0; i--) {
        if (chatHistory[i].originMsg.time > fromTime) {
          msgs.unshift(chatHistory[i])
        } else {
          break
        }
      }
    }
    return msgs
  }

  /**
   * 使用rabbitMQ发送
   */
  _sendFile = (messageStr, filepath, talkId, msgId, informMsg, cb) => {
    const connectInfo = SMessageServiceHTTP.serviceInfo
    SMessageService.sendFileWithMQ(
      JSON.stringify(connectInfo),
      messageStr,
      filepath,
      talkId,
      msgId,
    ).then(res => {
      const msg = this.getMsgByMsgId(talkId, msgId)
      msg.originMsg.message.message.queueName = res.queueName
      MessageDataHandle.editMessage({
        userId: this.props.user.currentUser.userName,
        talkId: talkId,
        msgId: msgId,
        editItem: msg,
      })

      informMsg.message.message.queueName = res.queueName
      // informMsg.message.type=3       要给桌面发文件需要将类型改为3
      this._sendMessage(JSON.stringify(informMsg), talkId, false)
      cb && cb()
    })
  }

  /**
   * 发送到第三方服务器
   */
  sendFile = async (message, filePath, talkId, msgId, cb) => {
    try {
      const res = await SMessageService.sendFileWithThirdServer(
        SMessageServiceHTTP.serviceInfo.FILE_UPLOAD_SERVER_URL,
        filePath,
        this.props.user.currentUser.userName,
        talkId,
        msgId,
      )

      const msg = this.getMsgByMsgId(talkId, msgId)
      msg.originMsg.message.message.queueName = res.queueName
      MessageDataHandle.editMessage({
        userId: this.props.user.currentUser.userName,
        talkId: talkId,
        msgId: msgId,
        editItem: msg,
      })

      message.message.message.queueName = res.queueName
      this._sendMessage(JSON.stringify(message), talkId, false)
      cb && cb(true)
    } catch (error) {
      cb && cb(false)
    }
  }

  /**
   * 接收RabbitMQ上的文件
   */
  _receiveFile = async (
    fileName,
    queueName,
    receivePath,
    talkId,
    msgId,
    cb,
  ) => {
    if (g_connectService) {
      try {
        const homePath = await FileTools.appendingHomeDirectory()
        const res = await SMessageService.receiveFileWithMQ(
          fileName,
          queueName,
          homePath + receivePath,
          talkId,
          msgId,
        )
        const message = this.props.chat[this.props.user.currentUser.userName][
          talkId
        ].history[msgId]
        if (res === true) {
          Toast.show(getLanguage(this.props.language).Friends.RECEIVE_SUCCESS)
          message.originMsg.message.message.filePath =
            receivePath + '/' + fileName
          MessageDataHandle.editMessage({
            userId: this.props.user.currentUser.userName,
            talkId: talkId,
            msgId: msgId,
            editItem: message,
          })
        } else {
          Toast.show(
            getLanguage(this.props.language).Friends.RECEIVE_FAIL_EXPIRE,
          )
          FileTools.deleteFile(homePath + receivePath + '/' + fileName)
        }
        if (cb && typeof cb === 'function') {
          cb(res)
        }
      } catch (error) {
        Toast.show(
          getLanguage(this.props.language).Friends.RECEIVE_FAIL_NETWORK,
        )
        if (cb && typeof cb === 'function') {
          cb(false)
        }
      }
    } else {
      Toast.show(getLanguage(this.props.language).Friends.RECEIVE_FAIL_NETWORK)
      if (cb && typeof cb === 'function') {
        cb(false)
      }
    }
  }

  /**
   * 接收第三方服务器的文件
   */
  receiveFile = async (chatMessage, receivePath, fileName, talkId, cb) => {
    try {
      const homePath = await FileTools.appendingHomeDirectory()
      const res = await SMessageService.receiveFileWithThirdServer(
        SMessageServiceHTTP.serviceInfo.FILE_DOWNLOAD_SERVER_URL,
        chatMessage.originMsg.user.id,
        chatMessage.originMsg.message.message.queueName,
        chatMessage.originMsg.message.message.fileSize,
        homePath + receivePath,
        fileName,
        talkId,
        chatMessage._id,
      )

      const message = this.props.chat[this.props.user.currentUser.userName][talkId]
        .history[chatMessage._id]
      if (res === true) {
        Toast.show(getLanguage(this.props.language).Friends.RECEIVE_SUCCESS)
        message.originMsg.message.message.filePath =
          receivePath + '/' + fileName
        MessageDataHandle.editMessage({
          userId: this.props.user.currentUser.userName,
          talkId: talkId,
          msgId: chatMessage._id,
          editItem: message,
        })
      } else {
        Toast.show(getLanguage(this.props.language).Friends.RECEIVE_FAIL_EXPIRE)
        FileTools.deleteFile(homePath + receivePath + '/' + fileName)
      }
      if (cb && typeof cb === 'function') {
        cb(res)
      }
    } catch (error) {
      Toast.show(getLanguage(this.props.language).Friends.RECEIVE_FAIL_NETWORK)
      if (cb && typeof cb === 'function') {
        cb(false)
      }
    }
  }

  _logout = async (message = '') => {
    try {
      if (UserType.isOnlineUser(this.props.user.currentUser)) {
        SOnlineService.logout()
      } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
        SIPortalService.logout()
      }
      global.coworkMode = false
      if (this.props.cowork.currentTask.id !== '' && this.props.cowork.currentTask.id !== undefined) {
        this.leaveCowork()
      }
      this.props.closeWorkspace(async () => {
        SOnlineService.removeCookie()
        const customPath = await FileTools.appendingHomeDirectory(
          ConstPath.CustomerPath +
          ConstPath.RelativeFilePath.Workspace[
            this.props.language === 'CN' ? 'CN' : 'EN'
          ],
        )
        this.props.deleteUser(this.props.user.currentUser)
        this.props.setUser({
          userName: 'Customer',
          nickname: 'Customer',
          userType: UserType.PROBATION_USER,
        })
        // NavigationService.popToTop('Tabs')
        NavigationService.navigate('Tabs', {screen: 'Home'})
        this.props.openWorkspace({ server: customPath })
        Toast.show(
          message === ''
            ? getLanguage(this.props.language).Friends.SYS_LOGIN_ON_OTHER_DEVICE
            : message,
        )
      })
    } catch (e) {
      //
    }
  }

  handleCowork = async messageObj => {
    // let coworkId = this.props.cowork?.currentTask?.id
    let coworkId
    const userTasks = this.props.cowork?.tasks?.[this.props.user.currentUser.userName] || {}
    const groupTask = userTasks[messageObj?.user?.coworkGroupId] || []
    for (let i = 0; i < groupTask.length; i++) {
      if (groupTask[i].id === messageObj?.user?.taskId) {
        coworkId = groupTask[i].id
        break
      }
    }
    const coworkType = messageObj.message.type
    if (coworkId) {

      if (messageObj.user.groupID === coworkId) {
        if (coworkType === MSGConstant.MSG_COWORK_GPS) {
          this.props.addMemberLocation({
            groupId: messageObj.user.coworkGroupId,
            taskId: messageObj.user.taskId,
            memberId: messageObj.user.id,
            show: true,
            location: {
              longitude: messageObj.message.longitude,
              latitude: messageObj.message.latitude,
              initial: messageObj.user.name,
            },
          })
        } else {
          /**
           * 对象添加更改的协作消息
           */
          // CoworkInfo.pushMessage(messageObj)
          this.props.addTaskMessage(messageObj)
        }
      }
    }
    // 同意加入群组消息
    if (coworkType === MSGConstant.MSG_ONLINE_GROUP_APPLY_AGREE) {
      CoworkInfo.getGroupHandle && CoworkInfo.getGroupHandle()
    } else if (
      coworkType === MSGConstant.MSG_ONLINE_GROUP_DELETE ||
      coworkType === MSGConstant.MSG_ONLINE_MEMBER_DELETE
    ) {
      CoworkInfo.deleteGroupHandle && CoworkInfo.deleteGroupHandle(messageObj)
    }
  }

  /**
   * 检查当前接收的消息是否是在线协作消息，并判断用户是否存在当前在线协作群组，若不存在，则退出群组
   * @param {any} messageObj
   */
  checkGroup = async messageObj => {
    let exist = false
    // let msgId = messageObj.user.groupID || messageObj.id
    const msgId = messageObj.id + ''
    if (msgId && msgId.indexOf('Group_Task_') >= 0) {
      const onlineGroups = this.props.cowork.groups[this.props.user.currentUser.userName]
      for (let i = 0; i < onlineGroups?.length; i++) {
        if (msgId.includes(onlineGroups[i].id)) {
          exist = true
          break
        }
      }
      if (!exist) {
        await SMessageService.exitSession(
          this.props.user.currentUser.userName,
          msgId,
        )
      }
      return exist
    }
    return true
  }

  async _receiveMessage(message) {
    const messageObj = JSON.parse(message['message'])

    const exist = await this.checkGroup(messageObj)
    if (!exist) return

    // messageObj.message.type=6;   桌面发送的文件类型是3，要接收桌面发送过来的文件需要把type改为6
    // messageObj.message.message.progress=0;    桌面发送的数据没有progress参数，不能显示进度
    if (messageObj.type === MSGConstant.MSG_LOGOUT) {
      if (messageObj.time !== this.loginTime) {
        this._logout()
      }
      return
    }
    const userId = this.props.user.currentUser.userName
    if (userId === messageObj.user.id) {
      //自己的消息，返回
      return
    }

    //对接桌面
    if (messageObj.type < 10 && typeof messageObj.message === 'string') {
      messageObj.message = Buffer.from(messageObj.message, 'base64').toString()
    }

    if (messageObj.type === MSGConstant.MSG_COWORK) {
      await this.handleCowork(messageObj)
      return
    } else if (
      typeof messageObj.type === 'number' &&
      Math.floor(messageObj.type / 100) === MSGConstant.MSG_ONLINE_GROUP / 100
      // messageObj.type === MSGConstant.MSG_ONLINE_GROUP
    ) {
      this.props.addCoworkMsg(messageObj)
      return
    }

    let bSystem = false
    let bUnReadMsg = false
    let msgId = 0
    let bSysStore = false //系统消息是否保存
    let bSysShow = false //系统消息是否显示在聊天窗口
    //系统消息
    if (messageObj.type > 9) {
      bSystem = true
    }
    if (
      !this.curChat ||
      this.curChat.targetUser.id !== messageObj.user.groupID //个人会话这个ID和groupID是同一个，就用一个吧
    ) {
      bUnReadMsg = true
    }

    if (messageObj.type === MSGConstant.MSG_ADD_FRIEND) {
      msgId = this.getMsgId(1)
    } else if (this.isGroupMsg(messageObj)) {
      msgId = this.getMsgId(messageObj.user.groupID)
    } else if (messageObj.type !== MSGConstant.MSG_COWORK) {
      msgId = this.getMsgId(messageObj.user.id)
    }

    if (!bSystem) {
      if (messageObj.user.groupID.indexOf('Group_Task_') === 0) {
        // 协作群组消息不作处理
      } else
      //普通消息
      if (messageObj.type === 2) {
        //处理群组消息
        const obj = FriendListFileHandle.findFromGroupList(
          messageObj.user.groupID,
        )
        if (!obj) {
          return
        }
      } else {
        //处理单人消息
        const isFriend = FriendListFileHandle.getIsFriend(messageObj.user.id)
        if (!UserType.isIPortalUser(this.props.user.currentUser) && (isFriend === undefined || isFriend === 0)) {
          //非好友,正常情况下不应该收到非好友的消息，收到后让对方删除
          const delMessage = {
            message: '',
            type: MSGConstant.MSG_DEL_FRIEND,
            user: {
              name: this.props.user.currentUser.userName,
              id: this.props.user.currentUser.userName,
              groupID: this.props.user.currentUser.userName,
            },
            time: Date.parse(new Date()),
          }
          // SMessageService.sendMessage(
          //   JSON.stringify(delMessage),
          //   messageObj.user.id,
          // )
          SMessageServiceHTTP.sendMessage(
            delMessage,
            [messageObj.user.id],
          )

          const rejMessage = {
            message: '',
            type: MSGConstant.MSG_REJECT,
            user: {
              name: this.props.user.currentUser.userName,
              id: this.props.user.currentUser.userName,
              groupID: this.props.user.currentUser.userName,
            },
            time: Date.parse(new Date()),
          }
          // SMessageService.sendMessage(
          //   JSON.stringify(rejMessage),
          //   messageObj.user.id,
          // )
          SMessageServiceHTTP.sendMessage(
            rejMessage,
            [messageObj.user.id],
          )
          return
        }
      }
      if (
        messageObj.message.type &&
        messageObj.message.type === MSGConstant.MSG_INVITE_COWORK
      ) {
        this.props.addInvite({
          userId: this.props.user.currentUser.userName,
          module: messageObj.message.module,
          mapName: messageObj.message.mapName,
          coworkId: messageObj.message.coworkId,
          user: messageObj.user,
          time: messageObj.time,
          talkId: messageObj.user.groupID,
        })
      }
    } else {
      //系统消息，做处理机制
      const isFriend = FriendListFileHandle.getIsFriend(messageObj.user.groupID)
      const time = Date.parse(new Date())
      /*
       * 添加好友
       */
      if (messageObj.type === MSGConstant.MSG_ADD_FRIEND) {
        if (isFriend === undefined) {
          bSysStore = true
          messageObj.consumed = false
        } else if (isFriend === 0 || isFriend === 2) {
          await FriendListFileHandle.modifyIsFriend(messageObj.user.groupID, 1)
          const message = {
            message: '',
            type: MSGConstant.MSG_ACCEPT_FRIEND,
            user: {
              name: this.props.user.currentUser.userName,
              id: this.props.user.currentUser.userName,
              groupID: this.props.user.currentUser.userName,
              groupName: '',
            },
            time: time,
          }
          // SMessageService.sendMessage(
          //   JSON.stringify(message),
          //   messageObj.user.id,
          // )
          SMessageServiceHTTP.sendMessage(
            message,
            [messageObj.user.id],
          )
        } else if (isFriend === 1) {
          const message = {
            message: '',
            type: MSGConstant.MSG_ACCEPT_FRIEND,
            user: {
              name: this.props.user.currentUser.userName,
              id: this.props.user.currentUser.userName,
              groupID: this.props.user.currentUser.userName,
              groupName: '',
            },
            time: time,
          }
          // SMessageService.sendMessage(
          //   JSON.stringify(message),
          //   messageObj.user.id,
          // )
          SMessageServiceHTTP.sendMessage(
            message,
            [messageObj.user.id],
          )
        }
      } else if (messageObj.type === MSGConstant.MSG_ACCEPT_FRIEND) {
        /*
         * 同意添加好友
         */
        bSysStore = true
        bSysShow = true
        await FriendListFileHandle.modifyIsFriend(messageObj.user.groupID, 1)
      } else if (messageObj.type === MSGConstant.MSG_DEL_FRIEND) {
        /*
         * 删除好友关系
         */
        await FriendListFileHandle.modifyIsFriend(messageObj.user.groupID, 0)
      } else if (messageObj.type === MSGConstant.MSG_CREATE_GROUP) {
        /*
         * 添加群员
         */
        bSysStore = true
        bSysShow = true
        if (
          FriendListFileHandle.isInGroup(
            messageObj.user.groupID,
            this.props.user.currentUser.userName,
          )
        ) {
          await FriendListFileHandle.addGroupMember(
            messageObj.user.groupID,
            messageObj.message.newMembers,
          )
        } else {
          //加入群
          const members = messageObj.message.oldMembers.concat(
            messageObj.message.newMembers,
          )
          await FriendListFileHandle.addToGroupList({
            id: messageObj.user.groupID,
            members: members,
            groupName: messageObj.user.groupName,
            masterID: messageObj.user.id,
          })
        }
      } else if (messageObj.type === MSGConstant.MSG_REJECT) {
        /*
         * 拒收消息
         */
        bSysStore = isFriend !== undefined
        bSysShow = true
      } else if (messageObj.type === MSGConstant.MSG_REMOVE_MEMBER) {
        /*
         * 移除群员
         */
        bSysStore = true
        bSysShow = true
        let inList = false
        for (
          let member = 0;
          member < messageObj.message.members.length;
          member++
        ) {
          if (
            messageObj.message.members[member].id ===
            this.props.user.currentUser.userName
          ) {
            inList = true
            break
          }
        }
        if (inList) {
          bSysStore = false
          bSysShow = false
          await FriendListFileHandle.delFromGroupList(messageObj.user.groupID)
          MessageDataHandle.delMessage({
            userId: this.props.user.currentUser.userName,
            talkId: messageObj.user.groupID,
          })
          if (
            this.curChat &&
            this.curChat.targetId === messageObj.user.groupID
          ) {
            NavigationService.goBack()
            Toast.show(
              messageObj.user.name +
              getLanguage(this.props.language).Friends
                .SYS_MSG_REMOVED_FROM_GROUP,
            )
          }
        } else {
          await FriendListFileHandle.removeGroupMember(
            messageObj.user.groupID,
            messageObj.message.members,
          )
        }
      } else if (messageObj.type === MSGConstant.MSG_DISBAND_GROUP) {
        /*
         * 解散群
         */
        await FriendListFileHandle.delFromGroupList(messageObj.user.groupID)
        MessageDataHandle.delMessage({
          userId: this.props.user.currentUser.userName,
          talkId: messageObj.user.groupID,
        })
      } else if (messageObj.type === MSGConstant.MSG_MODIFY_GROUP_NAME) {
        /*
         * 修改群名
         */
        bSysStore = true
        bSysShow = true
        await FriendListFileHandle.modifyGroupList(
          messageObj.user.groupID,
          messageObj.message.name,
        )
        this.curChat && this.curChat.onFriendListChanged()
      }
    }

    //保存
    if ((bSystem && bSysStore) || !bSystem) {
      messageObj.unReadMsg = bUnReadMsg
      this.storeMessage(messageObj, messageObj.user.groupID, msgId)
    }
    //显示
    if ((bSystem && bSysShow) || !bSystem) {
      if (this.curChat) {
        //在当前聊天窗口,则显示这条消息
        if (this.curChat.targetUser.id === messageObj.user.groupID) {
          this.curChat.onReceive(msgId)
        } else {
          this.curChat.showInformSpot(true)
        }
      } else {
        JPushService.sendLocalNotification(messageObj)
        // 记录协作聊天消息数量
        if (messageObj.user.groupID.indexOf('Group_Task_') === 0) {
          const _tempMsg = JSON.parse(JSON.stringify(messageObj))
          _tempMsg.type = MSGConstant.MSG_ONLINE_GROUP_CHAT
          this.props.addCoworkMsg({
            type: MSGConstant.MSG_ONLINE_GROUP_CHAT,
            groupId: messageObj.user.coworkGroupId,
            taskId: messageObj.user.groupID,
            message: messageObj.message,
            time: messageObj.time,
          })
        }
      }
    }
  }

  addMore = index => {
    if (index === 1) {
      //add friend
      NavigationService.navigate('AddFriend', {
        user: this.props.user.currentUser,
        friend: this,
        language: this.props.language,
      })
    } else if (index === 2) {
      NavigationService.navigate('CreateGroupChat', {
        user: this.props.user.currentUser,
        friend: this,
        language: this.props.language,
      })
    } else if (index === 3) {
      NavigationService.navigate('RecommendFriend', {
        user: this.props.user.currentUser,
        friend: this,
        language: this.props.language,
      })
    }
  }

  goToPage = index => {
    this.state.currentPage !== index &&
      this.setState({
        currentPage: index,
      })
  }

  renderTabBar = () => {
    return <TabBar navigation={this.props.navigation} currentRoute={'Friend'} />
  }

  renderIPortalAdminView = () => {
    if (!UserType.isIPortalUser(this.props.user.currentUser)) return null
    if (this.props.user.currentUser.roles?.indexOf('ADMIN') < 0) return null
    return (
      <View
        style={{
          backgroundColor: color.itemColorGray2,
          flexDirection: 'row',
          alignItems: 'center',
          height: scaleSize(80),
          paddingHorizontal: scaleSize(30),
        }}
      >
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: scaleSize(26), marginLeft: scaleSize(40) }}>{getLanguage(this.props.language).Friends.PUBLIC_FRIENDS}</Text>
        </View>
        <Switch
          trackColor={{ false: color.bgG, true: color.switch }}
          thumbColor={this.state.openFriends ? color.bgW : color.bgW}
          ios_backgroundColor={
            this.state.openFriends ? color.switch : color.bgG
          }
          value={this.state.openFriends}
          onValueChange={value => {
            this.setState({
              openFriends: value,
            }, () => {
              if (value) {
                FriendListFileHandle.uploadAdminInfo()
              } else {
                FriendListFileHandle.deleteAdminInfo()
              }
            })
          }}
        />
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        hideInBackground={false}
        showFullInMap={true}
        headerProps={{
          title: getLanguage(this.props.language).Navigator_Label.ADDRESS_BOOK,
          headerStyle: { borderBottomWidth: 0 },
          headerRight:
            this.props.user.currentUser.userType === UserType.COMMON_USER || this.props.user.currentUser.userType === UserType.IPORTAL_COMMON_USER ? (
              <TouchableOpacity
                style={styles.addFriendView}
                onPress={() => {
                  this.setState({ showPop: true })
                }}
              >
                <Image
                  source={getThemeAssets().friend.add_friends}
                  style={styles.addFriendImg}
                />
              </TouchableOpacity>
            ) : null,
          withoutBack: true,
          navigation: this.props.navigation,
        }}
        bottomBar={this.renderTabBar()}
      >
        {this.renderIPortalAdminView()}
        {this.props.user.currentUser.userType === UserType.COMMON_USER || this.props.user.currentUser.userType === UserType.IPORTAL_COMMON_USER
          ? this.renderTab()
          : this.renderNOFriend()}
        <AddMore
          show={this.state.showPop}
          device={this.props.device}
          user={this.props.user.currentUser}
          closeModal={show => {
            this.setState({ showPop: show })
          }}
          addMore={this.addMore}
        />
      </Container>
    )
  }

  renderScene = SceneMap({
    'FriendMessage': () => (
      <FriendMessage
        ref={ref => (this.friendMessage = ref)}
        tabLabel={getLanguage(this.props.language).Friends.MESSAGES}
        //"消息"
        language={this.props.language}
        user={this.props.user.currentUser}
        chat={this.props.chat}
        friend={this}
      />
    ),
    'FriendList': () => (
      <FriendList
        ref={ref => (this.friendList = ref)}
        tabLabel={getLanguage(this.props.language).Friends.FRIENDS}
        //"好友"
        language={this.props.language}
        user={this.props.user.currentUser}
        friend={this}
      />
    ),
    'FriendGroup': () => (
      <FriendGroup
        ref={ref => (this.friendGroup = ref)}
        tabLabel={getLanguage(this.props.language).Friends.GROUPS}
        //"群组"
        language={this.props.language}
        user={this.props.user.currentUser}
        friend={this}
        joinTypes={['CREATE', 'JOINED']}
      />
    ),
  })

  _renderTabBar = props => (
    <FriendTabBar
      {...props}
      indicatorStyle={{
        // backgroundColor: 'rgba(70,128,223,1.0)',
        height: scaleSize(6),
        width: scaleSize(6),
        borderRadius: scaleSize(3),
        marginLeft: this._getWidth() / 3 / 2 - 3,
        marginBottom: scaleSize(12),
      }}
      renderBadge={scene => (
        scene.route.key === 'FriendMessage' &&
        <InformSpot
          style={{
            top: scaleSize(15),
            // right: '38%',
            right: this._getWidth() / 3 / 2 - 25,
          }}
        />
      )}
      onTabPress={({route, preventDefault}) => {
        const routes = this.state.routes
        for (const index in routes) {
          if (Object.hasOwnProperty.call(routes, index)) {
            const element = routes[index]
            if (element.key === route.key) {
              this.setState({
                currentPage: parseInt(index),
              })
              preventDefault()
              break
            }
          }
        }
      }}
      style={{
        height: scaleSize(80),
        marginTop: scaleSize(20),
        borderWidth: 0,
        backgroundColor: color.white,
        elevation: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
      }}
      labelStyle={{
        color: 'black',
        // fontWeight: true ? 'bold' : 'normal',
        fontSize: size.fontSize.fontSizeLg,
        textAlign: 'center',
      }}
      activeColor={'rgba(70,128,223,1.0)'}
    />
  )

  renderTab() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <TabView
          lazy
          navigationState={{
            index: this.state.currentPage,
            routes: this.state.routes,
          }}
          onIndexChange={this.goToPage}
          renderTabBar={this._renderTabBar}
          renderScene={this.renderScene}
          swipeEnabled={true}
        />
      </View>
    )
  }
  renderNOFriend() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            NavigationService.navigate('Login')
          }}
        >
          <View style={styles.itemView}>
            <Image
              style={styles.imagStyle}
              source={require('../../../assets/Mine/online_white.png')}
            />
            <Text style={styles.textStyle}>{getLanguage(this.props.language).Profile.LOGIN_NOW}</Text>
          </View>
        </TouchableOpacity>
        {/* <View>
          <Text
            style={{
              fontSize: scaleSize(20),
              textAlign: 'center',
              margin: scaleSize(10),
            }}
          >
            {getLanguage(this.props.language).Friends.LOGOUT}
          </Text>
        </View> */}
      </View>
    )
  }
}