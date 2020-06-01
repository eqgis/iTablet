import React, { Component } from 'react'
import { Container, TextBtn, SearchBar } from '../../../../components'
import { AnalystItem, PopModalList } from '../../components'
import styles from './styles'
import { getLanguage } from '../../../../language'
import { scaleSize, Toast } from '../../../../utils'
import { getThemeAssets } from '../../../../assets'
import { color, size } from '../../../../styles'
import { View, Text, SectionList, TouchableOpacity, Image } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { SMap, SProcess } from 'imobile_for_reactnative'
import { getLayerIconByType, getLayerWhiteIconByType } from '../../../../assets'

const popTypes = {
  DataSource: 'DataSource',
  DataSet: 'DataSet',
  TransMothodData: 'TransMothodData',
  ResultDataSource: 'ResultDataSource',
  ResultDataSet: 'ResultDataSet',
}

export default class ProjectionTargetCoordsPage extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    // const { params } = this.props.navigation.state
    // let _transMothodParameter = params.transMothodParameter
    // this.cb = params && params.cb

    this.isLoadingData = false //是否正在加载数据

    this._allGeoCoordSysTypes = undefined
    this._allPrjCoordSysTypes = undefined

    this.state = {
      // currentPage: 0,
      dataSource: null, //源数据源
      dataSet: null, //源数据集
      coordSysData: [], //坐标系数据
      showCoordSysData: [], //展示的坐标系数据
      allGeoCoordSysTypes: [], //所有地理坐标系类型
      allPrjCoordSysTypes: [], //所有投影坐标系类型

      coordSysSelectItem: null, //选中的坐标系类型
      // 弹出框数据
      popData: [],
      currentPopData: null,
    }
  }

  componentDidMount = async () => {
    //获取地理坐标系类型
    let allGeoCoordSysTypes = await SProcess.getGeoCoordSysTypes()
    this._allGeoCoordSysTypes = allGeoCoordSysTypes

    //获取投影坐标系类型
    let allPrjCoordSysTypes = await SProcess.getPrjCoordSysTypes()
    this._allPrjCoordSysTypes = allPrjCoordSysTypes

    let geoCoordSysTypes = allGeoCoordSysTypes.slice(0, 20)
    let prjCoordSysTypes = allPrjCoordSysTypes.slice(0, 20)

    let _data = [
      {
        title: getLanguage(global.language).Analyst_Labels.GEOCOORDSYS,
        //'地理坐标系',
        data: geoCoordSysTypes,
        visible: false,
        index: 0,
        allData: allGeoCoordSysTypes,
      },
      {
        title: getLanguage(global.language).Analyst_Labels.PRJCOORDSYS,
        //'投影坐标系',
        data: prjCoordSysTypes,
        visible: false,
        index: 1,
        allData: allPrjCoordSysTypes,
      },
    ]
    this.setState({
      coordSysData: _data,
      allGeoCoordSysTypes: allGeoCoordSysTypes,
      allPrjCoordSysTypes: allPrjCoordSysTypes,
    })
  }
  getData = async () => {}

  confirm = () => {
    if (!this.state.coordSysSelectItem) {
      Toast.show(
        getLanguage(global.language).Analyst_Labels.REGISTRATION_PLEASE_SELECT +
          getLanguage(global.language).Analyst_Labels.TARGET_COORDS,
      )
      return
    }
    if (this.cb && typeof this.cb === 'function') {
      this.cb(this.state.coordSysSelectItem)
    }
  }

  getDataSources = async () => {
    // let datasources = await SMap.getDatasetsByWorkspaceDatasource()
    // return datasources

    let dss = []
    let datasources = await SMap.getDatasetsByWorkspaceDatasource()
    datasources.forEach(item => {
      item.key = item.alias
      item.value = item.key
      dss.push(item)
    })
    return dss
  }

  getDataSets = () => {
    let dss = []
    let dataSets = this.state.dataSource
    dataSets.data.forEach(item => {
      item.key = item.datasetName
      item.value = item.key
      dss.push(item)
    })
    return dss
  }
  /** 选择数据源弹出框 **/
  renderPopList = () => {
    return (
      <PopModalList
        ref={ref => (this.popModal = ref)}
        language={global.language}
        popData={this.state.popData}
        currentPopData={this.state.currentPopData}
        confirm={async data => {
          let newStateData = {}
          switch (this.currentPop) {
            case popTypes.DataSource: {
              newStateData = { dataSource: data, dataSet: null }
              break
            }
            case popTypes.DataSet: {
              let _coordSysSelectItem = {
                title: data.coordName,
                value: data.priCoordSysType,
              }
              newStateData = {
                dataSet: data,
                coordSysSelectItem: _coordSysSelectItem,
              }
              break
            }
            case popTypes.TransMothodData: {
              newStateData = {
                transMothodData: data,
                transMothodParameter: null,
              }
              break
            }
            case popTypes.ResultDataSource:
              newStateData = { resultDataSource: data, dataSet: null }
              break
            case popTypes.ResultDataSet:
              newStateData = { resultDataSet: data }
              break
          }
          this.setState(newStateData, () => {
            this.popModal && this.popModal.setVisible(false)
          })
        }}
      />
    )
  }

  _renderItem = info => {
    if (info.section.visible) {
      return (
        <View
          style={{
            width: '100%',
            height: scaleSize(80),
          }}
        >
          {info.index != 0 ? <View style={styles.lineStyle} /> : null}
          <TouchableOpacity
            style={[
              styles.leftWrap,
              {
                backgroundColor:
                  this.state.coordSysSelectItem &&
                  this.state.coordSysSelectItem.value === info.item.value
                    ? color.blue1
                    : color.white,
              },
            ]}
            onPress={() => {
              let newItem = info.item
              if (
                this.state.coordSysSelectItem &&
                this.state.coordSysSelectItem.value === info.item.value
              ) {
                newItem = null
              }
              this.setState({
                coordSysSelectItem: newItem,
              })
            }}
          >
            <Text style={styles.rightItem} numberOfLines={1}>
              {info.item.title}
            </Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return <View />
    }
  }
  refreshList = section => {
    let newData = this.state.coordSysData
    for (let i = 0; i < newData.length; i++) {
      if (i === section.index) {
        section.visible = !section.visible
        newData[section.index] = section
      } else {
        newData[i].visible = false
      }
      if (!newData[i].visible) {
        let _allData = []
        _allData = newData[i].allData
        let _data = _allData.slice(0, 20)
        newData[i].data = _data
      }
    }
    this.setState({
      coordSysData: newData.concat(),
    })
  }
  renderSection = ({ section }) => {
    let image = section.visible
      ? getThemeAssets().publicAssets.icon_arrow_down
      : getThemeAssets().publicAssets.icon_arrow_right_2
    return (
      <TouchableOpacity
        style={{
          height: scaleSize(80),
          backgroundColor: color.bgW,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => {
          this.refreshList(section)
        }}
      >
        <Image
          source={image}
          style={{
            width: scaleSize(40),
            height: scaleSize(40),
            marginLeft: scaleSize(20),
          }}
        />
        <Text
          style={{
            marginLeft: scaleSize(25),
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: size.fontSize.fontSizeXXl,
            color: color.content,
          }}
        >
          {section.title}
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        />
      </TouchableOpacity>
    )
  }

  // Container
  onEndReached = async info => {
    if (info) {
      let newData = this.state.coordSysData
      for (let i = 0; i < newData.length; i++) {
        if (newData[i].visible) {
          let length = newData[i].data.length
          length += 20
          let _allData = []
          _allData = newData[i].allData
          // let _data = _allData.reverse().filter((item,index,_allData) =>{return index <length}).reverse();
          let _data = _allData.slice(0, length)
          newData[i].data = _data
        }
      }
      // section.visible = !section.visible
      // newData[section.index] = section
      this.setState({
        coordSysData: newData.concat(),
      })
    }
    // if (this.dataInitialized) { // 首次加载过数据
    //   if (!this.isLoadingData) { // 防止快速多次调用
    //     this.isLoadingData = true;
    //     await this.loadMoreData();
    //     this.isLoadingData = false;
    //   }
    // }
  }
  //坐标系列表
  renderCoordSysList = () => {
    return (
      <View style={{ flex: 1, height: '100%' }}>
        <SectionList
          // refreshing={this.state.refreshing}
          // onRefresh={() => {
          //   this.setRefreshing(true)
          //   this.getData()
          // }}
          style={{ height: '100%' }}
          ref={ref => (this.listView = ref)}
          sections={this.state.coordSysData}
          renderItem={this._renderItem}
          renderSectionHeader={this.renderSection}
          getItemLayout={this.getItemLayout}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={20}
          ItemSeparatorComponent={this.renderItemSeparator}
          renderSectionFooter={this.renderSectionFooter}
          // ListFooterComponent={<View style={{height:500}}/>}
          onEndReachedThreshold={0.1}
          onEndReached={this.onEndReached}
        />
      </View>
    )
  }

  search = searchKey => {
    if (!(this._allGeoCoordSysTypes && this._allPrjCoordSysTypes)) {
      GLOBAL.Loading.setLoading(false)
      return
    }
    // searchKey
    if (searchKey === '') {
      let allGeoCoordSysTypes = this._allGeoCoordSysTypes
      let allPrjCoordSysTypes = this._allPrjCoordSysTypes

      let geoCoordSysTypes = allGeoCoordSysTypes.slice(0, 20)
      let prjCoordSysTypes = allPrjCoordSysTypes.slice(0, 20)

      let _data = [
        {
          title: getLanguage(global.language).Analyst_Labels.GEOCOORDSYS,
          //'地理坐标系',
          data: geoCoordSysTypes,
          visible: false,
          index: 0,
          allData: allGeoCoordSysTypes,
        },
        {
          title: getLanguage(global.language).Analyst_Labels.PRJCOORDSYS,
          //'投影坐标系',
          data: prjCoordSysTypes,
          visible: false,
          index: 1,
          allData: allPrjCoordSysTypes,
        },
      ]
      this.setState({
        coordSysData: _data,
        allGeoCoordSysTypes: allGeoCoordSysTypes,
        allPrjCoordSysTypes: allPrjCoordSysTypes,
      })
    } else {
      let allGeoCoordSysTypes = []
      let allPrjCoordSysTypes = []

      for (let i = 0; i < this._allGeoCoordSysTypes.length; i++) {
        if (this._allGeoCoordSysTypes[i].title.indexOf(searchKey) != -1) {
          allGeoCoordSysTypes.push(this._allGeoCoordSysTypes[i])
        }
      }
      for (let i = 0; i < this._allPrjCoordSysTypes.length; i++) {
        if (this._allPrjCoordSysTypes[i].title.indexOf(searchKey) != -1) {
          allPrjCoordSysTypes.push(this._allPrjCoordSysTypes[i])
        }
      }

      let geoCoordSysTypes =
        allGeoCoordSysTypes.length > 20
          ? allGeoCoordSysTypes.slice(0, 20)
          : allGeoCoordSysTypes
      let prjCoordSysTypes =
        allPrjCoordSysTypes.length > 20
          ? allPrjCoordSysTypes.slice(0, 20)
          : allPrjCoordSysTypes

      let geoCoordVisiable = allGeoCoordSysTypes.length !== 0
      let prjCoordVisiable = allGeoCoordSysTypes.length === 0

      let _data = [
        {
          title: getLanguage(global.language).Analyst_Labels.GEOCOORDSYS,
          //'地理坐标系',
          data: geoCoordSysTypes,
          visible: geoCoordVisiable,
          index: 0,
          allData: allGeoCoordSysTypes,
        },
        {
          title: getLanguage(global.language).Analyst_Labels.PRJCOORDSYS,
          //'投影坐标系',
          data: prjCoordSysTypes,
          visible: prjCoordVisiable,
          index: 1,
          allData: allPrjCoordSysTypes,
        },
      ]
      this.setState({
        coordSysData: _data,
        allGeoCoordSysTypes: allGeoCoordSysTypes,
        allPrjCoordSysTypes: allPrjCoordSysTypes,
      })
    }
    GLOBAL.Loading.setLoading(false)
  }

  renderSearchBar = () => {
    return (
      <SearchBar
        style={{
          marginHorizontal: scaleSize(20),
          marginVertical: scaleSize(10),
          height: scaleSize(60),
        }}
        ref={ref => (this.searchBar = ref)}
        onSubmitEditing={searchKey => {
          GLOBAL.Loading.setLoading(
            true,
            getLanguage(global.language).Prompt.SEARCHING,
          )
          this.search(searchKey)
        }}
        onClear={() => {
          this.search('')
        }}
        placeholder={getLanguage(global.language).Prompt.ENTER_KEY_WORDS}
        //{'请输入搜索关键字'}
      />
    )
  }

  //源数据部分界面
  renderTop() {
    return (
      <View style={{ backgroundColor: color.white }}>
        <View style={[styles.titleView, { backgroundColor: color.white }]}>
          <Text style={styles.title}>
            {getLanguage(global.language).Analyst_Labels.SOURCE_DATA}
          </Text>
        </View>
        <AnalystItem
          // style={{ marginRight: scaleSize(0) }}
          title={getLanguage(global.language).Analyst_Labels.DATA_SOURCE}
          value={(this.state.dataSource && this.state.dataSource.value) || ''}
          onPress={async () => {
            this.currentPop = popTypes.DataSource
            let datasources = await this.getDataSources()
            this.setState(
              {
                popData: datasources,
                currentPopData: this.state.dataSource,
              },
              () => {
                this.popModal && this.popModal.setVisible(true)
              },
            )
          }}
        />
        <AnalystItem
          style={{ borderBottomWidth: 0 }}
          title={getLanguage(global.language).Analyst_Labels.DATA_SET}
          value={(this.state.dataSet && this.state.dataSet.value) || ''}
          onPress={async () => {
            if (!this.state.dataSource) {
              Toast.show(
                getLanguage(global.language).Analyst_Prompt
                  .SELECT_DATA_SOURCE_FIRST,
              )
              return
            }

            this.currentPop = popTypes.DataSet
            let dataSets = this.getDataSets()

            let newDataSets = []
            dataSets.forEach(item => {
              let _item = Object.assign({}, item)
              _item.icon = getLayerIconByType(_item.datasetType)
              _item.highLightIcon = getLayerWhiteIconByType(_item.datasetType)
              newDataSets.push(_item)
            })
            this.setState(
              {
                popData: newDataSets,
                currentPopData: this.state.transMothodData,
              },
              () => {
                this.popModal && this.popModal.setVisible(true)
              },
            )
          }}
        />
      </View>
    )
  }

  getData(paramsData) {
    let data = []
    data.push({
      title: getLanguage(global.language).Analyst_Labels.PROJECTION_COORDS_NAME,
      value: paramsData.coordName,
    })
    data.push({
      title: getLanguage(global.language).Analyst_Labels.PROJECTION_COORDS_UNIT,
      value: paramsData.coordUnit,
    })
    data.push({
      title: getLanguage(global.language).Analyst_Labels
        .PROJECTION_GROUND_DATUM,
      value: paramsData.geoDatumName,
    })
    data.push({
      title: getLanguage(global.language).Analyst_Labels
        .PROJECTION_REFERENCE_ELLIPSOID,
      value: paramsData.geoSpheroid,
    })
    return data
  }
  renderRows() {
    let tempData = this.getData(this.state.dataSet.coordParams)
    let rows = []
    for (let i = 0; i < tempData.length; i++) {
      rows.push(this.renderItem(tempData[i], i))
    }
    return <View style={{ backgroundColor: color.content_white }}>{rows}</View>
  }

  renderItem(item, index) {
    return (
      <View
        style={{
          width: '100%',
          height: scaleSize(80),
        }}
      >
        {index != 0 ? <View style={styles.lineStyle} /> : null}
        <View style={styles.leftWrap}>
          <Text style={styles.rightItem} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.rightText} numberOfLines={1}>
            {item.value}
          </Text>
        </View>
      </View>
    )
  }

  //目标坐标系界面
  renderTargetCoords() {
    return !this.state.dataSet ? null : (
      <View style={{ backgroundColor: color.white, marginTop: scaleSize(20) }}>
        <View style={[styles.titleView, { backgroundColor: color.white }]}>
          <Text style={styles.title}>
            {getLanguage(global.language).Analyst_Labels.TARGET_COORDS}
          </Text>
        </View>
        {this.renderRows()}
      </View>
    )
  }

  renderTabReset() {
    return (
      <View
        tabLabel={getLanguage(global.language).Analyst_Labels.RESETING}
        style={{ backgroundColor: color.background, flex: 1 }}
      >
        {this.renderSearchBar()}
        {this.renderCoordSysList()}
      </View>
    )
  }

  renderTabCopy() {
    return (
      <View
        tabLabel={getLanguage(global.language).Analyst_Labels.COPY}
        style={{ backgroundColor: color.background, flex: 1 }}
      >
        {this.renderTop()}
        {this.renderTargetCoords()}
      </View>
    )
  }

  onChangeTab = () => {
    this.setState({
      coordSysSelectItem: null,
    })
  }
  renderPlotTab = () => {
    return (
      <ScrollableTabView
        style={{ backgroundColor: color.white }}
        tabBarActiveTextColor={color.blue1}
        tabBarUnderlineStyle={{ backgroundColor: color.blue1 }}
        tabBarTextStyle={{ fontSize: size.fontSize.fontSizeMd }}
        locked={false}
        onChangeTab={this.onChangeTab}
      >
        {this.renderTabReset()}
        {this.renderTabCopy()}
      </ScrollableTabView>
    )
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Analyst_Labels.TARGET_COORDS,
          navigation: this.props.navigation,
          backAction: this.back,
          headerRight: (
            <TextBtn
              btnText={getLanguage(global.language).Analyst_Labels.CONFIRM}
              textStyle={styles.headerBtnTitle}
              btnClick={this.confirm}
            />
          ),
        }}
      >
        {this.renderPlotTab()}
        {/* <ScrollView style={{ backgroundColor: color.background }}>
          {this.state.paraNumber === 3 ? null : (
            <View>
              {this.renderBasicParamerterView()}
              {this.renderRotationAngleView()}
            </View>
          )}
          {this.renderOffsetView()}
        </ScrollView> */}

        {/* <ScrollView style={{backgroundColor:color.background}}>
            {this.renderTop()}
            {this.renderTransMethodView()}
        </ScrollView>
        {this.renderPopList()} */}

        {this.renderPopList()}
      </Container>
    )
  }
}
