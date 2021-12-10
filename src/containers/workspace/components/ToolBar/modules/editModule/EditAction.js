import {
  SMap,
  Action,
  SMediaCollector,
  GeometryType,
  SCollector,
} from 'imobile_for_reactnative'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { StyleUtils, Toast } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import ToolbarModule from '../ToolbarModule'

async function commit(type) {
  const params = ToolbarModule.getParams()
  let currentToolbarType = ''
  if (type === ConstToolType.SM_MAP_EDIT) {
    // 编辑完成关闭Toolbar
    params.setToolbarVisible(false, '', {
      cb: () => {
        SMap.setAction(Action.PAN)
      },
    })
  } else {
    try {
      await SMap.submit().then(async result => {
        if (result) {
          await SMap.setAction(Action.SELECT)
          const fieldInfo = ToolbarModule.getData().fieldInfo || []
          const layerInfo = ToolbarModule.getData().layerInfo || {}
          if (layerInfo.name && await SMediaCollector.isTourLayer(layerInfo.name)) {
            // 编辑旅行轨迹对象后，更新位置
            await SMediaCollector.updateTour(params.selection[0].layerInfo.name)
          } else {
            // 编辑对象含有多媒体文件，在更新对象位置后，需要更新多媒体文件的位置
            if (ToolbarModule.getData().fieldInfo) {
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
          }
          //协作时同步编辑对象
          if (GLOBAL.coworkMode && GLOBAL.getFriend) {
            let event = ToolbarModule.getData().event
            //TODO 增加类型判断
            let friend = GLOBAL.getFriend()
            friend.onGeometryEdit(
              event.layerInfo,
              event.fieldInfo,
              event.id,
              event.geometryType,
            )
          }
          currentToolbarType = ConstToolType.SM_MAP_EDIT
          // 编辑完成关闭Toolbar
          // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
          params.setToolbarVisible(true, ConstToolType.SM_MAP_EDIT, {
            isFullScreen: false,
            // height: 0,
          })
        }
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
    type !== ConstToolType.SM_MAP_EDIT
  ) {
    SMap.cancel()
    actionType = Action.SELECT
    // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
    params.setToolbarVisible(true, ConstToolType.SM_MAP_EDIT, {
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

/** 地图点选对象回调 **/
async function geometrySelected(event) {
  const params = ToolbarModule.getParams()
  if (event.fieldInfo) {
    ToolbarModule.addData({
      layerInfo: event.layerInfo,
      fieldInfo: event.fieldInfo,
    })
  }
  ToolbarModule.addData({
    event,
  })
  const currentToolbarType = ToolbarModule.getData().type
  switch (currentToolbarType) {
    case ConstToolType.SM_MAP_EDIT_POINT:
    case ConstToolType.SM_MAP_EDIT_LINE:
    case ConstToolType.SM_MAP_EDIT_REGION:
      break
    case ConstToolType.SM_MAP_EDIT: {
      let containerType = ToolbarType.table
      let type = ''
      switch (event.geometryType) {
        case GeometryType.GEOPOINT:
          type = ConstToolType.SM_MAP_EDIT_POINT
          break
        case GeometryType.GEOLINE:
          type = ConstToolType.SM_MAP_EDIT_LINE
          break
        case GeometryType.GEOREGION:
          type = ConstToolType.SM_MAP_EDIT_REGION
          break
        case GeometryType.GEOTEXT:
          type = ConstToolType.SM_MAP_EDIT_TEXT
          break
        case GeometryType.GEOGRAPHICOBJECT:
          type = ConstToolType.SM_MAP_EDIT_PLOT
          break
      }
      params.showFullMap && params.showFullMap(true)
      params.setToolbarVisible &&
        params.setToolbarVisible(true, type, {
          isFullScreen: false,
          containerType,
          cb: () => SMap.appointEditGeometry(event.id, event.layerInfo.path),
        })
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

/** 添加点 * */
function addNode() {
  return SMap.setAction(Action.VERTEXADD)
}

/** 编辑点 * */
function editNode() {
  return SMap.setAction(Action.VERTEXEDIT)
}

/** 删除点 * */
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

/** 删除标注层中文字 **/
async function deleteLabel() {
  const _params = ToolbarModule.getParams()
  const _selection = _params.selection
  if (_selection.length === 0) {
    Toast.show(getLanguage(GLOBAL.language).Prompt.NON_SELECTED_OBJ)
    return
  }
  
  _selection.forEach(async item => {
    if (item.ids.length > 0) {
      await SCollector.removeByIds(item.ids, item.layerInfo.path)
      await SMediaCollector.removeByIds(item.ids, item.layerInfo.name)
    }
  })
  _params.setSelection()
  const type = ConstToolType.SM_MAP_EDIT
  
  _params.setToolbarVisible(true, type, {
    isFullScreen: false,
    cb: () => SMap.setAction(Action.SELECT),
  })
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
  deleteLabel,
}
export default actions
