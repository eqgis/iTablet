/**
 * Created by imobile-xzy on 2019/3/4.
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SectionList,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native'
import { connect } from 'react-redux'
import NavigationService from '../../../../NavigationService'
import { Toast, scaleSize } from '../../../../../utils'
import { getPinYinFirstCharacter } from '../../../../../utils/pinyin'
import { UserType } from '../../../../../constants'
import { Container, TextBtn, CheckBox, PopMenu, ImageButton, Dialog } from '../../../../../components'
import { color, size } from '../../../../../styles'
import { getThemeAssets } from '../../../../../assets'
import { MsgConstant } from '../../../Friend'
import { getLanguage } from '../../../../../language'
import { Users } from '../../../../../redux/models/user'
import { exitGroup } from '../../../../../redux/models/cowork'
import { SCoordination, SMessageService, GroupType } from 'imobile_for_reactnative'
import { Person } from '../types'

interface Props {
  language: string,
  navigation: Object,
  currentGroup: GroupType,
  user: Users,
  device: any,
}

type State = {
  allData: Array<any>,
  sections: Array<any>,
  letterArr: Array<string>, //首字母数组
  isRefresh: boolean,
  inputText: string,
  isManage: boolean,
  selectedMembers: Map<string, Object>, //被选中人员数组数组
  dialogInfo: string,
}

interface SectionType {
  key: string,
  title: string,
  data: any,
}

class GroupFriendListPage extends Component<Props, State> {
  title: string
  servicesUtils: SCoordination | undefined
  SectionList: any
  mode: string // 'manage' 管理模式，含删除 ｜ 'multiSelect' 多选 ｜ 'select' 单选（默认）
  includeMe: boolean // 是否包含当前用户
  callBack: (data?: any) => any
  popData: Array<any>
  pagePopModal: PopMenu | null | undefined
  dialog: Dialog | null | undefined
  dialogAction: (() => void) | null | undefined

  constructor(props: Props) {
    super(props)
    this.callBack = this.props.navigation?.state?.params?.callBack
    this.mode = this.props.navigation?.state?.params?.mode === undefined ? 'select' : this.props.navigation?.state?.params?.mode
    this.includeMe = this.props.navigation?.state?.params?.includeMe === undefined ? true : this.props.navigation?.state?.params?.includeMe
    this.title = this.props.navigation?.state?.params?.title || getLanguage(this.props.language).Friends.TITLE_CHOOSE_MEMBER

    this.state = {
      allData: [], // 所有数组
      sections: [], //section数组
      letterArr: [], //首字母数组
      isRefresh: false,
      inputText: '',
      isManage: false,
      selectedMembers: new Map<string, Object>(),
      dialogInfo: '',
    }
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('online')
    } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('iportal')
    }
    this.popData = []

    if (this.props.user.currentUser.userName === this.props.currentGroup.creator) {
      this.popData = this.popData.concat([
        {
          title: getLanguage(this.props.language).Friends.GROUP_MEMBER_DELETE,
          action: () => {
            this._setManage(true)
          },
        },
      ])
    }
  }

  componentDidMount() {
    this.getContacts()
  }

  refresh = () => {
    this.getContacts()
    this.setState({ isRefresh: false })
  }

  getContacts = async () => {
    this.servicesUtils?.getGroupMembers({
      groupId: this.props.currentGroup.id,
    }).then((result: any) => {
      let persons = result.content
      if (persons.length > 0) {
        try {
          let sections: SectionType[] = [],
            letterArr = []

          for (let i = 0; i < persons.length; i++) {
            let person = persons[i]
            if (!this.includeMe && person.userName === this.props.user.currentUser.userName) continue // 过滤当前用户
            let name = person.nickname
            let firstChar = getPinYinFirstCharacter(name, '-', true)
            let ch = firstChar[0]
            if (letterArr.indexOf(ch) === -1) {
              letterArr.push(ch)
            }
          }

          letterArr.sort()

          letterArr.map(item => {
            const module = persons.filter((it: Person) => {
              if (!this.includeMe && it.userName === this.props.user.currentUser.userName) return false
              //遍历获取每一个首字母对应联系人
              let firstChar = getPinYinFirstCharacter(it.nickname, '-', true)
              let ch = firstChar[0]
              return ch === item
            })

            sections.push({ key: item, title: item, data: module })
          })

          this.setState({
            letterArr,
            sections,
            allData: persons,
          })
        } catch (err) {
          Toast.show(err.message)
        }
      } else {
        this.setState({
          letterArr: [],
          sections: [],
          allData: [],
        })
      }
    })
  }

  _setManage = (isManage?: boolean) => {
    if (isManage === undefined) {
      isManage = !this.state.isManage
    }
    this.setState({
      isManage: isManage,
    })
  }

  _onSectionselect = (key: number) => {
    //滚动到指定的偏移的位置
    this.SectionList.scrollToLocation({
      animated: true,
      itemIndex: 0,
      sectionIndex: key,
      viewOffset: scaleSize(35),
    })
  }

  _multiSelectConfirm = () => {
    if (this.mode === 'multiSelect') {
      let arr: Object[] = []
      this.state.selectedMembers.forEach(item => {
        arr.push(item)
      })
      this.callBack && this.callBack(arr)
    }
  }

  _setDialogVisible = (visible: boolean, info?: string) => {
    if (visible === false) {
      this.dialogAction = null
    }
    if (info) {
      this.setState({
        dialogInfo: info,
      }, () => {
        this.dialog?.setDialogVisible(visible)
      })
    } else {
      this.dialog?.setDialogVisible(visible)
    }
  }

  _btnAction = () => {
    if (this.mode === 'select') return null
    let isMultiSelect = this.mode === 'multiSelect'
    if (isMultiSelect) {
      if (this.state.selectedMembers.size === 0) {
        Toast.show(getLanguage(GLOBAL.language).Friends.GROUP_SELECT_MEMBER)
        return
      }
      this._multiSelectConfirm()
    } else if (this.state.isManage) {
      if (this.state.selectedMembers.size === 0) {
        Toast.show(getLanguage(GLOBAL.language).Friends.GROUP_SELECT_MEMBER)
        return
      }

      this._setDialogVisible(true, getLanguage(GLOBAL.language).Friends.GROUP_MEMBER_DELETE_INFO)
      this.dialogAction = () => {
        let userIds: Array<string> = []
        this.state.selectedMembers.forEach((member: any) => {
          userIds.push(member.userName + '')
        })
        this.servicesUtils?.deleteGroupMembers({
          groupId: this.props.currentGroup.id,
          userIds: userIds,
        }).then(async result => {
          if (result.succeed) {
            // 给删除对象发送被删除消息
            let timeStr = new Date().getTime()
            let message = {
              type: MsgConstant.MSG_ONLINE_MEMBER_DELETE,
              user: {
                name: this.props.user.currentUser.nickname || '',
                id: this.props.user.currentUser.userName || '',
              },
              group: {
                groupID: this.props.currentGroup.id,
                groupName: this.props.currentGroup.groupName,
                groupCreator: this.props.currentGroup.creator,
              },
              time: timeStr,
            }
            for (let i = 0; i < userIds.length; i++) {
              SMessageService.sendMessage(
                JSON.stringify(message),
                userIds[i],
              )
            }
            await this.getContacts()
            this.callBack && this.callBack()
            this._setDialogVisible(false)
            this._setManage()
          }
        })
      }
    }
  }

  _renderSectionHeader = (sectionItem: any) => {
    const { section } = sectionItem
    return (
      <View style={[
        styles.HeadViewStyle,
        (this.mode === 'multiSelect' || this.state.isManage) && {marginLeft: scaleSize(62)},
      ]}>
        <Text style={styles.HeadTextStyle}>{section.title.toUpperCase()}</Text>
      </View>
    )
  }

  _renderItem = (item: Person, index: number) => {
    return (
      <View
        style={[styles.ItemViewStyle]}
      >
        {
          (this.state.isManage || this.mode === 'multiSelect') &&
          (
            this.props.user.currentUser.userName !== item.userName
              ? (
                <CheckBox
                  type={'circle'}
                  style={styles.checkBtn}
                  checked={!!this.state.selectedMembers.get(item.userName + '')}
                  onChange={value => {
                    this.setState(state => {
                      const selected = new Map(state.selectedMembers)
                      const isSelected = selected.has(item.userName + '')
                      if (value && !isSelected) {
                        selected.set(item.userName + '', item)
                      } else {
                        selected.delete(item.userName + '')
                      }
                      return { selectedMembers: selected }
                    })
                  }}
                />
              )
              : (
                <View style={{
                  marginLeft: scaleSize(32),
                  height: scaleSize(30),
                  width: scaleSize(30),
                }} />
              )
          )
        }
        <Image
          style={styles.itemImg}
          resizeMode={'contain'}
          source={getThemeAssets().friend.contact_photo}
        />
        <View style={styles.ITemTextViewStyle}>
          <Text style={styles.ITemTextStyle}>{item.nickname}</Text>
        </View>
      </View>
    )
  }

  _renderHeaderRight = () => {
    if (this.mode === 'select' || this.mode === 'multiSelect' || this.state.isManage || this.popData.length === 0) return null
    return (
      <ImageButton
        icon={getThemeAssets().cowork.icon_nav_set}
        onPress={(event: any) => {
          this.pagePopModal?.setVisible(true, {
            x: event.nativeEvent.pageX,
            y: event.nativeEvent.pageY,
          })
        }}
      />
    )
  }

  _renderPagePopup = () => {
    return (
      <PopMenu
        ref={ref => (this.pagePopModal = ref)}
        data={this.popData}
        device={this.props.device}
        hasCancel={false}
      />
    )
  }

  _renderDeleteDialog = () => {
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        type={Dialog.Type.MODAL}
        info={this.state.dialogInfo}
        confirmAction={() => {
          if (this.dialogAction) {
            this.dialogAction()
          }
        }}
        confirmBtnTitle={getLanguage(this.props.language).Prompt.CONFIRM}
        cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
      />
    )
  }

  _renderBottom = () => {
    if (this.state.isManage || this.mode === 'multiSelect') {
      return (
        <View style={styles.bottomView}>
          <CheckBox
            type={'circle'}
            style={styles.checkBtn}
            checked={this.state.selectedMembers.size === this.state.allData.length - 1} // -1是减去管理者自己
            onChange={value => {
              this.setState(state => {
                const selected = new Map(state.selectedMembers)
                this.state.allData.forEach(item => {
                  if (this.props.user.currentUser.userName === item.userName) return
                  const isSelected = selected.has(item.userName + '')
                  if (value && !isSelected) {
                    selected.set(item.userName + '', item)
                  } else if (!value && isSelected) {
                    selected.delete(item.userName + '')
                  }
                })
                return { selectedMembers: selected }
              })
            }}
          />
          <Text style={styles.selectAll}>{getLanguage(GLOBAL.language).Profile.SELECT_ALL}</Text>
          {/* <TouchableOpacity></TouchableOpacity> */}
          <TextBtn
            btnText={getLanguage(this.props.language).Common.CONFIRM}
            containerStyle={styles.bottomBtn}
            textStyle={styles.bottomBtnText}
            btnClick={this._btnAction}
          />
        </View>
      )
    }
    return null
  }

  _closeManage = () => {
    this._setManage(false)
  }

  render() {
    const { letterArr, sections } = this.state
    return (
      <Container
        headerProps={{
          title: this.title,
          navigation: this.props.navigation,
          headerRight: this._renderHeaderRight(),
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(80),
          },
          backAction: this.state.isManage && this._closeManage,
        }}
      >
        <SectionList
          ref={ref => (this.SectionList = ref)}
          style={{ marginTop: scaleSize(20) }}
          renderSectionHeader={this._renderSectionHeader}
          sections={sections}
          keyExtractor={(item, index) => index + ''}
          renderItem={({ item, index }) => this._renderItem(item, index)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefresh}
              onRefresh={this.getContacts}
              colors={['orange', 'red']}
              tintColor={'orange'}
              titleColor={'orange'}
              title={getLanguage(this.props.language).Friends.LOADING}
              enabled={true}
            />
          }
        />
        {this.state.sections.length > 30 && (
          <View style={styles.FlatListViewStyle}>
            <FlatList
              data={letterArr}
              keyExtractor={(item, index) => index.toString()} //不重复的key
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.FlatListItemViewStyle}
                  onPress={() => {
                    this._onSectionselect(index)
                  }}
                >
                  <Text style={{ fontSize: scaleSize(25) }}>
                    {item.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
        {this._renderBottom()}
        {this._renderPagePopup()}
        {this._renderDeleteDialog()}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  headerRightBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  headerBtnTitle: {
    fontSize: scaleSize(24),
    color: color.fontColorBlack,
    textAlign: 'right',
  },
  HeadViewStyle: {
    height: scaleSize(72),
    flexDirection: 'row',
    alignItems: 'center',
  },
  HeadTextStyle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.contentColorBlack,
    marginLeft: scaleSize(56),
  },
  ItemViewStyle: {
    height: scaleSize(90),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  itemImg: {
    marginLeft: scaleSize(32),
    height: scaleSize(60),
    width: scaleSize(60),
    borderRadius: scaleSize(30),
    alignItems: 'center',
    justifyContent: 'center',
  },

  ITemTextViewStyle: {
    paddingHorizontal: scaleSize(32),
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  ITemTextStyle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.fontColorBlack,
  },
  FlatListViewStyle: {
    position: 'absolute',
    width: scaleSize(26),
    right: scaleSize(15),
    top: scaleSize(35),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  FlatListItemViewStyle: {
    marginVertical: 2,
    height: scaleSize(30),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkBtn: {
    marginLeft: scaleSize(32),
    height: scaleSize(30),
    width: scaleSize(30),
  },

  bottomView: {
    flexDirection: 'row',
    height: scaleSize(120),
    backgroundColor: color.white,
    alignItems: 'center',
  },
  selectAll: {
    flex: 1,
    marginLeft: scaleSize(32),
    fontSize: size.fontSize.fontSizeLg,
    color: color.contentColorGray,
  },
  bottomBtn: {
    width: scaleSize(224),
    height: scaleSize(80),
    marginRight: scaleSize(24),
    borderRadius: scaleSize(40),
    backgroundColor: color.contentColorGray,
  },
  bottomBtnText: {
    fontSize: size.fontSize.fontSizeXXXl,
    color: color.white,
  },
})

const mapStateToProps = (state: any) => ({
  user: state.user.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
  currentGroup: state.cowork.toJS().currentGroup,
})

const mapDispatchToProps = {
  exitGroup,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupFriendListPage)

