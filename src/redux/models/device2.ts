import { Dimensions, ScaledSize } from "react-native"
// import Orientation, { OrientationType } from "react-native-orientation-locker"
import { ThunkAction } from "redux-thunk"
import { RootState } from "../types"


const SET_WINDOW_SIZE = 'SET_WINDOW_SIZE'
const SET_WINDOW_ORIENTATION = 'SET_WINDOW_ORIENTATION'

interface SetWindowSizeAction {
  type: typeof SET_WINDOW_SIZE,
  size: ScaledSize
}

interface SetWindowOrientationAction {
  type: typeof SET_WINDOW_ORIENTATION,
  // orientation: OrientationType
}

type DeviceAction = SetWindowSizeAction | SetWindowOrientationAction

export interface DeviceState {
  windowSize: ScaledSize
  screenSize: ScaledSize
  // orientation: OrientationType
}

const initState: DeviceState = {
  windowSize: Dimensions.get('window'),
  screenSize: Dimensions.get('screen'),
  // orientation: Orientation.getInitialOrientation(),
}

export const setWindowSize = (
  size: ScaledSize
): ThunkAction<void, RootState, unknown, SetWindowSizeAction> => dispatch => {
  dispatch({
    type: SET_WINDOW_SIZE,
    size: size,
  })
}

// export const setOrientation = (
//   o: OrientationType
// ): ThunkAction<void, RootState, unknown, SetWindowOrientationAction> => dispatch => {
//   dispatch({
//     type: SET_WINDOW_ORIENTATION,
//     orientation: o,
//   })
// }

export default (state = initState, action: DeviceAction): DeviceState => {
  switch(action.type) {
    case SET_WINDOW_SIZE :
      return {
        ...state,
        windowSize: action.size
      }
    case SET_WINDOW_ORIENTATION :
      return {
        ...state,
        // orientation: action.orientation
      }
    default:
      return state
  }
}