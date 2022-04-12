import React, { Component } from 'react'
import {
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  SectionList,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native'
import { Container, TextBtn } from '../../components'
import { getThemeAssets } from '../../assets'
import { SCoordination, AuthorizeSetting, GroupRole, PermissionType } from 'imobile_for_reactnative'
import styles from './styles'
import { color, size } from '../../styles'
import Toast from '../../utils/Toast'
import { scaleSize, OnlineServicesUtils } from '../../utils'
import { getLanguage } from '../../language/index'
import { UserType } from '../../constants'
import { Users } from '../../redux/models/user'
import { DEVICE } from '../../redux/models/device'
import GroupItem, { CallbackParams } from './GroupItem'
import NavigationService from '../NavigationService'

interface Props {
  user: Users,
  device: DEVICE,
  navigation: any,
}

interface State {
  data: any[],
  isRefresh: false,
}

interface Group {
	creator: string,
	icon: string,
	resourceSharer:  keyof GroupRole,
	description: string,
	updateTime: number,
	tags: string[] | null,
	groupName: string,
	createTime: number,
	isEnabled: boolean,
	nickname: string,
	isPublic: boolean,
	id: number,
	isNeedCheck: boolean,
  permissionType?: keyof PermissionType,
}

export default class ServiceShareSettings extends Component<Props, State> {
  servicesUtils: SCoordination | undefined
  pageSize = 20
  currentPage = 1
  isNoMore = false
  isLoading = false
  currentData: any
  selectGroups: Map<string, Group>
  cb: (() => void) | undefined

  constructor(props: Props) {
    super(props)

    this.currentData = this.props.route?.params?.data
    this.cb = this.props.route?.params?.cb

    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('online')
    } else if (UserType.isIPortalUser(this.props.user.currentUser)){
      this.servicesUtils = new SCoordination('iportal')
    }

    this.state = {
      data: [],
      isRefresh: false,
    }
    this.selectGroups = new Map<string, Group>()
  }

  componentDidMount() {
    this.getGroups()
  }

  getGroups = async () => {
    try {
      // this.servicesUtils?.getGroupInfos({
      this.servicesUtils?.getShareGroups().then(result => {
        if (result?.length > 0) {
          this.setState({
            data: result,
            isRefresh: false,
          })
        } else {
          this.state.isRefresh && this.setState({ isRefresh: false, data: [] })
          this.isLoading = false
        }
      })
    } catch (error) {
      this.isLoading = false
      this.state.isRefresh && this.setState({ isRefresh: false })
      Toast.show(error.message)
    }
  }

  _save = () => {
    let entities: AuthorizeSetting[] = []
    if (this.selectGroups.size) {
      // entities = Array.from(this.selectGroups)
      const keys: IterableIterator<string> = this.selectGroups.keys()
      for (const key of keys) {
        const group: Group | undefined = this.selectGroups.get(key)
        if (!group) continue
        entities.push({
          entityId: group.id,
          entityName: group.groupName,
          entityType: 'IPORTALGROUP',
          permissionType: group.permissionType || 'READ',
        })
      }
    }
    this.servicesUtils?.shareServiceToGroup({
      ids: [this.currentData.id],
      entities: entities,
    }).then(result => {
      if (result.succeed) {
        this.cb?.()
        NavigationService.goBack()
      }
    })
  }

  _readableAction = ({ data, status }: CallbackParams) => {
    const group = JSON.parse(JSON.stringify(data))
    if (status) {
      group.permissionType = status
      this.selectGroups.set(group.groupName, group)
    } else {
      if (this.selectGroups.has(group.groupName)) {
        this.selectGroups.delete(group.groupName)
      }
    }
  }

  _searchableAction = ({ data, status }: CallbackParams) => {
    const group = JSON.parse(JSON.stringify(data))
    if (status) {
      group.permissionType = status
      this.selectGroups.set(group.groupName, group)
    } else {
      if (this.selectGroups.has(group.groupName)) {
        this.selectGroups.delete(group.groupName)
      }
    }
  }

  /** 顶部组件 **/
  renderTop = () => {
    return (
      <View style={styles.topView}>
        <View style={styles.topLeftView}>
          {/* <View style={styles.selectImgView} /> */}
          <Text style={[styles.topText, {marginLeft: scaleSize(80) }]}>
            {getLanguage(global.language).Friends.GROUPS}
          </Text>
        </View>
        <View style={styles.topRightView}>
          <Text style={[styles.topText, { width: scaleSize(160) }]}>
            {getLanguage(global.language).Cowork.SEARCHABLE}
          </Text>
          <Text style={[styles.topText, { width: scaleSize(160) }]}>
            {getLanguage(global.language).Cowork.READABLE}
          </Text>
        </View>
      </View>
    )
  }

  _renderItem = ({ item }) => {
    // let data = this.state.extraData.get(item.name)
    let group
    for (let entity of this.currentData.authorizeSetting) {
      if (entity.entityType === 'IPORTALGROUP' && entity.entityName === item.groupName) {
        // type = entity.permissionType === 'READ'
        group = entity
        if (!this.selectGroups.has(group.entityName)) {
          this.selectGroups.set(group.entityName, item)
        }
        break
      }
    }
    return (
      <GroupItem
        data={item}
        status={group?.permissionType}
        readableAction={this._readableAction}
        searchableAction={this._searchableAction}
      />
    )
  }

  render() {
    return (
      <Container
        // ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Cowork.SERVICE_SHARING_SETTINGS,
          //'我的服务',
          withoutBack: false,
          navigation: this.props.navigation,
          headerRight: (
            <TextBtn
              btnText={getLanguage(global.language).Prompt.CONFIRM}
              textStyle={styles.headerBtnTitle}
              btnClick={this._save}
            />
          ),
        }}
      >
        {this.renderTop()}
        <FlatList
          style={{ flex: 1 }}
          initialNumToRender={20}
          renderItem={this._renderItem}
          data={this.state.data}
          keyExtractor={item => item.name}
        />
      </Container>
    )
  }
}
