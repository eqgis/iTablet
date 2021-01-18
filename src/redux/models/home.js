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

const initialState = fromJS({
    guideshow: true,
    version: '',
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
