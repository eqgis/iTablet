// import { AsyncStorage } from 'react-native'
import { SMap } from 'imobile_for_reactnative'
import { MsgConstant } from '../../../../constants'
import { Toast } from '../../../../utils'
import { getLanguage } from '../../../../language'
import NavigationService from '../../../NavigationService'

export default class CoworkInfo {
  static coworkId = ''
  static groupId = ''
  static members = []
  static readMsgHandle = undefined
  static exitGroup = undefined
  static getGroupHandle = undefined
  static delTaskMemberHandle = undefined

  /** 群组被删除后，群成员若在该群组中，则退出到群组列表中 */
  static deleteGroupHandle = function(messageObj) {
    // 未进入在线协作群组中收到消息时
    if (!this.groupId) {
      CoworkInfo.getGroupHandle && CoworkInfo.getGroupHandle()
      CoworkInfo.exitGroup && CoworkInfo.exitGroup({ groupID: messageObj.message.groupId })
      return
    }

    // 群成员退出群组，其他群成员更新成员列表
    if (messageObj.message.creator !== messageObj.user.id) {
      if (!this.coworkId) return
      this.delTaskMemberHandle({
        groupId: this.groupId,
        taskId: this.coworkId,
        members: [messageObj.user],
      })
      return
    }

    // 群组被删除后，群成员若在该群组中，则退出到群组列表中
    let nav = NavigationService.getTopLevelNavigator().state.nav
    for (let i = nav.routes.length - 1; i >= 0; i--) {
      if (nav.routes[i].routeName === 'MapStack' && messageObj.message.groupId === this.groupId) {
        CoworkInfo.getGroupHandle && CoworkInfo.getGroupHandle()
        CoworkInfo.exitGroup && CoworkInfo.exitGroup({ groupID: messageObj.message.groupId })
        CoworkInfo.closeMapHandle && CoworkInfo.closeMapHandle({baskFrom: 'CoworkManagePage'})
        Toast.show(
          messageObj.message.type === MsgConstant.MSG_ONLINE_MEMBER_DELETE
            ? getLanguage(GLOBAL.language).Friends.GROUP_MEMBER_DELETE_INFO2
            : getLanguage(GLOBAL.language).Friends.GROUP_DELETE_INFO2
        )
        break
      } else if (nav.routes[i].routeName === 'CoworkManagePage' && messageObj.message.groupId === this.groupId) {
        // 从当前任务群组中退出
        CoworkInfo.getGroupHandle && CoworkInfo.getGroupHandle()
        CoworkInfo.exitGroup && CoworkInfo.exitGroup({ groupID: messageObj.message.groupId })
        NavigationService.goBack('CoworkManagePage', null)
        Toast.show(getLanguage(GLOBAL.language).Friends.GROUP_DELETE_INFO2)
        break
      }
    }
  }
  static closeMapHandle = undefined

  static setGroupGetHandle(handle) {
    this.getGroupHandle = handle
  }

  static setExitGroupHandle(handle) {
    this.exitGroup = handle
  }

  static setReadMsgHandle(handle) {
    this.readMsgHandle = handle
  }

  static setDeleteHandle(handle) {
    this.delTaskMemberHandle = handle
  }

  static reset() {
    this.coworkId = ''
    this.groupId = ''
    this.members = []
    // this.readMsgHandle = undefined
    // this.getGroupHandle = undefined
  }

  static setId(Id) {
    this.coworkId = Id
  }

  static setGroupId(id) {
    this.groupId = id
  }

  static setMessages(messages) {
    this.messages = messages
  }

  static consumeMessage(messageID) {
    this.readMsgHandle({
      groupId: this.groupId,
      taskId: this.coworkId,
      messageID: messageID,
    })
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
    // this.consumeMessage(message.messageID)
    this.readMsgHandle({
      groupId: this.groupId,
      taskId: this.coworkId,
      messageID: message.messageID,
      status: 2,
    })
  }
}
