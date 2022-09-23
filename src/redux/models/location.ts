import { fromJS } from "immutable"
import { handleActions } from 'redux-actions'
import { REHYDRATE } from 'redux-persist'
import { NtripMountPoint } from "imobile_for_reactnative/NativeModule/interfaces/SLocation"


// 类型定义
// --------------------------------------------------
export interface EssentialInfo {
  /** 协议 */
  agreement: 'NTRIPV1'
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


