import React, { Component } from 'react'
import { View, TouchableOpacity, Image, Text } from 'react-native'
import { getLanguage } from '../../../../../language/index'
import { color } from '../../../../../styles'
import { scaleSize } from '../../../../../utils'
import styles from '../styles'
import { SMap } from 'imobile_for_reactnative'

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
    licenseInfo: SMap.LicenseInfo,
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
          {getLanguage(global.language).Profile.LICENSE_TRIAL_APPLY}
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
          {getLanguage(global.language).Profile.LICENSE_CONTAIN_MODULE}
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
          {getLanguage(global.language).Profile.LICENSE_OFFICIAL_RETURN}
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
        const expireDate = licenseInfo.expireDate
        const year = expireDate.substring(0, 4)
        const month = expireDate.substring(4, 6)
        const date = expireDate.substring(6)
        const data = new Date(parseInt(year), parseInt(month) -1, parseInt(date))

        const current = new Date()
        days = (data  - current) / (1000 * 60 * 60 * 24)
      }
      if (days >= yearDays * 20) {
        daysStr = getLanguage(global.language).Profile.LICENSE_LONG_EFFECTIVE
      } else if (days > yearDays) {
        daysStr = `${getLanguage().LICENSE_SURPLUS} ${Math.floor(days / yearDays)} ${getLanguage().YEARS} ${Math.floor(days % yearDays)}  ${getLanguage().DAYS}`
      } else if(days > 1){
        daysStr = `${getLanguage().LICENSE_SURPLUS} ${Math.floor(days)} ${getLanguage().DAYS}`
      } else if(days > 0) {
        //一天内精确到小时
        const hours = days * 24
        if(Math.floor(hours) > 0) {
          daysStr = `${getLanguage().LICENSE_SURPLUS} ${Math.floor(hours)} ${getLanguage().HOURS}`
        } else {
          //一小时内精确到分钟
          const minutes = days * 24 * 60
          if(Math.floor(minutes) > 0) {
            daysStr = `${getLanguage().LICENSE_SURPLUS} s ${Math.floor(minutes)}  ${getLanguage().MINUTES}`
          } else {
            //一分钟内精确到秒
            const seconds = days * 24 * 60 * 60
            daysStr = `${getLanguage().LICENSE_SURPLUS} s ${Math.floor(seconds)}  ${getLanguage().SECONDS}`
          }
        }
      } else {
        daysStr = getLanguage().INVALID
      }
    }

    if (licenseType === LicenseType.trial) {
      licenseTypeTitle = getLanguage(global.language).Profile.LICENSE_TRIAL
    } else if (licenseType === LicenseType.local) {
      licenseTypeTitle = getLanguage(global.language).Profile.LICENSE_OFFLINE
    } else if (licenseType === LicenseType.cloud) {
      licenseTypeTitle = getLanguage(global.language).Profile.LICENSE_CLOUD
      if(licenseInfo.isCloudTrial) {
        licenseTypeTitle = getLanguage(global.language).Profile.LICENSE_TRIAL
      }
    } else if (licenseType === LicenseType.privateCloud) {
      licenseTypeTitle = getLanguage(global.language).Profile
        .LICENSE_PRIVATE_CLOUD
    } else if (licenseType === LicenseType.education) {
      licenseTypeTitle = getLanguage(global.language).Profile.LICENSE_EDUCATION
    } else if (licenseType === LicenseType.none) {
      licenseTypeTitle = getLanguage(global.language).Profile.LICENSE_NONE
    }

    return (
      <View style={{ flex: 1, backgroundColor: color.background }}>
        <View style={{ backgroundColor: color.content_white }}>
          <View style={styles.item}>
            <Text style={styles.title}>
              {getLanguage(global.language).Profile.LICENSE_CURRENT}
            </Text>
          </View>
          <InfoItem
            text={getLanguage(global.language).Profile.LICENSE_TYPE}
            info={licenseTypeTitle}
            rightImage={require('../../../../../assets/Mine/mine_my_arrow.png')}
            action={this.props.selectLicenseType}
          />
          <InfoItem
            text={getLanguage(global.language).Profile.LICENSE_STATE}
            info={daysStr}
          />
          <InfoItem
            text={getLanguage(global.language).Profile.LICENSE_USER_NAME}
            info={licenseInfo ? licenseInfo.user : ''}
          />
        </View>

        {/* {licenseType === LicenseType.trial && this.renderTrial()} */}
        {licenseType !== LicenseType.trial &&
          !licenseInfo.isCloudTrial &&
          licenseType !== LicenseType.none &&
          this.renderModule()}
        {(licenseType === LicenseType.local ||
          (licenseType === LicenseType.cloud && !licenseInfo.isCloudTrial)) &&
          this.renderRecycle()}
      </View>
    )
  }
}

class InfoItem extends Component {
  props: {
    text: string,
    info: string,
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
