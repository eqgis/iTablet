import { getThemeAssets } from "@/assets"
import { ConstOnline } from "@/constants"
import { OpenData } from "@/constants/FunctionToolbarModule"
import { getLanguage } from "@/language"
import { DatasetType } from "imobile_for_reactnative"
import { getImage } from "../../assets/Image"

// global.ToolBar?.close()
function layerManagerData() {
  let data = [
    {
      title: "Google",// 'Google RoadMap',
      action: () => {
        global.ToolBar?.close()
        return OpenData(ConstOnline.Google, 0)
      },
      data: [],
      image: getImage().icon_map_normal,
      type: DatasetType.IMAGE,
      themeType: -1,
    },
    {
      title: 'Google Satellite',
      action: () => {
        global.ToolBar?.close()
        return OpenData(ConstOnline.Google, 1)
      },
      data: [],
      image: getImage().icon_map_image,
      type: DatasetType.IMAGE,
      themeType: -1,
    },
    {
      title: 'Google Terrain',
      action: () => {
        global.ToolBar?.close()
        OpenData(ConstOnline.Google, 2)
      },
      data: [],
      image: getImage().icon_map_terrain,
      type: DatasetType.IMAGE,
      themeType: -1,
    },
    {
      title: 'Google Hybrid',
      action: () => {
        global.ToolBar?.close()
        OpenData(ConstOnline.Google, 3)
      },
      data: [],
      image: getThemeAssets().layerType.layer_image,
      type: DatasetType.IMAGE,
      themeType: -1,
    },
    {
      title: 'Google labelmap',
      action: () => {
        global.ToolBar?.close()
        return OpenData(ConstOnline.Google, 4)
      },
      data: [],
      image: getImage().icon_ditu_3,
      type: DatasetType.IMAGE,
      themeType: -1,
    },
    {
      title: "BingMap", // BingMap
      action: () => {
        global.ToolBar?.close()
        return OpenData(ConstOnline.BingMap, 0)
      },
      data: [],
      image: getImage().icon_ditu_3,
      type: DatasetType.IMAGE,
      themeType: -1,
    },
    {
      title: '天地图底图', // 'Tianditu',
      action: ({callback}: {callback: () => any}) => {
        const data = []
        if (global.language === 'CN') {
          data.push(ConstOnline.tiandituCN())
        } else {
          data.push(ConstOnline.tiandituEN())
        }
        data.push(ConstOnline.tianditu())
        OpenData(data, 0, callback)
        global.ToolBar?.close()
      },
      data: [],
      image: getImage().icon_map_normal,
      type: DatasetType.IMAGE,
      themeType: -1,
    },
    {
      title: '天地图-影像底图', //'Tianditu Image',
      action: ({callback}: {callback: () => any}) => {
        const data = []
        if (global.language === 'CN') {
          data.push(ConstOnline.tiandituImgCN())
        } else {
          data.push(ConstOnline.tiandituImgEN())
        }
        data.push(ConstOnline.tiandituImg())
        OpenData(data, 0, callback)
        global.ToolBar?.close()
      },
      data: [],
      image: getImage().icon_map_image,
      type: DatasetType.IMAGE,
      themeType: -1,
    },
    {
      title: '天地图-地形底图', // Tianditu Terrain
      action: ({callback}: {callback: () => any}) => {
        const data = []
        // data.push(ConstOnline.tiandituTerCN())
        if (global.language === 'CN') {
          data.push(ConstOnline.tiandituImgCN())
        } else {
          data.push(ConstOnline.tiandituImgEN())
        }
        data.push(ConstOnline.tiandituTer())
        OpenData(data, 0, callback)
        global.ToolBar?.close()
      },
      data: [],
      image: getImage().icon_map_terrain,
      type: DatasetType.IMAGE,
      themeType: -1,
    },
    {
      title: "高德底图", // 'GaoDe',
      action: () => {
        global.ToolBar?.close()
        return OpenData(ConstOnline.GAODE, 0)
      },
      data: [],
      image: getImage().icon_ditu_3,
      type: DatasetType.IMAGE,
      themeType: -1,
    },
    {
      title: "高德-影像底图", //'GaoDe Image',
      action: () => {
        global.ToolBar?.close()
        return OpenData(ConstOnline.GAODE, 1)
      },
      data: [],
      image: getImage().icon_ditu_3,
      type: DatasetType.IMAGE,
      themeType: -1,
    },
    // {
    //   title: '全球矢量地图',
    //   action: () => {
    //     return OpenData(ConstOnline.TD, 0)
    //   },
    //   data: [],
    //   image: getThemeAssets().layerType.layer_image,
    //   type: DatasetType.IMAGE,
    //   themeType: -1,
    // },
    // {
    //   title: '全球影像地图服务',
    //   action: () => {
    //     return OpenData(ConstOnline.TDYXM, 0)
    //   },
    //   data: [],
    //   image: getThemeAssets().layerType.layer_image,
    //   type: DatasetType.IMAGE,
    //   themeType: -1,
    // },
    // {
    //   title: 'Baidu Map',
    //   action: () => {
    //     return OpenData(ConstOnline.Baidu, 0)
    //   },
    //   data: [],
    //   image: getThemeAssets().layerType.layer_image,
    //   type: DatasetType.IMAGE,
    //   themeType: -1,
    // },
    {
      title: 'OSM',
      action: () => {
        global.ToolBar?.close()
        return OpenData(ConstOnline.OSM, 0)
      },
      data: [],
      image: getImage().icon_ditu_3, // getThemeAssets().layerType.layer_image,
      themeType: -1,
    },
    // {
    //   title: 'CycleMap',
    //   action: () => {
    //     return OpenData(ConstOnline.OSM, 1)
    //   },
    //   data: [],
    //   image: getThemeAssets().layerType.layer_image,
    //   type: DatasetType.IMAGE,
    //   themeType: -1,
    // },
    // {
    //   title: 'Transport',
    //   action: () => {
    //     return OpenData(ConstOnline.OSM, 2)
    //   },
    //   data: [],
    //   image: getThemeAssets().layerType.layer_image,
    //   type: DatasetType.IMAGE,
    //   themeType: -1,
    // },
    // {
    //   title: 'quanguo',
    //   action: () => {
    //     return OpenData(ConstOnline.SuperMapCloud, 0)
    //   },
    //   data: [],
    //   image: getThemeAssets().layerType.layer_image,
    //   type: DatasetType.IMAGE,
    //   themeType: -1,
    // },
  ]
  data = data.filter(item => {
    if (global.language === 'CN') {
      return (
        item.title.indexOf('Google') === -1 &&
        item.title.indexOf('OSM') === -1
        && item.title.indexOf('高德')
        && item.title.indexOf('BingMap')
      )
    } else {
      return (
        item.title.indexOf('GaoDe') === -1 &&
        item.title.indexOf('Tianditu') === -1
        && item.title.indexOf('天地图')
        && item.title.indexOf('高德') // Google Satellite
        // && item.title.indexOf('Google Satellite') === -1
        && item.title.indexOf('Google Hybrid') === -1
        && item.title.indexOf('Google labelmap') === -1
        && item.title.indexOf('BingMap')
        && item.title.indexOf('OSM') === -1
      )
    }
  })

  return data
}

const actions = {
  layerManagerData,
}
export default actions
