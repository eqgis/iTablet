import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { ModelUtils } from '../../utils'
import { MsgConstant } from '../../constants'
import { SMessageService, SMap } from 'imobile_for_reactnative'
import CoworkFileHandle from '../../containers/tabs/Find/CoworkManagePage/CoworkFileHandle'
import CoworkInfo from '../../containers/tabs/Friend/Cowork/CoworkInfo'

// Constants
// --------------------------------------------------
export const ADD_COWORK_INVITE = 'ADD_COWORK_INVITE'
export const DELETE_COWORK_INVITE = 'DELETE_COWORK_INVITE'
export const COWORK_GROUP_MSG_ADD = 'COWORK_GROUP_MSG_ADD'
export const COWORK_GROUP_MSG_READ = 'COWORK_GROUP_MSG_READ'
export const COWORK_GROUP_MSG_DELETE = 'COWORK_GROUP_MSG_DELETE'
export const COWORK_GROUP_MSG_TASK_SET = 'COWORK_GROUP_MSG_TASK_SET'
export const COWORK_GROUP_APPLY = 'COWORK_GROUP_APPLY'
export const COWORK_GROUP_SET = 'COWORK_GROUP_SET'
export const COWORK_GROUP_EXIT = 'COWORK_GROUP_EXIT'
export const COWORK_GROUP_DELETE_TASK = 'COWORK_GROUP_DELETE_TASK'
/** 设置当前协作群组 */
export const COWORK_GROUP_SET_CURRENT = 'COWORK_GROUP_SET_CURRENT'
/** 设置当前协作群组任务 */
export const COWORK_TASK_SET_CURRENT = 'COWORK_TASK_SET_CURRENT'
/** 协作群组任务添加成员 */
export const COWORK_TASK_MEMBERS_ADD = 'COWORK_TASK_MEMBERS_ADD'
/** 协作群组任务删除成员 */
export const COWORK_TASK_MEMBERS_DELETE = 'COWORK_TASK_MEMBERS_DELETE'
/** 协作群组任务消息 */
export const COWORK_NEW_MESSAGE_SET = 'COWORK_NEW_MESSAGE_SET'

export const COWORK_TASK_INFO_ADD = 'COWORK_TASK_INFO_ADD'
export const COWORK_TASK_INFO_READ = 'COWORK_TASK_INFO_READ'
export const COWORK_TASK_INFO_REALTIME_SET = 'COWORK_TASK_INFO_REALTIME_SET'
/** 添加成员是否显示轨迹和位置 */
export const COWORK_TASK_INFO_MEMBER_LOCATION_ADD = 'COWORK_TASK_INFO_MEMBER_LOCATION_ADD'
/** 设置成员是否显示轨迹和位置 */
export const COWORK_TASK_INFO_MEMBER_LOCATION_SHOW = 'COWORK_TASK_INFO_MEMBER_LOCATION_SHOW'

/** 协作群组数据服务添加/修改 */
export const COWORK_SERVICE_SET = 'COWORK_SERVICE_SET'
/** 协作群组数据服务清除 */
export const COWORK_SERVICE_CLEAR = 'COWORK_SERVICE_CLEAR'

// export interface Task {
// }

export interface TaskInfoParams {
  groupId: string,
  taskId: string,
  message: {
    // messageID: number,
    user: {
      id: string,
      name: string,
    },
    message: {
      id: string,
      layerPath: string,
      geoUserID: string,
      // status: boolean,
    },
  },
}

export interface TaskReadParams {
  groupId: string,
  taskId: string,
  messageID: boolean,
  status?: number, // 0 未读，1 已读，2 忽略
}

export interface TaskRealTimeParams {
  groupId: string,
  taskId: string,
  isRealTime: boolean,
}

export interface TaskMemberLocationParams {
  groupId: string,
  taskId: string,
  memberId?: string, // 没有指定memberId，则是全部成员
  show: boolean,
  location?: Location,
}

export interface TaskMemberDeleteParams {
  groupId: string,
  taskId: string,
  members: Array<Member>,
}

export interface TaskInfo {
  messages: Array<any>,          // 添加到地图上的消息
  prevMessages: Array<any>,      // 未添加到地图上的消息
  unread: number,
  isRealTime: boolean,           // 是否是实时添加
  members: Array<CoworkMember>,  // 本地储存的成员，
}

export interface Cowork {
  invites: [],
  tasks: {[userId: string]: {[groupId: string]: Array<any>}},
  messages: {[userId: string]: {[groupId: string]: Array<any>}},
}

export interface Location {
  longitude: number,
  latitude: number,
  initial?: string,
}

/**
 * 发送消息的成员格式
 */
export interface Member {
  id: string,
  name: string,
}

/**
 * 储存到本地的成员格式
 */
export interface CoworkMember {
  id: string,
  name: string,
  location?: Location,
  show: boolean,
}

export interface ReadMsgParams {
  read?: number, //read为undefined时，则归0
  target?: { //若存在，则为群组消息
    groupId: string,
    taskId?: string, //若存在，则为任务群组消息
  },
  type: number,
}

export interface ServiceInfo {
  layerName: string,
  datasetUrl?: string,
  datasourceName?: string,
  datasetName?: string,
  status?: 'publish' | 'update' | 'upload' | 'download' | 'done',
  progress?: number,
}

export interface IDParams {
  groupId: string,
  taskId: string,
}

export interface ServiceParams extends IDParams {
  service: ServiceInfo[] | ServiceInfo,
}


let adding = false // 防止重复添加消息

// Actions
// ---------------------------------.3-----------------
export const addInvite = (params = {}, cb = () => {}) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  await dispatch({
    type: ADD_COWORK_INVITE,
    payload: params,
  })
  cb && cb()
}

export interface DeleteInviteParams {
  userId: string,
  coworkId: string,
}
export const deleteInvite = (params: DeleteInviteParams) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  return await dispatch({
    type: DELETE_COWORK_INVITE,
    payload: params,
  })
}

/**
 * 添加/修改 任务消息
 * @param params
 * @param cb
 */
export const addCoworkMsg = (params: any, cb?: () => {}) => async (dispatch: (arg0: any) => any, getState: () => any) => {
  const userId = getState().user.toJS().currentUser.userName || 'Customer'
  if (params.type === MsgConstant.MSG_ONLINE_MEMBER_DELETE) {
    // 接收到被踢出群组的消息，删除本地的群组
    let _params = {
      groupID: params.group.groupID,
    }
    await dispatch({
      type: COWORK_GROUP_EXIT,
      payload: _params,
      userId: userId,
    })
  } else {
    await dispatch({
      type: COWORK_GROUP_MSG_ADD,
      payload: params,
      userId: userId,
    })
  }
  cb && cb()
}

/**
 * 读取群组（申请/邀请/聊天）消息
 */
export const readCoworkGroupMsg = (params: ReadMsgParams) => async (dispatch: (arg0: any) => any, getState: () => any) => {
  const userId = getState().user.toJS().currentUser.userName || 'Customer'
  return await dispatch({
    type: COWORK_GROUP_MSG_READ,
    payload: params,
    userId: userId,
  })
}

export const deleteCoworkMsg = (params: any, cb?: () => {}) => async (dispatch: (arg0: any) => any, getState: () => any) => {
  const userId = getState().user.toJS().currentUser.userName || 'Customer'
  await dispatch({
    type: COWORK_GROUP_MSG_DELETE,
    payload: params,
    userId: userId,
  })
  cb && cb()
}

/**
 * 设置在线群组任务
 * @param params {groupID: string, tasks: Array<any>}
 * @param cb () => {}
 */
export const setCoworkTaskGroup = (
  params: {groupID: string, tasks: Array<any>}, cb?: () => void
) => async (dispatch: (arg0: any) => any, getState: () => any) => {
  const userId = getState().user.toJS().currentUser.userName || 'Customer'
  await dispatch({
    type: COWORK_GROUP_MSG_TASK_SET,
    payload: params,
    userId: userId,
  })
  cb && cb()
}

/**
 * 保存在线群组
 * @param params Array<any>
 * @param cb () => {}
 */
export const setCoworkGroup = (params = {}, cb = () => {}) => async (dispatch: (arg0: any) => any, getState: () => any) => {
  const userId = getState().user.toJS().currentUser.userName || 'Customer'
  await dispatch({
    type: COWORK_GROUP_SET,
    payload: params,
    userId: userId,
  })
  cb && cb()
}

/**
 * 删除群组中的任务
 * @param params
 * @param cb
 * @returns
 */
export const deleteGroupTasks = (params: {userId: string, groupId: string, taskIds: string[]}, cb = () => {}) => async (dispatch: (arg0: any) => any, getState: () => any) => {
  const userId = getState().user.toJS().currentUser.userName || 'Customer'
  await dispatch({
    type: COWORK_GROUP_DELETE_TASK,
    payload: params,
    userId: userId,
  })
  cb && cb()
}

/**
 * 退出协作群组，删除groups和tasks中的数据
 * @param params {groupID: number | string}
 * @param cb () => {}
 */
export const exitGroup = (params: {groupID: number | string}) => async (dispatch: (arg0: any) => any, getState: () => any) => {
  const userId = getState().user.toJS().currentUser.userName || 'Customer'
  return await dispatch({
    type: COWORK_GROUP_EXIT,
    payload: params,
    userId: userId,
  })
}

/**
 * 设置当前进入的协作群组
 * @param params
 * @param cb
 */
export const setCurrentGroup = (params: any, cb = () => {}) => async (dispatch: (arg0: any) => any) => {
  await dispatch({
    type: COWORK_GROUP_SET_CURRENT,
    payload: params,
  })
  cb && cb()
}

/**
 * 设置当前协作群组任务
 * @param params
 * @param cb
 */
export const setCurrentTask = (params: any, cb = () => {}) => async (dispatch: (arg0: any) => any, getState: () => any) => {
  const userId = getState().user.toJS().currentUser.userName || 'Customer'
  await dispatch({
    type: COWORK_TASK_SET_CURRENT,
    payload: params,
    userId,
  })
  cb && cb()
}

/**
 * 添加消息到地图上
 * @param params TaskInfoParams
 */
export const addTaskMessage = (params: TaskInfoParams) => async (dispatch: (arg0: any) => any, getState: () => any) => {
  if (adding) return
  adding = true
  const userId = getState().user.toJS().currentUser.userName || 'Customer'
  let result = await dispatch({
    type: COWORK_TASK_INFO_ADD,
    payload: params,
    userId,
  })
  adding = false
  return result
}

/**
 * 任务消息已读
 * @param params TaskReadParams
 */
export const readTaskMessage = (params: TaskReadParams) => async (dispatch: (arg0: any) => any, getState: () => any) => {
  const userId = getState().user.toJS().currentUser.userName || 'Customer'
  const coworkInfo = getState().cowork.toJS().coworkInfo
  // 若任务不存在，则设置失败
  if (!coworkInfo?.[userId]?.[params.groupId]?.[params.taskId]) {
    return false
  }
  let result = await dispatch({
    type: COWORK_TASK_INFO_READ,
    payload: params,
    userId: userId,
  })
  return result
}

/**
 * 设置实时消息
 * @param params TaskRealTimeParams
 * @param cb
 */
export const setIsRealTime = (params: TaskRealTimeParams) => async (dispatch: (arg0: any) => any, getState: () => any) => {
  const userId = getState().user.toJS().currentUser.userName || 'Customer'
  const coworkInfo = getState().cowork.toJS().coworkInfo
  // 若任务不存在，则设置失败
  if (!coworkInfo?.[userId]?.[params.groupId]?.[params.taskId]) {
    return false
  }
  let result = await dispatch({
    type: COWORK_TASK_INFO_REALTIME_SET,
    payload: params,
    userId: userId,
  })
  return result
}

/**
 * 设置成员是否显示轨迹和位置
 * @param params TaskMemberLocationParams
 */
export const setMemberShow = (params: TaskMemberLocationParams) => async (dispatch: (arg0: any) => any, getState: () => any) => {
  const userId = getState().user.toJS().currentUser.userName || 'Customer'
  let result = await dispatch({
    type: COWORK_TASK_INFO_MEMBER_LOCATION_SHOW,
    payload: params,
    userId: userId,
  })
  return result
}

/**
 * 添加成员是否显示轨迹和位置
 * @param params TaskMemberLocationParams
 */
export const addMemberLocation = (params: TaskMemberLocationParams) => async (dispatch: (arg0: any) => any, getState: () => any) => {
  const userId = getState().user.toJS().currentUser.userName || 'Customer'
  let result = await dispatch({
    type: COWORK_TASK_INFO_MEMBER_LOCATION_ADD,
    payload: params,
    userId: userId,
  })
  return result
}

/**
 * 删除任务群成员
 * @param params TaskMemberDeleteParams
 */
export const deleteTaskMembers = (params: TaskMemberDeleteParams) => async (dispatch: (arg0: any) => any, getState: () => any) => {
  const userId = getState().user.toJS().currentUser.userName || 'Customer'
  let result = await dispatch({
    type: COWORK_TASK_MEMBERS_DELETE,
    payload: params,
    userId: userId,
  })
  return result
}

export const setCoworkService = (params: ServiceParams) => async (dispatch: (arg0: any) => any, getState: () => any) => {
  const userId = getState().user.toJS().currentUser.userName || 'Customer'
  let result = await dispatch({
    type: COWORK_SERVICE_SET,
    payload: params,
    userId: userId,
  })
  return result
}

/**
 * 清除指定群组-任务中的redux服务
 */
export const clearCoworkService = (params: IDParams) => async (dispatch: (arg0: any) => any, getState: () => any) => {
  const userId = getState().user.toJS().currentUser.userName || 'Customer'
  const result = await dispatch({
    type: COWORK_SERVICE_CLEAR,
    payload: params,
    userId: userId,
  })
  return result
}

/********************************************** 本地方法 *************************************************/

/**
 * 添加任务成员
 * @param params
 * @param cb
 */
// export const addTaskMembers = (params: {
//   groupID: string,
//   id: string,
//   members: Array<{id: string, name: string}>,
// }, cb = () => {}) => async (dispatch: (arg0: any) => any, getState: () => any) => {
//   const userId = getState().user.toJS().currentUser.userName || 'Customer'
//   await dispatch({
//     type: COWORK_TASK_MEMBERS_ADD,
//     payload: params,
//     userId,
//   })
//   cb && cb()
// }

export const setCoworkNewMessage = (
  params = {},
  cb = () => {},
) => async (dispatch: (arg0: any) => any) => {
  await dispatch({
    type: COWORK_NEW_MESSAGE_SET,
    payload: params,
  })
  cb && cb()
}

/**
 * 添加/修改任务
 */
const addTask = (state: any, { payload, userId }: any): {
  tasks: Array<any>,
  type: number, // 0:无效类型 1:add 2:edit 3:delete
} => {
  let allTask = state.toJS().tasks
  let myTasks: any = allTask[userId] || {}
  let tasks: any = myTasks[payload.groupID] || []
  let task
  let existInTaskMember = false // 判断新的任务成员是否包含当前用户，若不存在，则删除该任务
  let type = 1
  for (let i = 0; i < tasks.length; i++) {
    let _task = tasks[i]
    // 修改已有消息的状态
    if (payload.id === _task.id) {
      // 判断新的任务成员是否包含当前用户
      for (let j = 0; j < payload.members.length; j++) {
        if (payload.members[j].id === userId) {
          existInTaskMember = true
          break
        }
      }
      task = payload
      if (existInTaskMember) {      // 修改
        tasks[i] = payload
      } else {                // 删除
        tasks.splice(i, 1)
      }
      break
    }
  }
  if (!existInTaskMember && task) {
    type = 2
    CoworkFileHandle.delTaskGroup(
      payload.groupID,
      [payload.id],
    )
  } else if (!task) { // 添加新消息
    // TODO 当前用户本地没有改任务,其他成员本地数据可能仍然存有当前用户的数据,依旧要发送消息
    // 此处两种可能导致已删除的任务再次出现:
    //    1.当前用户已删除任务,发消息的成员当时不在线,没有及时修改本地任务数据;
    //    2.当前用户协作文件丢失
    if (payload.type !== MsgConstant.MSG_ONLINE_GROUP_TASK_EXIST) {
      type = 1
      // tasks.push(payload)
      tasks.unshift(payload)
      // 协作任务群组上传到Online
      CoworkFileHandle.addTaskGroup({
        id: payload.groupID,
        groupName: payload.name,
      }, payload)
    } else {
      type = 0 // 接收到其他成员的任务信息,但本地任务已删除
    }
  } else { // 修改群组消息
    type = 3
    CoworkFileHandle.setTaskGroup(payload.groupID, payload)
  }

  myTasks[payload.groupID] = tasks
  allTask[userId] = myTasks
  return {
    tasks: allTask,
    type: type,
  }
}

/**
 * 删除任务
 */
const deleteTask = (state: any, { payload, userId }: any): Array<any> => {
  let allTask = state.toJS().tasks
  let myTasks: any = allTask[userId] || {}
  let tasks: any = myTasks[payload.groupID] || []
  for (let i = 0; i < tasks.length; i++) {
    let _task = tasks[i]
    if (payload.id === _task.id) {
      tasks.splice(i, 1) // 删除redux中数据
      CoworkFileHandle.delTaskGroup(payload.groupID, payload.id) // 删除文件中任务数据
      SMessageService.exitSession(userId, payload.id) // 退出多人对话
      break
    }
  }
  allTask[userId] = myTasks
  return allTask
}

/**
 * 删除群组中多个任务
 */
const _deleteGroupTasks = (allTask: any, userId: string, groupId: string, taskIds: string[]): Array<any> => {
  let myTasks: any = allTask[userId] || {}
  let tasks: any = myTasks[groupId] || []
  let taskIDs = JSON.parse(JSON.stringify(taskIds))
  let _tempIDs = []
  for (let i = tasks.length - 1; i >= 0; i--) {
    let _task = tasks[i]
    const index = taskIDs.indexOf(_task.id)
    if (index >= 0) {
      tasks.splice(i, 1) // 删除redux中数据
      SMessageService.exitSession(userId, _task.id) // 退出多人对话
      taskIDs.splice(index, 1) // 防止删除的id不存在redux中的任务中
      _tempIDs.push(_task.id)
      if (taskIDs.length === 0) {
        break
      }
    }
  }
  CoworkFileHandle.delTaskGroup(groupId, _tempIDs) // 删除文件中任务数据
  allTask[userId] = myTasks
  return allTask
}

/**
 * 添加任务成员
 * @param state
 * @param param
 */
const addTaskMembers = (state: any, { payload, userId }: any): Array<any> => {
  let allTask = state.toJS().tasks
  let myTasks: any = allTask[userId] || {}
  let tasks: any = myTasks[payload.groupID] || []
  if (payload.members.length > 0) {
    let task
    for (let i = 0; i < tasks.length; i++) {
      // 修改已有消息的状态
      if (payload.id === tasks[i].id) {
        task = tasks[i]
        task.members = task.members.concat(payload.members)
        var obj: {[name: string]: any} = {}
        // 去重
        task.members = task.members.reduce(function(item: Array<{id: string, name: string}>, next: {id: string, name: string}) {
          obj[next.id] ? '' : obj[next.id] = true && item.push(next)
          return item
        }, [])

        // 添加协作任务成员
        CoworkFileHandle.addTaskGroupMember(
          payload.groupID,
          payload.id,
          payload.members,
        )
        // 新成员加入多人对话
        SMessageService.declareSession(payload.members, payload.id)
        break
      }
    }
  }
  myTasks[payload.groupID] = tasks
  allTask[userId] = myTasks
  return allTask
}

function _addNewMessage(prevMessages: Array<any>, messages: Array<any>) {
  while (prevMessages.length > 0) {
    let message = prevMessages.shift()
    message.status = 0
    message.messageID = messages.length
    messages.push(message)
    // this.addMessageNum && this.addMessageNum(1),
    ;(async function() {
      try {
        let result = false
        if (message.message.geoUserID !== undefined) {
          result = await SMap.isUserGeometryExist(
            message.message.layerPath,
            message.message.id,
            message.message.geoUserID,
          )
        }
        if (result) {
          let count = 0, prevMessage
          for (let i = messages.length - 1; i >= 0; i--) {
            const item = messages[i]
            if (item.message.id === message.message.id && item.status == 0) {
              count++
              if (count === 2) {
                prevMessage = item
                break
              }
            }
          }
          if (count == 1) {
            await SMap.addMessageCallout(
              message.message.layerPath,
              message.message.id,
              message.message.geoUserID,
              message.user.name,
              message.messageID,
            )
          } else {
            // 同一个对象若有更新标志,则先移除,再次添加
            if (prevMessage) {
              await SMap.removeMessageCallout(
                prevMessage.messageID,
              )
            }
            await SMap.addMessageCallout(
              message.message.layerPath,
              message.message.id,
              message.message.geoUserID,
              message.user.name,
              message.messageID,
            )
          }
        }
        adding = false
      } catch (error) {
        adding = false
      }
    })()
  }
  return {
    prevMessages,
    messages,
  }
}

/**
 * 获取/初始化 任务
 * @param tasks 所有任务
 * @param userId 用户ID
 * @param groupId Online群组ID
 * @param taskId 任务ID
 */
function getTask(
  allTask: any,
  userId: string,
  groupId: string,
  taskId: string,
) {
  let myTasks: any = allTask[userId] || {}
  let tasks: any = myTasks[groupId] || []
  for (let i = 0 ; i < tasks.length; i++) {
    if (tasks[i].id === taskId) {
      return tasks[i]
    }
  }
  return undefined
}

/**
 * 获取/初始化 任务消息
 * @param coworkInfo 所有任务消息
 * @param userId 用户ID
 * @param groupId Online群组ID
 * @param taskId 任务ID
 * @param create 是否创建
 */
function getTaskInfo(
  coworkInfo: any,
  userId: string,
  groupId: string,
  taskId: string,
  create?: boolean,
) {
  if (create === undefined) create = true
  if (!coworkInfo) {
    if (create === false) return undefined
    coworkInfo = {}
  }
  if (!coworkInfo.hasOwnProperty(userId)) {
    if (create === false) return undefined
    coworkInfo[userId] = {}
  }
  if (!coworkInfo[userId].hasOwnProperty(groupId)) {
    if (create === false) return undefined
    coworkInfo[userId][groupId] = {}
  }
  if (!coworkInfo[userId][groupId].hasOwnProperty(taskId)) {
    if (create === false) return undefined
    coworkInfo[userId][groupId][taskId] = {
      messages: [],
      prevMessages: [],
      unread: 0,
      isRealTime: false,
      members: [],
    }
  }
  return coworkInfo[userId][groupId][taskId]
}

function deleteTaskInfo(
  coworkInfo: any,
  userId: string,
  groupId: string,
  taskIds: string[],
) {
  for (const taskId of taskIds) {
    if (!coworkInfo?.[userId]?.[groupId]?.[taskId]) {
      return coworkInfo || {}
    }
    coworkInfo?.[userId]?.[groupId]?.[taskId] && delete coworkInfo[userId][groupId][taskId]
  }
  return coworkInfo
}

function deleteTaskMessages(
  messages: {[userId: string]: any},
  userId: string,
  groupId?: string,
  taskIds?: string[],
) {
  if (taskIds === undefined && groupId === undefined && messages[userId]) {
    delete messages[userId]
  }
  if (taskIds === undefined && groupId !== undefined && messages[userId]?.coworkGroupMessages?.[groupId]) {
    delete messages[userId].coworkGroupMessages[groupId]
  }
  if (taskIds !== undefined && taskIds.length > 0 && groupId !== undefined) {
    for (const taskId of taskIds) {
      messages?.[userId]?.coworkGroupMessages?.[groupId]?.[taskId] && delete messages[userId].coworkGroupMessages[groupId][taskId]
    }
  }
  // if (taskIds !== undefined && groupId !== undefined && messages[userId]?.coworkGroupMessages?.[groupId]?.[taskId]) {
  //   delete messages[userId].coworkGroupMessages[groupId][taskId]
  // }
  return messages || {}
}

/**
 * 添加成员到本地数据
 * @param coworkInfo 所有任务消息
 * @param userId 用户ID
 * @param groupId Online群组ID
 * @param taskId 任务ID
 * @param members 添加的成员
 */
function addTaskInfoMember(
  coworkInfo: any,
  userId: string,
  groupId: string,
  taskId: string,
  members: Array<Member>,
) {
  // 添加成员到本地数据中
  let taskInfo = getTaskInfo(coworkInfo, userId, groupId, taskId, false)
  if (taskInfo) {
    let taskInfoMembers = taskInfo.members || []
    members.forEach((m: Member) => {
      let exsit = false
      for (let j = 0; j < taskInfoMembers.length; j++) {
        if (m.id === taskInfoMembers[j].id) {
          exsit = true
          break
        }
      }
      if (!exsit) {
        taskInfoMembers.push(Object.assign({}, m, {show: true}))
      }
    })
    // CoworkInfo.setMembers(taskInfoMembers)
  }
  return coworkInfo
}

/**
 * 删除本地数据成员
 * @param coworkInfo 所有任务消息
 * @param userId 用户ID
 * @param groupId Online群组ID
 * @param taskId 任务ID
 * @param members 添加的成员
 */
function deleteTaskInfoMember(
  coworkInfo: any,
  userId: string,
  groupId: string,
  taskId: string,
  members: Array<Member>,
) {
  // 添加成员到本地数据中
  let taskInfo = getTaskInfo(coworkInfo, userId, groupId, taskId, false)
  if (taskInfo) {
    let taskInfoMembers = taskInfo.members || []
    members.forEach((m: Member) => {
      for (let j = 0; j < taskInfoMembers.length; j++) {
        if (m.id === taskInfoMembers[j].id) {
          delete taskInfoMembers[j]
          break
        }
      }
    })
  }

  return coworkInfo
}

/**
 * 隐藏所有成员路径和位置
 * @param members 所有成员
 */
function hideAll(members: Array<any>) {
  try {
    SMap.removeUserCallout()
    for (let i = 0; i < members.length; i++) {
      let userID = members[i].id
      SMap.hideUserTrack(userID)
    }
  } catch (error) {
    //
  }
}

/**
 * 显示所有成员路径和位置
 * @param members 所有成员
 * @param messages 所有消息
 */
function showAll(members: Array<any>, messages: Array<any>) {
  try {
    for (const member of members) {
      const userID = member.id
      if (member.show) {
        SMap.showUserTrack(userID)
      }
      for (const message of messages) {
        // 专题图消息不添加callout
        if (!message.status && message.user.id === userID && !message.message.themeType) {
          SMap.isUserGeometryExist(
            message.message.layerPath,
            message.message.id,
            message.message.geoUserID,
          ).then((result: boolean) => {
            if (result) {
              SMap.addMessageCallout(
                message.message.layerPath,
                message.message.id,
                message.message.geoUserID,
                message.user.name,
                message.messageID,
              )
            }
          }).catch(e => {

          })
        }
      }
    }
  } catch (error) {
    //
  }
}


/**
 * 设置成员位置
 * @param members 所有成员
 * @param userID 指定成员ID
 * @param location 位置
 */
function setUserLocation(members: Array<any>, userID: string, location: Location): Array<any> {
  for (let i = 0; i < members.length; i++) {
    let member = members[i]
    if (member.id === userID) {
      member.location = location
      break
    }
  }
  return members
}

/**
 * 显示/隐藏 指定成员路径和位置
 * @param member 指定成员
 */
function setUserTrack(member: CoworkMember, isShow: boolean): void {
  if (isShow) {
    let location = member.location
    if (location) {
      let initial = location.initial
      if (initial && initial.length > 2) {
        initial = initial.slice(0, 2)
      }
      SMap.addLocationCallout(
        location.longitude,
        location.latitude,
        member.name,
        member.id,
        initial,
      )
    }
    member.show = true
    SMap.showUserTrack(member.id)
  } else {
    member.show = false
    SMap.removeLocationCallout(member.id)
    SMap.hideUserTrack(member.id)
  }
}

function initMessages(userMessages: MessageType) {
  if (!userMessages.coworkGroupMessages) {
    userMessages.coworkGroupMessages = {
      // messages: [],
      unread: 0,
    }
  }
  if (!userMessages.applyMessages) {
    userMessages.applyMessages = {
      // messages: [],
      unread: 0,
    }
  }
  if (!userMessages.inviteMessages) {
    userMessages.inviteMessages = {
      // messages: [],
      unread: 0,
    }
  }
  return userMessages
}

function isServiceMsg(type: number) {
  return type === MsgConstant.MSG_COWORK_SERVICE_UPDATE || type === MsgConstant.MSG_COWORK_SERVICE_PUBLISH
}

export interface MessageType {
  applyMessages: {
    unread: number,
  },
  inviteMessages: {
    unread: number,
  },
  coworkGroupMessages: {
    [groupId: string]: {
      unread: number,
      [taskId: string]: number | {
        unread: number,
      },
    },
  },
}

const initialState = fromJS({
  invites: [],
  /**
   * userId: {
   *  applyMessages: {
   *    unread: number
   *  },
   *  inviteMessages: {
   *    unread: number
   *  },
   *  coworkGroupMessages: {
   *    [groupId: string]: {
   *      unread: number,       // 群未读消息
   *      [taskId: string]: {
   *        unread: number,     // 群任务未读消息
   *      }
   *    }
   *  },
   * }
   */
  messages: {},
  tasks: {},        // 要储存在文件中，并上传到online的数据
  groups: {},
  currentGroup: {}, // 当前群组信息
  currentTask: {}, // 当前协作任务信息
  coworkNewMessage: 0, // 协作更新地图消息
  /**
   * {
   *    userId: {
   *      groupId: {
   *        taskId: {
   *          messages: [],        // 添加到地图上的消息
   *          prevMessages: [],    // 未添加到地图上的消息
   *          unread: 0,
   *          isRealTime: false,    // 是否是实时添加
   *          members: [],         // 本地储存的成员，
   *        }
   *      }
   *    }
   * }
   */
  coworkInfo: {},
  /** services
   * {
   *    userId: {
   *      groupId: {
   *        taskId: [{
   *          layerName: '',
   *          datasetUrl: '',
   *          datasourceName: '',
   *          datasetName: '',
   *          status: 'publish' | 'update' | 'upload' | 'download' | 'done',
   *          progress: 0,
   *        }]
   *      }
   *    }
   * }
   */
  services: {},
})

/*************************************** Actions *******************************************/

export default handleActions(
  {
    [`${ADD_COWORK_INVITE}`]: (state: { toJS: () => any }, { payload }: any) => {
      const cowork = state.toJS()
      if (!cowork.invites.hasOwnProperty(payload.userId)) {
        cowork.invites[payload.userId] = []
      }
      let userInvites = cowork.invites[payload.userId]
      let hasCowork = false
      for (let i = 0; i < userInvites.length; i++) {
        let invite = userInvites[i]
        if (invite.coworkId === payload.coworkId) {
          hasCowork = true
          break
        }
      }
      if (!hasCowork) {
        userInvites.push(payload)
      }
      return fromJS(cowork)
    },
    [`${DELETE_COWORK_INVITE}`]: (state: { toJS: () => any }, { payload }: any) => {
      const cowork = state.toJS()
      let invites = cowork.invites[payload.userId]
      for (let i = 0; i < invites.length; i++) {
        let invite = invites[i]
        if (invite.coworkId === payload.coworkId) {
          invites.splice(i, 1)
          break
        }
      }
      return fromJS(cowork)
    },
    [`${COWORK_GROUP_MSG_ADD}`]: (state: any, { payload, userId }: any) => {
      if (payload.type === MsgConstant.MSG_ONLINE_GROUP_CHAT) { // 群聊消息
        let messages = state.toJS().messages
        if (!messages[userId]) messages[userId] = {}
        messages[userId] = initMessages(messages[userId])
        let coworkGroupMessages = messages[userId].coworkGroupMessages

        // if (coworkGroupMessages.unread === undefined) {
        //   coworkGroupMessages.unread = 0
        // }
        coworkGroupMessages.unread++
        if (!coworkGroupMessages[payload.groupId]) {
          coworkGroupMessages[payload.groupId] = {}
        }
        if (!coworkGroupMessages[payload.groupId][payload.taskId]) {
          coworkGroupMessages[payload.groupId][payload.taskId] = {
            unread: 0,
          }
        }
        coworkGroupMessages[payload.groupId][payload.taskId].unread++

        return state.setIn(['messages'], fromJS(messages || {}))
      } else if (payload.type === MsgConstant.MSG_ONLINE_GROUP_APPLY) { // 申请消息
        let messages = state.toJS().messages
        if (!messages[userId]) messages[userId] = {}
        messages[userId] = initMessages(messages[userId])
        let applyMessages = messages[userId].applyMessages

        if (applyMessages.unread === undefined) {
          applyMessages.unread = 0
        }
        applyMessages.unread++

        return state.setIn(['messages'], fromJS(messages || {}))
      } else if (payload.type === MsgConstant.MSG_ONLINE_GROUP_INVITE) { // 邀请消息
        let messages = state.toJS().messages
        if (!messages[userId]) messages[userId] = {}
        messages[userId] = initMessages(messages[userId])
        let inviteMessages = messages[userId].inviteMessages

        if (inviteMessages.unread === undefined) {
          inviteMessages.unread = 0
        }
        inviteMessages.unread++

        return state.setIn(['messages'], fromJS(messages || {}))
      } else if (payload.type === MsgConstant.MSG_ONLINE_GROUP_TASK) { // 添加/修改任务
        let {tasks, type} = addTask(state, { payload, userId })
        let coworkInfo = state.toJS().coworkInfo
        // 创建TaskInfo
        getTaskInfo(coworkInfo, userId, payload.groupID, payload.id, true)
        // 初始化TaskInfo中的成员
        addTaskInfoMember(coworkInfo, userId, payload.groupID, payload.id, payload.members) // 给本地成员赋值

        // 当为添加任务时，添加新消息
        // 当创建者是当前用户，则不添加新消息
        // 当创建者不是当前用户，且正在当前群组任务管理界面中时，则不添加新消息
        let currentGroup = state.toJS().currentGroup
        if (type === 1 && payload.creator !== userId && currentGroup?.id !== payload.groupID) {
          let messages = state.toJS().messages
          if (!messages[userId]) messages[userId] = {}
          messages[userId] = initMessages(messages[userId])
          let coworkGroupMessages = messages[userId].coworkGroupMessages

          coworkGroupMessages.unread++
          if (!coworkGroupMessages[payload.groupID]) {
            coworkGroupMessages[payload.groupID] = {
              unread: 0,
            }
          }
          coworkGroupMessages[payload.groupID].unread++
          return state.setIn(['tasks'], fromJS(tasks)).setIn(['coworkInfo'], fromJS(coworkInfo)).setIn(['messages'], fromJS(messages || {}))
        }

        return state.setIn(['tasks'], fromJS(tasks)).setIn(['coworkInfo'], fromJS(coworkInfo))
      } else if (payload.type === MsgConstant.MSG_ONLINE_GROUP_TASK_DELETE) { // 删除任务
        let coworkInfo = state.toJS().coworkInfo
        let messages = state.toJS().messages
        let allTask = state.toJS().tasks
        // return state.setIn(['tasks'], fromJS(deleteTask(state, { payload, userId })))
        return state.setIn(['tasks'], fromJS(_deleteGroupTasks(allTask, userId, payload.groupID, [payload.id])))
          .setIn(['coworkInfo'], fromJS(deleteTaskInfo(coworkInfo, userId, payload.groupID, [payload.id])))
          .setIn(['messages'], fromJS(deleteTaskMessages(messages, userId, payload.groupID, [payload.id])))
      } else if (payload.type === MsgConstant.MSG_ONLINE_GROUP_TASK_EXIST) { // 成员删除任务
        let {tasks, type} = addTask(state, { payload, userId })
        return state.setIn(['tasks'], fromJS(tasks))
      } else if (payload.type === MsgConstant.MSG_ONLINE_GROUP_TASK_MEMBER_JOIN) { // 任务成员加入消息
        let coworkInfo = state.toJS().coworkInfo
        return state.setIn(['tasks'], fromJS(addTaskMembers(state, { payload, userId })))
          .setIn(['coworkInfo'], fromJS(addTaskInfoMember(coworkInfo, userId, payload.groupID, payload.id, payload.members)))
      }
    },
    [`${COWORK_GROUP_MSG_READ}`]: (state: any, { payload, userId }: {payload: ReadMsgParams, userId: string}) => {
      let messages = state.toJS().messages
      let _messages
      if (!messages[userId]) messages[userId] = {}
      messages[userId] = initMessages(messages[userId])
      if (payload.type === MsgConstant.MSG_ONLINE_GROUP_APPLY) { // 读群申请消息
        _messages = messages[userId].applyMessages
      } else if (payload.type === MsgConstant.MSG_ONLINE_GROUP_INVITE) { // 读群邀请消息
        _messages = messages[userId].inviteMessages
      } else if (payload.type === MsgConstant.MSG_ONLINE_GROUP_CHAT) { // 读任务群聊消息
        if (payload.target && payload.target.taskId) {
          if (!messages[userId].coworkGroupMessages[payload.target.groupId]) {
            messages[userId].coworkGroupMessages[payload.target.groupId] = {}
          }
          if (!messages[userId].coworkGroupMessages[payload.target.groupId][payload.target.taskId]) {
            messages[userId].coworkGroupMessages[payload.target.groupId][payload.target.taskId] = {unread: 0}
          }
          _messages = messages[userId].coworkGroupMessages[payload.target.groupId][payload.target.taskId]
        }
      } else if (payload.type === MsgConstant.MSG_ONLINE_GROUP_TASK) { // 读群组新任务消息
        if (payload.target) {
          _messages = messages[userId].coworkGroupMessages[payload.target.groupId]
        }
      }
      if (_messages?.unread > 0) {
        if (!_messages.messages) {
          _messages.messages = []
          _messages.unread = 0
        } else if (payload.read !== undefined && payload.read > 0) {
          _messages.unread -= payload.read
          if (_messages.unread < 0) _messages.unread = 0
        } else if (payload.read === undefined) {
          _messages.unread = 0
        }
      }
      return state.setIn(['messages'], fromJS(messages || {}))
    },
    [`${COWORK_GROUP_MSG_DELETE}`]: (state: any, { payload, userId }: any) => {
      let allTask = state.toJS().tasks
      let myTasks: any = allTask[userId] || {}
      let tasks: any = myTasks[payload.groupID] || []
      for (let i = 0; i < tasks.length; i++) {
        let _task = tasks[i]
        if (payload.id === _task.id) {
          tasks.splice(i, 1)
          SMessageService.exitSession(userId, payload.id) // 退出多人对话
          break
        }
      }
      allTask[userId] = myTasks

      return state.setIn(['tasks'], fromJS(allTask))
    },
    [`${COWORK_GROUP_MSG_TASK_SET}`]: (state: any, { payload, userId }: any) => {
      let allTask = state.toJS().tasks
      let myTasks: any = allTask[userId] || {}
      myTasks[payload.groupID] = payload.tasks
      allTask[userId] = myTasks
      return state.setIn(['tasks'], fromJS(allTask))
    },
    [`${COWORK_GROUP_DELETE_TASK}`]: (state: any, { payload, userId }: {payload: {groupID: string, taskIds: string[]}, userId: string}) => {
      let coworkInfo = state.toJS().coworkInfo
      let messages = state.toJS().messages
      let allTask = state.toJS().tasks
      return state.setIn(['tasks'], fromJS(_deleteGroupTasks(allTask, userId, payload.groupID, payload.taskIds)))
        .setIn(['coworkInfo'], fromJS(deleteTaskInfo(coworkInfo, userId, payload.groupID, payload.taskIds)))
        .setIn(['messages'], fromJS(deleteTaskMessages(messages, userId, payload.groupID, payload.taskIds)))
    },
    [`${COWORK_GROUP_SET}`]: (state: any, { payload, userId }: any) => {
      let groups = state.toJS().groups
      if (!groups[userId]) groups[userId] = []
      groups[userId] = payload
      return state.setIn(['groups'], fromJS(groups))
    },
    [`${COWORK_TASK_MEMBERS_ADD}`]: (state: any, { payload, userId }: any) => {
      let allTask = state.toJS().tasks
      let myTasks: any = allTask[userId] || {}
      let tasks: any = myTasks[payload.groupID] || []

      let coworkInfo = state.toJS().coworkInfo

      if (payload.members.length > 0) {
        let task
        for (let i = 0; i < tasks.length; i++) {
          // 修改已有消息的状态
          if (payload.id === tasks[i].id) {
            task = tasks[i]
            task.members = task.members.concat(payload.members)
            var obj: {[name: string]: any} = {}
            // 去重
            task.members = task.members.reduce(function(item: Array<{id: string, name: string}>, next: {id: string, name: string}) {
              obj[next.id] ? '' : obj[next.id] = true && item.push(next)
              return item
            }, [])

            // 添加协作任务成员
            CoworkFileHandle.addTaskGroupMember(
              payload.groupID,
              payload.id,
              payload.members,
            )

            // 添加成员到本地数据中
            coworkInfo = addTaskInfoMember(coworkInfo, userId, payload.groupId, payload.taskId, payload.members)

            // 新成员加入多人对话
            SMessageService.declareSession(payload.members, payload.id)
            break
          }
        }
      }
      myTasks[payload.groupID] = tasks
      allTask[userId] = myTasks
      return state.setIn(['tasks'], fromJS(allTask)).setIn(['coworkInfo'], fromJS(coworkInfo))
    },
    [`${COWORK_TASK_MEMBERS_DELETE}`]: (state: any, { payload, userId }: {payload: TaskMemberDeleteParams, userId: string}) => {
      let allTask = state.toJS().tasks
      let myTasks: any = allTask[userId] || {}
      let tasks: any = myTasks[payload.groupId] || []

      let coworkInfo = state.toJS().coworkInfo

      if (payload.members.length > 0) {
        let task
        for (let x = 0; x < tasks.length; x++) {
          // 修改已有消息的状态
          if (payload.taskId === tasks[x].id) {
            task = tasks[x]

            // 删除task中的成员
            for (let i = payload.members.length - 1; i >= 0; i--) {
              for (let j = 0; j < task.members.length; j++) {
                if (task.members[j].id === payload.members[i].id) {
                  task.members.splice(j, 1)
                  break
                }
              }
            }

            let taskInfo = getTaskInfo(coworkInfo, userId, payload.groupId, payload.taskId, false)
            for (let i = payload.members.length - 1; i >= 0; i--) {
              for (let j = 0; j < taskInfo.members.length; j++) {
                if (taskInfo.members[j].id === payload.members[i].id) {
                  taskInfo.members.splice(j, 1)
                  break
                }
              }
            }

            CoworkFileHandle.removeTaskGroupMember(
              payload.groupId,
              payload.taskId,
              payload.members,
            )
            break
          }
        }
      }
      myTasks[payload.groupId] = tasks
      allTask[userId] = myTasks
      return state.setIn(['tasks'], fromJS(allTask)).setIn(['coworkInfo'], fromJS(coworkInfo))
    },
    [`${COWORK_GROUP_SET_CURRENT}`]: (state: any, { payload }: any) => {
      if (!payload || !payload.id) { // 退出当前群组页面，并清空当前任务数据
        return state.setIn(['currentGroup'], fromJS({})).setIn(['currentTask'], fromJS({}))
      }
      return state.setIn(['currentGroup'], fromJS(payload))
    },
    [`${COWORK_TASK_SET_CURRENT}`]: (state: any, { payload, userId }: any) => {
      let coworkInfo = state.toJS().coworkInfo
      let taskInfo = getTaskInfo(coworkInfo, userId, payload.groupID, payload.id, true)
      if (taskInfo.members.length !== payload.members.length) {
        taskInfo.members = payload.members
        taskInfo.members.forEach((item: CoworkMember) => {
          item.show = true
        })
      }
      let exist = false

      let allTask = state.toJS().tasks || {}
      if (!allTask[userId]) allTask[userId] = {}
      let myTasks: any = allTask[userId] || {}
      let tasks: any = myTasks[payload.groupID] || []
      for (let i = 0; i < tasks.length; i++) {
        let _task = tasks[i]
        if (payload.id === _task.id) {
          exist = true
          break
        }
      }
      if (!exist) {
        tasks.push(payload)
        if (!myTasks[payload.groupID]) myTasks[payload.groupID] = []
        myTasks[payload.groupID] = myTasks[payload.groupID].concat(tasks)
        allTask[userId] = myTasks
      }
      // TODO 临时处理 allTask 更新不了,采用以下方式
      const _state = state.setIn(['tasks'], fromJS(allTask)).setIn(['currentTask'], fromJS(payload)).setIn(['coworkInfo'], fromJS(coworkInfo))
      allTask = _state.toJS().tasks
      return state.setIn(['tasks'], fromJS(allTask)).setIn(['currentTask'], fromJS(payload)).setIn(['coworkInfo'], fromJS(coworkInfo))
    },
    [`${COWORK_GROUP_EXIT}`]: (state: any, { payload, userId }: any) => {
      let groups = state.toJS().groups
      let tasks = state.toJS().tasks
      if (groups[userId]) {
        let myGroups = groups[userId]
        for (let i = 0; i < myGroups.length; i++) {
          if (myGroups[i].id === payload.groupID) {
            myGroups.splice(i, 1)
            break
          }
        }
      }
      let coworkInfo = state.toJS().coworkInfo
      if (coworkInfo?.[userId]?.[payload.groupID]) {
        delete coworkInfo[userId][payload.groupID]
      }
      if (tasks[userId] && tasks[userId][payload.groupID]) delete tasks[userId][payload.groupID]
      return state.setIn(['groups'], fromJS(groups)).setIn(['tasks'], fromJS(tasks))
    },
    [`${COWORK_NEW_MESSAGE_SET}`]: (state: any, { payload }: any) => {
      let coworkNewMessage = state.toJS().coworkNewMessage
      let num = coworkNewMessage + payload
      if (payload === 0) {
        num = 0
      }
      return state.setIn(['coworkNewMessage'], fromJS(num))
    },
    [`${COWORK_TASK_INFO_ADD}`]: (state: any, { payload, userId }: any) => {
      let coworkInfo = state.toJS().coworkInfo
      let taskInfo = getTaskInfo(coworkInfo, userId, payload.user.coworkGroupId, payload.user.groupID, true)
      if (!taskInfo.isRealTime && !isServiceMsg(payload.message.type)) {
        // coworkInfo[userId][payload.user.coworkGroupId][payload.user.groupID] = taskInfo
        return state
      }
      taskInfo.prevMessages.push(payload)
      let {
        prevMessages,
        messages,
      } = _addNewMessage(taskInfo.prevMessages, taskInfo.messages)
      taskInfo.prevMessages = prevMessages
      taskInfo.messages = messages
      taskInfo.unread++
      coworkInfo[userId][payload.user.coworkGroupId][payload.user.groupID] = taskInfo
      CoworkInfo.setMessages(messages)
      // return fromJS(coworkInfo)
      return state.setIn(['coworkInfo'], fromJS(coworkInfo))
    },
    [`${COWORK_TASK_INFO_READ}`]: (state: any, { payload, userId }: any) => {
      let coworkInfo = state.toJS().coworkInfo
      let taskInfo = getTaskInfo(coworkInfo, userId, payload.groupId, payload.taskId, false)
      if (!taskInfo) {
        return state
      }
      for(let i = 0; i < taskInfo.messages.length; i++) {
        if (taskInfo.messages[i].messageID === payload.messageID) {
          if (!taskInfo.messages[i].status) {
            taskInfo.unread--
            if (taskInfo.unread < 0) taskInfo.unread = 0
            SMap.removeMessageCallout(payload.messageID)
          }
          taskInfo.messages[i].status = payload.hasOwnProperty('status') ? payload.status : 1
          break
        }
      }
      return state.setIn(['coworkInfo'], fromJS(coworkInfo))
    },
    [`${COWORK_TASK_INFO_REALTIME_SET}`]: (state: any, { payload, userId }: any) => {
      let coworkInfo = state.toJS().coworkInfo
      let taskInfo = getTaskInfo(coworkInfo, userId, payload.groupId, payload.taskId, false)

      let allTask = state.toJS().tasks
      let task = getTask(allTask, userId, payload.groupId, payload.taskId)

      if (taskInfo && task) {
        if (payload.isRealTime) {
          showAll(taskInfo.members, taskInfo.messages)
          if (!adding) {
            let {
              prevMessages,
              messages,
            } = _addNewMessage(taskInfo.prevMessages, taskInfo.messages)
            taskInfo.prevMessages = prevMessages
            taskInfo.messages = messages
            // taskInfo.unread++
            coworkInfo[userId][payload.groupId][payload.taskId] = taskInfo
            CoworkInfo.setMessages(messages)
          }
        } else {
          hideAll(taskInfo.members)
        }

        taskInfo.isRealTime = payload.isRealTime
        coworkInfo[userId][payload.groupId][payload.taskId] = taskInfo
        return state.setIn(['coworkInfo'], fromJS(coworkInfo))
      }
      return state
    },
    [`${COWORK_TASK_INFO_MEMBER_LOCATION_ADD}`]: (state: any, { payload, userId }: {payload: TaskMemberLocationParams, userId: string}) => {
      let coworkInfo = state.toJS().coworkInfo
      let taskInfo = getTaskInfo(coworkInfo, userId, payload.groupId, payload.taskId, false)
      if (taskInfo) {
        let taskInfoMembers = taskInfo.members || []
        for (let j = 0; j < taskInfoMembers.length; j++) {
          if (payload.memberId && payload.memberId === taskInfoMembers[j].id) { // 显示/隐藏指定成员
            if (payload.location) {
              taskInfoMembers[j].location = payload.location
              SMap.addUserTrack(
                payload.location.longitude,
                payload.location.latitude,
                payload.memberId,
              )
            }
            if (!taskInfo.isRealTime || !taskInfoMembers[j].show) continue // 若不是实时协作 或 当前用户为不显示状态，只保存位置不显示
            taskInfoMembers[j].show = payload.show
            setUserTrack(taskInfoMembers[j], payload.show)
            break
          }
        }
        // CoworkInfo.setMembers(taskInfoMembers)
      }
      return state.setIn(['coworkInfo'], fromJS(coworkInfo))
    },
    [`${COWORK_TASK_INFO_MEMBER_LOCATION_SHOW}`]: (state: any, { payload, userId }: {payload: TaskMemberLocationParams, userId: string}) => {
      let coworkInfo = state.toJS().coworkInfo
      let taskInfo = getTaskInfo(coworkInfo, userId, payload.groupId, payload.taskId, false)
      if (taskInfo) {
        let taskInfoMembers = taskInfo.members || []
        for (let j = 0; j < taskInfoMembers.length; j++) {
          if (payload.memberId === undefined) { // 全部显示/隐藏
            if (payload.location) {
              taskInfoMembers[j].location = payload.location
            }
            if (!taskInfo.isRealTime) continue // 若不是实时协作，只保存位置不显示
            taskInfoMembers[j].show = payload.show
            setUserTrack(taskInfoMembers[j], payload.show)
          } else if (payload.memberId === taskInfoMembers[j].id) { // 显示/隐藏指定成员
            if (payload.location) {
              taskInfoMembers[j].location = payload.location
            }
            if (!taskInfo.isRealTime) continue // 若不是实时协作，只保存位置不显示
            taskInfoMembers[j].show = payload.show
            setUserTrack(taskInfoMembers[j], payload.show)
            break
          }
        }
        // CoworkInfo.setMembers(taskInfoMembers)
      }
      return state.setIn(['coworkInfo'], fromJS(coworkInfo))
    },
    [`${COWORK_SERVICE_SET}`]: (state: any, { payload, userId }: {payload: ServiceParams, userId: string}) => {
      if (!payload.service) return state
      let services = state.toJS().services
      let taskServices = services?.[userId]?.[payload.groupId]?.[payload.taskId]
      let targetService
      if (taskServices && taskServices.length > 0) {
        for (let i = 0; i < taskServices.length; i ++) {
          let service = taskServices[i]
          if (payload.service instanceof Array) {
            for (const _service of payload.service) {
              if (
                service.layerName && service.layerName === _service.layerName ||
                service.datasetUrl && service.datasetUrl === _service.datasetUrl
              ) {
                targetService = Object.assign(service, _service)
                // 若完成，则删除记录
                if (service.status === 'done') {
                  taskServices.splice(i, 1)
                  services[userId][payload.groupId][payload.taskId] = taskServices
                }
                break
              }
            }
          } else {
            if (
              service.layerName && service.layerName === payload.service.layerName ||
              service.datasetUrl && service.datasetUrl === payload.service.datasetUrl
            ) {
              targetService = Object.assign(service, payload.service)
              // 若完成，则删除记录
              if (service.status === 'done') {
                taskServices.splice(i, 1)
                services[userId][payload.groupId][payload.taskId] = taskServices
              }
              break
            }
          }
        }
      }
      // 若服务不存在，则添加；若完成，则不添加
      if (!targetService) {
        if (payload.service instanceof Array) {
          for (const _service of payload.service) {
            if (_service.status !== 'done') {
              if (!services[userId]) services[userId] = {}
              if (!services[userId][payload.groupId]) services[userId][payload.groupId] = {}
              if (!services[userId][payload.groupId][payload.taskId]) services[userId][payload.groupId][payload.taskId] = []
              if (!taskServices) taskServices = []
              taskServices.push(_service)
              services[userId][payload.groupId][payload.taskId] = taskServices
            }
          }
        } else {
          if (!services[userId]) services[userId] = {}
          if (!services[userId][payload.groupId]) services[userId][payload.groupId] = {}
          if (!services[userId][payload.groupId][payload.taskId]) services[userId][payload.groupId][payload.taskId] = []
          if (!taskServices) taskServices = []
          taskServices.push(payload.service)
          services[userId][payload.groupId][payload.taskId] = taskServices
        }
      }
      return state.setIn(['services'], fromJS(services))
    },
    [`${COWORK_SERVICE_CLEAR}`]: (state: any, { payload, userId }: {payload: IDParams, userId: string}) => {
      let services = state.toJS().services
      let taskServices = services?.[userId]?.[payload.groupId]?.[payload.taskId]
      if (taskServices) {
        services[userId][payload.groupId][payload.taskId] = []
        console.warn(COWORK_SERVICE_CLEAR, services[userId][payload.groupId][payload.taskId])
      }
      return state.setIn(['services'], fromJS(services))
    },
    [REHYDRATE]: (state: any, { payload }: any) => {
      const _data = ModelUtils.checkModel(state, payload && payload.cowork).toJSON()
      _data.currentGroup = {} // 重置当前群组
      _data.currentTask = {} // 重置当前任务
      return fromJS(_data)
    },
  },
  initialState,
)
