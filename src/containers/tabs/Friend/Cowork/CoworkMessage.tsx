import React, { Component, PureComponent } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import { Container, MTBtn } from '../../../../components'
import { getLanguage } from '../../../../language/index'
import { scaleSize, setSpText, Toast } from '../../../../utils'
import { getPublicAssets, getThemeAssets } from '../../../../assets'
import { color } from '../../../../styles'
import CoworkInfo from './CoworkInfo'
import { connect } from 'react-redux'
import MsgConstant from '../../../../constants/MsgConstant'
import moment from 'moment'
import NavigationService from '../../../NavigationService'
import { ChunkType } from '@/constants'
import { GeometryType } from 'imobile_for_reactnative/NativeModule/interfaces/data/SDataType'


interface Props {
  language: string,
  navigation: any,
  cowork: any,
  coworkInfo: any,
  currentUser: any,
}

interface State {
  messages: Array<any>,
  // selected: Array<any>,
  selected: Map<number, any>,
}

class CoworkMessage extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      messages: [],
      selected: new Map<number, any>(),
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

  getMessage = (selected = this.state.selected) => {
    let messages = this.props.coworkInfo[this.props.currentUser.userName][this.props.cowork.currentTask.groupID][this.props.cowork.currentTask.id]?.messages || []
    messages = messages.clone().reverse()
    this.setState({
      messages: messages,
      selected,
    })
  }

  selecteAll = () => {
    if (this.state.messages.length !== 0) {
      const selected = new Map<number, any>()
      if (this.state.messages.length !== this.state.selected.size) {

        if (this.state.messages.length > this.state.selected.size) {
          this.state.messages.forEach((item: any) => {
            selected.set(item.messageID, item)
          })
        }
      }
      this.setState({ selected })
    }
  }

  onButtomPress = async (type: string) => {
    try {
      if (this.state.selected.size > 0) {
        let notify = this.state.selected.size === 1
        let selection = new Map().clone(this.state.selected)
        // selection.sort((a: number, b: number) => b - a)
        let result = false
        if (selection.size > 0) {
          const keys = selection.keys()
          for(let key of keys) {
            global.Loading.setLoading(
              true,
              getLanguage(global.language).Friends.UPDATING,
            )
            let messageID = selection.get(key).messageID
            if (type === 'update') {
              result = await CoworkInfo.update(messageID, false, notify)
            } else if (type === 'add') {
              result = await CoworkInfo.add(messageID, false, notify)
            } else if (type === 'ignore') {
              selection.delete(key)
              await CoworkInfo.ignore(messageID)
            }
            const coworkMessages = this.props.cowork.coworkInfo?.[this.props.currentUser.userName]?.[this.props.cowork.currentTask?.groupID]?.[this.props.cowork.currentTask?.id]?.messages || []
            if (coworkMessages.length > 0) {
              const serviceUrl = coworkMessages[messageID]?.message?.serviceUrl
              if (serviceUrl) {
                for (const message of coworkMessages) {
                  if (message.message?.serviceUrl === serviceUrl && message.status === 0) {
                    CoworkInfo.consumeMessage(message.messageID)
                  }
                }
              }
            }
          }
        }
        result && NavigationService.goBack('CoworkMessage', null)
        this.getMessage(selection)
        global.Loading.setLoading(false)
      } else {
        Toast.show(
          getLanguage(global.language).Friends.SELECT_MESSAGE_TO_UPDATE,
        )
      }
    } catch (error) {
      this.getMessage()
      global.Loading.setLoading(false)
    }
  }

  _renderButton = (item: {title: string, image: any, disableImage?: any, disable?: boolean, action: () => void}) => {
    return (
      <MTBtn
        key={item.title}
        style={{
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title={item.title}
        textColor={item.disable ? color.fontColorGray : '#1D1D1D'}
        textStyle={{ fontSize: setSpText(20) }}
        image={item.disable && item.disableImage ? item.disableImage : item.image}
        onPress={async () => {
          if (item.action && !item.disable) {
            item.action()
          }
        }}
      />
    )
  }

  renderButtons = () => {
    // MSG_COWORK_SERVICE_UPDATE: 15, // 数据服务更新
    // MSG_COWORK_SERVICE_PUBLISH: 16, // 数据服务发布
    let canAdd = true
    const keys = this.state.selected.keys()
    for(let key of keys) {
      if (
        this.state.selected.get(key).message.type === MsgConstant.MSG_COWORK_SERVICE_UPDATE ||
        this.state.selected.get(key).message.type === MsgConstant.MSG_COWORK_SERVICE_PUBLISH
      ) {
        canAdd = false
        break
      }
    }
    return (
      <View
        style={{
          width: '100%',
          height: scaleSize(160),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          backgroundColor: 'white',
          borderTopRightRadius: scaleSize(40),
          borderTopLeftRadius: scaleSize(40),
        }}
      >
        {this._renderButton({
          title: getLanguage(global.language).Friends.COWORK_UPDATE,
          image: getThemeAssets().edit.icon_redo,
          action: () => this.onButtomPress('update'),
        })}
        {Object.keys(ChunkType).indexOf(global.Type) >= 0 && this._renderButton({
          title: getLanguage(global.language).Friends.COWORK_ADD,
          image: getThemeAssets().publicAssets.icon_add,
          disableImage: getThemeAssets().publicAssets.icon_add_disable,
          disable: !canAdd,
          action: () => this.onButtomPress('add'),
        })}
        {this._renderButton({
          title: getLanguage(global.language).Friends.COWORK_IGNORE,
          image: getThemeAssets().publicAssets.icon_ignore,
          action: () => this.onButtomPress('ignore'),
        })}
      </View>
    )
  }

  renderItem = ({ item }: any) => {
    return (
      <CoworkMessageItem
        key={item.time + '_' + item.messageID}
        data={item}
        selected={this.state.selected.has(item.messageID)}
        onPress={data => {
          // 忽略之后不可点击
          if (data.status === 2) return
          let selected = new Map().clone(this.state.selected)
          if (selected.has(data.messageID)) {
            selected.delete(data.messageID)
          } else {
            selected.set(data.messageID, data)
          }
          this.setState({ selected })
        }}
      />
    )
  }

  renderHeaderRight = () => {
    return (
      <TouchableOpacity onPress={this.selecteAll}>
        <Text style={{ fontSize: scaleSize(26), color: color.fontColorBlack }}>
          {getLanguage(global.language).Profile.SELECT_ALL}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Container
        style={{ backgroundColor: 'rgba(240,240,240,1.0)' }}
        headerProps={{
          title: getLanguage(global.language).Friends.NEW_MESSAGE,
          withoutBack: false,
          navigation: this.props.navigation,
          headerRight: this.renderHeaderRight(),
        }}
      >
        <FlatList
          data={this.state.messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderItem}
          extraData={this.state.selected}
        />
        {this.renderButtons()}
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

interface ItemProps {
  data: any,
  selected: boolean,
  onPress: (data: any) => void,
}

class CoworkMessageItem extends PureComponent<ItemProps, {}> {
  constructor(props: ItemProps) {
    super(props)
  }

  _onPress = () => {
    this.props.onPress(this.props.data)
  }

  render() {
    let message = this.props.data
    let isConsumed = message.status
    let time = moment(new Date(message.time)).format('YYYY/MM/DD HH:mm')
    let action = ''
    let actionAfter = ''
    let geoType = ''
    switch (message.message.type) {
      case MsgConstant.MSG_COWORK_ADD:
        action = getLanguage(global.language).Friends.SYS_MSG_GEO_ADDED
        actionAfter = getLanguage(global.language).Friends.SYS_MSG_GEO_ADDED2
        break
      case MsgConstant.MSG_COWORK_DELETE:
        action = getLanguage(global.language).Friends.SYS_MSG_GEO_DELETED
        actionAfter = getLanguage(global.language).Friends.SYS_MSG_GEO_DELETED2
        break
      case MsgConstant.MSG_COWORK_UPDATE:
        action = getLanguage(global.language).Friends.SYS_MSG_GEO_UPDATED
        actionAfter = getLanguage(global.language).Friends.SYS_MSG_GEO_UPDATED2
        break
      case MsgConstant.MSG_COWORK_SERVICE_UPDATE:
        action = getLanguage(global.language).Friends.SYS_MSG_GEO_UPDATED + ' ' + getLanguage(global.language).Profile.SERVICE
        actionAfter = getLanguage(global.language).Friends.SYS_MSG_GEO_UPDATED2
        geoType = message.message.datasetName
        break
      case MsgConstant.MSG_COWORK_SERVICE_PUBLISH:
        action = getLanguage(global.language).Cowork.PUBLISH + ' ' + getLanguage(global.language).Profile.SERVICE
        actionAfter = getLanguage(global.language).Friends.SYS_MSG_GEO_UPDATED2
        geoType = message.message.datasetName
        break
    }
    if (!geoType) {
      switch (message.message.geoType) {
        case GeometryType.GEOPOINT:
          geoType = getLanguage(global.language).Profile.DATASET_TYPE_POINT
          break
        case GeometryType.GEOLINE:
          geoType = getLanguage(global.language).Profile.DATASET_TYPE_LINE
          break
        case GeometryType.GEOREGION:
          geoType = getLanguage(global.language).Profile.DATASET_TYPE_REGION
          break
        case GeometryType.GEOTEXT:
          geoType = getLanguage(global.language).Profile.DATASET_TYPE_TEXT
          break
        case GeometryType.GEOGRAPHICOBJECT:
          geoType = getLanguage(global.language).Map_Main_Menu.PLOTTING
      }
    }
    if (!geoType && message.message.themeType) {
      geoType = getLanguage(global.language).Map_Main_Menu.THEME
    }
    if (!geoType && message.message.isHeatmap) {
      geoType = getLanguage(global.language).Map_Main_Menu.THEME_HEATMAP
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
        onPress={this._onPress}
      >
        {
          // 忽略之后没有选择框
          message.status === 2
            ? <View style={{ height: scaleSize(50), width: scaleSize(50) }} />
            : (
              <Image
                source={
                  this.props.selected
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
}

