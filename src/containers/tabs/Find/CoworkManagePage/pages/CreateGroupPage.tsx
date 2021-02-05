import React from 'react'
import { Container, CheckBox, TextBtn } from '../../../../../components'
import { View, Text, TextInput, ScrollView, StyleSheet, Platform, Image, TouchableOpacity } from 'react-native'
import { scaleSize, Toast } from '../../../../../utils'
import { color, size } from '../../../../../styles'
import { getLanguage } from '../../../../../language'
import { UserType } from '../../../../../constants'
import { getPublicAssets, getThemeAssets } from '../../../../../assets'
import { SCoordination, CreateGroupResponse } from 'imobile_for_reactnative'

import { connect } from 'react-redux'
import NavigationService from '../../../../NavigationService'

import { InputClearBtn } from '../../../../../components/Button/index'

const mapStateToProps = (state: any) => ({
  user: state.user.toJS(),
  language: state.setting.toJS().language,
  device: state.device.toJS().device,
})

const mapDispatchToProps = {
}

interface State {
  isPublic: boolean,
  resourceSharer: string,
  isNeedCheck: boolean,
  dataAvailable: boolean,
}

interface Props {
  [name: string]: any,
}

const styles = StyleSheet.create({
  container: {
    // marginLeft: scaleSize(60),
    // marginRight: scaleSize(30),
  },
  headerBtnTitle: {
    color: color.fontColorGray3,
    fontSize: size.fontSize.fontSizeLg,
  },
  topView: {
    flexDirection: 'column',
    backgroundColor: color.white,
    marginHorizontal: scaleSize(40),
    paddingLeft: scaleSize(36),
    paddingRight: scaleSize(28),
    paddingVertical: scaleSize(16),
    borderRadius: scaleSize(40),
    marginTop: scaleSize(30),
    height: scaleSize(360),
  },
  subView: {
    flexDirection: 'column',
    marginHorizontal: scaleSize(40),
  },
  title: {

  },
  topItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: scaleSize(30),
  },
  topItemTitleView: {
    width: scaleSize(120),
    height: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  topItemSeparator: {
    width: '100%',
    height: scaleSize(2),
    paddingLeft: scaleSize(36),
    paddingRight: scaleSize(28),
    backgroundColor: color.itemColorGray2,
  },
  itemTitle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.contentColorGray,
  },
  input: {
    flex: 1,
    fontSize: size.fontSize.fontSizeLg,
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },
  itemTitleView: {
    marginTop: scaleSize(24),
    marginLeft: scaleSize(20),
    flexDirection: 'row',
    height: scaleSize(80),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  shareView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  shareItem: {
    flex: 1,
    backgroundColor: color.white,
    borderRadius: scaleSize(40),
    height: scaleSize(240),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: color.white,
  },
  shareChecked: {
    borderWidth: 1,
    borderColor: color.selected_blue,
  },
  shareItemImg: {
    height: scaleSize(100),
    width: scaleSize(100),
    alignSelf: 'center',
    marginTop: scaleSize(-40),
  },
  shareItemTitle: {
    position: 'absolute',
    left: scaleSize(34),
    bottom: scaleSize(22),
    fontSize: size.fontSize.fontSizeLg,
    color: color.contentColorGray,
  },
  shareItemCheck: {
    position: 'absolute',
    right: scaleSize(20),
    top: scaleSize(20),
  },

  typeView: {
    flexDirection: 'column',
    paddingVertical: scaleSize(20),
    justifyContent: 'space-around',
    borderRadius: scaleSize(40),
    backgroundColor: color.white,
  },
  typeItem: {
    flexDirection: 'row',
    height: scaleSize(80),
    alignItems: 'center',
  },
  typeTitle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.contentColorGray,
    marginLeft: scaleSize(34),
    padding: 0,
  },
  typeSubTitle: {
    flex: 1,
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorGray3,
    marginLeft: scaleSize(20),
    ...Platform.select({
      android: {
        height: scaleSize(80),
        textAlignVertical: 'center',
      },
    }),
  },
  typeItemCheck: {
    marginRight: scaleSize(20),
  },
  typeCheckView: {
    marginTop: scaleSize(24),
    marginLeft: scaleSize(34),
    flexDirection: 'row',
    height: scaleSize(80),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
})

class CreateGroupPage extends React.Component<Props, State> {

  title: string
  initData: any
  servicesUtils: any
  onlineServicesUtils: any
  container: any
  shareData: Array<{title: string, value: string}>
  typeData: Array<{title: string, value: boolean}>
  callBack: (data?: any) => void
  groupInfo = {
    icon: null,
    groupName: '',
    tags: '',
    description: '',
  }
  isCreating: boolean // 防止重复创建
  inputRef: Object // 输入框Ref
  constructor(props: Props) {
    super(props)

    this.callBack = this.props.navigation?.state?.params?.callBack
    this.initData = this.props.navigation?.state?.params?.initData
    this.title = this.initData
      ? getLanguage(this.props.language).Friends.GROUP_SETTING
      : getLanguage(this.props.language).Friends.GROUP_CREATE
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('online')
    } else if (UserType.isIPortalUser(this.props.user.currentUser)){
      this.servicesUtils = new SCoordination('iportal')
    }
    this.shareData = [
      {
        title: getLanguage(props.language).Friends.CREATOR,
        value: 'CREATOR',
      },
      {
        title: getLanguage(props.language).Friends.ALL_MEMBER,
        value: 'MEMBER',
      },
    ]
    let isPublic = this.initData?.isPublic !== undefined ? this.initData.isPublic : true
    this.typeData = [
      {
        title: getLanguage(props.language).Friends.GROUP_TYPE_PRIVATE,
        value: !isPublic,
      },
      {
        title: getLanguage(props.language).Friends.GROUP_TYPE_PUBLIC,
        value: isPublic,
      },
    ]
    if (this.initData) {
      this.groupInfo = {
        icon: null,
        groupName: this.initData.groupName,
        tags: this.initData.tags.toString(),
        description: this.initData.description,
      }
    }
    this.isCreating = false
    this.state = {
      isPublic: isPublic,
      resourceSharer: this.initData?.resourceSharer || 'MEMBER',
      isNeedCheck: this.initData?.isNeedCheck === undefined ? true : this.initData.isNeedCheck,
      dataAvailable: !this.checkData(),
    }

    // 输入框ref
    this.inputRef = {}
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    let shouldUpdate = JSON.stringify(nextState) !== JSON.stringify(this.state) ||
    JSON.stringify(nextProps) !== JSON.stringify(this.props)
    return shouldUpdate
  }

  checkData = (): string => {
    if (!this.groupInfo.groupName) {
      return getLanguage(this.props.language).Friends.GROUP_NAME_NOT_EMPTY
    }
    if (this.groupInfo.groupName.length > 20) {
      return getLanguage(this.props.language).Friends.GROUP_NAME_PLACEHOLDER
    }
    if (!this.groupInfo.tags) {
      return getLanguage(this.props.language).Friends.GROUP_TAG_NOT_EMPTY
    }
    let _tags = this.groupInfo.tags.split(',')
    if (_tags.length > 5) {
      return getLanguage(this.props.language).Friends.GROUP_TAG_PLACEHOLDER
    }
    if (this.groupInfo.description.length > 100) {
      return getLanguage(this.props.language).Friends.GROUP_REMARK_PLACEHOLDER
    }
    return ''
  }

  create = () => {
    if (this.isCreating) return
    let msg = this.checkData()
    if (msg) {
      Toast.show(msg)
      return
    }
    this.isCreating = true
    let _tags = this.groupInfo.tags.split(',')
    this.servicesUtils.createGroup({
      groupName: this.groupInfo.groupName,
      tags: _tags,
      isPublic: this.state.isPublic,
      description: this.groupInfo.description,
      resourceSharer: this.state.resourceSharer,
      isNeedCheck: this.state.isNeedCheck,
    }).then((result: CreateGroupResponse) => {
      if (result.succeed) {
        Toast.show(getLanguage(this.props.language).Friends.GROUP_CREATE_SUCCUESS)
        this.callBack && this.callBack({
          id: result.newResourceID,
          groupName: this.groupInfo.groupName,
          creator: this.props.user.currentUser.userName,
        })
        NavigationService.goBack('CreateGroupPage', null)
        this.isCreating = false
      } else {
        this.isCreating = false
        if (result.error?.errorMsg) {
          Toast.show(result.error.errorMsg)
        } else {
          Toast.show(getLanguage(this.props.language).Friends.GROUP_CREATE_FAILED)
        }
      }
    }).catch(() => {
      this.isCreating = false
    })
  }

  modify = () => {
    let msg = this.checkData()
    if (msg) {
      Toast.show(msg)
      return
    }
    let _tags = this.groupInfo.tags.split(',')
    let modifyData = {
      groupName: this.groupInfo.groupName,
      tags: _tags,
      isPublic: this.state.isPublic,
      description: this.groupInfo.description,
      resourceSharer: this.state.resourceSharer,
      isNeedCheck: this.state.isNeedCheck,
    }
    this.servicesUtils.modifyGroup({
      id: this.initData.id,
      ...modifyData,
    }).then((result: CreateGroupResponse) => {
      if (result.succeed) {
        Toast.show(getLanguage(this.props.language).Prompt.SAVE_SUCCESSFULLY)
        // 把修改后的群组数据返回上一页面
        this.callBack && this.callBack(Object.assign({}, this.initData, modifyData))
        NavigationService.goBack('CreateGroupPage', null)
      } else {
        if (result.error?.errorMsg) {
          Toast.show(result.error.errorMsg)
        } else {
          Toast.show(getLanguage(this.props.language).Prompt.SAVE_FAILED)
        }
      }
    })
  }

  _checkAvailable = () => {
    if (!this.groupInfo.groupName) {
      return false
    }
    if (this.groupInfo.groupName.length > 20) {
      return false
    }
    if (!this.groupInfo.tags) {
      return false
    }
    let _tags = this.groupInfo.tags.split(',')
    if (_tags.length > 5) {
      return false
    }
    if (this.groupInfo.description.length > 100) {
      return false
    }
  }

  _renderTopItem = (data: {title: string, defaultValue: string, placeholder: string, onChangeText: (text: string) => void, keyValue: string}) : any => {
    return (
      <View style={styles.topItem}>
        <View style={styles.topItemTitleView}>
          <Text style={styles.itemTitle}>{data.title + ':'}</Text>
        </View>
        <TextInput
          clearButtonMode={'while-editing'}
          placeholder={data.placeholder}
          style={styles.input}
          defaultValue={data.defaultValue}
          underlineColorAndroid="transparent"
          placeholderTextColor={color.fontColorGray3}
          onChangeText={text => {
            if (data.onChangeText) data.onChangeText(text)
            if (!this.checkData() && !this.state.dataAvailable) {
              this.setState({
                dataAvailable: true,
              })
            } else if (this.checkData() && this.state.dataAvailable) {
              this.setState({
                dataAvailable: false,
              })
            }
          }}
          ref={ ref => this.inputRef[data.keyValue] = ref}
        />
        {/* 安卓下模拟清除按钮 使用Input组件要大量改变样式 所以外部加一个 */}
        <InputClearBtn
          os="android"
          onPress={()=> {
            this.inputRef[data.keyValue]?.clear()
            data.onChangeText('')
          }}
        />
      </View>
    )
  }

  _renderTopView = () => {
    return (
      <View style={styles.topView}>
        {
          this._renderTopItem({
            title: getLanguage(this.props.language).Friends.NAME,
            placeholder: getLanguage(this.props.language).Friends.GROUP_NAME_PLACEHOLDER,
            defaultValue: this.groupInfo.groupName,
            onChangeText: text => {
              this.groupInfo.groupName = text
              if (this.groupInfo.groupName.length > 20) {
                Toast.show(getLanguage(this.props.language).Friends.GROUP_NAME_PLACEHOLDER)
              }
            },
            keyValue: 'name',
          })
        }
        <View style={styles.topItemSeparator} />
        {
          this._renderTopItem({
            title: getLanguage(this.props.language).Friends.GROUP_TAG,
            placeholder: getLanguage(this.props.language).Friends.GROUP_TAG_PLACEHOLDER,
            defaultValue: this.groupInfo.tags,
            onChangeText: text => {
              this.groupInfo.tags = text
              let _tags = this.groupInfo.tags.split(',')
              if (_tags.length > 5) {
                Toast.show(getLanguage(this.props.language).Friends.GROUP_TAG_PLACEHOLDER)
              }
            },
            keyValue: 'tag',
          })
        }
        <View style={styles.topItemSeparator} />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          <View style={styles.topItemTitleView}>
            <Text style={styles.itemTitle}>{getLanguage(this.props.language).Friends.GROUP_REMARK + ':'}</Text>
          </View>
          <TextInput
            clearButtonMode={'while-editing'}
            placeholder={getLanguage(this.props.language).Friends.GROUP_REMARK_PLACEHOLDER}
            defaultValue={this.groupInfo.description}
            style={[
              styles.input,
              {
                height: scaleSize(140),
                marginTop: scaleSize(15),
                textAlignVertical: 'top',
                ...Platform.select({
                  android: {
                    paddingTop: scaleSize(7),
                  },
                }),
              }]}
            underlineColorAndroid="transparent"
            placeholderTextColor={color.fontColorGray3}
            multiline={true}
            onChangeText={text => {
              this.groupInfo.description = text
              if (!this.checkData() && !this.state.dataAvailable) {
                this.setState({
                  dataAvailable: true,
                })
              } else if (this.checkData()) {
                if (this.groupInfo.description.length > 100) {
                  Toast.show(getLanguage(this.props.language).Friends.GROUP_REMARK_PLACEHOLDER)
                }
                this.state.dataAvailable && this.setState({
                  dataAvailable: false,
                })
              }
            }}
            ref={ref => this.inputRef['remark'] = ref}
          />
          <InputClearBtn os="android"
            onPress={()=> {
              this.inputRef['remark']?.clear()
              this.groupInfo.description = ''
            }}
            style={{ alignSelf: 'center' }} />
        </View>
      </View>
    )
  }

  _renderSharingItem = (data: {image: any, title: string, value: string, style?: any}): any => {
    let checked = data.value === this.state.resourceSharer
    return (
      <TouchableOpacity
        style={[styles.shareItem, data.style, checked && styles.shareChecked]}
        activeOpacity={0.8}
        onPress={() => {
          this.setState({
            resourceSharer: data.value,
          })
        }}
      >
        <Image resizeMode={'contain'} source={data.image} style={styles.shareItemImg} />
        <Text style={styles.shareItemTitle}>{data.title}</Text>
        <Image
          style={styles.shareItemCheck}
          resizeMode={'contain'}
          source={checked ? getPublicAssets().common.icon_single_check : getPublicAssets().common.icon_none}
        />
      </TouchableOpacity>
    )
  }

  _renderSharingView = () => {
    return (
      <View style={styles.subView}>
        <View style={styles.itemTitleView}>
          <Text style={styles.itemTitle}>{getLanguage(this.props.language).Friends.RESOURCE_SHARER}</Text>
        </View>
        <View style={styles.shareView}>
          {this._renderSharingItem({
            title: getLanguage(this.props.language).Friends.CREATOR,
            value: 'CREATOR',
            image: getThemeAssets().cowork.icon_group_creator,
          })}
          {this._renderSharingItem({
            title: getLanguage(this.props.language).Friends.ALL_MEMBER,
            value: 'MEMBER',
            image: getThemeAssets().cowork.icon_group_all,
            style: { marginLeft: scaleSize(40) },
          })}
        </View>
      </View>
    )
  }

  _renderTypeItem = (data: {title: any, subTitle: string}): any => {
    let checked = false
    if (this.state.isPublic && data.title === getLanguage(this.props.language).Friends.GROUP_TYPE_PUBLIC) {
      checked = true
    } else if (!this.state.isPublic && data.title === getLanguage(this.props.language).Friends.GROUP_TYPE_PRIVATE) {
      checked = true
    }
    return (
      <TouchableOpacity
        style={styles.typeItem}
        activeOpacity={0.8}
        onPress={() => {
          this.setState({
            isPublic: data.title === getLanguage(this.props.language).Friends.GROUP_TYPE_PUBLIC,
          })
        }}
      >
        <Text style={styles.typeTitle} numberOfLines={1}>{data.title}</Text>
        <Text style={styles.typeSubTitle} numberOfLines={2}>({data.subTitle})</Text>
        <Image
          style={styles.typeItemCheck}
          resizeMode={'contain'}
          source={checked ? getPublicAssets().common.icon_single_check : getPublicAssets().common.icon_none}
        />
      </TouchableOpacity>
    )
  }

  _renderTypeView = () => {
    return (
      <View style={styles.subView}>
        <View style={styles.itemTitleView}>
          <Text style={styles.itemTitle}>{getLanguage(this.props.language).Friends.GROUP_TYPE}</Text>
        </View>
        <View style={styles.typeView}>
          {this._renderTypeItem({
            title: getLanguage(this.props.language).Friends.GROUP_TYPE_PRIVATE,
            subTitle: getLanguage(this.props.language).Friends.GROUP_TYPE_PRIVATE_INFO,
          })}
          {this._renderTypeItem({
            title: getLanguage(this.props.language).Friends.GROUP_TYPE_PUBLIC,
            subTitle: getLanguage(this.props.language).Friends.GROUP_TYPE_PUBLIC_INFO,
          })}
          {
            this.state.isPublic &&
            <View style={styles.typeCheckView}>
              <CheckBox
                style={{
                  height: scaleSize(30),
                  width: scaleSize(30),
                }}
                checked={this.state.isNeedCheck}
                onChange={value => {
                  this.setState({
                    isNeedCheck: value,
                  })
                }}
              />
              <Text style={[styles.itemTitle, {marginLeft: scaleSize(20)}]}>
                {
                  getLanguage(GLOBAL.language).Friends.GROUP_TYPE_PUBLIC_CHECK_INFO
                }
              </Text>
            </View>
          }
        </View>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={(ref: any) => (this.container = ref)}
        headerProps={{
          title: this.title,
          navigation: this.props.navigation,
          headerRight: (
            <TextBtn
              btnText={this.initData ? getLanguage(this.props.language).Prompt.SAVE_YES : getLanguage(this.props.language).Friends.CREATE}
              textStyle={[styles.headerBtnTitle, !this.checkData() && {color: color.contentColorGray}]}
              btnClick={this.initData ? this.modify : this.create}
            />
          ),
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(80),
          },
          headerStyle: {
            borderBottomWidth: 0,
            backgroundColor: color.bgW,
          },
        }}
        style={{
          backgroundColor: color.bgW,
        }}
      >
        <ScrollView
          style={styles.container}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {this._renderTopView()}
          {this._renderSharingView()}
          {this._renderTypeView()}
        </ScrollView>
      </Container>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateGroupPage)
