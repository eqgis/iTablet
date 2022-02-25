/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { FlatList, View, Text, TouchableOpacity } from 'react-native'
import { scaleSize } from '../../../utils'
import { color } from '../../../styles'
import { getLanguage } from '../../../language'
import { ChunkType } from '../../../constants'
import {
  Container,
} from '../../../components'
import { ConfigUtils } from 'imobile_for_reactnative'
import { mapModules } from '../../../../configs/mapModules'
import AppletItem from './AppletItem'

import styles from './styles'
// import TouchableOpacity from 'react-native-gesture-handler/touchables/TouchableOpacity'

export default class AppletList extends React.Component {
  props: {
    navigation: Object,
    user: Object,
    language: string,
    appConfig: Object,
  
    setMapModule: () => {},
    setOldMapModule: () => {},
  }

  constructor(props) {
    super(props)
    let { params } = this.props.navigation.state
    this.refreshApplets = params.refresh || (() => {})
    this.state = {
      data: params && params.data || [],
      selected: (new Map(): Map<string, boolean>),
    }
  }
  
  setApplets = async () => {
    let _data = JSON.parse(JSON.stringify(this.state.data))
    let applets = [] // redux使用的对象数组
    let _applets = [] // 本地文件的字符串数组
    
    // 添加系统默认模块
    Object.keys(ChunkType).map(key => {
      for (let i = 0; i < mapModules.length; i++) {
        if (ChunkType[key] === mapModules[i].key) {
          applets.push(mapModules[i])
          _applets.push(mapModules[i].key)
        }
      }
    })
    
    // 添加自定义已添加小程序
    this.state.selected.forEach(async (value,key) => {
      for (let i = 0; i < mapModules.length; i++) {
        if (key !== mapModules[i].key && _applets.indexOf(mapModules[i].key) < 0) {
          applets.push(mapModules[i])
          _applets.push(mapModules[i].key)
        }
      }
      for (let j = 0; j < _data.length; j++) {
        if (_data[j].fileName === key) {
          _data.splice(j, 1)
        }
      }
      await this.props.setOldMapModule(key)
    })
    
    this.props.setMapModule(applets)
    ConfigUtils.recordApplets(this.props.user.currentUser.userName, _applets)
    if (JSON.stringify(_data) !== JSON.stringify(this.state.data)) {
      this.setState({
        data: _data,
      })
      this.refreshApplets()
    }
  }

  _renderItem = ({ item, index }) => {
    return (
      <AppletItem
        key={index}
        data={item}
        selected={!!this.state.selected.get(item.fileName)}
        onPress={({data}) => {
          this.setState(state => {
            const selected = new Map(state.selected)
            const isSelected = selected.get(data.fileName)
            if (isSelected) {
              selected.delete(data.fileName)
            } else {
              selected.set(data.fileName, data)
            }
            return { selected }
          })
        }}
      />
    )
  }
  
  _renderItemSeparatorComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          height: 1,
          marginLeft: scaleSize(196),
          marginRight: 0,
          backgroundColor: color.gray5,
        }}
      />
    )
  }
  
  _renderButton = () => {
    return (
      <TouchableOpacity
        style={styles.btn}
        activeOpacity={0.8}
        onPress={this.setApplets}
      >
        <Text style={styles.btnTitle}>{getLanguage(this.props.language).Map_Layer.LAYERS_REMOVE}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(this.props.language).Profile.MY_APPLET,
          navigation: this.props.navigation,
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(90),
            borderBottomWidth: 0,
          },
        }}
      >
        <View style={styles.container}>
          <FlatList
            data={this.state.data}
            renderItem={this._renderItem}
            ItemSeparatorComponent={this._renderItemSeparatorComponent}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.state.selected}
          />
          {this._renderButton()}
        </View>
      </Container>
    )
  }
}
