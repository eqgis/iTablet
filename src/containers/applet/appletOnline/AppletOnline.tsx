import React from 'react'
import Container from '@/components/Container'
import {
  View,
  Text,
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  ListRenderItemInfo,
} from 'react-native'
import { getLanguage } from '@/language'
import styles from './styles'
import { UserType } from '@/constants'
import { OnlineServicesUtils } from '@/utils'
import AppletItem from './AppletItem'
import SearchMenu, { SearchParamsType } from './SearchMenu'
import { getPublicAssets } from '@/assets'
import { getService, ServiceType } from '@/utils/OnlineServicesUtils'
import { connect, ConnectedProps } from 'react-redux'
import {
  updateDownList,
  removeItemOfDownList,
} from '@/redux/models/online'
import { RootState } from '@/redux/types'
import { OnlineData } from 'imobile_for_reactnative/types/interface/iserver/types'

const mapStateToProps = (state: RootState) => ({
  user: state.user.toJS(),
  down: state.online.toJS().down,
})
const mapDispatchToProps = {
  updateDownList,
  removeItemOfDownList,
}
const connector = connect(
  mapStateToProps,
  mapDispatchToProps,
)
type ReduxProps = ConnectedProps<typeof connector>

interface Props extends ReduxProps {
  navigation: any,
  route: any,
}

interface State {
  title: string,
  data: OnlineData[],
  noData: boolean,
  loadError: boolean,
  loadMore: boolean,
  isRefresh: boolean,
}

class AppletOnline extends React.Component<Props, State> {

  serviceUtil: OnlineServicesUtils | undefined
  SearchMenu: SearchMenu | undefined | null

  totalPage = 0
  count = 0
  currentPage = 1
  searchParams: any
  cb: () => void

  constructor(props: Props) {
    super(props)
    this.state = {
      title: getLanguage().APPLET,
      data: [],
      noData: false,
      loadError: false,
      loadMore: false,
      isRefresh: false,
    }
    this.searchParams = undefined //其他查询参数
    const { params } = this.props.route
    this.cb = params?.cb
  }

  componentDidMount() {
    this.getData()
  }

  componentWillUnmount() {

  }

  getData = async () => {
    try {
      this.setState({
        noData: false,
        loadError: false,
      })
      this.currentPage = 1
      const searchParams = {
        currentPage: this.currentPage,
        typeId: 8,
        isBoutique: false,
        isFree: false,
        classifyIds: 168,
      }
      if (this.searchParams) {
        Object.assign(searchParams, this.searchParams)
      }
      if (!this.serviceUtil) {
        let type: ServiceType = 'online'
        if (UserType.isIPortalUser(this.props.user.currentUser)) {
          type = 'iportal'
        } else if (UserType.isOnlineUser(this.props.user.currentUser)) {
          type = 'online'
        }
        if (!type) return
        this.serviceUtil = getService(type)
      }
      const data = await this.serviceUtil.getOnlineData(searchParams)
      if (data.total === 0) {
        this.setState({ data: [], noData: true })
      } else {
        this.totalPage = data.total || 0
        this.setState({
          data: data.content,
        })
      }
    } catch (error) {
      this.setState({ data: [], loadError: true })
    }
  }

  setSearchParams = (params: SearchParamsType) => {
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
      if (this.currentPage === this.totalPage || !this.serviceUtil) {
        return
      }
      this.setState({
        loadMore: true,
        noData: false,
        loadError: false,
      })
      const searchParams = {
        currentPage: this.currentPage,
        typeId: 8,
        isBoutique: false,
        isFree: false,
        classifyIds: 168,
      }
      if (this.searchParams) {
        Object.assign(searchParams, this.searchParams)
      }
      const data = await this.serviceUtil.getOnlineData(searchParams)
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
    const count = ++this.count
    setTimeout(() => {
      if (count === this.count) {
        this.getData()
        this.count = 0
      }
    }, 1000)
  }

  renderSearchMenu = () => {
    return (
      <SearchMenu
        ref={ref => (this.SearchMenu = ref)}
        showFilter={false}
        setParams={item => {
          this.setSearchParams(item)
          this.onParamsChanged()
        }}
      />
    )
  }

  renderStatus = () => {
    let text
    if (this.state.noData) {
      text = getLanguage(global.language).Find.NO_DATA
    } else if (this.state.loadError) {
      text = getLanguage(global.language).Find.NETWORK_ERROR_NOTIFY
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
            title={getLanguage(global.language).Friends.REFRESHING}
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

  renderItem = (data: ListRenderItemInfo<OnlineData>) => {
    console.warn(data)
    return (
      <AppletItem
        user={this.props.user}
        data={data.item}
        down={this.props.down}
        updateDownList={this.props.updateDownList}
        removeItemOfDownList={this.props.removeItemOfDownList}
        onDownloaded={() => {
          this.cb?.()
        }}
      />
    )
  }

  renderFoot = () => {
    if (
      this.currentPage === this.totalPage &&
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
            this.SearchMenu?.setVisible(true)
          }}
        >
          <Image
            resizeMode={'contain'}
            source={getPublicAssets().common.icon_nav_imove}
            style={styles.searchImg}
          />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Container
        headerProps={{
          title: this.state.title,
          navigation: this.props.navigation,
          headerRight: this.renderHeaderRight(),
          headerOnTop: true,
        }}
      >
        {this.renderStatus()}
        {this.renderDataList()}
        {this.renderSearchMenu()}
      </Container>
    )
  }
}

export default connector(AppletOnline)
