import NetInfo from '@react-native-community/netinfo'
import AppEvent from './AppEvent/AppEvent'

let listnerAdded = false

export function addNetworkChangeEventListener() {
  if(!listnerAdded) {
    listnerAdded = true
    NetInfo.addEventListener(state => {
      AppEvent.emitEvent('network_change', state)
    })
  }
}