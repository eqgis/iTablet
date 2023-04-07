import { fromJS } from "immutable"
import { handleActions } from 'redux-actions'
import { REHYDRATE } from 'redux-persist'
import { GGA, NtripMountPoint, PositionAccuracyType } from "imobile_for_reactnative/NativeModule/interfaces/SLocation"
import { SLocation } from "imobile_for_reactnative"


// 类型定义
// --------------------------------------------------

export type PositionServerTypes = 'NTRIPV1' | 'qianxun' | 'huace' | 'China Mobile'

export interface EssentialInfo {
  /** 协议 */
  agreement: string // PositionServerTypes
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
const SET_POSITION_DEVICE_MANUFACTURER = 'SET_POSITION_DEVICE_MANUFACTURER'
const SET_POSITION_DEVICE_TYPE = "SET_POSITION_DEVICE_TYPE"
const SET_POSITION_DEVICE_CONNECTION_MODE = "SET_POSITION_DEVICE_CONNECTION_MODE"
const SET_BLUETOOTH_DEVIC_INFO = "SET_BLUETOOTH_DEVIC_INFO"
const SET_POSITION_SERVER_TYPE = "SET_POSITION_SERVER_TYPE"
const SET_POSITION_AGREEMENT_TYPE = "SET_POSITION_AGREEMENT_TYPE"
const SET_POSITION_GGA = "SET_POSITION_GGA"


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

export type DeviceManufacturer = 'other' | 'situoli' | 'woncan' | 'mijiaH20'
export interface DeviceManufacturerAction {
  type: typeof SET_POSITION_DEVICE_MANUFACTURER
  payload: DeviceManufacturer
}

export type DeviceType = 'GPS' | "RTK"
export interface DeviceTypeAction {
  type: typeof SET_POSITION_DEVICE_TYPE
  payload: DeviceType
}

export interface DeviceConnectionModeAction {
  type: typeof SET_POSITION_DEVICE_CONNECTION_MODE
  payload: boolean
}

export interface BluetoothDeviceInfoType {
  name: string,
  address: string,
}
export interface BluetoothDeviceInfoAction {
  type: typeof SET_BLUETOOTH_DEVIC_INFO
  payload: BluetoothDeviceInfoType | null
}

export interface PositionServerTypeAction {
  type: typeof SET_POSITION_SERVER_TYPE
  payload: PositionServerTypes
}

export interface PositionAgreementTypeAction {
  type: typeof SET_POSITION_AGREEMENT_TYPE
  payload: string
}

export interface PositionGGAAction {
  type: typeof SET_POSITION_GGA
  payload:  GGA | null
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

/** 设置定位的设备厂家 */
export const setDeviceManufacturer = (
  manufacturer: DeviceManufacturer
) => async (
  dispatch: (arg0: DeviceManufacturerAction) => void
) => {
  try {
    await dispatch({
      type: SET_POSITION_DEVICE_MANUFACTURER,
      payload: manufacturer,
    })
  } catch (error) {
    // to do
  }
}

/** 设置定位的设备类型 */
export const setDeviceType = (
  deviceType: DeviceType
) => async (
  dispatch: (arg0: DeviceTypeAction) => void
) => {
  try {
    await dispatch({
      type: SET_POSITION_DEVICE_TYPE,
      payload: deviceType,
    })
  } catch (error) {
    // to do
  }
}

/** 设置定位的连接模式 */
export const setDeviceConnectionMode = (
  isBluetooth: boolean
) => async (
  dispatch: (arg0: DeviceConnectionModeAction) => void
) => {
  try {
    await dispatch({
      type: SET_POSITION_DEVICE_CONNECTION_MODE,
      payload: isBluetooth,
    })
  } catch (error) {
    // to do
  }
}

/** 设置蓝牙设备的信息 */
export const setBluetoothDeviceInfo = (
  bluetoothInfo: BluetoothDeviceInfoType | null
) => async (
  dispatch: (arg0: BluetoothDeviceInfoAction) => void
) => {
  try {
    await dispatch({
      type: SET_BLUETOOTH_DEVIC_INFO,
      payload: bluetoothInfo,
    })
  } catch (error) {
    // to do
  }
}

/** 设置蓝牙设备定位的服务类型 */
export const setPositionServerType = (
  positionServerType: PositionServerTypes
) => async (
  dispatch: (arg0: PositionServerTypeAction) => void
) => {
  try {
    await dispatch({
      type: SET_POSITION_SERVER_TYPE,
      payload: positionServerType,
    })
  } catch (error) {
    // to do
  }
}

/** 设置蓝牙设备定位的协议类型 */
export const setPositionAgreementType = (
  agreementType: string
) => async (
  dispatch: (arg0: PositionAgreementTypeAction) => void
) => {
  try {
    await dispatch({
      type: SET_POSITION_AGREEMENT_TYPE,
      payload: agreementType,
    })
  } catch (error) {
    // to do
  }
}

/** 设置蓝牙设备定位的协议类型 */
export const setPositionGGA = (
  gga: GGA | null
) => async (
  dispatch: (arg0: PositionGGAAction) => void
) => {
  try {
    await dispatch({
      type: SET_POSITION_GGA,
      payload: gga,
    })
  } catch (error) {
    console.error("setPositionGGA error: " + JSON.stringify(error))
  }
}

// 初始值
// --------------------------------------------------
const initialState = fromJS({
  essentialInfo:{
    agreement: 'Ntripv1',
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
  deviceManufacturer: 'other',
  deviceType: 'GPS',
  /** 蓝牙是否打开 */
  isOpenBlutooth: true,
  /** 连接的蓝牙设备  BluetoothDeviceInfoType 类型 */
  bluetoohDevice: null,
  /** 服务类型 */
  positionServerType: 'NTRIPV1',
  /** 协议类型 */
  positionAgreementType: 'Ntripv1',
  /** 差分参数 */
  gga:null,
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
    [`${SET_POSITION_DEVICE_MANUFACTURER}`]: (state: any, { payload }) => {
      return state.setIn(['deviceManufacturer'], fromJS(payload))
    },
    [`${SET_POSITION_DEVICE_TYPE}`]: (state: any, { payload }) => {
      return state.setIn(['deviceType'], fromJS(payload))
    },
    [`${SET_POSITION_DEVICE_CONNECTION_MODE}`]: (state: any, { payload }) => {
      return state.setIn(['isOpenBlutooth'], fromJS(payload))
    },
    [`${SET_BLUETOOTH_DEVIC_INFO}`]: (state: any, { payload }) => {
      return state.setIn(['bluetoohDevice'], fromJS(payload))
    },
    [`${SET_POSITION_SERVER_TYPE}`]: (state: any, { payload }) => {
      return state.setIn(['positionServerType'], fromJS(payload))
    },
    [`${SET_POSITION_AGREEMENT_TYPE}`]: (state: any, { payload }) => {
      return state.setIn(['positionAgreementType'], fromJS(payload))
    },
    [`${SET_POSITION_GGA}`]: (state: any, { payload }) => {
      return state.setIn(['gga'], fromJS(payload))
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


