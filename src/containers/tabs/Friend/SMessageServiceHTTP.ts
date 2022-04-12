import { Buffer } from 'buffer'
import fetch from 'node-fetch'
import { SMessageService } from 'imobile_for_reactnative'
import { Toast } from '../../../utils'
import { getLanguage } from '../../../language'

interface SERVICE_INFO {
  MSG_IP?: string,
  MSG_Port?: number,
  MSG_HostName?: string,
  MSG_UserName?: string,
  MSG_Password?: string,
  MSG_HTTP_Port?: string,
  FILE_UPLOAD_SERVER_URL?: string,
  FILE_DOWNLOAD_SERVER_URL?: string,
}

const DEFAULT_SERVICE_INFO: SERVICE_INFO = {
  MSG_IP: '127.0.0.1',
  MSG_Port: 5672,
  MSG_HostName: '/',
  MSG_UserName: 'Name',
  MSG_Password: 'Password',
}

export default class SMessageServiceHTTP {
  static serviceInfo: SERVICE_INFO = DEFAULT_SERVICE_INFO

  /**
   * 设置消息服务信息
   * @param Info 当Info为undefined时，设置为默认服务数据
   */
  static setService(Info: SERVICE_INFO | undefined): void {
    if (Info) {
      SMessageServiceHTTP.serviceInfo = Info
    } else {
      SMessageServiceHTTP.serviceInfo = DEFAULT_SERVICE_INFO
    }
  }

  // 对方是否连接上RabbitMQ服务，没有连接上则发送push
  static async isConnectService(talkId: string): Promise<boolean> {
    const auth = Buffer.from(
      `${SMessageServiceHTTP.serviceInfo.MSG_UserName}:${SMessageServiceHTTP.serviceInfo.MSG_Password}`,
    ).toString('base64')
    const url = `http://${SMessageServiceHTTP.serviceInfo.MSG_IP}:${SMessageServiceHTTP.serviceInfo.MSG_HTTP_Port
    }/api/queues/%2F/Message_${talkId}?columns=consumers`
    const extraData = {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
    const response = await fetch(url, extraData)
    const data = await response.json()
    return data.consumers !== 0
  }

  static async getConsumer(userId: string): Promise<string | boolean> {
    try {
      const auth = Buffer.from(
        `${SMessageServiceHTTP.serviceInfo.MSG_UserName}:${SMessageServiceHTTP.serviceInfo.MSG_Password}`,
      ).toString('base64')
      const url = `http://${SMessageServiceHTTP.serviceInfo.MSG_IP}:${SMessageServiceHTTP.serviceInfo.MSG_HTTP_Port
      }/api/queues/%2F/Message_${userId}?columns=consumer_details`
      const extraData = {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
      const comsumer = await fetch(url, extraData)
        .then((data: any) => data.json())
        .then((data: any) => {
          if (data.consumer_details[0]) {
            return data.consumer_details[0].consumer_tag
          }
          return false
        })
        .catch(() => false)
      return comsumer
    } catch (e) {
      return false
    }
  }

  static async getConnection(userId: string): Promise<string | boolean> {
    const auth = Buffer.from(
      `${SMessageServiceHTTP.serviceInfo.MSG_UserName}:${SMessageServiceHTTP.serviceInfo.MSG_Password}`,
    ).toString('base64')
    const url = `http://${SMessageServiceHTTP.serviceInfo.MSG_IP}:${SMessageServiceHTTP.serviceInfo.MSG_HTTP_Port
    }/api/queues/%2F/Message_${userId}?columns=consumer_details`
    const extraData = {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
    const connectionName = await fetch(url, extraData)
      .then((data: any) => data.json())
      .then((data: any) => {
        if (data.consumer_details[0]) {
          return data.consumer_details[0].channel_details.connection_name
        }
        return false
      })
      .catch(() => false)
    return connectionName
  }

  static async closeConnection(connectionName: string): Promise<any> {
    const auth = Buffer.from(
      `${SMessageServiceHTTP.serviceInfo.MSG_UserName}:${SMessageServiceHTTP.serviceInfo.MSG_Password}`,
    ).toString('base64')
    const url = `http://${SMessageServiceHTTP.serviceInfo.MSG_IP}:${SMessageServiceHTTP.serviceInfo.MSG_HTTP_Port
    }/api/connections/${connectionName}`
    encodeURI(url)
    const extraData = {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      method: 'DELETE',
    }
    const res = await fetch(url, extraData)
      .then((data: any) => data)
      .then((data: any) => data)
      .catch(() => false)
    return res
  }

  /**
   * 查看用户与群组的绑定关系
   * @param id
   * @param groupId
   */
  static async checkBinding(id: string, groupId: string): Promise<any> {
    try {
      const auth = Buffer.from(
        `${SMessageServiceHTTP.serviceInfo.MSG_UserName}:${SMessageServiceHTTP.serviceInfo.MSG_Password}`,
      ).toString('base64')
      const url = `http://${SMessageServiceHTTP.serviceInfo.MSG_IP}:${SMessageServiceHTTP.serviceInfo.MSG_HTTP_Port
      }/api/bindings/%2F/e/message.group/q/Message_${id}`
      encodeURI(url)
      const extraData = {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
      let response = await fetch(url, extraData)
      let list = await response.json()
      let res = false
      for (let i = 0; i < list.length; i++) {
        if (groupId === list[i].routing_key) {
          res = true
          break
        }
      }
      return res
    } catch (error) {
      return false
    }
  }

  static async getMessageQueues(type: string): Promise<Array<any>> {
    let url = ''
    switch (type) {
      case 'exchange':
        url = `http://${SMessageServiceHTTP.serviceInfo.MSG_IP}:${SMessageServiceHTTP.serviceInfo.MSG_HTTP_Port}/api/bindings/%2F`
        break
      case 'queue':
        url = `http://${SMessageServiceHTTP.serviceInfo.MSG_IP}:${SMessageServiceHTTP.serviceInfo.MSG_HTTP_Port}/api/queues/%2F`
        break
      case 'binding':
        url = `http://${SMessageServiceHTTP.serviceInfo.MSG_IP}:${SMessageServiceHTTP.serviceInfo.MSG_HTTP_Port}/api/exchanges/%2F/message/bindings/source`
        break
      default:
        return []
    }
    encodeURI(url)
    const auth = Buffer.from(
      `${SMessageServiceHTTP.serviceInfo.MSG_UserName}:${SMessageServiceHTTP.serviceInfo.MSG_Password}`,
    ).toString('base64')
    const extraData = {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
    let response = await fetch(url, extraData)
    let queues = await response.json()
    return queues
  }

  /**
   * 判断/声明指定用户的消息队列
   * @param queueId 用户ID
   * @param isCreate 若不存在是否创建
   * @returns 是否存在
   */
  static async declare(queueId: string, isCreate?: boolean): Promise<boolean> {
    try {
      // ID为群组直接返回false
      if (queueId.includes('Group_')) {
        return false
      }
      let _queue
      let queues = await this.getMessageQueues('binding')
      if (queueId && queues.length > 0) {
        for (let queue of queues) {
          if (queue.routing_key === queueId) {
            _queue = queue
            break
          }
        }
      }
      let result = true
      if (!_queue && isCreate) {
        result = await SMessageService.declareQueue(queueId)
      }
      return result
    } catch (error) {
      return false
    }
  }

  /**
   * 判断/声明指定群和群成员的消息队列
   * @param queueId 群组ID
   * @param members 群成员
   * @param isCreate 若不存在是否创建
   * @returns 是否存在
   */
  static async declareSession(queueId: string, members: Array<any>, isCreate?: boolean): Promise<boolean> {
    try {
      // 不是群ID则返回false
      if (!queueId.includes('Group_')) {
        return false
      }
      let queues = await this.getMessageQueues('binding')
      let groupQueues = await this.getMessageQueues('exchange')
      let _queue
      let _groupQueues
      if (queueId && groupQueues.length > 0) {
        for (let tempGroup of groupQueues) {
          if (tempGroup.routing_key === queueId) {
            _groupQueues = tempGroup
            break
          }
        }
      }
      let newMemberIds = []
      // 声明和判断群成员
      for (let i = 0; i < members.length; i++) {
        let member = members[i]
        if (member && queues.length > 0) {
          _queue = null
          for (let j = 0; j < queues.length; j++) {
            let tempQueue = queues[j]
            if (tempQueue.routing_key === `Message_${member.id}`) {
              _queue = tempQueue
              break
            }
          }

          if (!_queue && isCreate) {
            newMemberIds.push(member.id)
            await SMessageService.declareQueue(`Message_${member.id}`)
            // await SMessageService.bindSession(`Message_${member.id}`, queueId)
          }
        }
      }
      let result = true
      if (!_groupQueues && isCreate) {
        result = await SMessageService.declareSession(members, queueId)
      }
      // 创建好群组和新添加的成员后，绑定关系
      if (result && newMemberIds.length > 0) {
        for (let i = 0; i < newMemberIds.length; i++) {
          await SMessageService.bindSession(`Message_${newMemberIds[i]}`, queueId)
        }
      }
      return result
    } catch (error) {
      return false
    }
  }

  /**
   * 发送给指定人员
   * @param messageObj 消息
   * @param targetIds 发送目标对象数组
   */
  static async sendMessage(messageObj: any, targetIds: Array<string>): Promise<void> {
    try {
      let queues = await this.getMessageQueues('binding')
      for (let i = 0; i < targetIds.length; i++) {
        if (targetIds[i].includes('Group_')) continue
        let _queue
        if (targetIds[i]) {
          let _id = 'Message_' + targetIds[i]
          for (let queue of queues) {
            if (queue.routing_key === _id) {
              _queue = queue
              break
            }
          }
          if (!_queue) {
            await SMessageService.declareQueue(_id)
            _queue = null
          }
          SMessageService.sendMessage(
            JSON.stringify(messageObj),
            targetIds[i],
          )
        }
      }
    } catch (e) {
      Toast.show(getLanguage(global.language).Friends.SEND_FAIL)
    }
  }

  /**
   * 发送群组消息
   * @param messageObj 消息
   * @param targetId 群组ID
   * @param members 成员
   */
  static async sendGroupMessage(messageObj: any, targetId: string, members: Array<any>) {
    try {
      if (!targetId.includes('Group_')) return
      let _queue
      let queues = await this.getMessageQueues('exchange')
      for (let queue of queues) {
        if (queue.routing_key === targetId) {
          _queue = queue
          break
        }
      }
      if (!_queue) {
        await SMessageService.declareSession(members, targetId)
        _queue = null
      }
      SMessageService.sendMessage(
        JSON.stringify(messageObj),
        targetId,
      )
    } catch (e) {
      Toast.show(getLanguage(global.language).Friends.SEND_FAIL)
    }
  }
}
