import { ConstOnline, MapHeaderButton, MapTabs, UserType } from '@/constants'
import { Module } from '@/class'
import {
  toolModule,
  changeMapModule,
} from '@/containers/workspace/components/ToolBar/modules'
import { getImage } from '../assets'
import { checkModule } from '../mapFunctionModules'
import { CheckService, NavigatorUtil, Toast } from '@/utils'
import navigators from '../containers'
import { getLanguage } from '../language'
import NavigationService from '@/containers/NavigationService'
import { SMap } from 'imobile_for_reactnative'
import ToolbarModule from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'
import { injectReducer } from "@/redux/store"
import { guotu } from '../reduxModels'
import ServiceAction from '@/containers/workspace/components/ToolBar/modules/serviceModule/ServiceAction'

/**
 * 首页显示的土地调查模块
 */
export default class GuoTuModule extends Module {
  static key = 'guotu'
  constructor() {
    super({
      key: GuoTuModule.key,
      // 右侧工具条加载项
      functionModules: [
        // locationModule(),       // 自定义模块-地区
        changeMapModule(),      // 系统自带模块-底图
        checkModule(),          // 自定义模块-核查
        toolModule(),           // 系统自带模块-工具
      ],
      // 地图类型（三维/二维）
      mapType: Module.MapType.MAP,
    })

    // 自定义地图右上角按钮
    this.headerButtons = [
      // MapHeaderButton 中自带功能
      MapHeaderButton.Audio,  // 语音
      MapHeaderButton.Undo,   // 回退
      // MapHeaderButton.Search, // 搜索
      // MapHeaderButton.Share,  // 分享

      // to do 自定义功能
      {
        key: 'save',//地图保存
        image: getImage().save,
        action: this.save,
      }, {
        key: 'upload',//数据提交
        image: getImage().upload,
        action: this.upload,
      },
      MapHeaderButton.CoworkChat,
    ]

    // 自定义地图底部Tab
    this.tabModules = [
      // 系统自带Tab
      MapTabs.MapView,          // 系统自带Tab-地图
      MapTabs.LayerManager,     // 系统自带Tab-图层
      MapTabs.LayerAttribute,   // 系统自带Tab-属性
      MapTabs.MapSetting,       // 系统自带Tab-设置
      // todo 用户自定义Tab页面
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

    CheckService.setCheckServiceUpload(() => {
      const params: any = ToolbarModule.getParams()
      if (global.Type !== 'guotu') return true
      if (!params.user.currentUser?.userName || params.user.currentUser?.userName === 'Customer') {
        Toast.show('请先登录')
        return false
      }
      if (UserType.isOnlineUser(params.user.currentUser)) {
        Toast.show('小插件示例,online用户不能提交')
        return false
      }
      return true
    })
  }

  preAction = () => {
    /**
     * 打开在线协作,数据服务
     */
    global.coworkMode = true
    return true
  }

  getDefaultData = () => {
    return {
      key: GuoTuModule.key,
      // 根据语言获取地图模块名称
      title: '土地核查',
      // 模块图片
      moduleImage: getImage().check,
      // 点击时模块高亮图片
      moduleImageTouch: getImage().check,
      // 默认地图名称
      defaultMapName: global.language === 'CN' ? 'LandBuild' : 'PrecipitationOfUSA',
      // 地图默认底图数据
      baseMapSource: [ConstOnline.tiandituImg()],
      // 地图默认底图当前显示的地图
      baseMapIndex: 3,
      mapType: this.mapType,
      isExample: false,
      openDefaultMap: true,
      // action: this.action,
      preAction: this.preAction,
    }
  }
  /**
   * 保存地图
   */
  save = () => {
    try {
      const params: any = ToolbarModule.getParams()
      const currentMap = params.map.currentMap
      const addition: {Template?: string} = {}
      if (currentMap?.Template) {
        addition.Template = this.props.map.currentMap.Template
      }
      SMap.saveMapName(
        currentMap.name,
        params.nModule || '',
        params.addition,
        false,
        false,
        false,
        true,
      ).then(mapName => {
        Toast.show(mapName + '已保存')
      })
    } catch (error) {
      __DEV__ && console.warn(error)
    }
  }

  /**
   * 上传数据服务
   */
  upload = async () => {
    const params: any = ToolbarModule.getParams()
    try {
      if (!CheckService.checkServiceUpload()) {
        return
      }
      if (!params.map.currentMap.name) {
        Toast.show('请先打开任务')
        return
      }

      Toast.show('开始提交数据服务')

      for (const layerData of params.layers.layers) {
        // 提交所有被修改过的图层
        if (layerData.isModified) {
          await ServiceAction.uploadLayerService({layerData})
        }
      }
    } catch (error) {
      Toast.show('提交服务失败')
      __DEV__ && console.warn(error)
    }
  }
  // 首页模块数据
  getChunk = (language: string) => {
    return this.createChunk(language, this.getDefaultData())
  }
}