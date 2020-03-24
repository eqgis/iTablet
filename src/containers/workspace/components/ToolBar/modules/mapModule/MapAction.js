import { ConstToolType } from '../../../../../../constants'
// import Utils from '../../utils'
import ToolbarModule from '../ToolbarModule'
import { SMap, Action } from 'imobile_for_reactnative'
import NavigationService from '../../../../../NavigationService'

async function close(type) {
  const _params = ToolbarModule.getParams()
  if (type === ConstToolType.MAP_TOOL_ATTRIBUTE_RELATE) {
    // 返回图层属性界面，并清除属性关联选中的对象
    NavigationService.navigate('LayerAttribute')
    await SMap.clearTrackingLayer()
    _params.currentLayer &&
    SMap.selectObj(_params.currentLayer.path)
    _params.setToolbarVisible(false)
  } else if (type === ConstToolType.MAP_TOOL_ATTRIBUTE_SELECTION_RELATE) {
    // 返回框选/点选属性界面，并清除属性关联选中的对象
    NavigationService.navigate('LayerSelectionAttribute', {
      selectionAttribute: GLOBAL.SelectedSelectionAttribute,
      preAction: async () => {
        let selection = []
        for (let i = 0; i < _params.selection.length; i++) {
          selection.push({
            layerPath: _params.selection[i].layerInfo.path,
            ids: _params.selection[i].ids,
          })
        }
        await SMap.clearTrackingLayer()
        await SMap.selectObjs(selection)
        _params.setToolbarVisible(false)
      },
    })
    // NavigationService.goBack()
  }
  SMap.setAction(Action.PAN)
}

export default {
  close,
}