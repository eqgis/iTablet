import { AppToolBar, Toast } from '@/utils'
import axios from 'axios'
import { Platform } from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'

function getSign(){
  return Math.round(Math.random() * 100)
}

let serverIP = ""
let serverToken = ""
let serverClientid = "Gvvy19yU"

export const setServerIPUtil = (IP: string) => {
  serverIP = IP
}

export const setServerTokenUtil = (token: string) => {
  serverToken = token
}

export const setServerClientidUtil = (clientid: string) => {
  serverClientid = clientid
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
      let day: number | string = date.getDay()
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
    console.warn("formatstr07: " + formatstr)
  }
  return formatstr
}

// http://IP/api/app/osa/v1.0/token/get?clientid=clientid&grant_type=client_credentials&clientsecret=clientsecret
/**
 * 获取动态的token
 */
export const getToken = async (clientid?: string, clientsecret?: string) => {
  const IP = serverIP
  const url =  `http://${IP}/api/app/osa/v1.0/token/get`
  const clientId = clientid || serverClientid
  // AppToolBar.getProps().setServerClientid(clientId)
  console.warn("getToken: " + url + "\nclientId: " + clientId)
  axios.get(url, {
    params: {
      clientid: clientId,
      clientsecret: clientsecret || "fe699f4b76afe5066b2302faf2ab3737",
      grant_type: "client_credentials",
    }
  })
    .then(function (response) {
      console.log(response)
      if(response.status === 200) {
        const data = JSON.parse(JSON.stringify(response.data))
        if(data.ok === true) {
          const token = data.data
          console.warn("token: " + token)
          // AppToolBar.getProps().setServerToken(token)
          setServerTokenUtil(token)
        }
      }
    })
    .catch(function (error) {
      console.log(error)
    })
    .finally(function () {
    // always executed
    })
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

    const formData = new FormData()
    // file是字段名，根据后端接受参数的名字来定,android上通过react-native-file-selector获取的path是不包含'file://'协议的
    // android上需要拼接协议为'file://'+path，而IOS则不需要,type可以是文件的MIME类型或者'multipart/form-data'
    if(Platform.OS === "android") {
      formData.append('file',{uri: 'file://'+path,type:'multipart/form-data'})
    } else if(Platform.OS === 'ios') {
      formData.append('file',{uri: path,type:'multipart/form-data'})
    }
    // 可能还会有其他参数 formData.append(key,value)

    // const params = new URLSearchParams()
    // if(Platform.OS === "android") {
    //   params.append('file',{uri: 'file://'+path,type:'multipart/form-data'})
    // } else if(Platform.OS === 'ios') {
    //   params.append('file',{uri: path,type:'multipart/form-data'})
    // }

    const headers = {
    // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Content-Type': 'multipart/form-data',
      AccessToken: token,
      ClientId: clientId,
    }

    const res = await axios.post(url, formData, {
      method: 'post',
      headers,
    })
    console.log('res', res)
    let info = null
    if(res.status === 200) {
      const data = JSON.parse(JSON.stringify(res.data))
      if(data.ok === true) {
        Toast.show("附件上传成功")
        info = JSON.parse(JSON.stringify(data.data))
      }
    }
    return info
  } catch (error) {
    console.warn("error: " + error)
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
    let infos = null
    if(res.status === 200) {
      const data = JSON.parse(JSON.stringify(res.data))
      if(data.ok === true) {
        infos = JSON.parse(JSON.stringify(data.data))
      }
    }
    return infos
  } catch (error) {
    console.log('error', error)
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
    let infos = false
    if(res.status === 200) {
      const data = JSON.parse(JSON.stringify(res.data))
      if(data.ok === true) {
        infos = true
      }
    }
    return infos
  } catch (error) {
    console.log('error', error)
    return false
  }

}


