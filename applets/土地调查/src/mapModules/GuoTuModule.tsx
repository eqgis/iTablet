import * as React from 'react'
import { ConstOnline, MapHeaderButton, MapTabs, UserType } from '@/constants'
import { Module } from '@/class'
import {
  toolModule,
  changeMapModule,
} from '@/containers/workspace/components/ToolBar/modules'
import { getImage } from '../assets'
import { checkModule } from '../mapFunctionModules'
import { CheckService, NavigatorUtil, scaleSize, screen, Toast } from '@/utils'
import navigators from '../containers'
import { getLanguage } from '../language'
import NavigationService from '@/containers/NavigationService'
import { SMap } from 'imobile_for_reactnative'
import ToolbarModule from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'
import { injectReducer } from "@/redux/store"
import { guotu } from '../reduxModels'
import ServiceAction from '@/containers/workspace/components/ToolBar/modules/serviceModule/ServiceAction'
import { MTBtn } from '@/components'
import { Animated, Easing, StyleSheet, View } from 'react-native'
import { getPublicAssets } from '@/assets'


const styles = StyleSheet.create({
  headerBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(80),
    width: scaleSize(80),
  },
  headerBtnImg: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
  cornerMark: {
    position: 'absolute',
    right: scaleSize(0),
    top: scaleSize(0),
    width: scaleSize(32),
    height: scaleSize(32),
  },
})

/**
 * 首页显示的土地调查模块
 */
export default class GuoTuModule extends Module {
  static key = 'guotu'
  serviceLoading = new Animated.Value(0)
  aniMotion: Animated.CompositeAnimation | null | undefined
  isUploading = false

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
      }, (mapViewProps: any) => {
        // 从redux中取出当前用户-群组(地区)-任务的正在执行的服务
        if (
          mapViewProps.currentTask?.groupID &&
          mapViewProps.currentTaskServices?.[mapViewProps.user.currentUser.userName]?.[mapViewProps.currentTask?.groupID]?.[mapViewProps.currentTask?.id]
        ) {
          const services = mapViewProps.currentTaskServices[mapViewProps.user.currentUser.userName][mapViewProps.currentTask.groupID][mapViewProps.currentTask.id]
          // 判断是否有服务正在执行
          if (services?.length > 0) {
            for (const service of services) {
              // 判断是否有服务正在上传
              this.isUploading = service.status === 'upload'
              break
            }
          } else {
            // 服务上传完成后,重置isUploading,并刷新图层,更新图层状态
            if (this.isUploading) {
              Toast.show('上传完成')
              mapViewProps.getLayers?.()
            }
            this.isUploading = false
          }
        } else {
          // 服务上传完成后,重置isUploading,并刷新图层,更新图层状态
          if (this.isUploading) {
            Toast.show('上传完成')
            mapViewProps.getLayers?.()
          }
          this.isUploading = false
        }
        // let info = {
        //   key: 'upload',//数据提交
        //   image: isUploading ? getImage().upload,
        //   action: this.upload,
        // }
        const size = mapViewProps.device.orientation.indexOf('LANDSCAPE') === 0 ? 40 : 50
        return (
          <View>
            <MTBtn
              key={'upload'}
              style={[styles.headerBtn, mapViewProps.device.orientation.indexOf('LANDSCAPE') === 0 && {
                height: screen.HEADER_HEIGHT_LANDSCAPE - 2,
              }]}
              imageStyle={{ width: scaleSize(size), height: scaleSize(size) }}
              image={getImage().upload}
              onPress={this.upload}
            />
            {
              this.isUploading &&
              <Animated.Image
                resizeMode={'contain'}
                style={[
                  styles.cornerMark,
                  {
                    transform: [{rotate: this.serviceLoading
                      .interpolate({inputRange: [0, 1],outputRange: ['0deg', '360deg']}),
                    }],
                  },
                ]}
                source={getPublicAssets().common.icon_downloading}
              />
            }
          </View>
        )
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
        addition.Template = params.map.currentMap.Template
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

      if (this.isUploading) {
        Toast.show('正在提交数据服务')
        return
      }

      Toast.show('开始提交数据服务')

      let needUpload = false
      for (const layerData of params.layers.layers) {
        // 提交所有被修改过的图层
        if (layerData.isModified) {
          needUpload = true
          // 服务上传,开启动画
          !this.isUploading && this.loading()
          await ServiceAction.uploadLayerService({layerData})
        }
      }
      if (needUpload && !this.isUploading) {
        // this.aniMotion = null
        // this.loading()
      } else {
        this.isUploading = false
        this.aniMotion = null
        Toast.show('不需要提交服务')
      }
    } catch (error) {
      Toast.show('提交服务失败')
      this.isUploading = false
      this.aniMotion = null
      __DEV__ && console.warn(error)
    }
  }

  /**
   * 上传转圈动画
   */
  loading = () => {
    if (!this.aniMotion) {
      this.serviceLoading.setValue(0)
      this.aniMotion = Animated.timing(this.serviceLoading, {
        toValue: this.serviceLoading._value === 0 ? 1 : 0,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
      Animated.loop(this.aniMotion).start()
    }
  }

  // 首页模块数据
  getChunk = (language: string) => {
    return this.createChunk(language, this.getDefaultData())
  }
}