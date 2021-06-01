// NavigationService.js

import { StackActions, NavigationActions } from 'react-navigation'

let _navigator
let tempRoute

function getTopLevelNavigator() {
  return _navigator
}

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef
}

function navigate(routeName, params) {
  (async function() {
    if (routeName === tempRoute) return
    tempRoute = routeName
    await _navigator.dispatch(
      NavigationActions.navigate({
        type: NavigationActions.NAVIGATE,
        routeName,
        params,
      }),
    )
    setTimeout(() => {
      tempRoute = undefined
    }, 1000)
  })()
}

function isInMap() {
  if (_navigator) {
    let routes = _navigator.state.nav.routes
    for (let i = routes.length - 1; i >= 0; i--) {
      if (routes[i].routeName === 'MapStack') {
        return true
      } else if (
        routes[i].routeName === 'CoworkTabs' &&
        routes[i].index === 1
      ) {
        return true
      }
    }
    return false
  }
  return false
}

function isInMap3D() {
  if (_navigator) {
    let routes = _navigator.state.nav.routes
    for (let i = routes.length - 1; i >= 0; i--) {
      if (routes[i].routeName === 'Map3DStack') {
        return true
      }
    }
    return false
  }
  return false
}

/**
 *
 * @param routeName 从该页面返回
 * @param immediate
 */
function goBack(routeName = undefined, immediate = null) {
  (async function _goBack() {
    let key
    if (routeName) {
      const { routes } = _navigator.state.nav
      for (let i = routes.length - 1; i >= 0; i--) {
        if (routes[i].routeName === routeName) {
          key = routes[i].key
          break
        }
      }
    }
    if (
      (routeName && !key) ||
      (routeName !== undefined &&
        routeName !== '' &&
        routeName === tempRoute) ||
      tempRoute === 'temp'
    ) {
      return
    } else if (routeName) {
      tempRoute = routeName
    } else {
      tempRoute = 'temp'
    }

    await _navigator.dispatch(
      NavigationActions.back({
        key,
        immediate,
      }),
    )
    if (tempRoute) {
      setTimeout(() => {
        tempRoute = undefined
      }, 1000)
    }
  })()
}

function isCurrent(name) {
  const { routes } = _navigator.state.nav
  if (routes.length > 0) {
    let currentRoute = routes[routes.length - 1]
    while (currentRoute.routes) {
      currentRoute = currentRoute.routes[currentRoute.index]
    }
    if (currentRoute.routeName === name) {
      return true
    }
  }
  return false
}

function pop(index = 1) {
  (async function _goBack() {
    await _navigator.dispatch(
      StackActions.pop({
        n: index,
      }),
    )
  })()
}

function reset(index, actions) {
  const resetAction = NavigationActions.reset({
    index,
    actions,
  })
  _navigator.dispatch(resetAction)
}

function replace(routeName, params) {
  const resetAction = StackActions.replace({
    routeName,
    params,
  })
  _navigator.dispatch(resetAction)
}

function popToTop() {
  const resetAction = StackActions.popToTop()
  _navigator.dispatch(resetAction)
}
// add other navigation functions that you need and export them

export default {
  navigate,
  getTopLevelNavigator,
  setTopLevelNavigator,
  goBack,
  reset,
  replace,
  pop,
  popToTop,
  isInMap,
  isInMap3D,
  isCurrent,
}
