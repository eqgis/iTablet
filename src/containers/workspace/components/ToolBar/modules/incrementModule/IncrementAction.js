/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import { constants } from '../../../index'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType } from '../../../../../../constants'

function start() {}
function stop() {}

function addPoint() {}

function cancel() {}

/**
 * 提交
 */
function submit() {
  const _params = ToolbarModule.getParams()
  let type = ConstToolType.MAP_INCREMENT_EDIT
  _params.setToolbarVisible &&
    _params.setToolbarVisible(true, type, {
      isFullScreen: false,
    })
}
/**
 * 切换采集方式
 */
function changeMethod() {
  const _params = ToolbarModule.getParams()
  let type =
    _params.type === ConstToolType.MAP_INCREMENT_CHANGE_METHOD
      ? ConstToolType.MAP_INCREMENT_OUTTER
      : ConstToolType.MAP_INCREMENT_CHANGE_METHOD
  _params.setToolbarVisible &&
    _params.setToolbarVisible(true, type, {
      isFullScreen: false,
    })
}

function changeNetwork() {}

/**
 * 选择采集方式
 * @param method
 */
function methodSelected(method) {
  switch (method) {
    case constants.MAP_INCREMENT_GPS_POINT:
    case constants.MAP_INCREMENT_GPS_TRACK:
    case constants.MAP_INCREMENT_POINTLINE:
    case constants.MAP_INCREMENT_FREELINE:
      break
  }
  this.changeMethod()
}

function addNode() {}

function editNode() {}

function deleteNode() {}

function deleteObject() {}

function addAttribute() {}
export default {
  start,
  stop,
  addPoint,
  cancel,
  submit,
  changeMethod,
  changeNetwork,
  methodSelected,
  addNode,
  editNode,
  deleteNode,
  deleteObject,
  addAttribute,
}
