import React from 'react'
import { Container, CheckBox, RadioGroup, TextBtn } from '../../../../../components'
import { View, Text, TextInput, ScrollView, StyleSheet, Platform } from 'react-native'
import { scaleSize, Toast } from '../../../../../utils'
import { color, size } from '../../../../../styles'
import { getLanguage } from '../../../../../language'
import { UserType } from '../../../../../constants'
import { SCoordination, CreateGroupResponse } from 'imobile_for_reactnative'

import { connect } from 'react-redux'
import NavigationService from '../../../../NavigationService'

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
}

interface Props {
  [name: string]: any,
}

const styles = StyleSheet.create({
  container: {
    marginLeft: scaleSize(60),
    marginRight: scaleSize(30),
  },
  headerBtnTitle: {
    color: color.fontColorBlack,
    fontSize: 17,
  },
  subView: {
    flexDirection: 'column',
  },
  topItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleSize(30),
  },
  topItemTitleView: {
    width: scaleSize(120),
    height: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  topItemContentView: {
    flex: 1,
    borderBottomWidth: 1,
  },
  itemTitle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.fontColorBlack,
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
    flexDirection: 'row',
    height: scaleSize(80),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
})

class CreateGroupPage extends React.Component<Props, State> {

  servicesUtils: any
  onlineServicesUtils: any
  container: any
  shareData: Array<{title: string, value: string}>
  typeData: Array<{title: string, value: boolean}>
  callBack: () => void
  groupInfo = {
    icon: null,
    groupName: '',
    tags: '',
    description: '',
  }

  constructor(props: Props) {
    super(props)

    this.callBack = this.props.navigation?.state?.params?.callBack
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
    this.typeData = [
      {
        title: getLanguage(props.language).Friends.GROUP_TYPE_PRIVATE,
        value: false,
      },
      {
        title: getLanguage(props.language).Friends.GROUP_TYPE_PUBLIC,
        value: true,
      },
    ]
    this.state = {
      isPublic: true,
      resourceSharer: 'MEMBER',
      isNeedCheck: true,
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    let shouldUpdate = JSON.stringify(nextState) !== JSON.stringify(this.state) ||
    JSON.stringify(nextProps) !== JSON.stringify(this.props)
    return shouldUpdate
  }

  create = () => {
    if (!this.groupInfo.groupName) {
      Toast.show(getLanguage(this.props.language).Friends.GROUP_NAME_NOT_EMPTY)
      return
    }
    if (!this.groupInfo.tags) {
      Toast.show(getLanguage(this.props.language).Friends.GROUP_TAG_NOT_EMPTY)
      return
    }
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
        this.callBack && this.callBack()
        NavigationService.goBack('CreateGroupPage', null)
      } else {
        if (result.error?.errorMsg) {
          Toast.show(result.error.errorMsg)
        } else {
          Toast.show(getLanguage(this.props.language).Friends.GROUP_CREATE_FAILED)
        }
      }
    })
  }

  _renderTopItem = (title: string, placeholder: string, onChangeText: (text: string) => void) : any => {
    return (
      <View style={styles.topItem}>
        <View style={styles.topItemTitleView}>
          <Text style={styles.itemTitle}>{title}</Text>
        </View>
        <View style={styles.topItemContentView}>
          <TextInput
            placeholder={placeholder}
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholderTextColor={color.fontColorGray3}
            onChangeText={text => {
              if (onChangeText) onChangeText(text)
            }}
          />
        </View>
      </View>
    )
  }

  _renderTopView = () => {
    return (
      <View style={styles.subView}>
        {this._renderTopItem(
          getLanguage(this.props.language).Friends.NAME,
          getLanguage(this.props.language).Friends.GROUP_NAME_PLACEHOLDER,
          text => this.groupInfo.groupName = text,
        )}
        {this._renderTopItem(
          getLanguage(this.props.language).Friends.GROUP_TAG,
          getLanguage(this.props.language).Friends.GROUP_TAG_PLACEHOLDER,
          text => this.groupInfo.tags = text,
        )}
        {this._renderTopItem(
          getLanguage(this.props.language).Friends.GROUP_REMARK,
          getLanguage(this.props.language).Friends.GROUP_REMARK_PLACEHOLDER,
          text => this.groupInfo.description = text,
        )}
      </View>
    )
  }

  _renderSharingView = () => {
    return (
      <View style={[styles.subView, {marginTop: scaleSize(30)}]}>
        <View style={styles.itemTitleView}>
          <Text style={styles.itemTitle}>{getLanguage(this.props.language).Friends.RESOURCE_SHARER}</Text>
        </View>
        <RadioGroup
          data={this.shareData}
          column={1}
          radioStyle={{
            titleStyle: {
              fontSize: size.fontSize.fontSizeLg,
            },
          }}
          defaultValue={this.shareData[1].value}
          getSelected={data => {
            this.setState({
              resourceSharer: data.value
            })
          }}
        />
      </View>
    )
  }

  _renderTypeView = () => {
    return (
      <View style={[styles.subView, {marginTop: scaleSize(30)}]}>
        <View style={styles.itemTitleView}>
          <Text style={styles.itemTitle}>{getLanguage(this.props.language).Friends.GROUP_TYPE}</Text>
        </View>
        <RadioGroup
          data={this.typeData}
          column={1}
          defaultValue={this.typeData[1].value}
          getSelected={data => {
            this.setState({
              isPublic: data.value
            })
          }}
        />
         <View style={styles.itemTitleView}>
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
            <Text style={styles.itemTitle}>
              {
                getLanguage(GLOBAL.language).Friends.GROUP_TYPE_PUBLIC_CHECK_INFO
              }
            </Text>
          </View>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={(ref: any) => (this.container = ref)}
        headerProps={{
          title: getLanguage(this.props.language).Friends.GROUP_CREATE,
          navigation: this.props.navigation,
          headerRight: (
            <TextBtn
              btnText={getLanguage(this.props.language).Friends.CREATE}
              textStyle={styles.headerBtnTitle}
              btnClick={this.create}
            />
          ),
        }}
      >
        <ScrollView style={styles.container}>
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
