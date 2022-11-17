import React, { Component } from 'react'
import { Container, LinkageList, Button } from '../../../../components'
import styles from './styles'
import { getLanguage } from '../../../../language'
import { scaleSize, Toast, screen } from '../../../../utils'
import NavigationService from '../../../NavigationService'
import { View, Text, TouchableOpacity, Image ,Platform} from 'react-native'
import { SMap } from 'imobile_for_reactnative'
import GuideView from '../../../workspace/components/GuideView'
import { getPublicAssets } from '../../../../assets'

export default class RegistrationDatasetPage extends Component {
  props: {
    navigation: Object,
    mapAnalystGuide: Boolean,
    setMapAnalystGuide: () => {},
    device: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.route
    this.pageType = params && params.pageType //pageType等于1表示快速配准，否则是新建配准
    this.userName = params && params.userName

    this.clickAble = true // 防止重复点击

    let title = ''
    this.state = {
      title,
      dataSourceAndSets: [],
      select: true,
      move:false,
      add: false,
      backgroundStyle: {},
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    (async function () {
      this.setLoading(true, getLanguage(global.language).Prompt.LOADING)
      try {
        let data = await SMap.getDatasetsByWorkspaceDatasource()
        for (let i = 0; i < data.length;) {
          let datasource = data[i]
          if (!this.filtDatasource(datasource)) {
            data.splice(i, 1)
            continue
          }
          datasource.title = datasource.alias
          let datasetsData = datasource.data
          let _index = 0
          for (let j = 0; j < datasetsData.length;) {
            let dataset = datasetsData[j]
            let result = this.filtDataset(dataset)
            if (!result) {
              datasetsData.splice(j, 1)
              // _index++
              continue
            } else {
              dataset.title = dataset.datasetName
              dataset.parentTitle = dataset.datasourceName
              dataset.isSelect = false
              dataset.index = _index
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

  isHaveCadDataset(datasourceInfos) {
    for (let i = 0; i < datasourceInfos.length; i++) {
      let datasourceInfo = datasourceInfos[i]
      let datasourceInfoDataLength = datasourceInfo.data.length
      for (
        let detasetInfoIndex = 0;
        detasetInfoIndex < datasourceInfoDataLength;
        detasetInfoIndex++
      ) {
        let tempDetasetInfoIndex = datasourceInfo.data[detasetInfoIndex]
        let tempData = this.state.dataSourceAndSets
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
                //判断是否是CAD图层
                if (tempDatasource.data[datasetIndex].datasetType === 149) {
                  return true
                }
              }
            }
          }
        }
      }
    }
    return false
  }

  confirm = () => {
    let _rectifyDatasetInfo = this.RegistrationLinkageList.getSelectData()
    let length = this.getRectifyDatasetInfoLength(_rectifyDatasetInfo)
    if (length > 0) {
      let bHaveCadDataset = this.isHaveCadDataset(_rectifyDatasetInfo)
      global.IsHaveCadDataset = bHaveCadDataset
      global.RectifyDatasetInfo = _rectifyDatasetInfo
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

  exit = () => {
    if (this.clickAble) {
      this.clickAble = false
      setTimeout(() => {
        this.clickAble = true
      }, 1500)
      NavigationService.goBack()
    }
  }

  next = () => {
    if (this.state.select) {
      this.setState({
        select: false,
        move: true,
        backgroundStyle:{opacity: 0.2}
      })
    } else if(this.state.move){
      this.setState({
        move:false,
        add:true,
        backgroundStyle:{opacity: 0.8}
      })
    } else {
      // NavigationService.goBack()
      this.props.setMapAnalystGuide(false)
    }
  }

  skip = () => {
    // NavigationService.goBack()
    this.props.setMapAnalystGuide(false)
  }

  renderSelectGuide = () => {
    return (
      <GuideView
        title={getLanguage(this.props.language).Profile.SELECT_DATASET}
        style={{
          top: this.selectHeight + this.iosTop,
          position: 'absolute',
          backgroundColor: 'transparent',
          left: scaleSize(240),
          maxWidth: scaleSize(350),
        }}
        arrowstyle={{
          borderBottomWidth: 9,
          borderBottomColor: 'white',
          borderLeftWidth: 8,
          borderLeftColor: 'transparent',
          borderRightWidth: 8,
          borderRightColor: 'transparent',
          marginLeft: scaleSize(40),
        }}
        type={'top'}
      />
    )
  }

  renderSelectGuideImg = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: this.selectImgHeight + this.iosTop,
          left: scaleSize(268),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: scaleSize(55),
          width: scaleSize(55),
          borderRadius: 5,
          backgroundColor: 'white',
        }}
      >
        <Image
          resizeMode={'contain'}
          style={{
            height: scaleSize(49),
            width: scaleSize(49),
          }}
          source={getPublicAssets().common.icon_check}
        />
      </View>
    )
  }

  renderMoveGuide = () => {
    return (
      <View
        style={{
          position: 'absolute',
          // top:scaleSize(440) + screen.getIphonePaddingTop(),
          top:this.height/2-scaleSize(80)+ this.iosTop,
          left:scaleSize(180),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: scaleSize(210),
          width: scaleSize(210),
          borderRadius: 5,
          backgroundColor: 'transparent',
        }}
      >
        <Image
          resizeMode={'contain'}
          style={{
            height: scaleSize(200),
            width: scaleSize(200),
          }}
          source={getPublicAssets().common.icon_move_left_right}
        />
      </View>
    )
  }

  renderMoveTextGuide = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: this.height / 2 + scaleSize(120) + this.iosTop,
          left: scaleSize(180),
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: scaleSize(25),
            color: 'black',
            textAlignVertical: 'center',
            maxWidth: scaleSize(280),
          }}>
          {getLanguage(this.props.language).Profile.MOVE_BROWSING}
        </Text>
      </View>
    )
  }

  renderAddGuide = () => {
    return (
      <GuideView
        title={getLanguage(this.props.language).Profile.ADD_SELECT_DATASET}
        style={{
          bottom: scaleSize(90),
          position: 'absolute',
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}
        arrowstyle={{
          borderTopWidth: 9,
          borderTopColor: 'white',
          borderLeftWidth: 8,
          borderLeftColor: 'transparent',
          borderRightWidth: 8,
          borderRightColor: 'transparent',
          marginBottom: scaleSize(45),
        }}
      />
    )
  }

  renderAddGuideButton = () => {
    return (
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
            // height: scaleSize(60),
            height: "auto",
            paddingVertical: scaleSize(10),
            marginTop: scaleSize(30),
            marginBottom: scaleSize(30),
          }}
          titleStyle={{ fontSize: scaleSize(24) }}
        />
      </View>
    )
  }

  //配准界面新手引导
  //renderAddGuide因为要居中效果要放在黑色布局下不然会影响按钮样式
  renderGudieView = () => {
    return (
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          flexDirection: 'column-reverse',
        }}>
        <View
          style={[{
            position: 'absolute',
            backgroundColor: 'black',
            width: '100%',
            height: '100%',
            opacity: 0.8,
            alignItems: 'center',
            alignSelf: 'center',
          },this.state.backgroundStyle]} >
          {this.state.add && this.renderAddGuide()}
        </View>

        {this.state.select && this.renderSelectGuide()}
        {this.state.select && this.renderSelectGuideImg()}

        {this.state.move && this.renderMoveTextGuide()}
        {this.state.move && this.renderMoveGuide()}


        {this.state.add && this.renderAddGuideButton()}


        <TouchableOpacity
          style={{
            position: 'absolute',
            right: scaleSize(40),
            bottom: scaleSize(30),
            backgroundColor: 'white',
            borderRadius: scaleSize(20),
            opacity: 0.8,
            borderColor: 'black',
            borderWidth: scaleSize(2),
          }}
          onPress={this.next}
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: scaleSize(25),
              color: 'black',
              fontWeight: 'bold',
              padding: scaleSize(10),
            }}>
            {getLanguage(this.props.language).Profile.MY_GUIDE_NEXT}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            position: 'absolute',
            right: scaleSize(40),
            top: scaleSize(30) + this.iosTop,
            backgroundColor: 'white',
            borderRadius: scaleSize(20),
            opacity: 0.8,
            borderColor: 'black',
            borderWidth: scaleSize(2),
          }}
          onPress={this.skip}
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: scaleSize(25),
              color: 'black',
              fontWeight: 'bold',
              padding: scaleSize(10),
            }}>
            {getLanguage(this.props.language).Profile.MY_GUIDE_SKIP}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    if (this.props.device.orientation.indexOf('LANDSCAPE') !== 0){
      this.iosTop = screen.getIphonePaddingTop()
      this.height = screen.getScreenSafeHeight(this.props.device.orientation)
      this.selectImgHeight = scaleSize(190)
      this.selectHeight = scaleSize(240)
    } else {
      this.iosTop = 0
      this.height = screen.getScreenHeight(this.props.device.orientation)
      this.selectImgHeight = scaleSize(150)
      this.selectHeight = scaleSize(200)
    }
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Analyst_Labels
            .REGISTRATION_DATASET,
          navigation: this.props.navigation,
          backAction: this.exit,
        }}
      >
        <LinkageList
          // ref={ref => (this.linkageList = ref)}
          ref={ref => (this.RegistrationLinkageList = ref)}
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
              // height: scaleSize(60),
              height: "auto",
              paddingVertical: scaleSize(10),
              marginTop: scaleSize(30),
              marginBottom: scaleSize(30),
            }}
            titleStyle={{ fontSize: scaleSize(24) }}
            onPress={() => {
              this.confirm()
            }}
          />
        </View>
        {this.props.mapAnalystGuide && this.renderGudieView()}
      </Container>
    )
  }
}
