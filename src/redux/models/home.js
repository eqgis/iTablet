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

const initialState = fromJS({
    guideshow: false,//首页引导显隐
    version: '',//新手引导版本号
    mapAnalystGuide:true,//数据处理模块引导
    themeGuide:true,//专题制图模块引导
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
