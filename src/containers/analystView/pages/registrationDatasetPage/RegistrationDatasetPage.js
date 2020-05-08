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
      NavigationService.navigate('RegistrationReferDatasetPage')
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
              getLanguage(global.language).Analyst_Labels
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
            onPress={this.confirm}
          />
        </View>
      </Container>
    )
  }
}
