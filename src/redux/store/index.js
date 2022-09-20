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
    'mapModules',
    'arattribute',
    'location',
  ],
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const reducer = persistCombineReducers(persistConfig, reducers)

export default () => {
  const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(...middlewares)),
  )
  const persistor = persistStore(store)
  return { persistor, store }
}
