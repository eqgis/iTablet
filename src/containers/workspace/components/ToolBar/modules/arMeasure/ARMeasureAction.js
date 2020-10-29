import { SMeasureView } from 'imobile_for_reactnative'
import NavigationService from '../../../../../NavigationService'

function close() {}

function memu() {}

function showMenuBox() {}

function commit() {}

// AR测量面积
function arMeasureArea() {
  (async function() {
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      global.ARDeviceListDialog.setVisible(true)
      return
    }

    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    if (GLOBAL.showAIDetect) {
      GLOBAL.isswitch = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }
    NavigationService.navigate('MeasureAreaView', {
      measureType: 'measureArea',
    })
  })()
}

// AR测量距离
function arMeasureLength() {
  (async function() {
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      global.ARDeviceListDialog.setVisible(true)
      return
    }

    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    if (GLOBAL.showAIDetect) {
      GLOBAL.isswitch = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }
    NavigationService.navigate('MeasureAreaView', {
      measureType: 'measureLength',
    })
  })()
}

// AR测量距离
function arMeasureHeight() {
  (async function() {
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      global.ARDeviceListDialog.setVisible(true)
      return
    }

    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    if (GLOBAL.showAIDetect) {
      GLOBAL.isswitch = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }
    NavigationService.navigate('MeasureAreaView', {
      measureType: 'arMeasureHeight',
    })
  })()
}

export default {
  close,
  memu,
  showMenuBox,
  commit,

  arMeasureArea,
  arMeasureLength,
  arMeasureHeight,
}
