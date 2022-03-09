/**
 * 记录Android物理返回按钮的事件
 */
import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import { REHYDRATE } from 'redux-persist'
// Constants
// --------------------------------------------------
export const GUIDE_SHOW = 'GUIDE_SHOW'
export const VERSION = 'VERSION'
export const DATA_GUIDE = 'DATA_GUIDE'
export const THEME_GUIDE = 'THEME_GUIDE'
export const COLLECT_GUIDE = 'COLLECT_GUIDE'
export const MAP_EDIT_GUIDE = 'MAP_EDIT_GUIDE'
export const MAP_SCENE_GUIDE = 'MAP_SCENE_GUIDE'

// Actions
// --------------------------------------------------

export const setGuideShow = (params = {}) => async dispatch => {
  await dispatch({
    type: GUIDE_SHOW,
    payload: params,
  })
}

export const setVersion = (params = {}) => async dispatch => {
  await dispatch({
    type: VERSION,
    payload: params,
  })
}

export const setMapAnalystGuide = (params = {}) => async dispatch => {
  await dispatch({
    type: DATA_GUIDE,
    payload: params,
  })
}

export const setThemeGuide = (params = {}) => async dispatch => {
  await dispatch({
    type: THEME_GUIDE,
    payload: params,
  })
}

export const setCollectGuide = (params = {}) => async dispatch => {
  await dispatch({
    type: COLLECT_GUIDE,
    payload: params,
  })
}

export const setMapEditGuide = (params = {}) => async dispatch => {
  await dispatch({
    type: MAP_EDIT_GUIDE,
    payload: params,
  })
}

export const setMapSceneGuide = (params = {}) => async dispatch => {
  await dispatch({
    type: MAP_SCENE_GUIDE,
    payload: params,
  })
}

const initialState = fromJS({
  guideshow: false,//首页引导显隐
  version: '',//新手引导版本号
  mapAnalystGuide: true,//数据处理模块引导
  themeGuide: true,//专题制图模块引导
  collectGuide: true,//采集模块
  mapEditGuide: true,//地图浏览模块引导
  mapSceneGuide: true,//三维浏览模块引导
})

export default handleActions(
  {
    [`${GUIDE_SHOW}`]: (state, { payload }) => {
      let data = state.toJS().guideshow
      if (payload) {
        data = payload
      } else {
        data = false
      }
      return state.setIn(['guideshow'], fromJS(data))
    },
    [`${VERSION}`]: (state, { payload }) => {
      let data = state.toJS().version
      data = payload
      return state.setIn(['version'], fromJS(data))
    },
    [`${DATA_GUIDE}`]: (state, { payload }) => {
      let data = state.toJS().mapAnalystGuide
      data = payload
      return state.setIn(['mapAnalystGuide'], fromJS(data))
    },
    [`${THEME_GUIDE}`]: (state, { payload }) => {
      let data = state.toJS().themeGuide
      data = payload
      return state.setIn(['themeGuide'], fromJS(data))
    },
    [`${COLLECT_GUIDE}`]: (state, { payload }) => {
      let data = state.toJS().collectGuide
      data = payload
      return state.setIn(['collectGuide'], fromJS(data))
    },
    [`${MAP_EDIT_GUIDE}`]: (state, { payload }) => {
      let data = state.toJS().mapEditGuide
      data = payload
      return state.setIn(['mapEditGuide'], fromJS(data))
    },
    [`${MAP_SCENE_GUIDE}`]: (state, { payload }) => {
      let data = state.toJS().mapSceneGuide
      data = payload
      return state.setIn(['mapSceneGuide'], fromJS(data))
    },
    [REHYDRATE]: (state, { payload }) => {
      if (payload && payload.home) {
        const data = payload.home
        return fromJS(data)
      }
      return state
    },
  },
  initialState,
)
