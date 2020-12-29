import React from 'react'
import { View, FlatList, Text } from 'react-native'
import { scaleSize, Toast } from '../../../../utils'
import { addCoworkMsg } from '../../../../redux/models/cowork'
import { setCurrentMapModule } from '../../../../redux/models/mapModules'
import { UserInfo } from '../../../../redux/models/user'
import { ListSeparator } from '../../../../components'
import { getLanguage } from '../../../../language'
import { SCoordination, SMap } from 'imobile_for_reactnative'
import { UserType } from '../../../../constants'
import { TaskMessageItem } from './components'
import CoworkInfo from '../../Friend/Cowork/CoworkInfo'

import { connect } from 'react-redux'

interface State {
  [name: string]: any, 
}

interface Props {
  tabLabel: string,
  navigation: Object,
  user: any,
  // invites: Array<any>,
  tasks: {[name: string]: Array<any>},
  groupInfo: any,
  mapModules: any,
  setCurrentMapModule: (index: number) => void,
  addCoworkMsg: (params: any, cb?: () => {}) => void,
  deleteCoworkMsg: (params: any, cb?: () => {}) => void,
}

class TaskManage extends React.Component<Props, State> {
  servicesUtils: any
  static defaultProps = {
    tasks: [],
  }
  list: FlatList<any> | null | undefined

  constructor(props: Props) {
    super(props)
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('online')
    } else if (UserType.isIPortalUser(this.props.user.currentUser)){
      this.servicesUtils = new SCoordination('iportal')
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    let shouldUpdate = JSON.stringify(nextState) !== JSON.stringify(this.state) ||
    JSON.stringify(nextProps) !== JSON.stringify(this.props)
    return shouldUpdate
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    // 切换用户，重新加载用户配置文件
    if (JSON.stringify(prevProps.tasks) !== JSON.stringify(this.props.tasks)) {
      // 当有新增数据时，自动滚动到首位
      if (
        prevProps.tasks[this.props.user.currentUser.userId] !== this.props.tasks[this.props.user.currentUser.userId] ||
        prevProps.tasks[this.props.user.currentUser.userId][this.props.groupInfo.id]?.length <
        this.props.tasks[this.props.user.currentUser.userId][this.props.groupInfo.id]?.length
      ) {
        // this.refresh()
        // this.list && this.list.scrollToEnd({
        //   animated: true,
        // })
      }
    }
  }

  componentDidMount() {
    // setTimeout(() => {
    //   this.list && this.list.scrollToEnd({
    //     animated: false,
    //   })
    // }, 1000)
  }

  _onPress = (data: any) => {
    if (data.message.map) {
      let module
      let index = data.message.module.index
      if (index === undefined) {
        for (let i = 0; i < this.props.mapModules.modules.length; i++) {
          if (data.message.module.key === this.props.mapModules.modules[i].key) {
            index = i
            module = this.props.mapModules.modules[i].chunk
              ? this.props.mapModules.modules[i].chunk
              : this.props.mapModules.modules[i].getChunk()
            break
          }
        }
      } else {
        module = this.props.mapModules.modules[index].chunk
          ? this.props.mapModules.modules[index].chunk
          : this.props.mapModules.modules[index].getChunk()
      }
      // let id = this.props.user.currentUser.userId === data.to.id ? data.user.id : data.to.id
      this.createCowork(data.id, module, index, data.message.map)
    } else {
      Toast.show(getLanguage(GLOBAL.language).Friends.RESOURCE_DOWNLOAD_INFO)
    }
  }

  createCowork = async (targetId: any, module: { action: (user: UserInfo, map: any) => void }, index: number, map: any) => {
    try {
      GLOBAL.Loading.setLoading(
        true,
        getLanguage(GLOBAL.language).Prompt.PREPARING,
      )
      let licenseStatus = await SMap.getEnvironmentStatus()
      GLOBAL.isLicenseValid = licenseStatus.isLicenseValid
      if (!GLOBAL.isLicenseValid) {
        GLOBAL.SimpleDialog.set({
          text: getLanguage(GLOBAL.language).Prompt.APPLY_LICENSE_FIRST,
        })
        GLOBAL.SimpleDialog.setVisible(true)
        return
      }
      CoworkInfo.setId(targetId)
      // CoworkInfo.setId(this.props.groupInfo.id + '')
      // CoworkInfo.setId(this.props.user.currentUser.userId + '')
      GLOBAL.getFriend().setCurMod(module)
      this.props.setCurrentMapModule(index).then(() => {
        module.action(this.props.user.currentUser, map)
      })
      GLOBAL.getFriend().curChat &&
        GLOBAL.getFriend().curChat.setCoworkMode(true)
      GLOBAL.coworkMode = true
      CoworkInfo.setTalkId(targetId)
      setTimeout(() => GLOBAL.Loading.setLoading(false), 300)
    } catch (error) {
      GLOBAL.Loading.setLoading(false)
    }
  }

  renderItem = ({ item }: any) => {
    return (
      <TaskMessageItem
        data={item}
        user={this.props.user}
        isSelf={item?.applicant !== this.props.user.currentUser.id}
        servicesUtils={this.servicesUtils}
        onPress={(data: any) => this._onPress(data)}
        addCoworkMsg={this.props.addCoworkMsg}
        deleteCoworkMsg={this.props.deleteCoworkMsg}
      />
    )
  }

  _renderItemSeparatorComponent = () => {
    return <ListSeparator color={'transparent'} height={scaleSize(20)} />
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {
          UserType.isOnlineUser(this.props.user.currentUser)
            ? (
              // <View>
                <FlatList
                  ref={ref => this.list = ref}
                  data={
                    this.props.tasks && this.props.tasks[this.props.user.currentUser.userId] &&
                    this.props.tasks[this.props.user.currentUser.userId][this.props.groupInfo.id]
                      ? this.props.tasks[this.props.user.currentUser.userId][this.props.groupInfo.id]
                      : []
                  }
                  // inverted={true}
                  extraData={this.state}
                  renderItem={this.renderItem}
                  keyExtractor={(item, index) => item.id.toString()}
                  ItemSeparatorComponent={this._renderItemSeparatorComponent}
                />
              // </View>
            )
            : (
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: 'grey', marginTop: scaleSize(24) }}>
                  {getLanguage(GLOBAL.language).Find.COWORK_LOGIN}
                </Text>
              </View>
            )
        }
      </View>
    )
  }
}

const mapStateToProps = (state: any) => ({
  user: state.user.toJS(),
  language: state.setting.toJS().language,
  tasks: state.cowork.toJS().tasks,
  mapModules: state.mapModules.toJS(),
})

const mapDispatchToProps = {
  addCoworkMsg,
  setCurrentMapModule,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskManage)
