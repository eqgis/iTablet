import { fromJS } from "immutable"
import { handleActions } from 'redux-actions'
import { REHYDRATE } from 'redux-persist'
import { NtripMountPoint, PositionAccuracyType } from "imobile_for_reactnative/NativeModule/interfaces/SLocation"


// 类型定义
// --------------------------------------------------
export interface EssentialInfo {
  /** 协议 */
  agreement: 'NTRIPV1' | "China Mobile"
  address: string
  port: string
  userName: string
  password: string
}

export interface NtripInfoType {
  essentialInfo: EssentialInfo
  selectLoadPoint: NtripMountPoint,
}


// Constants
// --------------------------------------------------
const UPDATE_NTRIP_INFO = 'UPDATE_NTRIP_INFO'
const SET_POINT_STATE_TEXT = 'SET_POINT_STATE_TEXT'
const SET_POSITION_ACCURACY = 'SET_POSITION_ACCURACY'


// Actions Type
// --------------------------------------------------

export interface upDateNtripInfoAction {
  type: typeof UPDATE_NTRIP_INFO
  payload: NtripInfoType
}

export interface pointStateTextAction {
  type: typeof SET_POINT_STATE_TEXT
  payload: string
}

export interface positionAccuracyAction {
  type: typeof SET_POSITION_ACCURACY
  payload: PositionAccuracyType
}


// Actions
// --------------------------------------------------

/** AR场景提示 */
export const updateNtripInfo = (
  essentialInfoParam : EssentialInfo ,
  selectLoadPointParam : NtripMountPoint
) => async (
  dispatch: (arg0: upDateNtripInfoAction) => void
) => {
  try {
    const data = {
      essentialInfo: essentialInfoParam,
      selectLoadPoint: selectLoadPointParam,
    }
    await dispatch({
      type: UPDATE_NTRIP_INFO,
      payload: data,
    })
  } catch (error) {
    // to do
  }
}

/** 设置定位状态的提示文字 */
export const setPointStateText = (
  text: string
) => async (
  dispatch: (arg0: pointStateTextAction) => void
) => {
  try {
    await dispatch({
      type: SET_POINT_STATE_TEXT,
      payload: text,
    })
  } catch (error) {
    // to do
  }
}

/** 设置高精定位的精度选择 */
export const setPositionAccuracy = (
  type: PositionAccuracyType
) => async (
  dispatch: (arg0: positionAccuracyAction) => void
) => {
  try {
    await dispatch({
      type: SET_POSITION_ACCURACY,
      payload: type,
    })
  } catch (error) {
    // to do
  }
}

// 初始值
// --------------------------------------------------
const initialState = fromJS({
  essentialInfo:{
    agreement: 'NTRIPV1',
    address: '',
    port: '',
    userName: '',
    password: '',
  },
  selectLoadPoint: {
    name: '',
    requireGGA: false,
  },
  pointStateText: '',
  positionAccuracy: 5,
})


// --------------------------------------------------
export default handleActions(
  {
    [`${UPDATE_NTRIP_INFO}`]: (state: any, { payload }) => {
      const essentialInfo = payload.essentialInfo
      const selectLoadPoint = payload.selectLoadPoint
      return state.setIn(
        ['essentialInfo'], fromJS(essentialInfo)
      ).setIn(
        ['selectLoadPoint'], fromJS(selectLoadPoint)
      )
    },
    [`${SET_POINT_STATE_TEXT}`]: (state: any, { payload }) => {
      return state.setIn(['pointStateText'], fromJS(payload))
    },
    [`${SET_POSITION_ACCURACY}`]: (state: any, { payload }) => {
      return state.setIn(['positionAccuracy'], fromJS(payload))
    },

    [REHYDRATE]: (state, { payload }) => {
      // 写这个属性，必须要放在白名单里，并且要保存出值的话，要在payload里面的对应模块里去取
      if(payload && payload.location) {
        const location = payload.location
        location.pointStateText = ""
        return fromJS(location)
      }
      return state
    },
  },
  initialState,
)


