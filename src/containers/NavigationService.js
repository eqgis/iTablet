// NavigationService.js

import { StackActions, CommonActions } from '@react-navigation/native'

let _navigator
let tempRoute

function getTopLevelNavigator() {
  return _navigator
}

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef
}

function navigate(name, params) {
  (async function() {
    // 判断是否是从地图跳转到制定的页面,是否显示半屏
    name = isInMapPage(name) || name
    if (name === tempRoute) return
    tempRoute = name
    _navigator.navigate(name, params)
    // await _navigator.dispatch(
    //   NavigationActions.navigate({
    //     name,
    //     params,
    //   }),
    // )
    setTimeout(() => {
      tempRoute = undefined
    }, 1000)
  })()
}

function isInMap() {
  if (_navigator) {
    const _state = _navigator.getRootState()
    let routes = _state.routes
    for (let i = routes.length - 1; i >= 0; i--) {
      if (routes[i].name === 'MapStack') {
        return true
      } else if (
        routes[i].name === 'CoworkTabs' &&
        routes[i].state.index === 1
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
    const _state = _navigator.getRootState()
    let routes = _state.routes
    for (let i = routes.length - 1; i >= 0; i--) {
      if (routes[i].name === 'Map3DStack') {
        return true
      }
    }
    return false
  }
  return false
}

/**
 *
 * @param name 从该页面返回
 * @param immediate
 */
function goBack(name = '', immediate = null) {
  (async function _goBack() {
    let key
    if (name) {
      const _state = _navigator.getRootState()
      let routes = _state.routes
      for (let i = routes.length - 1; i >= 0; i--) {
        if (routes[i].name === name) {
          key = routes[i].key
          break
        }
      }
    }
    if (
      (name && !key) ||
      (name !== undefined &&
        name !== '' &&
        name === tempRoute) ||
      tempRoute === 'temp'
    ) {
      return
    } else if (name) {
      tempRoute = name
    } else {
      tempRoute = 'temp'
    }

    _navigator.goBack(key)
    // await _navigator.dispatch({
    //   ...CommonActions.goBack(),
    //   source: name,
    //   target: name,
    // })
    if (tempRoute) {
      setTimeout(() => {
        tempRoute = undefined
      }, 1000)
    }
  })()
}

function isCurrent(name) {
  const _state = _navigator.getRootState()
  let routes = _state.routes
  if (routes.length > 0) {
    let currentRoute = routes[routes.length - 1]
    while (currentRoute.routes) {
      currentRoute = currentRoute.routes[currentRoute.index]
    }
    if (currentRoute.name === name) {
      return true
    }
  }
  return false
}

function getCurrent() {
  const _state = _navigator.getRootState()
  let routes = _state.routes
  if (routes.length > 0) {
    let currentRoute = routes[routes.length - 1]
    return currentRoute.name
  }
  return ''
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
  // const resetAction = NavigationActions.reset({
  //   index,
  //   actions,
  // })
  // _navigator.dispatch(resetAction)
}

function replace(name, params) {
  const resetAction = StackActions.replace({
    name,
    params,
  })
  _navigator.dispatch(resetAction)
}

function popToTop() {
  const resetAction = StackActions.popToTop()
  _navigator.dispatch(resetAction)
}
// add other navigation functions that you need and export them

function push(name, params) {

  const pushAction = StackActions.push(name, params)

  _navigator.dispatch(pushAction)
}

const InMapPage = [
  'MyDatasource',
  'MyDataset',
  'NewDataset',
]

const InMap = '_InMap'

/**
 * 区分是否在在地图界面跳转到以下界面
 *
 * 若存在,则在地图页面显示半屏,以transparentModel形式展示
 * 反之,则以card方式展示
 */
function isInMapPage(name) {
  if (InMapPage.includes(name) && isInMap()) {
    return name + InMap
  } else if (name.endsWith(InMap)) {
    return name
  } else {
    return ''
  }
}

export default {
  navigate,
  getTopLevelNavigator,
  setTopLevelNavigator,
  goBack,
  reset,
  replace,
  pop,
  popToTop,
  push,
  isInMap,
  isInMap3D,
  isCurrent,
  getCurrent,
  isInMapPage,
}
