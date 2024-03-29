/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View, ScrollView } from 'react-native'
import { ImageButton } from '../../../../components'
import { getThemeAssets, getPublicAssets } from '../../../../assets'
import styles from './styles'
import { getLanguage } from '../../../../language'
import { ConstPath, UserType } from '../../../../constants'
import { scaleSize, Toast, dataUtil, OnlineServicesUtils } from '../../../../utils'
import ToolbarModule from '../../../workspace/components/ToolBar/modules/ToolbarModule'
import NavigationService from '../../../NavigationService'
import {
  SMap,
  SMediaCollector,
  RNFS,
  SCoordination,
} from 'imobile_for_reactnative'
import { FileTools } from '../../../../native'

const itemGap = scaleSize(20)

export default class LayerTopBar extends React.Component {
  props: {
    locateAction: () => void,
    undoAction: () => void,
    deleteAction: () => void,
    refreshAction: () => void,
    relateAction: () => void,
    addFieldAction: () => void,
    tabsAction?: () => void, // 显示侧滑栏
    attributesData: Array,
    hasAddField?: boolean, // 是否有添加属性按钮
    hasCamera?: boolean, // 是否有多媒体按钮
    canTabs?: boolean, // 是否可点击切换标签
    canLocated?: boolean, // 是否可点击定位
    canUndo?: boolean, // 是否可点击撤销
    canRelated?: boolean, // 是否可点击关联
    hasTabBtn?: boolean, // 是否可点击关联
    canAddField?: boolean, // 是否可点击添加属性
    orientation?: String,
    canDelete?: boolean, //是否可以点击删除
    currentIndex?: Object,//点击的数据集字段位置
    selectionAttribute?: Object,//判断是否为采集或标注功能跳转属性
    islayerSelection?: Object,//当前属性拦选中的属性的图层名
    layerAttribute?:Object,//是否为地图界面跳转属性
    type?:String,//我的里面会传一个type过来
    attributes?:Object,
    // layerName?:String,
    layerInfo?: Object,
    currentTask?: Object,
    currentUser?: Object,
    customButtons?: any[],
  }

  static defaultProps = {
    canTabs: true,
    hasAddField: true,
    hasCamera: true,
    canLocated: true,
    canUndo: false,
    canRelated: false,
    canAddField: false,
    hasTabBtn: false,
    canDelete: false,
    currentIndex: 0,
    selectionAttribute: false,
    layerAttribute:false,
  }

  constructor(props) {
    super(props)
    this.state = {
      attribute: {},
      showTable: false,
    }
    if (global.coworkMode && global.Type.indexOf('3D') < 0 && this.props.currentUser) {
      if (UserType.isOnlineUser(this.props.currentUser)) {
        this.servicesUtils = new SCoordination('online')
        this.onlineServicesUtils = new OnlineServicesUtils('online')
      } else if (UserType.isIPortalUser(this.props.currentUser)){
        this.servicesUtils = new SCoordination('iportal')
        this.onlineServicesUtils = new OnlineServicesUtils('iportal')
      }
    }
  }

  tabsAction = () => {
    if (this.props.tabsAction && typeof this.props.tabsAction === 'function') {
      this.props.tabsAction()
    }
  }

  locateAction = () => {
    if (
      this.props.locateAction &&
      typeof this.props.locateAction === 'function'
    ) {
      this.props.locateAction()
    }
  }

  undoAction = () => {
    if (this.props.undoAction && typeof this.props.undoAction === 'function') {
      this.props.undoAction()
    }
  }

  relateAction = () => {
    if (
      this.props.relateAction &&
      typeof this.props.relateAction === 'function'
    ) {
      this.props.relateAction()
    }
  }

  deleteAction = () => {
    if (
      this.props.deleteAction &&
      typeof this.props.deleteAction === 'function'
    ) {
      this.props.deleteAction()
    }
  }

  // 多媒体采集
  captureImage = async ()=> {
    let smID = -1
    let limit = 9
    for (let i = 0; i < this.props.attributes.data[this.props.currentIndex].length; i++) {
      if (this.props.attributes.data[this.props.currentIndex][i].name === 'SmID') {
        smID = this.props.attributes.data[this.props.currentIndex][i].value
      } else if (
        this.props.attributes.data[this.props.currentIndex][i].name === 'MediaFilePaths'
      ) {
        let info = await SMediaCollector.getMediaInfo(this.props.layerInfo.name, smID)
        let maxFiles = 9 - info.mediaFilePaths.length
        limit = maxFiles
        if(maxFiles <= 0){
          Toast.show(getLanguage(global.language).Prompt.CANT_PICTURE)
          return
        }
      }
    }
    const selectionAttribute = this.props.selectionAttribute
    const index = this.props.currentIndex
    // const _params = ToolbarModule.getParams()
    // const { currentLayer } = _params

    const layerAttribute = this.props.layerAttribute

    let layerInfo = this.props.layerInfo
    if (layerInfo) {
      let datasourceAlias = layerInfo?.datasourceAlias // 标注数据源名称
      let datasetName = layerInfo?.datasetName // 标注图层名称
      if (
        datasourceAlias === '' || datasourceAlias === undefined || datasourceAlias === null ||
        datasetName === '' || datasetName === undefined || datasetName === null
      ) {
        layerInfo = await SMap.getLayerInfo(this.props.layerInfo.path)
        datasourceAlias = layerInfo.datasourceAlias // 标注数据源名称
        datasetName = layerInfo.datasetName // 标注图层名称
      }
      if(this.props.islayerSelection){
        let info = await SMap.getDataNameByLayer(global.SelectedSelectionAttribute.layerInfo.path)
        datasetName = info.datasetName
        datasourceAlias = info.datasourceAlias
      }

      // 跳转到图像编辑页面
      let info = await SMediaCollector.getMediaInfo(layerInfo.name, smID)
      const mediaPaths = info?.mediaFilePaths || []
      if(mediaPaths.length > 0) {
        NavigationService.navigate('MediaEdit', {
          info,
          cb: () => {
            // refresh
          },
        })
      } else {
        NavigationService.navigate('Camera', {
          datasourceAlias,
          datasetName,
          index,
          attribute: true,
          selectionAttribute,
          layerAttribute,
          limit:limit,
          cb: async ({
            datasourceName,
            datasetName,
            mediaPaths,
          }) => {
          // cb: async mediaPaths => {
            try {
              if (global.coworkMode) {
                let resourceIds = [],
                  _mediaPaths = [] // 保存修改名称后的图片地址
                let name = '', suffix = ''
                let dest = await FileTools.appendingHomeDirectory(ConstPath.UserPath + this.props.currentUser.userName + '/' + ConstPath.RelativeFilePath.Media)
                const newPaths = await FileTools.copyFiles(mediaPaths, dest)
                for (let mediaPath of newPaths) {
                  if (mediaPath.indexOf('assets-library://') === 0) { // 处理iOS相册文件
                    suffix = dataUtil.getUrlQueryVariable(mediaPath, 'ext') || ''
                    name = dataUtil.getUrlQueryVariable(mediaPath, 'id') || ''
                    dest += `${name}.${suffix}`
                    mediaPath = await RNFS.copyAssetsFileIOS(mediaPath, dest, 0, 0)
                  } else if (mediaPath.indexOf('ph://') === 0) { // 处理iOS相册文件
                    suffix = 'png'
                    name = mediaPath.substr(mediaPath.lastIndexOf('/') + 1)
                    dest += `${name}.${suffix}`
                    mediaPath = await RNFS.copyAssetsFileIOS(mediaPath, dest, 0, 0)
                  } else if (mediaPath.indexOf('content://') === 0) { // 处理android相册文件
                    let filePath = await FileTools.getContentAbsolutePath(mediaPath)
                    name = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'))
                    suffix = filePath.substr(filePath.lastIndexOf('.') + 1)
                    dest += `${name}.${suffix}`
                    await RNFS.copyFile(filePath, dest)
                    mediaPath = dest
                  } else { // 处理文件目录中的文件
                    name = mediaPath.substring(mediaPath.lastIndexOf('/') + 1, mediaPath.lastIndexOf('.'))
                    suffix = mediaPath.substr(mediaPath.lastIndexOf('.') + 1)
                    dest += `${name}.${suffix}`
                  }
                  let resourceId = await this.onlineServicesUtils.uploadFileWithCheckCapacity(
                    mediaPath,
                    `${name}.${suffix}`,
                    'PHOTOS',
                  )
                  // TODO是否删除原图
                  if (resourceId) {
                    resourceIds.push(resourceId)

                    let _newPath = `${mediaPath.replace(name, resourceId)}`
                    _mediaPaths.push(_newPath)
                  }
                }
                if (resourceIds.length > 0) {
                  let result = await SMediaCollector.addMedia({
                    datasourceName,
                    datasetName,
                    mediaPaths,
                    mediaIds: resourceIds,
                  }, false, { index: index, selectionAttribute: selectionAttribute, ids: global.layerSelection?.ids ,layerAttribute: layerAttribute})
                } else {
                  Toast.show(getLanguage(global.language).Friends.RESOURCE_UPLOAD_FAILED)
                }
                // 分享到群组中
                if (resourceIds.length > 0 && this.props.currentTask?.groupID) {
                  this.servicesUtils?.shareDataToGroup({
                    groupId: this.props.currentTask.groupID,
                    ids: resourceIds,
                  }).then(result => {
                    if (result.succeed) {
                      Toast.show(getLanguage(global.language).Friends.RESOURCE_UPLOAD_SUCCESS)
                      this.cb && this.cb()
                    } else {
                      Toast.show(getLanguage(global.language).Friends.RESOURCE_UPLOAD_FAILED)
                    }
                  }).catch(() => {
                    Toast.show(getLanguage(global.language).Friends.RESOURCE_UPLOAD_FAILED)
                  })
                }
              } else {
                let result = await SMediaCollector.addMedia({
                  datasourceName: datasourceAlias,
                  datasetName: datasetName,
                  mediaPaths,
                }, false, { index: index, selectionAttribute: selectionAttribute, ids: global.layerSelection?.ids ,layerAttribute: layerAttribute})
              }
              if (
                this.props.refreshAction &&
                typeof this.props.refreshAction === 'function'
              ) {
                this.props.refreshAction()
              }
            } catch (e) {
              // eslint-disable-next-line no-console
              __DEV__ && console.warn('error')
            }
          },
        })
      }
    }
  }

  addAttributeFieldAction = fieldInfo => {
    if (
      this.props.addFieldAction &&
      typeof this.props.addFieldAction === 'function'
    ) {
      this.props.addFieldAction(fieldInfo)
    }
  }

  renderContentView = () => {
    let data = []
    if (this.props.hasAddField) {
      data.push({
        icon: this.props.canAddField
          ? getPublicAssets().common.icon_plus
          : getPublicAssets().common.icon_plus_gray,
        key: '添加',
        title: getLanguage(global.language).Map_Attribute
          .ATTRIBUTE_FIELD_ADD,
        action: this.addAttributeFieldAction,
        enabled: this.props.canAddField,
      })
    }

    if (this.props.selectionAttribute) {
      data = data.concat([
        {
          icon: this.props.canRelated
            ? getThemeAssets().attribute.icon_relation
            : getThemeAssets().attribute.icon_unrelation,
          key: '关联',
          title: getLanguage(global.language).Map_Attribute
            .ATTRIBUTE_ASSOCIATION,
          action: this.relateAction,
          enabled: this.props.canRelated,
        },
        {
          icon: this.props.canDelete
            ? getThemeAssets().attribute.icon_delete_select
            : getThemeAssets().attribute.icon_delete_un_select,
          key: '删除',
          title: getLanguage(global.language).Map_Main_Menu
            .EDIT_DELETE,
          action: this.deleteAction,
          enabled: this.props.canDelete,
        },
      ])
    } else {
      data = data.concat([
        {
          icon: this.props.canLocated
            ? getThemeAssets().attribute.icon_location
            : getThemeAssets().attribute.icon_unlocation,
          key: '定位',
          title: getLanguage(global.language).Map_Attribute
            .ATTRIBUTE_LOCATION,
          action: this.locateAction,
          enabled: this.props.canLocated,
        },
        {
          icon: this.props.canRelated
            ? getThemeAssets().attribute.icon_relation
            : getThemeAssets().attribute.icon_unrelation,
          key: '关联',
          title: getLanguage(global.language).Map_Attribute
            .ATTRIBUTE_ASSOCIATION,
          action: this.relateAction,
          enabled: this.props.canRelated,
        },
        {
          icon: this.props.canDelete
            ? getThemeAssets().attribute.icon_delete_select
            : getThemeAssets().attribute.icon_delete_un_select,
          key: '删除',
          title: getLanguage(global.language).Map_Main_Menu
            .EDIT_DELETE,
          action: this.deleteAction,
          enabled: this.props.canDelete,
        },
      ])
    }

    if ((!global.showAIDetect || this.props.selectionAttribute) && this.props.hasCamera) {
      data.push({
        icon: this.props.canRelated
          ? getThemeAssets().mapTools.icon_tool_multi_media
          : getThemeAssets().mapTools.icon_tool_multi_media_ash,
        key: '拍照',
        title: getLanguage(global.language).Map_Main_Menu.CAMERA,
        action: this.captureImage,
        enabled: this.props.canRelated,
      })
    }

    if(this.props.type === 'MY_DATA' || this.props.type === 'NAVIGATION'){
      data = [
        {
          icon: this.props.canAddField
            ? getPublicAssets().common.icon_plus
            : getPublicAssets().common.icon_plus_gray,
          key: '添加',
          title: getLanguage(global.language).Map_Attribute
            .ATTRIBUTE_FIELD_ADD,
          action: this.addAttributeFieldAction,
          enabled: this.props.canAddField,
        },
        {
          icon: this.props.canLocated
            ? getThemeAssets().attribute.icon_location
            : getThemeAssets().attribute.icon_unlocation,
          key: '定位',
          title: getLanguage(global.language).Map_Attribute
            .ATTRIBUTE_LOCATION,
          action: this.locateAction,
          enabled: this.props.canLocated,
        },
        {
          icon: this.props.canDelete
            ? getThemeAssets().attribute.icon_delete_select
            : getThemeAssets().attribute.icon_delete_un_select,
          key: '删除',
          title: getLanguage(global.language).Map_Main_Menu
            .EDIT_DELETE,
          action: this.deleteAction,
          enabled: this.props.canDelete,
        },
      ]
    }

    let items = []
    data.forEach((item, index) => {
      if (index !== 0) {
        item = Object.assign(item, {
          containerStyle: {
            marginLeft: itemGap,
          },
        })
      }
      items.push(this.renderBtn(item))
    })

    if (this.props.customButtons?.length > 0) {
      this.props.customButtons.forEach((item, index) => {
        item = Object.assign(item, {
          containerStyle: {
            marginLeft: itemGap,
          },
        })
        items.push(this.renderBtn(item))
      })
    }

    // if (isScroll) {
    return (
      <ScrollView
        horizontal={true}
        contentContainerStyle={styles.rightScrollList}
        showsHorizontalScrollIndicator={false}
      >
        {items}
      </ScrollView>
    )
    // } else {
    //   return (
    //     <View style={styles.rightList}>
    //       {items}
    //     </View>
    //   )
    // }
  }

  renderBtn = ({ key, icon, title, action, enabled, containerStyle }) => {
    return (
      <ImageButton
        key={key}
        containerStyle={[styles.btn, containerStyle]}
        iconBtnStyle={styles.imgBtn}
        titleStyle={enabled ? styles.enableBtnTitle : styles.btnTitle}
        icon={icon}
        title={title}
        direction={'row'}
        onPress={action}
        enabled={enabled}
      />
    )
  }

  renderTabBtn = ({ key, icon, title, action, enabled, style }) => {
    return (
      <ImageButton
        key={key}
        containerStyle={[styles.tabBtn, style]}
        iconBtnStyle={styles.imgBtn}
        titleStyle={styles.btnTitle}
        icon={icon}
        title={title}
        direction={'row'}
        onPress={action}
        enabled={enabled}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.hasTabBtn &&
          this.props.type !== 'MY_DATA' &&
          this.renderTabBtn({
            icon: this.props.canTabs
              ? getThemeAssets().attribute.rightbar_tool_select_layerlist
              : getThemeAssets().attribute.rightbar_tool_select_layerlist,
            key: '标签',
            action: this.tabsAction,
            enabled: this.props.canTabs,
            style: styles.tabBtn,
          })}
        {this.renderContentView()}
      </View>
    )
  }
}
