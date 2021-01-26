import React, { Component } from 'react'
import { View, Text, FlatList, Switch, Image, StyleSheet } from 'react-native'
import { Container, TextBtn } from '../../../../../components'
import { MsgConstant } from '../../../../../constants'
import { getLanguage } from '../../../../../language/index'
import { scaleSize } from '../../../../../utils'
import { color, size } from '../../../../../styles'
import { getThemeAssets } from '../../../../../assets'
import { addCoworkMsg } from '../../../../../redux/models/cowork'
import NavigationService from '../../../../NavigationService'
import CoworkInfo from '../../../Friend/Cowork/CoworkInfo'
import CoworkFileHandle from '../CoworkFileHandle'
import { GroupType, SMessageService } from 'imobile_for_reactnative'
import { connect } from 'react-redux'

const styles = StyleSheet.create({
  topView: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: scaleSize(42),
    height: scaleSize(140),
  },
  topTitle: {
    fontSize: size.fontSize.fontSizeXXXl,
    color: color.fontColorBlack,
  },
  topSubTitle: {
    marginTop: scaleSize(10),
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorGray3,
  },
  item: {
    paddingHorizontal: scaleSize(42),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    height: scaleSize(108),
    justifyContent: 'center',
  },
  itemImg: {
    height: scaleSize(60),
    width: scaleSize(60),
    borderRadius: scaleSize(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    flex: 1,
    fontSize: scaleSize(26),
    marginLeft: scaleSize(30),
  },
  // 底部按钮
  bottomView: {
    flexDirection: 'row',
    height: scaleSize(120),
    backgroundColor: color.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBtn: {
    position: 'absolute',
    width: scaleSize(480),
    height: scaleSize(80),
    borderRadius: scaleSize(40),
    bottom: scaleSize(94),
    left: '50%',
    right: '50%',
    marginLeft: scaleSize(-240),
    backgroundColor: color.contentColorGray,
  },
  bottomBtnText: {
    fontSize: size.fontSize.fontSizeXXXl,
    color: color.white,
  },
})

interface Props {
  language: string,
  navigation: any,
  user: any,
  currentGroup: GroupType,
  currentTask: any,
  mapModules: any,
  addCoworkMsg: (params: any, cb?: () => {}) => void,
}

interface State {
  data: Array<any>
}

class CoworkMember extends Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    // let groupId = this.props.currentGroup.id
    // let taskId = CoworkInfo.coworkId
    // let data = CoworkFileHandle.getTaskGroupMembers(groupId, coworkId)
    // CoworkInfo.setMembers(data)
    // this.setState({ data: data || [] })
    this.setState({ data: CoworkInfo.members || [] })
  }

  invite = () => {
    let filter: {
      except: Array<string>,  // 过滤掉的成员ID
    } = {
      except: [],
    }
    for (let i = 0; i < this.state.data.length; i++) {
      filter.except.push(this.state.data[i].id)
    }
    NavigationService.navigate('GroupFriendListPage', {
      mode: 'multiSelect', // 多选模式
      includeMe: false, // 是否包含当前用户
      hasSettingBtn: false, // 是否含有右上角设置按钮
      filter: filter,
      callBack: async (members: any) => {
        NavigationService.goBack('GroupFriendListPage', null)

        let currentTask = this.props.currentTask
        currentTask.user = {
          name: this.props.user.currentUser.nickname || '',
          id: this.props.user.currentUser.userName || '',
        }

        let _members = []
        for (const member of members) {
          _members.push({
            name: member.nickname,
            id: member.userName,
          })
        }
        currentTask.members = currentTask.members.concat(_members)
        for (const member of currentTask.members) {
          CoworkInfo.addMember({
            id: member.id,
            name: member.name,
          })
          if (member.userName === this.props.user.currentUser.userName) continue
          SMessageService.sendMessage(
            JSON.stringify(currentTask),
            member.id,
          )
        }
        currentTask.type = MsgConstant.MSG_ONLINE_GROUP_TASK_MEMBER_JOIN
        await this.props.addCoworkMsg(currentTask)
        // this.props.addTaskMembers({
        //   groupID: currentTask.groupID,
        //   id: currentTask.id,
        //   members: _members,
        // })
        // 添加协作任务成员
        // CoworkFileHandle.addTaskGroupMember(
        //   this.props.currentGroup.id,
        //   currentTask.id,
        //   _members,
        // )
        this.getData()
      },
    })
  }

  _renderTop = () => {
    return (
      <View style={styles.topView}>
        <Text style={styles.topTitle}>{`${getLanguage(this.props.language).Friends.COWORK_MEMBER} (${this.state.data.length})`}</Text>
        <Text style={styles.topSubTitle}>{`${getLanguage(this.props.language).Friends.CREATOR}: ${this.props.currentGroup.nickname}`}</Text>
      </View>
    )
  }

  _renderItem = ({item}: any) => {
    // TODO Switch
    let show = item.show === undefined ? true : item.show
    return (
      <View style={styles.item}>
        <Image
          style={styles.itemImg}
          resizeMode={'contain'}
          source={getThemeAssets().friend.contact_photo}
        />
        <Text style={styles.itemTitle}>
          {item.name}
        </Text>
        {
          // this.props.currentGroup.creator === this.props.user.currentUser.userName &&
          // this.props.currentGroup.creator !== item.id &&
          <Switch
            trackColor={{ false: color.bgG, true: color.switch }}
            thumbColor={show ? color.bgW : color.bgW}
            ios_backgroundColor={show ? color.switch : color.bgG}
            value={show}
            onValueChange={async value => {
              if (value) {
                await CoworkInfo.showUserTrack(item.id)
              } else {
                await CoworkInfo.hideUserTrack(item.id)
              }
              // this.getData()
              this.setState({ data: CoworkInfo.members || [] })
            }}
          />
        }
      </View>
    )
  }

  _renderBottom = () => {
    return (
      <TextBtn
        btnText={getLanguage(this.props.language).Friends.INVITE_CORWORK_MEMBERS}
        containerStyle={styles.bottomBtn}
        textStyle={styles.bottomBtnText}
        btnClick={this.invite}
      />
    )
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(GLOBAL.language).Friends.COWORK_MEMBER,
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        {this._renderTop()}
        <FlatList
          data={this.state.data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this._renderItem}
          extraData={this.state}
        />
        {this._renderBottom()}
      </Container>
    )
  }
}

const mapStateToProps = (state: any) => ({
  user: state.user.toJS(),
  language: state.setting.toJS().language,
  currentGroup: state.cowork.toJS().currentGroup,
  currentTask: state.cowork.toJS().currentTask,
  mapModules: state.mapModules.toJS(),
})

const mapDispatchToProps = {
  addCoworkMsg,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CoworkMember)
