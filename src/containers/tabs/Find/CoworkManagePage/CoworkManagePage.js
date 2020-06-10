import React from 'react'
import Container from '../../../../components/Container'
import { View, FlatList, TouchableOpacity, Text } from 'react-native'
import CoworkInviteView from '../../Friend/Cowork/CoworkInviteView'
import { scaleSize } from '../../../../utils'
import NavigationService from '../../../NavigationService'
import { getLanguage } from '../../../../language'
import { SMap } from 'imobile_for_reactnative'
import CoworkInfo from '../../Friend/Cowork/CoworkInfo'
import { UserType } from '../../../../constants'

export default class CoworkManagePage extends React.Component {
  props: {
    navigation: Object,
    user: Object,
    invites: Array,
    appConfig: Object,
    latestMap: Object,
    setCurrentMapModule: () => {},
    deleteInvite: () => {},
  }

  constructor(props) {
    super(props)
  }

  createCowork = async (targetId, module, index, map) => {
    try {
      GLOBAL.Loading.setLoading(
        true,
        getLanguage(global.language).Prompt.PREPARING,
      )
      let licenseStatus = await SMap.getEnvironmentStatus()
      global.isLicenseValid = licenseStatus.isLicenseValid
      if (!global.isLicenseValid) {
        global.SimpleDialog.set({
          text: getLanguage(global.language).Prompt.APPLY_LICENSE_FIRST,
        })
        global.SimpleDialog.setVisible(true)
        return
      }
      global.getFriend().setCurMod(module)
      this.props.setCurrentMapModule(index).then(() => {
        module.action(this.props.user.currentUser, map)
      })
      global.getFriend().curChat &&
        global.getFriend().curChat.setCoworkMode(true)
      global.coworkMode = true
      CoworkInfo.setTalkId(targetId)
      setTimeout(() => GLOBAL.Loading.setLoading(false), 300)
    } catch (error) {
      GLOBAL.Loading.setLoading(false)
    }
  }

  deleteInvite = data => {
    global.SimpleDialog.set({
      text: getLanguage(global.language).Friends.DELETE_COWORK_ALERT,
      confirmAction: () => this.props.deleteInvite(data),
    })
    global.SimpleDialog.setVisible(true)
  }

  renderRight = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (UserType.isOnlineUser(this.props.user.currentUser)) {
            NavigationService.navigate('SelectFriend', {
              showType: 'all',
              callBack: targetId => {
                NavigationService.navigate('SelectModule', {
                  callBack: (module, index) => {
                    NavigationService.navigate('MyMap', {
                      title: getLanguage(global.language).Friends.SELECT_MAP,
                      getItemCallback: ({ item }) => {
                        let mapName = item.name.substring(
                          0,
                          item.name.lastIndexOf('.'),
                        )
                        let map = {
                          name: mapName,
                          path: item.path,
                        }
                        NavigationService.pop(3)
                        this.createCowork(targetId, module, index, map)
                      },
                    })
                  },
                })
              },
            })
          } else {
            NavigationService.navigate('Login', {
              show: ['Online'],
            })
          }
        }}
      >
        <Text style={{ fontSize: scaleSize(24), color: 'white' }}>
          {getLanguage(global.language).Prompt.CREATE}
        </Text>
      </TouchableOpacity>
    )
  }

  renderItem = ({ item }) => {
    return (
      <CoworkInviteView
        style={{
          alignSelf: 'center',
          width: '90%',
          marginBottom: scaleSize(20),
        }}
        data={item}
        onLongPress={data => this.deleteInvite(data)}
      />
    )
  }

  renderContent = () => {
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      return (
        <FlatList
          data={this.props.invites[this.props.user.currentUser.userId]}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )
    } else {
      return (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: 'grey', marginTop: scaleSize(24) }}>
            {getLanguage(global.language).Find.COWORK_LOGIN}
          </Text>
        </View>
      )
    }
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        showFullInMap={true}
        hideInBackground={false}
        headerProps={{
          title: getLanguage(global.language).Find.ONLINE_COWORK,
          navigation: this.props.navigation,
          headerRight: this.renderRight(),
        }}
      >
        {this.renderContent()}
      </Container>
    )
  }
}
