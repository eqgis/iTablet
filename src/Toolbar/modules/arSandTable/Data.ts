import { getImage } from "@/assets"
import DataHandler from "@/containers/tabs/Mine/DataHandler"
import { getLanguage } from "@/language"
import { ToolbarTabItem } from "@/SMToolbar/component/ToolbarTab/ToolbarTabView"
import { IToolbarOption, SelectionListOption, ToolBarBottomItem, ToolbarOption } from "@/SMToolbar/ToolbarOption"
import { AppEvent, AppLog, AppToolBar, AppUser, Toast } from "@/utils"
import AppDialog from "@/utils/AppDialog"
import AppInputDialog from "@/utils/AppInputDialog"
import { ARAction } from "imobile_for_reactnative"
import { SARMap } from "imobile_for_reactnative"
import { ModuleList } from ".."
import { addModelToSandTable, saveARSandTable } from "./Actions"
import { ARSAndTableViewOption } from "./BottomView"


export function getData(key: ModuleList['ARSANDTABLE']): IToolbarOption {
  const option = new ToolbarOption<ARSAndTableViewOption>()
  option.showBackground = false
  option.moduleData = {
    showDelete: false,
    sandTable: 'null',
  }

  switch(key) {
    case 'AR_SAND_TABLE_CREATE':
      sandTableCreateOption(option)
      break
    case 'AR_SAND_TABLE_MODIFY':
      sandTableModifyOption(option)
      break
    case 'AR_SAND_TABLE_ADD':
      selectSandboxModel(option)
      break
    case 'AR_SAND_TABLE_ADD_MODEL':
      addSandBoxModel(option)
      break
    case 'AR_SAND_TABLE_EDIT':
      editElementOption(option)
      editSandTableBottomOption(option)
      break
    case 'AR_SAND_TABLE_EDIT_ALIGN':
      option.moduleData.sandTable = 'align'
      sandTableAlignOption(option)
      break
    case 'AR_SAND_TABLE_MODEL_LIST':
      option.moduleData.sandTable = 'modelList'
      sandTableModelListOption(option)
  }

  return option
}


/** 新建沙盘入口 */
function sandTableCreateOption(option: IToolbarOption) {
  option.pageAction = () => {
    SARMap.createARSandTable()
    SARMap.setAction(ARAction.SELECT_NODE)
  }

  option.bottomData = [
    {
      image: getImage().icon_toolbar_quit,
      onPress: () => {
        AppDialog.show({
          text: getLanguage().EXIT_SAND_TABLE_CONFIRM,
          confirm: () => {
            SARMap.closeARSandTable()
            SARMap.setAction(ARAction.NULL)
            SARMap.cancel()
            AppToolBar.goBack()
          }
        })
      }
    }, {
      image: getImage().list,
      onPress: () => {
        AppToolBar.show('ARSANDTABLE',  'AR_SAND_TABLE_MODEL_LIST')
      }
    },
    {
      image: getImage().icon_add,
      onPress: () => {
        AppToolBar.show('ARSANDTABLE', 'AR_SAND_TABLE_ADD')
      }
    },
    {
      image: getImage().setting,
      onPress: () => {
        AppToolBar.show('ARSANDTABLE',  'AR_SAND_TABLE_EDIT_ALIGN')
      }
    },
    {
      image: getImage().icon_submit,
      onPress: async () => {
        AppInputDialog.show({
          title: getLanguage().PLEASE_INPUT_MODEL_NAME,
          confirm: text => {
            SARMap.setAction(ARAction.NULL)
            saveARSandTable(text).then(result => {
              if(result) {
                AppToolBar.goBack()
                SARMap.closeARSandTable()
                Toast.show(getLanguage().EXPORT_SUCCESS)
              } else {
                Toast.show(getLanguage().SAVE_FAILED)
              }
            })
          }
        })
      }
    }
  ]
}

/** 修改沙盘入口 */
function sandTableModifyOption(option: IToolbarOption) {
  option.pageAction = () => {
    const { selectARElement } = AppToolBar.getData()
    if(selectARElement !== undefined) {
      SARMap.appointARSandTable(selectARElement.layerName, selectARElement.id)
      SARMap.setAction(ARAction.SELECT_NODE)
    } else {
      AppLog.error('未选中对象！')
    }
  }

  option.bottomData = [
    {
      image: getImage().icon_toolbar_quit,
      onPress: () => {
        AppDialog.show({
          text: getLanguage().EXIT_SAND_TABLE_CONFIRM,
          confirm: () => {
            SARMap.closeARSandTable()
            SARMap.setAction(ARAction.NULL)
            AppToolBar.goBack()
          }
        })
      }
    }, {
      image: getImage().list,
      onPress: () => {
        AppToolBar.show('ARSANDTABLE',  'AR_SAND_TABLE_MODEL_LIST')
      }
    },
    {
      image: getImage().icon_add,
      onPress: () => {
        AppToolBar.show('ARSANDTABLE', 'AR_SAND_TABLE_ADD')
      }
    },
    {
      image: getImage().setting,
      onPress: () => {
        AppToolBar.show('ARSANDTABLE',  'AR_SAND_TABLE_EDIT_ALIGN')
      }
    },
    {
      image: getImage().icon_submit,
      onPress: async () => {
        SARMap.setAction(ARAction.NULL)
        SARMap.saveARSandTable().then(result => {
          if(result) {
            AppToolBar.goBack()
            SARMap.closeARSandTable()
          } else {
            Toast.show(getLanguage().SAVE_FAILED)
          }
        })
      }
    }
  ]
}

function selectSandboxModel(option: IToolbarOption) {

  (option.selectionListData as SelectionListOption<string>) = {
    data: [],
    mode: 'multiple',
    onCencel: AppToolBar.goBack,
    onSelect: items => {
      if(items.length < 1) {
        Toast.show(getLanguage().PLEASE_SELECT_MODEL)
        return
      }
      AppToolBar.addData({sandTableModels: items})
      AppToolBar.show('ARSANDTABLE', 'AR_SAND_TABLE_ADD_MODEL')
    },
    getExtraData: async () => {
      const data = await DataHandler.getLocalData(AppUser.getCurrentUser(), 'ARMODEL')
      const items: SelectionListOption<string>['data'] = []

      return items.concat(data.map(item => {
        return {
          image: getImage().my_dynamic_model,
          lable: item.name.substring(0, item.name.lastIndexOf('.')),
          value: item.path,
        }
      })
      )
    }
  }

}

function addSandBoxModel(option:IToolbarOption) {

  option.pageAction = () => {
    AppEvent.emitEvent('ar_sandtable_add')
    AppEvent.addListener('ar_sandtable_on_add', () => {
      const isAdding = AppToolBar.getData().isAddingARElement
      if(isAdding) return
      AppToolBar.addData({isAddingARElement: true})
      addModelToSandTable().then(() => {
        AppToolBar.addData({isAddingARElement: false})
      }).catch(() => {
        AppToolBar.addData({ isAddingARElement: false})
      })
    })
  }

  option.bottomData = [{
    image: getImage().back,
    onPress: () => {
      AppToolBar.goBack()
      SARMap.cancelSandTableChanges()
      AppEvent.emitEvent('ar_sandtable_add_end')
    }
  },
  {
    image: getImage().icon_submit,
    onPress: () => {
      AppToolBar.remove(-1)
      AppToolBar.goBack()
      SARMap.commitSandTableChanges()
      AppEvent.emitEvent('ar_sandtable_add_end')
    }
  }
  ]
}

function editSandTableBottomOption(option: ToolbarOption<ARSAndTableViewOption>) {
  const data: ToolBarBottomItem[] = [
    {
      image: getImage().icon_toolbar_quit,
      ability: 'back',
      onPress: async() => {
        SARMap.cancelSandTableChanges()
        AppToolBar.goBack()
      }
    },
    {
      image: getImage().icon_submit,
      onPress: () => {
        SARMap.commitSandTableChanges()
        AppToolBar.goBack()
      }
    },
  ]

  option.bottomData = data
}

function _editSandTableBottomNoTouchOption(option: ToolbarOption<ARSAndTableViewOption>) {

  option.pageAction = () => {
    SARMap.setAction(ARAction.NULL)
  }

  editSandTableBottomOption(option)
}

function sandTableModelListOption(option: ToolbarOption<ARSAndTableViewOption>) {
  _editSandTableBottomNoTouchOption(option)
}

function sandTableAlignOption(option: ToolbarOption<ARSAndTableViewOption>) {
  _editSandTableBottomNoTouchOption(option)
}

/** POI/模型位置变换 */
function editElementOption(option: ToolbarOption<ARSAndTableViewOption>) {
  const element = AppToolBar.getData().selectARElement
  if(!element)  {
    AppLog.error('未选中对象！')
    return
  }

  if(option.moduleData) {
    option.moduleData.showDelete = true
  }

  option.pageAction = () => {
    AppToolBar.addData({
      transformInfo: {
        layerName: element.layerName,
        id: element.id,
        touchType: element.touchType,
        type: 'position',
        positionX: 0,
        positionY: 0,
        positionZ: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        scale: 0
      }
    })
  }

  SARMap.appointEditElement(element.id, element.layerName)

  option.bottomData = getPoiEditBottom()
  option.menuData.data = _getTransformTabData()
}

/** poi对象编辑时底栏 */
function getPoiEditBottom(): ToolBarBottomItem[] {
  const data = [
    {
      image: getImage().icon_toolbar_quit,
      onPress: async() => {
        AppToolBar.goBack()
        SARMap.cancel()
      }
    },
    {
      image: getImage().icon_submit,
      onPress: () => {
        AppToolBar.resetTabData()
        SARMap.submit().then(() => {
          SARMap.setAction(ARAction.NULL)
          SARMap.clearSelection()
          AppToolBar.goBack()
        }
        )}
    },
  ]

  return data
}

/** 位置调整通用模版 POI/模型/三维场景/三维图层 */
function _getTransformTabData(): ToolbarTabItem[] {
  const range: {
    scale: [number , number],
    position: [number, number],
    rotation: [number, number],
  } = {
    scale: [0 , 200],
    position: [-20, 20],
    rotation: [-180, 180],
  }

  const defaultValue = {
    scale: [100],
    position: [0],
    rotation: [0],
  }

  SARMap.setAction(ARAction.MOVE)

  const apply = () => {
    const transformData = AppToolBar.getData().transformInfo
    const editItem = AppToolBar.getData().selectARElement
    if(!transformData || !editItem) return
    SARMap.setARElementTransform(transformData)
    SARMap.commitSandTableChanges().then(() => {
      AppToolBar.resetTabData()
      AppToolBar.addData({
        transformInfo: {
          layerName: editItem.layerName,
          id: editItem.id,
          touchType: editItem.touchType,
          type: 'position',
          positionX: 0,
          positionY: 0,
          positionZ: 0,
          rotationX: 0,
          rotationY: 0,
          rotationZ: 0,
          scale: 0
        }
      })
      SARMap.appointEditElement(editItem.id, editItem.layerName)

    })
  }

  return[
    {
      title: getLanguage().ARMap.TRANSLATION,
      onPress: () => {
        SARMap.setAction(ARAction.MOVE)
      },
      type: 'slide',
      apply: apply,
      slideData: [
        {
          type: 'single',
          left: {type: 'text', text: getLanguage().WEST},
          right: {type: 'text', text: getLanguage().EAST},
          onMove: (loc) => {
            loc = loc / 25
            let transformData = AppToolBar.getData().transformInfo
            if(!transformData) return
            transformData = {
              ...transformData,
              positionX: loc,
              type: 'position'
            }
            AppToolBar.addData({transformInfo: {...transformData}})
            SARMap.setARElementTransform(transformData)
          },
          defaultValue: defaultValue.position[0],
          range: range.position,
        },
        {
          type: 'single',
          left: {type: 'text', text: getLanguage().DOWN},
          right: {type: 'text', text: getLanguage().UP},
          onMove: (loc) => {
            loc = loc / 25
            let transformData = AppToolBar.getData().transformInfo
            if(!transformData) return
            transformData = {
              ...transformData,
              positionY: loc,
              type: 'position'
            }
            AppToolBar.addData({transformInfo: {...transformData}})
            SARMap.setARElementTransform(transformData)
          },
          defaultValue: defaultValue.position[0],
          range: range.position,
        },
        {
          type: 'single',
          left: {type: 'text', text: getLanguage().SOUTH},
          right: {type: 'text', text: getLanguage().NORTH},
          onMove: (loc) => {
            loc = loc / 25
            let transformData = AppToolBar.getData().transformInfo
            if(!transformData) return
            transformData = {
              ...transformData,
              positionZ: loc,
              type: 'position'
            }
            AppToolBar.addData({transformInfo: {...transformData}})
            SARMap.setARElementTransform(transformData)
          },
          defaultValue: defaultValue.position[0],
          range: range.position,
        }
      ]
    },
    {
      title: getLanguage().ARMap.ROTATION,
      onPress: () => {
        SARMap.setAction(ARAction.ROTATE)
      },
      type: 'slide',
      apply: apply,
      slideData: [
        {
          type: 'single',
          left: {type: 'text', text: 'x'},
          right: {type: 'indicator', unit: '°'},
          onMove: (loc) => {
            let transformData = AppToolBar.getData().transformInfo
            if(!transformData) return
            transformData = {
              ...transformData,
              rotationX: loc,
              type: 'rotation'
            }
            AppToolBar.addData({transformInfo: {...transformData}})
            SARMap.setARElementTransform(transformData)
          },
          defaultValue: defaultValue.rotation[0],
          range: range.rotation,
        },
        {
          type: 'single',
          left: {type: 'text', text: 'y'},
          right: {type: 'indicator', unit: '°'},
          onMove: (loc) => {
            let transformData = AppToolBar.getData().transformInfo
            if(!transformData) return
            transformData = {
              ...transformData,
              rotationY: loc,
              type: 'rotation'
            }
            AppToolBar.addData({transformInfo: {...transformData}})
            SARMap.setARElementTransform(transformData)
          },
          defaultValue: defaultValue.rotation[0],
          range: range.rotation,
        },
        {
          type: 'single',
          left: {type: 'text', text: 'z'},
          right: {type: 'indicator', unit: '°'},
          onMove: (loc) => {
            let transformData = AppToolBar.getData().transformInfo
            if(!transformData) return
            transformData = {
              ...transformData,
              rotationZ: loc,
              type: 'rotation'
            }
            AppToolBar.addData({transformInfo: {...transformData}})
            SARMap.setARElementTransform(transformData)
          },
          defaultValue: defaultValue.rotation[0],
          range: range.rotation,
        },
      ]
    },
    {
      title: getLanguage().ARMap.SCALE,
      onPress: () => {
        SARMap.setAction(ARAction.SCALE)
      },
      type: 'slide',
      apply: apply,
      slideData: [{
        type: 'single',
        left: {type: 'image', image: getImage().ar_scale},
        right: {type: 'indicator', unit: '%'},
        onMove: (loc) => {
          let transformData = AppToolBar.getData().transformInfo
          if(!transformData) return
          const ratio = loc / 100 - 1
          transformData = {
            ...transformData,
            scale: ratio,
            type: 'scale'
          }
          AppToolBar.addData({transformInfo: {...transformData}})
          SARMap.setARElementTransform(transformData)
        },
        defaultValue: defaultValue.scale[0],
        range: range.scale,
      }]
    }
  ]
}