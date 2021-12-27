import React, { Component } from 'react'
import { View, TouchableOpacity, Image, Text } from 'react-native'
import { getLanguage } from '../../../../../language/index'
import { color } from '../../../../../styles'
import { scaleSize } from '../../../../../utils'
import styles from '../styles'

const LicenseType = {
  none: -1,
  local: 0,
  cloud: 1,
  privateCloud: 2,
  trial: 3,
  education: 4, //教育许可
}

export default class LicenseInfo extends Component {
  props: {
    licenseInfo: Object,
    selectLicenseType: () => {},
    recycleLicense: () => {},
    containModule: () => {},
    applyTrialLicense: () => {},
  }

  constructor(props) {
    super(props)
  }

  renderTrial = () => {
    return (
      <TouchableOpacity
        style={{
          marginTop: scaleSize(20),
          width: '100%',
          height: scaleSize(80),
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: color.content_white,
        }}
        activeOpacity={0.8}
        onPress={this.props.applyTrialLicense}
      >
        <Text style={{ fontSize: scaleSize(24) }}>
          {getLanguage(GLOBAL.language).Profile.LICENSE_TRIAL_APPLY}
        </Text>
      </TouchableOpacity>
    )
  }

  renderModule = () => {
    return (
      <TouchableOpacity
        style={{
          marginTop: scaleSize(20),
          paddingLeft: 30,
          paddingRight: 15,
          width: '100%',
          height: scaleSize(80),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: color.content_white,
        }}
        activeOpacity={0.8}
        onPress={this.props.containModule}
      >
        <Text style={{ fontSize: scaleSize(24) }}>
          {getLanguage(GLOBAL.language).Profile.LICENSE_CONTAIN_MODULE}
        </Text>
        <Image
          source={require('../../../../../assets/Mine/mine_my_arrow.png')}
          style={{ height: scaleSize(28), width: scaleSize(28) }}
        />
      </TouchableOpacity>
    )
  }

  renderRecycle = () => {
    return (
      <TouchableOpacity
        style={{
          marginTop: scaleSize(20),
          width: '100%',
          height: scaleSize(80),
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: color.content_white,
        }}
        activeOpacity={0.8}
        onPress={this.props.recycleLicense}
      >
        <Text style={{ fontSize: scaleSize(24), color: color.red }}>
          {getLanguage(GLOBAL.language).Profile.LICENSE_OFFICIAL_RETURN}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    let licenseInfo = this.props.licenseInfo
    let licenseType
    let licenseTypeTitle
    let daysStr
    if (!licenseInfo) {
      licenseType = LicenseType.none
      daysStr = ''
    } else {
      licenseType = licenseInfo.licenseType
      let days = 0
      let yearDays = 365
      if (licenseInfo.expireDate) {
        let timeStr = ''
        timeStr = licenseInfo.expireDate
        let tempTimeStr =
          timeStr.slice(0, 4) +
          '/' +
          timeStr.slice(4, 6) +
          '/' +
          timeStr.slice(6) +
          ' 00:00'
        let date1 = new Date()
        let date2 = new Date(tempTimeStr)
        days = Math.ceil(
          (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24),
        ) + 1
        if (days < 0) {
          days = 0
        }
      }
      if (days >= yearDays * 20) {
        daysStr = getLanguage(GLOBAL.language).Profile.LICENSE_LONG_EFFECTIVE
      } else if (days > yearDays) {
        daysStr =
          getLanguage(GLOBAL.language).Profile.LICENSE_SURPLUS +
          days / yearDays +
          getLanguage(GLOBAL.language).Profile.LICENSE_YEAR +
          (days % yearDays) +
          getLanguage(GLOBAL.language).Profile.LICENSE_DAY
      } else {
        daysStr =
          getLanguage(GLOBAL.language).Profile.LICENSE_SURPLUS +
          days +
          getLanguage(GLOBAL.language).Profile.LICENSE_DAY
      }
    }

    if (licenseType === LicenseType.trial) {
      licenseTypeTitle = getLanguage(GLOBAL.language).Profile.LICENSE_TRIAL
    } else if (licenseType === LicenseType.local) {
      licenseTypeTitle = getLanguage(GLOBAL.language).Profile.LICENSE_OFFLINE
    } else if (licenseType === LicenseType.cloud) {
      licenseTypeTitle = getLanguage(GLOBAL.language).Profile.LICENSE_CLOUD
    } else if (licenseType === LicenseType.privateCloud) {
      licenseTypeTitle = getLanguage(GLOBAL.language).Profile
        .LICENSE_PRIVATE_CLOUD
    } else if (licenseType === LicenseType.education) {
      licenseTypeTitle = getLanguage(GLOBAL.language).Profile.LICENSE_EDUCATION
    } else if (licenseType === LicenseType.none) {
      licenseTypeTitle = getLanguage(GLOBAL.language).Profile.LICENSE_NONE
    }

    return (
      <View style={{ flex: 1, backgroundColor: color.background }}>
        <View style={{ backgroundColor: color.content_white }}>
          <View style={styles.item}>
            <Text style={styles.title}>
              {getLanguage(GLOBAL.language).Profile.LICENSE_CURRENT}
            </Text>
          </View>
          <InfoItem
            text={getLanguage(GLOBAL.language).Profile.LICENSE_TYPE}
            info={licenseTypeTitle}
            rightImage={require('../../../../../assets/Mine/mine_my_arrow.png')}
            action={this.props.selectLicenseType}
          />
          <InfoItem
            text={getLanguage(GLOBAL.language).Profile.LICENSE_STATE}
            info={daysStr}
          />
          <InfoItem
            text={getLanguage(GLOBAL.language).Profile.LICENSE_USER_NAME}
            info={licenseInfo ? licenseInfo.user : ''}
          />
        </View>

        {licenseType === LicenseType.trial && this.renderTrial()}
        {licenseType !== LicenseType.trial &&
          licenseType !== LicenseType.none &&
          this.renderModule()}
        {(licenseType === LicenseType.local ||
          licenseType === LicenseType.cloud) &&
          this.renderRecycle()}
      </View>
    )
  }
}

class InfoItem extends Component {
  props: {
    text: String,
    info: String,
    rightImage: Object,
    action: () => {},
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={{ width: '100%', backgroundColor: color.content_white }}>
        <TouchableOpacity
          style={{
            width: '100%',
            height: scaleSize(80),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          onPress={this.props.action}
          disabled={!this.props.action}
        >
          <Text style={{ fontSize: scaleSize(20), marginLeft: 30 }}>
            {this.props.text}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginRight: 15,
              alignItems: 'center',
            }}
          >
            <Text
              style={[
                {
                  fontSize: scaleSize(20),
                  marginRight: 15,
                  color: color.gray2,
                },
                this.props.rightImage && {
                  marginRight: 0,
                },
              ]}
            >
              {this.props.info}
            </Text>
            {this.props.rightImage && (
              <Image
                source={this.props.rightImage}
                style={{ height: scaleSize(28), width: scaleSize(28) }}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}
