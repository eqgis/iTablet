const { Orientation } = require('react-native').NativeModules
const { DeviceEventEmitter } = require('react-native')

const listeners = {}
const orientationDidChangeEvent = 'orientationDidChange'
const specificOrientationDidChangeEvent = 'specificOrientationDidChange'

let id = 0
const META = '__listener_id'

function getKey(listener) {
  if (!listener.hasOwnProperty(META)) {
    if (!Object.isExtensible(listener)) {
      return 'F'
    }

    Object.defineProperty(listener, META, {
      value: `L${++id}`,
    })
  }

  return listener[META]
}

module.exports = {
  getOrientation(cb) {
    Orientation.getOrientation((error, orientation) => {
      cb(error, orientation)
    })
  },

  getSpecificOrientation(cb) {
    Orientation.getSpecificOrientation((error, orientation) => {
      cb(error, orientation)
    })
  },

  lockToPortrait() {
    Orientation.lockToPortrait()
  },

  lockToLandscape() {
    Orientation.lockToLandscape()
  },

  lockToLandscapeRight() {
    Orientation.lockToLandscapeRight()
  },

  lockToLandscapeLeft() {
    Orientation.lockToLandscapeLeft()
  },

  unlockAllOrientations() {
    Orientation.unlockAllOrientations()
  },

  addOrientationListener(cb) {
    const key = getKey(cb)
    listeners[key] = DeviceEventEmitter.addListener(
      orientationDidChangeEvent,
      body => {
        cb(body.orientation)
      },
    )
  },

  removeOrientationListener(cb) {
    const key = getKey(cb)

    if (!listeners[key]) {
      return
    }

    listeners[key].remove()
    listeners[key] = null
  },

  addSpecificOrientationListener(cb) {
    const key = getKey(cb)

    listeners[key] = DeviceEventEmitter.addListener(
      specificOrientationDidChangeEvent,
      body => {
        cb(body.specificOrientation)
      },
    )
  },

  removeSpecificOrientationListener(cb) {
    const key = getKey(cb)

    if (!listeners[key]) {
      return
    }

    listeners[key].remove()
    listeners[key] = null
  },

  getInitialOrientation() {
    return Orientation.initialOrientation
  },
}
