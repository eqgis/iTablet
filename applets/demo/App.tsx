import React from 'react'
import { Provider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { PersistGate } from 'redux-persist/integration/react'
import ConfigStore from '../../src/redux/store'
const { persistor, store } = ConfigStore()
// import Home from './src/containers'
import Root from './src/containers'

// export {
//   Home,
// }

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <NavigationContainer>{Root()}</NavigationContainer>
    </PersistGate>
  </Provider>
)

// const App = () => (
//   <SafeAreaView style={{
//     backgroundColor: 'red',
//     flex: 1,
//   }}>
//     <View
//       style={{
//         backgroundColor: 'red',
//         flex: 1,
//       }}
//     >
//       {Home}
//     </View>
//   </SafeAreaView>
// )

export default App