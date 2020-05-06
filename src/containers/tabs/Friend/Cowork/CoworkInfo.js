import { AsyncStorage } from 'react-native'

export default class CoworkInfo {
  static coworkId = ''
  static members = []
  static messages = []
  static newMessages = []
  static isRealTime = true
  static adding = false
  static setNewMessage = undefined

  static setNewMsgHandle(handle) {
    this.setNewMessage = handle
  }

  static reset() {
    this.coworkId = ''
    this.members = []
    this.messages = []
    this.newMessages = []
    this.isRealTime = true
    this.adding = false
    this.setNewMessage && this.setNewMessage(0)
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
    this.messages.push(message)
    if (this.isRealTime && !this.adding) {
      this.addNewMessage()
    }
  }

  static addNewMessage() {
    this.adding = true
    while (this.messages.length > 0) {
      this.newMessages.push(this.messages.shift())
    }
    this.setNewMessage && this.setNewMessage(this.newMessages.length)
    this.adding = false
  }
}
