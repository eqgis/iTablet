import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { ModelUtils } from '../../utils'
import { ConfigUtils } from 'imobile_for_reactnative'
// Constants
// --------------------------------------------------
export const USER_SET = 'USER_SET'
export const USERS_SET = 'USERS_SET'
export const USER_DELETE = 'USER_DELETE'

// Actions
// ---------------------------------.3-----------------
export const setUser = (params = {}, cb = () => {}) => async dispatch => {
  await dispatch({
    type: USER_SET,
    payload: params,
  })
  cb && cb()
}

export const setUsers = (params = {}, cb = () => {}) => async dispatch => {
  await dispatch({
    type: USERS_SET,
    payload: params,
  })
  cb && cb()
}

export const deleteUser = (params = {}, cb = () => {}) => async dispatch => {
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
    [`${USER_SET}`]: (state, { payload }) => {
      const { users } = state.toJS()
      for (let i = 0; i < users.length; i++) {
        if (users[i].userName === payload.userName) {
          users[i] = payload
          users.splice(i, 1)
          break
        }
      }
      if (payload.userName) {
        users.unshift(payload)
      }
      ConfigUtils.recordUsers(users)
      return state
        .setIn(['currentUser'], fromJS(payload))
        .setIn(['users'], fromJS(users))
    },
    [`${USERS_SET}`]: (state, { payload }) => {
      if (payload.length > 0) {
        state = state.setIn(['currentUser'], fromJS(payload[0]))
      }
      return state.setIn(['users'], fromJS(payload))
    },
    [`${USER_DELETE}`]: (state, { payload }) => {
      const payloadString = JSON.stringify(payload)
      const { users } = state.toJS()
      for (let i = 0; i < users.length; i++) {
        if (JSON.stringify(users[i]) === payloadString) {
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
