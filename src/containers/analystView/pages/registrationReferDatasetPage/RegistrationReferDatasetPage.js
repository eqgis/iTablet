import React, { Component } from 'react'
import { Container, LinkageList, Button } from '../../../../components'
import styles from './styles'
import { getLanguage } from '../../../../language'
import { scaleSize, Toast } from '../../../../utils'
import NavigationService from '../../../NavigationService'
import { View } from 'react-native'
import { SMap } from 'imobile_for_reactnative'

export default class RegistrationReferDatasetPage extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)

    let title = ''
    this.state = {
      title,
      dataSourceAndSets: [],
    }
    this.clickAble = true // 防止重复点击
  }

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    (async function() {
      this.setLoading(true, getLanguage(global.language).Prompt.LOADING)
      try {
        let data = await SMap.getDatasetsByWorkspaceDatasource()
        for (let i = 0; i < data.length; ) {
          let datasource = data[i]
          if (!this.filtDatasource(datasource)) {
            data.splice(i, 1)
            continue
          }
          datasource.title = datasource.alias
          let datasetsData = datasource.data
          let _index = 0
          for (let j = 0; j < datasetsData.length; ) {
            let dataset = datasetsData[j]
            let result = this.filtDataset(dataset)
            if (!result) {
              datasetsData.splice(j, 1)
              _index++
              continue
            } else {
              dataset.title = dataset.datasetName
              dataset.parentTitle = dataset.datasourceName
              dataset.isSelect = false
              dataset.index = _index
              dataset.hasSelect = this.hasSelect(dataset)
            }
            _index++
            j++
          }
          if (datasetsData.length == 0) {
            data.splice(i, 1)
          } else {
            i++
          }
        }
        this.setState({
          dataSourceAndSets: data,
        })
        this.setLoading(false)
      } catch (e) {
        this.setLoading(false)
      }
    }.bind(this)())
  }

  // eslint-disable-next-line
  filtDatasource = datasource => {
    // if (
    //   datasource.engineType === 23 ||
    //   datasource.engineType === 224 ||
    //   datasource.engineType === 223 ||
    //   datasource.engineType === 225 ||
    //   datasource.engineType === 227 ||
    //   datasource.engineType === 228 ||
    //   datasource.engineType === 230
    // ) {
    //   return false
    // }
    return true
  }

  // eslint-disable-next-line
  filtDataset = dataset => {
    // if (
    //   dataset.datasetType === 1 ||
    //   dataset.datasetType === 3 ||
    //   dataset.datasetType === 4 ||
    //   dataset.datasetType === 5 ||
    //   // dataset.datasetType === 81 ||     //影像数据集
    //   // dataset.datasetType === 83 ||      //栅格数据集
    //   dataset.datasetType === 101 ||
    //   dataset.datasetType === 103 ||
    //   dataset.datasetType === 105 ||
    //   dataset.datasetType === 149
    //   // dataset.datasetType === 88           //多波段影像
    // ) {
    //   return true
    // }
    return true
  }

  hasSelect = item => {
    let hasSelect = false
    let rectivyDatasetInfo = global.RectifyDatasetInfo
    if (rectivyDatasetInfo) {
      let length = rectivyDatasetInfo.length
      for (let i = 0; i < length; i++) {
        let datasourceInfo = rectivyDatasetInfo[i]
        if (item.datasourceName === datasourceInfo.datasourceName) {
          let datasetInfoData = datasourceInfo.data
          for (let j = 0; j < datasetInfoData.length; j++) {
            let datasetInfo = datasetInfoData[j]
            if (item.index === datasetInfo) {
              hasSelect = true
              return hasSelect
            }
          }
        }
      }
    }
    return hasSelect
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  getRectifyDatasetInfoLength(rectifyDatasetInfo) {
    let count = 0
    let datasourceLength = rectifyDatasetInfo.length
    for (let i = 0; i < datasourceLength; i++) {
      count += rectifyDatasetInfo[i].data.length
    }
    return count
  }

  confirm = () => {
    let _rectifyDatasetInfo = this.ReferLinkageList.getSelectData()
    let length = this.getRectifyDatasetInfoLength(_rectifyDatasetInfo)
    if (length > 0) {
      global.RectifyReferDatasetInfo = _rectifyDatasetInfo
      // NavigationService.navigate('RegistrationArithmeticPage')
      NavigationService.navigate('RegistrationPage')
    } else {
      Toast.show(
        getLanguage(global.language).Analyst_Labels
          .REGISTRATION_NOT_SETLECT_REFER_DATASET,
      )
    }
  }

  exit = () => {
    if (this.clickAble) {
      this.clickAble = false
      setTimeout(() => {
        this.clickAble = true
      }, 1500)
    } else {
      return
    }

    NavigationService.goBack()
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Analyst_Labels
            .REGISTRATION_REFER_DATASET_ADD,
          navigation: this.props.navigation,
          backAction: this.exit,
        }}
      >
        <LinkageList
          // ref={ref => (this.linkageList = ref)}
          ref={ref => (this.ReferLinkageList = ref)}
          language={global.language}
          adjustmentWidth={true}
          data={this.state.dataSourceAndSets}
          titles={[
            getLanguage(global.language).Analyst_Labels.DATA_SOURCE,
            getLanguage(global.language).Analyst_Labels.DATA_SET,
          ]}
          onRightPress={this.listRightAction}
          isMultiple={true}
        />

        <View style={{ alignItems: 'center' }}>
          <Button
            title={getLanguage(global.language).Analyst_Labels.REGISTRATION}
            ref={ref => (this.sureButton = ref)}
            type={'BLUE'}
            style={{
              width: '50%',
              height: scaleSize(60),
              marginTop: scaleSize(30),
              marginBottom: scaleSize(30),
            }}
            titleStyle={{ fontSize: scaleSize(24) }}
            onPress={this.confirm}
          />
        </View>
      </Container>
    )
  }
}
