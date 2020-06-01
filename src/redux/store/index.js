import { AsyncStorage } from 'react-native'
import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistCombineReducers } from 'redux-persist'
import * as reducers from '../models/index'
import middlewares from './middlewares/index'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'setting',
    'user',
    'chat',
    'template',
    'symbol',
    'map',
    'histories',
    'appConfig',
  ],
  blacklist: [
    'nav',
    'collection',
    'down',
    'layers',
    'online',
    'device',
    'backActions',
    'analyst',
    'localData',
    'toolbarStatus',
    'mapModules',
  ],
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default () => {
  const reducer = persistCombineReducers(persistConfig, reducers)
  const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(...middlewares)),
  )
  const persistor = persistStore(store)
  return { persistor, store }
}
