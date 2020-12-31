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

export const MAP_ISCLASSIFY = 'MAP_ISCLASSIFY'

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

export const setIsClassifyView = (params = {}) => async dispatch => {
  await dispatch({
    type: MAP_ISCLASSIFY,
    payload: params || false,
  })
}

const initialState = fromJS({
    isClassifyView:false,//判断是否进入了目标分类界面
})

export default handleActions(
  {
    [`${SET_ANALYST_PARAMS}`]: (state, { payload }) =>
      state.setIn(['params'], fromJS(payload)),

      [`${MAP_ISCLASSIFY}`]: (state, { payload }) => {
        let data = state.toJS().isClassifyView
        if (payload) {
          data = payload
        } else {
          data = false
        }
        return state.setIn(['isClassifyView'], fromJS(data))
      },
      [REHYDRATE]: (state, { payload }) => {
        if (payload && payload.ar) {
          const data = payload.ar
          data.isClassifyView = false
          return fromJS(data)
        }
        return state
      },
  },
  initialState,
)
