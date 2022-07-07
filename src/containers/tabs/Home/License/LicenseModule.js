import React, { Component } from 'react'
import {
  ScrollView,
} from 'react-native'
import { Container } from '../../../../components'
import { color } from '../../../../styles'
import { getLanguage } from '../../../../language/index'
import { LicenseModule as SMLicenseModule } from 'imobile_for_reactnative'
import ModuleInfo from './component/ModuleInfo'


export default class LicenseModule extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.route
    this.features = params && params.features
  }


  getModuleID = () => {
    let modules = this.features.clone()
    let ids = []
    for (let i = 0; i < modules.length; i++) {
      ids.push(modules[i])
      if (modules[i] === SMLicenseModule.ITABLET_PROFESSIONAL) {
        ids = ids.concat([
          SMLicenseModule.ITABLET_ARMAP,
          SMLicenseModule.ITABLET_NAVIGATIONMAP,
        ])
      }
      if (modules[i] === SMLicenseModule.ITABLET_ADVANCED) {
        ids = ids.concat([
          SMLicenseModule.ITABLET_ARMAP,
          SMLicenseModule.ITABLET_NAVIGATIONMAP,
          // SMLicenseModule.ITABLET_DATAANALYSIS,
          // SMLicenseModule.ITABLET_PLOTTING,
        ])
      }
    }
    return ids
  }

  renderModules = () => {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: color.bgW }}>
        <ModuleInfo selectedModule={this.getModuleID()} />
      </ScrollView>
    )
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(global.language).Profile.LICENSE_CONTAIN_MODULE,
          //'所含模块',
          navigation: this.props.navigation,
        }}
        style={{
          backgroundColor: color.background,
        }}
      >
        {this.renderModules()}
      </Container>
    )
  }
}
