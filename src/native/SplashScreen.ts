/**
 * Android启动页
 * Android Only
 */
import {
  NativeModules,
  Platform,
} from 'react-native'
const SplashScreen = NativeModules.SplashScreen

function show() {
  if (Platform.OS === 'android') {
    SplashScreen.show()
  }
}

function hide() {
  if (Platform.OS === 'android') {
    SplashScreen.hide()
  }
}

export default {
  show,
  hide,
}