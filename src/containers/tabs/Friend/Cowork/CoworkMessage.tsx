import React, { Component } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import { Container } from '../../../../components'
import { getLanguage } from '../../../../language/index'
import { scaleSize, Toast } from '../../../../utils'
import { getPublicAssets } from '../../../../assets'
import { color } from '../../../../styles'
import CoworkInfo from './CoworkInfo'
import { connect } from 'react-redux'
import MsgConstant from '../../../../constants/MsgConstant'
import { GeometryType } from 'imobile_for_reactnative'
import moment from 'moment'
import NavigationService from '../../../NavigationService'


interface Props {
  language: string,
  navigation: any,
  cowork: any,
  coworkInfo: any,
  currentUser: any,
}

interface State {
  messages: Array<any>,
  selected: Array<any>,
}

class CoworkMessage extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      messages: [],
      selected: [],
    }
  }

  componentDidMount() {
    this.getMessage()
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.cowork.newMessage !== this.props.cowork.newMessage ||
      JSON.stringify(
        prevProps.coworkInfo?.[prevProps.currentUser.userName][prevProps.cowork.currentTask.groupID][prevProps.cowork.currentTask.id] || {}
      ) !==
      JSON.stringify(
        this.props.coworkInfo?.[this.props.currentUser.userName][this.props.cowork.currentTask.groupID][this.props.cowork.currentTask.id] || {}
      )
    ) {
      this.getMessage()
    }
  }

  getMessage = () => {
    let messages = this.props.coworkInfo[this.props.currentUser.userName][this.props.cowork.currentTask.groupID][this.props.cowork.currentTask.id]?.messages || []
    messages = messages.clone().reverse()
    this.setState({
      messages: messages,
    })
    // try {
    //   if (GLOBAL.coworkMode) {
    //     let messages = CoworkInfo.messages
    //     let rvsMsg = messages.clone().reverse()
    //     this.setState({ messages: rvsMsg })
    //     this.setState({ messages: this.props.coworkInfo[this.props.cowork.currentTask.groupID] })
    //   }
    // } catch (error) {
    //   //
    // }
  }

  selecteAll = () => {
    if (this.state.messages.length !== 0) {
      let selected = []
      if (this.state.messages.length !== this.state.selected.length) {
        for (let i = 0; i < this.state.messages.length; i++) {
          if (this.state.messages[i].status === 2) continue
          selected.push(i)
        }
      }
      this.setState({ selected })
    }
  }

  onButtomPress = async (type: string) => {
    try {
      if (this.state.selected.length > 0) {
        let notify = this.state.selected.length === 1
        let selection = this.state.selected.clone()
        selection.sort()
        let result = false
        for (let i = 0; i < selection.length; i++) {
          GLOBAL.Loading.setLoading(
            true,
            getLanguage(GLOBAL.language).Friends.UPDATING,
          )
          let messageID = selection[i]
          if (type === 'update') {
            result = await CoworkInfo.update(messageID, notify)
          } else if (type === 'add') {
            result = await CoworkInfo.add(messageID, notify)
          } else if (type === 'ignore') {
            await CoworkInfo.ignore(messageID)
          }
        }
        result && NavigationService.goBack('CoworkMessage', null)
        this.getMessage()
        GLOBAL.Loading.setLoading(false)
      } else {
        Toast.show(
          getLanguage(GLOBAL.language).Friends.SELECT_MESSAGE_TO_UPDATE,
        )
      }
    } catch (error) {
      this.getMessage()
      GLOBAL.Loading.setLoading(false)
    }
  }

  renderButtoms = () => {
    return (
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: scaleSize(120),
          bottom: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          backgroundColor: 'rgba(240,240,240,1.0)',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this.onButtomPress('update')
          }}
          style={{
            backgroundColor: 'white',
            width: scaleSize(160),
            height: scaleSize(80),
            borderRadius: 2,
            borderWidth: 1,
            borderColor: '#4680DF',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: scaleSize(26), color: '#4680DF' }}>
            {getLanguage(GLOBAL.language).Friends.COWORK_UPDATE}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.onButtomPress('add')
          }}
          style={{
            backgroundColor: 'white',
            width: scaleSize(160),
            height: scaleSize(80),
            borderRadius: 2,
            borderWidth: 1,
            borderColor: '#4680DF',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: scaleSize(26), color: '#4680DF' }}>
            {getLanguage(GLOBAL.language).Friends.COWORK_ADD}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.onButtomPress('ignore')
          }}
          style={{
            backgroundColor: 'white',
            width: scaleSize(160),
            height: scaleSize(80),
            borderRadius: 2,
            borderWidth: 1,
            borderColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: scaleSize(26), color: 'red' }}>
            {getLanguage(GLOBAL.language).Friends.COWORK_IGNORE}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderItem = ({ item }: any) => {
    let message = item
    let messageID = message.messageID
    let isConsumed = message.status
    let time = moment(new Date(message.time)).format('YYYY/MM/DD HH:mm')
    let action = ''
    let actionAfter = ''
    let geoType = ''
    switch (message.message.type) {
      case MsgConstant.MSG_COWORK_ADD:
        action = getLanguage(GLOBAL.language).Friends.SYS_MSG_GEO_ADDED
        actionAfter = getLanguage(GLOBAL.language).Friends.SYS_MSG_GEO_ADDED2
        break
      case MsgConstant.MSG_COWORK_DELETE:
        action = getLanguage(GLOBAL.language).Friends.SYS_MSG_GEO_DELETED
        actionAfter = getLanguage(GLOBAL.language).Friends.SYS_MSG_GEO_DELETED2
        break
      case MsgConstant.MSG_COWORK_UPDATE:
        action = getLanguage(GLOBAL.language).Friends.SYS_MSG_GEO_UPDATED
        actionAfter = getLanguage(GLOBAL.language).Friends.SYS_MSG_GEO_UPDATED2
        break
    }
    switch (message.message.geoType) {
      case GeometryType.GEOPOINT:
        geoType = getLanguage(GLOBAL.language).Profile.DATASET_TYPE_POINT
        break
      case GeometryType.GEOLINE:
        geoType = getLanguage(GLOBAL.language).Profile.DATASET_TYPE_LINE
        break
      case GeometryType.GEOREGION:
        geoType = getLanguage(GLOBAL.language).Profile.DATASET_TYPE_REGION
        break
      case GeometryType.GEOTEXT:
        geoType = getLanguage(GLOBAL.language).Profile.DATASET_TYPE_TEXT
        break
      case GeometryType.GEOGRAPHICOBJECT:
        geoType = getLanguage(GLOBAL.language).Map_Main_Menu.PLOTTING
    }
    if (action) {
      action = action + ' '
    }
    if (actionAfter) {
      actionAfter = ' ' + actionAfter
    }
    return (
      <TouchableOpacity
        style={[
          {
            flexDirection: 'row',
            backgroundColor: 'white',
            height: scaleSize(180),
            alignItems: 'center',
            marginBottom: scaleSize(20),
            paddingLeft: scaleSize(30),
          },
          isConsumed && {
            backgroundColor: '#F5F5F5',
          },
        ]}
        onPress={() => {
          // 忽略之后不可点击
          if (message.status === 2) return
          let selected = this.state.selected.clone()
          if (selected.includes(messageID)) {
            selected.splice(selected.indexOf(messageID), 1)
          } else {
            selected.push(messageID)
          }
          this.setState({ selected })
        }}
      >
        {
          // 忽略之后没有选择框
          message.status === 2
            ? <View style={{ height: scaleSize(50), width: scaleSize(50) }} />
            : (
              <Image
                source={
                  this.state.selected.includes(messageID)
                    ? getPublicAssets().common.icon_check
                    : getPublicAssets().common.icon_uncheck
                }
                style={{ height: scaleSize(50), width: scaleSize(50) }}
              />
            )
        }
        <View style={{ flex: 1, marginHorizontal: scaleSize(20) }}>
          <View>
            <View>
              <Text>{message.user.name}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{ flex: 1, fontSize: scaleSize(26) }}
                numberOfLines={1}
                ellipsizeMode={'tail'}
              >
                {action + geoType + actionAfter}
              </Text>
              <Text
                style={{
                  fontSize: scaleSize(26),
                  color: 'grey',
                  maxWidth: '40%',
                }}
                numberOfLines={1}
                ellipsizeMode={'tail'}
              >
                {message.message.caption || message.message.layerName}
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: scaleSize(26), color: 'grey' }}>{time}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderHeaderRight = () => {
    return (
      <TouchableOpacity onPress={this.selecteAll}>
        <Text style={{ fontSize: scaleSize(26), color: color.fontColorBlack }}>
          {getLanguage(GLOBAL.language).Profile.SELECT_ALL}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Container
        style={{ backgroundColor: 'rgba(240,240,240,1.0)' }}
        headerProps={{
          title: getLanguage(GLOBAL.language).Friends.NEW_MESSAGE,
          withoutBack: false,
          navigation: this.props.navigation,
          headerRight: this.renderHeaderRight(),
        }}
      >
        <FlatList
          style={{ marginBottom: scaleSize(120) }}
          data={this.state.messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderItem}
          extraData={this.state.selected}
        />
        {this.renderButtoms()}
      </Container>
    )
  }
}

const mapStateToProps = (state: any) => ({
  cowork: state.cowork.toJS(),
  currentUser: state.user.toJS().currentUser,
  coworkInfo: state.cowork.toJS().coworkInfo,
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CoworkMessage)
