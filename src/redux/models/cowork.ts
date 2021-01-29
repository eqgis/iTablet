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
/** 设置当前协作群组 */
export const COWORK_GROUP_SET_CURRENT = 'COWORK_GROUP_SET_CURRENT'
/** 设置当前协作群组任务 */
export const COWORK_TASK_SET_CURRENT = 'COWORK_TASK_SET_CURRENT'
/** 协作群组任务添加成员 */
export const COWORK_TASK_MEMBERS_ADD = 'COWORK_TASK_MEMBERS_ADD'
/** 协作群组任务添加成员 */
export const COWORK_NEW_MESSAGE_SET = 'COWORK_NEW_MESSAGE_SET'

export const COWORK_TASK_INFO_ADD = 'COWORK_TASK_INFO_ADD'
export const COWORK_TASK_INFO_READ = 'COWORK_TASK_INFO_READ'
export const COWORK_TASK_INFO_REALTIME_SET = 'COWORK_TASK_INFO_REALTIME_SET'
/** 添加成员是否显示轨迹和位置 */
export const COWORK_TASK_INFO_MEMBER_LOCATION_ADD = 'COWORK_TASK_INFO_MEMBER_LOCATION_ADD'
/** 设置成员是否显示轨迹和位置 */
export const COWORK_TASK_INFO_MEMBER_LOCATION_SHOW = 'COWORK_TASK_INFO_MEMBER_LOCATION_SHOW'

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
      // consume: boolean,
    },
  },
}

export interface TaskReadParams {
  groupId: string,
  taskId: string,
  messageID: boolean,
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
    taskId: string,
  },
  type: number,
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

export const deleteInvite = (params = {}, cb = () => {}) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  await dispatch({
    type: DELETE_COWORK_INVITE,
    payload: params,
  })
  cb && cb()
}

/**
 * 添加/修改 任务消息
 * @param params
 * @param cb
 */
export const addCoworkMsg = (params: any, cb?: () => {}) => async (dispatch: (arg0: any) => any, getState: () => any) => {
  const userId = getState().user.toJS().currentUser.userId || 'Customer'
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
  const userId = getState().user.toJS().currentUser.userId || 'Customer'
  return await dispatch({
    type: COWORK_GROUP_MSG_READ,
    payload: params,
    userId: userId,
  })
}

export const deleteCoworkMsg = (params: any, cb?: () => {}) => async (dispatch: (arg0: any) => any, getState: () => any) => {
  const userId = getState().user.toJS().currentUser.userId || 'Customer'
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
  const userId = getState().user.toJS().currentUser.userId || 'Customer'
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
  const userId = getState().user.toJS().currentUser.userId || 'Customer'
  await dispatch({
    type: COWORK_GROUP_SET,
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
export const exitGroup = (params: {groupID: number | string}, cb = () => {}) => async (dispatch: (arg0: any) => any, getState: () => any) => {
  const userId = getState().user.toJS().currentUser.userId || 'Customer'
  await dispatch({
    type: COWORK_GROUP_EXIT,
    payload: params,
    userId: userId,
  })
  cb && cb()
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
  const userId = getState().user.toJS().currentUser.userId || 'Customer'
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
export const addTaskMessage = (params: TaskInfoParams, isRealTime = true) => async (dispatch: (arg0: any) => any, getState: () => any) => {
  if (adding) return
  adding = true
  const userId = getState().user.toJS().currentUser.userId || 'Customer'
  let result = await dispatch({
    type: COWORK_TASK_INFO_ADD,
    payload: params,
    userId,
    isRealTime,
  })
  adding = false
  return result
}

/**
 * 任务消息已读
 * @param params TaskReadParams
 */
export const readTaskMessage = (params: TaskReadParams) => async (dispatch: (arg0: any) => any, getState: () => any) => {
  const userId = getState().user.toJS().currentUser.userId || 'Customer'
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
  const userId = getState().user.toJS().currentUser.userId || 'Customer'
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
  const userId = getState().user.toJS().currentUser.userId || 'Customer'
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
  const userId = getState().user.toJS().currentUser.userId || 'Customer'
  let result = await dispatch({
    type: COWORK_TASK_INFO_MEMBER_LOCATION_ADD,
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
//   const userId = getState().user.toJS().currentUser.userId || 'Customer'
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
const addTask = (state: any, { payload, userId }: any): Array<any> => {
  let allTask = state.toJS().tasks
  let myTasks: any = allTask[userId] || {}
  let tasks: any = myTasks[payload.groupID] || []
  let task
  let existInTaskMember = false // 判断新的任务成员是否包含当前用户，若不存在，则删除该任务
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
    CoworkFileHandle.delTaskGroup(
      payload.groupID,
      payload.id,
    )
  } else if (!task) { // 添加新消息
    // tasks.push(payload)
    tasks.unshift(payload)
    // 协作任务群组上传到Online
    CoworkFileHandle.addTaskGroup({
      id: payload.groupID,
      groupName: payload.name,
    }, payload)
  } else { // 修改群组消息
    CoworkFileHandle.setTaskGroup(payload.groupID, payload)
  }

  myTasks[payload.groupID] = tasks
  allTask[userId] = myTasks
  return allTask
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
    message.consume = false
    message.messageID = messages.length
    messages.push(message)
    // this.addMessageNum && this.addMessageNum(1),
    ;(async function() {
      try {
        let result = await SMap.isUserGeometryExist(
          message.message.layerPath,
          message.message.id,
          message.message.geoUserID,
        )
        if (result) {
          await SMap.addMessageCallout(
            message.message.layerPath,
            message.message.id,
            message.message.geoUserID,
            message.user.name,
            message.messageID,
          )
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
      isRealTime: true,
      members: [],
    }
  }
  return coworkInfo[userId][groupId][taskId]
}

function deleteTaskInfo(
  coworkInfo: any,
  userId: string,
  groupId: string,
  taskId: string,
) {
  if (!coworkInfo?.[userId]?.[groupId]?.[taskId]) {
    return coworkInfo || {}
  }
  delete coworkInfo[userId][groupId][taskId]
  return coworkInfo
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
    for (let n = 0; n < members.length; n++) {
      let member = members[n]
      let userID = member.id
      if (member.show) {
        SMap.showUserTrack(userID)
      }
      for (let i = 0; i < messages.length; i++) {
        let message = messages[i]
        if (!message.consume && message.user.id === userID) {
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
  if (!userMessages.chatMessages) {
    userMessages.chatMessages = {
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

export interface MessageType {
  applyMessages: {
    unread: number,
  },
  inviteMessages: {
    unread: number,
  },
  chatMessages: {
    unread: number,
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
   *  chatMessages: {
   *    [groupId: string]: {
   *      [taskId: string]: {
   *        unread: number,
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
   *          isRealTime: true,    // 是否是实时添加
   *          members: [],         // 本地储存的成员，
   *        }
   *      }
   *    }
   * }
   */
  coworkInfo: {},
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
        let chatMessages = messages[userId].chatMessages

        // if (chatMessages.unread === undefined) {
        //   chatMessages.unread = 0
        // }
        chatMessages.unread++
        if (!chatMessages[payload.groupId]) {
          chatMessages[payload.groupId] = {}
        }
        if (!chatMessages[payload.groupId][payload.taskId]) {
          chatMessages[payload.groupId][payload.taskId] = {
            unread: 0,
          }
        }
        chatMessages[payload.groupId][payload.taskId].unread++

        return state.setIn(['messages'], fromJS(messages))
      } else if (payload.type === MsgConstant.MSG_ONLINE_GROUP_APPLY) { // 申请消息
        let messages = state.toJS().messages
        if (!messages[userId]) messages[userId] = {}
        messages[userId] = initMessages(messages[userId])
        let applyMessages = messages[userId].applyMessages

        if (applyMessages.unread === undefined) {
          applyMessages.unread = 0
        }
        applyMessages.unread++

        return state.setIn(['messages'], fromJS(messages))
      } else if (payload.type === MsgConstant.MSG_ONLINE_GROUP_INVITE) { // 邀请消息
        let messages = state.toJS().messages
        if (!messages[userId]) messages[userId] = {}
        messages[userId] = initMessages(messages[userId])
        let inviteMessages = messages[userId].inviteMessages

        if (inviteMessages.unread === undefined) {
          inviteMessages.unread = 0
        }
        inviteMessages.unread++

        return state.setIn(['messages'], fromJS(messages))
      } else if (payload.type === MsgConstant.MSG_ONLINE_GROUP_TASK) { // 添加/修改任务
        let tasks = addTask(state, { payload, userId })
        let coworkInfo = state.toJS().coworkInfo
        // 创建TaskInfo
        getTaskInfo(coworkInfo, userId, payload.groupID, payload.id, true)
        // 初始化TaskInfo中的成员
        addTaskInfoMember(coworkInfo, userId, payload.groupID, payload.id, payload.members) // 给本地成员赋值

        return state.setIn(['tasks'], fromJS(tasks)).setIn(['coworkInfo'], fromJS(coworkInfo))
      } else if (payload.type === MsgConstant.MSG_ONLINE_GROUP_TASK_DELETE) { // 删除任务
        let coworkInfo = state.toJS().coworkInfo
        return state.setIn(['tasks'], fromJS(deleteTask(state, { payload, userId })))
          .setIn(['coworkInfo'], fromJS(deleteTaskInfo(coworkInfo, userId, payload.groupID, payload.id)))
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
        if (payload.target) {
          if (!messages[userId].chatMessages[payload.target.groupId]) {
            messages[userId].chatMessages[payload.target.groupId] = {}
          }
          if (!messages[userId].chatMessages[payload.target.groupId][payload.target.taskId]) {
            messages[userId].chatMessages[payload.target.groupId][payload.target.taskId] = {unread: 0}
          }
          _messages = messages[userId].chatMessages[payload.target.groupId][payload.target.taskId]
        }
      }
      if (_messages.unread > 0) {
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
      return state.setIn(['messages'], fromJS(messages))
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
    [`${COWORK_GROUP_SET_CURRENT}`]: (state: any, { payload }: any) => {
      // TODO 检测payload有效性
      return state.setIn(['currentGroup'], fromJS(payload))
    },
    [`${COWORK_TASK_SET_CURRENT}`]: (state: any, { payload, userId }: any) => {
      // TODO 检测payload有效性
      let coworkInfo = state.toJS().coworkInfo
      let taskInfo = getTaskInfo(coworkInfo, userId, payload.groupID, payload.id, true)
      if (taskInfo.members.length !== payload.members.length) {
        taskInfo.members = payload.members
        taskInfo.members.forEach((item: CoworkMember) => {
          item.show = true
        })
      }
      return state.setIn(['currentTask'], fromJS(payload)).setIn(['coworkInfo'], fromJS(coworkInfo))
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
    [`${COWORK_TASK_INFO_ADD}`]: (state: any, { payload, userId, isRealTime }: any) => {
      let coworkInfo = state.toJS().coworkInfo
      let taskInfo = getTaskInfo(coworkInfo, userId, payload.user.coworkGroupId, payload.user.groupID, true)
      taskInfo.prevMessages.push(payload)
      if (!isRealTime) {
        coworkInfo[userId][payload.user.coworkGroupId][payload.user.groupID] = taskInfo
        return fromJS(coworkInfo)
      }
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
        if (taskInfo.messages[i].messageID === payload.messageID && !taskInfo.messages[i].consume) {
          taskInfo.messages[i].consume = true
          taskInfo.unread--
          SMap.removeMessageCallout(payload.messageID)
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
    [REHYDRATE]: (state: any, { payload }: any) => {
      const _data = ModelUtils.checkModel(state, payload && payload.cowork)
      _data.currentGroup = {} // 重置当前群组
      _data.currentTask = {} // 重置当前任务
      return _data
    },
  },
  initialState,
)
