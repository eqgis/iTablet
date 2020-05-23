import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { ModelUtils } from '../../utils'
// Constants
// --------------------------------------------------
export const ADD_COWORK_INVITE = 'ADD_COWORK_INVITE'
export const DELETE_COWORK_INVITE = 'DELETE_COWORK_INVITE'
// Actions
// ---------------------------------.3-----------------
export const addInvite = (params = {}, cb = () => {}) => async dispatch => {
  await dispatch({
    type: ADD_COWORK_INVITE,
    payload: params,
  })
  cb && cb()
}

export const deleteInvite = (params = {}, cb = () => {}) => async dispatch => {
  await dispatch({
    type: DELETE_COWORK_INVITE,
    payload: params,
  })
  cb && cb()
}

const initialState = fromJS({
  invites: [],
})

export default handleActions(
  {
    [`${ADD_COWORK_INVITE}`]: (state, { payload }) => {
      const cowork = state.toJS()
      if (!cowork.invites[payload.userId]) {
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
    [`${DELETE_COWORK_INVITE}`]: (state, { payload }) => {
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
    [REHYDRATE]: (state, { payload }) => {
      const _data = ModelUtils.checkModel(state, payload && payload.cowork)
      return _data
    },
  },
  initialState,
)
