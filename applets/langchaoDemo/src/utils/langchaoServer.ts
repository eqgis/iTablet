import { ConstPath } from '@/constants'
import { AppToolBar, Toast } from '@/utils'
import axios from 'axios'
import FileTools from 'imobile_for_reactnative/NativeModule/utility/FileTools'
import { Platform } from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'

function getSign(){
  return Math.round(Math.random() * 100)
}

let serverIP = ""
let serverToken = ""
let serverClientid = "Gvvy19yU"


let userId = ""
let username = ""
let sysOrgid = ""
let userInfo: any[] = []

export const getUserInfo = () => {
  return userInfo
}

export const getUserParam = () => {
  return {
    userId: userId,
    username: username,
    SysOrgid: sysOrgid,
  }
}
export const setUserId = (id: string) => {
  userId = id
}

export const setUserName = (name: string) => {
  username = name
}

export const setSysOrgid = (id: string) => {
  sysOrgid = id
}


export const setServerIPUtil = (IP: string) => {
  serverIP = IP
}

export const setServerTokenUtil = (token: string) => {
  serverToken = token
}

export const setServerClientidUtil = (clientid: string) => {
  serverClientid = clientid
}

export const printLog = async (str: string) => {
  try {
    const homePath = await FileTools.getHomeDirectory()
    const path = homePath + ConstPath.CachePath + "langchaoWs/langchaoLog.txt"
    const logfileExist = await FileTools.fileIsExist(path)
    if(logfileExist) {
      await FileTools.appendToFile(path, str)
    }
  } catch (error) {
    Toast.show("日志文件写入失败：" + str)
    console.warn("日志文件写入失败：" + error)
  }
}


export const getUUid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/** 时间格式化 "yyyy-MM-dd hh:mm:ss"（12小时制）  "yyyy-MM-dd HH:mm:ss"（24小时制） */
export const dateFormat = (format: string, date: Date) => {
  let formatstr = format
  if(format != null && format != ""){
    //设置年
    if(formatstr.indexOf("yyyy") >=0 ){
      formatstr = formatstr.replace("yyyy",date.getFullYear() + "")
    }
    //设置月
    if(formatstr.indexOf("MM") >=0 ){
      let month: number | string = date.getMonth() + 1
      if(month < 10){
        month = "0" + month
      }
      formatstr = formatstr.replace("MM",month + "")
    }
    //设置日
    if(formatstr.indexOf("dd") >=0 ){
      let day: number | string = date.getDate()
      if(day < 10){
        day = "0" + day
      }
      formatstr = formatstr.replace("dd",day + "")
    }
    //设置时 - 24小时
    let hours: number | string = date.getHours()
    if(formatstr.indexOf("HH") >=0 ){
      if(hours < 10){
        hours = "0" + hours
      }
      formatstr = formatstr.replace("HH",hours + "")
    }
    //设置时 - 12小时
    if(formatstr.indexOf("hh") >=0 ){
      if(hours > 12){
        hours = Number(hours) - 12
      }
      if(hours < 10){
        hours = "0" + hours
      }
      formatstr = formatstr.replace("hh",hours + "")
    }
    //设置分
    if(formatstr.indexOf("mm") >=0 ){
      let minute: number | string = date.getMinutes()
      if(minute < 10){
        minute = "0" + minute
      }
      formatstr = formatstr.replace("mm",minute + "")
    }
    //设置秒
    if(formatstr.indexOf("ss") >=0 ){
      let second: number | string = date.getSeconds()
      if(second < 10){
        second = "0" + second
      }
      formatstr = formatstr.replace("ss",second + "")
    }
    // console.warn("formatstr07: " + formatstr)
  }
  return formatstr
}

// http://IP/api/app/osa/v1.0/token/get?clientid=clientid&grant_type=client_credentials&clientsecret=clientsecret
/**
 * 获取动态的token
 */
export const getToken = async (clientid?: string, clientsecret?: string) => {
  try {
    const IP = serverIP
    const url =  `http://${IP}/api/app/osa/v1.0/token/get`
    const clientId = clientid || serverClientid

    printLog(`\n =========================== getToken 获取token值 =========================== 
  \n getToken(clientid: ${clientId} , clientsecret: ${clientsecret}) \n url: ${url}`)

    // AppToolBar.getProps().setServerClientid(clientId)
    console.warn("getToken: " + url + "\nclientId: " + clientId)
    const response = await axios.get(url, {
      params: {
        clientid: clientId,
        clientsecret: clientsecret || "fe699f4b76afe5066b2302faf2ab3737",
        grant_type: "client_credentials",
      }
    })
    console.log(response)
    printLog(`\n getToken response : ${JSON.stringify(response)}`)
    if(response.status === 200) {
      const data = JSON.parse(JSON.stringify(response.data))
      if(data.ok === true) {
        const token = data.data
        console.warn("token: " + token)
        // AppToolBar.getProps().setServerToken(token)
        setServerTokenUtil(token)
        printLog(`\n getToken token : ${token}`)
      }
    }
  } catch (error) {
    console.log(error)
    printLog(`\n getToken error : ${JSON.stringify(error)}`)
  }
}

/**
 * 上传附件
 * @params path 文件路径
 * @returns 上传成功返回一个对象，失败返回null
 */

export const uploadFile = async (path: string) => {
  try {
    const IP = serverIP
    const token = serverToken
    const clientId = serverClientid

    const url = `http://${IP}/api/app/osa/v1.0/attachment/upload`

    printLog(`\n =========================== uploadFile01 上传附件 =========================== 
    \n uploadFile(path: ${path} ) \n url: ${url} \n clientid: ${clientId} token: ${token}`)

    const fileName = path.substring(path.lastIndexOf("/"), path.length)
    printLog(`\n uploadFile fileName : ${fileName}`)
    let res = await RNFetchBlob.fetch('POST', url, {
      // header...
      'Content-Type': 'multipart/form-data'
    }, [
    // path是指文件的路径，wrap方法可以根据文件路径获取到文件信息
      { name: 'file', filename: fileName, type: 'image/foo', data: RNFetchBlob.wrap(path) },
    //... 可能还会有其他非文件字段{name:'字段名',data:'对应值'}
    ])
    console.warn('res', res)
    printLog(`\n uploadFile response : ${JSON.stringify(res)}`)
    res = JSON.parse(JSON.stringify(res))
    const respInfo = JSON.parse(JSON.stringify(res.respInfo))
    printLog(`\n uploadFile respInfo : ${JSON.stringify(respInfo)}`)
    let info = null
    if(respInfo.status === 200) {
      const data = JSON.parse(res?.data)
      if(data.ok === true) {
        Toast.show("附件上传成功")
        info = JSON.parse(JSON.stringify(data.data))
        printLog(`\n uploadFile result : ${JSON.stringify(data.data)}`)
      }
    }
    return info
  } catch (error) {
    console.warn("error: " + error)
    printLog(`\n uploadFile error : ${JSON.stringify(error)}`)
    global.Loading.setLoading(false)
    return null
  }

}

export const uploadFileTest = async (path: string) => {
  try {
    const token = serverToken
    const clientId = serverClientid

    const url = `http://192.168.11.21:8080/test/upFile`

    // const fileType = type || "image/foo"

    const fileName = path.substring(path.lastIndexOf("/"), path.length)
    const res = await RNFetchBlob.fetch('POST', url, {
      // header...
      'Content-Type': 'multipart/form-data'
    }, [
    // path是指文件的路径，wrap方法可以根据文件路径获取到文件信息
      { name: 'file', filename: fileName, type: 'image/foo', data: RNFetchBlob.wrap(path) },
      // { name: 'file', filename: fileName, type: fileType, data: RNFetchBlob.wrap(path) },
    //... 可能还会有其他非文件字段{name:'字段名',data:'对应值'}
    ])
    console.warn('res', res)
    res = JSON.parse(JSON.stringify(res))
    const respInfo = JSON.parse(JSON.stringify(res.respInfo))
    printLog(`\n uploadFile response : ${JSON.stringify(res)}`)
    let info = null
    if(respInfo.status === 200) {
      const data = JSON.parse(res?.data)
      if(data.ok === true) {
        Toast.show("附件上传成功")
        info = JSON.parse(JSON.stringify(data.data))
        printLog(`\n uploadFile result : ${JSON.stringify(data.data)}`)
      }
    }
    return info
  } catch (error) {
    console.warn("error: " + error)
    global.SimpleDialog.setVisible(false)
    return null
  }

}


export interface UserInfoType {
	UserId?: string,
	UserName?: string,
	BeginTime?: string,
	EndTime?: string,
	SysOrgid?: string,
}
/**
 * 获取员工信息
 * @param params 查询员工的参数
 */
export const users = async (params: UserInfoType) => {
  try {
    const IP = serverIP
    const token = serverToken
    const clientId = serverClientid

    const url = `http://${IP}/api/app/osa/v1.0/onecall/users`

    printLog(`\n =========================== users 获取员工信息 =========================== 
    \n uploadFile(params: ${JSON.stringify(params)} ) \n url: ${url} \n clientid: ${clientId} token: ${token}`)

    const date = new Date()
    const timestamp = dateFormat("yyyy-MM-dd HH:mm:ss", date)

    const headers = {
      AccessToken: token,
      ClientId: clientId,
      sign: getSign(),
      timestamp,
    }

    const res = await axios.post(url, params, {
      headers,
    })
    console.log('res', res)
    printLog(`\n users res: ${JSON.stringify(res)}`)
    let infos = null
    if(res.status === 200) {
      const data = JSON.parse(JSON.stringify(res.data))
      if(data.ok === true) {
        infos = JSON.parse(JSON.stringify(data.data))
        userInfo = infos
        printLog(`\n users infos: ${JSON.stringify(infos)}`)
      }
    }
    return infos
  } catch (error) {
    console.log('error', error)
    printLog(`\n users error : ${JSON.stringify(error)}`)
    return null
  }

}

export interface MessageInfoType {
	UserId: string,
	UserName?: string,
	LocalTime: string,
	BeijingTime: string,
	CountryCode: string,
	/** 呼叫内容 */
	MesContent: string,
	/** 轨迹附件UUID */
	Trajectory?: string,
	/** 图片附件UUID，多个文件时以逗号间隔 */
	Photo?: string,
	/** 视频附件UUID，多个文件时以逗号间隔 */
	VideoFile?: string,
	/** 声音附件UUID，多个文件时以逗号间隔 */
	SoundFile?: string,
	// uuid: string,
}

/**
 * 呼叫的数据上传
 * @param params 呼叫的上传数据
 * @returns 成功返回true和失败返回false
 */
export const message = async (params: MessageInfoType) => {
  try {
    const IP = serverIP
    const token = serverToken
    const clientId = serverClientid

    const url = `http://${IP}/api/app/osa/v1.0/onecall/message`

    printLog(`\n =========================== message 数据上传 =========================== 
    \n message(params: ${JSON.stringify(params)} ) \n url: ${url} \n clientid: ${clientId} token: ${token}`)

    const date = new Date()
    const timestamp = dateFormat("yyyy-MM-dd HH:mm:ss", date)

    const headers = {
      AccessToken: token,
      ClientId: clientId,
      sign: getSign(),
      timestamp,
    }

    const paramData = {
      uuid: getUUid(),
      ...params
    }

    const res = await axios.post(url, paramData, {
      headers,
    })
    console.log('res', res)
    printLog(`\n message res: ${JSON.stringify(res)}`)
    let infos = false
    if(res.status === 200) {
      const data = JSON.parse(JSON.stringify(res.data))
      if(data.ok === true) {
        infos = true
        printLog(`\n message data: ${JSON.stringify(res.data)}`)
      }
    }
    return infos
  } catch (error) {
    console.log('error', error)
    printLog(`\n message error: ${JSON.stringify(error)}`)
    global.SimpleDialog.setVisible(false)
    return false
  }

}

/**
 * 获取通讯录列表信息
 * @returns 返回获取到的通讯录列表信息
 */
export const getTelBook = async () => {
  try {
    const IP = serverIP
    const token = serverToken
    const clientId = serverClientid

    const url = `http://${IP}/api/app/osa/v1.0/onecall/telbook/get`

    printLog(`\n =========================== getTelBook 获取通讯录信息 =========================== 
    \n getTelBook() \n url: ${url} \n clientid: ${clientId} token: ${token}`)

    const date = new Date()
    const timestamp = dateFormat("yyyy-MM-dd HH:mm:ss", date)

    const headers = {
      AccessToken: token,
      ClientId: clientId,
      sign: getSign(),
      timestamp,
    }

    const params = {
      UserId: userId,
    }

    const res = await axios.post(url, params, {
      headers,
    })
    console.log('res', res)
    printLog(`\n getTelBook res: ${JSON.stringify(res)}`)
    let infos = null
    let telbookInfo = []
    if(res.status === 200) {
      const data = JSON.parse(JSON.stringify(res.data))
      if(data.ok === true) {
        infos = JSON.parse(JSON.stringify(data.data))
        telbookInfo = infos
        printLog(`\n getTelBook infos: ${JSON.stringify(infos)}`)
      }
    }
    return telbookInfo
  } catch (error) {
    console.log('error', error)
    printLog(`\n getTelBook error : ${JSON.stringify(error)}`)
    return []
  }
}


export interface telBookItemInfoType {
  UserId: string,
  UserName: string,
  Contacts: string,
  Tel: string,
  MobilePhone: string,
  Email: string,
  PostalCode: string,
  Address: string,
  // OpType: "I" | "U" | "D",
  uuid: string,
}

export type opType = "I" | "U" | "D"

/**
 * 对通讯录进行操作（增，删，改）
 * @param telBookItem 操作的联系人项的信息
 * @param type 操作类型 （"I": 增加 ， "U": 修改， "D": 删除）
 * @returns 成功返回true和失败返回false
 */
export const upDateTelBook = async (telBookItem: telBookItemInfoType, type: opType ) => {
  try {
    const IP = serverIP
    const token = serverToken
    const clientId = serverClientid

    const url = `http://${IP}/api/app/osa/v1.0/onecall/telbook/add`

    printLog(`\n =========================== upDateTelBook 对通讯录进行操作 =========================== 
    \n upDateTelBook() \n url: ${url} \n clientid: ${clientId} token: ${token}`)

    const date = new Date()
    const timestamp = dateFormat("yyyy-MM-dd HH:mm:ss", date)

    const headers = {
      AccessToken: token,
      ClientId: clientId,
      sign: getSign(),
      timestamp,
    }

    const params = {
      // uuid: getUUid(),
      opType: type,
      ...telBookItem,

    }

    const res = await axios.post(url, params, {
      headers,
    })
    console.log('res', res)
    printLog(`\n upDateTelBook res: ${JSON.stringify(res)}`)
    let result = false
    if(res.status === 200) {
      const data = JSON.parse(JSON.stringify(res.data))
      if(data.ok === true) {
        result = true
        printLog(`\n upDateTelBook ok: ${JSON.stringify(data.ok)}`)
      }
    }
    return result
  } catch (error) {
    console.log('error', error)
    printLog(`\n upDateTelBook error : ${JSON.stringify(error)}`)
    return false
  }
}


