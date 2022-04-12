import { SMap, ThemeType, SThemeCartography } from 'imobile_for_reactnative'
import { MsgConstant } from '../../../../constants'
import { Toast } from '../../../../utils'
import { getLanguage } from '../../../../language'
import NavigationService from '../../../NavigationService'
import { serviceModule } from '../../../workspace/components/ToolBar/modules'

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
            ? getLanguage(global.language).Friends.GROUP_MEMBER_DELETE_INFO2
            : getLanguage(global.language).Friends.GROUP_DELETE_INFO2
        )
        break
      } else if (nav.routes[i].routeName === 'CoworkManagePage' && messageObj.message.groupId === this.groupId) {
        // 从当前任务群组中退出
        CoworkInfo.getGroupHandle && CoworkInfo.getGroupHandle()
        CoworkInfo.exitGroup && CoworkInfo.exitGroup({ groupID: messageObj.message.groupId })
        NavigationService.goBack('CoworkManagePage', null)
        Toast.show(getLanguage(global.language).Friends.GROUP_DELETE_INFO2)
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

  /**根据Layer路径已读图层相关所有消息 */
  static consumeMessageByLayerPath(layerPath) {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      const item = this.messages[i]
      if (item.message.layerPath === layerPath && item.status == 0) {
        this.consumeMessage(item.messageID)
      }
    }
  }

  /**
   * 添加对象
   * @param {*} messageID 消息ID
   * @param {*} readAllSameObj 是否将同一个对象的所有消息已读
   * @param {*} notify 是否提示对象不存在
   * @returns
   */
  static async add(messageID, readAllSameObj = false, notify = true) {
    try {
      let message = this.messages[messageID]
      let result = false
      let type = message.message.type
      if (
        type === MsgConstant.MSG_COWORK_ADD ||
        type === MsgConstant.MSG_COWORK_UPDATE
      ) {
        if (message.message.geometry) {
          result = await SMap.addUserGeometry(
            message.message.layerPath,
            message.message.id,
            message.message.geoUserID,
            message.message.geometry,
            message.message.geoType,
          )
        } else if (message.message.isHeatmap && message.message.layerHeatmap) {
          let res = await SThemeCartography.createHeatMap({
            DatasourceAlias: message.message.DatasourceAlias,
            DatasetName: message.message.DatasetName,
            kernelRadius: message.message.layerHeatmap.kernelRadius,
            fuzzyDegree: message.message.layerHeatmap.fuzzyDegree,
            intensity: message.message.layerHeatmap.intensity,
            maxColor: message.message.layerHeatmap.maxColor,
            minColor: message.message.layerHeatmap.minColor,
            colorset: message.message.layerHeatmap.colorset,
          })
          result = res.result
          result && SMap.refreshMap()
        } else if (message.message.themeType > 0 && message.message.layer) {
          let index = 0
          if (message.message.themeType === ThemeType.GRAPH) {
            index = -1
          }
          result = await SMap.insertXMLLayer(index, message.message.layer)
          result && SMap.refreshMap()
        }
        if (result) {
          if (readAllSameObj && message.message.geometry) {
            for (let i = this.messages.length - 1; i >= 0; i--) {
              const item = this.messages[i]
              if (item.message.id === message.message.id && item.status == 0) {
                this.consumeMessage(item.messageID)
              }
            }
          } else {
            this.consumeMessage(message.messageID)
          }
        } else {
          if (message.message.themeType > 0 && message.message.theme) {
            Toast.show(getLanguage(global.language).Cowork.UPDATE_THEME_ERROR_INFO)
          }
        }
      } else if (type === MsgConstant.MSG_COWORK_DELETE) {
        notify &&
          Toast.show(getLanguage(global.language).Friends.ADD_DELETE_ERROR)
      } else if (type === MsgConstant.MSG_COWORK_SERVICE_UPDATE || type === MsgConstant.MSG_COWORK_SERVICE_PUBLISH) {
        let url = message.message.serviceUrl
        if (url.endsWith('/rest') && url.indexOf('/rest/data/datasources/') === -1) { // 下载地图服务
          result = await serviceModule().actions.downloadService(url)
        } else { // 下载数据集服务
          result = await serviceModule().actions.downloadToLocal(url, message?.message?.datasourceAlias)
        }
        result && this.consumeMessage(message.messageID)
      }
      return result
    } catch (error) {
      return false
    }
  }

  /**
   * 更新对象
   * @param {*} messageID 消息ID
   * @param {*} readAllSameObj 是否将同一个对象的所有消息已读
   * @param {*} notify 是否提示对象不存在
   * @returns
   */
  static async update(messageID, readAllSameObj = false, notify = true) {
    try {
      let message = this.messages[messageID]
      let result = false
      let type = message.message.type
      if (type === MsgConstant.MSG_COWORK_ADD) {
        if (message.message.geometry) {
          result = await SMap.addUserGeometry(
            message.message.layerPath,
            message.message.id,
            message.message.geoUserID,
            message.message.geometry,
            message.message.geoType,
          )
        } else if (message.message.isHeatmap && message.message.layerHeatmap) {
          // 添加热力图
          let res = await SThemeCartography.createHeatMap({
            DatasourceAlias: message.message.DatasourceAlias,
            DatasetName: message.message.DatasetName,
            kernelRadius: message.message.layerHeatmap.kernelRadius,
            fuzzyDegree: message.message.layerHeatmap.fuzzyDegree,
            intensity: message.message.layerHeatmap.intensity,
            maxColor: message.message.layerHeatmap.maxColor,
            minColor: message.message.layerHeatmap.minColor,
            colorset: message.message.layerHeatmap.colorset,
          })
          result = res.result
          result && SMap.refreshMap()
        } else if (message.message.themeType > 0 && message.message.layer) {
          // 添加专题图层
          let index = 0
          if (message.message.themeType === ThemeType.GRAPH) {
            index = -1
          }
          result = await SMap.insertXMLLayer(index, message.message.layer)
          result && SMap.refreshMap()
        }
        if (result) {
          if (readAllSameObj) {
            for (let i = this.messages.length - 1; i >= 0; i--) {
              const item = this.messages[i]
              if (item.message.id === message.message.id && item.status == 0) {
                this.consumeMessage(item.messageID)
              }
            }
          } else {
            this.consumeMessage(message.messageID)
          }
        }
      } else if (type === MsgConstant.MSG_COWORK_UPDATE) {
        if (message.message.geometry) {
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
          } else {
            SMap.removeMessageCallout(messageID)
            notify &&
              Toast.show(
                getLanguage(global.language).Friends.UPDATE_NOT_EXIST_OBJ,
              )
          }
        } else if (message.message.isHeatmap && message.message.layerHeatmap) {
          let res = await SThemeCartography.modifyHeatMap(
            message.message.layerPath,
            message.message.layerHeatmap,
          )
          result = res.result
          result && SMap.refreshMap()
        } else if (message.message.themeType > 0 && message.message.theme) {
          result = await SMap.updateLayerThemeFromXML(
            message.message.layerPath,
            message.message.theme,
          )
          result && SMap.refreshMap()
        }
        if (result) {
          if (readAllSameObj) {
            for (let i = this.messages.length - 1; i >= 0; i--) {
              const item = this.messages[i]
              if (item.message.id === message.message.id && item.status == 0) {
                this.consumeMessage(item.messageID)
              }
            }
          } else {
            this.consumeMessage(message.messageID)
          }
        }
      } else if (type === MsgConstant.MSG_COWORK_DELETE) {
        //TODO 处理删除
        // result = await SMap.updateUserGeometry(
        //   message.message.layerPath,
        //   message.message.id,
        //   message.message.geoUserID,
        //   message.message.geometry,
        // )
        result = await SMap.deleteUserGeometry(message.message.layerPath, message.message.id, message.message.geoUserID)
        result = true
        result && this.consumeMessage(message.messageID)
      } else if (type === MsgConstant.MSG_COWORK_SERVICE_UPDATE) {
        let url = message.message.serviceUrl
        result = await serviceModule().actions.updateToLocal({ url, datasourceAlias: message.message.datasourceAlias })
        result && this.consumeMessage(message.messageID)
      } else if (type === MsgConstant.MSG_COWORK_SERVICE_PUBLISH) {
        let url = message.message.serviceUrl
        if (url.endsWith('/rest') && url.indexOf('/rest/data/datasources/') === -1) { // 下载地图服务
          result = await serviceModule().actions.downloadService(url)
        } else { // 下载数据集服务
          result = await serviceModule().actions.downloadToLocal(url, message?.message?.datasourceAlias)
        }
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
