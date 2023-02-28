/**
 * 地图模块完整数据，临时数据，不持久化
 */
import { Collection, fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import { REHYDRATE } from 'redux-persist'
import { Module } from '@/class'
// Constants
// --------------------------------------------------
export const MODULES_SET_MAP_MODULE = 'MODULES_SET_MAP_MODULE'
export const MODULES_SET_CURRENT_MAP_MODULE = 'MODULES_SET_CURRENT_MAP_MODULE'
export const MODULES_ADD_MAP_MODULE = 'MODULES_ADD_MAP_MODULE'
export const MODULES_DELETE_MAP_MODULE = 'MODULES_DELETE_MAP_MODULE'
export const MODULES_LOAD_ADDED_APPLETS = 'MODULES_LOAD_ADDED_APPLETS' // 加载已经添加的小插件
interface MapModule<T, P> {
  type: T,
  payload: P,
}

interface handleParams<P> {
  payload: P,
}

export interface MapModules {modules: {[userName: string]: typeof Module[]}, currentMapModule: number}
export interface SetMapModule {modules: typeof Module[], userName: string}
export interface AddMapModule {module: typeof Module, userName: string}
export interface DeleteMapModule {moduleKey: string, userName: string}
export interface LoadAddedModule {moduleKey: string, userName: string}


// Actions
// --------------------------------------------------
export const setMapModule = (
  params: typeof Module[],
  cb?: () => void,
) => async (dispatch: (params: MapModule<typeof MODULES_SET_MAP_MODULE, SetMapModule>) => any, getState: () => any) => {
  const userName = getState().user.toJS().currentUser.userName
  await dispatch({
    type: MODULES_SET_MAP_MODULE,
    payload: {
      modules: params,
      userName: userName,
    },
  })
  cb && cb()
}

export const setCurrentMapModule = (
  params: number,
  cb: () => void,
) => async (dispatch: (params: MapModule<typeof MODULES_SET_CURRENT_MAP_MODULE, number>) => any) => {
  if (params >= 0) {
    await dispatch({
      type: MODULES_SET_CURRENT_MAP_MODULE,
      payload: params,
    })
    cb && cb()
  }
}

export const addMapModule = (
  params: typeof Module,
  cb?: () => void,
) => async (dispatch: (params: MapModule<typeof MODULES_ADD_MAP_MODULE, AddMapModule>) => any, getState: () => any) => {
  const userName = getState().user.toJS().currentUser.userName
  await dispatch({
    type: MODULES_ADD_MAP_MODULE,
    payload: {
      module: params,
      userName: userName,
    },
  })
  cb && cb()
}

export const deleteMapModule = (
  moduleKey: string,
  cb?: () => void,
) => async (dispatch: (params: MapModule<typeof MODULES_DELETE_MAP_MODULE, DeleteMapModule>) => any, getState: () => any) => {
  const userName = getState().user.toJS().currentUser.userName
  await dispatch({
    type: MODULES_DELETE_MAP_MODULE,
    payload: {
      moduleKey: moduleKey,
      userName: userName,
    },
  })
  cb && cb()
}

export const loadAddedModule = (
  moduleKey: string,
  cb?: () => void,
) => async (dispatch: (params: MapModule<typeof MODULES_LOAD_ADDED_APPLETS, LoadAddedModule>) => any, getState: () => any) => {
  const userName = getState().user.toJS().currentUser.userName
  await dispatch({
    type: MODULES_LOAD_ADDED_APPLETS,
    payload: {
      moduleKey: moduleKey,
      userName: userName,
    },
  })
  cb && cb()
}


const initialState: Collection<unknown, unknown> = fromJS({
  modules: {},
  applets: {}, // 添加的小插件
  currentMapModule: -1,
})

export default handleActions(
  {
    [`${MODULES_SET_MAP_MODULE}`]: (state: any, { payload }: handleParams<SetMapModule>) => {
      const modules = state.toJS().modules
      if (payload?.modules && payload.modules instanceof Array) {
        modules[payload.userName] = payload.modules.map(item => {
          return new item()
        })
      }
      return state.setIn(['modules'], fromJS(modules))
    },
    [`${MODULES_ADD_MAP_MODULE}`]: (state: any, { payload }: handleParams<AddMapModule>) => {
      const modules = state.toJS().modules
      const payloadModule = new payload.module()
      let _module
      for (const module of modules[payload.userName]) {
        if (module.key === payloadModule.key) {
          _module = payloadModule
          break
        }
      }
      if (!_module) {
        modules[payload.userName].push(payloadModule)
      }

      const applets = state.toJS().applets || {}
      applets[payloadModule.key] = payload.module

      return state.setIn(['modules'], fromJS(modules)).setIn(['applets'], fromJS(applets))
    },
    [`${MODULES_DELETE_MAP_MODULE}`]: (state: any, { payload }: handleParams<DeleteMapModule>) => {
      const modules = state.toJS().modules
      for (const index in modules[payload.userName]) {
        const module = modules[payload.userName][index]
        if (module?.key === payload.moduleKey) {
          // BundleTools.deleteBundle(module.key)
          modules[payload.userName].splice(index, 1)
          break
        }
      }
      return state.setIn(['modules'], fromJS(modules))
    },
    [`${MODULES_LOAD_ADDED_APPLETS}`]: (state: any, { payload }: handleParams<LoadAddedModule>) => {
      const applets: {[key: string]: typeof Module} = state.toJS().applets
      const modules: {[key: string]: Module[]} = state.toJS().modules
      try {
        const addedModule = applets[payload.moduleKey]
        if (addedModule) {
          let exist = false
          for (const module of modules[payload.userName]) {
            if (module.key === payload.moduleKey) {
              exist = true
              break
            }
          }
          if (!exist) {
            modules[payload.userName].push(new addedModule())
          }
        }
      } catch(e) {
        console.warn(e)
      }
      return state.setIn(['modules'], fromJS(modules))
    },
    [`${MODULES_SET_CURRENT_MAP_MODULE}`]: (state: any, { payload }: handleParams<number>) =>
      state.setIn(['currentMapModule'], fromJS(payload)),
    [REHYDRATE]: (state, { payload }) => {
      return payload && payload.mapModules ? fromJS(payload.mapModules) : state
    }
  },
  initialState,
)
