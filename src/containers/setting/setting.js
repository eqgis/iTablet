import React, { Component } from 'react'
import { Container } from '../../components'
import { MapToolbar } from '../../containers/workspace/components'
import {
  View,
  Text,
  Image,
  SectionList,
  Switch,
  InteractionManager,
} from 'react-native'
import styles from './styles'
import settingData from './settingData'
import { color } from '../../styles'
import { getLanguage } from '../../language'
import { scaleSize } from '../../utils'
import { getThemeAssets } from '../../assets'

const HORIZONTAL_GAP_L = scaleSize(30)
const HORIZONTAL_GAP_P = scaleSize(50)
export default class setting extends Component {
  props: {
    language: string,
    navigation: Object,
    data: Array,
    mapModules: Object,
    setSettingData: () => {},
    settingData: any,
    device: Object,
    appConfig: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.type = (params && params.type) || 'MAP_3D'
    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getData()
    })
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.settingData) !==
      JSON.stringify(this.props.settingData)
    ) {
      this.setState({ data: this.props.settingData })
    }
  }

  getData = async () => {
    let data
    if (this.type === 'MAP_3D') {
      // eslint-disable-next-line
      data = await settingData.getMap3DSettings()
    }
    this.setState({ data: data })
  }

  refreshList = section => {
    let newData = this.state.data
    for (let index = 0; index < section.data.length; index++) {
      section.data[index].isShow = !section.data[index].isShow
    }
    section.visible = !section.visible
    newData[section.index] = section
    this.setState({
      data: newData.concat(),
    })
  }

  _onValueChange = (value, item, index) => {
    let newData = this.state.data
    newData[item.index].data[index].value = value
    this.setState({
      data: newData.concat(),
    })
  }

  renderListSectionHeader = ({ section }) => {
    return (
      <View
        style={[
          styles.section,
          {
            paddingHorizontal: this.props.device.orientation.indexOf('LANDSCAPE') === 0
              ? HORIZONTAL_GAP_L : HORIZONTAL_GAP_P,
          }
        ]}
      >
        <Image source={getThemeAssets().setting.icon_basic} style={styles.selection} />
        <Text style={styles.sectionsTitle}>{section.title}</Text>
      </View>
    )
  }
  
  renderListItem = ({ item, index }) => {
    if (item.isShow) {
      if (typeof item.value === 'boolean') {
        return (
          <View style={[
            styles.row,
            {
              paddingHorizontal: this.props.device.orientation.indexOf('LANDSCAPE') === 0
                ? HORIZONTAL_GAP_L : HORIZONTAL_GAP_P,
            }
          ]}>
            <Text style={styles.switchText}>{item.name}</Text>
            <Switch
              style={styles.switch}
              trackColor={{ false: color.bgG, true: color.switch }}
              thumbColor={item.value ? color.bgW : color.bgW}
              ios_backgroundColor={item.value ? color.switch : color.bgG}
              value={item.value}
              onValueChange={value => {
                this._onValueChange(value, item, index)
              }}
            />
          </View>
        )
      } else {
        return (
          <View style={[
            styles.row,
            {
              paddingHorizontal: this.props.device.orientation.indexOf('LANDSCAPE') === 0
                ? HORIZONTAL_GAP_L : HORIZONTAL_GAP_P,
            }
          ]}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemValue}>{item.value}</Text>
          </View>
        )
      }
    } else {
      return <View />
    }
  }
  
  _renderItemSeparator = () => {
    return (
      <View
        style={[
          styles.itemSeparator,
          {
            marginLeft: this.props.device.orientation.indexOf('LANDSCAPE') === 0
              ? HORIZONTAL_GAP_L : HORIZONTAL_GAP_P,
          }
        ]}
      />
    )
  }
  
  renderSelection = () => {
    return (
      <SectionList
        sections={this.state.data}
        renderItem={this.renderListItem}
        ItemSeparatorComponent={this._renderItemSeparator}
        renderSectionHeader={this.renderListSectionHeader}
        keyExtractor={(item, index) => index}
        onRefresh={this.getData}
        refreshing={false}
      />
    )
  }

  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        mapModules={this.props.mapModules}
        initIndex={3}
        type={this.type}
      />
    )
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(this.props.language).Map_Module.MAP_3D,
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(90),
          },
          navigation: this.props.navigation,
          withoutBack: true,
        }}
        onOverlayPress={() => {
          this.props.navigation.navigate('Map3D')
        }}
        bottomBar={this.renderToolBar()}
      >
        {this.renderSelection()}
      </Container>
    )
  }
}
