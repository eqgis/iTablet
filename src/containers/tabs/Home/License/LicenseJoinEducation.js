import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
} from 'react-native'
import { Container } from '../../../../components'
import { getLanguage } from '../../../../language'
import { Toast } from '../../../../utils'
import { SMap } from 'imobile_for_reactnative'
import styles from './styles'
import { connect } from 'react-redux'
import {
  setLicenseInfo,
  setEducationServer,
} from '../../../../redux/models/license'

class LicenseJoinEducation extends Component {
  props: {
    navigation: Object,
    licenseInfo: Object,
    educationServer: String,
    setEducationServer: () => {},
    setLicenseInfo: () => {},
  }

  constructor(props) {
    super(props)
    this.server = this.props.educationServer || ''
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

  _checkCloudLicense = () => {
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
          if (result > -1) {
            this.activate(true)
          }
        },
      })
      GLOBAL.SimpleDialog.setVisible(true)
    } else {
      this.activate(true)
    }
  }

  activate = async (confirm = false) => {
    try {
      if (this.server === '') {
        Toast.show(getLanguage(global.language).Profile.ENTER_SERVER_ADDRESS)
        return
      }
      if (this.server.indexOf('http') !== 0) {
        this.server = 'https://' + this.server
      }
      let bConnect = await SMap.checkConnectEduLicense(this.server)

      if (!bConnect) {
        Toast.show(
          getLanguage(global.language).Profile.LICENSE_EDUCATION_CONNECT_FAIL,
        )
        return
      }

      if (!confirm) {
        this._checkCloudLicense()
        return
      }
      this._checkPrivateCloudLicense()
      this.container &&
        this.container.setLoading(
          true,
          getLanguage(global.language).Profile.LICENSE_ACTIVATING,
        )
      let result = await SMap.applyEduLicense(this.server)
      this.container && this.container.setLoading(false)
      if (result) {
        Toast.show(
          getLanguage(global.language).Profile.LICENSE_ACTIVATION_SUCCESS,
        )

        await SMap.setEducationConnectCallback(async result => {
          if (!result) {
            Toast.show(
              global.language === 'CN'
                ? '教育许可的连接已断开!'
                : 'Lost connection with education license server!',
            )
            let info = await SMap.getEnvironmentStatus()
            this.props.setLicenseInfo(info)
          }
        })

        let info = await SMap.getEnvironmentStatus()
        this.props.setEducationServer(this.server)
        this.props.setLicenseInfo(info)
        this.props.navigation.pop(2)
      } else {
        Toast.show(getLanguage(global.language).Profile.LICENSE_ACTIVATION_FAIL)
      }
    } catch (e) {
      this.container && this.container.setLoading(false)
      Toast.show(getLanguage(global.language).Profile.LICENSE_ACTIVATION_FAIL)
    }
  }

  queryLicense = async () => {
    try {
      if (this.server === '') {
        Toast.show(getLanguage(global.language).Profile.ENTER_SERVER_ADDRESS)
        return
      }
      if (
        this.server.indexOf('ws://') !== 0 &&
        this.server.indexOf('http') !== 0
      ) {
        this.server = 'ws://' + this.server
      }
      this.container &&
        this.container.setLoading(
          true,
          getLanguage(global.language).Profile.LICENSE_ACTIVATING,
        )
      let result = await SMap.applyEduLicense(this.server)
      this.container && this.container.setLoading(false)
      if (result) {
        Toast.show(
          getLanguage(global.language).Profile.LICENSE_ACTIVATION_SUCCESS,
        )

        await SMap.setEducationConnectCallback(async result => {
          if (!result) {
            Toast.show(
              global.language === 'CN'
                ? '教育许可的连接已断开!'
                : 'Lost connection with education license server!',
            )
            let info = await SMap.getEnvironmentStatus()
            this.props.setLicenseInfo(info)
          }
        })

        let info = await SMap.getEnvironmentStatus()
        this.props.setLicenseInfo(info)
        this.props.navigation.pop(1)
      } else {
        Toast.show(getLanguage(global.language).Profile.LICENSE_ACTIVATION_FAIL)
      }
    } catch (e) {
      this.container && this.container.setLoading(false)
      Toast.show(getLanguage(global.language).Profile.LICENSE_ACTIVATION_FAIL)
    }
  }

  renderAddress = () => {
    return (
      <View style={styles.addressView}>
        <View style={styles.inputBackgroud}>
          <TextInput
            clearButtonMode={'while-editing'}
            keyboardType={'default'}
            placeholder={
              getLanguage(global.language).Profile.ENTER_SERVER_ADDRESS
            }
            placeholderTextColor={'#A7A7A7'}
            multiline={false}
            defaultValue={this.server || ''}
            style={styles.textInputStyle}
            onChangeText={text => {
              this.server = text
            }}
          />
        </View>
        <TouchableOpacity
          accessible={true}
          accessibilityLabel={'query'}
          style={styles.connectStyle}
          onPress={() => {
            Keyboard.dismiss()
            // this.queryLicense()
            this.activate()
          }}
        >
          <Text style={styles.titleText}>
            {getLanguage(global.language).Profile.LICENSE_ACTIVATE}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Profile.LICENSE_EDUCATION,
          navigation: this.props.navigation,
        }}
      >
        <KeyboardAvoidingView
          enabled={true}
          keyboardVerticalOffset={0}
          behavior={'padding'}
        >
          {this.renderAddress()}
        </KeyboardAvoidingView>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  licenseInfo: state.license.toJS().licenseInfo,
  educationServer: state.license.toJS().educationServer,
})

const mapDispatchToProps = {
  setLicenseInfo,
  setEducationServer,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LicenseJoinEducation)
