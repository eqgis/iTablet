/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View, ScrollView, ViewStyle, Image, Text, ImageSourcePropType } from 'react-native'
import { getImage } from '../../../../../../../assets'
import styles from './styles'
import { getLanguage } from '../../../../../../../language'
import { scaleSize  } from '../../../../../../../utils'
import { TouchableOpacity } from 'react-native-gesture-handler'

const itemGap = scaleSize(20)

interface ButtonParams {
  key: string,
  icon: ImageSourcePropType,
  title?: string,
  action: () => void,
  enabled: boolean,
  style?: ViewStyle,
}

interface Props {
  deleteAction?: () => void,
  addFieldAction?: () => void,
  showSystemFields?: () => void,
  tabsAction?: () => void, // 显示侧滑栏
  hasAddField?: boolean, // 是否有添加属性按钮
  hasShowSystemFields?: boolean, // 是否显示系统字段性按钮
  isShowSystemFields?: boolean, // 是否显示系统字段
  canTabs?: boolean, // 是否可点击切换标签
  hasTabBtn?: boolean, // 是否可点击关联
  canAddField?: boolean, // 是否可点击添加属性
  canDelete?: boolean, //是否可以点击删除
  type?: string,//我的里面会传一个type过来
}

export default class LayerTopBar extends React.Component<Props> {

  static defaultProps = {
    canTabs: true,
    hasAddField: true,
    hasShowSystemFields: true,
    canAddField: false,
    hasTabBtn: false,
    canDelete: false,
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      attribute: {},
    }
  }

  tabsAction = () => {
    if (this.props.tabsAction && typeof this.props.tabsAction === 'function') {
      this.props.tabsAction()
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

  addAttributeFieldAction = () => {
    if (
      this.props.addFieldAction &&
      typeof this.props.addFieldAction === 'function'
    ) {
      this.props.addFieldAction()
    }
  }

  showSystemFields = () => {
    if (
      this.props.showSystemFields &&
      typeof this.props.showSystemFields === 'function'
    ) {
      this.props.showSystemFields()
    }
  }

  renderContentView = () => {
    const data: ButtonParams[] = []
    if (this.props.hasAddField) {
      data.push({
        icon: this.props.canAddField
          ? getImage().icon_plus
          : getImage().icon_plus_gray,
        key: '添加',
        title: getLanguage()
          .ATTRIBUTE_FIELD_ADD,
        action: this.addAttributeFieldAction,
        enabled: !!this.props.canAddField,
      })
    }
    if (this.props.hasShowSystemFields) {
      data.push({
        icon: this.props.isShowSystemFields
          ? getImage().icon_visible
          : getImage().icon_invisible,
        key: '系统字段',
        title: this.props.isShowSystemFields
          ? getLanguage().Common.SHOW
          : getLanguage().Common.HIDE,
        action: this.showSystemFields,
        enabled: true,
      })
    }

    // data = data.concat([
    //   {
    //     icon: this.props.canDelete
    //       ? getThemeAssets().attribute.icon_delete_select
    //       : getThemeAssets().attribute.icon_delete_un_select,
    //     key: '删除',
    //     title: getLanguage(GLOBAL.language).Map_Main_Menu
    //       .EDIT_DELETE,
    //     action: this.deleteAction,
    //     enabled: this.props.canDelete,
    //   },
    // ])
    const items: React.ReactNode[] = []
    data.forEach((item, index) => {
      if (index !== 0) {
        item = Object.assign(item, {
          containerStyle: {
            marginLeft: itemGap,
          },
        })
      }
      items.push(this.renderBtn(item, index))
    })

    return (
      <ScrollView
        horizontal={true}
        contentContainerStyle={styles.rightScrollList}
        showsHorizontalScrollIndicator={false}
      >
        {items}
      </ScrollView>
    )
  }

  renderBtn = (params: ButtonParams, index: number) => {
    return (
      <TouchableOpacity
        key={index+''}
        style={styles.tabBtn}
        onPress={() => params.action()}
      >
        <Image style={styles.imgBtn} source={params.icon}/>
        <Text style={styles.btnTitle} >{params.title}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {/* {this.props.hasTabBtn &&
          this.renderBtn({
            icon: getImage().drawer,
            key: '标签',
            action: this.tabsAction,
            enabled: !!this.props.canTabs,
            style: styles.tabBtn,
          })} */}
        {this.renderContentView()}
      </View>
    )
  }
}
