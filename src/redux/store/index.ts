import AsyncStorage from '@react-native-async-storage/async-storage'
import { createStore, applyMiddleware, compose, StoreCreator } from 'redux'
import { persistStore, persistCombineReducers, PersistConfig } from 'redux-persist'
import * as reducers from '../models/index'
import middlewares from './middlewares/index'

interface InjectParams {
  key: string,
  reducer: any,
  list: 'whitelist' | 'blacklist',
}

const persistConfig: PersistConfig = {
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

let persistor: any = null, store: StoreCreator = null

/**
 * 动态注入新的reducer
 */
export const injectReducer = (params: InjectParams) => {
  try {
    if (!store) return
    reducers[params.key] = params.reducer
    if (persistConfig[params.list].indexOf(params.key) < 0) {
      persistConfig[params.list].push(params.key)
    }
    reducer= persistCombineReducers(persistConfig, reducers)
    store.replaceReducer(reducer)
  } catch (error) {
    __DEV__ && console.warn(error)
  }
}

export default () => {
  // 小程序与主业务代码数据共同关键代码
  if (persistor && store) {
    return { persistor, store }
  }
  store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(...middlewares)),
  )
  persistor = persistStore(store)
  return { persistor, store }
}
