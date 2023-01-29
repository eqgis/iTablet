import MapToolbar from "@/containers/workspace/components/MapToolbar"
import { RootState } from "@/redux/types"
import React, { Component } from "react"
import { SectionList, PermissionsAndroid, View, Text, TouchableOpacity, Linking, FlatList, Image, StyleSheet, TextInput } from "react-native"
import { connect, ConnectedProps } from "react-redux"
import { Container, Dialog } from '../../../../src/components'
import { dp } from "imobile_for_reactnative/utils/size"
import { fontSize } from "@/containers/tabs/Mine/Register/Styles"
import { getImage } from "imobile_for_reactnative/components/ToolbarKit/ToolbarResource"
import { getLanguage } from "@/language"
import { getPublicAssets, getThemeAssets } from "@/assets"
import { SCollector, SMCollectorType } from "imobile_for_reactnative"
import NavigationService from "@/containers/NavigationService"
import ToolbarModule from "@/containers/workspace/components/ToolBar/modules/ToolbarModule"
import { AppEvent, Toast } from "@/utils"
import RNImmediatePhoneCall from 'react-native-immediate-phone-call'
import { color } from "@/styles"
import {layerManagerDataType } from '../../mapFunctionModules/ChangeBaseLayer/ChangeBaseLayerData'
import { getLayers } from "@/redux/models/layers"


interface Props extends ReduxProps {
  data: Array<layerManagerDataType>,
}

type selectTitleType = '普通地图' | "影像地图" | "地形地图" | "Google" | "Google Satellite" | "Google Terrain" | "" | 'Google Hybrid'
interface State {
	// to do
  selectTitle: selectTitleType,
}

class ChangeBaseLayer extends Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      selectTitle: '',
    }

  }

  componentDidMount = async (): void => {
    const layers = await this.props.getLayers()
    // console.warn("layers: " + JSON.stringify(layers))
    const baselayer = layers[layers.length - 1]
    const aliasSelect = baselayer.datasourceAlias
    let selectTitle: selectTitleType = ''
    switch(aliasSelect) {
      case 'tianditu':
        selectTitle = '普通地图'
        break
      case 'tiandituImg':
        selectTitle = '影像地图'
        break
      case 'tiandituTer':
        selectTitle = '地形地图'
        break
      case 'GoogleMaps':
        if(baselayer.datasetName === 'roadmap') {
          selectTitle = 'Google'
        } else if(baselayer.datasetName === 'satellite') {
          selectTitle = 'Google Satellite'
        } else if(baselayer.datasetName === 'terrain') {
          selectTitle = 'Google Terrain'
        } else if(baselayer.datasetName === 'hybrid') {
          selectTitle = 'Google Hybrid'
        }
        break
      default:
        selectTitle = ''

    }

    this.setState({
      selectTitle: selectTitle,
    })

    AppEvent.addListener("changeBaseLayer", this.setSelectBaseLayer)

  }

  setSelectBaseLayer = (selectTitle: selectTitleType) => {
    this.setState({
      selectTitle,
    })
  }

  _renderItem = (item: layerManagerDataType, index: number) => {
    return (
      <TouchableOpacity
        style={[{
          width: dp(100),
          height: dp(100),
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'space-around',
          marginHorizontal: dp(10),
        }]}
        onPress={item.action}
      >
        <View
          style={[{
            width: '100%',
            height: dp(80),
            justifyContent: 'center',
            alignItems: 'center',
          }]}
        >
          <Image
            style={[{
              width: dp(80),
              height: dp(80),
            }]}
            source={this.state.selectTitle === item.title ? item.selectImage : item.image}
          />
        </View>
        <View
          style={[{
            width: '100%',
            height: dp(20),
            justifyContent: 'center',
            alignItems: 'center',
          }]}
        >
          <Text>{item.title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderList = () => {
    return (
      <FlatList
        renderItem={({item, index}) => this._renderItem(item, index)}
        data={this.props.data}
        keyExtractor={(item, index) => item.type + "-" + index}
        showsVerticalScrollIndicator={false}
        horizontal={true}
        style={[{
          width: '100%',
          height: dp(120),
          flexDirection: 'row',
          alignContent: 'center',
        }]}
      />
    )
  }

  render() {
    return (
      <View
        style={[styles.containerStyle,]}
      >
        <View
          style={[{
            width: '100%',
            height: dp(24),
          }]}
        >
          <Text
            style={[{
              fontSize: dp(16),
              fontWeight: 'bold',
            }]}
          >{getLanguage(global.language).Profile.LAYER}</Text>
        </View>
        {this.renderList()}
      </View>
    )
  }
}

const mapStateToProp = (state: RootState) => ({
  mapModules: state.mapModules.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
  currentLayer: state.layers.toJS().currentLayer,
  user: state.user.toJS(),
})

const mapDispatch = {
  getLayers,
}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(ChangeBaseLayer)

const styles = StyleSheet.create({
  containerStyle: {
    width: '100%',
    heigth: '100%',
    borderTopRightRadius: dp(20),
    borderTopLeftRadius: dp(20),
    backgroundColor: '#fff',
    paddingHorizontal: dp(10),
    paddingTop: dp(10)
  },
})