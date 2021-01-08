import React from 'react'
import { View, FlatList, Text, Image, StyleSheet } from 'react-native'
import { scaleSize, Toast } from '../../../../utils'
import { addCoworkMsg } from '../../../../redux/models/cowork'
import { setCurrentMapModule } from '../../../../redux/models/mapModules'
import { UserInfo } from '../../../../redux/models/user'
import { ListSeparator, ImageButton } from '../../../../components'
import { getLanguage } from '../../../../language'
import { getThemeAssets } from '../../../../assets'
import { SCoordination, SMap } from 'imobile_for_reactnative'
import { UserType } from '../../../../constants'
import { size, color } from '../../../../styles'
import { TaskMessageItem } from './components'
import CoworkInfo from '../../Friend/Cowork/CoworkInfo'

import { connect } from 'react-redux'

const styles = StyleSheet.create({
  nullView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nullSubView: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nullImage: {
    height: scaleSize(270),
    width: scaleSize(270),
  },
  nullTitle: {
    marginTop: scaleSize(40),
    fontSize: size.fontSize.fontSizeLg,
    color: color.black,
  },
  nullSubTitle: {
    marginTop: scaleSize(20),
    fontSize: size.fontSize.fontSizeMd,
    color: color.selected_blue,
  },
  newTaskBtn: {
    position: 'absolute',
    right: -scaleSize(120),
    bottom: -scaleSize(40),
    backgroundColor: color.contentColorGray,
    height: scaleSize(120),
    width: scaleSize(120),
    borderRadius: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
})

interface State {
  [name: string]: any
}

interface Props {
  tabLabel: string,
  navigation: any,
  user: any,
  // invites: Array<any>,
  tasks: {[name: string]: Array<any>},
  groupInfo: any,
  mapModules: any,
  createTask: () => void,
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

  /**
   * 没有任务的界面
   */
  _renderNull = () => {
    return (
      <View style={styles.nullView}>
        <View style={styles.nullSubView}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image style={styles.nullImage} source={getThemeAssets().cowork.bg_photo_task} />
            <Text style={styles.nullTitle}>{getLanguage(GLOBAL.language).Friends.GROUP_TASK_NULL}</Text>
            {
              this.props.groupInfo.creator === this.props.user.currentUser.userId &&
              <Text style={styles.nullSubTitle}>{getLanguage(GLOBAL.language).Friends.CREATE_FIRST_GROUP_TASK}</Text>
            }
            {
              this.props.groupInfo.creator === this.props.user.currentUser.userId &&
              // <View style={styles.newTaskBtn}/>
              <ImageButton
                icon={getThemeAssets().cowork.icon_group_join}
                iconStyle={{height: scaleSize(80), width: scaleSize(80)}}
                containerStyle={styles.newTaskBtn}
                onPress={() => {
                  this.props.createTask && this.props.createTask()
                }}
              />
            }
          </View>
        </View>
        <View style={{flex: 1, backgroundColor: 'black'}} />
      </View>
    )
  }

  render() {
    let data = this.props.tasks && this.props.tasks[this.props.user.currentUser.userId]
      && this.props.tasks[this.props.user.currentUser.userId][this.props.groupInfo.id]
      ? this.props.tasks[this.props.user.currentUser.userId][this.props.groupInfo.id]
      : []
    return (
      <View style={{flex: 1}}>
        {
          data.length > 0
            ? (
              <FlatList
                ref={ref => this.list = ref}
                data={data}
                extraData={this.state}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => item.id.toString()}
                ItemSeparatorComponent={this._renderItemSeparatorComponent}
              />
            )
            : this._renderNull()
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
