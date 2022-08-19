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
    //   global.ARDeviceListDialog.setVisible(true)
    //   return
    // }

    // global.toolBox && global.toolBox.removeAIDetect(true)
    // if (global.showAIDetect) {
    //   global.arSwitchToMap = true
    //   ;(await global.toolBox) && global.toolBox.switchAr()
    // }
    const _data = ARMeasureData.getMeasureAreaData()
    const containerType = ToolbarType.arMeasure
    const data = ToolbarModule.getToolbarSize(containerType, {
      data: _data.data,
    })
    global.ToolBar.setVisible(true,'SM_MAP_AR_MEASURE_SECOND',{
      containerType,
      data:_data.data,
      secdata:_data.measureAreadata,
      ...data,
    })
    // NavigationService.navigate('MeasureAreaView', {
    //   measureType: 'measureArea',
    // })
  })()
}

// AR测量体积
function arMeasureVolume() {
  (async function() {
    // const isSupportedARCore = await SMeasureView.isSupportedARCore()
    // if (!isSupportedARCore) {
    //   global.ARDeviceListDialog.setVisible(true)
    //   return
    // }

    // global.toolBox && global.toolBox.removeAIDetect(true)
    // if (global.showAIDetect) {
    //   global.arSwitchToMap = true
    //   ;(await global.toolBox) && global.toolBox.switchAr()
    // }
    const _data = ARMeasureData.getMeasureAreaData()
    const containerType = ToolbarType.arMeasure
    const data = ToolbarModule.getToolbarSize(containerType, {
      data: _data.data1,
    })
    global.ToolBar.setVisible(true,'SM_MAP_AR_MEASURE_SECOND',{
      containerType,
      data:_data.data1,
      secdata:_data.measureAreadata1,
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
    if (isSupportedARCore != 1) {
      global.ARServiceAction = isSupportedARCore
      global.ARDeviceListDialog.setVisible(true)
      return
    }

    // global.toolBox && global.toolBox.removeAIDetect(true)
    // if (global.showAIDetect) {
    //   global.arSwitchToMap = true
    //   ;(await global.toolBox) && global.toolBox.switchAr()
    // }

    // NavigationService.navigate('MeasureAreaView', {
    //   measureType: 'measureArea',
    // })
    global.toolBox && global.toolBox.setVisible(false,undefined,{isExistFullMap:false,measureType:'measureArea'})
  })()
}

//AR测量面积 矩形
function arMeasureRectanglet() {
  (async function() {
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (isSupportedARCore != 1) {
      global.ARServiceAction = isSupportedARCore
      global.ARDeviceListDialog.setVisible(true)
      return
    }

    // global.toolBox && global.toolBox.removeAIDetect(true)
    // if (global.showAIDetect) {
    //   global.arSwitchToMap = true
    //   ;(await global.toolBox) && global.toolBox.switchAr()
    // }

    // NavigationService.navigate('MeasureAreaView', {
    //   measureType: 'arMeasureRectangle',
    // })

    global.toolBox && global.toolBox.setVisible(false,undefined,{isExistFullMap:false,measureType:'arMeasureRectangle'})
  })()
}

//AR测量面积 圆
function arMeasureCircular() {
  (async function() {
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (isSupportedARCore != 1) {
      global.ARServiceAction = isSupportedARCore
      global.ARDeviceListDialog.setVisible(true)
      return
    }

    // global.toolBox && global.toolBox.removeAIDetect(true)
    // if (global.showAIDetect) {
    //   global.arSwitchToMap = true
    //   ;(await global.toolBox) && global.toolBox.switchAr()
    // }

    // NavigationService.navigate('MeasureAreaView', {
    //   measureType: 'arMeasureCircle',
    // })
    global.toolBox && global.toolBox.setVisible(false,undefined,{isExistFullMap:false,measureType:'arMeasureCircle'})
  })()
}

//AR体积 长方体
function arMeasureCuboid() {
  (async function() {
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (isSupportedARCore != 1) {
      global.ARServiceAction = isSupportedARCore
      global.ARDeviceListDialog.setVisible(true)
      return
    }

    // global.toolBox && global.toolBox.removeAIDetect(true)
    // if (global.showAIDetect) {
    //   global.arSwitchToMap = true
    //   ;(await global.toolBox) && global.toolBox.switchAr()
    // }

    // NavigationService.navigate('MeasureAreaView', {
    //   measureType: 'arMeasureCuboid',
    // })
    global.toolBox && global.toolBox.setVisible(false,undefined,{isExistFullMap:false,measureType:'arMeasureCuboid'})
  })()
}


//AR体积 圆柱体
function arMeasureCylinder() {
  (async function() {
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (isSupportedARCore != 1) {
      global.ARServiceAction = isSupportedARCore
      global.ARDeviceListDialog.setVisible(true)
      return
    }

    // global.toolBox && global.toolBox.removeAIDetect(true)
    // if (global.showAIDetect) {
    //   global.arSwitchToMap = true
    //   ;(await global.toolBox) && global.toolBox.switchAr()
    // }

    // NavigationService.navigate('MeasureAreaView', {
    //   measureType: 'arMeasureCylinder',
    // })
    global.toolBox && global.toolBox.setVisible(false,undefined,{isExistFullMap:false,measureType:'arMeasureCylinder'})
  })()
}

// AR测量距离
function arMeasureLength() {
  (async function() {
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (isSupportedARCore != 1) {
      global.ARServiceAction = isSupportedARCore
      global.ARDeviceListDialog.setVisible(true)
      return
    }

    // global.toolBox && global.toolBox.removeAIDetect(true)
    // if (global.showAIDetect) {
    //   global.arSwitchToMap = true
    //   ;(await global.toolBox) && global.toolBox.switchAr()
    // }
    // NavigationService.navigate('MeasureAreaView', {
    //   measureType: 'measureLength',
    // })
    global.toolBox && global.toolBox.setVisible(false,undefined,{isExistFullMap:false,measureType:'measureLength'})
  })()
}


// AR测量角度
function arMeasureAngle() {
  (async function() {
    // if (Platform.OS === 'android') {
    //   return
    // }
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (isSupportedARCore != 1) {
      global.ARServiceAction = isSupportedARCore
      global.ARDeviceListDialog.setVisible(true)
      return
    }

    // global.toolBox && global.toolBox.removeAIDetect(true)
    // if (global.showAIDetect) {
    //   global.arSwitchToMap = true
    //   ;(await global.toolBox) && global.toolBox.switchAr()
    // }
    // NavigationService.navigate('MeasureAreaView', {
    //   measureType: 'measureAngle',
    // })

    global.toolBox && global.toolBox.setVisible(false,undefined,{isExistFullMap:false,measureType:'measureAngle'})
  })()
}

// AR测量距离
function arMeasureHeight() {
  (async function() {
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (isSupportedARCore != 1) {
      global.ARServiceAction = isSupportedARCore
      global.ARDeviceListDialog.setVisible(true)
      return
    }

    // global.toolBox && global.toolBox.removeAIDetect(true)
    // if (global.showAIDetect) {
    //   global.arSwitchToMap = true
    //   ;(await global.toolBox) && global.toolBox.switchAr()
    // }
    // NavigationService.navigate('MeasureAreaView', {
    //   measureType: 'arMeasureHeight',
    // })
    global.toolBox && global.toolBox.setVisible(false,undefined,{isExistFullMap:false,measureType:'arMeasureHeight'})
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
  arMeasureVolume,
  arMeasureCuboid,
  arMeasureCylinder,
}
