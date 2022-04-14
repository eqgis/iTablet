import React, { Component } from 'react'
import { View, StyleSheet, Image, Text } from 'react-native'
import { connect } from 'react-redux'
import { setLicenseInfo } from '../../../../redux/models/license'
import Container from '../../../../components/Container'
import { color } from '../../../../styles'
import { getLanguage } from '../../../../language/index'
import { SMap } from 'imobile_for_reactnative'
import { scaleSize, Toast } from '../../../../utils'
import NavigationService from '../../../NavigationService'
import constants from '../../../../../src/containers/workspace/constants'
import { Dialog } from '../../../../components'
import LicenseInfo from './component/LicenseInfo'
import AsyncStorage from '@react-native-community/async-storage'

const LicenseType = {
  local: 0,
  cloud: 1,
  privateCloud: 2,
  trial: 3,
  education: 4, //教育许可
}

class LicensePage extends Component {
  props: {
    navigation: Object,
    licenseInfo: Object,
    cloudLicenseUser: Object,
    setLicenseInfo: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.route
    this.user = params && params.user
    global.recycleCloudLicense = this._recycleCloudLicense
  }

  componentWillUnmount() {
    global.recycleCloudLicense = null
  }

  getLicenseInfo = async () => {
    let info
    try {
      info = await SMap.getEnvironmentStatus()
    } catch (error) {
      info = {}
    }
    this.props.setLicenseInfo(info)
  }

  selectLicenseType = () => {
    NavigationService.navigate('LicenseTypePage')
  }

  recycleLicense = async () => {
    let licenseType = this.props.licenseInfo.licenseType
    if (licenseType === LicenseType.local) {
      this._recycleLocalLicense()
    } else if (licenseType === LicenseType.cloud) {
      this._recycleCloudLicense()
    }
  }

  _recycleLocalLicense = async () => {
    try {
      global.Loading.setLoading(
        true,
        getLanguage(global.language).Prompt.LOADING,
      )
      let serialNumber = await SMap.initSerialNumber('')
      if (serialNumber !== '') {
        await SMap.recycleLicense()
        this.getLicenseInfo()
      } else {
        await SMap.clearLocalLicense()
        this.getLicenseInfo()
      }
      global.Loading.setLoading(false)
    } catch (error) {
      Toast.show(global.language === 'CN' ? '归还失败' : 'return failed')
      global.Loading.setLoading(false)
      this.getLicenseInfo()
    }
  }

  _recycleCloudLicense = async () => {
    try {
      let userInfo = this.props.cloudLicenseUser
      if (userInfo.isEmail === undefined) {
        Toast.show(getLanguage(global.language).Prompt.PLEASE_LOGIN)
        // NavigationService.navigate('LicenseJoinCloud', {
        //   callback: () => {
        //     NavigationService.goBack()
        //     this._recycleCloudLicense()
        //   },
        // })
        
        if (UserType.isIPortalUser(this.props.currentUser) || UserType.isOnlineUser(this.props.currentUser)) {
          this.props.navigation.navigate('LicenseJoinCloud', {
            callback: () => {
              NavigationService.goBack()
              this._recycleCloudLicense()
            },
          })
        } else {
          NavigationService.navigate('LoginCloud')
        }
        return -1
      }
      global.Loading.setLoading(
        true,
        getLanguage(global.language).Prompt.LOADING,
      )
      let licenseId = await AsyncStorage.getItem(constants.LICENSE_CLOUD_ID)
      let returnId = await AsyncStorage.getItem(
        constants.LICENSE_CLOUD_RETURN_ID,
      )
      licenseId = licenseId || ''
      returnId = returnId || ''
      if (licenseId !== '' && returnId !== '') {
        let username = userInfo.userName
        let password = userInfo.password
        await SMap.loginCloudLicense(username, password)
      }
      let days = await SMap.recycleCloudLicense(licenseId, returnId)
      if (days < 0) {
        Toast.show(global.language === 'CN' ? '归还失败' : 'return failed')
      } else {
        AsyncStorage.setItem(constants.LICENSE_CLOUD_ID, '')
        AsyncStorage.setItem(constants.LICENSE_CLOUD_RETURN_ID, '')
      }
      this.getLicenseInfo()
      global.Loading.setLoading(false)
      return days
    } catch (e) {
      this.getLicenseInfo()
      Toast.show(global.language === 'CN' ? '归还失败' : 'return failed')
      global.Loading.setLoading(false)
      return -1
    }
  }

  showRecycleDialog = () => {
    this.cleanDialog.setDialogVisible(true)
  }

  //申请试用许可
  applyTrialLicense = async () => {
    try {
      let result = await SMap.applyTrialLicense()
      if (result) {
        let info = await SMap.getEnvironmentStatus()
        this.props.setLicenseInfo(info)
        Toast.show(global.language === 'CN' ? '试用成功' : 'Successful trial')
      } else {
        Toast.show(
          global.language === 'CN'
            ? '您已经申请过试用许可,请接入正式许可'
            : 'You have applied for trial license, please access the formal license',
        )
      }
    } catch (error) {
      Toast.show(global.language === 'CN' ? '试用失败' : 'fail to get trial')
    }
  }

  renderLicenseDialogChildren = () => {
    return (
      <View style={styles.dialogHeaderView}>
        <Image
          source={require('../../../../assets/home/Frenchgrey/icon_prompt.png')}
          style={styles.dialogHeaderImg}
        />
        <Text style={styles.promptTitle}>
          {getLanguage(global.language).Profile.LICENSE_CLEAN_ALERT}
        </Text>
      </View>
    )
  }
  //清除正式许可时提醒许可数量
  renderDialog = () => {
    return (
      <Dialog
        ref={ref => (this.cleanDialog = ref)}
        type={'modal'}
        confirmBtnTitle={getLanguage(global.language).Prompt.CONFIRM}
        cancelBtnTitle={getLanguage(global.language).Prompt.CANCEL}
        confirmAction={() => {
          this.cleanDialog.setDialogVisible(false)
          this.recycleLicense()
        }}
        opacity={1}
        opacityStyle={styles.opacityView}
        style={[styles.dialogBackground, { height: global.language == 'FR' ? scaleSize(340) : scaleSize(300)}]}
      >
        {this.renderLicenseDialogChildren()}
      </Dialog>
    )
  }

  //所含模块
  containModule = () => {
    NavigationService.navigate('LicenseModule', {
      user: this.user,
      features: this.props.licenseInfo.features || [],
    })
  }

  renderLicenseInfo = () => {
    return (
      <LicenseInfo
        licenseInfo={this.props.licenseInfo}
        selectLicenseType={this.selectLicenseType}
        recycleLicense={this.showRecycleDialog}
        containModule={this.containModule}
        applyTrialLicense={this.applyTrialLicense}
      />
    )
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(global.language).Profile.SETTING_LICENSE,
          navigation: this.props.navigation,
        }}
      >
        {this.renderLicenseInfo()}
        {this.renderDialog()}
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  licenseInfo: state.license.toJS().licenseInfo,
  cloudLicenseUser: state.license.toJS().cloudLicenseUser,
  currentUser: state.user.toJS().currentUser,
})

const mapDispatchToProps = {
  setLicenseInfo,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LicensePage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //   flexDirection: 'column',
    backgroundColor: color.bgW,
  },

  item: {
    width: '100%',
    height: scaleSize(80),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.content_white,
  },
  title: {
    fontSize: scaleSize(24),
    marginLeft: 15,
  },
  subTitle: {
    fontSize: scaleSize(20),
    marginLeft: 15,
  },
  separateLine: {
    width: '100%',
    height: scaleSize(1),
    backgroundColor: color.item_separate_white,
  },
  dialogHeaderView: {
    paddingTop: scaleSize(30),
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  promptTitle: {
    fontSize: scaleSize(24),
    color: color.theme_white,
    marginTop: scaleSize(5),
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
    textAlign: 'center',
  },
  btnStyle: {
    height: scaleSize(100),
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  dialogBackground: {
    // height: scaleSize(300),
    backgroundColor: color.content_white,
  },
  dialogHeaderImg: {
    width: scaleSize(80),
    height: scaleSize(80),
    opacity: 1,
  },
  opacityView: {
    height: scaleSize(300),
    backgroundColor: color.content_white,
  },
})
