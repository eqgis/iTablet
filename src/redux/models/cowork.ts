import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { ModelUtils } from '../../utils'
import { MsgConstant } from '../../constants'
import { SMessageService } from 'imobile_for_reactnative'
import CoworkFileHandle from '../../containers/tabs/Find/CoworkManagePage/CoworkFileHandle'
// Constants
// --------------------------------------------------
export const ADD_COWORK_INVITE = 'ADD_COWORK_INVITE'
export const DELETE_COWORK_INVITE = 'DELETE_COWORK_INVITE'
export const COWORK_GROUP_MSG_ADD = 'COWORK_GROUP_MSG_ADD'
export const COWORK_GROUP_MSG_DELETE = 'COWORK_GROUP_MSG_DELETE'
export const COWORK_GROUP_MSG_TASK_SET = 'COWORK_GROUP_MSG_TASK_SET'
export const COWORK_GROUP_APPLY = 'COWORK_GROUP_APPLY'
export const COWORK_GROUP_SET = 'COWORK_GROUP_SET'
export const COWORK_GROUP_EXIT = 'COWORK_GROUP_EXIT'
/** 设置当前协作群组 */
export const COWORK_GROUP_SET_CURRENT = 'COWORK_GROUP_SET_CURRENT'
/** 设置当前协作群组任务 */
export const COWORK_TAST_SET_CURRENT = 'COWORK_TAST_SET_CURRENT'
/** 协作群组任务添加成员 */
export const COWORK_TAST_MEMBERS_ADD = 'COWORK_TAST_MEMBERS_ADD'

// export interface Task {
// }


export interface Cowork {
  invites: [],
  tasks: {[userId: string]: {[groupId: string]: Array<any>}},
  messages: {[userId: string]: {[groupId: string]: Array<any>}},
}

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
export const setCurrentTask = (params: any, cb = () => {}) => async (dispatch: (arg0: any) => any) => {
  await dispatch({
    type: COWORK_TAST_SET_CURRENT,
    payload: params,
  })
  cb && cb()
}

/**
 * 添加任务成员
 * @param params
 * @param cb
 */
export const addTaskMembers = (params: {
  groupID: string,
  id: string,
  members: Array<{id: string, name: string}>,
}, cb = () => {}) => async (dispatch: (arg0: any) => any, getState: () => any) => {
  const userId = getState().user.toJS().currentUser.userId || 'Customer'
  await dispatch({
    type: COWORK_TAST_MEMBERS_ADD,
    payload: params,
    userId,
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

const initialState = fromJS({
  invites: [],
  messages: {},
  tasks: {},
  groups: {},
  currentGroup: {}, // 当前群组信息
  currentTask: {}, // 当前协作任务信息
})

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
      if (payload.type === MsgConstant.MSG_ONLINE_GROUP_APPLY) {
        let allMessages = state.toJS().messages
        let myMessages: any = allMessages[userId] || {}
        let messages: any = myMessages[payload.groupID] || []
        let message
        for (let i = 0; i < messages.length; i++) {
          let _message = messages[i]
          // 修改已有消息的状态
          if (payload.id === _message.id) {
            message = payload
            break
          }
        }
        // 添加新消息
        if (!message) {
          // messages.push(payload)
          messages.unshift(payload)
        }
        myMessages[payload.groupID] = messages
        allMessages[userId] = myMessages
        return state.setIn(['messages'], fromJS(allMessages))
      } else if (payload.type === MsgConstant.MSG_ONLINE_GROUP_TASK) { // 添加/修改任务
        return state.setIn(['tasks'], fromJS(addTask(state, { payload, userId })))
      } else if (payload.type === MsgConstant.MSG_ONLINE_GROUP_TASK_DELETE) { // 删除任务
        return state.setIn(['tasks'], fromJS(deleteTask(state, { payload, userId })))
      }
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
    [`${COWORK_TAST_MEMBERS_ADD}`]: (state: any, { payload, userId }: any) => {
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
      return state.setIn(['tasks'], fromJS(allTask))
    },
    [`${COWORK_GROUP_SET_CURRENT}`]: (state: any, { payload }: any) => {
      // TODO 检测payload有效性
      return state.setIn(['currentGroup'], fromJS(payload))
    },
    [`${COWORK_TAST_SET_CURRENT}`]: (state: any, { payload }: any) => {
      // TODO 检测payload有效性
      return state.setIn(['currentTask'], fromJS(payload))
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
    [REHYDRATE]: (state: any, { payload }: any) => {
      const _data = ModelUtils.checkModel(state, payload && payload.cowork)
      _data.currentGroup = {} // 重置当前群组
      _data.currentTask = {} // 重置当前任务
      return _data
    },
  },
  initialState,
)
