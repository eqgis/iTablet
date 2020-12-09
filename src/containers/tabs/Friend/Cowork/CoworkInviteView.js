import React from 'react'
import { Image, TouchableOpacity, Text, View } from 'react-native'
import { getLanguage } from '../../../../language'
import { scaleSize, px } from '../../../../utils/screen'
import { SMap } from 'imobile_for_reactnative'
import { connect } from 'react-redux'
import { setCurrentMapModule } from '../../../../redux/models/mapModules'
import moment from 'moment'
import DataHandler from '../../Mine/DataHandler'
import { Toast } from '../../../../utils'

class CoworkInviteView extends React.Component {
  props: {
    user: Object,
    data: Object,
    onPress: () => {},
    onLongPress: () => {},
    mapModules: Object,
    setCurrentMapModule: () => {},
    style: Object,
  }

  constructor(props) {
    super(props)
  }

  getMap = async () => {
    let map
    let mapName = `${this.props.data.mapName}.xml`
    let maps = await DataHandler.getLocalData(
      this.props.user.currentUser,
      'MAP',
    )
    for (let i = 0; i < maps.length; i++) {
      if (maps[i].name === mapName) {
        map = {}
        map.name = this.props.data.mapName
        map.path = maps[i].path
        break
      }
    }
    return map
  }

  onPress = async () => {
    if (GLOBAL.coworkMode) {
      return
    }
    let item = this.props.data
    let map = await this.getMap()
    if (!map) {
      Toast.show(getLanguage(GLOBAL.language).Friends.NO_SUCH_MAP)
      return
    }
    let licenseStatus = await SMap.getEnvironmentStatus()
    GLOBAL.isLicenseValid = licenseStatus.isLicenseValid
    if (!GLOBAL.isLicenseValid) {
      GLOBAL.SimpleDialog.set({
        text: getLanguage(GLOBAL.language).Prompt.APPLY_LICENSE_FIRST,
      })
      GLOBAL.SimpleDialog.setVisible(true)
      return
    }
    let friend = GLOBAL.getFriend()
    let result = await friend.joinCowork(item.coworkId, item.talkId)
    if (result) {
      let modules = this.props.mapModules.modules
      let module
      let i = 0
      for (i = 0; i < modules.length; i++) {
        if (modules[i].key === item.module) {
          module = modules[i].getChunk(GLOBAL.language)
          break
        }
      }
      GLOBAL.getFriend().setCurMod(module)
      this.props.setCurrentMapModule(i).then(() => {
        module.action(this.props.user.currentUser, map)
      })
      GLOBAL.getFriend().curChat &&
        GLOBAL.getFriend().curChat.setCoworkMode(true)
      GLOBAL.coworkMode = true
    }
  }

  onLongPress = () => {
    if (
      this.props.onLongPress &&
      typeof this.props.onLongPress === 'function'
    ) {
      this.props.onLongPress(this.props.data)
    }
  }

  /**
   * 获取协作模块的图像和标题
   */
  getModuleData = () => {
    let image, title
    let modules = this.props.mapModules.modules
    for (let i = 0; i < modules.length; i++) {
      if (modules[i].key === this.props.data.module) {
        let data = modules[i].getChunk(GLOBAL.language)
        image = data.moduleImage
        title = data.title
        break
      }
    }
    return { image, title }
  }

  renderExtra = () => {
    let time = moment(new Date(this.props.data.time)).format('YYYY/MM/DD HH:mm')
    let user = this.props.data.user.name
    if (this.props.data.userId === this.props.data.user.id) {
      user = getLanguage(GLOBAL.language).Friends.SELF
    }
    let group = this.props.data.user.groupName
    if (group) {
      // user = `${user}，${group}`
    }
    return (
      <View style={{ flexDirection: 'row', marginTop: scaleSize(20) }}>
        <Text style={{ flex: 1, fontSize: scaleSize(26), color: 'grey' }}>
          {user}
        </Text>
        <Text style={{ fontSize: scaleSize(26), color: 'grey' }}>{time}</Text>
      </View>
    )
  }

  render() {
    let data = this.getModuleData()
    return (
      <View
        style={[
          {
            backgroundColor: 'white',
          },
          this.props.style,
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            this.onPress()
          }}
          onLongPress={() => {
            this.onLongPress()
          }}
        >
          <Text
            style={{
              fontSize: scaleSize(26),
              color: 'grey',
              marginBottom: scaleSize(20),
            }}
          >
            {getLanguage(GLOBAL.language).Friends.COWORK_INVITATION}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Image
              source={data.image}
              style={{
                width: scaleSize(60),
                height: scaleSize(60),
                marginRight: scaleSize(20),
              }}
            />
            <Text style={{ fontSize: scaleSize(26) }}>{data.title}</Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: 'grey',
            height: px(1),
            marginVertical: scaleSize(15),
          }}
        />
        <Text style={{ fontSize: scaleSize(26) }}>
          {getLanguage(GLOBAL.language).Friends.MAP +
            ':  ' +
            this.props.data.mapName}
        </Text>
        {this.props.data.user && this.renderExtra()}
      </View>
    )
  }
}

const mapStateToProps = state => ({
  mapModules: state.mapModules.toJS(),
  user: state.user.toJS(),
})

const mapDispatchToProps = {
  setCurrentMapModule,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CoworkInviteView)
