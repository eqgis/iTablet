import {
  SMap,
  Action,
  SMediaCollector,
  GeometryType,
  SCollector,
  TGeometryType,
  TAction,
} from 'imobile_for_reactnative'
import { ConstToolType, ToolbarType } from '@/constants'
import { LayerUtils, StyleUtils, Toast } from '@/utils'
import { getLanguage } from '@/language'
import ToolbarModule from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'
import { AppletsToolType } from '../../constants'
import NavigationService from '@/containers/NavigationService'
import { FieldInfo, LayerInfo } from 'imobile_for_reactnative/types/interface/mapping/SMap'
import CheckData from './CheckData'
import { getImage } from '../../assets'

function startCheck() {
  try {
    const params = ToolbarModule.getParams()
    ToolbarModule.addParams({type: AppletsToolType.APPLETS_CHECK_EDIT})
    const _data = CheckData.getData(AppletsToolType.APPLETS_CHECK_EDIT)
    const containerType = ToolbarType.table
    const data = ToolbarModule.getToolbarSize(containerType, {
      data: _data.data,
    })
    params.showFullMap && params.showFullMap(true)
    params.setToolbarVisible(true, AppletsToolType.APPLETS_CHECK_EDIT, {
      containerType,
      isFullScreen: false,
      ...data,
      cb: () => SMap.setAction(Action.SELECT),
    })
    Toast.show(getLanguage(params.language).Prompt.PLEASE_SELECT_OBJECT)
  } catch (error) {
    __DEV__ && console.warn(error)
  }
}

async function commit(type: string) {
  try {
    const params: any = ToolbarModule.getParams()
    const data: any = ToolbarModule.getData()
    let currentToolbarType = ''
    if (type === AppletsToolType.APPLETS_CHECK_EDIT) {
      // 编辑完成关闭Toolbar
      params.setToolbarVisible(false, '', {
        cb: () => {
          SMap.setAction(Action.PAN)
        },
      })
    } else if (type === AppletsToolType.APPLETS_CHECK_EDIT_ADD_REGION) {
      const have = await SMap.haveCurrentGeometry()
      if(have){
        // 是否有新的采集或标注
        global.HAVEATTRIBUTE = true
      }
      const currentLayer = params.currentLayer
      SMap.setLayerEditable(currentLayer.name, true).then(() => {
        SMap.submit().then(result => {
          if (result) {
            SMap.refreshMap()
            //提交标注后 需要刷新属性表
            global.NEEDREFRESHTABLE = true
          }
        })
      })
      currentToolbarType = AppletsToolType.APPLETS_CHECK_EDIT
    } else {
      try {
        await SMap.submit().then(async result => {
          if (result) {
            await SMap.setAction(Action.SELECT)
            const fieldInfo = data.fieldInfo || []
            const layerInfo = data.layerInfo || {}
            if (layerInfo.name && await SMediaCollector.isTourLayer(layerInfo.name)) {
              // 编辑旅行轨迹对象后，更新位置
              await SMediaCollector.updateTour(params.selection[0].layerInfo.name)
            } else {
              // 编辑对象含有多媒体文件，在更新对象位置后，需要更新多媒体文件的位置
              if (data.fieldInfo) {
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
            if (global.coworkMode && global.getFriend) {
              const currentTaskInfo = params.coworkInfo?.[params.user.currentUser.userName]?.[params.currentTask.groupID]?.[params.currentTask.id]
              const isRealTime = currentTaskInfo?.isRealTime === undefined ? false : currentTaskInfo.isRealTime
              if (isRealTime) {
                const event = data.event
                //TODO 增加类型判断
                const friend = global.getFriend()
                friend.onGeometryEdit(
                  event.layerInfo,
                  event.fieldInfo,
                  event.id,
                  event.geometryType,
                )
              }
            }
            currentToolbarType = AppletsToolType.APPLETS_CHECK_EDIT
            // 编辑完成关闭Toolbar
            // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
            params.setToolbarVisible(true, AppletsToolType.APPLETS_CHECK_EDIT, {
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
  } catch (error) {
    __DEV__ && console.warn(error)
  }
}

function toolbarBack(type: string | number) {
  try {
    const params = ToolbarModule.getParams()
    let actionType: TAction = Action.PAN
    if (
      typeof type === 'string' &&
      type.indexOf(AppletsToolType.APPLETS_CHECK_EDIT) >= 0 &&
      type !== AppletsToolType.APPLETS_CHECK_EDIT
    ) {
      SMap.cancel()
      actionType = Action.SELECT
      // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
      params.setToolbarVisible(true, AppletsToolType.APPLETS_CHECK_EDIT, {
        isFullScreen: false,
      })
    }
    SMap.setAction(actionType)
  } catch (error) {
    __DEV__ && console.warn(error)
  }
}

async function close(type: string) {
  try {
    if (type === ConstToolType.SM_MAP_TOOL_ATTRIBUTE_SELECTION_RELATE) {
      const data: any = ToolbarModule.getData()
      const params = ToolbarModule.getParams()

      if (
        data.preType === AppletsToolType.APPLETS_CHECK_EDIT_POINT ||
        data.preType === AppletsToolType.APPLETS_CHECK_EDIT_LINE ||
        data.preType === AppletsToolType.APPLETS_CHECK_EDIT_REGION ||
        data.preType === AppletsToolType.APPLETS_CHECK_EDIT_ADD_REGION
      ) {
        params.showFullMap && params.showFullMap(true)
        params.setToolbarVisible &&
          params.setToolbarVisible(true, data.preType, {
            isFullScreen: false,
            containerType: ToolbarType.table,
            cb: () => {
              if (data.preType === AppletsToolType.APPLETS_CHECK_EDIT_ADD_REGION) {
                SMap.setAction(Action.CREATEPOLYGON)
                ToolbarModule.addData({MarkType:'CREATEPOLYGON'})
              } else {
                SMap.appointEditGeometry(data.event.id, data.event.layerInfo.path)
              }
            },
          })
      }

      showAttribute(data.preType)
      await SMap.clearTrackingLayer()

      return
    }
    const params = ToolbarModule.getParams()
    params.existFullMap && params.existFullMap()
    // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
    params.setToolbarVisible(false)
    ToolbarModule.setData() // 关闭Toolbar清除临时数据
    SMap.setAction(Action.PAN)
  } catch (error) {
    __DEV__ && console.warn(error)
  }
}

/** 地图点选对象回调 **/
async function geometrySelected(event: { fieldInfo: FieldInfo; layerInfo: { path: string; editable: boolean }; geometryType: TGeometryType; id: number }) {
  try {
    const params: any = ToolbarModule.getParams()
    if (event.fieldInfo) {
      ToolbarModule.addData({
        layerInfo: event.layerInfo,
        fieldInfo: event.fieldInfo,
      })
    }
    ToolbarModule.addData({
      event,
    })
    const data: any = ToolbarModule.getData()
    const currentToolbarType = data.type
    switch (currentToolbarType) {
      case AppletsToolType.APPLETS_CHECK_EDIT_POINT:
      case AppletsToolType.APPLETS_CHECK_EDIT_LINE:
      case AppletsToolType.APPLETS_CHECK_EDIT_REGION:
        break
      case AppletsToolType.APPLETS_CHECK_EDIT: {
        const containerType = ToolbarType.table
        let type = ''
        switch (event.geometryType) {
          case GeometryType.GEOPOINT:
            type = AppletsToolType.APPLETS_CHECK_EDIT_POINT
            break
          case GeometryType.GEOLINE:
            type = AppletsToolType.APPLETS_CHECK_EDIT_LINE
            break
          case GeometryType.GEOREGION:
            type = AppletsToolType.APPLETS_CHECK_EDIT_REGION
            break
          case GeometryType.GEOTEXT:
            type = AppletsToolType.APPLETS_CHECK_EDIT_TEXT
            break
          case GeometryType.GEOGRAPHICOBJECT:
            type = AppletsToolType.APPLETS_CHECK_EDIT_PLOT
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
  } catch (error) {
    __DEV__ && console.warn(error)
  }
}

function move() {
  return SMap.setAction(Action.MOVE_GEOMETRY)
}

function undo(type?: number) {
  // return SCollector.undo(type)
  return SMap.undo(type)
}

function redo(type?: number) {
  // return SCollector.redo(type)
  return SMap.redo(type)
}

// function cancel() {
//   return SMap.setAction(Action.SELECT)
// }

function remove() {
  // TODO remove
  global.removeObjectDialog && global.removeObjectDialog.setDialogVisible(true)
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
  try {
    const _params = ToolbarModule.getParams()
    const _selection = _params.selection
    if (_selection.length === 0) {
      Toast.show(getLanguage(global.language).Prompt.NON_SELECTED_OBJ)
      return
    }

    _selection.forEach(async item => {
      if (item.ids.length > 0) {
        await SCollector.removeByIds(item.ids, item.layerInfo.path)
        await SMediaCollector.removeByIds(item.ids, item.layerInfo.name)
      }
    })
    _params.setSelection()
    const type = AppletsToolType.APPLETS_CHECK_EDIT

    _params.setToolbarVisible(true, type, {
      isFullScreen: false,
      cb: () => SMap.setAction(Action.SELECT),
    })
  } catch (error) {
    __DEV__ && console.warn(error)
  }
}

// 多媒体采集
async function captureImage() {
  try {
    const _params: any = ToolbarModule.getParams()
    const currentLayer: LayerInfo = _params.currentLayer
    // let reg = /^Label_(.*)#$/
    if (currentLayer) {
      const layerType = LayerUtils.getLayerType(currentLayer)
      const isTaggingLayer = layerType === 'TAGGINGLAYER' || layerType === 'CADLAYER' || layerType === 'POINTLAYER'
      // let isTaggingLayer = currentLayer.type === DatasetType.CAD
      // && currentLayer.datasourceAlias.match(reg)
      if (isTaggingLayer) {
        // await SMap.setTaggingGrid(
        //   currentLayer.datasetName,
        //   ToolbarModule.getParams().user.currentUser.userName,
        // )
        const datasourceAlias = currentLayer.datasourceAlias // 标注数据源名称
        const datasetName = currentLayer.datasetName // 标注图层名称
        NavigationService.navigate('Camera', {
          datasourceAlias,
          datasetName,
        })
        // 用于采集后切回AI相机时Resume
        ToolbarModule.addData({ hasCaptureImage: true })
      }
    } else {
      Toast.show(
        getLanguage(ToolbarModule.getParams().language).Prompt
          .PLEASE_SELECT_PLOT_LAYER,
      )
      ToolbarModule.getParams().navigation.navigate('LayerManager')
    }
  } catch (error) {
    __DEV__ && console.warn(error)
  }
}

async function addRegion() {
  try {
    const _params: any = ToolbarModule.getParams()
    const currentLayer: LayerInfo = _params.currentLayer
    let layerType
    if (currentLayer) {
      layerType = LayerUtils.getLayerType(currentLayer)
    }
    if (
      layerType === 'TAGGINGLAYER' ||
      layerType === 'CADLAYER' ||
      layerType === 'REGIONLAYER'
    ) {
      // _params.setToolbarVisible(true, AppletsToolType.SM_MAP_MARKS_DRAW, {
      _params.setToolbarVisible(true, AppletsToolType.APPLETS_CHECK_EDIT_ADD_REGION, {
        isFullScreen: false,
        // height: ConstToolType.HEIGHT[4],
      })
      SMap.setAction(Action.CREATEPOLYGON)
      ToolbarModule.addData({MarkType:'CREATEPOLYGON'})
    } else {
      Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
    }
  } catch (error) {
    __DEV__ && console.warn(error)
  }
}

async function showAttribute(type?: string) {
  try {
    const _params: any = ToolbarModule.getParams()
    const _type = type || _params.type
    if (
      (
        _type === AppletsToolType.APPLETS_CHECK_EDIT_POINT ||
        _type === AppletsToolType.APPLETS_CHECK_EDIT_LINE ||
        _type === AppletsToolType.APPLETS_CHECK_EDIT_REGION
      ) &&
      _params.layers?.selection?.length > 0
    ) {
      NavigationService.navigate('LayerSelectionAttribute',{
        preType: _type,
        buttonNameFilter: ['LandChecked'],
        buttonTitles: [(data: any) => {
          return data?.value ? '已核查' : '核查'
        }],
        buttonActions: [(data: any) => {
          const selection = _params.layers.selection[0]
          const isCheck = !data.cellData.value // 核查后修改的值
          // 修改核查结果
          SMap.setLayerFieldInfo(
            selection.layerInfo.path,
            [{
              name: data.cellData.fieldInfo.name,
              value: isCheck,
            }],
            {
              // index: int,      // 当前对象所在记录集中的位置
              filter: `SmID=${selection.ids[0]}`, // 过滤条件
              cursorType: 2, // 2: DYNAMIC, 3: STATIC
            },
          ).then(result => {
            if (!result) return
            for (const item of selection.fieldInfo) {
              if (item.name === 'LandChecked') {
                item.value = isCheck
                break
              }
            }
            _params.setSelection([selection])
          })
        }],
        hasAddField: false,
        // customButtons: [
        //   {
        //     icon: getImage().check,
        //     key: '核查',
        //     title: '核查',
        //     action: (data) => {
        //       console.warn('核查', data)
        //     },
        //     enabled: true,
        //   },
        // ]
      })
      return
    }
    const have = await SMap.haveCurrentGeometry()
    if(have){
      Toast.show(getLanguage(global.language).Prompt.PLEASE_SUBMIT_EDIT_GEOMETRY)
    }else{
      if(global.HAVEATTRIBUTE){
        NavigationService.navigate('LayerSelectionAttribute',{
          isCollection:true,
          preType: _type,
          // buttonNameFilter: ['LandChecked'],
          // buttonTitles: ['核查'],
          // buttonActions: [(data) => {
          //   console.warn('核查', data)
          // }],
          hasAddField: false,
        })
      }
    }
    return true
  } catch (error) {
    __DEV__ && console.warn(error)
    return false
  }
}

const actions = {
  startCheck,
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

  captureImage,
  addRegion,
  showAttribute,
}
export default actions
