/**
 * 分析工具
 */
import React from 'react'
import ToolbarModule from '../ToolbarModule'
import AnalysisMenuListView from './customView/AnalysisMenuListView'

function getData() {
  let buttons
  let customView
  let data
  
  const params = ToolbarModule.getParams()
  const userName = params.user.currentUser.userName || 'Customer'
  let _customView = () => (
    <AnalysisMenuListView
      userName={userName}
      device={params.device}
      showToolbar={params.setToolbarVisible}
    />
  )
  data = undefined
  buttons = undefined
  customView = _customView
  
  return { data, buttons, customView }
}

export default {
  getData,
}
