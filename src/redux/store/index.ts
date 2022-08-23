import AsyncStorage from '@react-native-async-storage/async-storage'
import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistCombineReducers } from 'redux-persist'
import * as reducers from '../models/index'
import middlewares from './middlewares/index'

const persistConfig = {
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

export const reducer = persistCombineReducers(persistConfig, reducers)

let persistor: any = null, store: any = null

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
