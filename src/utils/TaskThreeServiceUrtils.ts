import { Fetch } from 'imobile_for_reactnative/NativeModule/interfaces/utils/HttpRequest/Fetch'
import RNFetchBlob from 'rn-fetch-blob'
import { AnswerData } from '../../configs/tabModules/QuestionListOther/QuestionInterface'

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

let rootUrl = 'http://192.168.11.21:6932'
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
  let result = await Promise.race([response, timeout(10)])
  // debugger
  if(result === 'timeout') {
    console.warn("timeout");
    return false
  }
  if(result.respInfo.status === 200) {
    // 请求成功
    let info = await result.json()
    console.warn("info: " + info);
    
    return info === 'OK' && true
  } else {
    console.warn("result.respInfo.status: " + result.respInfo.status);
    return false
  }
}

/** 登录账号 */
let login = async (urlParam: string): Promise<any> => {
  let url = rootUrl + '/api/v1/UserController/login?userName=admin&userPasswd=25d55ad283aa400af464c76d713c07ad'
  if(urlParam === '') {
    url = urlParam + '/api/v1/UserController/login?userName=admin&userPasswd=25d55ad283aa400af464c76d713c07ad'
  }
  const response = RNFetchBlob.fetch('GET', url)
  let result = await Promise.race([response, timeout(10)])
  // debugger
  if(result === 'timeout') {
    console.warn("timeout");
    return false
  }
  if(result.respInfo.status === 200) {
    // 请求成功
    let info = await result.json()
    console.warn("info.userInfo.token: " + info.userInfo.token);
    tokenCode = info.userInfo.token
    // debugger
    return true
  } else {
    console.warn("result.respInfo.status: " + result.respInfo.status);
    return false
  }
}

// ========================= 任务的接口 start ============================

/** 
 * 获取主任务和子任务信息列表
 * @param {string} urlParam 请求的IP地址 
 */
let getMainAndSubTaskInfo = async (urlParam: string): Promise<any> => {
  try {
    let url = rootUrl + '/api/vi/TaskController/getMainAndSubTaskInfo'
    if(urlParam === '') {
      url = urlParam + '/api/vi/TaskController/getMainAndSubTaskInfo'
    }
    
    // 登录账号的token要放到请求头里去
    let headers = {
      token: tokenCode,
    }
    const response = RNFetchBlob.fetch('GET', url, headers)
    let result = await Promise.race([response, timeout(10)])
    debugger
    if(result === 'timeout') {
      console.warn("timeout");
      return false
    }
    if(result.respInfo.status === 200) {
      // 请求成功
      let info = await result.json()
      console.warn("taskid: " + info[0].rwMaintask.taskid);
      // debugger
      // 将请求回来的数据返回出去
      return info
    } else {
      console.warn("result.respInfo.status: " + result.respInfo.status);
      // debugger
      return false
    }
  } catch (error) {
    // debugger
    return false
  }
}


/**
 * 通过id获取单个子任务信息
 * @param {string} urlParam 请求的IP地址 
 * @param {number} subtaskid 子任务id 
 * @returns 
 */
 let getRwSubtaskById = async (urlParam: string, subtaskid: number): Promise<any> => {
  try {
    let url = rootUrl + '/api/vi/TaskController/getRwSubtaskById?subtaskid=' + subtaskid
    if(urlParam === '') {
      url = urlParam + '/api/vi/TaskController/getRwSubtaskById?subtaskid=' + subtaskid
    }
    
    // 登录账号的token要放到请求头里去
    let headers = {
      token: tokenCode,
    }
    const response = RNFetchBlob.fetch('GET', url, headers)
    let result = await Promise.race([response, timeout(10)])
    // debugger
    if(result === 'timeout') {
      console.warn("timeout");
      return false
    }
    if(result.respInfo.status === 200) {
      // 请求成功
      let info = await result.json()
      // console.warn("subtaskid: " + info.subtaskid);
      // debugger
      // 将请求回来的数据返回出去
      return info
    } else {
      // console.warn("result.respInfo.status: " + result.respInfo.status);
      // debugger
      return false
    }
  } catch (error) {
    // console.warn("error: " + error);
    // debugger
    return false
  }
}


/**
 * 通过id更新单个子任务信息
 * @param {number} subtaskid 请求的IP地址 
 * @param {string} process 子任务信息 to do
 * @returns 
 */
 let setSubtaskProcess = async (urlParam: string, subtaskid: number, process:string): Promise<any> => {
  try {
    let url = rootUrl + '/api/vi/TaskController/setSubtaskProcess?subtaskid=' + subtaskid + '&process=' + process + '25'
    if(urlParam === '') {
      url = urlParam + '/api/vi/TaskController/setSubtaskProcess?subtaskid=' + subtaskid + '&process=' + process + '25'
    }
    
    // 登录账号的token要放到请求头里去
    let headers = {
      token: tokenCode,
    }
    const response = RNFetchBlob.fetch('PUT', url, headers)
    let result = await Promise.race([response, timeout(10)])
    // debugger
    if(result === 'timeout') {
      console.warn("timeout");
      return false
    }
    if(result.respInfo.status === 200) {
      // 请求成功
      let info = await result.json()
      // console.warn("subtaskid: " + info.subtaskid);
      // debugger
      // 将请求回来的数据返回出去
      return true
    } else {
      // console.warn("result.respInfo.status: " + result.respInfo.status);
      // debugger
      return false
    }
  } catch (error) {
    console.warn("error: " + error);
    // debugger
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
 let getTbSurveyList = async (urlParam: string, current: number, size: number): Promise<any> => {
  try {
    let url = rootUrl + '/api/vi/SurveyController/getTbSurveyList?current='+ current + '&size=' + size
    if(urlParam === '') {
      url = urlParam + '/api/vi/SurveyController/getTbSurveyList?current='+ current + '&size=' + size
    }
    
    // 登录账号的token要放到请求头里去
    let headers = {
      token: tokenCode,
    }
    const response = RNFetchBlob.fetch('GET', url, headers)
    let result = await Promise.race([response, timeout(10)])
    // debugger
    if(result === 'timeout') {
      console.warn("timeout");
      return false
    }
    if(result.respInfo.status === 200) {
      // 请求成功
      let info = await result.json()
      // debugger
      // 将请求回来的数据返回出去
      return info
    } else {
      // console.warn("result.respInfo.status: " + result.respInfo.status);
      debugger
      return false
    }
  } catch (error) {
    // console.warn("error: " + error);
    debugger
    return false
  }
}

/**
 * 获取单个问卷具体信息
 * @param {string} urlParam 请求的IP地址 
 * @param {number} id 当前问卷的问卷具体信息
 * @returns 
 */
 let getTbSurveyInfoById = async (urlParam: string, id: number): Promise<any> => {
  try {
    let url = rootUrl + '/api/vi/SurveyController/getTbSurveyInfoById?id='+ id
    if(urlParam === '') {
      url = urlParam + '/api/vi/SurveyController/getTbSurveyInfoById?id='+ id
    }
    
    // 登录账号的token要放到请求头里去
    let headers = {
      token: tokenCode,
    }
    const response = RNFetchBlob.fetch('GET', url, headers)
    let result = await Promise.race([response, timeout(10)])
    // debugger
    if(result === 'timeout') {
      console.warn("timeout");
      return false
    }
    if(result.respInfo.status === 200) {
      // 请求成功
      let info = await result.json()
      // debugger
      // 将请求回来的数据返回出去
      return info
    } else {
      // console.warn("result.respInfo.status: " + result.respInfo.status);
      debugger
      return false
    }
  } catch (error) {
    // console.warn("error: " + error);
    debugger
    return false
  }
}

/**
 * 新增问题的答案
 * @param {string} urlParam 请求的IP地址 
 * @param {string} insertAnswerParam 子任务信息 to do
 * @returns 
 */
 let addTbAnswerList = async (urlParam: string, insertAnswerParam: Array<AnswerData>): Promise<boolean> => {
  try {
    let url = rootUrl + '/api/vi/SurveyController/addTbAnswerList'
    if(urlParam === '') {
      url = urlParam + '/api/vi/SurveyController/addTbAnswerList'
    }
    
    // 登录账号的token要放到请求头里去
    let headers = {
      token: tokenCode,
      // Authorization: tokenCode,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // charset: 'utf-8',
    }

    let answerListObj = '{"tbAnswerList":' + JSON.stringify(insertAnswerParam) + '}'
    // 传递的参数信息
    let uploadParams = {
      insertAnswerParam: answerListObj,
      // tbAnswerList: JSON.stringify(insertAnswerParam)
    }
    debugger
    // const response = RNFetchBlob.fetch('POST', url, headers, JSON.stringify(uploadParams))
    const response = RNFetchBlob.fetch('POST', url, headers, [
      {name:'insertAnswerParam', data: answerListObj}
    ])

    const response01 = await fetch(url,{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: tokenCode,
      },
      credentials: 'include',
      body: JSON.stringify(uploadParams),
    })

    const fetchobj = new Fetch()
    fetchobj.request({url,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: tokenCode,
      },
      body: uploadParams,
    })

    let result = await Promise.race([response, timeout(10)])
    debugger
    if(result === 'timeout') {
      console.warn("timeout");
      return false
    }
    if(result.respInfo.status === 200) {
      // 请求成功
      let info = await result.json()
      // console.warn("subtaskid: " + info.subtaskid);
      debugger
      // 将请求回来的数据返回出去
      return true
    } else {
      // console.warn("result.respInfo.status: " + result.respInfo.status);
      debugger
      return false
    }
  } catch (error) {
    console.warn("error: " + error);
    debugger
    return false
  }
}






// ========================= 未用的接口 start ============================

/**
 * 通过id更新单个子任务信息
 * @param {string} urlParam 请求的IP地址 
 * @param {any} subtaskInfo 子任务信息 to do
 * @returns 
 */
 let updateSubtaskList = async (urlParam: string, subtaskInfo: any): Promise<any> => {
  try {
    let url = rootUrl + '/api/vi/TaskController/updateSubtaskList'
    if(urlParam === '') {
      url = urlParam + '/api/vi/TaskController/updateSubtaskList'
    }
    
    // 登录账号的token要放到请求头里去
    let headers = {
      token: tokenCode,
    }
    // 传递的参数信息
    let uploadParams = {
      rwSubtaskInfo: subtaskInfo,
    }
    const response = RNFetchBlob.fetch('PUT', url, headers, uploadParams)
    let result = await Promise.race([response, timeout(10)])
    // debugger
    if(result === 'timeout') {
      console.warn("timeout");
      return false
    }
    if(result.respInfo.status === 200) {
      // 请求成功
      let info = await result.json()
      // console.warn("subtaskid: " + info.subtaskid);
      // debugger
      // 将请求回来的数据返回出去
      return info
    } else {
      // console.warn("result.respInfo.status: " + result.respInfo.status);
      // debugger
      return false
    }
  } catch (error) {
    console.warn("error: " + error);
    // debugger
    return false
  }
}



/**
 * 更新主任务信息
 * @param maintaskInsertParam 主任务信息（包含子任务信息列表）
 * @returns 
 */
let updateRwMainStask = async (maintaskInsertParam: MainAndSubTaskInfo): Promise<any> => {
  try {
    let url = rootUrl + '/api/vi/TaskController/updateRwMainStask?maintaskInsertParam=' + maintaskInsertParam
    // 登录账号的token要放到请求头里去
    let headers = {
      token: tokenCode,
    }
    // 参数
    let paramStr = JSON.stringify({
      maintaskInsertParam
    })

    const response = await RNFetchBlob.fetch('PUT', url, headers)
    let result = await response.json()

    if(result.state === 200) {
      console.warn("update MainTask: "+ result.status + "--" + result.succeed);
      // debugger
      return result.succeed
    } else {
      console.warn("update MainTask: "+ result.status + "--" + result.error);
      // debugger
      return false
    }
  
  } catch (error) {
    return false
  }
}


/**
 * 通过id改变主任务的状态 ========== 500 Internal Server Error =============== 
 * @param taskid 主任务ID
 * @param taskstate  主任务状态码 （1已创建，2已实施，3已完成）
 * @returns 
 */
let setMaintaskstate = async (taskid: number, taskstate: number): Promise<any> => {
  try {
    let url = rootUrl + '/api/vi/TaskController/setMaintaskstate?taskid=' + taskid + '&taskstate=' + taskstate 
    // 登录账号的token要放到请求头里去
    let headers = {
      token: tokenCode,
    }
    // 参数
    let paramStr = JSON.stringify({
      taskid,
      taskstate,
    })
    

    const response = await RNFetchBlob.fetch('PUT', url, headers)
    let result = await response.json()

    if(result.state === true) {
      console.warn("MainTask: " + result.message);
      // debugger
      return result.succeed
    } else {
      console.warn("MainTask: "+ result.status + "--" + result.error);
      // debugger
      return false
    }
  
  } catch (error) {
    return false
  }
}

/**
 * 通过id改变子任务的状态   
 * 请求成功返回状态码200，但重新获取主任务和子任务信息列表，信息没有改变
 * @param subtaskid 子任务id
 * @param subtaskstate 子任务状态码（1创建，2派发，3实施，4完成）
 * @returns 
 */
let setSubtaskState = async (subtaskid: number, subtaskstate: number): Promise<any> => {
  try {
    let url = rootUrl + '/api/vi/TaskController/setSubtaskState?subtaskid=' + subtaskid + '&subtaskstate=' + subtaskstate
    // 登录账号的token要放到请求头里去
    let headers = {
      token: tokenCode,
    }
    // 参数
    let paramStr = JSON.stringify({
      subtaskid,
      subtaskstate,
    })

    const response = await RNFetchBlob.fetch('PUT', url, headers)
    let status = response.respInfo.status
    if(status === 200) {
      console.warn("subtask: " + status);
      // debugger
      return true
    } else {
      console.warn("subtask: " + status);
      // debugger
      return false
    }
  
  } catch (error) {
    return false
  }
}



// ========================= 未用的接口 End ============================



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
  // 未用的接口 start
  updateSubtaskList,
  updateRwMainStask,
  setMaintaskstate,
  setSubtaskState,
  // 未用的接口 end
}