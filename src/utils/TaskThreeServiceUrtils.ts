import { Fetch } from 'imobile_for_reactnative/NativeModule/interfaces/utils/HttpRequest/Fetch'
import RNFetchBlob from 'rn-fetch-blob'
import { AnswerData } from '../../configs/tabModules/QuestionListOther/QuestionInterface'
import axios from 'axios'
import { Toast } from '../../src/utils'

interface SubtaskInfo {
  equipmentid: number,
  equipmenttype: number,
  jsonvalue: string,
  loadtype: number,
  maintaskid: number,
  process: string,
  restype: number,
  resultypeid: number,
  substate: number,
  subtaskid: number,
  subtaskname: string,
  subtaskremark: string,
  taskrote: string
}

interface SubtaskInfo {
  equipmentid: number,
  equipmenttype: number,
  equipmenttypeame: string,
  jsonvalue: string,
  loadtype: number,
  loadtypename: string,
  maintaskid: number,
  principal: string,
  process: string,
  restype: number,
  restypename: string,
  resultypeid: number,
  substate: number,
  substatename: string,
  subtaskid: number,
  subtaskname: string,
  subtaskremark: string,
  taskrote: string
}

interface MainAndSubTaskInfo {
  rwMaintask: {
    createtime: "2022-03-22T07:41:52.096Z",
    taskid: 0,
    taskname: "string",
    taskremark: "string",
    taskstate: 0
  },
  subtaskInfoList: Array<SubtaskInfo>
}

let rootUrl = ''
let tokenCode = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDg2ODg3NDYsInVzZXJuYW1lIjoiYWRtaW4ifQ.J11HVPdpQsvNPFAF1PvxMW5sY7HkuIW0Pg80d0xfd1o'

/**
 * 超时返回‘timeout’
 * @param sec 超时秒数
 */
function timeout(sec: number): Promise<'timeout'> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('timeout')
    }, 1000 * sec)
  })
}

// ========================= 用户的接口 start ============================

/** 加密密码  '25d55ad283aa400af464c76d713c07ad' */
let pwdCode = async (): Promise<any> => {
  let url = rootUrl + '/api/v1/UserController/passWd?password=12345678'
  const response = RNFetchBlob.fetch('GET', url)
  let result = await Promise.race([response, timeout(30)])
  if(result === 'timeout') {
    return false
  }
  if(result.respInfo.status === 200) {
    // 请求成功
    let info = await result.json()
    
    return info === 'OK' && true
  } else {
    return false
  }
}

/** 登录账号 */
let login = async (urlParam: string): Promise<any> => {
  rootUrl = urlParam
  let url = urlParam + '/api/v1/UserController/login?userName=admin&userPasswd=25d55ad283aa400af464c76d713c07ad'
  const response = RNFetchBlob.fetch('GET', url)
  let result = await Promise.race([response, timeout(30)])
  if(result === 'timeout') {
    Toast.show("请求超时！")
    return false
  }
  if(result.respInfo.status === 200) {
    // 请求成功
    let info = await result.json()
    console.warn("info.userInfo.token: " + info.userInfo.token);
    tokenCode = info.userInfo.token
    return true
  } else {
    return false
  }
}

// ========================= 任务的接口 start ============================

/** 
 * 获取主任务和子任务信息列表
 * @param {string} urlParam 请求的IP地址   urlParam: string
 */
let getMainAndSubTaskInfo = async (): Promise<any> => {
  try {
    let url = rootUrl + '/api/vi/TaskController/getMainAndSubTaskInfo'
    // 登录账号的token要放到请求头里去
    let headers = {
      token: tokenCode,
    }
    const response = RNFetchBlob.fetch('GET', url, headers)
    let result = await Promise.race([response, timeout(30)])
    if(result === 'timeout') {
      console.warn("timeout");
      return false
    }
    if(result.respInfo.status === 200) {
      // 请求成功
      let info = await result.json()
      console.warn("taskid: " + info[0].rwMaintask.taskid);
      // 将请求回来的数据返回出去
      return info
    } else {
      console.warn("result.respInfo.status: " + result.respInfo.status);
      return false
    }
  } catch (error) {
    return false
  }
}


/**
 * 通过id获取单个子任务信息
 * @param {string} urlParam 请求的IP地址 
 * @param {number} subtaskid 子任务id 
 * @returns 
 */
 let getRwSubtaskById = async (subtaskid: number): Promise<any> => {
  try {
    let url = rootUrl + '/api/vi/TaskController/getRwSubtaskById?subtaskid=' + subtaskid
    
    // 登录账号的token要放到请求头里去
    let headers = {
      token: tokenCode,
    }
    const response = RNFetchBlob.fetch('GET', url, headers)
    let result = await Promise.race([response, timeout(30)])
    if(result === 'timeout') {
      return false
    }
    if(result.respInfo.status === 200) {
      // 请求成功
      let info = await result.json()
      // 将请求回来的数据返回出去
      return info
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}


/**
 * 通过id更新单个子任务信息
 * @param {number} subtaskid 请求的IP地址 
 * @param {string} process 子任务信息 to do
 * @returns 
 */
 let setSubtaskProcess = async (subtaskid: number, process:string): Promise<any> => {
  try {
    let url = rootUrl + '/api/vi/TaskController/setSubtaskProcess?subtaskid=' + subtaskid + '&process=' + process + '25'
   
    // 登录账号的token要放到请求头里去
    let headers = {
      token: tokenCode,
    }
    const response = RNFetchBlob.fetch('PUT', url, headers)
    let result = await Promise.race([response, timeout(30)])
    if(result === 'timeout') {
      return false
    }
    if(result.respInfo.status === 200) {
      // 请求成功
      let info = await result.json()
      // 将请求回来的数据返回出去
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}


// ========================= 问卷的接口 start ============================
/**
 * 获取问卷列表信息
 * @param {string} urlParam 请求的IP地址 
 * @param {number} current 当前页
 * @param {number} size 一页加载多少条数据
 * @returns 
 */
 let getTbSurveyList = async (current: number, size: number): Promise<any> => {
  try {
    let url = rootUrl + '/api/vi/SurveyController/getTbSurveyList?current='+ current + '&size=' + size
    
    // 登录账号的token要放到请求头里去
    let headers = {
      token: tokenCode,
    }
    const response = RNFetchBlob.fetch('GET', url, headers)
    let result = await Promise.race([response, timeout(30)])
    if(result === 'timeout') {
      return false
    }
    if(result.respInfo.status === 200) {
      // 请求成功
      let info = await result.json()
      Toast.show("问卷列表获取成功！")
      // 将请求回来的数据返回出去
      return info
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

/**
 * 获取单个问卷具体信息
 * @param {string} urlParam 请求的IP地址 
 * @param {number} id 当前问卷的问卷具体信息
 * @returns 
 */
 let getTbSurveyInfoById = async (id: number): Promise<any> => {
  try {
    let url = rootUrl + '/api/vi/SurveyController/getTbSurveyInfoById?id='+ id
    
    // 登录账号的token要放到请求头里去
    let headers = {
      token: tokenCode,
    }
    const response = RNFetchBlob.fetch('GET', url, headers)
    let result = await Promise.race([response, timeout(30)])
    if(result === 'timeout') {
      return false
    }
    if(result.respInfo.status === 200) {
      // 请求成功
      let info = await result.json()
      // 将请求回来的数据返回出去
      return info
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

/**
 * 新增问题的答案
 * @param {string} urlParam 请求的IP地址 
 * @param {string} insertAnswerParam 子任务信息 to do
 * @returns 
 */
 let addTbAnswerList = async (insertAnswerParam: Array<AnswerData>): Promise<boolean> => {
  try {
    let url = rootUrl + '/api/vi/SurveyController/addTbAnswerList'
    
    // 登录账号的token要放到请求头里去
    let headers = {
      token: tokenCode,
    }
    // 传递的参数信息
    let params = {
      tbAnswerList: insertAnswerParam,
    }

    axios.post(url, params, {headers})
    .then((res) => {
      let status = res.status
      if(status === 200) {
        return true
      } else {
        return false
      }
    })
    .catch(error => {
      return false
    })

  } catch (error) {
    return false
  }
}


// ========================= 风险的接口 start ============================
interface fileObjData {
  base64: string,
  path: string,
}

/** 上传风险图片 */
 let updateRiskImg = async (projectid: number, riskid: number, fileObj: fileObjData): Promise<boolean> => {
  try {
    let url = rootUrl + '/api/vi/RiskController/updateRiskImg?projectid='+ projectid + '&riskid=' + riskid
    
    // 登录账号的token要放到请求头里去
    let headers = {
      token: tokenCode,
      "Content-Type": "multipart/form-data",
    }

    // 数据的准备
    let source = fileObj.base64
    let path = fileObj.path
    let name = path.substring(path.lastIndexOf("/") + 1, path.length)

    const response = RNFetchBlob.fetch('POST', url, headers, [
      { name : 'file', filename : name, data: source},
    ])
    let result = await Promise.race([response, timeout(30)])

    if(result === 'timeout') {
      return false
    }
    if(result.respInfo.status === 200) {
      // 请求成功
      let info = await result.json()
      return true
    } else {
      return false
    }

  } catch (error) {
    return false
  }
}


export {
  // 用户的接口
  pwdCode,
  login,
  // 任务的接口
  getMainAndSubTaskInfo,
  getRwSubtaskById,
  setSubtaskProcess,
  // 问卷的接口
  getTbSurveyList,
  getTbSurveyInfoById,
  addTbAnswerList,
  // 风险的接口
  updateRiskImg,
 
}