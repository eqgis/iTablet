/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import {
  TouchableOpacity,
  FlatList,
  Text,
  RefreshControl,
  View,
} from 'react-native'
import {
  Container,
  TextBtn,
} from '../../../../components'
import { FileTools } from '../../../../native'
import { ListSeparator } from '../../../../components'
import NavigationService from '../../../../containers/NavigationService'
import styles from './styles'
import { getLanguage } from '../../../../language'
import ConstPath from '../../../../constants/ConstPath'
import { XMLUtil } from '../../utils'

import fs from 'react-native-fs'
import xml2js from 'react-native-xml2js'
const parser = new xml2js.Parser()

export default class TemplateManager extends React.Component {
  props: {
    language: string,
    navigation: Object,
    device: Object,
    nav: Object,
    map: Array,
    currentUser: string,
    layers: Array,
    getLayers: () => {},
  }
  
  state = {
    data: [],
    popData: [],
    isRefresh: false,
  }
  
  componentDidMount() {
    this.openTemplateList()
  }
  
  openTemplateList = async () => {
    this.Container.setLoading(true)
    let userTemplatePath = await FileTools.appendingHomeDirectory(ConstPath.UserPath)
      + this.props.currentUser.userName + '/' + ConstPath.RelativePath.Template
    let templateList = await FileTools.getPathListByFilter(userTemplatePath, {extension: 'xml'})
    for (let i = 0; i < templateList.length; i++) {
      templateList[i].name = templateList[i].name.slice(0, templateList[i].name.lastIndexOf('.'))
    }
    this.setState({
      data: templateList,
    }, () => {
      this.Container.setLoading(false)
    })
  }
  
  create = () => {
    NavigationService.navigate('TemplateDetail', {
      cb: () => {
        this.openTemplateList()
      }
    })
  }
  
  onItemPress = async ({ item, index }) => {
    let path = await FileTools.appendingHomeDirectory(item.path)
    XMLUtil.readXML(path, data => {
      NavigationService.navigate('TemplateDetail', {
        title: item.name,
        data,
        path,
      })
    })
  }
  
  renderItem = ({ item, index }) => {
    let templateName = ''
    let templatePath = this.props.map.currentMap.Template
    if (templatePath) {
      templateName = this.props.map.currentMap.Template.slice(templatePath.lastIndexOf('/') + 1, templatePath.lastIndexOf('.'))
    }
    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => {
          this.onItemPress({ item, index })
        }}
      >
        <Text
          numberOfLines={1}
          style={styles.itemText}
        >
          {item.name || item}
        </Text>
        {
          templateName && templateName === item.name &&
          <View style={styles.currentView}>
            <Text style={styles.currentText}>
              {getLanguage(this.props.language).Template.CURRENT_TEMPLATE}
            </Text>
          </View>
        }
      </TouchableOpacity>
    )
  }
  
  _renderItemSeparatorComponent = () => {
    return <ListSeparator />
  }
  
  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        navigation={this.props.navigation}
        headerProps={{
          title: getLanguage(this.props.language).Template.COLLECTION_TEMPLATE_MANAGEMENT,
          navigation: this.props.navigation,
          // backAction: this.back,
          headerRight: (
            <TextBtn
              btnText={getLanguage(this.props.language).Prompt.CREATE}
              textStyle={styles.headerBtnTitle}
              btnClick={this.create}
            />
          ),
        }}
      >
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefresh}
              onRefresh={this.openTemplateList}
              colors={['orange', 'red']}
              tintColor={'orange'}
              titleColor={'orange'}
              title={getLanguage(GLOBAL.language).Friends.LOADING}
              enabled={true}
            />
          }
          data={this.state.data}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this._renderItemSeparatorComponent}
          keyExtractor={(item, index) => index.toString()}
        />
      </Container>
    )
  }
}