import { Buffer } from 'buffer'
import fetch from 'node-fetch'

export default class SMessageServiceHTTP {
  // 对方是否连接上RabbitMQ服务，没有连接上则发送push
  static async isConnectService(talkId) {
    const auth = Buffer.from(
      `${GLOBAL.MSG_UserName}:${GLOBAL.MSG_Password}`,
    ).toString('base64')
    const url = `http://${GLOBAL.MSG_IP}:${
      GLOBAL.MSG_HTTP_Port
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

  static async getConsumer(userId) {
    try {
      const auth = Buffer.from(
        `${GLOBAL.MSG_UserName}:${GLOBAL.MSG_Password}`,
      ).toString('base64')
      const url = `http://${GLOBAL.MSG_IP}:${
        GLOBAL.MSG_HTTP_Port
      }/api/queues/%2F/Message_${userId}?columns=consumer_details`
      const extraData = {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
      const comsumer = await fetch(url, extraData)
        .then(data => data.json())
        .then(data => {
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

  static async getConnection(userId) {
    const auth = Buffer.from(
      `${GLOBAL.MSG_UserName}:${GLOBAL.MSG_Password}`,
    ).toString('base64')
    const url = `http://${GLOBAL.MSG_IP}:${
      GLOBAL.MSG_HTTP_Port
    }/api/queues/%2F/Message_${userId}?columns=consumer_details`
    const extraData = {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
    const connectionName = await fetch(url, extraData)
      .then(data => data.json())
      .then(data => {
        if (data.consumer_details[0]) {
          return data.consumer_details[0].channel_details.connection_name
        }
        return false
      })
      .catch(() => false)
    return connectionName
  }

  static async closeConnection(connectionName) {
    const auth = Buffer.from(
      `${GLOBAL.MSG_UserName}:${GLOBAL.MSG_Password}`,
    ).toString('base64')
    const url = `http://${GLOBAL.MSG_IP}:${
      GLOBAL.MSG_HTTP_Port
    }/api/connections/${connectionName}`
    encodeURI(url)
    const extraData = {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      method: 'DELETE',
    }
    const res = await fetch(url, extraData)
      .then(data => data)
      .then(data => data)
      .catch(() => false)
    return res
  }

  /**
   * 查看用户与群组的绑定关系
   * @param {*} id
   * @param {*} groupId
   */
  static async checkBinding(id, groupId) {
    try {
      const auth = Buffer.from(
        `${GLOBAL.MSG_UserName}:${GLOBAL.MSG_Password}`,
      ).toString('base64')
      const url = `http://${GLOBAL.MSG_IP}:${
        GLOBAL.MSG_HTTP_Port
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
