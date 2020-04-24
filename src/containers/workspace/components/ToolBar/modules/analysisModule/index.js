/**
 * 分析
 */
// import React from 'react'
import AnalysisData from './AnalysisData'
import AnalysisAction from './AnalysisAction'
import ToolbarModule from '../ToolbarModule'
import { getThemeAssets } from '../../../../../../assets'
import { ToolbarType } from '../../../../../../constants'
// import { ToolbarType ,ConstToolType} from '../../../../../../constants'
import ToolBarHeight from '../ToolBarHeight'
// import AnalysisMenuListView from './customView/AnalysisMenuListView'

export async function action(type) {
  // if(type === 'MAP_ANALYSIS'){
  //   const params = ToolbarModule.getParams()
  //   params.showFullMap && params.showFullMap(true)
  //   params.setToolbarVisible(
  //     true,
  //     type,
  //     {
  //       isFullScreen: true,
  //       height: ConstToolType.TOOLBAR_HEIGHT[5],
  //       customView: () => (
  //         <AnalysisMenuListView
  //           device={params.device}
  //           showToolbar={params.setToolbarVisible}
  //         />
  //       ),
  //     },
  //   )
  //   return
  // }
  const params = ToolbarModule.getParams()
  const _data = AnalysisData.getData(type)
  const containerType = ToolbarType.table
  const data = ToolBarHeight.getToolbarSize(containerType, { data: _data.data })
  setModuleData(type)
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, type, {
    containerType,
    isFullScreen: true,
    ...data,
    data: _data.data,
    buttons: _data.buttons,
  })
}

function setModuleData(type) {
  ToolbarModule.setData({
    type,
    getData: AnalysisData.getData,
    // data: _data,
    actions: AnalysisAction,
  })
}

export default function(type, title, customAction) {
  return {
    key: title,
    title,
    action: () => {
      if (customAction === false) {
        return
      } else if (typeof customAction === 'function') {
        customAction(type)
      } else {
        action(type)
      }
    },
    size: 'large',
    image: getThemeAssets().functionBar.rightbar_analysis,
    getData: AnalysisData.getData,
    setModuleData,
  }
}
