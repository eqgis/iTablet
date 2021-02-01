// TODO CoworkInfo 方法待优化。 移除？
// import { AsyncStorage } from 'react-native'
import { SMap } from 'imobile_for_reactnative'
import { MsgConstant } from '../../../../constants'
import { Toast } from '../../../../utils'
import { getLanguage } from '../../../../language'

export default class CoworkInfo {
  static coworkId = ''
  static groupId = ''
  static members = []
  static prevMessages = []
  static messages = []
  static isRealTime = true
  static adding = false
  static addMessageNum = undefined
  static readMsgHandle = undefined

  static setNewMsgHandle(handle) {
    this.addMessageNum = handle
  }

  static setReadMsgHandle(handle) {
    this.readMsgHandle = handle
  }

  static reset() {
    this.coworkId = ''
    this.groupId = ''
    this.members = []
    this.prevMessages = []
    this.messages = []
    this.isRealTime = true
    this.adding = false
    this.addMessageNum && this.addMessageNum(0)
    // AsyncStorage.setItem('COWORKID', '')
  }

  static setId(Id) {
    this.coworkId = Id
    // AsyncStorage.setItem('COWORKID', Id)
  }

  static setGroupId(id) {
    this.groupId = id
  }

  static setMessages(messages) {
    this.messages = messages
  }

  static setMembers(members) {
    for (let i = 0; i < members.length; i++) {
      if (members[i].show === undefined) {
        members[i] = {
          id: members[i].id,
          name: members[i].name,
          show: true,
          location: members[i].location,
        }
        break
      } else {
        members[i] = {
          id: members[i].id,
          name: members[i].name,
          show: members[i].show,
          location: members[i].location,
        }
      }
    }
    this.members = members
  }

  static addMember(member) {
    try {
      let isMember = false
      for (let i = 0; i < this.members.length; i++) {
        if (this.members[i].id === member.id) {
          isMember = true
          break
        }
      }
      if (!isMember) {
        this.members.push({
          id: member.id,
          name: member.name,
          show: true,
        })
      }
    } catch (error) {
      //
    }
  }

  static setIsRealTime(isRealTime) {
    this.isRealTime = isRealTime
    if (isRealTime) {
      this.showAll()
      // if (!this.adding) {
      //   this.addNewMessage()
      // }
    } else {
      this.hideAll()
    }
  }

  static async hideAll() {
    try {
      SMap.removeUserCallout()
      for (let i = 0; i < this.members.length; i++) {
        let userID = this.members[i].id
        SMap.hideUserTrack(userID)
      }
    } catch (error) {
      //
    }
  }

  static async showAll() {
    try {
      for (let n = 0; n < this.members.length; n++) {
        let member = this.members[n]
        let userID = member.id
        if (member.show) {
          SMap.showUserTrack(userID)
        }
        for (let i = 0; i < this.messages.length; i++) {
          let message = this.messages[i]
          if (!message.consume && message.user.id === userID) {
            try {
              let result = await SMap.isUserGeometryExist(
                message.message.layerPath,
                message.message.id,
                message.message.geoUserID,
              )
              if (result) {
                SMap.addMessageCallout(
                  message.message.layerPath,
                  message.message.id,
                  message.message.geoUserID,
                  message.user.name,
                  message.messageID,
                )
              }
            } catch (error) {
              //
            }
          }
        }
      }
    } catch (error) {
      //
    }
  }

  static setUserLocation(userID, location) {
    for (let i = 0; i < this.members.length; i++) {
      let member = this.members[i]
      if (member.id === userID) {
        member.location = location
        break
      }
    }
  }

  static hideUserTrack(userID) {
    for (let i = 0; i < this.members.length; i++) {
      let member = this.members[i]
      if (member.id === userID) {
        member.show = false
        break
      }
    }
    SMap.removeLocationCallout(userID)
    SMap.hideUserTrack(userID)
  }

  static showUserTrack(userID) {
    for (let i = 0; i < this.members.length; i++) {
      let member = this.members[i]
      if (member.id === userID) {
        member.show = true
        let location = member.location
        if (this.isRealTime && location?.longitude && location?.latitude) {
          let initial = location.initial
          if (initial && initial.length > 2) {
            initial = initial.slice(0, 2)
          }
          SMap.addLocationCallout(
            location.longitude,
            location.latitude,
            member.name,
            member.id,
            initial,
          )
        }
        break
      }
    }
    if (this.isRealTime) {
      SMap.showUserTrack(userID)
    }
  }

  static isUserShow(userID) {
    let isShow = false
    for (let i = 0; i < this.members.length; i++) {
      let member = this.members[i]
      if (member.id === userID) {
        isShow = member.show === undefined ? true : member.show
        break
      }
    }
    return isShow
  }

  static pushMessage(message) {
    this.prevMessages.push(message)
    if (this.isRealTime && !this.adding) {
      this.addNewMessage()
    }
  }

  static addNewMessage() {
    this.adding = true
    while (this.prevMessages.length > 0) {
      let message = this.prevMessages.shift()
      message.consume = false
      message.messageID = this.messages.length
      this.messages.push(message)
      this.addMessageNum && this.addMessageNum(1),
      async function() {
        try {
          let result = await SMap.isUserGeometryExist(
            message.message.layerPath,
            message.message.id,
            message.message.geoUserID,
          )
          if (result) {
            SMap.addMessageCallout(
              message.message.layerPath,
              message.message.id,
              message.message.geoUserID,
              message.user.name,
              message.messageID,
            )
          }
        } catch (error) {
          //
        }
      }.bind(this)()
    }
    this.adding = false
  }

  static consumeMessage(messageID) {
    this.readMsgHandle({
      groupId: this.groupId,
      taskId: this.coworkId,
      messageID: messageID,
    })

    // if (!this.messages[messageID].consume) {
    //   this.messages[messageID].consume = true
    //   this.addMessageNum && this.addMessageNum(-1)
    //   SMap.removeMessageCallout(messageID)
    // }
  }

  static async add(messageID, notify = true) {
    try {
      let message = this.messages[messageID]
      let result = false
      let type = message.message.type
      if (
        type === MsgConstant.MSG_COWORK_ADD ||
        type === MsgConstant.MSG_COWORK_UPDATE
      ) {
        result = await SMap.addUserGeometry(
          message.message.layerPath,
          message.message.id,
          message.message.geoUserID,
          message.message.geometry,
          message.message.geoType,
        )
        result && this.consumeMessage(message.messageID)
      } else if (type === MsgConstant.MSG_COWORK_DELETE) {
        notify &&
          Toast.show(getLanguage(GLOBAL.language).Friends.ADD_DELETE_ERROR)
      }
      return result
    } catch (error) {
      return false
    }
  }

  static async update(messageID, notify = true) {
    try {
      let message = this.messages[messageID]
      let result = false
      let type = message.message.type
      if (type === MsgConstant.MSG_COWORK_ADD) {
        result = await SMap.addUserGeometry(
          message.message.layerPath,
          message.message.id,
          message.message.geoUserID,
          message.message.geometry,
          message.message.geoType,
        )
        result && this.consumeMessage(message.messageID)
      } else if (type === MsgConstant.MSG_COWORK_UPDATE) {
        let exist = await SMap.isUserGeometryExist(
          message.message.layerPath,
          message.message.id,
          message.message.geoUserID,
        )
        if (exist) {
          result = await SMap.updateUserGeometry(
            message.message.layerPath,
            message.message.id,
            message.message.geoUserID,
            message.message.geometry,
          )
          result && this.consumeMessage(message.messageID)
        } else {
          notify &&
            Toast.show(
              getLanguage(GLOBAL.language).Friends.UPDATE_NOT_EXIST_OBJ,
            )
        }
      } else if (type === MsgConstant.MSG_COWORK_DELETE) {
        //TODO 处理删除
        result = true
        result && this.consumeMessage(message.messageID)
      }
      return result
    } catch (error) {
      return false
    }
  }

  static async ignore(messageID) {
    let message = this.messages[messageID]
    this.consumeMessage(message.messageID)
  }
}
