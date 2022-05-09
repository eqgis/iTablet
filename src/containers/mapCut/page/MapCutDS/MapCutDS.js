/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, Image, Text, FlatList, TouchableOpacity } from 'react-native'
import { Container, MTBtn } from '../../../../components'
import NavigationService from '../../../NavigationService'
import { color } from '../../../../styles'
import styles from '../../styles'
import FileTools from '../../../../native/FileTools'
import { getLanguage } from '../../../../language'

export default class MapCutDS extends React.Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    let { params } = this.props.route
    this.state = {
      data: params ? params.data : [],
    }

    this.currentUser = params && params.currentUser
    this.cb = params && params.cb
    this.changeDSData = null
  }

  _getAvailableName = (name, fileList) => {
    let AvailabeName = name
    if (this._isInlList(AvailabeName, fileList)) {
      for (let i = 1; ; i++) {
        AvailabeName = `${name}_${i}`
        if (!this._isInlList(AvailabeName, fileList)) {
          return AvailabeName
        }
      }
    } else {
      return AvailabeName
    }
  }

  _isInlList = (name, fileList) => {
    for (let i = 0; i < fileList.length; i++) {
      if (name === fileList[i].alias) {
        return true
      }
    }
    return false
  }

  newDatasource = async () => {
    let homeDir = await FileTools.getHomeDirectory()
    NavigationService.navigate('InputPage', {
      headerTitle: getLanguage(global.language).Map_Main_Menu.NEW_DATASOURCE,
      type: 'name',
      cb: async value => {
        value = this._getAvailableName(value, this.state.data)
        let params = {
          alias: value,
          engineType: 219,
          server: `${homeDir}/iTablet/User/${
            this.currentUser.userName
          }/Data/Datasource/${value}.udb`,
        }
        let data = this.state.data.concat()
        data.push(params)
        this.setState(
          {
            data,
          },
          () => {
            NavigationService.goBack()
          },
        )
      },
    })
  }
  renderDSItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.dsItem}
        onPress={() => {
          this.cb && this.cb({ item, index })
          NavigationService.goBack()
        }}
        activeOpacity={1}
      >
        <Image
          resizeMode="contain"
          style={styles.dsItemIcon}
          source={require('../../../../assets/Mine/mine_my_online_data.png')}
        />
        <Text style={styles.dsItemText}>{item.alias}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={styles.container}
        headerProps={{
          title: getLanguage(global.language).Map_Main_Menu.MAP_CLIP,
          navigation: this.props.navigation,
          backAction: () => {
            this.cb && this.cb({ msg: 'showModal' })
            NavigationService.goBack()
          },
          headerRight: [
            <MTBtn
              key={'newDatasource'}
              title={getLanguage(global.language).Map_Main_Menu.NEW_DATASOURCE}
              textStyle={styles.headerBtnTitle}
              onPress={this.newDatasource}
            />,
          ],
        }}
      >
        <FlatList
          data={this.state.data}
          style={styles.dsListView}
          renderItem={this.renderDSItem}
          keyExtractor={item => item.alias}
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
      </Container>
    )
  }
}
