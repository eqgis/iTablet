/**
 * 地图模块完整数据，临时数据，不持久化
 */
import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
// Constants
// --------------------------------------------------
export const MODULES_SET_MAP_MODULE = 'MODULES_SET_MAP_MODULE'
export const MODULES_SET_CURRENT_MAP_MODULE = 'MODULES_SET_CURRENT_MAP_MODULE'
export const MODULES_ADD_MAP_MODULE = 'MODULES_ADD_MAP_MODULE'

// Actions
// --------------------------------------------------
export const setMapModule = (
  params,
  cb = () => {},
) => async dispatch => {
  await dispatch({
    type: MODULES_SET_MAP_MODULE,
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
      type: MODULES_SET_CURRENT_MAP_MODULE,
      payload: params,
    })
    cb && cb()
  }
}

export const addMapModule = (
  params,
  cb = () => {},
) => async dispatch => {
  await dispatch({
    type: MODULES_ADD_MAP_MODULE,
    payload: params,
  })
  cb && cb()
}

const initialState = fromJS({
  modules: [],
  currentMapModule: -1,
})

export default handleActions(
  {
    [`${MODULES_SET_MAP_MODULE}`]: (state, { payload }) => {
      if (payload && payload instanceof Array) {
        payload = payload.map(item => {
          return new item()
        })
      }
      return state.setIn(['modules'], fromJS(payload))
    },
    [`${MODULES_ADD_MAP_MODULE}`]: (state, { payload }) => {
      const modules = state.toJS().modules
      let _module
      for (let module of modules) {
        if (module.key === payload.key) {
          _module = payload
          break
        }
      }
      if (!_module) {
        modules.push(payload)
      }
      return state.setIn(['modules'], fromJS(modules))
    },
    [`${MODULES_SET_CURRENT_MAP_MODULE}`]: (state, { payload }) =>
      state.setIn(['currentMapModule'], fromJS(payload)),
  },
  initialState,
)
