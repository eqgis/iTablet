import React, { Component } from 'react'
import { Container, LinkageList, Button, TextBtn } from '../../../../components'
import styles from './styles'
import { getLanguage } from '../../../../language'
import { scaleSize, Toast } from '../../../../utils'
import NavigationService from '../../../NavigationService'
import { View } from 'react-native'
import { SMap } from 'imobile_for_reactnative'

export default class RegistrationDatasetPage extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.pageType = params && params.pageType
    this.userName = params && params.userName

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
          if (!this.filtDatasource(datasource)) {
            data.splice(i, 1)
            continue
          }
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

  filtDatasource = datasource => {
    if (
      datasource.engineType === 23 ||
      datasource.engineType === 224 ||
      datasource.engineType === 223 ||
      datasource.engineType === 225 ||
      datasource.engineType === 227 ||
      datasource.engineType === 228 ||
      datasource.engineType === 230
    ) {
      return false
    }
    return true
  }

  filtDataset = dataset => {
    if (
      dataset.datasetType === 1 ||
      dataset.datasetType === 3 ||
      dataset.datasetType === 4 ||
      dataset.datasetType === 5 ||
      // dataset.datasetType === 81 ||     //影像数据集
      // dataset.datasetType === 83 ||      //栅格数据集
      dataset.datasetType === 101 ||
      dataset.datasetType === 103 ||
      dataset.datasetType === 105 ||
      dataset.datasetType === 149
      // dataset.datasetType === 88           //多波段影像
    ) {
      return true
    }
    return false
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
    let _rectifyDatasetInfo = GLOBAL.RegistrationLinkageList.getSelectData()
    let length = this.getRectifyDatasetInfoLength(_rectifyDatasetInfo)
    if (length > 0) {
      GLOBAL.RectifyDatasetInfo = _rectifyDatasetInfo
      if (this.pageType && this.pageType == 1) {
        NavigationService.navigate('RegistrationFastPage', {
          userName: this.userName,
        })
      } else {
        NavigationService.navigate('RegistrationReferDatasetPage')
      }
    } else {
      Toast.show(
        getLanguage(global.language).Analyst_Labels
          .REGISTRATION_NOT_SETLECT_DATASET,
      )
    }
  }

  exit() {
    NavigationService.goBack()
  }
  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Analyst_Labels
            .REGISTRATION_DATASET,
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
          ref={ref => (GLOBAL.RegistrationLinkageList = ref)}
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
            title={
              this.pageType && this.pageType == 1
                ? getLanguage(global.language).Analyst_Labels.REGISTRATION
                : getLanguage(global.language).Analyst_Labels
                  .REGISTRATION_REFER_DATASET_ADD
            }
            ref={ref => (this.sureButton = ref)}
            type={'BLUE'}
            style={{
              width: '50%',
              height: scaleSize(60),
              marginTop: scaleSize(30),
              marginBottom: scaleSize(30),
            }}
            titleStyle={{ fontSize: scaleSize(24) }}
            onPress={() => {
              this.confirm()
            }}
          />
        </View>
      </Container>
    )
  }
}
