import { SMap, DatasetType, SMediaCollector } from 'imobile_for_reactnative'
import ConstOnline from './ConstOnline'
import ToolbarBtnType from '../containers/workspace/components/ToolBar/ToolbarBtnType'
import { ConstToolType, ToolbarType } from '.'
import { getLanguage } from '../language/index'
import { Toast, LayerUtils } from '../utils'

async function OpenData(data, index, callback) {
  const layers = await SMap.getLayersByType()
  let isOpen
  if (data instanceof Array) {
    for (let i = 0; i < data.length; i++) {
      isOpen = await SMap.isDatasourceOpen(data[i].DSParams)
    }
  } else {
    isOpen = await SMap.isDatasourceOpen(data.DSParams)
  }
  // Layer index = 0 为顶层
  if (isOpen) {
    if (layers.length > 0) {
      let baseMap = layers.filter(layer => {
        return LayerUtils.isBaseLayer(layer)
      })
      for (let i = 0; i < baseMap.length; i++) {
        await SMap.removeLayer(baseMap[i].path)
      }
      for (let i = 0; i < baseMap.length; i++) {
        await SMap.closeDatasource(baseMap[i].datasourceAlias)
      }
    }
    if (data instanceof Array) {
      for (let i = 0; i < data.length; i++) {
        await SMap.openDatasource(data[i].DSParams, index, false)
      }
      GLOBAL.BaseMapSize = data.length
      if (callback && typeof callback === 'function') {
        callback()
      }
    } else {
      await SMap.openDatasource(data.DSParams, index, false)
      GLOBAL.BaseMapSize = 1
      if (callback && typeof callback === 'function') {
        callback()
      }
    }
    
    // 切换底图，坐标系可能变化，导致多媒体callout位置错误，重新加载一次
    let taggingLayers = await SMap.getTaggingLayers(
      GLOBAL.currentUser.userName,
    )
    for (let _layer of taggingLayers) {
      let isMediaLayer = await SMediaCollector.isMediaLayer(_layer.name)
      if (_layer.isVisible && isMediaLayer) {
        await SMediaCollector.hideMedia(_layer.name)
        await SMediaCollector.showMedia(_layer.name)
      }
    }
  } else {
    Toast.show(getLanguage(global.language).Prompt.NETWORK_REQUEST_FAILED)
  }
  return true
}

const layerAdd = [
  {
    title: '选择数据源',
    data: [
      {
        title: '选择目录',
      },
    ],
  },
]

// const BotMap = [
//   {
//     title: 'Google',
//     data: [
//       {
//         title: 'Google RoadMap',
//         image: require('../assets/mapToolbar/list_type_map_black.png'),
//         action: () => {
//           OpenData(ConstOnline.Google, 0)
//         },
//       },
//       {
//         title: 'Google Satellite',
//         image: require('../assets/mapToolbar/list_type_map_black.png'),
//         action: () => {
//           OpenData(ConstOnline.Google, 1)
//         },
//       },
//       {
//         title: 'Google Terrain',
//         image: require('../assets/mapToolbar/list_type_map_black.png'),
//         action: () => {
//           OpenData(ConstOnline.Google, 2)
//         },
//       },
//       {
//         title: 'Google Hybrid',
//         image: require('../assets/mapToolbar/list_type_map_black.png'),
//         action: () => {
//           OpenData(ConstOnline.Google, 3)
//         },
//       },
//     ],
//   },
//   {
//     title: 'MapWorld',
//     data: [
//       // {
//       //   title: '全球矢量地图（经纬度）',
//       //   action: () => {
//       //     OpenData(ConstOnline.TDJWD,0)
//       //   },
//       // },
//       {
//         title: '全球矢量地图',
//         image: require('../assets/mapToolbar/list_type_map_black.png'),
//         action: () => {
//           OpenData(ConstOnline.TD, 0)
//         },
//       },
//       // {
//       //   title: '全球影像地图服务（经纬度）',
//       //   action: () => {
//       //     OpenData(ConstOnline.TDYX,0)
//       //   },
//       // },
//       {
//         title: '全球影像地图服务',
//         image: require('../assets/mapToolbar/list_type_map_black.png'),
//         action: () => {
//           OpenData(ConstOnline.TDYXM, 0)
//         },
//       },
//       // {
//       //   title: '全球地形晕渲地图服务（经纬度）',
//       //   action: () => {
//       //     OpenData(ConstOnline.TDQ,0)
//       //   },
//       // },
//     ],
//   },
//   {
//     title: 'Baidu',
//     data: [
//       {
//         title: 'Baidu Map',
//         image: require('../assets/mapToolbar/list_type_map_black.png'),
//         action: () => {
//           OpenData(ConstOnline.Baidu, 0)
//         },
//       },
//     ],
//   },
//   {
//     title: 'OSM',
//     data: [
//       {
//         title: 'Standard',
//         image: require('../assets/mapToolbar/list_type_map_black.png'),
//         action: () => {
//           OpenData(ConstOnline.OSM, 0)
//         },
//       },
//       {
//         title: 'CycleMap',
//         image: require('../assets/mapToolbar/list_type_map_black.png'),
//         action: () => {
//           OpenData(ConstOnline.OSM, 1)
//         },
//       },
//       {
//         title: 'Transport',
//         image: require('../assets/mapToolbar/list_type_map_black.png'),
//         action: () => {
//           OpenData(ConstOnline.OSM, 2)
//         },
//       },
//     ],
//   },
//   {
//     title: 'SuperMapCloud',
//     data: [
//       {
//         title: 'quanguo',
//         image: require('../assets/mapToolbar/list_type_map_black.png'),
//         action: () => {
//           OpenData(ConstOnline.SuperMapCloud, 0)
//         },
//       },
//     ],
//   },
// ]

function layerManagerData() {
  let data = [
    {
      title: 'Google RoadMap',
      action: () => OpenData(ConstOnline.Google, 0),
      data: [],
      image: require('../assets/map/icon-shallow-image_black.png'),
      type: DatasetType.IMAGE,
      themeType: -1,
    },
    {
      title: 'Google Satellite',
      action: () => OpenData(ConstOnline.Google, 1),
      data: [],
      image: require('../assets/map/icon-shallow-image_black.png'),
      type: DatasetType.IMAGE,
      themeType: -1,
    },
    {
      title: 'Google Terrain',
      action: () => OpenData(ConstOnline.Google, 2),
      data: [],
      image: require('../assets/map/icon-shallow-image_black.png'),
      type: DatasetType.IMAGE,
      themeType: -1,
    },
    {
      title: 'Google Hybrid',
      action: () => OpenData(ConstOnline.Google, 3),
      data: [],
      image: require('../assets/map/icon-shallow-image_black.png'),
      type: DatasetType.IMAGE,
      themeType: -1,
    },
    {
      title: 'BingMap',
      action: () => OpenData(ConstOnline.BingMap, 0),
      data: [],
      image: require('../assets/map/icon-shallow-image_black.png'),
      type: DatasetType.IMAGE,
      themeType: -1,
    },
    {
      title: 'Tianditu',
      action: callback => {
        GLOBAL.SimpleDialog.set({
          text: getLanguage(global.language).Map_Layer.IS_ADD_NOTATION_LAYER,
          confirmText: getLanguage(global.language).Prompt.YES,
          cancelText: getLanguage(global.language).Prompt.NO,
          confirmAction: () => {
            let data = []
            if (GLOBAL.language === 'CN') {
              data.push(ConstOnline.tiandituCN)
            } else {
              data.push(ConstOnline.tiandituEN)
            }
            data.push(ConstOnline.tianditu)
            OpenData(data, 0, callback)
          },
          cancelAction: () => OpenData(ConstOnline.tianditu, 0, callback),
        })
        GLOBAL.SimpleDialog.setVisible(true)
      },
      data: [],
      image: require('../assets/map/icon-shallow-image_black.png'),
      type: DatasetType.IMAGE,
      themeType: -1,
    },
    {
      title: 'Tianditu Image',
      action: callback => {
        GLOBAL.SimpleDialog.set({
          text: getLanguage(global.language).Map_Layer.IS_ADD_NOTATION_LAYER,
          confirmText: getLanguage(global.language).Prompt.YES,
          cancelText: getLanguage(global.language).Prompt.NO,
          confirmAction: () => {
            let data = []
            if (GLOBAL.language === 'CN') {
              data.push(ConstOnline.tiandituImgCN)
            } else {
              data.push(ConstOnline.tiandituImgEN)
            }
            data.push(ConstOnline.tiandituImg)
            OpenData(data, 0, callback)
          },
          cancelAction: () => OpenData(ConstOnline.tiandituImg, 0, callback),
        })
        GLOBAL.SimpleDialog.setVisible(true)
      },
      data: [],
      image: require('../assets/map/icon-shallow-image_black.png'),
      type: DatasetType.IMAGE,
      themeType: -1,
    },
    {
      title: 'Tianditu Terrain',
      action: callback => {
        GLOBAL.SimpleDialog.set({
          text: getLanguage(global.language).Map_Layer.IS_ADD_NOTATION_LAYER,
          confirmText: getLanguage(global.language).Prompt.YES,
          cancelText: getLanguage(global.language).Prompt.NO,
          confirmAction: () => {
            let data = []
            data.push(ConstOnline.tiandituTerCN)
            data.push(ConstOnline.tiandituTer)
            OpenData(data, 0, callback)
          },
          cancelAction: () => OpenData(ConstOnline.tiandituTer, 0, callback),
        })
        GLOBAL.SimpleDialog.setVisible(true)
      },
      data: [],
      image: require('../assets/map/icon-shallow-image_black.png'),
      type: DatasetType.IMAGE,
      themeType: -1,
    },
    // {
    //   title: '全球矢量地图',
    //   action: () => {
    //     return OpenData(ConstOnline.TD, 0)
    //   },
    //   data: [],
    //   image: require('../assets/map/icon-shallow-image_black.png'),
    //   type: DatasetType.IMAGE,
    //   themeType: -1,
    // },
    // {
    //   title: '全球影像地图服务',
    //   action: () => {
    //     return OpenData(ConstOnline.TDYXM, 0)
    //   },
    //   data: [],
    //   image: require('../assets/map/icon-shallow-image_black.png'),
    //   type: DatasetType.IMAGE,
    //   themeType: -1,
    // },
    // {
    //   title: 'Baidu Map',
    //   action: () => {
    //     return OpenData(ConstOnline.Baidu, 0)
    //   },
    //   data: [],
    //   image: require('../assets/map/icon-shallow-image_black.png'),
    //   type: DatasetType.IMAGE,
    //   themeType: -1,
    // },
    // {
    //   title: 'Standard',
    //   action: () => {
    //     return OpenData(ConstOnline.OSM, 0)
    //   },
    //   data: [],
    //   image: require('../assets/map/icon-shallow-image_black.png'),
    //   type: DatasetType.IMAGE,
    //   themeType: -1,
    // },
    // {
    //   title: 'CycleMap',
    //   action: () => {
    //     return OpenData(ConstOnline.OSM, 1)
    //   },
    //   data: [],
    //   image: require('../assets/map/icon-shallow-image_black.png'),
    //   type: DatasetType.IMAGE,
    //   themeType: -1,
    // },
    // {
    //   title: 'Transport',
    //   action: () => {
    //     return OpenData(ConstOnline.OSM, 2)
    //   },
    //   data: [],
    //   image: require('../assets/map/icon-shallow-image_black.png'),
    //   type: DatasetType.IMAGE,
    //   themeType: -1,
    // },
    // {
    //   title: 'quanguo',
    //   action: () => {
    //     return OpenData(ConstOnline.SuperMapCloud, 0)
    //   },
    //   data: [],
    //   image: require('../assets/map/icon-shallow-image_black.png'),
    //   type: DatasetType.IMAGE,
    //   themeType: -1,
    // },
  ]
  data = data.filter(item => {
    if (
      global.language === 'CN' &&
      (item.title === 'Google RoadMap' ||
        item.title === 'Google Satellite' ||
        item.title === 'Google Terrain' ||
        item.title === 'Google Hybrid')
    ) {
      return false
    }
    return true
  })

  return data
}

// const openData = [
//   {
//     title: '地图',
//     data: [
//       {
//         title: '选择目录',
//       },
//     ],
//   },
// ]

// 图例菜单 可见
const legendMenuInfo = (param, orientation) => [
  {
    key: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
    action: () => {
      let height
      let column
      if (orientation.indexOf('PORTRAIT') >= 0) {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      } else {
        height = ConstToolType.THEME_HEIGHT[2]
        column = 16
      }
      GLOBAL.toolBox && GLOBAL.toolBox.menu()
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.LEGEND, {
          containerType: ToolbarType.colorTable,
          column,
          isFullScreen: false,
          height,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectName: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
          selectKey: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
    selectKey: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
  },
  {
    key: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
          selectKey: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
    selectKey: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
  },
  {
    key: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
          selectKey: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
    selectKey: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
  },
  {
    key: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
          selectKey: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
    selectKey: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
  },
]

// 图例菜单 不可见
const legendMenuInfoNotVisible = (param, orientation) => [
  {
    key: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
    action: () => {
      let column
      let height
      if (orientation.indexOf('PORTRAIT') >= 0) {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      } else {
        height = ConstToolType.THEME_HEIGHT[2]
        column = 16
      }
      GLOBAL.toolBox && GLOBAL.toolBox.menu()
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.LEGEND, {
          containerType: ToolbarType.colorTable,
          column,
          isFullScreen: false,
          height,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.NOT_VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectName: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
          selectKey: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
    selectKey: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
  },
  {
    key: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
          selectKey: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.NOT_VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
    selectKey: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
  },
  {
    key: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
          selectKey: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.NOT_VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
    selectKey: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
  },
  {
    key: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
          selectKey: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.NOT_VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
    selectKey: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
  },
]

// 智能配图
// const smartCartography = param => [
//   {
//     key: getLanguage(param).Map_Main_Menu.STYLE_BRIGHTNESS,
//     action: () => {
//       GLOBAL.toolBox &&
//         GLOBAL.toolBox.setState({
//           isTouchProgress: true,
//           showMenuDialog: false,
//           selectName: getLanguage(param).Map_Main_Menu.STYLE_BRIGHTNESS,
//           selectKey: getLanguage(param).Map_Main_Menu.STYLE_BRIGHTNESS,
//           buttons: [
//             ToolbarBtnType.CANCEL,
//             ToolbarBtnType.STYLE_TRANSFER,
//             ToolbarBtnType.MENU_FLEX,
//             ToolbarBtnType.TOOLBAR_COMMIT,
//           ],
//         })
//     },
//     selectKey: getLanguage(param).Map_Main_Menu.STYLE_BRIGHTNESS,
//   },
//   {
//     key: getLanguage(param).Map_Main_Menu.STYLE_CONTRAST,
//     action: () => {
//       GLOBAL.toolBox &&
//         GLOBAL.toolBox.setState({
//           isTouchProgress: true,
//           showMenuDialog: false,
//           selectName: getLanguage(param).Map_Main_Menu.STYLE_CONTRAST,
//           selectKey: getLanguage(param).Map_Main_Menu.STYLE_CONTRAST,
//           buttons: [
//             ToolbarBtnType.CANCEL,
//             ToolbarBtnType.STYLE_TRANSFER,
//             ToolbarBtnType.MENU_FLEX,
//             ToolbarBtnType.TOOLBAR_COMMIT,
//           ],
//         })
//     },
//     selectKey: getLanguage(param).Map_Main_Menu.STYLE_CONTRAST,
//   },
//   {
//     key: getLanguage(param).Map_Main_Menu.SATURATION,
//     action: () => {
//       GLOBAL.toolBox &&
//         GLOBAL.toolBox.setState({
//           isTouchProgress: true,
//           showMenuDialog: false,
//           selectName: getLanguage(param).Map_Main_Menu.SATURATION,
//           selectKey: getLanguage(param).Map_Main_Menu.SATURATION,
//           buttons: [
//             ToolbarBtnType.CANCEL,
//             ToolbarBtnType.STYLE_TRANSFER,
//             ToolbarBtnType.MENU_FLEX,
//             ToolbarBtnType.TOOLBAR_COMMIT,
//           ],
//         })
//     },
//     selectKey: getLanguage(param).Map_Main_Menu.SATURATION,
//   },
// ]
export {
  layerAdd,
  // BotMap,
  layerManagerData,
  OpenData,
  legendMenuInfo,
  legendMenuInfoNotVisible,
  // smartCartography,
}
