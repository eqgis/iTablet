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
import { getLanguage } from '../../../../../language'
import { Users } from '../../../../../redux/models/user'
import { SCoordination } from 'imobile_for_reactnative'
import { Person } from '../types'

interface Props {
  language: String,
  navigation: Object,
  user: Users,
  device: any,
}

type State = {
  sections: Array<any>
  listData: Array<any>, //源数组
  letterArr: Array<string>, //首字母数组
  isRefresh: boolean,
  inputText: string,
  isManage: boolean,
  selectedMembers: Map<string, Object>, //被选中人员数组数组
  dialogInfo: string,
}

interface SectionType  {
  key: string
  title: string
  data: any
}

class GroupFriendListPage extends Component<Props, State> {
  title: string
  servicesUtils: SCoordination | undefined
  groupInfo: any
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
    this.groupInfo = this.props.navigation?.state?.params?.groupInfo
    this.callBack = this.props.navigation?.state?.params?.callBack
    this.mode = this.props.navigation?.state?.params?.mode === undefined ? 'select' : this.props.navigation?.state?.params?.mode
    this.includeMe = this.props.navigation?.state?.params?.includeMe === undefined ? true : this.props.navigation?.state?.params?.includeMe
    this.title = this.props.navigation?.state?.params?.title || getLanguage(this.props.language).Friends.TITLE_CHOOSE_MEMBER
    
    this.state = {
      sections: [], //section数组
      listData: [], //源数组
      letterArr: [], //首字母数组
      isRefresh: false,
      inputText: '',
      isManage: false,
      selectedMembers: new Map<string, Object>(),
      dialogInfo: '',
    }
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('online')
    } else if (UserType.isIPortalUser(this.props.user.currentUser)){
      this.servicesUtils = new SCoordination('iportal')
    }
    this.popData = [
      // {
      //   title: getLanguage(GLOBAL.language).Friends.GROUP_INVITE,
      //   action: () => {
      //     NavigationService.navigate('GroupInvitePage', {
      //       groupInfo: this.groupInfo,
      //     })
      //   },
      // },
    ]

    if (this.props.user.currentUser.userId === this.groupInfo.creator) {
      this.popData = this.popData.concat([
        {
          title: getLanguage(this.props.language).Friends.GROUP_MEMBER_DELETE,
          action: () => {
            this._setManage(true)
          },
        },
        {
          title: getLanguage(GLOBAL.language).Friends.GROUP_DELETE,
          action: () => {
            this._setDialogVisible(true, getLanguage(GLOBAL.language).Friends.GROUP_DELETE_INFO)
            this.dialogAction = () => {
              this.servicesUtils?.deleteGroup([this.groupInfo.id]).then((result: any) => {
                this._setDialogVisible(false)
                NavigationService.goBack('CoworkManagePage', null)
              })
            }
          },
        },
      ])
    } else {
      this.popData.push({
        title: getLanguage(GLOBAL.language).Friends.GROUP_EXIST,
        action: () => {
          this._setDialogVisible(true, getLanguage(GLOBAL.language).Friends.GROUP_EXIST_INFO)
          this.dialogAction = () => {
            this.servicesUtils?.deleteGroupMembers({
              groupId: this.groupInfo.id,
              userIds: [this.props.user.currentUser.userId],
            }).then(result => {
              if (result.succeed) {
                this._setDialogVisible(false)
                NavigationService.goBack('CoworkManagePage', null)
              }
            })
          }
        },
      })
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
      groupId: this.groupInfo.id,
    }).then((result: any) => {
      let persons = result.content
      if (persons.length > 0) {
        try {
          let sections: SectionType[] = [],
            letterArr = []

          // TODO 过滤当前用户
          for (let i = 0; i < persons.length; i++) {
            let person = persons[i]
            if (!this.includeMe && person.userName === this.props.user.currentUser.userId) continue // 过滤当前用户
            let name = person.nickname
            let firstChar = getPinYinFirstCharacter(name, '-', true)
            let ch = firstChar[0]
            if (letterArr.indexOf(ch) === -1) {
              letterArr.push(ch)
            }
          }
  
          letterArr.sort()

          letterArr.map((item, index) => {
            const module = persons.filter((it: Person) => {
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
          })
          // eslint-disable-next-line
        } catch (err) {
          //console.log('err', err)
          Toast.show(err.message)
        }
      } else {
        this.setState({
          letterArr: [],
          sections: [],
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

  _itemPress = (item: Person, index: number) => {
    if (this.mode === 'select') {
      this.callBack && this.callBack([item])
    }
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

  _renderSectionHeader = (sectionItem: any) => {
    const { section } = sectionItem
    let isFirstSection = section.key === this.state.sections[0].key &&
      section.title === this.state.sections[0].title
    return (
      <View style={[
        styles.HeadViewStyle,
        isFirstSection && {
          borderTopLeftRadius: scaleSize(36),
          borderTopRightRadius: scaleSize(36),
        },
      ]}>
        <Text style={styles.HeadTextStyle}>{section.title.toUpperCase()}</Text>
      </View>
    )
  }

  _renderItem = (item: Person, index: number) => {
    return (
      <TouchableOpacity
        style={[styles.ItemViewStyle]}
        activeOpacity={0.75}
        onPress={() => this._itemPress(item, index)}
      >
        {
          (this.state.isManage || this.mode === 'multiSelect') &&
          this.props.user.currentUser.userId !== item.userName &&
          <CheckBox
            style={{
              marginLeft: scaleSize(32),
              height: scaleSize(30),
              width: scaleSize(30),
            }}
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
        }
        <Image
          style={styles.itemImg}
          resizeMode={'contain'}
          source={getThemeAssets().friend.contact_photo}
        />
        <View style={styles.ITemTextViewStyle}>
          <Text style={styles.ITemTextStyle}>{item.nickname}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  _renderHeaderRight = () => {
    if (this.mode === 'select') return null
    let isMultiSelect = this.mode === 'multiSelect'
    if (this.state.isManage || isMultiSelect) {
      return (
        <TextBtn
          btnText={
            isMultiSelect
             ? getLanguage(this.props.language).Friends.CONFIRM
             : (
              this.state.isManage
                ? getLanguage(this.props.language).Prompt.DELETE
                : getLanguage(this.props.language).Friends.GROUP_MANAGE
             )
          }
          textStyle={[styles.headerBtnTitle, !isMultiSelect && this.state.isManage && {color: 'red'}]}
          btnClick={event => {
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
                  groupId: this.groupInfo.id,
                  userIds: userIds,
                }).then(async result => {
                  if (result.succeed) {
                    await this.getContacts()
                    this._setDialogVisible(false)
                    this._setManage()
                  }
                })
              }
            }
          }}
        />
      )
    } else {
      return (
        <ImageButton
          icon={getThemeAssets().tabBar.tab_setting_selected}
          onPress={(event: any) => {
            this.pagePopModal?.setVisible(true, {
              x: event.nativeEvent.pageX,
              y: event.nativeEvent.pageY,
            })
          }}
        />
      )
    }
  }

  _renderHeaderLeft = () => {
    return (
      <TextBtn
        btnText={getLanguage(this.props.language).Friends.CANCEL}
        textStyle={[styles.headerBtnTitle]}
        btnClick={() => this._setManage(false)}
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
        confirmBtnTitle={getLanguage(this.props.language).Prompt.DELETE}
        cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
      />
    )
  }

  render() {
    const { letterArr, sections } = this.state
    return (
      <Container
        // ref={(ref: any) => (this.container = ref)}
        headerProps={{
          title: this.title,
          navigation: this.props.navigation,
          headerRight: this._renderHeaderRight(),
          headerLeft: this.state.isManage && this._renderHeaderLeft(),
        }}
      >
        <SectionList
          ref={ref => (this.SectionList = ref)}
          style={{marginTop: scaleSize(20)}}
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
        {this._renderPagePopup()}
        {this._renderDeleteDialog()}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  headerBtnTitle: {
    fontSize: scaleSize(24),
    color: color.fontColorBlack,
  },
  HeadViewStyle: {
    height: scaleSize(72),
    backgroundColor: color.itemColorGray2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  HeadTextStyle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.contentColorBlack,
    marginLeft: scaleSize(80),
  },
  ItemViewStyle: {
    paddingLeft: scaleSize(20),
    paddingRight: scaleSize(30),
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
})

const mapStateToProps = (state: any) => ({
  user: state.user.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupFriendListPage)

