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
import { screen, scaleSize, LayerUtils } from '../../../../utils'
import ToolbarModule from '../../../workspace/components/ToolBar/modules/ToolbarModule'
import NavigationService from '../../../NavigationService'
import {
  SMap,
} from 'imobile_for_reactnative'

const itemGap = scaleSize(20)

export default class LayerTopBar extends React.Component {
  props: {
    locateAction: () => {},
    undoAction: () => {},
    deleteAction: () => {},
    refreshAction: () => {},
    relateAction: () => {},
    addFieldAction: () => {},
    tabsAction?: () => {}, // 显示侧滑栏
    attributesData: Array,
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
  }

  static defaultProps = {
    canTabs: true,
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
    const selectionAttribute = this.props.selectionAttribute
    const index = this.props.currentIndex
    const _params = ToolbarModule.getParams()
    const { currentLayer } = _params
    const layerAttribute = this.props.layerAttribute

    if (currentLayer) {
      let { datasourceAlias } = currentLayer // 标注数据源名称
      let { datasetName } = currentLayer // 标注图层名称
      if(this.props.islayerSelection){
        let info = await SMap.getDataNameByLayer(GLOBAL.SelectedSelectionAttribute.layerInfo.path)
        datasetName = info.datasetName
        datasourceAlias = info.datasourceAlias
      }
      NavigationService.navigate('Camera', {
        datasourceAlias,
        datasetName,
        index,
        attribute: true,
        selectionAttribute,
        layerAttribute,
        atcb: () => {
          if (
            this.props.refreshAction &&
            typeof this.props.refreshAction === 'function'
          ) {
            this.props.refreshAction()
          }
        },
      })
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
    let data
    data = [
      {
        icon: this.props.canAddField
          ? getPublicAssets().common.icon_plus
          : getPublicAssets().common.icon_plus_gray,
        key: '添加',
        title: getLanguage(GLOBAL.language).Map_Attribute
          .ATTRIBUTE_FIELD_ADD,
        action: this.addAttributeFieldAction,
        enabled: this.props.canAddField,
      },
      {
        icon: this.props.canLocated
          ? getThemeAssets().attribute.icon_location
          : getThemeAssets().attribute.icon_unlocation,
        key: '定位',
        title: getLanguage(GLOBAL.language).Map_Attribute
          .ATTRIBUTE_LOCATION,
        action: this.locateAction,
        enabled: this.props.canLocated,
      },
      {
        icon: this.props.canRelated
          ? getThemeAssets().attribute.icon_relation
          : getThemeAssets().attribute.icon_unrelation,
        key: '关联',
        title: getLanguage(GLOBAL.language).Map_Attribute
          .ATTRIBUTE_ASSOCIATION,
        action: this.relateAction,
        enabled: this.props.canRelated,
      },
      {
        icon: this.props.canDelete
          ? getThemeAssets().attribute.icon_delete_select
          : getThemeAssets().attribute.icon_delete_un_select,
        key: '删除',
        title: getLanguage(GLOBAL.language).Map_Main_Menu
          .EDIT_DELETE,
        action: this.deleteAction,
        enabled: this.props.canDelete,
      },
      {
        icon: this.props.canRelated
          ? getThemeAssets().mapTools.icon_tool_multi_media
          : getThemeAssets().mapTools.icon_tool_multi_media_ash,
        key: '拍照',
        title: getLanguage(GLOBAL.language).Map_Main_Menu.CAMERA,
        action: this.captureImage,
        enabled: this.props.canRelated,
      },
    ]

    if (this.props.selectionAttribute) {
      data = [
        {
          icon: this.props.canAddField
            ? getPublicAssets().common.icon_plus
            : getPublicAssets().common.icon_plus_gray,
          key: '添加',
          title: getLanguage(GLOBAL.language).Map_Attribute
            .ATTRIBUTE_FIELD_ADD,
          action: this.addAttributeFieldAction,
          enabled: this.props.canAddField,
        },
        {
          icon: this.props.canRelated
            ? getThemeAssets().attribute.icon_relation
            : getThemeAssets().attribute.icon_unrelation,
          key: '关联',
          title: getLanguage(GLOBAL.language).Map_Attribute
            .ATTRIBUTE_ASSOCIATION,
          action: this.relateAction,
          enabled: this.props.canRelated,
        },
        {
          icon: this.props.canDelete
            ? getThemeAssets().attribute.icon_delete_select
            : getThemeAssets().attribute.icon_delete_un_select,
          key: '删除',
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .EDIT_DELETE,
          action: this.deleteAction,
          enabled: this.props.canDelete,
        },
        {
          icon: this.props.canRelated
            ? getThemeAssets().mapTools.icon_tool_multi_media
            : getThemeAssets().mapTools.icon_tool_multi_media_ash,
          key: '拍照',
          title: getLanguage(GLOBAL.language).Map_Main_Menu.CAMERA,
          action: this.captureImage,
          enabled: this.props.canRelated,
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
