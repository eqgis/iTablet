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
  selectTitle: string, // selectTitleType,
  tiandituMap: Array<layerManagerDataType>,
  googleMap: Array<layerManagerDataType>,
}

class ChangeBaseLayer extends Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      selectTitle: '',
      tiandituMap:[],
      googleMap:[],
    }

  }

  componentDidMount = async (): void => {
    const layers = await this.props.getLayers()
    // console.warn("layers: " + JSON.stringify(layers))
    const baselayer = layers[layers.length - 1]
    const aliasSelect = baselayer.datasourceAlias
    // let selectTitle: selectTitleType = ''
    let selectTitle = ''
    switch(aliasSelect) {
      case 'tianditu':
        selectTitle = getLanguage(global.language).Prompt.ORDINARY_MAP // '普通地图'
        break
      case 'tiandituImg':
        selectTitle = getLanguage(global.language).Prompt.IMAGE_MAP // '影像地图'
        break
      case 'tiandituTer':
        selectTitle = getLanguage(global.language).Prompt.TOPOGRAPHIC_MAP // '地形地图'
        break
      case 'GoogleMaps':
        if(baselayer.datasetName === 'roadmap') {
          selectTitle = getLanguage(global.language).Prompt.GOOGLE_MAP // 'Google'
        } else if(baselayer.datasetName === 'satellite') {
          selectTitle = getLanguage(global.language).Prompt.GOOGLE_IMAGE_MAP // 'Google Satellite'
        } else if(baselayer.datasetName === 'terrain') {
          selectTitle = getLanguage(global.language).Prompt.GOOGLE_TOPOGRAPHIC_MAP //  'Google Terrain'
        } else if(baselayer.datasetName === 'hybrid') {
          selectTitle = getLanguage(global.language).Prompt.GOOGLE_TOPOGRAPHIC_MAP // 'Google Hybrid'
        }
        break
      default:
        selectTitle = ''

    }

    const tempTiandituMap: Array<layerManagerDataType> = []
    const tempGoogleMap: Array<layerManagerDataType> = []
    this.props.data.map((item: layerManagerDataType) => {
      if(item.baseMapType === 'tianditu') {
        tempTiandituMap.push(item)
      } else {
        tempGoogleMap.push(item)
      }
    })

    this.setState({
      selectTitle: selectTitle,
      tiandituMap: tempTiandituMap,
      googleMap: tempGoogleMap,
    })

    AppEvent.addListener("changeBaseLayer", this.setSelectBaseLayer)

  }
  // selectTitleType
  setSelectBaseLayer = (selectTitle: string) => {
    this.setState({
      selectTitle,
    })
  }

  _renderItem = (item: layerManagerDataType, index: number) => {
    let text = ""
    switch(index){
      case 0:
        text = getLanguage(global.language).Prompt.PLAN_2D
        break
      case 1:
        text = getLanguage(global.language).Prompt.SATELLITE_MAP
        break
      case 2:
        text = getLanguage(global.language).Prompt.TOPOGRAPHIC_MAP
        break

    }
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
          <Text>{text}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderList = (data: Array<layerManagerDataType>) => {
    return (
      <FlatList
        renderItem={({item, index}) => this._renderItem(item, index)}
        data={data}
        keyExtractor={(item, index) => item.type + "-" + index}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal={true}
        style={[{
          width: '100%',
          height: dp(120),
          flexDirection: 'row',
          alignContent: 'center',
          marginTop: dp(10),
        }]}
      />
    )
  }

  // renderRowView = (data: Array<layerManagerDataType>) => {
  //   return (
  //     <View
  //       style={[{
  //         width: '100%',
  //         height:dp(120),
  //         flexDirection: 'row',
  //         alignContent: 'center',
  //       }]}
  //     >
  //       {data.map((item: layerManagerDataType, index: number) => {
  //         return this._renderItem(item, index)
  //       })}
  //     </View>
  //   )
  // }

  // renderContent = () => {
  //   console.warn("length: " + this.props.data.length)
  //   let row = parseInt(this.props.data.length / 3 + "")
  //   if(this.props.data.length % 3 !== 0) {
  //     row += 1
  //   }
  //   console.warn("row: " + row)

  //   let tempData = []
  //   for(let i = 0; i < row; i ++) {
  //     let rowdata = []
  //     let len = 3
  //     if(i === row - 1) {
  //       len = this.props.data.length % 3
  //     }

  //     for(let j = 0; j < len; j ++) {
  //       rowdata.push(this.props.data[(row - 1) * 3 + j])
  //     }

  //     tempData.push(rowdata)
  //   }

  //   console.warn("tempData: " + JSON.stringify(tempData))

  //   return(
  //     <View
  //       style={[{
  //         width: '100%',
  //         flex: 1,
  //         // alignContent: 'center',
  //         backgroundColor: '#f00',
  //       }]}
  //     >
  //     </View>
  //   )
  // }

  render() {
    return (
      <View
        style={[styles.containerStyle,]}
      >
        <View
          style={[{
            width: '100%',
            height: dp(30),
            // backgroundColor: '#f00',
            flexDirection: 'row',
            alignItems:'center',
          }]}
        >
          <Text
            style={[{
              fontSize: dp(16),
              fontWeight: 'bold',
            }]}
          >{getLanguage(global.language).Profile.TIANDITU_MAP}</Text>
        </View>
        {this.renderList(this.state.tiandituMap)}

        <View
          style={[{
            width: '100%',
            height: dp(1),
            backgroundColor: '#eee'
          }]}
        ></View>

        <View
          style={[{
            width: '100%',
            height: dp(30),
            marginTop: dp(10),
            flexDirection: 'row',
            alignItems:'center',
          }]}
        >
          <Text
            style={[{
              fontSize: dp(16),
              fontWeight: 'bold',
            }]}
          >{getLanguage(global.language).Profile.GOOGLE_MAP}</Text>
        </View>
        {this.renderList(this.state.googleMap)}
        {/* {this.renderContent()} */}
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