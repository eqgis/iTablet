import * as React from 'react'
import { Platform } from 'react-native'
import { SMeasureView } from 'imobile_for_reactnative'
import NavigationService from '../../../../../NavigationService'
import ARMeasureData from './ARMeasureData'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import ToolbarModule from '../ToolbarModule'

function close() {}

function memu() {}

function showMenuBox() {}

function commit() {}

// AR测量面积
function arMeasureArea() {
  (async function() {
    // const isSupportedARCore = await SMeasureView.isSupportedARCore()
    // if (!isSupportedARCore) {
    //   GLOBAL.ARDeviceListDialog.setVisible(true)
    //   return
    // }

    // GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    // if (GLOBAL.showAIDetect) {
    //   GLOBAL.arSwitchToMap = true
    //   ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    // }
    const _data = ARMeasureData.getMeasureAreaData()
    const containerType = ToolbarType.arMeasure
    const data = ToolbarModule.getToolbarSize(containerType, {
      data: _data.data,
    })
    GLOBAL.ToolBar.setVisible(true,'SM_MAP_AR_MEASURE_SECOND',{
      containerType,
      data:_data.data,
      ...data,
    })
    // NavigationService.navigate('MeasureAreaView', {
    //   measureType: 'measureArea',
    // })
  })()
}

//AR测量面积 多边形
function arMeasurePolygon() {
  (async function() {
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      GLOBAL.ARDeviceListDialog.setVisible(true)
      return
    }

    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    if (GLOBAL.showAIDetect) {
      GLOBAL.arSwitchToMap = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }

    NavigationService.navigate('MeasureAreaView', {
      measureType: 'measureArea',
    })
  })()
}

//AR测量面积 矩形
function arMeasureRectanglet() {
  (async function() {
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      GLOBAL.ARDeviceListDialog.setVisible(true)
      return
    }

    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    if (GLOBAL.showAIDetect) {
      GLOBAL.arSwitchToMap = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }

    NavigationService.navigate('MeasureAreaView', {
      measureType: 'arMeasureRectangle',
    })
  })()
}

//AR测量面积 圆
function arMeasureCircular() {
  (async function() {
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      GLOBAL.ARDeviceListDialog.setVisible(true)
      return
    }

    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    if (GLOBAL.showAIDetect) {
      GLOBAL.arSwitchToMap = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }

    NavigationService.navigate('MeasureAreaView', {
      measureType: 'arMeasureCircle',
    })
  })()
}


// AR测量距离
function arMeasureLength() {
  (async function() {
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      GLOBAL.ARDeviceListDialog.setVisible(true)
      return
    }

    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    if (GLOBAL.showAIDetect) {
      GLOBAL.arSwitchToMap = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }
    NavigationService.navigate('MeasureAreaView', {
      measureType: 'measureLength',
    })
  })()
}


// AR测量角度
function arMeasureAngle() {
  (async function() {
    if (Platform.OS === 'android') {
      return
    }
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      GLOBAL.ARDeviceListDialog.setVisible(true)
      return
    }

    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    if (GLOBAL.showAIDetect) {
      GLOBAL.arSwitchToMap = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }
    NavigationService.navigate('MeasureAreaView', {
      measureType: 'measureAngle',
    })
  })()
}

// AR测量距离
function arMeasureHeight() {
  (async function() {
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      GLOBAL.ARDeviceListDialog.setVisible(true)
      return
    }

    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    if (GLOBAL.showAIDetect) {
      GLOBAL.arSwitchToMap = true
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
  arMeasureAngle,

  arMeasurePolygon,
  arMeasureRectanglet,
  arMeasureCircular,
}
