import React from 'react'
import { View, FlatList, Text } from 'react-native'
import CoworkInviteView from '../../Friend/Cowork/CoworkInviteView'
import { scaleSize, OnlineServicesUtils } from '../../../../utils'
import { ListSeparator } from '../../../../components'
import { getLanguage } from '../../../../language'
import { SCoordination } from 'imobile_for_reactnative'
import { UserType } from '../../../../constants'
import { color } from '../../../../styles'
import { TaskMessageItem } from './components'
import { GroupApplyMessageType } from './types'

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
  setCurrentMapModule: () => void,
  deleteInvite: () => void,
}

class TaskManage extends React.Component<Props, State> {
  servicesUtils: any
  static defaultProps = {
    tasks: [],
  }
  list: FlatList<any> | null | undefined

  constructor(props: Props) {
    super(props)
    this.servicesUtils
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
        prevProps.tasks[this.props.user.currentUser.id][this.props.groupInfo.id].length <
        this.props.tasks[this.props.user.currentUser.id][this.props.groupInfo.id].length
      ) {
        // this.refresh()
        this.list && this.list.scrollToEnd({
          animated: true,
        })
      }
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.list && this.list.scrollToEnd({
        animated: false,
      })
    }, 1000)
  }

  deleteInvite = data => {
    GLOBAL.SimpleDialog.set({
      text: getLanguage(GLOBAL.language).Friends.DELETE_COWORK_ALERT,
      confirmAction: () => this.props.deleteInvite(data),
    })
    GLOBAL.SimpleDialog.setVisible(true)
  }

  _onPress = () => {

  }

  renderItem = ({ item }) => {
    // return (
    //   <CoworkInviteView
    //     style={{
    //       flexDirection: 'column',
    //       marginHorizontal: scaleSize(30),
    //       padding: scaleSize(20),
    //       borderWidth: 1,
    //       borderRadius: scaleSize(8),
    //       borderColor: color.gray7,
    //     }}
    //     data={item}
    //     onLongPress={data => this.deleteInvite(data)}
    //   />
    // )

    return (
      <TaskMessageItem
        data={item}
        isSelf={item?.applicant !== this.props.user.currentUser.id}
        servicesUtils={this.servicesUtils}
        onPress={(data: GroupApplyMessageType) => this._onPress(data, index)}
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
              <View>
                <FlatList
                  ref={ref => this.list = ref}
                  data={
                    this.props.tasks && this.props.tasks[this.props.user.currentUser.userId] &&
                    this.props.tasks[this.props.user.currentUser.userId][this.props.groupInfo.id]
                      ? this.props.tasks[this.props.user.currentUser.userId][this.props.groupInfo.id]
                      : []
                  }
                  inverted={true}
                  extraData={this.state}
                  renderItem={this.renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  ItemSeparatorComponent={this._renderItemSeparatorComponent}
                />
              </View>
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
})

const mapDispatchToProps = {
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskManage)
