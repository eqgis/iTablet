/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import ToolbarModule from '../workspace/components/ToolBar/modules/ToolbarModule'
import React, { Component } from 'react'
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  SectionList,
  StyleSheet,
  RefreshControl,
} from 'react-native'
import { Container } from '../../components'
import { getPublicAssets, getThemeAssets } from '../../assets'
import { scaleSize, setSpText } from '../../utils'
import color from '../../styles/color'
import { getLanguage } from '../../language'
import { SMap } from 'imobile_for_reactnative'
import ImageButton from '../../components/ImageButton'
import NavigationService from '../NavigationService'
export default class NavigationDataChangePage extends Component {
  props: {
    navigation: Object,
    device: Object,
  }
  constructor(props) {
    super(props)
    let { params } = this.props.route
    this.state = {
      /**
       * [{
       *  title<String>, 'datasource'|'dataset'
       *  data<Array> [{
       *      selected<Boolean>, 是否选中
       *      name<String>, 室内数据源名或室外路网数据集名
       *      datasourceName<String>, 数据源名
       *      datasetName<String>?, 室外路网数据集名
       *      modelFileName<String>?, 室外导航模型文件名
       *      }]
       * }]
       */
      data: (params && params.data) || [],
      isRefresh: false,
    }
    /**
     * {
     *      selected<Boolean>, 是否选中
     *      name<String>, 室内数据源名或室外路网数据集名
     *      datasourceName<String>, 数据源名
     * }
     */
    this.selectedDatasources = params.selectedDatasources || []
    /**
     * {
     *      selected<Boolean>, 是否选中
     *      name<String>, 室内数据源名或室外路网数据集名
     *      datasourceName<String>, 数据源名
     *      datasetName<String>, 室外路网数据集名
     *      modelFileName<String>, 室外导航模型文件名
     * }
     */
    this.selectedDatasets = params.selectedDatasets || []
    this.currentDatasource = params.currentDatasource || []
    this.currentDataset = params.currentDataset || {}
  }

  componentDidMount() {
    //返回时更新数据
    this.focusListener = this.props.navigation.addListener(
      'willFocus',
      this.update,
    )
  }

  componentWillUnmount() {
    this.focusListener && this.focusListener()
  }

  /**
   * 点击复选框事件，设置选中 zhangxt
   * @param {*} item
   */
  _onPress = item => {
    let data = JSON.parse(JSON.stringify(this.state.data))
    let datasource = data[0]
    let dataset = data[1]
    datasource.data.map(val => {
      if (val.name === item.name) {
        val.selected = !val.selected
        if (val.selected) {
          this.selectedDatasources.push(val)
        } else {
          this.selectedDatasources.map((item, index) => {
            if (item.name === val.name) {
              this.selectedDatasources.splice(index, 1)
              this.currentDatasource.length > 0 &&
                this.currentDatasource.map((ds, pos) => {
                  if (ds.name === item.name) {
                    this.currentDatasource.splice(pos, 1)
                  }
                })
            }
          })
        }
      }
    })
    dataset.data.map(val => {
      //对比是否是同一数据源内的同一数据集 zhangxt
      if (
        val.name === item.name &&
        val.datasourceName === item.datasourceName
      ) {
        val.selected = !val.selected
        if (val.selected) {
          this.selectedDatasets.push(val)
        } else {
          this.selectedDatasets.map((item, index) => {
            //对比是否是同一数据源内的同一数据集 zhangxt
            if (
              item.name === val.name &&
              val.datasourceName === item.datasourceName
            ) {
              this.selectedDatasets.splice(index, 1)
              if (item.name === this.currentDataset.name) {
                this.currentDataset = {}
              }
            }
          })
        }
      }
    })
    data[0] = datasource
    data[1] = dataset
    this.setState({
      data,
    })
  }

  update =  async () => {
    try {
      let datas = await SMap.getAllNavData()
      const mapDatasource = datas[0]
      const mapDataset = datas[1]
      mapDatasource.data.map(item => {
        this.selectedDatasources &&
          this.selectedDatasources.map(ds => {
            if (item.name === ds.name) {
              item.selected = true
            }
          })
      })
      mapDataset.data.map(item => {
        this.selectedDatasets &&
          this.selectedDatasets.map(dt => {
            //对比是否是同一数据源内的同一数据集 zhangxt
            if (
              item.name === dt.name &&
              item.datasourceName === dt.datasourceName
            ) {
              item.selected = true
            }
          })
      })
      let data = [mapDatasource, mapDataset]
      this.setState({
        data,
        isRefresh: false,
      })
    } catch (e) {
      //
    }
  }

  /**
   * 手动下拉刷新 在新建室外数据集返回此页面时需要手动刷新才会显示出来 zhangxt
   */
  _onRefresh = async () => {
    this.setState(
      {
        isRefresh: true,
      },
      this.update
      ,
    )
  }

  /**
   * 跳转到新建室外数据集页面 zhangxt
   */
  _newNavData = () => {
    this.props.navigation.navigate('CreateNavDataPage', { cb: this.update })
  }

  /**
   * 确定按钮事件，设置导航使用的室内数据原和室外数据集 zhangxt
   */
  _confirm = () => {
    const _params = ToolbarModule.getParams()
    _params.setNavigationDatas &&
      _params.setNavigationDatas({
        selectedDatasets: this.selectedDatasets,
        selectedDatasources: this.selectedDatasources,
        currentDataset: this.currentDataset,
        currentDatasource: this.currentDatasource,
      })
    this.props.navigation.goBack()
  }

  _renderItem = ({ item, section }) => {
    let img = item.selected
      ? getPublicAssets().common.icon_check
      : getPublicAssets().common.icon_uncheck
    let typeImg =
      section.title === 'datasource'
        ? getThemeAssets().dataType.icon_data_source
        : getThemeAssets().layerType.layer_network
    let extraStyle = {},
      extraTxt = {}
    if (
      item.name === this.currentDataset.name ||
      this.currentDatasource.filter(p => p.name === item.name).length > 0
    ) {
      extraStyle = {
        borderLeftColor: color.blue1,
      }
      extraTxt = { color: color.blue1 }
    }
    return (
      <View style={styles.row}>
        <View style={[styles.info, extraStyle]}>
          <TouchableOpacity
            style={styles.imgWrap}
            onPress={() => {
              this._onPress(item)
            }}
          >
            <Image
              source={img}
              resizeMode={'contain'}
              style={styles.checkIcon}
            />
          </TouchableOpacity>
          <Image source={typeImg} resizeMode={'contain'} style={styles.icon} />
          <Text style={[styles.name, extraTxt]}>{item.name}</Text>
        </View>
        {this.renderLine()}
      </View>
    )
  }

  renderLine = () => {
    return (
      <View
        style={{
          width: '100%',
          height: 1,
          backgroundColor: color.separateColorGray,
        }}
      />
    )
  }

  _renderSectionHeader = ({ section }) => {
    let title,
      separate = false
    if (section.title === 'datasource') {
      title = getLanguage(global.language).Map_Main_Menu.INDOOR_DATASOURCE
      separate = false
    } else {
      title = getLanguage(global.language).Map_Main_Menu.OUTDOOR_DATASETS
      separate = true
    }
    return (
      <View>
        {separate && <View style={styles.sectionSeparate} />}
        <View style={styles.textContainer}>
          <View style={[styles.textWrapper, { justifyContent: 'flex-start' }]}>
            <Text style={styles.title}>{title}</Text>
          </View>
          {separate ? (
            <TouchableOpacity
              onPress={this._newNavData}
              style={styles.textWrapper}
            >
              <Text style={styles.actionTxt}>
                {getLanguage(global.language).Prompt.NEW}
              </Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>
        {this.renderLine()}
      </View>
    )
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(global.language).Map_Main_Menu.SWITCH_DATA,
          navigation: this.props.navigation,
          headerRight: (
            <ImageButton
              // containerStyle={styles.capture}
              iconStyle={{
                width: scaleSize(40),
                height: scaleSize(40),
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent',
              }}
              activeOpacity={0.5}
              icon={getThemeAssets().dataType.icon_newdata}
              onPress={() => {
                NavigationService.navigate("MapSelectList", { type: 'projectionSelect' ,cb:()=>{
                  setTimeout(() => {
                    this._onRefresh()
                  }, 1000)
                }})
              }}
            />
          ),
        }}
        style={{ paddingBottom: scaleSize(120) }}
      >
        <SectionList
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefresh}
              onRefresh={this._onRefresh}
              colors={['orange', 'red']}
              tintColor={'orange'}
              titleColor={'orange'}
              title={getLanguage(global.language).Friends.REFRESHING}
              enabled={true}
            />
          }
          sections={this.state.data}
          renderSectionHeader={this._renderSectionHeader}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => item.toString() + index}
          getItemLayout={(data, index) => ({
            length: 81,
            offset: 81 * index,
            index,
          })}
        />
        <TouchableOpacity style={styles.confirm} onPress={this._confirm}>
          <Text style={styles.confirmTxt}>
            {getLanguage(global.language).CONFIRM}
          </Text>
        </TouchableOpacity>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: setSpText(24),
  },
  textWrapper: {
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: scaleSize(40),
  },
  actionTxt: {
    color: color.item_selected_bg,
    fontSize: setSpText(24),
  },
  list: {
    maxHeight: scaleSize(650),
  },
  sectionSeparate: {
    width: '100%',
    height: scaleSize(20),
    backgroundColor: color.separateColorGray,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flex: 1,
    height: scaleSize(81),
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: scaleSize(30),
    borderLeftWidth: scaleSize(8),
    borderLeftColor: 'transparent',
  },
  imgWrap: {
    width: scaleSize(60),
    height: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  icon: {
    width: scaleSize(40),
    height: scaleSize(40),
    marginRight: scaleSize(10),
  },
  name: {
    flex: 1,
    fontSize: setSpText(20),
  },
  image: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  confirm: {
    position: 'absolute',
    bottom: scaleSize(60),
    left: 0,
    right: 0,
    height: scaleSize(60),
    marginHorizontal: scaleSize(60),
    borderRadius: scaleSize(30),
    backgroundColor: color.blue1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmTxt: {
    fontSize: setSpText(24),
    color: color.white,
  },
})
