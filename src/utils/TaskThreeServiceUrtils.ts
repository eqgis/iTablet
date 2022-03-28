import RNFetchBlob from 'rn-fetch-blob'

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

let rootUrl = 'http://192.168.11.21:6933'
let tokenCode = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDg1MTM1NjMsInVzZXJuYW1lIjoiYWRtaW4ifQ.22hnGWXqIEX6eG4zVKC7XzV6vBmEAx-JahAaW4OtUY8'

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

/** 加密密码  '25d55ad283aa400af464c76d713c07ad' */
let pwdCode = async (): Promise<any> => {
  let url = 'http://10.10.7.133:6932/api/v1/UserController/passWd?password=12345678'
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
let login = async (): Promise<any> => {
  let url = 'http://10.10.7.133:6932/api/v1/UserController/login?userName=admin&userPasswd=25d55ad283aa400af464c76d713c07ad'
  const response = RNFetchBlob.fetch('GET', url)
  let result = await Promise.race([response, timeout(10)])
  if(result === 'timeout') {
    console.warn("timeout");
    return false
  }
  if(result.respInfo.status === 200) {
    // 请求成功
    let info = await result.json()
    console.warn("info.userInfo.token: " + info.userInfo.token);
    
    return true
  } else {
    console.warn("result.respInfo.status: " + result.respInfo.status);
    return false
  }
}

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
    // debugger
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
    let url = rootUrl + '/api/vi/TaskController/setSubtaskProcess?subtaskid=' + subtaskid + '&process=' + process
    if(urlParam === '') {
      url = urlParam + '/api/vi/TaskController/setSubtaskProcess?subtaskid=' + subtaskid + '&process=' + process
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





export {
  pwdCode,
  login,
  getMainAndSubTaskInfo,
  getRwSubtaskById,
  setSubtaskProcess,
  updateSubtaskList,
  updateRwMainStask,
  setMaintaskstate,
  setSubtaskState,
}