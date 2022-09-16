import { ConstOnline, MapHeaderButton, MapTabs } from '@/constants'
import { Module } from '@/class'
import {
  toolModule,
  changeMapModule,
} from '@/containers/workspace/components/ToolBar/modules'
import { getImage } from '../assets'
import { checkModule } from '../mapFunctionModules'
import { LayerUtils, NavigatorUtil, SCoordinationUtils } from '@/utils'
import navigators from '../containers'
import { getLanguage } from '../language'
import NavigationService from '@/containers/NavigationService'
import { SMap } from 'imobile_for_reactnative'
import ToolbarModule from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'
import locationModule from '../mapFunctionModules/locationModule'
import { injectReducer } from "@/redux/store"
import { guotu } from '../reduxModels'
import ServiceAction from '@/containers/workspace/components/ToolBar/modules/serviceModule/ServiceAction'

/**
 * 首页显示的旅行轨迹模块
 */
export default class GuoTuModule extends Module {
  static key = 'guotu'
  constructor() {
    super({
      key: GuoTuModule.key,
      // 右侧工具条加载项
      functionModules: [
        locationModule(),
        changeMapModule(),      // 底图
        checkModule(),        // 核查
        toolModule(),       // 工具
      ],
      // 地图类型（三维/二维）
      mapType: Module.MapType.MAP,
    })

    // 自定义地图右上角按钮
    this.headerButtons = [
      // MapHeaderButton.CoworkChat,
      {
        key: 'save',
        image: getImage().save,
        action: this.save,
      }, {
        key: 'upload',
        image: getImage().upload,
        action: this.upload,
      }
    ],

    // 自定义地图地步Tab
    this.tabModules = [
      MapTabs.MapView,
      MapTabs.LayerManager,
      MapTabs.LayerAttribute,
      // MapTabs.MapSetting,
      {
        key: module,
        title: getLanguage().TASK,
        //'属性',
        image: getImage().task,
        selectedImage: getImage().task,
        btnClick: () => {
          NavigationService.navigate('GuoTuTasks')
        },
      }
    ]

    // 添加新的页面导航
    NavigatorUtil.addNavigator(navigators)

    /**
     * 注入第定义redux
     */
    injectReducer({
      key: 'guotu',
      reducer: guotu,
      list: 'whitelist', //白名单,持久化数据
    })

    global.coworkMode = true
  }

  /**
   * 保存地图
   */
  save = async () => {
    try {
      const params: any = ToolbarModule.getParams()
      const currentMap = params.map.currentMap
      const addition: {Template?: string} = {}
      if (currentMap?.Template) {
        addition.Template = this.props.map.currentMap.Template
      }
      const mapName = await SMap.saveMapName(
        currentMap.name,
        params.nModule || '',
        params.addition,
        false,
        false,
        false,
        true,
      )
      console.warn(mapName)
    } catch (error) {
      __DEV__ && console.warn(error)
    }
  }

  /**
   * 上传数据服务
   */
  upload = async () => {
    try {
      const params: any = ToolbarModule.getParams()

      this.save()

      for (const layerData of params.layers.layers) {
        const datasetDescription = LayerUtils.getDatasetDescriptionByLayer(layerData)
        if (datasetDescription.type !== 'onlineService') continue
        ServiceAction.updateToLocal({
          url: datasetDescription.url,
          datasourceAlias: layerData.datasourceAlias,
          datasetName: layerData.datasetName,
        }, result => {
          result && ServiceAction.uploadToService({
            // layerName: layerData.name,
            url: datasetDescription.url,
            datasourceAlias: layerData.datasourceAlias,
            datasetName: layerData.datasetName,
            onlineDatasourceAlias: datasetDescription.datasourceAlias,
          })
        })
      }
    } catch (error) {
      __DEV__ && console.warn(error)
    }
  }

  getDefaultData = () => {
    return {
      key: GuoTuModule.key,
      // 根据语言获取地图模块名称
      title: '国土调查',
      // 模块图片
      moduleImage: getImage().flight,
      // 点击时模块高亮图片
      moduleImageTouch: getImage().flight,
      // 默认地图名称
      defaultMapName: global.language === 'CN' ? 'LandBuild' : 'PrecipitationOfUSA',
      // 地图默认底图数据
      baseMapSource: [ConstOnline.tiandituCN, ConstOnline.tianditu],
      // 地图默认底图当前显示的地图
      baseMapIndex: 3,
      mapType: this.mapType,
      isExample: false,
      openDefaultMap: true,
      // action: this.action,
    }
  }

  // 首页模块数据
  getChunk = (language: string) => {
    return this.createChunk(language, this.getDefaultData())
  }
}