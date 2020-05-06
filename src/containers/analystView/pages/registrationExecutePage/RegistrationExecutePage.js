import React, { Component } from 'react'
import { Container, TextBtn, CheckBox, PopView } from '../../../../components'

import styles from './styles'
import { getLanguage } from '../../../../language'
import { scaleSize, Toast } from '../../../../utils'
import { color, size } from '../../../../styles'
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import { SMap, SRectifyView } from 'imobile_for_reactnative'
import SampleModeView from '../../components/SampleModeView'
import { getPublicAssets } from '../../../../assets'
import NavigationService from '../../../NavigationService'

export default class RegistrationExecutePage extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    this.datasources = []
    this.currentDatasetIndex = -1
    this.tempDatasets = []
    this.state = {
      datasets: [],
      datasourcesInfo: [],
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    (async function() {
      GLOBAL.Loading.setLoading(
        true,
        getLanguage(global.language).Prompt.LOADING,
      )
      try {
        let data = await SMap.getDatasetsByWorkspaceDatasource()
        for (let i = 0; i < data.length; i++) {
          let datasource = data[i]
          datasource.title = datasource.alias
          datasource.datasourceName = datasource.alias
          let datasetsData = datasource.data
          for (let j = 0; j < datasetsData.length; j++) {
            let dataset = datasetsData[j]
            dataset.title = dataset.datasetName
            dataset.parentTitle = dataset.datasourceName
            dataset.isSelect = false
            dataset.outputDatasetName = dataset.datasetName
            dataset.outputDatasourceName = dataset.datasourceName
          }
        }

        let datasetArr = []

        if (GLOBAL.RectifyDatasetInfo) {
          let datasourceInfos = GLOBAL.RectifyDatasetInfo
          for (let i = 0; i < datasourceInfos.length; i++) {
            let datasourceInfo = datasourceInfos[i]
            let datasourceInfoDataLength = datasourceInfo.data.length
            for (
              let detasetInfoIndex = 0;
              detasetInfoIndex < datasourceInfoDataLength;
              detasetInfoIndex++
            ) {
              let tempDetasetInfoIndex = datasourceInfo.data[detasetInfoIndex]
              let tempData = data
              for (
                let datasourceIndex = 0;
                datasourceIndex < tempData.length;
                datasourceIndex++
              ) {
                let tempDatasource = tempData[datasourceIndex]
                if (datasourceInfo.datasourceName === tempDatasource.alias) {
                  for (
                    let datasetIndex = 0;
                    datasetIndex < tempDatasource.data.length;
                    datasetIndex++
                  ) {
                    if (tempDetasetInfoIndex === datasetIndex) {
                      datasetArr.push(tempDatasource.data[datasetIndex])
                    }
                  }
                }
              }
            }
          }
        }
        this.tempDatasets = datasetArr
        this.setState({
          datasets: datasetArr,
          datasourcesInfo: data,
        })
        GLOBAL.Loading.setLoading(false)
      } catch (e) {
        GLOBAL.Loading.setLoading(false)
      }
    }.bind(this)())
  }

  // onPressItem(item) {
  onPressItem() {
    // NavigationService.navigate('RegistrationPage')
  }

  confirm = async () => {
    GLOBAL.Loading.setLoading(
      true,
      getLanguage(global.language).Analyst_Labels.REGISTRATION_EXECUTING,
    )
    let arithmeticMode = GLOBAL.RegistrationArithmeticMode
    let datasets = this.state.datasets
    let count = 0
    for (let i = 0; i < datasets.length; i++) {
      if (datasets[i].sampleModeData && datasets[i].sampleModeData.checked) {
        datasets[i].isResmaple = true

        if (datasets[i].sampleModeData.resmapleMode) {
          datasets[i].resmapleMode = datasets[i].sampleModeData.resmapleMode
        }
        if (datasets[i].sampleModeData.cellSize) {
          datasets[i].cellSize = datasets[i].sampleModeData.cellSize
        }
      } else {
        datasets[i].isResmaple = false
      }
      if (datasets[i].isSelect) {
        datasets[i].saveAs = 1
      } else {
        datasets[i].saveAs = 0
      }
      datasets[i].transformationMode = arithmeticMode

      await SRectifyView.rectifyRasterDirectByDataset(datasets[i])
      count++
    }
    if (count === datasets.length) {
      Toast.show(
        getLanguage(global.language).Analyst_Labels
          .REGISTRATION_EXECUTE_SUCCESS,
      )
    }
    GLOBAL.Loading.setLoading(false)
  }

  renderRows() {
    let rows = []
    for (let i = 0; i < this.state.datasets.length; i++) {
      rows.push(this.renderItem(this.state.datasets[i], i))
    }
    return <View style={{ backgroundColor: color.content_white }}>{rows}</View>
  }

  renderListHeader() {
    return (
      <View
        style={{
          width: '100%',
          height: scaleSize(80),
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: color.content_white,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            height: scaleSize(24),
            backgroundColor: color.content_white,
          }}
        >
          <Text style={styles.textOriginalStyle}>
            {
              getLanguage(global.language).Analyst_Labels
                .REGISTRATION_ORIGINAL_DATASOURCE
            }
          </Text>

          <Text style={styles.textOriginalStyle}>
            {getLanguage(global.language).Analyst_Labels.REGISTRATION_SAVE_AS}
          </Text>

          <Text style={styles.textOriginalStyle}>
            {
              getLanguage(global.language).Analyst_Labels
                .REGISTRATION_RESULT_DATASET
            }
          </Text>

          <Text style={styles.textOriginalStyle}>
            {
              getLanguage(global.language).Analyst_Labels
                .REGISTRATION_RESULT_DATASOURCE
            }
          </Text>
          <Text style={styles.textOriginalStyle}>
            {
              getLanguage(global.language).Analyst_Labels
                .REGISTRATION_SAMPLE_MODE
            }
          </Text>
        </View>
      </View>
    )
  }

  isGridOrImageDatasetType(datasetType) {
    return datasetType === 81 || datasetType === 83
  }

  editDatasetName(dataset, index) {
    NavigationService.navigate('InputPage', {
      headerTitle: getLanguage(global.language).Analyst_Labels
        .REGISTRATION_RESULT_DATASET,
      value: dataset.outputDatasetName,
      placeholder: getLanguage(global.language).Analyst_Labels
        .REGISTRATION_RESULT_DATASET,
      type: 'name',
      cb: async value => {
        let _datasets = this.state.datasets
        _datasets[index].outputDatasetName = value
        this.setState({
          datasets: _datasets,
        })
        NavigationService.goBack()
      },
    })
  }

  renderItem(item, index) {
    return (
      <View
        style={{
          width: '100%',
          height: scaleSize(80),
        }}
      >
        {index != 0 ? <View style={styles.lineStyle} /> : null}
        <View
          style={{
            width: '100%',
            height: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View style={styles.textOriginalStyle2}>
            <Text style={styles.textOriginalStyle}>
              {item.datasetName + '@'}
            </Text>
            <Text style={styles.textOriginalStyle}>{item.datasourceName}</Text>
          </View>

          <CheckBox
            style={{
              flex: 1,
              height: scaleSize(30),
              width: scaleSize(30),
            }}
            onChange={value => {
              let tempData = this.state.datasets
              tempData[index].isSelect = value
              if (value) {
                this.setState({
                  datasets: tempData,
                })
              } else {
                tempData[index].outputDatasetName = this.tempDatasets[
                  index
                ].datasetName
                tempData[index].outputDatasourceName = this.tempDatasets[
                  index
                ].outputDatasourceName
                this.setState({
                  datasets: tempData,
                })
              }
            }}
          />

          <TouchableOpacity
            style={styles.leftWrap}
            onPress={() => {
              this.editDatasetName(item, index)
            }}
          >
            <Text
              style={{
                flex: 1,
                width: '100%',
                textAlign: 'center',
                fontSize: size.fontSize.fontSizeSm,
                color: item.isSelect ? color.fontColorBlack : color.gray,
              }}
              numberOfLines={1}
            >
              {item.outputDatasetName}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.leftWrap}
            onPress={() => {
              this.currentDatasetIndex = index
              this.DatasourcePopView.setVisible(true)
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: size.fontSize.fontSizeSm,
                  color: item.isSelect ? color.fontColorBlack : color.gray,
                }}
                numberOfLines={1}
              >
                {item.outputDatasourceName}
              </Text>
              <Image
                source={getPublicAssets().mapTools.icon_arrow_down}
                style={styles.selectionImg}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.leftWrap}
            onPress={() => {
              if (!this.isGridOrImageDatasetType(item.datasetType)) {
                return
              }
              if (!item.sampleModeData) {
                let _sampleModeData = {}
                _sampleModeData.checked = false
                _sampleModeData.index = index
                _sampleModeData.cellSize = item.cellSize
                item.sampleModeData = _sampleModeData
              }
              this.SampleModeSelectView.setData(item.sampleModeData)
              this.SampleModeSelectView.setVisable(true)
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: size.fontSize.fontSizeSm,
                  color: this.isGridOrImageDatasetType(item.datasetType)
                    ? color.fontColorBlack
                    : color.gray,
                }}
                numberOfLines={1}
              >
                {item.sampleModeData && item.sampleModeData.checked
                  ? item.sampleModeData.sampleModeTitle
                  : getLanguage(global.language).Analyst_Labels
                    .REGISTRATION_SAMPLE_MODE_NO}
              </Text>
              <Image
                source={getPublicAssets().mapTools.icon_arrow_down}
                style={styles.selectionImg}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderSampleModeSelectView() {
    return (
      <SampleModeView
        ref={ref => (this.SampleModeSelectView = ref)}
        getData={selectData => this.getSampleModeData(selectData)}
      />
    )
  }
  getSampleModeData = selectData => {
    let _sampleModeData = selectData
    let _datasets = this.state.datasets
    _datasets[selectData.index].sampleModeData = _sampleModeData
    this.setState({
      datasets: _datasets,
    })
  }

  _renderDatasourcePagePopup = () => {
    let rows = []
    let _datasourcesInfo = this.state.datasourcesInfo
    for (let i = 0; i < _datasourcesInfo.length; i++) {
      rows.push(this.renderDatasourceItem(_datasourcesInfo[i]))
    }
    return (
      <PopView ref={ref => (this.DatasourcePopView = ref)}>
        <View
          style={{
            width: '100%',
            height: scaleSize(500),
            backgroundColor: color.contentColorWhite,
          }}
        >
          <ScrollView
            style={{
              backgroundColor: color.contentColorWhite,
              flex: 1,
              // height: '100%',
              height: scaleSize(500),
            }}
            ref={ref => (this.scrollView = ref)}
          >
            {/* img = require('../../assets/Navigation/indoor_datasource.png') */}
            <View
              style={{
                width: '100%',
                backgroundColor: color.contentColorWhite,
              }}
            >
              {rows}
            </View>
          </ScrollView>
        </View>
      </PopView>
    )
  }

  renderDatasourceItem(datasources) {
    return (
      <TouchableOpacity
        style={{
          height: scaleSize(60),
          justifyContent: 'center',
        }}
        onPress={() => {
          let _datasets = this.state.datasets
          _datasets[this.currentDatasetIndex].outputDatasourceName =
            datasources.datasourceName
          this.setState({
            datasets: _datasets,
          })
          this.DatasourcePopView.setVisible(false)
        }}
      >
        <View
          style={{
            // width: scaleSize(30),
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Image
            source={require('../../../../assets/Navigation/indoor_datasource.png')}
            style={{
              height: scaleSize(35),
              width: scaleSize(35),
              marginLeft: scaleSize(30),
            }}
          />
          <Text
            style={{
              width: '100%',
              height: scaleSize(28),
              marginLeft: scaleSize(30),
              fontSize: size.fontSize.fontSizeSm,
              color: color.fontColorBlack,
            }}
            numberOfLines={1}
          >
            {datasources.datasourceName}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Analyst_Labels
            .REGISTRATION_EXECUTE,
          navigation: this.props.navigation,
          backAction: this.back,
          headerRight: (
            <TextBtn
              btnText={getLanguage(global.language).Analyst_Labels.CONFIRM}
              textStyle={styles.headerBtnTitle}
              btnClick={() => {
                this.confirm()
              }}
            />
          ),
        }}
      >
        {this.renderListHeader()}
        <View style={styles.lineStyle} />
        {this.renderRows()}
        {this.renderSampleModeSelectView()}
        {this._renderDatasourcePagePopup()}
      </Container>
    )
  }
}
