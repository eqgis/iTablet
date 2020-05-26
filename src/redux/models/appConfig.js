import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
// Constants
// --------------------------------------------------
export const MODULES_SET = 'MODULES_SET'
export const MODULES_SET_CUT_MAP_MODULE = 'MODULES_SET_CUT_MAP_MODULE'
export const MODULES_SET_OLD = 'MODULES_SET_OLD' // 标记为已读

// Actions
// --------------------------------------------------
export const setModules = (params, cb = () => {}) => async (
  dispatch,
  getState,
) => {
  if (!params) return
  if (params.mapModules) {
    params.oldMapModules = []
    let oldMapModules = getState().appConfig.toJS().oldMapModules || []
    for (let i = 0; i < params.mapModules.length; i++) {
      let item = params.mapModules[i]
      if (oldMapModules.indexOf(item.key) <= 0 && !item.isNew) {
        params.oldMapModules.push(item.key)
      }
    }
  }
  await dispatch({
    type: MODULES_SET,
    payload: params,
  })
  cb && cb()
}

export const setCurrentMapModule = (
  params,
  cb = () => {},
) => async dispatch => {
  if (params >= 0) {
    await dispatch({
      type: MODULES_SET_CUT_MAP_MODULE,
      payload: params,
    })
    cb && cb()
  }
}

export const setOldMapModule = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: MODULES_SET_OLD,
    payload: params,
  })
  cb && cb()
}

const initialState = fromJS({})

export default handleActions(
  {
    [`${MODULES_SET}`]: (state, { payload }) => {
      const appConfig = payload
      return fromJS(appConfig)
    },
    [`${MODULES_SET_CUT_MAP_MODULE}`]: (state, { payload }) =>
      state.setIn(['currentMapModule'], fromJS(payload)),
    [`${MODULES_SET_OLD}`]: (state, { payload }) => {
      let mapModule = state.toJS().oldMapModules || []
      if (mapModule.indexOf(payload) < 0) mapModule.push(payload)
      return state.setIn(['oldMapModules'], fromJS(mapModule))
    },
    [REHYDRATE]: (state, payload) =>
      payload && payload.appConfig ? fromJS(payload.appConfig) : state,
  },
  initialState,
)
