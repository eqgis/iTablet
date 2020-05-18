import { AsyncStorage } from 'react-native'
import { SMap } from 'imobile_for_reactnative'

export default class CoworkInfo {
  static coworkId = ''
  static members = []
  static prevMessages = []
  static messages = []
  static isRealTime = true
  static adding = false
  static addMessageNum = undefined

  static setNewMsgHandle(handle) {
    this.addMessageNum = handle
  }

  static reset() {
    this.coworkId = ''
    this.members = []
    this.prevMessages = []
    this.messages = []
    this.isRealTime = true
    this.adding = false
    this.addMessageNum && this.addMessageNum(0)
    AsyncStorage.setItem('COWORKID', '')
  }

  static setId(Id) {
    this.coworkId = Id
    AsyncStorage.setItem('COWORKID', Id)
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
    if (isRealTime && !this.adding) {
      this.addNewMessage()
    }
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
    if (!this.messages[messageID].consume) {
      this.messages[messageID].consume = true
      this.addMessageNum && this.addMessageNum(-1)
      SMap.removeMessageCallout(messageID)
    }
  }
}
