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
        id: Platform.OS === 'ios' ? '18001' : '19001',
      },
      {
        title: getLanguage(global.language).Profile
          .LICENSE_EDITION_PROFESSIONAL,
        id: Platform.OS === 'ios' ? '18002' : '19002',
      },
      {
        title: getLanguage(global.language).Profile.LICENSE_EDITION_ADVANCED,
        id: Platform.OS === 'ios' ? '18003' : '19003',
      },
    ]
  }

  getModuleData = () => {
    return [
      {
        title: getLanguage(global.language).Profile.ITABLET_ARMAP,
        id: Platform.OS === 'ios' ? '18004' : '19004',
      },
      {
        title: getLanguage(global.language).Profile.ITABLET_NAVIGATIONMAP,
        id: Platform.OS === 'ios' ? '18005' : '19005',
      },
      {
        title: getLanguage(global.language).Profile.ITABLET_DATAANALYSIS,
        id: Platform.OS === 'ios' ? '18006' : '19006',
      },
      {
        title: getLanguage(global.language).Profile.ITABLET_PLOTTING,
        id: Platform.OS === 'ios' ? '18007' : '19007',
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
