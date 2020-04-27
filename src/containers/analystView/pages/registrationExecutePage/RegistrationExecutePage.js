import React, { Component } from 'react'
import { Container, TextBtn, CheckBox } from '../../../../components'

import styles from './styles'
import { getLanguage } from '../../../../language'
import { scaleSize } from '../../../../utils'
import { color, size } from '../../../../styles'
import { View, Text, TouchableOpacity } from 'react-native'
import { SMap, SRectifyView } from 'imobile_for_reactnative'

export default class RegistrationExecutePage extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)

    this.tempDatasets = []
    this.state = {
      datasets: [],
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
          let datasetsData = datasource.data
          for (let j = 0; j < datasetsData.length; j++) {
            let dataset = datasetsData[j]
            dataset.title = dataset.datasetName
            dataset.parentTitle = dataset.datasourceName
            dataset.isSelect = false
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

  confirm() {
    let datasets = this.state.datasets
    for (let i = 0; i < datasets.length; i++) {
      SRectifyView.rectifyRasterDirectByDataset(datasets[i])
    }
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
        </View>
      </View>
    )
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
                tempData[index].datasetName = this.tempDatasets[
                  index
                ].datasetName
                tempData[index].datasourceName = this.tempDatasets[
                  index
                ].datasourceName
                this.setState({
                  datasets: tempData,
                })
              }
            }}
          />

          <TouchableOpacity style={styles.leftWrap} onPress={() => {}}>
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
              {item.datasetName}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.leftWrap} onPress={() => {}}>
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
              {item.datasourceName}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
              // btnClick={this.confirm}
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
      </Container>
    )
  }
}
