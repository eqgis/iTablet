import React from 'react'
import { Container, TextBtn } from '../../../../components'
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Platform,
  NativeModules,
} from 'react-native'
import { getLanguage } from '../../../../language'
import styles from './styles'
import { UserType, ConstPath } from '../../../../constants'
import { FileTools } from '../../../../native'
import { OnlineServicesUtils, Toast } from '../../../../utils'
import AppletItem from './AppletItem'
const appUtilsModule = NativeModules.AppUtils
var JSOnlineService
var JSIPortalService
export default class Applet extends React.Component {
  props: {
    navigation: Object,
    user: Object,
    down: Array,
    language: string,
    updateDownList: () => {},
    removeItemOfDownList: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    this.type = params.type // 判断类型，默认公共数据。其他如APPLET 小程序
    this.state = {
      data: [],
      initData: false,
      noData: false,
      loadError: false,
      loadMore: false,
      isRefresh: false,
    }
    this.count = 0
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
      let searchParams = {
        currentPage: this.currentPage,
        keywords: (Platform.OS === 'ios' ? 'ios.' : 'android.') + 'bundle',
      }
      if (this.searchParams) {
        Object.assign(searchParams, this.searchParams)
      }
      if (this.dataTypes.length === 0) {
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

  getAllDataTypes = () => ['UDB']

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
      let data = []
      let getDownloadData = async function() {
        let searchParams = {
          currentPage: this.currentPage + 1,
          keywords: (Platform.OS === 'ios' ? 'ios.' : 'android.') + 'bundle',
        }
        if (this.searchParams) {
          Object.assign(searchParams, this.searchParams)
        }
        let data = await JSOnlineService.getPublicDataByTypes(
          this.dataTypes,
          searchParams,
        )
        return data
      }
      while (data) data = await getDownloadData()
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
      if (count === this.count) {
        this.getData()
        this.count = 0
      }
    }, 1000)
  }

  onDownloaded = result => {
    if (result) {
      GLOBAL.SimpleDialog.set({
        text: getLanguage(GLOBAL.language).Find.APPLET_DOWNLOADED_REBOOT,
        confirmText: getLanguage(this.props.language).Find.REBOOT,
        confirmAction: () => {
          appUtilsModule.reloadBundle()
        },
      })
      GLOBAL.SimpleDialog.setVisible(true)
    } else {
      Toast.show(getLanguage(GLOBAL.language).Prompt.DOWNLOAD_SUCCESSFULLY)
    }
  }

  reset = async () => {
    try {
      const bundlePath = GLOBAL.homePath + ConstPath.BundlesPath
      let fileList = await FileTools.getPathList(bundlePath)
      if (fileList.length > 0) {
        GLOBAL.SimpleDialog.set({
          text: getLanguage(GLOBAL.language).Find.APPLET_RESET_OLD_VERSION,
          confirmText: getLanguage(this.props.language).Find.RESET,
          confirmAction: async () => {
            this.container &&
              this.container.setLoading(
                true,
                getLanguage(GLOBAL.language).Find.APPLET_RESETTING,
              )
            let result = await FileTools.deleteFile(
              GLOBAL.homePath + ConstPath.BundlesPath,
            )
            result =
              result &&
              (await FileTools.createDirectory(
                GLOBAL.homePath + ConstPath.BundlesPath,
              ))
            if (result) {
              setTimeout(() => {
                this.container && this.container.setLoading(false)
                appUtilsModule.reloadBundle()
              }, 1000)
            } else {
              Toast.show(getLanguage(GLOBAL.language).Find.APPLET_RESET_FAILED)
            }
          },
        })
        GLOBAL.SimpleDialog.setVisible(true)
      } else {
        Toast.show(getLanguage(GLOBAL.language).Find.APPLET_OLD_VERSION_ALREADY)
      }
    } catch (e) {
      this.container && this.container.setLoading(false)
      Toast.show(getLanguage(GLOBAL.language).Find.APPLET_RESET_FAILED)
    }
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
      text = getLanguage(GLOBAL.language).Find.NO_DATA
    } else if (this.state.loadError) {
      text = getLanguage(GLOBAL.language).Find.NETWORK_ERROR
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
            title={getLanguage(GLOBAL.language).Friends.LOADING}
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
      <AppletItem
        user={this.props.user}
        data={data.item}
        down={this.props.down}
        updateDownList={this.props.updateDownList}
        removeItemOfDownList={this.props.removeItemOfDownList}
        onDownloaded={this.onDownloaded}
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
            {getLanguage(GLOBAL.language).Find.NO_MORE_DATA}
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
            {getLanguage(GLOBAL.language).Prompt.LOADING}
          </Text>
        </View>
      )
    }
  }

  renderHeaderRight = () => {
    return (
      <TextBtn
        btnText={getLanguage(this.props.language).Find.RESET}
        textStyle={styles.headerBtnTitle}
        btnClick={this.reset}
      />
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(this.props.language).Find.APPLET,
          navigation: this.props.navigation,
          headerRight: this.renderHeaderRight(),
        }}
      >
        {this.renderProgress()}
        {this.renderStatus()}
        {this.renderDataList()}
      </Container>
    )
  }
}
