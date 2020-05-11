import React, { Component } from 'react'
import { Container, LinkageList, Button, TextBtn } from '../../../../components'
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
          datasource.title = datasource.alias
          let datasetsData = datasource.data
          for (let j = 0; j < datasetsData.length; ) {
            let dataset = datasetsData[j]
            let result = this.filtDataset(dataset)
            if (!result) {
              datasetsData.splice(j, 1)
              continue
            } else {
              dataset.title = dataset.datasetName
              dataset.parentTitle = dataset.datasourceName
              dataset.isSelect = false
              dataset.index = j
              dataset.hasSelect = this.hasSelect(dataset)
              j++
            }
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

  filtDataset = dataset => {
    if (
      dataset.datasetType === 1 ||
      dataset.datasetType === 3 ||
      dataset.datasetType === 5 ||
      dataset.datasetType === 81 ||
      dataset.datasetType === 83 ||
      dataset.datasetType === 101 ||
      dataset.datasetType === 103 ||
      dataset.datasetType === 105 ||
      dataset.datasetType === 149 ||
      dataset.datasetType === 88
    ) {
      return true
    }
    return false
  }

  hasSelect = item => {
    let hasSelect = false
    let rectivyDatasetInfo = GLOBAL.RectifyDatasetInfo
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
    let _rectifyDatasetInfo = GLOBAL.ReferLinkageList.getSelectData()
    let length = this.getRectifyDatasetInfoLength(_rectifyDatasetInfo)
    if (length > 0) {
      GLOBAL.RectifyReferDatasetInfo = _rectifyDatasetInfo
      NavigationService.navigate('RegistrationArithmeticPage')
    } else {
      Toast.show(
        getLanguage(global.language).Analyst_Labels
          .REGISTRATION_NOT_SETLECT_REFER_DATASET,
      )
    }
  }

  exit() {
    NavigationService.goBack()
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
          backAction: this.back,
          headerRight: (
            <TextBtn
              btnText={getLanguage(global.language).Profile.LICENSE_EXIT}
              textStyle={styles.headerBtnTitle}
              btnClick={this.exit}
            />
          ),
        }}
      >
        <LinkageList
          // ref={ref => (this.linkageList = ref)}
          ref={ref => (GLOBAL.ReferLinkageList = ref)}
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
