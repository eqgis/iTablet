/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { TouchableOpacity, FlatList, Image, Text, View, InteractionManager } from 'react-native'
import { Container } from '../../../../components'
import { getLayerIconByType } from '../../../../assets'
import { ListSeparator } from '../../../../components'
import NavigationService from '../../../../containers/NavigationService'
import { DatasetType } from 'imobile_for_reactnative'
import styles from './styles'
import { getLanguage } from '../../../../language'
import { SMap } from 'imobile_for_reactnative'

export default class TemplateSource extends React.Component {
  props: {
    language: string,
    navigation: Object,
    device: Object,
    layers: Array,
  }

  constructor(props) {
    super(props)
    let { params } = this.props.route
    this.type = (params && params.type) || 'datasource'
    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    // 偶尔某个动画一直执行,导致runAfterInteractions中的方法一直不执行
    // InteractionManager.runAfterInteractions(() => {
    this.getSources()
    // })
  }

  getSources = async () => {
    let { params } = this.props.route
    let data = []
    if (this.type && params.datasource) {
      // 选择数据集
      let _data = (await SMap.getDatasetsByDatasource(params.datasource)).list
      if (_data.length > 0) {
        for (let item of _data) {
          if (
            item.datasetType === DatasetType.POINT ||
            item.datasetType === DatasetType.LINE ||
            item.datasetType === DatasetType.REGION ||
            item.datasetType === DatasetType.CAD
          ) {
            data.push(item)
          }
        }
      }
    } else {
      // 选择数据源
      let _data = await SMap.getLocalDatasources()
      for (let item of _data) {
        if (!(item.alias.startsWith('Label_') && item.alias.endsWith('#'))) {
          data.push(item)
        }
      }
    }
    this.setState({
      data,
    })
  }

  create = () => {
    NavigationService.navigate('TemplateDetail')
  }

  onItemPress = ({ item, index }) => {
    let { params } = this.props.route
    let cb = params && params.cb
    if (cb && typeof cb === 'function') {
      cb({ data: item, index, type: this.type })
    }
    NavigationService.goBack('TemplateSource')
  }

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => {
          this.onItemPress({ item, index })
        }}
      >
        {item.datasetType && (
          <View style={styles.iconView}>
            <Image
              style={
                item.datasetType === DatasetType.POINT
                  ? styles.smallIcon
                  : styles.icon
              }
              resizeMode={'contain'}
              source={getLayerIconByType(item.datasetType)}
            />
          </View>
        )}
        <Text
          numberOfLines={1}
          style={[styles.itemText, item.datasetType && { marginLeft: 10 }]}
        >
          {item.alias || item.datasetName}
        </Text>
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
          title:
            this.type === 'datasource'
              ? getLanguage(this.props.language).Map_Settings.DATASOURCES
              : getLanguage(this.props.language).Map_Settings.DATASETS,
          navigation: this.props.navigation,
        }}
      >
        <FlatList
          data={this.state.data}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this._renderItemSeparatorComponent}
          keyExtractor={(item, index) => index.toString()}
        />
      </Container>
    )
  }
}
