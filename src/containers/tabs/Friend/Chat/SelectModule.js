import React, { Component } from 'react'
import { ScrollView, FlatList } from 'react-native'
import { Container } from '../../../../components'
import TouchableItemView from '../TouchableItemView'
import { getLanguage } from '../../../../language/index'
import { connect } from 'react-redux'
import { SData, SMap } from 'imobile_for_reactnative'
import { setCurrentMapModule } from '../../../../redux/models/mapModules'
import NavigationService from '../../../NavigationService'

class SelectModule extends Component {
  props: {
    language: String,
    latestMap: Object,
    navigation: Object,
    mapModules: Object,
    setCurrentMapModule: () => {},
  }

  constructor(props) {
    super(props)
    this.callBack = this.props.route.params.callBack
  }

  onPress = (module, index) => {
    NavigationService.navigate('MyMap', {
      title: getLanguage(global.language).Friends.SELECT_MAP,
      getItemCallback: ({ item }) => {
        let mapName = item.name.substring(0, item.name.lastIndexOf('.'))
        let map = {
          name: mapName,
          path: item.path,
        }
        this.navigateToModule(module, index, map)
      },
    })
  }

  navigateToModule = async (module, index, map) => {
    let licenseStatus = await SData.getEnvironmentStatus()
    global.isLicenseValid = licenseStatus.isLicenseValid
    if (!global.isLicenseValid) {
      global.SimpleDialog.set({
        text: getLanguage(global.language).Prompt.APPLY_LICENSE_FIRST,
      })
      global.SimpleDialog.setVisible(true)
      return
    }
    let tmpCurrentUser = global.getFriend().props.user.currentUser
    global.getFriend().setCurMod(module)
    this.props.setCurrentMapModule(index).then(() => {
      module.action(tmpCurrentUser, map)
    })
    global.getFriend().curChat.setCoworkMode(true)
    global.coworkMode = true
  }

  render() {
    let data = this.props.mapModules.modules.map(item =>
      item.getChunk(this.props.language),
    )
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Friends.SELECT_MODULE,
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <ScrollView>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              if (
                item.title === getLanguage(global.language).Map_Module.MODULE_3D
              ) {
                return null
              }
              return (
                <TouchableItemView
                  image={item.moduleImage}
                  text={item.title}
                  onPress={() => {
                    if (this.callBack) {
                      this.callBack(item, index)
                    } else {
                      this.onPress(item, index)
                    }
                  }}
                />
              )
            }}
          />
        </ScrollView>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  latestMap: state.map.toJS().latestMap,
  mapModules: state.mapModules.toJS(),
})
const mapDispatchToProps = {
  setCurrentMapModule,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectModule)
