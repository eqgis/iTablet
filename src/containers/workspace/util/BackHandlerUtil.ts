// import NavigationService from '../../NavigationService'

import { NavigationState } from "@react-navigation/native"

interface BackActions {
  [key: string]: () => void,
}

function backHandler(nav: NavigationState, backActions: BackActions) {
  const _nav = nav && nav.routes
  //  ? nav : NavigationService.getTopLevelNavigator()?.state.nav
  if (!_nav) {
    return false
  }
  let current = nav.routes[nav.index]
  while (current?.state?.routes && current.state.index !== undefined) {
    current = current.state.routes[current.state.index]
  }
  const key = current.name
  if (backActions[key] && typeof backActions[key] === 'function') {
    backActions[key]()
    return true
  } else {
    return false
  }
}

export default {
  backHandler,
}
