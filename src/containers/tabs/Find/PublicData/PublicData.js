import React from 'react'
import Container from '../../../../components/Container'
import {
  View,
  Text,
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { getLanguage } from '../../../../language'
import styles from './styles'
import { UserType } from '../../../../constants'
import { OnlineServicesUtils } from '../../../../utils'
import DataItem from './DataItem'
import SearchMenu from './SearchMenu'
import { getThemeAssets } from '../../../../assets'

var JSOnlineService
var JSIPortalService
export default class PublicData extends React.Component {
  props: {
    navigation: Object,
    user: Object,
    down: Array,
    updateDownList: () => {},
    removeItemOfDownList: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      title: getLanguage(global.language).Find.PUBLIC_DATA,
      data: [],
      initData: false,
      noData: false,
      loadError: false,
      loadMore: false,
      isRefresh: false,
    }
    this.count = 0,
    this.currentPage = 1
    this.totalPage = 0
    this.dataTypes = this.getAllDataTypes() //查询数据类型
    this.searchParams = undefined //其他查询参数
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    try {
      this.setState({
        initData: true,
        noData: false,
        loadError: false,
      })
      this.currentPage = 1
      let data = {}
      let searchParams = { currentPage: this.currentPage }
      if (this.searchParams) {
        Object.assign(searchParams, this.searchParams)
      }
      if(this.dataTypes.length === 0) {
        data.total = 0
      } else if (!UserType.isIPortalUser(this.props.user.currentUser)) {
        if (!JSOnlineService) {
          JSOnlineService = new OnlineServicesUtils('online')
        }
        data = await JSOnlineService.getPublicDataByTypes(
          this.dataTypes,
          searchParams,
        )
      } else {
        if (!JSIPortalService) {
          JSIPortalService = new OnlineServicesUtils('iportal')
        }
        data = await JSIPortalService.getPublicDataByTypes(
          this.dataTypes,
          searchParams,
        )
      }
      if (data.total === 0) {
        this.setState({ data: [], initData: false, noData: true })
      } else {
        this.totalPage = data.totalPage
        this.setState({
          data: data.content,
          initData: false,
        })
      }
    } catch (error) {
      this.setState({ data: [], initData: false, loadError: true })
    }
  }

  getAllDataTypes = () => [
    'WORKSPACE',
    'UDB',
    'MARKERSYMBOL',
    'LINESYMBOL',
    'FILLSYMBOL',
    'COLORSCHEME',
  ]

  setSearchParams = params => {
    if (this.searchParams) {
      Object.assign(this.searchParams, params)
    } else {
      this.searchParams = params
    }
  }

  onRefresh = () => {
    this.getData()
  }

  onLoadMore = async () => {
    try {
      if (this.currentPage === this.totalPage) {
        return
      }
      this.setState({
        loadMore: true,
        noData: false,
        loadError: false,
      })
      let searchParams = { currentPage: this.currentPage + 1 }
      if (this.searchParams) {
        Object.assign(searchParams, this.searchParams)
      }
      let data = await JSOnlineService.getPublicDataByTypes(
        this.dataTypes,
        searchParams,
      )
      this.currentPage++
      this.setState({
        data: this.state.data.concat(data.content),
        loadMore: false,
      })
    } catch (error) {
      this.setState({
        loadMore: false,
        loadError: true,
      })
    }
  }

  onParamsChanged = () => {
    let count = ++this.count
    setTimeout(() => {
      if(count === this.count) {
        this.getData()
        this.count = 0
      }
    }, 1000)
  }

  renderSearchMenu = () => {
    return (
      <SearchMenu
        ref={ref => (this.SearchMenu = ref)}
        setParams={item => {
          if(item.selectTypes) {
            this.dataTypes = item.selectTypes
          }
          this.setSearchParams(item)
          this.onParamsChanged()
        }}
      />
    )
  }

  renderProgress = () => {
    if (this.state.initData) {
      return (
        <View
          style={{
            height: 2,
            width: this.state.progressWidth,
            backgroundColor: '#1c84c0',
          }}
        />
      )
    }
  }

  renderStatus = () => {
    let text
    if (this.state.noData) {
      text = getLanguage(global.language).Find.NO_DATA
    } else if (this.state.loadError) {
      text = getLanguage(global.language).Find.NETWORK_ERROR
    }
    if (text) {
      return (
        <View style={styles.stateView}>
          <Text style={styles.textStyle}>{text}</Text>
        </View>
      )
    }
  }

  renderDataList = () => {
    return (
      <FlatList
        style={styles.ListViewStyle}
        data={this.state.data}
        renderItem={this.renderItem}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefresh}
            onRefresh={this.onRefresh}
            colors={['orange', 'red']}
            tintColor={'orange'}
            titleColor={'orange'}
            title={getLanguage(global.language).Friends.LOADING}
            enabled={true}
          />
        }
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0.1}
        onEndReached={this.onLoadMore}
        ListFooterComponent={this.renderFoot()}
      />
    )
  }

  renderItem = data => {
    return (
      <DataItem
        user={this.props.user}
        data={data.item}
        down={this.props.down}
        updateDownList={this.props.updateDownList}
        removeItemOfDownList={this.props.removeItemOfDownList}
      />
    )
  }

  renderFoot = () => {
    if (this.currentPage === this.totalPage &&
         (!this.state.loadError || !this.state.noData)
    ) {
      return (
        <View>
          <Text
            style={{
              flex: 1,
              lineHeight: 30,
              fontSize: 12,
              textAlign: 'center',
            }}
          >
            {getLanguage(global.language).Find.NO_MORE_DATA}
          </Text>
        </View>
      )
    }
    if (this.state.loadMore) {
      return (
        <View
          style={{
            flex: 1,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator
            style={{
              flex: 1,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            color={'orange'}
            animating={true}
          />
          <Text
            style={{
              flex: 1,
              lineHeight: 20,
              fontSize: 12,
              textAlign: 'center',
              color: 'orange',
            }}
          >
            {getLanguage(global.language).Prompt.LOADING}
          </Text>
        </View>
      )
    }
  }

  renderHeaderRight = () => {
    return (
      <View style={styles.HeaderRightContainer}>
        <TouchableOpacity
          onPress={() => {
            this.SearchMenu.setVisible(true)
          }}
        >
          <Image
            resizeMode={'contain'}
            source={getThemeAssets().find.filter}
            style={styles.searchImg}
          />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.state.title,
          navigation: this.props.navigation,
          headerRight: this.renderHeaderRight(),
        }}
      >
        {this.renderProgress()}
        {this.renderStatus()}
        {this.renderDataList()}
        {this.renderSearchMenu()}
      </Container>
    )
  }
}
