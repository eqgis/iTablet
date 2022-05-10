import { EngineType, FileTools, SMap } from 'imobile_for_reactnative'
import { NaviDataset } from 'imobile_for_reactnative/types/interface/mapping/SMap'
import React from 'react'
import { View, TouchableOpacity, Image, Text, FlatList, ListRenderItemInfo } from 'react-native'
import { getThemeAssets } from '../../../../assets'
import {
  Container,
} from '../../../../components'
import { getLanguage } from '../../../../language'
import { scaleSize } from '../../../../../src/utils'
import { ARNaviModule } from '../ArNavigationModule'
import { NaviDatasetInfo, NaviDatasourceInfo } from '../ArNavigationModule/ARNaviModule'


interface Props {
  navigation: any,
}

interface State {
  datasource: NaviDatasourceInfo | undefined
  selectedDataset: NaviDatasetInfo | undefined
}

class RoadNet extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      datasource: undefined,
      selectedDataset: undefined
    }

    this.reopen()
  }

  reopen = () => {
    const datasourceInfo = this.props.route?.params?.datasource
    if(datasourceInfo) {
      let index
      const dataset = this.props.route?.params?.dataset
      if(dataset) {
        index = datasourceInfo.datasets.findIndex(item => item.datasetName ===  dataset.datasetName)
      }
      this.openDatasource(datasourceInfo.alias, datasourceInfo.path, index)
    }
  }

  openDatasource = async (alias: string, path: string, index: number | undefined = undefined) => {
    try {
      await SMap.getDatasetsByDatasource({
        alias: alias,
        server: await FileTools.getHomeDirectory() + path,
        engineType: EngineType.UDB,
      }, true)
      const naviData = await SMap.getAllNavData()
      const naviDataset = naviData.filter(item => {
        return item.title === 'dataset'
      })
      const datasetInfos: NaviDatasetInfo[] = []
      for(let i = 0; i < (naviDataset[0] as NaviDataset).data.length; i++) {
        const item = (naviDataset[0] as NaviDataset).data[i]
        if (item.datasourceName === alias && item.poiDatasetName) {
          datasetInfos.push({
            datasourceAlias: item.datasourceName,
            datasetName: item.datasetName,
            modelFileName: item.modelFileName,
            poiDatasetName: item.poiDatasetName,
          })
        }
      }
      let selectedDataset: NaviDatasetInfo | undefined = undefined
      if(index !== undefined) {
        selectedDataset = datasetInfos[index]
      }
      this.setState({
        datasource: {
          alias: alias,
          path: path,
          datasets: datasetInfos
        },
        selectedDataset: selectedDataset
      })
      ARNaviModule.setData({
        naviDatasourceInfo: {
          alias: alias,
          path,
          datasets: datasetInfos
        }
      })
      ARNaviModule.setData({
        naviDatasetInfo: selectedDataset
      })
    } catch(e) {
    }
  }

  closePreDatasource = async () => {
    const prevDatasource = ARNaviModule.getData().naviDatasourceInfo
    if(prevDatasource) {
      await SMap.closeDatasource(prevDatasource.alias)
    }
  }

  renderHeaderRight = () => {
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}>
        <TouchableOpacity
          style={{
            marginHorizontal: scaleSize(10),
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={async ()=>{
            this.props.navigation.navigate('MyARMap', {
              showMode: 'tap',
              moveToMapCenter: false,
            })
          }}
        >
          <Image
            source={getThemeAssets().nav.my_armap}
            style={{
              width: scaleSize(50),
              height: scaleSize(50),
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginHorizontal: scaleSize(10),
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={async ()=>{
            this.props.navigation.navigate('MyDatasource', {
              showMode: 'tap',
              callback: async info => {
                const name = info.item.name.substring(0, info.item.name.lastIndexOf('.'))
                await this.closePreDatasource()
                this.openDatasource(name, info.item.path)
              }
            })
          }}
        >
          <Image
            source={getThemeAssets().nav.toolbar_switch}
            style={{
              width: scaleSize(50),
              height: scaleSize(50),
            }}
          />
        </TouchableOpacity>
      </View>
    )
  }

  renderDatasource = () => {
    if(!this.state.datasource) return null
    return (
      <Datasource
        datasource={this.state.datasource}
        selectedDataset={this.state.selectedDataset}
        onDatasetSelect={dataset => {
          const selectedDataset = this.state.selectedDataset?.datasetName === dataset.datasetName
            ? undefined
            : dataset
          this.setState({
            selectedDataset: selectedDataset
          })
          ARNaviModule.setData({
            naviDatasetInfo: selectedDataset
          })
        }}
      />
    )
  }

  render() {
    return(
      <Container
        headerProps={{
          title: getLanguage(global.language).ARMap.ROADNET_DATA,
          headerRight: this.renderHeaderRight(),
          backAction: () => {
            this.props.navigation.goBack()
          },
          headerTitleViewStyle: {
            textAlign: 'left',
            marginLeft: scaleSize(80)
          },
        }}
      >
        {this.renderDatasource()}
      </Container>
    )
  }
}

export default RoadNet


interface DatasourceProps {
  datasource: NaviDatasourceInfo
  selectedDataset: NaviDatasetInfo | undefined
  onDatasetSelect: (dataset: NaviDatasetInfo) => void
}

class Datasource extends React.Component<DatasourceProps> {
  constructor(props: DatasourceProps) {
    super(props)

  }

  renderDataset = ({item}: ListRenderItemInfo<NaviDatasetInfo>) => {
    return (
      <Dataset
        dataset={item}
        selectedDatasetName={this.props.selectedDataset?.datasetName}
        onSelect={dataset => this.props.onDatasetSelect(dataset)}
      />)
  }

  renderListHeader = () => {
    if (this.props.datasource.datasets.length > 0) {
      return (<View style={{
        width: '100%',
        height: scaleSize(1),
        backgroundColor: '#ECECEC',
      }} />)
    }
    return null
  }

  render() {
    return (
      <View style={{
        marginTop: scaleSize(10),
        marginHorizontal: scaleSize(10),
        borderRadius: scaleSize(10),
        backgroundColor: '#FFFFFF',
      }}>
        <View style={{flexDirection: 'row', alignItems: 'center', padding: scaleSize(5)}}>
          <Image
            source={getThemeAssets().nav.my_data}
            style={{
              width: scaleSize(50),
              height: scaleSize(50),
            }}
          />
          <Text>{this.props.datasource.alias}</Text>
        </View>
        <FlatList
          ListHeaderComponent={this.renderListHeader()}
          data={this.props.datasource.datasets}
          renderItem={this.renderDataset}
          keyExtractor={item => item.datasetName}
          initialNumToRender={20}
        />
      </View>
    )
  }
}

interface DatasetProps {
  dataset: NaviDatasetInfo
  selectedDatasetName: string | undefined
  onSelect: (dataset: NaviDatasetInfo) => void
}

class Dataset extends React.Component<DatasetProps> {
  constructor(props: DatasetProps) {
    super(props)

  }

  render() {
    const radioIcon = this.props.dataset.datasetName === this.props.selectedDatasetName
      ? getThemeAssets().nav.radio_check
      : getThemeAssets().nav.radio_none
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: scaleSize(10),
        }}
        onPress={()=>{
          this.props.onSelect(this.props.dataset)
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Image
            style={[{
              width: scaleSize(50),
              height: scaleSize(50),
            }, { marginHorizontal: scaleSize(5) }]}
            source={getThemeAssets().nav.network}
          />
          <Text style={{
            fontSize: scaleSize(20),
            color: 'black',
          }}>
            {this.props.dataset.datasetName}
          </Text>
        </View>
        <Image
          style={{
            width: scaleSize(50),
            height: scaleSize(50),
          }}
          source={radioIcon}
        />
      </TouchableOpacity>
    )
  }
}