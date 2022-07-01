import { LicenseModule } from 'imobile_for_reactnative'
import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  Platform,
  FlatList,
} from 'react-native'
import { getLanguage } from '../../../../../language/index'
import styles from '../styles'

export default class ModuleInfo extends Component {
  props: {
    availableModule: Array,
    selectedModule: Array,
    disableSelect: Boolean,
    onPress: () => {},
  }

  static defaultProps = {
    selectedModule: [],
    disableSelect: true,
  }

  constructor(props) {
    super(props)
  }

  getEditionData = () => {
    return [
      {
        title: getLanguage(global.language).Profile.LICENSE_EDITION_STANDARD,
        id: LicenseModule.ITABLET_STANDARD + '',
      },
      {
        title: getLanguage(global.language).Profile
          .LICENSE_EDITION_PROFESSIONAL,
        id: LicenseModule.ITABLET_PROFESSIONAL + '',
      },
      {
        title: getLanguage(global.language).Profile.LICENSE_EDITION_ADVANCED,
        id: LicenseModule.ITABLET_ADVANCED + '',
      },
    ]
  }

  getModuleData = () => {
    return [
      {
        title: getLanguage(global.language).Map_Module.MAP_AR_MODULE,
        id: LicenseModule.ITABLET_ARMAP + '',
      },
      {
        title: getLanguage(global.language).Map_Module.MAP_NAVIGATION,
        id: LicenseModule.ITABLET_NAVIGATIONMAP + '',
      },
      {
        title: getLanguage(global.language).Map_Module.MAP_ANALYST,
        id: LicenseModule.ITABLET_DATAANALYSIS + '',
      },
      {
        title: getLanguage(global.language).Map_Module.MAP_PLOTTING,
        id: LicenseModule.ITABLET_PLOTTING + '',
      },
    ]
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          styles.moduleItem,
          this.props.availableModule &&
            !this.props.availableModule.includes(item.id) && {
            backgroundColor: 'grey',
          },
        ]}
        disabled={
          this.props.disableSelect ||
          (this.props.availableModule &&
            !this.props.availableModule.includes(item.id))
        }
        onPress={() => {
          this.props.onPress(item)
        }}
      >
        <View style={styles.moduleImageView}>
          {this.props.selectedModule.includes(item.id) && (
            <Image
              source={require('../../../../../assets/public/settings_selected.png')}
              style={styles.moduleImage}
            />
          )}
        </View>
        <Text style={styles.moduleText}>{item.title}</Text>
      </TouchableOpacity>
    )
  }

  renderEdition = () => {
    return (
      <View>
        <View style={styles.moduleTitle}>
          <Text style={styles.moduleTitleText}>
            {getLanguage(global.language).Profile.LICENSE_EDITION}
          </Text>
        </View>
        <FlatList
          style={{ backgroundColor: 'white' }}
          data={this.getEditionData()}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }

  renderModule = () => {
    return (
      <View style={{ marginTop: 10 }}>
        <View style={styles.moduleTitle}>
          <Text style={styles.moduleTitleText}>
            {getLanguage(global.language).Profile.LICENSE_MODULE}
          </Text>
        </View>
        <FlatList
          style={{ backgroundColor: 'white' }}
          data={this.getModuleData()}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }

  render() {
    return (
      <View>
        {this.renderEdition()}
        {this.renderModule()}
      </View>
    )
  }
}
