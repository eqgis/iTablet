import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  AsyncStorage,
  FlatList,
  ScrollView,
} from 'react-native'
import { connect } from 'react-redux'
import {
  setLicenseInfo,
  setCloudLicenseUser,
} from '../../../../../redux/models/license'
import constants from '../../../../../../src/containers/workspace/constants'
import { Container, Button } from '../../../../../components'
import { color } from '../../../../../styles'
import { SMap } from 'imobile_for_reactnative'
import ModuleInfo from '../component/ModuleInfo'
import { scaleSize, Toast } from '../../../../../utils'
import styles from '../styles'
import { getPublicAssets } from '../../../../../assets'
import { getLanguage } from '../../../../../language'

class LicenseJoinCloud extends Component {
  props: {
    navigation: Object,
    licenseInfo: Object,
    setLicenseInfo: () => {},
    setCloudLicenseUser: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    let licenseInfo = (params && params.licenseInfo) || {}
    this.state = {
      licenses: licenseInfo.licenses || [],
      currentLicense: licenseInfo.licenses
        ? licenseInfo.licenses[0]
          ? licenseInfo.licenses[0]
          : {}
        : {},
      showDetail: false,
    }
    this.licenseCount = this.state.licenses.length
    this.hasTrial = licenseInfo.hasTrial
  }

  _checkCloudLicense = cb => {
    let licenseInfo = this.props.licenseInfo
    if (
      licenseInfo &&
      licenseInfo.isLicenseValid &&
      licenseInfo.licenseType === 1
    ) {
      GLOBAL.SimpleDialog.set({
        text: getLanguage(global.language).Profile.LICENSE_EXIT_CLOUD_ACTIVATE,
        confirmAction: async () => {
          let result = await global.recycleCloudLicense()
          if (result !== false) {
            cb()
          }
        },
      })
      GLOBAL.SimpleDialog.setVisible(true)
    } else {
      cb()
    }
  }

  _checkCloudLicense4Logout = () => {
    let licenseInfo = this.props.licenseInfo
    if (
      licenseInfo &&
      licenseInfo.isLicenseValid &&
      licenseInfo.licenseType === 1
    ) {
      GLOBAL.SimpleDialog.set({
        text: getLanguage(global.language).Profile.LICENSE_EXIT_CLOUD_LOGOUT,
        confirmAction: async () => {
          let result = await global.recycleCloudLicense()
          if (result !== false) {
            this.logout(true)
          }
        },
      })
      GLOBAL.SimpleDialog.setVisible(true)
    } else {
      this.logout(true)
    }
  }

  _checkPrivateCloudLicense = () => {
    let licenseInfo = this.props.licenseInfo
    if (
      licenseInfo &&
      licenseInfo.isLicenseValid &&
      licenseInfo.licenseType === 2
    ) {
      SMap.closePrivateCloudLicense()
    }
  }

  activate = async (confirm = false) => {
    try {
      if (!confirm) {
        this._checkCloudLicense(() => {
          this.activate(true)
        })
        return
      }
      this._checkPrivateCloudLicense()
      let licenseId = this.state.currentLicense.id
      if (licenseId) {
        this.container &&
          this.container.setLoading(
            true,
            getLanguage(global.language).Profile.LICENSE_ACTIVATING,
          )
        let returnId = await SMap.applyCloudLicense(licenseId)
        if (!returnId) {
          Toast.show(
            getLanguage(global.language).Profile.LICENSE_ACTIVATION_FAIL,
          )
        } else {
          AsyncStorage.setItem(constants.LICENSE_CLOUD_ID, licenseId)
          AsyncStorage.setItem(constants.LICENSE_CLOUD_RETURN_ID, returnId)
          Toast.show(
            getLanguage(global.language).Profile.LICENSE_ACTIVATION_SUCCESS,
          )
          let info = await SMap.getEnvironmentStatus()
          this.props.setLicenseInfo(info)
          this.props.navigation.pop(2)
        }
        this.container && this.container.setLoading(false)
      }
    } catch (e) {
      this.container && this.container.setLoading(false)
      Toast.show(getLanguage(global.language).Profile.LICENSE_ACTIVATION_FAIL)
    }
  }

  activateTrail = async (confirm = false) => {
    try {
      if (!confirm) {
        this._checkCloudLicense(() => {
          this.activateTrail(true)
        })
        return
      }
      this._checkPrivateCloudLicense()

      this.container &&
        this.container.setLoading(
          true,
          getLanguage(global.language).Profile.LICENSE_ACTIVATING,
        )
      let result = await SMap.applyCloudTrialLicense()
      if (!result) {
        Toast.show(getLanguage(global.language).Profile.LICENSE_ACTIVATION_FAIL)
      } else {
        AsyncStorage.setItem(constants.LICENSE_CLOUD_ID, '')
        AsyncStorage.setItem(constants.LICENSE_CLOUD_RETURN_ID, '')
        Toast.show(
          getLanguage(global.language).Profile.LICENSE_ACTIVATION_SUCCESS,
        )
        let info = await SMap.getEnvironmentStatus()
        this.props.setLicenseInfo(info)
        this.props.navigation.pop(2)
      }
      this.container && this.container.setLoading(false)
    } catch (e) {
      this.container && this.container.setLoading(false)
      Toast.show(getLanguage(global.language).Profile.LICENSE_ACTIVATION_FAIL)
    }
  }

  logout = async (confirm = false) => {
    try {
      if (!confirm) {
        this._checkCloudLicense4Logout()
        return
      }
      this.container &&
        this.container.setLoading(
          true,
          getLanguage(global.language).Profile.LICENSE_EXIT + '...',
        )
      let result = await SMap.logoutCloudLicense()
      this.container && this.container.setLoading(false)
      if (result) {
        this.props.setCloudLicenseUser({})
        this.props.navigation.pop(2)
      } else {
        Toast.show(getLanguage(global.language).Profile.LICENSE_EXIT_FAILED)
      }
    } catch (error) {
      Toast.show(getLanguage(global.language).Profile.LICENSE_EXIT_FAILED)
      this.container && this.container.setLoading(false)
    }
  }

  renderLicense = () => {
    let licenses = this.state.licenses
    if (!licenses.length || licenses.length === 0) {
      return (
        <View style={{ marginTop: scaleSize(50), alignItems: 'center' }}>
          <Text style={{ fontSize: scaleSize(26), color: color.gray2 }}>
            {getLanguage(global.language).Profile.LICENSE_QUERY_NONE}
          </Text>
        </View>
      )
    }
    return (
      <View>
        <View
          style={{
            height: scaleSize(80),
            justifyContent: 'center',
            marginHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: scaleSize(26),
              color: color.gray2,
            }}
          >
            {getLanguage(global.language).Profile.LICENSE_SELECT_LICENSE}
          </Text>
        </View>
        <View style={{ marginHorizontal: 20 }}>
          <FlatList
            data={this.state.licenses}
            renderItem={this.renderLicenseItem}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.state.currentLicense.id}
          />
        </View>
      </View>
    )
  }

  renderLicenseItem = ({ item, index }) => {
    return (
      <View>
        <TouchableOpacity
          style={[
            {
              height: scaleSize(80),
              backgroundColor: 'white',
              justifyContent: 'center',
            },
            this.state.currentLicense.id === item.id && {
              backgroundColor: '#4680df',
            },
          ]}
          onPress={() => {
            this.setState({ currentLicense: item })
          }}
        >
          <Text
            style={[
              {
                marginLeft: scaleSize(20),
              },
              this.state.currentLicense.id === item.id && {
                color: 'white',
              },
            ]}
          >
            {getLanguage(global.language).Profile.LICENSE + (index + 1)}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderLicenseDetail = () => {
    return (
      <View
        style={{
          paddingHorizontal: 20,
        }}
      >
        {this.renderShowDetail()}
        {this.state.showDetail && this.renderInfo()}
        {this.state.showDetail && this.renderModules()}
      </View>
    )
  }

  renderShowDetail = () => {
    let icon = this.state.showDetail
      ? getPublicAssets().common.icon_check_disable
      : getPublicAssets().common.icon_uncheck_disable

    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          height: scaleSize(60),
          alignItems: 'center',
          marginVertical: 15,
        }}
        onPress={() => {
          this.setState({ showDetail: !this.state.showDetail })
        }}
      >
        <Image
          resizeMode={'contain'}
          style={{
            height: scaleSize(40),
            width: scaleSize(40),
          }}
          source={icon}
        />
        <Text style={{ color: color.gray2 }}>
          {getLanguage(global.language).Profile.LICENSE_SHOW_DETAIL}
        </Text>
      </TouchableOpacity>
    )
  }

  renderInfo = () => {
    let remainText = ''
    if (this.state.currentLicense.remainDays !== undefined) {
      let remainDays = this.state.currentLicense.remainDays
      remainText = remainDays + getLanguage(global.language).Profile.LICENSE_DAY
      if (remainDays === 73000) {
        remainText = getLanguage(global.language).Profile.LICENSE_PERMANENT
      }
    }
    return (
      <View
        style={{
          height: scaleSize(80),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'white',
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            fontSize: scaleSize(20),
            marginLeft: 20,
          }}
        >
          {getLanguage(global.language).Profile.LICENSE_REAMIN_DAYS}
        </Text>
        <Text
          style={{
            fontSize: scaleSize(20),
            marginRight: 15,
            color: color.gray2,
          }}
        >
          {remainText}
        </Text>
      </View>
    )
  }

  renderModules = () => {
    return <ModuleInfo selectedModule={this.state.currentLicense.moduleNames} />
  }

  renderActive = () => {
    let title
    let enable
    if (this.licenseCount === 0 && this.hasTrial) {
      title = getLanguage(global.language).Profile.LICENSE_TRIAL_APPLY
      enable = true
    } else {
      title = getLanguage(global.language).Profile.LICENSE_ACTIVATE
      enable = this.state.currentLicense.id !== undefined
    }
    return (
      <Button
        title={title}
        type={enable ? 'BLUE' : 'GRAY'}
        style={styles.activeButton}
        titleStyle={{ fontSize: scaleSize(24) }}
        onPress={() => {
          if (this.licenseCount === 0 && this.hasTrial) {
            this.activateTrail(false)
          } else {
            this.activate(false)
          }
        }}
      />
    )
  }

  renderLogout = () => {
    return (
      <View
        style={{
          marginTop: -scaleSize(20),
          marginBottom: scaleSize(20),
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'center',
        }}
      >
        <TouchableOpacity onPress={() => this.logout(false)}>
          <Text
            style={{
              fontSize: scaleSize(24),
              color: '#4680DF',
            }}
          >
            {getLanguage(global.language).Profile.LOG_OUT}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={{ backgroundColor: color.background }}
        headerProps={{
          title: getLanguage(global.language).Profile.LICENSE_SELECT_LICENSE,
          navigation: this.props.navigation,
        }}
      >
        <ScrollView>
          {this.renderLicense()}
          {this.renderLicenseDetail()}
          {this.renderActive()}
          {this.renderLogout()}
        </ScrollView>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  licenseInfo: state.license.toJS().licenseInfo,
  cloudLicenseUser: state.license.toJS().cloudLicenseUser,
})

const mapDispatchToProps = {
  setLicenseInfo,
  setCloudLicenseUser,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LicenseJoinCloud)
