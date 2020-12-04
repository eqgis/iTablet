import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { ModelUtils } from '../../utils'
import { MsgConstant } from '../../constants'
// Constants
// --------------------------------------------------
export const ADD_COWORK_INVITE = 'ADD_COWORK_INVITE'
export const DELETE_COWORK_INVITE = 'DELETE_COWORK_INVITE'
export const COWORK_GROUP_MSG_ADD = 'COWORK_GROUP_MSG_ADD'
export const COWORK_GROUP_APPLY = 'COWORK_GROUP_APPLY'
export const COWORK_GROUP_TASK_ADD = 'COWORK_GROUP_TASK_ADD'

// export interface Task {
// }

// export interface Message {
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

export const addCoworkMsg = (params = {}, cb?: () => {}) => async (dispatch: (arg0: any) => any, getState: () => any) => {
  const userId = getState().user.toJS().currentUser.userId || 'Customer'
  await dispatch({
    type: COWORK_GROUP_MSG_ADD,
    payload: params,
    userId: userId,
  })
  cb && cb()
}

export const addCoworkTask = (params = {}, cb = () => {}) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  await dispatch({
    type: COWORK_GROUP_TASK_ADD,
    payload: params,
  })
  cb && cb()
}

const initialState = fromJS({
  invites: [],
  messages: {},
  tasks: {},
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
      if (payload.message.type === MsgConstant.MSG_ONLINE_GROUP_APPLY) {
        let allMessages = state.toJS().messages
        let myMessages: any = allMessages[userId] || {}
        let messages: any = myMessages[payload.group.groupID] || []
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
          messages.push(payload)
        }
        myMessages[payload.group.groupID] = messages
        allMessages[userId] = myMessages
        return state.setIn(['messages'], fromJS(allMessages))
      } else if (payload.message.type === MsgConstant.MSG_ONLINE_GROUP_TASK) {
        let allTask = state.toJS().tasks
        let myTasks: any = allTask[userId] || {}
        let tasks: any = myTasks[payload.group.groupID] || []
        let task
        for (let i = 0; i < tasks.length; i++) {
          let _task = tasks[i]
          // 修改已有消息的状态
          if (payload.id === _task.id) {
            task = payload
            tasks[i] = payload
            break
          }
        }
        // 添加新消息
        if (!task) {
          tasks.push(payload)
        }
        myTasks[payload.group.groupID] = tasks
        allTask[userId] = myTasks
        return state.setIn(['tasks'], fromJS(allTask))
      }
    },
    // [`${COWORK_GROUP_TASK_ADD}`]: (state: any, { payload }: any) => {
    //   let tasks: any = state.toJS().tasks || []
    //   let task
    //   for (let i = 0; i < tasks.length; i++) {
    //     let _task = tasks[i]
    //     // 修改已有消息的状态
    //     if (
    //       payload.id === _task.id
    //       // JSON.stringify(payload.user) === JSON.stringify(_message.user) &&
    //       // JSON.stringify(payload.group) === JSON.stringify(_message.group)
    //     ) {
    //       task = payload
    //       break
    //     }
    //   }
    //   // 添加新消息
    //   if (!task) {
    //     tasks.push(payload)
    //   }
    //   return state.setIn(['tasks'], fromJS(tasks))
    // },
    [REHYDRATE]: (state: any, { payload }: any) => {
      const _data = ModelUtils.checkModel(state, payload && payload.cowork)
      return _data
    },
  },
  initialState,
)
