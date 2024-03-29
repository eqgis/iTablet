import { Platform } from 'react-native'
// import JPushModule from 'jpush-react-native'
import fetch from 'node-fetch'
import { MsgConstant } from '../../../constants'
import SMessageServiceHTTP from './SMessageServiceHTTP'

const disable = true

export default class JPushService {
  static async push(messageStr, talkIds) {
    if(disable) return
    let messageObj = JSON.parse(messageStr)
    //只push以下消息
    if (
      messageObj.type !== MsgConstant.MSG_SINGLE &&
      messageObj.type !== MsgConstant.MSG_GROUP
    )
      return
    //连接到RabbitMQ则不push
    let audience = []
    for (let key = 0; key < talkIds.length; key++) {
      let bCon = await SMessageServiceHTTP.isConnectService(talkIds[key])
      !bCon && audience.push(talkIds[key])
    }
    if (audience.length === 0) return

    //TODO 判断消息类型后构造消息
    let messageText = messageObj.message
    if (messageObj.message.message) {
      messageText = messageObj.message.message.message
    }
    if (messageText && typeof messageText === 'string') {
      messageText = messageText.replace(/[\r\n]/g, '')
    } else {
      return
    }
    let titleText = messageObj.user.name
    if (messageObj.type === MsgConstant.MSG_GROUP) {
      titleText = messageObj.user.groupName
      messageText = messageObj.user.name + ': ' + messageText
    }
    let request = {
      platform: 'all',
      audience: { alias: audience },
      notification: {
        android: {
          alert: messageText,
          title: titleText,
        },
        ios: {
          alert: messageText,
          sound: 'default',
          badge: '+1',
        },
      },
    }

    if (__DEV__) {
      request.options = {
        apns_production: false,
      }
    }

    let url = 'https://api.jpush.cn/v3/push'
    let extraData = {
      headers: {
        Authorization:
          'Basic N2QyNDcwYmFhZDIwZTI3M2NkNmU1M2NjOjY0MDhjNzYxODdhZWEzN2Q3MjkyZWQ3Yg==',
        'Content-Type': 'application/json',
      },
      method: 'post',
      body: JSON.stringify(request),
    }
    let response = await fetch(url, extraData)
    let result = await response.json()
    return result
  }

  static sendLocalNotification(messageObj) {
    if(disable) return
    if (Platform.OS === 'android') return
    //只push以下消息
    if (
      messageObj.type !== MsgConstant.MSG_SINGLE &&
      messageObj.type !== MsgConstant.MSG_GROUP
    )
      return

    let messageText = messageObj.message
    if (messageObj.message.message) {
      messageText = messageObj.message.message.message
    }
    if (messageText && typeof messageText === 'string') {
      messageText = messageText.replace(/[\r\n]/g, '')
    } else {
      return
    }
    let titleText = messageObj.user.name
    if (messageObj.type === MsgConstant.MSG_GROUP) {
      titleText = messageObj.user.groupName
      messageText = messageObj.user.name + ': ' + messageText
    }
    let notification = {
      buildId: 0,
      // id: parseInt(messageObj.user.id),
      title: titleText,
      content: messageText,
      extra: {},
    }
    if (messageObj.user.id !== null && messageObj.user.id !== undefined) {
      // 若id为字符串,则转为ASCII
      if (isNaN(messageObj.user.id)) {
        let tempID = ''
        for (const c of messageObj.user.id) {
          tempID += c.charCodeAt() + ''
        }
        notification.id = parseInt(tempID)
      } else  {
        notification.id = parseInt(messageObj.user.id)
      }
    }
    if (Platform.OS === 'ios') {
      notification.subtitle = ''
      notification.badge = 1
      notification.sound = 'default'
      notification.fireTime = Date.parse(new Date()) + 2000
    }
    // JPushModule.sendLocalNotification(notification)
  }

  //userId
  static setAlias(userId) {
    // eslint-disable-next-line no-unused-vars
    // JPushModule.setAlias(userId, result => {})
  }

  static deleteAlias = () => {
    // eslint-disable-next-line no-unused-vars
    // JPushModule.deleteAlias(result => {})
  }

  static init(userId) {
    // if (Platform.OS === 'android') return
    // if (Platform.OS === 'android') {
    //   JPushModule.initPush()
    //   JPushModule.notifyJSDidLoad(resultCode => {
    //     // eslint-disable-next-line no-empty
    //     if (resultCode === 0) {
    //     }
    //   })
    //   // JPushModule.setStyleBasic()
    // } else {
    //   JPushModule.setupPush()
    // }

    // this.removeListeners()

    // if (userId === undefined) {
    //   this.deleteAlias()
    //   JPushModule.stopPush()
    // } else {
    //   JPushModule.resumePush()
    //   this.setAlias(userId)
    //   this.addListeners()
    // }
  }

  static addListeners() {
    // this.receiveCustomMsgListener = map => {
    // console.log('extras: ' + map.extras)
    // }
    // JPushModule.addReceiveCustomMsgListener(this.receiveCustomMsgListener)
    // this.receiveNotificationListener = map => {
    // console.log('alertContent: ' + map.alertContent)
    // console.log('extras: ' + map.extras)
    // }
    // JPushModule.addReceiveNotificationListener(this.receiveNotificationListener)
    // this.openNotificationListener = map => {
    // console.log('Opening notification!')
    // console.log('map.extra: ' + map.extras)
    // this.jumpSecondActivity()
    // }
    // JPushModule.addReceiveOpenNotificationListener(this.openNotificationListener)
    // this.getRegistrationIdListener = registrationId => {
    //   console.log('Device register succeed, registrationId ' + registrationId)
    // }
    // JPushModule.addGetRegistrationIdListener(this.getRegistrationIdListener)
  }

  static removeListeners() {
    // JPushModule.removeReceiveCustomMsgListener(this.receiveCustomMsgListener)
    // JPushModule.removeReceiveNotificationListener(this.receiveNotificationListener)
    // JPushModule.removeReceiveOpenNotificationListener(this.openNotificationListener)
    // JPushModule.removeGetRegistrationIdListener(this.getRegistrationIdListener)
    // console.log('Will clear all notifications')
    // JPushModule.clearAllNotifications()
  }
}
