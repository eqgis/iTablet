import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { ARLayer, SARMap } from 'imobile_for_reactnative'
import { FileTools } from '../../native'
import { ConstPath } from '../../constants'
import DataHandler from '../../containers/tabs/Mine/DataHandler'

export interface UserMapInfo {
  userName: string,
  mapName: string,
}

export interface ARMapState {
  maps: Array<UserMapInfo>,
  currentMap?: UserMapInfo,
}

export interface OpenARMapAction {
  type: typeof OPEN_AR_MAP,
  userName: string,
  mapName: string,
  layers: Array<ARLayer>,
}

export interface NewARMapAction {
  type: typeof NEW_AR_MAP,
  userName: string,
  layers: Array<ARLayer>,
  mapName: string,
}

export interface SaveARMapAction  {
  type: typeof SAVE_AR_MAP,
  userName: string,
  mapName: string,
}

export interface CloseARMapAction {
  type: typeof CLOSE_AR_MAP,
  userName: string,
}

interface ARMapAction<T> {
  payload: T,
}

interface DispatchParams {
  type: string,
  [name: string]: any,
}

// Constants
// --------------------------------------------------
export const OPEN_AR_MAP = 'OPEN_AR_MAP'
export const NEW_AR_MAP = 'NEW_AR_MAP'
export const SAVE_AR_MAP = 'SAVE_AR_MAP'
export const CLOSE_AR_MAP = 'CLOSE_AR_MAP'
export const SET_CURRENT_AR_MAP = 'SET_CURRENT_AR_MAP'

// Actions
// --------------------------------------------------
// 地图导出为xml
export const openARMap = (name = '') => async (dispatch: (params: DispatchParams) => any, getState: () => any) => {
  try {
    const userName = getState().user.toJS().currentUser.userName
    const homePath = await FileTools.getHomeDirectory()
    const mapPath = homePath + ConstPath.UserPath + userName + '/' + ConstPath.RelativePath.ARMap
    const path = mapPath + name + '.arxml'
    const result = await SARMap.open(path)
    if(result) {
      const layers = await SARMap.getLayers()
      dispatch({
        type: OPEN_AR_MAP,
        payload: {
          userName: userName,
          mapName: name,
          layers: layers,
        },
      })
      return true
    }
    return result
  } catch (e) {
    return false
  }
}

export const createARMap = (name = 'DefaultARMap') => async (dispatch: (params: DispatchParams) => any, getState: () => any) => {
  try {
    const userName = getState().user.toJS().currentUser.userName
    const result = await SARMap.close()
    if(result) {
      const homePath = await FileTools.getHomeDirectory()
      const mapPath = homePath + ConstPath.UserPath + userName + '/' + ConstPath.RelativePath.ARMap
      name = await DataHandler.getAvailableFileNameNoExt(mapPath, name, 'arxml')
      dispatch({
        type: NEW_AR_MAP,
        payload: {
          userName: userName,
          layers: [],
          mapName: name,
        },
      })
    }
    return result
  } catch(e) {
    return false
  }
}

export const saveARMap = (
  name = ''
) => async (dispatch: (params: DispatchParams) => any, getState: () => any)=> {
  try {
    const userName = getState().user.toJS().currentUser.userName
    let result: boolean
    if(name === '') {
      result = await SARMap.save()
    } else {
      const homePath = await FileTools.getHomeDirectory()
      const mapPath = homePath + ConstPath.UserPath + userName + '/' + ConstPath.RelativePath.ARMap
      const path = mapPath + name + '.arxml'
      result = await SARMap.saveAs(path)
    }
    if(result) {
      DataHandler.saveARRawDatasource()
      dispatch({
        type: SAVE_AR_MAP,
        payload: {
          userName: userName,
          mapName: name,
        },
      })
    }
    return result
  } catch(e) {
    // AppLog.error(e)
    return false
  }
}

export const closeARMap = () => async (dispatch: (params: DispatchParams) => any, getState: () => any) => {
  try {
    const user = getState().user.toJS().currentUser
    const result = await SARMap.close()
    if(result) {
      await DataHandler.closeARRawDatasource()
      dispatch({
        type: CLOSE_AR_MAP,
        payload: {
          userName: user.userName,
        },
      })
    }
    return result
  } catch (e) {
    return false
  }
}

export const setCurrentARMap = (mapInfo: UserMapInfo) => async (dispatch: (params: DispatchParams) => any, getState: () => any) => {
  try {
    dispatch({
      type: SET_CURRENT_AR_MAP,
      payload: {
        mapInfo: mapInfo,
      },
    })
    return true
  } catch (e) {
    return false
  }
}

const initialState = fromJS({
  maps: [],
  currentMap: undefined,
})

export default handleActions(
  {
    [`${NEW_AR_MAP}`]: (state: any, { payload }: ARMapAction<NewARMapAction>) => {
      const { maps } = state.toJS()
      maps.push({
        userName: payload.userName,
        mapName: payload.mapName,
      })
      return state.setIn(['maps'], fromJS(maps)).setIn(['currentMap'], fromJS({
        userName: payload.userName,
        mapName: payload.mapName,
      }))
    },
    [`${OPEN_AR_MAP}`]: (state: any, { payload }: ARMapAction<OpenARMapAction>) => {
      const { maps } = state.toJS()
      const usermap = maps.filter((userMap: OpenARMapAction) => {
        return userMap.userName === payload.userName
      })
      if(usermap.length === 0) {
        maps.push({
          userName: payload.userName,
          mapName: payload.mapName,
        })
      } else {
        usermap[0].mapName = payload.mapName
      }
      return state.setIn(['maps'], fromJS(maps)).setIn(['currentMap'], fromJS({
        userName: payload.userName,
        mapName: payload.mapName,
      }))
    },
    [`${SAVE_AR_MAP}`]: (state: any, { payload }: ARMapAction<SaveARMapAction>) => {
      const { maps } = state.toJS()
      const usermap = maps.filter((userMap: SaveARMapAction) => {
        return userMap.userName === payload.userName
      })
      if(usermap.length === 0) {
        maps.push({
          userName: payload.userName,
          mapName: payload.mapName,
        })
      }
      return state.setIn(['maps'], fromJS(maps)).setIn(['currentMap'], fromJS({
        userName: payload.userName,
        mapName: payload.mapName,
      }))
    },
    [`${CLOSE_AR_MAP}`]: (state: any, { payload }: ARMapAction<SaveARMapAction>) => {
      const { maps } = state.toJS()
      const usermap = maps.filter((userMap: SaveARMapAction) => {
        return userMap.userName === payload.userName
      })
      if(usermap.length === 0) {
        maps.push({
          userName: payload.userName,
          mapName: payload.mapName,
        })
      }
      for (let i in maps) {
        if (maps[i].userName === payload.userName) {
          maps.splice(i, 1)
          break
        }
      }
      return state.setIn(['maps'], fromJS(maps)).setIn(['currentMap'], fromJS(undefined))
    },
    [`${SET_CURRENT_AR_MAP}`]: (state: any, { payload }: ARMapAction<UserMapInfo>) => {
      return state.setIn(['currentMap'], fromJS({
        userName: payload.userName,
        mapName: payload.mapName,
      }))
    },
    [REHYDRATE]: (state: any, { payload }: ARMapAction<ARMapState>) => {
      if (payload?.maps) {
        let data: ARMapState = {
          maps: [],
          currentMap: undefined,
        }
        data.maps = payload.maps || []
        data.currentMap = undefined
        return fromJS(data)
      }
      return fromJS(state)
    },
  },
  initialState,
)