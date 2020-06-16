import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { ChunkType } from '../../constants'
// import { ModelUtils } from '../../utils'
// Constants
// --------------------------------------------------
export const MODULES_SET = 'MODULES_SET'
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
    let isInit = oldMapModules.length === 0
    for (let i = 0; i < params.mapModules.length; i++) {
      let item = params.mapModules[i]
      if (isInit|| oldMapModules.indexOf(item) >= 0) {
        params.oldMapModules.push(item)
      }
    }
    // 插入默认模块
    let defaultModuleKeys = Object.keys(ChunkType)
    for (let i = defaultModuleKeys.length - 1; i >= 0; i--) {
      let key = ChunkType[defaultModuleKeys[i]]
      if (params.mapModules.indexOf(key) < 0) {
        params.mapModules.unshift(key)
      }
      if (params.oldMapModules.indexOf(key) < 0) {
        params.mapModules.unshift(key)
      }
    }
  }
  await dispatch({
    type: MODULES_SET,
    payload: params,
  })
  cb && cb()
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
    [`${MODULES_SET_OLD}`]: (state, { payload }) => {
      let mapModule = state.toJS().oldMapModules || []
      if (mapModule.indexOf(payload) < 0) mapModule.push(payload)
      return state.setIn(['oldMapModules'], fromJS(mapModule))
    },
    [REHYDRATE]: (state, { payload }) =>
      payload && payload.appConfig ? fromJS(payload.appConfig) : state,
  },
  initialState,
)
