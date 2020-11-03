import { Buffer } from 'buffer'
import fetch from 'node-fetch'

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
    const url = `http://${SMessageServiceHTTP.serviceInfo.MSG_IP}:${
      SMessageServiceHTTP.serviceInfo.MSG_HTTP_Port
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
      const url = `http://${SMessageServiceHTTP.serviceInfo.MSG_IP}:${
        SMessageServiceHTTP.serviceInfo.MSG_HTTP_Port
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
    const url = `http://${SMessageServiceHTTP.serviceInfo.MSG_IP}:${
      SMessageServiceHTTP.serviceInfo.MSG_HTTP_Port
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
    const url = `http://${SMessageServiceHTTP.serviceInfo.MSG_IP}:${
      SMessageServiceHTTP.serviceInfo.MSG_HTTP_Port
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
      const url = `http://${SMessageServiceHTTP.serviceInfo.MSG_IP}:${
        SMessageServiceHTTP.serviceInfo.MSG_HTTP_Port
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
}
