import React from 'react'
import { Provider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { PersistGate } from 'redux-persist/integration/react'
import ConfigStore from '../../src/redux/store'
import Root from './src/containers'

const { persistor, store } = ConfigStore()

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <NavigationContainer>{Root()}</NavigationContainer>
    </PersistGate>
  </Provider>
)
export default App