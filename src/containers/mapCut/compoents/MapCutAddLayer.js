/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { PopView, ImageButton } from '../../../components'
import { color } from '../../../styles'
import { CheckStatus } from '../../../constants'
import { getPublicAssets } from '../../../assets'
import { getLanguage } from '../../../language'
import { scaleSize } from '../../../utils'
import MapCutAddLayerListItem from './MapCutAddLayerListItem'
import styles from '../styles'

export default class MapCutAddLayer extends React.Component {
  props: {
    layers: Array,
    confirmTitle: String,
    cancelTitle: String,
    configAction?: () => {},
  }

  static defaultProps = {
    confirmTitle: '确定',
    cancelTitle: '取消',
  }

  constructor(props) {
    super(props)

    this.state = {
      selectedData: (new Map(): Map<string, Object>),
      selectAll: false,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate =
      JSON.stringify(this.props.layers) !== JSON.stringify(nextProps.layers)
    shouldUpdate =
      shouldUpdate || !this.state.selectedData.compare(nextState.selectedData)
      || !this.state.selectAll !== nextState.selectAll
    return shouldUpdate
  }

  showModal = isShow => {
    this.addLayerModal && this.addLayerModal.setVisible(isShow)
  }

  onSelect = item => {
    this.setState(state => {
      const selectedData = new Map().clone(state.selectedData)
      let selectAll = state.selectAll
      if (selectedData.has(item.name)) {
        selectedData.delete(item.name)
        if (selectedData.size < this.props.layers.length && selectAll) {
          selectAll = false
        }
      } else {
        selectedData.set(item.name, item)
        if (selectedData.size === this.props.layers.length && !selectAll) {
          selectAll = true
        }
      }
      return { selectedData, selectAll }
    })
  }
  
  /** 多选框 **/
  renderCheckButton = () => {
    let icon = this.state.selectAll
      ? getPublicAssets().common.icon_check
      : getPublicAssets().common.icon_uncheck
    return (
      <ImageButton
        iconBtnStyle={styles.selectImgView}
        iconStyle={styles.selectImg}
        icon={icon}
        onPress={() => {
          this.setState(state => {
            let selectAll = !this.state.selectAll
            const selectedData = new Map().clone(state.selectedData)
            for (let item of this.props.layers) {
              if (selectAll && !selectedData.has(item.name)) {
                selectedData.set(item.name, item)
              } else if (!selectAll && selectedData.has(item.name)) {
                selectedData.delete(item.name)
              }
            }
            
            return { selectedData, selectAll }
          })
        }}
      />
    )
  }
  
  _renderTop = () => {
    return (
      <View style={styles.popTopView}>
        {this.renderCheckButton()}
        <Text style={[styles.content, {marginLeft: scaleSize(30)}]}>{getLanguage(global.language).Profile.SELECT_ALL}</Text>
      </View>
    )
  }

  _renderItem = ({ item }) => {
    return (
      <MapCutAddLayerListItem
        data={item}
        onSelect={this.onSelect}
        selected={this.state.selectedData.has(item.name)}
      />
    )
  }

  renderBottom = () => {
    return (
      <View style={[styles.settingBtnView, { width: '100%' }]}>
        <TouchableOpacity
          style={styles.settingBtn}
          onPress={() =>
            this.addLayerModal && this.addLayerModal.setVisible(false)
          }
        >
          <Text style={styles.closeText}>{this.props.cancelTitle}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingBtn}
          onPress={() => {
            this.addLayerModal && this.addLayerModal.setVisible(false)
            this.props.configAction &&
              this.props.configAction(this.state.selectedData)
            this.setState(state => {
              let selectedData = new Map().clone(state.selectedData)
              selectedData.clear()
              return { selectedData }
            })
          }}
        >
          <Text style={styles.closeText}>{this.props.confirmTitle}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <PopView ref={ref => (this.addLayerModal = ref)}>
        <View style={[styles.popView, { width: '100%' }]}>
          {this._renderTop()}
          <FlatList
            style={styles.dsList}
            initialNumToRender={20}
            ref={ref => (this.ref = ref)}
            renderItem={this._renderItem}
            data={this.props.layers}
            keyExtractor={item => item.name}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  backgroundColor: color.separateColorGray,
                  flex: 1,
                  height: 1,
                }}
              />
            )}
          />
          {this.renderBottom()}
        </View>
      </PopView>
    )
  }
}
