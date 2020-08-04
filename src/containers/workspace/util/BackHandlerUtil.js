import NavigationService from '../../NavigationService'

function backHandler(nav, backActions) {
  let _nav = nav && nav.routes
    ? nav
    : NavigationService.getTopLevelNavigator().state.nav
  let current = _nav.routes[_nav.index]
  let key
  while (current.routes) {
    current = current.routes[current.index]
  }
  key = current.routeName
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