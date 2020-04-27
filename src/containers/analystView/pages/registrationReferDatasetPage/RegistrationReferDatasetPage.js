import React, { Component } from 'react'
import { Container, LinkageList, Button } from '../../../../components'
import styles from './styles'
import { getLanguage } from '../../../../language'
import { scaleSize } from '../../../../utils'
import NavigationService from '../../../NavigationService'
import { View } from 'react-native'
import { SMap } from 'imobile_for_reactnative'

export default class RegistrationReferDatasetPage extends Component {
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
        for (let i = 0; i < data.length; i++) {
          let datasource = data[i]
          datasource.title = datasource.alias
          let datasetsData = datasource.data
          for (let j = 0; j < datasetsData.length; j++) {
            let dataset = datasetsData[j]
            dataset.title = dataset.datasetName
            dataset.parentTitle = dataset.datasourceName
            dataset.isSelect = false
            dataset.index = j
            dataset.hasSelect = this.hasSelect(dataset)
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

  confirm() {
    GLOBAL.RectifyReferDatasetInfo = GLOBAL.ReferLinkageList.getSelectData()
    NavigationService.navigate('RegistrationArithmeticPage')
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Analyst_Labels.REGISTRATION,
          backAction: this.back,
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
