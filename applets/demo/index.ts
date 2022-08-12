import App from './App'
import {AppRegistry} from 'react-native'
import Toast from 'react-native-root-toast'

Toast.show('Demo loaded')

AppRegistry.registerComponent('demo', () => App)