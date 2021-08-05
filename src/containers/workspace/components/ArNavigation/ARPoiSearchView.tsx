import { ARAction, SARMap, SMap, SMARInterestView } from 'imobile_for_reactnative'
import { POIInfo, POIInfoOnline, POISearchResult, RouteAnalyzeResult } from 'imobile_for_reactnative/types/interface/ar'
import { Point } from 'imobile_for_reactnative/types/interface/mapping/SMap'
import React from 'react'
import { Dimensions, FlatList, Image, ListRenderItemInfo, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { getThemeAssets } from '../../../../assets'
import { getLanguage } from '../../../../language'
import { ARNaviModule } from '../ArNavigationModule'
import { scaleSize, Toast, OnlineServicesUtils } from '../../../../../src/utils'
import Button from './Button'
import FloatBar from './FloatBar'
import DataHandler from '../../../../../src/containers/tabs/Mine/DataHandler'
import ToolbarModule from '../ToolBar/modules/ToolbarModule'
import NavigationService from '../../../../containers/NavigationService'

interface Props {
  toolbarVisible: boolean
  visible: boolean
}

interface State {
  results: (POIInfo| POIInfoOnline)[]
  selectedPoi?: POIInfo | POIInfoOnline
  isInputing: boolean
  showResult: boolean
  //TODO
  history: string[]
  //搜索半径
  searchRadius: number
}

interface DefaultPOI {
  image: any
  title: string
}

const OnlineService = new OnlineServicesUtils('online')

class ARPoiSearchView extends React.PureComponent<Props, State> {
  textInput : TextInput | null = null

  searchKey = ''

  currentLocation? : {ll: Point, mercator: Point} | null

  datasourceAdded = false

  constructor(props: Props) {
    super(props)

    this.state = {
      isInputing: false,
      showResult: false,
      results: [],
      history: [],
      searchRadius: 5000,
    }
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.toolbarVisible !== this.props.toolbarVisible || prevProps.visible !== this.props.visible) {
      if(this.isVisible()) {
        this.addPoiDatasource()
      } else if(prevProps.visible) {
        this.removePoiDatasource()
      }
    }
  }

  addPoiDatasource = async () => {
    const _params: any = ToolbarModule.getParams()
    await DataHandler.createPoiSearchDatasource(_params.user.currentUser)
    if(this.state.results) {
      SARMap.addSearchPois(this.state.results)
    }
    SARMap.setAction(ARAction.SELECT)

    // AppToolBar.addListener('ar_navi_poi_select',this.onPoiSelect)
  }

  removePoiDatasource = () => {
    SARMap.removeSearchPois()
    SARMap.setAction(ARAction.NULL)
  }

  isVisible = () => {
    return this.props.toolbarVisible && this.props.visible
  }

  /** 点击场景poi，显示详细信息 */
  onPoiSelect = async (selectARCalloutTag:any) => {
    const id = selectARCalloutTag
    if(id) {
      for(let i = 0; i < this.state.results.length; i++) {
        if(this.state.results[i].uid === id) {
          this.setState({
            selectedPoi: this.state.results[i],
          })
          break
        }
      }
    } else {
      Toast.show('未选中对象')
    }
  }

  /** 点击 poi list 结果，高亮场景 poi */
  selectPoi = async (uid: string) => {
    await SARMap.clearSelection()
    SARMap.selectSearchPoi(uid)
  }

  back =  () => {
    if(this.state.isInputing) {
      this.textInput?.blur()
      this.setState({
        isInputing: false,
      })
    } else {
      const _params: any = ToolbarModule.getParams()
      _params.showArNavi && _params.showArNavi(false)
      _params.showFullMap && _params.showFullMap(false)
      this.setState({
        isInputing: false,
        selectedPoi: undefined,
        results: [],
      })
      ARNaviModule.exit()
    }
  }

  showResult =  () => {
    if(this.state.results.length > 0) {
      this.setState({showResult: true})
    }
  }

  /** 搜索poi */
  search = async (key: string) => {
    if(key != '') {
      this.currentLocation = (await SARMap.getCurrentLocation())
      if(!this.currentLocation) {
        Toast.show(getLanguage(GLOBAL.language).ARMap.FAILED_TO_GET_LOCATION)
        return
      }
      GLOBAL.Loading?.setLoading(true)
      //TODO radius由小到大多次分析
      const searchRadius = this.state.searchRadius
      //在线搜索
      const result = await OnlineService.searchPoi({
        keywords: key,
        location: this.currentLocation.ll,
        radius: searchRadius,
        to: 910111
      })
      const naviDataset = ARNaviModule.getData().naviDatasetInfo
      let resultRoadNet: POISearchResult | undefined
      if (naviDataset) {
        //路网数据集搜索
        resultRoadNet = await SARMap.searchPoi({
          datasourceAlias: naviDataset.datasourceAlias,
          poiDatasetName: naviDataset.poiDatasetName,
          keyword: key,
          location: this.currentLocation.ll,
          radius: searchRadius,
          to: 2
        })
      }
      if(result || resultRoadNet) {
        const history = this.state.history.concat([])
        if(history.indexOf(key) > -1) {
          history.splice(history.indexOf(key), 1)
        }
        let infos: (POIInfo | POIInfoOnline)[] = []
        if(result) {
          infos = infos.concat(result.poiInfos)
        }
        if(resultRoadNet) {
          infos = infos.concat(resultRoadNet.poiInfos)
        }
        //距离排序
        infos = infos.sort((a, b) => {
          if(this.currentLocation) {
            const disa = Math.sqrt(
              Math.pow(this.currentLocation.mercator.x - a.location.x, 2) +
              Math.pow(this.currentLocation.mercator.y - a.location.y, 2)
            )
            const disb = Math.sqrt(
              Math.pow(this.currentLocation.mercator.x - b.location.x, 2) +
              Math.pow(this.currentLocation.mercator.y - b.location.y, 2)
            )
            return disa - disb
          }
          return 0
        })
        //过滤同名数据
        const nameArr: string[] = []
        infos = infos.filter(item => {
          if(nameArr.indexOf(item.name) === -1) {
            nameArr.push(item.name)
            return true
          } else {
            return false
          }
        })
        this.setState({
          isInputing: false,
          results: infos,
          history: [key].concat(history)
        })
        await SARMap.removeSearchPois()
        SARMap.addSearchPois(infos)
      } else {
        Toast.show(getLanguage(GLOBAL.language).ARMap.NO_SEARCH_RESULT)
      }
      GLOBAL.Loading?.setLoading(false)
    } else {
      Toast.show(getLanguage(GLOBAL.language).ARMap.PLEASE_INPUT_KEYWORD)
    }
  }

  /** 清除输入框 */
  clear = () => {
    this.textInput?.clear()
    this.searchKey = ''
    this.setState({
      selectedPoi: undefined
    })
  }

  analyzeRoute = async (): Promise<RouteAnalyzeResult | null> => {
    if(this.state.selectedPoi) {
      ARNaviModule.setData({
        currentPOI: this.state.selectedPoi
      })
      const currentLocation = await SARMap.getCurrentLocation()
      if(currentLocation) {
        const roadNetDataset = ARNaviModule.getData().naviDatasetInfo
        let result: RouteAnalyzeResult | null = null
        if('address' in this.state.selectedPoi) {
          result = await OnlineService.routeAnalyze({
            startPoint: currentLocation.ll,
            endPoint: await SMap.mercatorToLL(this.state.selectedPoi.location),
            to: 910111
          })
        } else if(roadNetDataset) {
          result = await SARMap.routeAnalyze({
            datasourcAlias: roadNetDataset.datasourceAlias,
            datasetName: roadNetDataset.datasetName,
            modelFileName: roadNetDataset.modelFileName,
            startPoint: currentLocation.ll,
            endPoint: await SMap.mercatorToLL(this.state.selectedPoi.location),
            to: 2
          })
        }
        ARNaviModule.setData({
          currentRoute: result
        })
        return result
      } else {
        Toast.show(getLanguage(GLOBAL.language).ARMap.FAILED_TO_GET_LOCATION)
        return null
      }
    } else {
      return null
    }
  }

  /** 进入AR导航 */
  onNavi = async () => {
    const result = await this.analyzeRoute()
    if(result) {
      await SARMap.startNavigation(result)
      const _params: any = ToolbarModule.getParams()
      _params.showArNavi && _params.showArNavi(false)
      _params.showNavigation && _params.showNavigation(true)
    } else {
      Toast.show(getLanguage(GLOBAL.language).ARMap.FAILED_TO_ANALYZE_PATH)
    }
  }

  /** 查看路线 */
  onPath = async () => {
    if(this.state.selectedPoi) {
      const result = await this.analyzeRoute()
      if(result) {
        NavigationService.navigate('NavigationView2D', {
          destinationName: this.state.selectedPoi.name,
          analystResult: result
        })
      } else {
        Toast.show(getLanguage(GLOBAL.language).ARMap.FAILED_TO_ANALYZE_PATH)
      }
    } else {
      // AppLog.error('未选中poi')
    }
  }

  _getDefaultPoi = (): DefaultPOI[] => {
    return [
      {
        image: getThemeAssets().nav.food,
        title: getLanguage(GLOBAL.language).ARMap.FOOD,
      },
      {
        image: getThemeAssets().nav.scene,
        title: getLanguage(GLOBAL.language).ARMap.SCENE,
      },
      {
        image: getThemeAssets().nav.bank,
        title: getLanguage(GLOBAL.language).ARMap.BANK,
      },
      {
        image: getThemeAssets().nav.market,
        title: getLanguage(GLOBAL.language).ARMap.SUPERMARKET,
      },
      {
        image: getThemeAssets().nav.hotel,
        title: getLanguage(GLOBAL.language).ARMap.HOTEL,
      },
      {
        image: getThemeAssets().nav.toilet,
        title: getLanguage(GLOBAL.language).ARMap.TOILET,
      },
      {
        image: getThemeAssets().nav.bus,
        title: getLanguage(GLOBAL.language).ARMap.BUS_STOP,
      },
      {
        image: getThemeAssets().nav.park,
        title: getLanguage(GLOBAL.language).ARMap.PARKING_LOT,
      },
      {
        image: getThemeAssets().nav.hospital,
        title: getLanguage(GLOBAL.language).ARMap.HOSPITAL,
      },
      {
        image: getThemeAssets().nav.gas_station,
        title: getLanguage(GLOBAL.language).ARMap.GAS_STATION,
      },
      {
        image: getThemeAssets().nav.mall,
        title: getLanguage(GLOBAL.language).ARMap.MARKET,
      },
    ]
  }

  renderDefaltPoiItem = ({item}: ListRenderItemInfo<DefaultPOI>) => {
    const width = Dimensions.get('window').width - scaleSize(80)
    return (
      <TouchableOpacity
        onPress={() => {this.search(item.title)}}
        style={{width: width / 4, ...styles.defaultPoiItem, justifyContent: 'space-between'}}
      >
        <Image source={item.image} style={{width: scaleSize(40), height: scaleSize(40)}} />
        <Text style={{  fontSize: scaleSize(22), color: GRAY}} >{item.title}</Text>
      </TouchableOpacity>
    )
  }

  renderHistoryItem = ({item}: ListRenderItemInfo<string>) => {
    return (
      <TouchableOpacity
        onPress={() => {this.search(item)}}
        style={{...styles.historyItem}}>
        <Image source={getThemeAssets().nav.poi_location} style={ {width: scaleSize(40),height: scaleSize(40)}} />
        <Text style={{fontSize: scaleSize(22), marginLeft: scaleSize(15), color: GRAY}} >{item}</Text>
      </TouchableOpacity>
    )
  }

  renderSearch = () => {
    return (
      <View style={styles.search}>
        <TextInput
          ref={ref => this.textInput = ref}
          style={styles.textInput}
          returnKeyType={'search'}
          onFocus={() => this.setState({isInputing: true})}
          // onBlur={() => this.setState({isInputing: false})}
          onChangeText={text => {this.searchKey = text}}
          onSubmitEditing={() => this.search(this.searchKey)}
        />
        <TouchableOpacity
          onPress={this.clear}
        >
          <Image
            source={getThemeAssets().toolbar.icon_toolbar_cancel}
            style={{
              width: scaleSize(40),
              height: scaleSize(40), tintColor: '#959595'
            }}
          />
        </TouchableOpacity>
        <View style={styles.searchSep}/>
        <TouchableOpacity
          onPress={() => this.search(this.searchKey)}
        >
          <Image
            source={getThemeAssets().nav.poi_search}
            style={{
              width: scaleSize(50),
              height: scaleSize(50),
            }}
          />
        </TouchableOpacity>
      </View>
    )
  }

  renderHeader = () => {
    return (
      <View style={styles.header}>
        <FloatBar
          style={{
            width: scaleSize(80),
            height: scaleSize(80),
            borderRadius: scaleSize(25),
            justifyContent: 'center',
          }}
          imageStyle={{
            width: scaleSize(50),
            height: scaleSize(50),
          }}
          data={[
            {
              image: getThemeAssets().toolbar.back,
              key: 'back',
              action: this.back,
            }
          ]}
        />
        {this.renderSearch()}
      </View>
    )
  }

  renderDefaulPoi = () => {
    return (
      <View style={styles.defaultPoi}>
        <FlatList
          data={this._getDefaultPoi()}
          renderItem={this.renderDefaltPoiItem}
          keyExtractor={item => item.title}
          numColumns={4}
          scrollEnabled={false}
        />
      </View>
    )
  }

  renderHistory = () => {
    return (
      <View style={styles.history}>
        <FlatList
          style={{flex: 1}}
          data={this.state.history}
          renderItem={this.renderHistoryItem}
          keyExtractor={item => item}
        />
        <TouchableOpacity
          style={{alignSelf: 'center'}}
          onPress={() => {this.setState({history: []})}}
        >
          <Text style={{ fontSize: scaleSize(22), color: GRAY}}>
            {getLanguage(GLOBAL.language).ARMap.CLEAR_SEARCH_HISOTORY}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderPoiResultItem = ({item}: ListRenderItemInfo<POIInfo>) => {
    let distance: string | undefined
    if(this.currentLocation) {
      const dis = Math.sqrt(
        Math.pow(this.currentLocation.mercator.x - item.location.x, 2) +
        Math.pow(this.currentLocation.mercator.y - item.location.y, 2)
      )
      if(dis > 1000) {
        distance = (dis / 1000).toFixed(2) + ' km'
      } else {
        distance = dis.toFixed(2) + ' m'
      }
    }
    return (
      <TouchableOpacity
        onPress={() => {
          this.selectPoi(item.uid)
          this.setState({
            selectedPoi: item,
            showResult: false,
          })
        }}
        style={styles.poiResultItem}
      >
        <Image
          source={getThemeAssets().nav.poi_location}
          style={{
            width: scaleSize(45),
            height: scaleSize(45),
          }}
        />
        <Text style={{  fontSize: scaleSize(34), flex: 1, color: GRAY, marginLeft: scaleSize(24)}} numberOfLines={1} ellipsizeMode={'middle'}>{item.name}</Text>
        {distance && <Text style={{fontSize: scaleSize(34), color: GRAY}} numberOfLines={1}>{distance}</Text>}
      </TouchableOpacity>
    )
  }

  renderResultList = () => {
    return (
      <>
        <TouchableOpacity
          onPress={() => {this.setState({ showResult: false})}}
          style={[StyleSheet.absoluteFill, {backgroundColor: 'black', opacity: 0.3, elevation: 10}]}
          activeOpacity={0.3}
        />
        <FlatList
          style={styles.poiResult}
          data={this.state.results}
          renderItem={this.renderPoiResultItem}
          keyExtractor={item => item.uid}
        />
      </>
    )
  }

  renderInterestView = () => {
    const points = this.state.results.map(item => {
      return item.location
    })
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={this.showResult}
        style={{marginTop: scaleSize(40)}}
      >
        <SMARInterestView
          style={{
            width: scaleSize(100),
            height: scaleSize(100),
          }}
          points={points}
          radius={this.state.searchRadius}
        />
      </TouchableOpacity>
    )
  }

  renderSideIcon = () => {
    return (
      <View style={{
        alignSelf: 'flex-end', 
        justifyContent: 'center',
        alignItems: 'center',
        marginRight:scaleSize(40)
      }}>
        {this.renderInterestView()}
        <FloatBar
          style={{borderRadius: scaleSize(20), marginTop: scaleSize(40), width: scaleSize(80), height: scaleSize(80), justifyContent: 'center'}}
          imageStyle={{width: scaleSize(40), height: scaleSize(40)}}
          textStyle={{fontSize: scaleSize(18)}}
          data={[{title:getLanguage(GLOBAL.language).Map_Main_Menu.NETWORK,image: getThemeAssets().nav.road_net, key: 'roadnet', action: () => {
            NavigationService.navigate('RoadNet', {
              datasource: ARNaviModule.getData().naviDatasourceInfo,
              dataset: ARNaviModule.getData().naviDatasetInfo,
            })
          }}]}
        />
        <FloatBar
          style={{borderRadius: scaleSize(20), marginTop: scaleSize(40), width: scaleSize(80), height: scaleSize(80), justifyContent: 'center'}}
          imageStyle={{width: scaleSize(40), height: scaleSize(40)}}
          textStyle={{fontSize: scaleSize(18)}}
          data={[{title:getLanguage(GLOBAL.language).Map_Label.SETTING,image: getThemeAssets().nav.setting, key: 'setting', action: () => {
            NavigationService.navigate('ARMapSetting',{
              poiSearch:true,
            })
          }}]}
        />
      </View>
    )
  }

  renderPoiDetail = () => {
    const item = this.state.selectedPoi
    if(!item) return null
    let distance: string | undefined
    if(this.currentLocation) {
      const dis = Math.sqrt(
        Math.pow(this.currentLocation.mercator.x - item.location.x, 2) +
        Math.pow(this.currentLocation.mercator.y - item.location.y, 2)
      )
      if(dis > 1000) {
        distance = (dis / 1000).toFixed(2) + ' km'
      } else {
        distance = dis.toFixed(2) + ' m'
      }
    }
    return (
      <View style={styles.poiDetail}>
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Text style={{fontSize: scaleSize(28), flex: 1}} numberOfLines={1}>{item.name}</Text>
            {distance &&  <Text style={{fontSize: scaleSize(28),  color: '#959595'}}>{distance}</Text>}
          </View>
          {'address' in item && (
            <Text style={{fontSize: scaleSize(28), color: '#959595', marginTop: scaleSize(15),height:scaleSize(40)}} numberOfLines={2}>{item.address}</Text>
          )}
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button
            style={{marginHorizontal: scaleSize(20), width: scaleSize(150), height: scaleSize(80),borderRadius: scaleSize(50)}}
            title={getLanguage(GLOBAL.language).Prompt.AR_NAVIGATION}
            color={'WHITE'}
            onPress={this.onNavi}
          />
          <Button
            style={{width: scaleSize(150), height: scaleSize(80),borderRadius: scaleSize(50)}}
            title={getLanguage(GLOBAL.language).ARMap.ROUTE}
            onPress={this.onPath}
          />
        </View>
      </View>
    )
  }

  render() {
    if(!this.isVisible()) return null
    return(
      <>
        {this.renderHeader()}
        {!this.state.isInputing && this.renderSideIcon()}
        {this.state.isInputing && this.renderDefaulPoi()}
        {this.state.isInputing && this.state.history.length > 0 && this.renderHistory()}
        {this.state.showResult && this.renderResultList()}
        {!this.state.isInputing && !this.state.showResult && this.renderPoiDetail()}
      </>
    )
  }
}

export default ARPoiSearchView

const GRAY = '#505050'

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingHorizontal: scaleSize(40),
    marginTop: scaleSize(55)
  },
  search: {
    flex: 1,
    backgroundColor: '#F6F7F8',
    height: scaleSize(80),
    borderRadius: scaleSize(35),
    paddingHorizontal: scaleSize(30),
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: scaleSize(25),
    elevation: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#eee',
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  textInput: {
    flex: 1,
    fontSize: scaleSize(36),
    color: '#171717',
  },
  searchSep: {
    backgroundColor: '#EBEBEB',
    width: 2,
    height: scaleSize(40),
    marginHorizontal: scaleSize(20)
  },
  defaultPoi: {
    marginTop: scaleSize(30),
    marginHorizontal: scaleSize(40),
    paddingTop: scaleSize(30),
    backgroundColor: '#F6F7F8',
    borderRadius: scaleSize(40),
    elevation: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#eee',
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  defaultPoiItem: {
    alignItems: 'center',
    marginBottom: scaleSize(40),
    height: scaleSize(66),
  },
  history: {
    flex: 1,
    marginBottom: scaleSize(42),
    marginTop: scaleSize(33),
    marginHorizontal: scaleSize(45),
    backgroundColor: '#F6F7F8',
    borderRadius: scaleSize(40),
    padding: scaleSize(40),
    elevation: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#eee',
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: scaleSize(20),
  },
  poiResult: {
    flex: 1,
    elevation: 11,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '83%',
    backgroundColor: '#F6F7F8',
  },
  poiResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleSize(54),
    marginLeft: scaleSize(38),
    marginRight: scaleSize(40),
  },
  poiDetail: {
    elevation: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#eee',
    shadowOpacity: 1,
    shadowRadius: 2,
    backgroundColor: '#F6F7F8',
    position: 'absolute',
    bottom: scaleSize(20),
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '90%',
    height: scaleSize(280),
    borderRadius: scaleSize(40),
    padding: scaleSize(30),
  }
})