import React, { Component } from 'react'
import { Container, TextBtn } from '../../../../components'
import { AnalystItem, PopModalList } from '../../components'
import styles from './styles'
import { getLanguage } from '../../../../language'
import { scaleSize, Toast } from '../../../../utils'
import { color } from '../../../../styles'
import NavigationService from '../../../NavigationService'
import { View, Text, ScrollView } from 'react-native'
import { SMap, SProcess } from 'imobile_for_reactnative'
import { getLayerIconByType, getLayerWhiteIconByType } from '../../../../assets'

const popTypes = {
  DataSource: 'DataSource',
  DataSet: 'DataSet',
  TransMothodData: 'TransMothodData',
  ResultDataSource: 'ResultDataSource',
  ResultDataSet: 'ResultDataSet',
}

export default class ProjectionTransformationPage extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)

    this.state = {
      dataSource: null, //源数据源
      dataSet: null, //源数据集
      transMothodData: null, //转换方法
      transMothodParameter: null, //转换方法参数
      isMustSaveAs: false, //是否必须另存，影像和栅格数据集必须另存
      isSaveAs: false, //是否另存
      resultDataSource: null, //结果数据源
      resultDataSet: null, //结果数据集
      targetCoords: null, //目标坐标系

      // 弹出框数据
      popData: [],
      currentPopData: null,
    }
  }

  getDefaultParameter = () => {
    let _transMothodParameter = {
      offsetX: 0,
      offsetY: 0,
      offsetZ: 0,

      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,

      ratitionDifference: 0,
    }
    return _transMothodParameter
  }

  confirm = async () => {
    //判断数据源
    if (!this.state.dataSource) {
      Toast.show(
        getLanguage(global.language).Analyst_Labels.REGISTRATION_PLEASE_SELECT +
          getLanguage(global.language).Analyst_Labels.DATA_SOURCE,
      )
      return
    }
    //判断数据集
    if (!this.state.dataSet) {
      Toast.show(
        getLanguage(global.language).Analyst_Labels.REGISTRATION_PLEASE_SELECT +
          getLanguage(global.language).Analyst_Labels.DATA_SET,
      )
      return
    }
    //判断转换方法
    if (!this.state.transMothodData) {
      Toast.show(
        getLanguage(global.language).Analyst_Labels.REGISTRATION_PLEASE_SELECT +
          getLanguage(global.language).Analyst_Labels.PROJECTION_CONVERT_MOTHED,
      )
      return
    }
    //是否另存
    if (this.state.isSaveAs) {
      //判断数据源
      if (!this.state.resultDataSource) {
        Toast.show(
          getLanguage(global.language).Analyst_Labels
            .REGISTRATION_PLEASE_SELECT +
            getLanguage(global.language).Analyst_Labels.RESULT_SETTINGS +
            getLanguage(global.language).Analyst_Labels.DATA_SOURCE,
        )
        return
      }
      // //目标坐标系
      // if(!this.state.targetCoords){
      //   Toast.show(
      //     getLanguage(global.language).Analyst_Labels
      //       .REGISTRATION_PLEASE_SELECT +
      //       getLanguage(global.language).Analyst_Labels
      //         .TARGET_COORDS,
      //   )
      //   return
      // }
      //判断数据集
      if (!this.state.resultDataSet) {
        Toast.show(
          getLanguage(global.language).Analyst_Labels
            .REGISTRATION_PLEASE_SELECT +
            getLanguage(global.language).Analyst_Labels.RESULT_SETTINGS +
            getLanguage(global.language).Analyst_Labels.DATA_SET,
        )
        return
      }
      //目标坐标系
      if (!this.state.targetCoords) {
        Toast.show(
          getLanguage(global.language).Analyst_Labels
            .REGISTRATION_PLEASE_SELECT +
            getLanguage(global.language).Analyst_Labels.TARGET_COORDS,
        )
        return
      }
    }
    //目标坐标系
    if (!this.state.targetCoords) {
      Toast.show(
        getLanguage(global.language).Analyst_Labels.REGISTRATION_PLEASE_SELECT +
          getLanguage(global.language).Analyst_Labels.TARGET_COORDS,
      )
      return
    }

    GLOBAL.Loading.setLoading(
      true,
      getLanguage(global.language).Analyst_Labels.CONVERTTING,
    )
    let dataInfo = {}
    dataInfo.datasourceName = this.state.dataSource.alias
    dataInfo.datasetName = this.state.dataSet.datasetName
    dataInfo.transMothodId = this.state.transMothodData.id
    dataInfo.transMothodParameter = this.state.transMothodParameter
    dataInfo.saveAs = this.state.isSaveAs ? 1 : 0
    if (dataInfo.saveAs === 1) {
      dataInfo.outputDatasourceName = this.state.resultDataSource.alias
      dataInfo.outputDatasetName = this.state.resultDataSet.datasetName
    }
    dataInfo.coordSysType = this.state.targetCoords.value
    let result = await SProcess.convertDataset(dataInfo)
    GLOBAL.Loading.setLoading(false)

    if (result) {
      NavigationService.goBack()
      Toast.show(getLanguage(global.language).Analyst_Labels.CONVERT_SUCCESS)
    } else {
      Toast.show(getLanguage(global.language).Analyst_Labels.CONVERT_FAILED)
    }
  }

  //是否是影像或者栅格数据集
  isImageOrGridDataset = dataset => {
    if (
      dataset.datasetType === 81 || //影像数据集
      dataset.datasetType === 83 || //栅格数据集
      dataset.datasetType === 88 //多波段影像
    ) {
      return true
    }
    return false
  }

  getDataSources = async () => {
    // let datasources = await SMap.getDatasetsByWorkspaceDatasource()
    // return datasources

    let dss = []
    let datasources = await SMap.getDatasetsByWorkspaceDatasource()
    datasources.forEach(item => {
      item.key = item.alias
      item.value = item.key
      dss.push(item)
    })
    return dss
  }

  getDataSets = () => {
    let dss = []
    let dataSets = this.state.dataSource
    dataSets.data.forEach(item => {
      item.key = item.datasetName
      item.value = item.key
      dss.push(item)
    })
    return dss
  }

  getResultDataSets = () => {
    let dss = []
    let dataSets = this.state.resultDataSource
    dataSets.data.forEach(item => {
      item.key = item.datasetName
      item.value = item.key
      dss.push(item)
    })
    return dss
  }

  //获取投影转换方法数据
  getCoordSysTransMethodData = () => {
    let transMothodData = []
    ///基于地心的三参数转换法。
    transMothodData.push({
      name: 'Geocentric Translation (3-para)',
      id: 9603,
      paraNumber: 3,
    })
    ///莫洛金斯基（Molodensky）转换法。
    transMothodData.push({
      name: 'Molodensky (3-para)',
      id: 9604,
      paraNumber: 3,
    })
    ///简化的莫洛金斯基转换法。
    transMothodData.push({
      name: 'Abridged Molodensky (3-para)',
      id: 9605,
      paraNumber: 3,
    })
    ///位置矢量法。
    transMothodData.push({
      name: 'Position Vector (7-para)',
      id: 9606,
      paraNumber: 7,
    })
    ///基于地心的七参数转换法。
    transMothodData.push({
      name: 'Coordinate Frame (7-para)',
      id: 9607,
      paraNumber: 7,
    })
    ///布尔莎方法。
    transMothodData.push({
      name: 'Buras Wolf (7-para)',
      id: 9608,
      paraNumber: 7,
    })

    let _transMothodData = []
    transMothodData.forEach(item => {
      item.key = item.name
      item.value = item.key
      _transMothodData.push(item)
    })
    return _transMothodData
  }

  //源数据部分界面
  renderTop() {
    return (
      <View style={{ backgroundColor: color.white }}>
        <View style={[styles.titleView, { backgroundColor: color.white }]}>
          <Text style={styles.title}>
            {getLanguage(global.language).Analyst_Labels.SOURCE_DATA}
          </Text>
        </View>
        <AnalystItem
          // style={{ marginRight: scaleSize(0) }}
          title={getLanguage(global.language).Analyst_Labels.DATA_SOURCE}
          value={(this.state.dataSource && this.state.dataSource.value) || ''}
          onPress={async () => {
            this.currentPop = popTypes.DataSource
            let datasources = await this.getDataSources()
            this.setState(
              {
                popData: datasources,
                currentPopData: this.state.dataSource,
              },
              () => {
                this.popModal && this.popModal.setVisible(true)
              },
            )
          }}
        />
        <AnalystItem
          // style={{ marginRight: scaleSize(0) }}
          title={getLanguage(global.language).Analyst_Labels.DATA_SET}
          value={(this.state.dataSet && this.state.dataSet.value) || ''}
          onPress={async () => {
            if (!this.state.dataSource) {
              Toast.show(
                getLanguage(global.language).Analyst_Prompt
                  .SELECT_DATA_SOURCE_FIRST,
              )
              return
            }

            this.currentPop = popTypes.DataSet
            let dataSets = this.getDataSets()

            let newDataSets = []
            dataSets.forEach(item => {
              let _item = Object.assign({}, item)
              _item.icon = getLayerIconByType(_item.datasetType)
              _item.highLightIcon = getLayerWhiteIconByType(_item.datasetType)
              newDataSets.push(_item)
            })
            this.setState(
              {
                popData: newDataSets,
                currentPopData: this.state.transMothodData,
              },
              () => {
                this.popModal && this.popModal.setVisible(true)
              },
            )
          }}
        />
        <AnalystItem
          style={{ borderBottomWidth: 0 }}
          title={
            getLanguage(global.language).Analyst_Labels.PROJECTION_SOURCE_COORDS
          }
          value={
            (this.state.dataSet && this.state.dataSet.coordParams.coordName) ||
            ''
          }
          onPress={async () => {
            if (!this.state.dataSet) {
              Toast.show(
                getLanguage(global.language).Analyst_Prompt
                  .SELECT_DATA_SET_FIRST,
              )
              return
            }
            let _coordParams = this.state.dataSet.coordParams
            NavigationService.navigate('SourceCoordsPage', {
              paramsData: _coordParams,
            })
          }}
        />
      </View>
    )
  }

  //参考系转换设置界面
  renderTransMethodView() {
    return (
      <View style={{ backgroundColor: color.white, marginTop: scaleSize(20) }}>
        <View style={[styles.titleView, { backgroundColor: color.white }]}>
          <Text style={styles.title}>
            {
              getLanguage(global.language).Analyst_Labels
                .PROJECTION_CONVERT_SETTING
            }
          </Text>
        </View>
        <AnalystItem
          // style={{ marginRight: scaleSize(0) }}
          title={
            getLanguage(global.language).Analyst_Labels
              .PROJECTION_CONVERT_MOTHED
          }
          value={
            (this.state.transMothodData && this.state.transMothodData.value) ||
            ''
          }
          onPress={async () => {
            this.currentPop = popTypes.TransMothodData
            let transMethodData = this.getCoordSysTransMethodData()
            let newDataSets = transMethodData
            this.setState(
              {
                popData: newDataSets,
                currentPopData: this.state.dataSet,
              },
              () => {
                this.popModal && this.popModal.setVisible(true)
              },
            )
          }}
        />
        <AnalystItem
          style={{ borderBottomWidth: 0 }}
          title={
            getLanguage(global.language).Analyst_Labels
              .PROJECTION_PARAMETER_SETTING
          }
          // value={(this.state.dataSet && this.state.dataSet.coordParams.coordName) || ''} GO_TO_SET
          value={getLanguage(global.language).Analyst_Labels.GO_TO_SET}
          onPress={async () => {
            if (!this.state.transMothodData) {
              Toast.show(
                getLanguage(global.language).Analyst_Labels
                  .REGISTRATION_PLEASE_SELECT +
                  getLanguage(global.language).Analyst_Labels
                    .PROJECTION_CONVERT_MOTHED,
              )
              return
            }
            let transMothodParameter = this.getDefaultParameter()
            transMothodParameter = this.state.transMothodParameter
              ? this.state.transMothodParameter
              : transMothodParameter
            transMothodParameter.paraNumber = this.state.transMothodData.paraNumber
            NavigationService.navigate('ProjectionParameterSetPage', {
              transMothodParameter,
              cb: parameter => {
                NavigationService.goBack()
                this.setState({
                  transMothodParameter: parameter,
                })
              },
            })
          }}
        />
      </View>
    )
  }

  //结果设置界面
  renderResult() {
    return (
      <View style={{ backgroundColor: color.white, marginTop: scaleSize(20) }}>
        <View style={[styles.titleView, { backgroundColor: color.white }]}>
          <Text style={styles.title}>
            {getLanguage(global.language).Analyst_Labels.RESULT_SETTINGS}
          </Text>
        </View>
        <AnalystItem
          // style={{ borderBottomWidth: 0 }}
          title={getLanguage(global.language).Analyst_Labels.TARGET_COORDS}
          value={
            (this.state.targetCoords && this.state.targetCoords.title) || ''
          }
          onPress={async () => {
            NavigationService.navigate('ProjectionTargetCoordsPage', {
              cb: targetCoords => {
                NavigationService.goBack()
                this.setState({
                  targetCoords: targetCoords,
                })
              },
            })
          }}
        />
        <AnalystItem
          // style={{ marginRight: scaleSize(0) }}
          title={
            getLanguage(global.language).Analyst_Labels.REGISTRATION_SAVE_AS
          }
          disable={this.state.isMustSaveAs}
          value={this.state.isMustSaveAs || this.state.isSaveAs}
          onChange={value => {
            this.setState({
              isSaveAs: value,
            })
          }}
        />
        <AnalystItem
          // style={{ marginRight: scaleSize(0) }}
          title={getLanguage(global.language).Analyst_Labels.DATA_SOURCE}
          value={
            (this.state.resultDataSource &&
              this.state.resultDataSource.value) ||
            ''
          }
          onPress={async () => {
            this.currentPop = popTypes.ResultDataSource
            let datasources = await this.getDataSources()
            this.setState(
              {
                popData: datasources,
                currentPopData: this.state.resultDataSource,
              },
              () => {
                this.popModal && this.popModal.setVisible(true)
              },
            )
          }}
        />
        <AnalystItem
          style={{ borderBottomWidth: 0 }}
          title={getLanguage(global.language).Analyst_Labels.DATA_SET}
          value={
            // (this.state.resultDataSet && this.state.resultDataSet.value) || ''
            (this.state.resultDataSet &&
              this.state.resultDataSet.datasetName) ||
            ''
          }
          onPress={async () => {
            NavigationService.navigate('InputPage', {
              headerTitle: getLanguage(global.language).Analyst_Labels.DATA_SET,
              value:
                (this.state.resultDataSet &&
                  this.state.resultDataSet.datasetName) ||
                '',
              placeholder: getLanguage(global.language).Analyst_Labels.DATA_SET,
              type: 'name',
              cb: async value => {
                NavigationService.goBack()
                this.setState({
                  resultDataSet: { datasetName: value },
                })
              },
            })
          }}
        />
      </View>
    )
  }

  /** 选择数据源弹出框 **/
  renderPopList = () => {
    return (
      <PopModalList
        ref={ref => (this.popModal = ref)}
        language={global.language}
        popData={this.state.popData}
        currentPopData={this.state.currentPopData}
        confirm={async data => {
          let newStateData = {}
          switch (this.currentPop) {
            case popTypes.DataSource: {
              newStateData = { dataSource: data, dataSet: null }
              break
            }
            case popTypes.DataSet: {
              let _isMustSaveAs = false
              if (this.isImageOrGridDataset(data)) {
                _isMustSaveAs = true
              }

              newStateData = {
                dataSet: data,
                isMustSaveAs: _isMustSaveAs,
                resultDataSet: { datasetName: data.datasetName + '_1' },
              }
              break
            }
            case popTypes.TransMothodData: {
              newStateData = {
                transMothodData: data,
                transMothodParameter: null,
              }
              break
            }
            case popTypes.ResultDataSource:
              newStateData = { resultDataSource: data }
              break
            case popTypes.ResultDataSet:
              newStateData = { resultDataSet: data }
              break
          }
          this.setState(newStateData, () => {
            this.popModal && this.popModal.setVisible(false)
          })
        }}
      />
    )
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Analyst_Labels
            .PROJECTION_TRANSFORMATION,
          navigation: this.props.navigation,
          backAction: this.back,
          headerRight: (
            <TextBtn
              btnText={getLanguage(global.language).Analyst_Labels.CONFIRM}
              textStyle={styles.headerBtnTitle}
              btnClick={this.confirm}
            />
          ),
        }}
      >
        <ScrollView style={{ backgroundColor: color.background }}>
          {this.renderTop()}
          {this.renderTransMethodView()}
          {this.renderResult()}
        </ScrollView>
        {this.renderPopList()}
      </Container>
    )
  }
}
