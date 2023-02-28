import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  ScrollView,
} from 'react-native'
import { connect } from 'react-redux'
import { setLicenseInfo } from '../../../../../redux/models/license'
import { Container, Button } from '../../../../../components'
import { color } from '../../../../../styles'
import { LicenseModule, SData, SMap } from 'imobile_for_reactnative'
import { scaleSize, Toast } from '../../../../../utils'
import styles from '../styles'
import { getLanguage } from '../../../../../language'

class LicenseJoinPrivateCloud extends Component {
  props: {
    navigation: Object,
    licenseInfo: Object,
    setLicenseInfo: () => {},
  }

  constructor(props) {
    super(props)

    const { params } = this.props.route
    this.modules = (params && params.modules) || []
    this.state = {
      editionData: [],
      moduleData: [],
      selectEdition: {},
      selectModule: [],
      showMore: '',
      hasData: false,
    }
  }

  componentDidMount() {
    this.getData()
  }

  _checkEdutionLicense = () => {
    let licenseInfo = this.props.licenseInfo
    if (
      licenseInfo &&
      licenseInfo.isLicenseValid &&
      licenseInfo.licenseType === 4
    ) {
      SData.closeEduLicense()
    }
  }

  _checkCloudLicense = () => {
    let licenseInfo = this.props.licenseInfo
    if (
      licenseInfo &&
      licenseInfo.isLicenseValid &&
      licenseInfo.licenseType === 1
    ) {
      global.SimpleDialog.set({
        text: getLanguage(global.language).Profile.LICENSE_EXIT_CLOUD_ACTIVATE,
        confirmAction: async () => {
          let result = await global.recycleCloudLicense()
          if (result > -1) {
            this.activate(true)
          }
        },
      })
      global.SimpleDialog.setVisible(true)
    } else {
      this.activate(true)
    }
  }

  activate = async (confirm = false) => {
    try {
      if (this.state.selectEdition.id) {
        if (!confirm) {
          this._checkCloudLicense()
          return
        }
        let ids = []
        ids.push(this.state.selectEdition.id)
        ids = ids.concat(this.state.selectModule)
        this._checkEdutionLicense()
        this.container &&
          this.container.setLoading(
            true,
            getLanguage(global.language).Profile.LICENSE_ACTIVATING,
          )
        let result = await SData.applyPrivateCloudLicense(ids)
        if (result) {
          await SData.setPrivateCloudCloseCallback(async () => {
            Toast.show(
              global.language === 'CN'
                ? '与私有云服务器的连接已断开!'
                : 'Lost connection with private cloud license server!',
            )
            let info = await SData.getEnvironmentStatus()
            this.props.setLicenseInfo(info)
          })
          let info = await SData.getEnvironmentStatus()
          this.props.setLicenseInfo(info)
          this.props.navigation.pop(2)
        } else {
          Toast.show(
            getLanguage(global.language).Profile.LICENSE_ACTIVATION_FAIL,
          )
        }
        this.container && this.container.setLoading(false)
      }
    } catch (e) {
      this.container && this.container.setLoading(false)
      Toast.show(getLanguage(global.language).Profile.LICENSE_ACTIVATION_FAIL)
    }
  }

  isEdition = id => {
    if (
      id === LicenseModule.ITABLET_STANDARD ||
      id === LicenseModule.ITABLET_PROFESSIONAL ||
      id === LicenseModule.ITABLET_ADVANCED
    ) {
      return true
    } else {
      return false
    }
  }

  getTitle = id => {
    let title
    switch (id) {
      case LicenseModule.ITABLET_STANDARD:
        title = getLanguage(global.language).Profile.LICENSE_EDITION_STANDARD
        break
      case LicenseModule.ITABLET_PROFESSIONAL:
        title = getLanguage(global.language).Profile
          .LICENSE_EDITION_PROFESSIONAL
        break
      case LicenseModule.ITABLET_ADVANCED:
        title = getLanguage(global.language).Profile.LICENSE_EDITION_ADVANCED
        break
      case LicenseModule.ITABLET_ARMAP:
        title = getLanguage(global.language).Map_Module.MAP_AR
        break
      case LicenseModule.ITABLET_NAVIGATIONMAP:
        title = getLanguage(global.language).Map_Module.MAP_NAVIGATION
        break
      case LicenseModule.ITABLET_DATAANALYSIS:
        title = getLanguage(global.language).Map_Module.MAP_ANALYST
        break
      case LicenseModule.ITABLET_PLOTTING:
        title = getLanguage(global.language).Map_Module.MAP_PLOTTING
        break
    }
    return title
  }

  sortById = (a, b) => {
    return Number(a.id) - Number(b.id)
  }

  getData = () => {
    if (this.modules.length !== 0) {
      let modules = this.modules.clone()
      modules.sort(this.sortById)
      let Edition = []
      let Module = []
      for (let i = 0; i < modules.length; i++) {
        if (this.isEdition(modules[i].id)) {
          Edition.push(modules[i])
        } else {
          Module.push(modules[i])
        }
      }
      this.setState({
        editionData: Edition,
        moduleData: Module,
        hasData: true,
      })
    }
  }

  onModulePress = item => {
    if (this.isEdition(item.id)) {
      this.setState({
        selectEdition: item,
      })
    } else {
      let arr = this.state.selectModule.clone()
      let selected = false
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === item.id) {
          selected = true
          arr.splice(i, 1)
          break
        }
      }
      if (!selected) {
        arr.push(item.id)
      }
      this.setState({ selectModule: arr })
    }
  }

  renderItem = ({ item }) => {
    let selected
    if (this.isEdition(item.id)) {
      selected = this.state.selectEdition.id === item.id
    } else {
      selected = this.state.selectModule.includes(item.id)
    }
    return (
      <View>
        <TouchableOpacity
          style={[styles.moduleItem]}
          onPress={() => {
            this.onModulePress(item)
          }}
        >
          <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
            <View style={styles.moduleImageView}>
              {selected && (
                <Image
                  source={require('../../../../../assets/public/settings_selected.png')}
                  style={styles.moduleImage}
                />
              )}
            </View>
            <Text style={styles.moduleText}>{this.getTitle(item.id)}</Text>
          </View>
          <TouchableOpacity
            style={{
              width: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              if (this.state.showMore === item.id) {
                this.setState({
                  showMore: '',
                })
              } else {
                this.setState({
                  showMore: item.id,
                })
              }
            }}
          >
            <Image
              source={require('../../../../../assets/Mine/mine_my_arrow.png')}
              style={[
                {
                  height: scaleSize(30),
                  width: scaleSize(30),
                  opacity: 0.6,
                },
                this.state.showMore === item.id && {
                  transform: [{ rotate: '90deg' }],
                },
              ]}
            />
          </TouchableOpacity>
        </TouchableOpacity>
        {this.state.showMore === item.id && this.renderMore(item)}
      </View>
    )
  }

  renderMore = item => {
    let index = item.validity.indexOf(' ')
    let timeString = item.validity.substring(0, index)
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingLeft: scaleSize(100),
          paddingRight: 20,
        }}
      >
        <View>
          <Text style={styles.moduleText}>
            {getLanguage(global.language).Profile.LICENSE_TOTAL_NUM}
          </Text>
          <Text style={styles.moduleText}>{item.totalNum}</Text>
        </View>

        <View>
          <Text style={styles.moduleText}>
            {getLanguage(global.language).Profile.LICENSE_REMIAN_NUM}
          </Text>
          <Text style={styles.moduleText}>{item.remainNum}</Text>
        </View>

        <View>
          <Text style={styles.moduleText}>
            {getLanguage(global.language).Profile.LICENSE_DUE_DATE}
          </Text>
          <Text style={styles.moduleText}>{timeString}</Text>
        </View>
      </View>
    )
  }

  renderEdition = () => {
    return (
      <View style={{ marginTop: 10 }}>
        <View style={styles.moduleTitle}>
          <Text style={styles.moduleTitleText}>
            {getLanguage(global.language).Profile.LICENSE_SELECT_EDITION}
          </Text>
        </View>
        <FlatList
          data={this.state.editionData}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state.selectEdition}
          showMore={this.state.showMore}
        />
      </View>
    )
  }

  renderModule = () => {
    return (
      <View style={{ marginTop: 10 }}>
        <View style={styles.moduleTitle}>
          <Text style={styles.moduleTitleText}>
            {getLanguage(global.language).Profile.LICENSE_SELECT_MODULE}
          </Text>
        </View>
        <FlatList
          data={this.state.moduleData}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state.selectModule}
          showMore={this.state.showMore}
        />
      </View>
    )
  }

  renderActive = () => {
    return (
      <Button
        title={getLanguage(global.language).Profile.LICENSE_ACTIVATE}
        type={this.state.selectEdition.id ? 'BLUE' : 'GRAY'}
        style={styles.activeButton}
        titleStyle={{ fontSize: scaleSize(24) }}
        onPress={() => this.activate()}
      />
    )
  }

  renderNoData = () => {
    return (
      <View style={{ marginTop: scaleSize(50), alignSelf: 'center' }}>
        <Text style={{ fontSize: scaleSize(26), color: color.gray2 }}>
          {getLanguage(global.language).Profile.LICENSE_QUERY_NONE}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={{ backgroundColor: color.background }}
        headerProps={{
          title: getLanguage(global.language).Profile.LICENSE_SELECT_MODULE,
          navigation: this.props.navigation,
        }}
      >
        <ScrollView style={{ flex: 1, backgroundColor: color.bgW }}>
          {!this.state.hasData && this.renderNoData()}
          {this.state.hasData && this.renderEdition()}
          {this.state.hasData && this.renderModule()}
          {this.renderActive()}
        </ScrollView>
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
)(LicenseJoinPrivateCloud)
