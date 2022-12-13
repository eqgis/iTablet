import AsyncStorage from '@react-native-async-storage/async-storage'
import { createStore, applyMiddleware, compose, Store } from 'redux'
import { persistStore, persistCombineReducers, PersistConfig, Persistor } from 'redux-persist'
import * as reducers from '../models/index'
import middlewares from './middlewares/index'

interface InjectParams {
  key: string,
  reducer: any,
  list: 'whitelist' | 'blacklist',
}

const persistConfig: PersistConfig<any, any, any, any> = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'setting',
    'chat',
    'template',
    'symbol',
    'map',
    'histories',
    'appConfig',
    'license',
    'cowork',
    'home',
    'ar',
    'armap',
    'mapModules',
    'scenes',
  ],
  blacklist: [
    'nav',
    'user',
    'collection',
    'down',
    'layers',
    'arlayer',
    'online',
    'device',
    'backActions',
    'analyst',
    'localData',
    'toolbarStatus',
    'arattribute',
  ],
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export let reducer = persistCombineReducers(persistConfig, reducers)

let _state: {[key: string]: any} = {}
export const setLastLaunchState = (state: {[key: string]: any}) => {
  _state = state
}

export const getLastLaunchState = () => {
  return _state
}

let persistor: Persistor | null = null, store: Store | null = null
const asyncReducers: any = {}
/**
 * 动态注入新的reducer
 */
export const injectReducer = (params: InjectParams) => {
  try {
    if (!store) return
    // reducers[params.key] = params.reducer
    if (persistConfig[params.list].indexOf(params.key) < 0) {
      persistConfig[params.list].push(params.key)
    }
    console.warn(persistConfig)
    asyncReducers[params.key] = params.reducer
    reducer= persistCombineReducers(persistConfig, {
      ...asyncReducers,
      ...reducers,
    })
    // 防止有其他事件正在dispatch,导致跑异常
    setTimeout(() => {
      if (!store) return
      store?.replaceReducer(reducer)
      persistor = persistStore(store)
      persistor.persist()
    }, 100)
  } catch (error) {
    __DEV__ && console.warn(error)
  }
}

export default () => {
  // 小插件与主业务代码数据共同关键代码
  if (persistor && store) {
    return { persistor, store }
  }
  store = createStore(
    reducer,
    {},
    composeEnhancers(applyMiddleware(...middlewares)),
  )
  persistor = persistStore(store)
  return { persistor, store }
}
