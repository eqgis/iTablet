import {
  SMap,
  Action,
  SMediaCollector,
  GeometryType,
} from 'imobile_for_reactnative'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { StyleUtils } from '../../../../../../utils'
import ToolbarModule from '../ToolbarModule'

async function commit(type) {
  const params = ToolbarModule.getParams()
  let currentToolbarType = ''
  if (type === ConstToolType.MAP_EDIT_DEFAULT) {
    // 编辑完成关闭Toolbar
    params.setToolbarVisible(false, '', {
      cb: () => {
        SMap.setAction(Action.PAN)
      },
    })
  }
  //   if (
  //   type !== ConstToolType.MAP_TOOL_TAGGING &&
  //   type !== ConstToolType.MAP_TOOL_TAGGING_SETTING
  // )
  else {
    try {
      await SMap.submit()
      await SMap.setAction(Action.SELECT)

      // 编辑对象含有多媒体文件，在更新对象位置后，需要更新多媒体文件的位置
      if (ToolbarModule.getData().fieldInfo) {
        const fieldInfo = ToolbarModule.getData().fieldInfo || []
        const layerInfo = ToolbarModule.getData().layerInfo || {}
        let geoID = -1
        for (let i = 0; i < fieldInfo.length; i++) {
          if (
            fieldInfo[i].name === 'MediaFilePaths' &&
            fieldInfo[i].value !== ''
          ) {
            geoID = fieldInfo[0].value
          }
        }
        layerInfo.name !== undefined &&
          geoID > -1 &&
          (await SMediaCollector.updateMedia(layerInfo.name, [geoID]))
      }
      currentToolbarType = ConstToolType.MAP_EDIT_DEFAULT
      // 编辑完成关闭Toolbar
      // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
      params.setToolbarVisible(true, ConstToolType.MAP_EDIT_DEFAULT, {
        isFullScreen: false,
        // height: 0,
      })
    } catch (e) {
      SMap.cancel()
    }
  }
  ToolbarModule.addData({
    type: currentToolbarType,
  })
}

function toolbarBack(type) {
  const params = ToolbarModule.getParams()
  let actionType = Action.PAN
  if (
    typeof type === 'string' &&
    type.indexOf('MAP_EDIT_') >= 0 &&
    type !== ConstToolType.MAP_EDIT_DEFAULT
  ) {
    SMap.cancel()
    actionType = Action.SELECT
    // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
    params.setToolbarVisible(true, ConstToolType.MAP_EDIT_DEFAULT, {
      isFullScreen: false,
      // height: 0,
    })
  }
  SMap.setAction(actionType)
}

function close() {
  const params = ToolbarModule.getParams()
  let actionType = Action.PAN
  params.existFullMap && params.existFullMap()
  // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
  params.setToolbarVisible(false)
  ToolbarModule.setData() // 关闭Toolbar清除临时数据
  SMap.setAction(actionType)
}

async function geometrySelected(event) {
  const params = ToolbarModule.getParams()
  params.setSelection &&
    params.setSelection([
      {
        layerInfo: event.layerInfo,
        ids: [event.id],
      },
    ])
  if (event.fieldInfo) {
    ToolbarModule.addData({
      layerInfo: event.layerInfo,
      fieldInfo: event.fieldInfo,
    })
  }
  const currentToolbarType = ToolbarModule.getData().type
  switch (currentToolbarType) {
    case ConstToolType.MAP_EDIT_POINT:
    case ConstToolType.MAP_EDIT_LINE:
    case ConstToolType.MAP_EDIT_REGION:
    case ConstToolType.MAP_EDIT_DEFAULT: {
      if (currentToolbarType === ConstToolType.MAP_EDIT_DEFAULT) {
        let containerType = ToolbarType.table
        let type = ''
        switch (event.geometryType) {
          case GeometryType.GEOPOINT:
            type = ConstToolType.MAP_EDIT_POINT
            break
          case GeometryType.GEOLINE:
            type = ConstToolType.MAP_EDIT_LINE
            break
          case GeometryType.GEOREGION:
            type = ConstToolType.MAP_EDIT_REGION
            break
          case GeometryType.GEOTEXT:
            type = ConstToolType.MAP_EDIT_TEXT
            break
          case GeometryType.GEOGRAPHICOBJECT:
            type = ConstToolType.MAP_EDIT_PLOT
            break
        }
        params.showFullMap && params.showFullMap(true)
        params.setToolbarVisible &&
          params.setToolbarVisible(true, type, {
            isFullScreen: false,
            containerType,
            cb: () => SMap.appointEditGeometry(event.id, event.layerInfo.path),
          })
      }
      break
    }
    default:
      // 除了编辑状态，其余点选对象所在图层全设置为选择状态
      if (event.layerInfo.editable) {
        SMap.setLayerEditable(event.layerInfo.path, false).then(() => {
          StyleUtils.setSelectionStyle(event.layerInfo.path)
        })
      } else {
        StyleUtils.setSelectionStyle(event.layerInfo.path)
      }
      break
  }
}
function move() {
  return SMap.setAction(Action.MOVE_GEOMETRY)
}

function undo(type) {
  // return SCollector.undo(type)
  return SMap.undo(type)
}

function redo(type) {
  // return SCollector.redo(type)
  return SMap.redo(type)
}

// function cancel() {
//   return SMap.setAction(Action.SELECT)
// }

function remove() {
  // TODO remove
  GLOBAL.removeObjectDialog && GLOBAL.removeObjectDialog.setDialogVisible(true)
}

function addNode() {
  return SMap.setAction(Action.VERTEXADD)
}

function editNode() {
  return SMap.setAction(Action.VERTEXEDIT)
}

function deleteNode() {
  return SMap.setAction(Action.VERTEXDELETE)
}

/** 切割面 * */
function splitRegion() {
  return SMap.setAction(Action.SPLIT_BY_LINE)
}

/** 合并面 * */
function merge() {
  return SMap.setAction(Action.UNION_REGION)
}

/** 擦除面 * */
function eraseRegion() {
  return SMap.setAction(Action.ERASE_REGION)
}

/** 手绘擦除面 * */
function drawRegionEraseRegion() {
  return SMap.setAction(Action.DRAWREGION_ERASE_REGION)
}

/** 生成岛洞 * */
// function drawHollowRegion() {
//   return SMap.setAction(Action.DRAW_HOLLOW_REGION)
// }

/** 手绘岛洞 * */
function drawRegionHollowRegion() {
  return SMap.setAction(Action.DRAWREGION_HOLLOW_REGION)
}

/** 填充岛洞 * */
function fillHollowRegion() {
  return SMap.setAction(Action.FILL_HOLLOW_REGION)
}

/** 补充岛洞 * */
function patchHollowRegion() {
  return SMap.setAction(Action.PATCH_HOLLOW_REGION)
}

const actions = {
  commit,
  close,
  toolbarBack,
  geometrySelected,

  move,
  undo,
  redo,
  remove,
  addNode,
  editNode,
  deleteNode,
  splitRegion,
  merge,
  eraseRegion,
  drawRegionEraseRegion,
  drawRegionHollowRegion,
  fillHollowRegion,
  patchHollowRegion,
}
export default actions
