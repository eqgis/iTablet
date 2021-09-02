import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import { } from '../../utils'
import { ConfigUtils, AppInfo } from 'imobile_for_reactnative'
import { UserInfo } from '../../types'
// Constants
// --------------------------------------------------
export const USER_SET = 'USER_SET'
export const USERS_SET = 'USERS_SET'
export const USER_DELETE = 'USER_DELETE'

interface SetUserAction {
  type: typeof USER_SET,
  userInfo: UserInfo,
}

interface SetUsersAction {
  type: typeof USERS_SET,
  users: UserInfo[]
}

interface DeleteUserAction {
  type: typeof USER_DELETE,
  userInfo: UserInfo,
}

type UserActions = SetUserAction | SetUsersAction | DeleteUserAction

export interface Users {
  currentUser: UserInfo,
  users: Array<UserInfo>,
}


// Actions
// ---------------------------------.3-----------------
export const setUser = (params: UserInfo, cb = () => {}) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  GLOBAL.currentUser = params
  await dispatch({
    type: USER_SET,
    payload: params,
  })
  cb && cb()
}

export const setUsers = (params: UserInfo[], cb = () => {}) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  GLOBAL.currentUser = params[0]
  await dispatch({
    type: USERS_SET,
    payload: params,
  })
  cb && cb()
}

export const deleteUser = (params: UserInfo, cb = () => {}) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  await dispatch({
    type: USER_DELETE,
    payload: params,
  })
  cb && cb()
}

const initialState = fromJS({
  currentUser: {},
  users: [],
})

export default handleActions(
  {
    [`${USER_SET}`]: (state: { toJS: () => { users: any }; setIn: (arg0: string[], arg1: any) => { (): any; new(): any; setIn: { (arg0: string[], arg1: any): any; new(): any } } }, { payload }: any) => {
      const { users } = state.toJS()
      for (let i = 0; i < users.length; i++) {
        //判断类型后有id判断id，没有id判断userName
        if (users[i].userType === payload.userType &&
            ((users[i].userId !== undefined &&  payload.userId !== undefined && users[i].userId === payload.userId) ||
              users[i].userName === payload.userName)) {
          users[i] = payload
          users.splice(i, 1)
          break
        }
      }
      if (payload.userName) {
        users.unshift(payload)
      }
      ConfigUtils.recordUsers(users)
      AppInfo.setUserName(payload.userName)
      return state
        .setIn(['currentUser'], fromJS(payload))
        .setIn(['users'], fromJS(users))
    },
    [`${USERS_SET}`]: (state: { setIn: (arg0: string[], arg1: any) => any }, { payload }: any) => {
      if (payload.length > 0) {
        state = state.setIn(['currentUser'], fromJS(payload[0]))
        AppInfo.setUserName(payload[0].userName)
      }
      return state.setIn(['users'], fromJS(payload))
    },
    [`${USER_DELETE}`]: (state: { toJS: () => { users: any }; setIn: (arg0: string[], arg1: any) => any }, { payload }: any) => {
      const { users } = state.toJS()
      for (let i = 0; i < users.length; i++) {
       //判断类型后有id判断id，没有id判断userName
       if (users[i].userType === payload.userType &&
        ((users[i].userId !== undefined &&  payload.userId !== undefined && users[i].userId === payload.userId) ||
          users[i].userName === payload.userName))  {
          users.splice(i, 1)
          break
        }
      }
      ConfigUtils.recordUsers(users)
      return state.setIn(['users'], fromJS(users))
    },
    // [REHYDRATE]: (state, { payload }) => {
    //   const _data = ModelUtils.checkModel(state, payload && payload.user)
    //   // return payload && payload.user ? fromJS(payload.user) : state
    //   return _data
    // },
  },
  initialState,
)
