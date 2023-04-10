/** 路网采集、编辑模块 todo 需要合并室内增量路网
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import IncrementData from './IncrementData'
import IncrementAction from './IncrementAction'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import FunctionModule from '../../../../../../class/FunctionModule'
import { ConstToolType ,ToolbarType,TouchType,ConstPath} from '../../../../../../constants'
import ToolbarModule from '../../../../components/ToolBar/modules/ToolbarModule'
import {
  StyleUtils,
} from '../../../../../../utils'
import { SNavigationInner } from 'imobile_for_reactnative/NativeModule/interfaces/navigation/SNavigationInner'
import { EngineType,FieldType,DatasetType } from 'imobile_for_reactnative/NativeModule/interfaces/data/SData'
import { SCollector, SData,  GeoStyle,SMap} from 'imobile_for_reactnative'

class IncrementModule extends FunctionModule {
  constructor(props) {
    super(props)
    this.getMenuData = IncrementAction.getMenuData
  }

  action = async() => {
    const params = ToolbarModule.getParams()
    const containerType = ToolbarType.table
    const _data = await IncrementData.getData(ConstToolType.SM_MAP_INCREMENT_GPS_TRACK)
    const data = ToolbarModule.getToolbarSize(containerType, {
      data: _data.data,
    })
    global.toolBox.showFullMap(true)

    const availableName = "default_increment_datasource@" + params.user.currentUser.userName
    const datasetName = "default_increment_line"
    const new_path = global.homePath +
    ConstPath.UserPath +
    params.user.currentUser.userName +
    '/' +
    ConstPath.RelativePath.Temp+
    availableName+".udb"

    const new_datasource = await SData.createDatasource({alias:availableName,server:new_path,engineType:EngineType.UDB})
    const datasets = await SData.getDatasetsByDatasource({alias:availableName})
    let returnData
    if(datasets.length === 0){
      const fieldInfo = []
      fieldInfo.push({
        caption:"RoadName",
        name:"RoadName",
        type:FieldType.CHAR,
        zeroLengthAllowed:true,
      })
      fieldInfo.push({
        caption:"Direction",
        name:"Direction",
        type:FieldType.BYTE,
        defaultValue:"1",
      })
      await SData.createDatasetWithParams({
        datasourceName:new_datasource,
        datasetName:datasetName,
        datasetType:DatasetType.LINE},fieldInfo)

      const xml = await SData.prjCoordSysToXml({type:1})//经纬度坐标
      await SData.setDatasetPrjCoordSys({ datasourceName: new_datasource, datasetName: datasetName }, xml)
      const layer = await SMap.addLayer({ datasource: new_datasource, dataset: datasetName },true)
      let geoStyle = null
      geoStyle = new GeoStyle()
      geoStyle.setLineWidth(1)
      geoStyle.setLineColor(240, 0, 0)
      await SCollector.setDataset({datasourceName: new_datasource,datasetName:datasetName},geoStyle)
      returnData = {layerName:layer.name,datasourceName: new_datasource,datasetName:datasetName}
    }else{
      const dataset = datasets[datasets.length-1]
      let geoStyle = null
      geoStyle = new GeoStyle()
      geoStyle.setLineWidth(1)
      geoStyle.setLineColor(240, 0, 0)
      const layer = await SMap.addLayer({ datasource: new_datasource, dataset: dataset.datasetName },true)
      await SCollector.setDataset({datasourceName: new_datasource,datasetName:dataset.datasetName},geoStyle)
      returnData = {layerName:layer.name,datasourceName: new_datasource,datasetName:dataset.datasetName}
    }

    // SNavigationInner.createDefaultDataset().then(async returnData => {
    if (returnData && returnData.datasetName) {
      params.setToolbarVisible(true, ConstToolType.SM_MAP_INCREMENT_CHANGE_METHOD, {
        containerType,
        isFullScreen: false,
        resetToolModuleData: true,
        // height:data.height,
        // column:data.column,
        ...data,
      })
      global.INCREMENT_DATA = returnData
    }
    // })
    //设置所有图层不可选 完成拓扑编辑或者退出增量需要设置回去
    global.TouchType = TouchType.NULL
    global.IncrementRoadDialog.setVisible(false)
    global.NAVMETHOD = ConstToolType.SM_MAP_INCREMENT_GPS_TRACK
    // global.IncrementRoadDialog && global.IncrementRoadDialog.setVisible(true)
    StyleUtils.setDefaultMapControlStyle()
  }
}

export default function() {
  return new IncrementModule({
    type: ConstToolType.SM_MAP_INCREMENT,
    title: getLanguage(global.language).Map_Main_Menu.COLLECTION,
    size: 'large',
    image: getThemeAssets().functionBar.icon_tool_collection,
    getData: IncrementData.getData,
    actions: IncrementAction,
  })
}
