import { fromJS, Record } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { SMap, SScene, RNFS as fs } from 'imobile_for_reactnative'
import { FileTools } from '../../native'
import { Toast } from '../../utils'
import { ConstPath, ConstInfo } from '../../constants'
import UserType from '../../constants/UserType'
import ConstOnline from '../../constants/ConstOnline'
import { getLanguage } from '../../language'


// Constants
// --------------------------------------------------
export const SET_SCENE_INFO = 'SET_SCENE_INFO'

// type
// --------------------------------------------------

// {
//   name: "OlympicGreen",
//   server: "http://192.168.11.168:8090/iserver/services/3D-OlympicGreen/rest/realspace",
//   mtime: "",
//   isOnlineScence: true,
//   image: 611,
//   rightView: undefined,
// }

export interface sceneInfoType {
  name: string,
  server: string,
  mtime: string,
  isOnlineScence: boolean,
  image: number,
  rightView: undefined,
}

// Actions
// --------------------------------------------------

// 保存当前场景的信息
export const setCurSceneInfo = (params: sceneInfoType | null, cb = () => { }) => async (dispatch) => {
  try {
    const defaultSceneInfo: sceneInfoType = {
      name: '',
      server: '',
      mtime: '',
      isOnlineScence: false,
      image: 611,
      rightView: undefined,
    }

    await dispatch({
      type: SET_SCENE_INFO,
      payload: params || defaultSceneInfo,
    })
    cb && cb(true)
  } catch (e) {
    console.warn("setCurSceneInfo function error: " + JSON.stringify(e))
    cb && cb(false)
  }
}


interface SceneState {
  sceneInfo:sceneInfoType,
}
const initialState = fromJS({
  sceneInfo:{
    name: "",
    server: "",
    mtime: "",
    isOnlineScence: false,
    image: 611,
    rightView: undefined,
  },
})

type SettingStateType = Record<SceneState> & SceneState
export default handleActions<SettingStateType>(
  {
    [`${SET_SCENE_INFO}`]: (state, { payload }) => {
      return state.setIn(['sceneInfo'], fromJS(payload))
    },
    [REHYDRATE]: (state, { payload }) => {
      if (payload && payload.scenes) {
        return fromJS(payload.scenes)
      }
      return state
    },
  },
  initialState,
)