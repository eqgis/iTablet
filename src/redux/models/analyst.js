/**
 * 记录Android物理返回按钮的事件
 */
import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import { REHYDRATE } from 'redux-persist'
// Constants
// --------------------------------------------------
export const SET_ANALYST_PARAMS = 'SET_ANALYST_PARAMS'
export const BACK_ACTION_REMOVE = 'BACK_ACTION_REMOVE'
export const MAP_ANALYST = 'MAP_ANALYST'
export const MAP_ANALYST_SUCCESS = 'MAP_ANALYST_SUCCESS'

// Actions
// --------------------------------------------------
export const setAnalystParams = (params = {}) => async dispatch =>
  dispatch({
    type: SET_ANALYST_PARAMS,
    payload: params,
  })

export const removeBackAction = (params = {}) => async (dispatch, getState) => {
  if (!params.key) {
    const nav = getState().nav.toJS()
    let current = nav.routes[nav.index]
    while (current.routes) {
      current = current.routes[current.index]
    }
    params.key = current.routeName
  }

  await dispatch({
    type: BACK_ACTION_REMOVE,
    payload: params,
  })
}

export const setIsAnalyst = (params = {}) => async dispatch => {
  await dispatch({
    type: MAP_ANALYST,
    payload: params || false,
  })
}

export const setAnalystSuccess = (params = {}) => async dispatch => {
  await dispatch({
    type: MAP_ANALYST_SUCCESS,
    payload: params || false,
  })
}

const initialState = fromJS({
  // onlineAnalyst: {
    isAnalyst:{type:'false'},
    analystSuccess:false,
  // }
})

export default handleActions(
  {
    [`${SET_ANALYST_PARAMS}`]: (state, { payload }) =>
      state.setIn(['params'], fromJS(payload)),


      [`${MAP_ANALYST}`]: (state, { payload }) => {
        let data = state.toJS().isAnalyst
        if (payload) {
          data = payload
        } else {
          data = {type:'false'}
        }
        return state.setIn(['isAnalyst'], fromJS(data))
      },
      [`${MAP_ANALYST_SUCCESS}`]: (state, { payload }) => {
        let data = state.toJS().analystSuccess
        if (payload) {
          data = payload
        } else {
          data = false
        }
        return state.setIn(['analystSuccess'], fromJS(data))
      },
      [REHYDRATE]: (state, { payload }) => {
        if (payload && payload.analyst) {
          const data = payload.analyst
          data.isAnalyst = {type:'false'}
          data.analystSuccess = false
          return fromJS(data)
        }
        return state
      },
  },
  initialState,
)
