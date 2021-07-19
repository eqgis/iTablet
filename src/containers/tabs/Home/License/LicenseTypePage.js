import React, { Component } from 'react'
import { View, TouchableOpacity, Image, Text, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { setLicenseInfo } from '../../../../redux/models/license'
import Container from '../../../../components/Container'
import { color } from '../../../../styles'
import { UserType } from '../../../../constants'
import { scaleSize } from '../../../../utils'
import { getLanguage } from '../../../../language/index'
import NavigationService from '../../../NavigationService'
import PropTypes from 'prop-types'

const LicenseType = {
  local: 0,
  clould: 1,
  privateClould: 2,
  trial: 3,
  education: 4, //教育许可
}

class LicenseTypePage extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    licenseInfo: PropTypes.object,
    currentUser: PropTypes.object,
    setLicenseInfo: PropTypes.func,
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

  joinEducationLicense = () => {
    NavigationService.navigate('LicenseJoinEducation')
  }

  getType = () => {
    
    let data = [
      {
        title: getLanguage(GLOBAL.language).Profile.LICENSE_OFFLINE,
        type: LicenseType.local,
        onPress: this.joinLicense,
      },
    ]
    if (UserType.isOnlineUser(this.props.currentUser)) {
      data.push(
        {
          title: getLanguage(GLOBAL.language).Profile.LICENSE_CLOUD,
          type: LicenseType.clould,
          onPress: this.joinCloud,
        },
        {
          title: getLanguage(GLOBAL.language).Profile.LICENSE_PRIVATE_CLOUD,
          type: LicenseType.privateClould,
          onPress: this.joinPrivateCloud,
        },
        {
          title: getLanguage(GLOBAL.language).Profile.LICENSE_EDUCATION,
          type: LicenseType.education,
          onPress: this.joinEducationLicense,
        },
        {
          title: getLanguage(GLOBAL.language).Profile.LICENSE_TRIAL,
          type: LicenseType.trial,
        },
      )
    }
    // if (Platform.OS === 'ios') {
    //   data.splice(3, 1)
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
                  ? getLanguage(GLOBAL.language).Profile.LICENSE_IN_TRIAL
                  : getLanguage(GLOBAL.language).Profile.LICENSE_TRIAL_END}
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
          title: getLanguage(GLOBAL.language).Profile.LICENSE_TYPE,
          navigation: this.props.navigation,
        }}
      >
        <FlatList
          style={{
            flex: 1,
            backgroundColor: color.background,
          }}
          contentContainerStyle={{ backgroundColor: color.content_white }}
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
  currentUser: state.user.toJS().currentUser,
})

const mapDispatchToProps = {
  setLicenseInfo,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LicenseTypePage)
