import NavigationService from '../../NavigationService'

function backHandler(nav, backActions) {
  let _nav =
    nav && nav.routes ? nav : NavigationService.getTopLevelNavigator().state.nav
  let current = _nav.routes[_nav.index]
  let key
  while (current?.state?.routes) {
    current = current.state.routes[current.state.index]
  }
  key = current.name
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
