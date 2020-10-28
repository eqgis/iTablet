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
import { screen, scaleSize } from '../../../../utils'

const itemGap = scaleSize(20)

export default class LayerTopBar extends React.Component {
  props: {
    locateAction: () => {},
    undoAction: () => {},
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
  }

  static defaultProps = {
    canTabs: true,
    canLocated: true,
    canUndo: false,
    canRelated: false,
    canAddField: false,
    hasTabBtn: false,
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

  addAttributeFieldAction = fieldInfo => {
    if (
      this.props.addFieldAction &&
      typeof this.props.addFieldAction === 'function'
    ) {
      this.props.addFieldAction(fieldInfo)
    }
  }
  
  renderContentView = () => {
    let data = [
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
          ? getThemeAssets().attribute.attribute_location
          : getThemeAssets().attribute.attribute_location,
        key: '定位',
        title: getLanguage(GLOBAL.language).Map_Attribute
          .ATTRIBUTE_LOCATION,
        action: this.locateAction,
        enabled: this.props.canLocated,
      },
      {
        icon: this.props.canRelated
          ? getThemeAssets().attribute.icon_attribute_browse
          : getPublicAssets().attribute.icon_attribute_browse,
        key: '关联',
        title: getLanguage(GLOBAL.language).Map_Attribute
          .ATTRIBUTE_ASSOCIATION,
        action: this.relateAction,
        enabled: this.props.canRelated,
      }
    ]
    
    let items = []
    data.forEach((item, index) => {
      if (index !== 0) {
        item = Object.assign(item, {
          containerStyle: {
            marginLeft: itemGap
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
