import React from 'react'
import { SMap } from 'imobile_for_reactnative'
import {
  ToolbarType,
} from '../../../src/constants'
import { Toast } from '../../../src/utils'
import { getThemeAssets } from '../../../src/assets'
import ToolbarModule from '../../../src/containers/workspace/components/ToolBar/modules/ToolbarModule'
import ToolbarBtnType from '../../../src/containers/workspace/components/ToolBar/ToolbarBtnType'
import { FunctionExampleTypes } from './index'

// TODO 待更新注释
/**
 * ToolbarModule.getParams()
 *
 * 获取Toolbar中的Props和方法
 *
 * ? 表示待确定，是否删除
 *
 language: string,               // 语言
 type: string,                   // Toolbar类型
 navigation: Object,             // 导航信息
 data: Array,                    // Toolbar数据
 symbol: Object,                 // 符号库数据
 user: Object,                   // 当前用户信息
 map: Object,                    // 当前地图信息
 layers: Object,                 // 当前地图图层信息
 online: Object,                 // ?
 collection: Object,             // 当前地图选中对象的选择集
 template: Object,               // 当前模板信息
 currentLayer: Object,           // 当前图层
 selection: Array,               // ?
 device: Object,                 // 设备信息
 mapLegend?: Object,             // 图例参数对象
 layerList?: Array,              // 三维图层
 toolbarStatus: Object,
 laboratory: Object,
 
 existFullMap: () => {},                    // 退出全屏
 confirm: () => {},                         // ?
 showDialog: () => {},                      // ?
 addGeometrySelectedListener: () => {},     // 添加地图对象选择监听
 removeGeometrySelectedListener: () => {},  // 移除地图对象选择监听
 setSaveViewVisible?: () => {},
 setContainerLoading?: () => {},            // 显示加载图标
 showFullMap: () => {},                     // 显示全屏，只显示地图
 dialog: () => {},                          // ?
 setMapLegend?: () => {},                   //设置图例显隐的redux状态
 getMenuAlertDialogRef: () => {},
 getLayers: () => {},                       // 更新数据（包括其他界面）
 setCurrentMap: () => {},                   // 设置当前地图
 setCollectionInfo: () => {},               // 设置当前采集数据源信息
 setCurrentLayer: () => {},                 // 设置当前图层
 importWorkspace: () => {},                 // 打开模板 ？
 setAttributes: () => {},
 getMaps: () => {},
 exportWorkspace: () => {},
 getSymbolTemplates: () => {},
 getSymbolPlots: () => {},
 openWorkspace: () => {},
 closeWorkspace: () => {},
 openMap: () => {},
 closeMap: () => {},
 setCurrentTemplateInfo: () => {},
 setCurrentPlotInfo: () => {},
 setTemplate: () => {},
 exportmap3DWorkspace: () => {},
 importSceneWorkspace: () => {},
 getMapSetting: () => {},
 showMeasureResult: () => {},
 refreshLayer3dList: () => {},
 setCurrentSymbols: () => {},
 saveMap: () => {},
 measureShow: () => {},
 clearAttributeHistory: () => {},
 changeLayerList?: () => {}, //切换场景改变三维图层
 showMenuDialog?: () => {}, //显示裁剪菜单
 getClipSetting?: () => {}, //获取三维裁剪最新的参数 每次设置裁剪图层时需要重新获取
 setClipSetting?: () => {}, //获取当前裁剪设置
 clearClip?: () => {}, //清除三维裁剪相关信息
 setMapIndoorNavigation: () => {},
 setMapNavigationShow: () => {},
 setMapNavigation: () => {},
 switchAr: () => {},
 removeAIDetect: () => {},
 setOpenOnlineMap: () => {},
 downloads: Array,
 downloadFile: () => {},
 deleteDownloadFile: () => {},
 
 //设置、获取室外导航数据
 setNavigationDatas: () => {},
 getNavigationDatas: () => {},
 
 //更改导航路径
 changeNavPathInfo: () => {},
 
 //获取FloorListView
 getFloorListView: () => {},
 
 //改变当前楼层ID
 changeFloorID: () => {},
 setToolbarStatus: () => {},
 
 getOverlay: () => {},
 toolbarModuleKey: String,
 
 setToolbarVisible: this.setVisible,
 setLastState: this.setLastState,
 scrollListToLocation: this.scrollListToLocation,
 showMenuBox: this.showMenuBox,
 mapMoveToCurrent: this.mapMoveToCurrent,
 contentView: this.contentView, // ToolbarContentView ref
 buttonView: this.buttonView, // ToolbarBottomButtons ref
 */

/**
 * setToolbarVisible
 *
 * 设置是否显示
 * isShow: 是否显示
 * type:   显示数据类型
 * params: {
 *   isFullScreen:        是否全屏，
 *   height:              工具栏高度
 *   containerType:       容器的类型, list | table
 *   resetToolModuleData: 是否重置ToolbarModule中的data
 *   touchType:           setVisible之后 GLOBAL.TouchType的值
 *   isExistFullMap:      setVisible之后是否退出全屏
 *   themeType:           专题类型
 *
 *   isTouchProgress:     是否显示指滑横向进度条
 *
 *   showMenuDialog:      是否显示指滑菜单
 *   selectKey:           指滑菜单选中目标的key
 *   selectName:          指滑菜单选中目标的name
 *
 *   column:              table类型的列数
 *   row:                 table类型的行数
 *
 *   cb:                  setVisible之后的回调函数
 * }
 */

//定位当位置
function location() {
  //step1:移动到当前位置
  SMap.moveToCurrent()
  //step2:获取定位信息
  setTimeout(()=>{
    SMap.getCurrentLocation().then(({longitude,latitude})=>{
      Toast.show("当前位置("+longitude+","+latitude+")",{position: Toast.POSITION.TOP,duration:3500})
    })
  },2000)

  const _params = ToolbarModule.getParams()
  _params.setToolbarVisible(false)
}

/** 获取数据列表 * */
function openDataList() {
  const _params = ToolbarModule.getParams() // Toolbar中的数据以及redux中的方法
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true) // Toolbar全屏显示，隐藏顶部Header，右侧FunctionToolbar以及左下角地图控制器
  // list为SectionList，以下为一个Section数据格式
  const data = [{
    title: '我的数据1',
    image: require('../../../src/assets/mapToolbar/list_type_maps.png'),
    data: [{
      title: 'AAA',
      image: getThemeAssets().dataType.icon_map,
    }, {
      title: 'BBB',
      image: getThemeAssets().dataType.icon_map,
    }, {
      title: 'CCC',
      image: getThemeAssets().dataType.icon_map,
      info: {
        infoType: 'mtime',
        lastModifiedDate: '2020/10/15 09:48:30',
      }
    }],
  }, {
    title: '我的数据2',
    image: require('../../../src/assets/mapToolbar/list_type_maps.png'),
    data: [{
      title: 'DDD',
      image: getThemeAssets().dataType.icon_map,
    }, {
      title: 'EEE',
      image: getThemeAssets().dataType.icon_map,
    }],
  }]
  // setToolbarVisible 展示/切换 底部Toolbar，
  _params.setToolbarVisible(true, FunctionExampleTypes.FUNCTION_EXAMPLE_LIST_ACTION, {
    containerType: ToolbarType.list, // 数据展示类型为普通列表
    data,
  })
}

/** 获取数据列表 * */
function openDataTable() {
  const _params = ToolbarModule.getParams() // Toolbar中的数据以及redux中的方法
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true) // Toolbar全屏显示，隐藏顶部Header，右侧FunctionToolbar以及左下角地图控制器
  // table数据格式数组
  const data = [{
    title: 'DDD',
    image: getThemeAssets().dataType.icon_map,
  }, {
    title: 'EEE',
    image: getThemeAssets().dataType.icon_map,
  }]
  const buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.TOOLBAR_COMMIT]
  // setToolbarVisible 展示/切换 底部Toolbar
  _params.setToolbarVisible(true, FunctionExampleTypes.FUNCTION_EXAMPLE_TABLE_ACTION, {
    containerType: ToolbarType.table, // 数据展示类型为普通表格
    isFullScreen: false, // Toolbar不是全屏，没有黑色透明遮罩
    data,
    buttons,
  })
}

/** 点击事件 * */
async function showMsg(item) {
  Toast.show(item.title)
}

/**
 * 重写自带列表点击事件，只需导出，当Toolbar为list时，就可以直接调用
 * @param type <String>
 * @param params {
        item <Object>,
        index <Number>,
        section <Object>,
        ...,
      }
 * @returns {Promise.<void>}
 */
async function listAction(type, params = {}) {
  switch (type) {
    case FunctionExampleTypes.FUNCTION_EXAMPLE_LIST_ACTION:
      showMsg(params.item)
      break
  }
}

/**
 * 重写自带表格点击事件，只需导出，当Toolbar为table时，就可以直接调用
 * @param type <String>
 * @param item <Object>
 */
function tableAction(type, item) {
  switch (type) {
    case FunctionExampleTypes.FUNCTION_EXAMPLE_TABLE_ACTION:
      showMsg(item)
      return
  }
  if (item.action) {
    item.action(item)
  }
}

function commit() {
  Toast.show('完成')
}

export default {
  commit,
  listAction,
  tableAction,

  location,
  openDataList,
  openDataTable,
}
