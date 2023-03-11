import { Dimensions, ScaledSize } from "react-native"
import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import { screen } from '../../utils'
import { ThunkAction } from "redux-thunk"
import { RootState } from "../types"
import { OrientationType } from "@/utils/screen"
import { DeviceUtils } from 'imobile_for_reactnative'
import { NetInfoState, NetInfoStateType } from "@react-native-community/netinfo"
// Constants
// --------------------------------------------------
export const SHOW_SET = 'SHOW_SET'
export const SET_NETINFO = 'SET_NETINFO'

export interface DEVICE {
  orientation: OrientationType,
  width: number,
  height: number,
  safeWidth: number,
  safeHeight: number,
}

export interface DeviceState {
  windowSize: ScaledSize,
  screenSize: ScaledSize,
  // orientation: OrientationType,
}

export interface SetWindowSizeAction {
  type: typeof SHOW_SET,
  payload: {
    orientation: OrientationType,
  },
}

export interface NetInfoAction {
  type: typeof SET_NETINFO,
  payload: NetInfoState,
}

// Actions
// ---------------------------------.3-----------------

// 横竖屏切换，使用
export const setShow = (params: {orientation: OrientationType}, cb?: () => void): ThunkAction<void, RootState, unknown, SetWindowSizeAction> => async dispatch => {
  screen.setOrientation(params.orientation)
  const hasNavigationBar = await DeviceUtils.hasNavigationBar()
  const navigationBarHeight = DeviceUtils.getNavigationBarHeight()
  screen.setHasNavigationBar(hasNavigationBar)
  screen.setNavigationBarHeight(navigationBarHeight)
  await dispatch({
    type: SHOW_SET,
    payload: params,
  })
  cb && cb()
}

/**
 * 设置设备网络状态
 * @param params 网络状态
 * @param cb 回调
 * @returns
 */
export const setNetInfo = (params: NetInfoState, cb?: () => void): ThunkAction<void, RootState, unknown, NetInfoAction> => async (dispatch, getState) => {
  const netInfo = getState().device.toJS().netInfo
  if (JSON.stringify(netInfo) === JSON.stringify(params)) {
    cb && cb()
    return
  }
  await dispatch({
    type: SET_NETINFO,
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
  windowSize: Dimensions.get('window'),
  screenSize: Dimensions.get('screen'),
  netInfo: {
    type: NetInfoStateType.unknown,
    isConnected: null,
    isInternetReachable: null,
    details: null,
  }
})

export default handleActions(
  {
    [`${SHOW_SET}`]: (state: any, { payload }: { payload: {orientation: OrientationType}}) => {
      const { device } = state.toJS()
      device.width = screen.getScreenWidth(payload.orientation)
      device.height = screen.getScreenHeight(payload.orientation)
      device.safeWidth = screen.getScreenSafeWidth(payload.orientation)
      device.safeHeight = screen.getScreenSafeHeight(payload.orientation)
      device.orientation = payload.orientation
      const windowSize = Dimensions.get('window')
      const screenSize = Dimensions.get('screen')
      return state.setIn(['device'], fromJS(device)).setIn(['windowSize'], fromJS({
        ...windowSize,
        width: device.width,
        height: device.height,
      })).setIn(['screenSize'], fromJS({
        ...screenSize,
        width: payload.orientation.indexOf('LANDSCAPE') >= 0 ? Math.max(screenSize.width, screenSize.height) : Math.min(screenSize.width, screenSize.height),
        height: payload.orientation.indexOf('LANDSCAPE') >= 0 ? Math.min(screenSize.width, screenSize.height) : Math.max(screenSize.width, screenSize.height),
      }))
    },
    [`${SET_NETINFO}`]: (state: any, { payload }: { payload: NetInfoState}) => {
      return state.setIn(['netInfo'], fromJS(payload))
    },
    // [REHYDRATE]: (state, { payload }) => {
    //   return payload && payload.device ? fromJS(payload.device) : state
    // },
  },
  initialState,
)
