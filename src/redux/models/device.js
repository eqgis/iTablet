import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import { screen } from '../../utils'
// Constants
// --------------------------------------------------
export const SHOW_SET = 'SHOW_SET'
// Actions
// ---------------------------------.3-----------------

// 横竖屏切换，使用
export const setShow = (params = {}, cb = () => {}) => async dispatch => {
  screen.setOrientation(params.orientation)
  await dispatch({
    type: SHOW_SET,
    payload: params,
  })
  cb && cb()
}

const initialState = fromJS({
  device: {
    orientation:
      screen.deviceHeight > screen.deviceWidth ? 'PORTRAIT' : 'LANDSCAPE',
    width: screen.getScreenWidth(),
    height: screen.getScreenHeight(),
    safeWidth: screen.getScreenSafeWidth(),
    safeHeight: screen.getScreenSafeHeight(),
  },
})

export default handleActions(
  {
    [`${SHOW_SET}`]: (state, { payload }) => {
      const { device } = state.toJS()
      device.width = screen.getScreenWidth(payload.orientation)
      device.height = screen.getScreenHeight(payload.orientation)
      device.safeWidth = screen.getScreenSafeWidth()
      device.safeHeight = screen.getScreenSafeHeight()
      device.orientation = payload.orientation
      return state.setIn(['device'], fromJS(device))
    },
    // [REHYDRATE]: (state, { payload }) => {
    //   return payload && payload.device ? fromJS(payload.device) : state
    // },
  },
  initialState,
)
