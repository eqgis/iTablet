import React, { Component } from 'react'
import { View, TouchableOpacity, Image, Text, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { setLicenseInfo } from '../../../../redux/models/license'
import Container from '../../../../components/Container'
import { color } from '../../../../styles'
import { scaleSize } from '../../../../utils'
import { getLanguage } from '../../../../language/index'
import NavigationService from '../../../NavigationService'

const LicenseType = {
  local: 0,
  clould: 1,
  privateClould: 2,
  trial: 3,
}

class LicenseTypePage extends Component {
  props: {
    navigation: Object,
    licenseInfo: Object,
    setLicenseInfo: () => {},
  }

  constructor(props) {
    super(props)
  }

  joinLicense = () => {
    NavigationService.navigate('LicenseJoin')
  }

  joinCloud = () => {
    NavigationService.navigate('LicenseJoinCloud')
  }

  joinPrivateCloud = () => {
    NavigationService.navigate('LicenseJoinPrivateCloud')
  }

  getType = () => {
    let data = [
      {
        title: getLanguage(global.language).Profile.LICENSE_OFFLINE,
        type: LicenseType.local,
        onPress: this.joinLicense,
      },
      {
        title: getLanguage(global.language).Profile.LICENSE_CLOUD,
        type: LicenseType.clould,
        onPress: this.joinCloud,
      },
      {
        title: getLanguage(global.language).Profile.LICENSE_PRIVATE_CLOUD,
        type: LicenseType.privateClould,
        onPress: this.joinPrivateCloud,
      },
      {
        title: getLanguage(global.language).Profile.LICENSE_TRIAL,
        type: LicenseType.trial,
      },
    ]
    // if (Platform.OS === 'ios') {
    //   data.splice(2, 1)
    // }
    return data
  }

  renderItem = ({ item }) => {
    return (
      <View style={{ width: '100%', backgroundColor: color.content_white }}>
        <TouchableOpacity
          style={{
            width: '100%',
            backgroundColor: color.content_white,
            flexDirection: 'row',
          }}
          onPress={item.onPress}
          disabled={!item.onPress}
        >
          <View
            style={{
              height: scaleSize(80),
              width: scaleSize(100),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {this.props.licenseInfo &&
              this.props.licenseInfo.licenseType === item.type && (
              <Image
                source={require('../../../../assets/public/settings_selected.png')}
                style={{ height: scaleSize(55), width: scaleSize(55) }}
              />
            )}
          </View>
          <View
            style={{
              flex: 1,
              height: scaleSize(80),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: scaleSize(20) }}>{item.title}</Text>
            {item.type !== LicenseType.trial ? (
              <View
                style={{
                  flexDirection: 'row',
                  marginRight: 15,
                  alignItems: 'center',
                }}
              >
                <Image
                  source={require('../../../../assets/Mine/mine_my_arrow.png')}
                  style={{ height: scaleSize(28), width: scaleSize(28) }}
                />
              </View>
            ) : (
              <Text
                style={{
                  fontSize: scaleSize(20),
                  marginRight: 15,
                  color: color.gray2,
                }}
              >
                {this.props.licenseInfo.licenseType === LicenseType.trial &&
                this.props.licenseInfo.isLicenseValid
                  ? getLanguage(global.language).Profile.LICENSE_IN_TRIAL
                  : getLanguage(global.language).Profile.LICENSE_TRIAL_END}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(global.language).Profile.LICENSE_TYPE,
          navigation: this.props.navigation,
        }}
        style={{
          backgroundColor: color.background,
        }}
      >
        <FlatList
          data={this.getType()}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  licenseInfo: state.license.toJS().licenseInfo,
})

const mapDispatchToProps = {
  setLicenseInfo,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LicenseTypePage)
