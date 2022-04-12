import React, { Component } from 'react'
import { FlatList } from 'react-native'
import { Container, CustomAlertDialog } from '../../../../components'
import { ConstToolType } from '../../../../constants'
import styles from './styles'
import NavigationService from '../../../NavigationService'
import { AnalystListItem } from '../../components'
// import { Analyst_Types } from '../../AnalystType'
import AnalystEntryData from './AnalystEntryData'
import { getLanguage } from '../../../../language'
import { getThemeAssets } from '../../../../assets'
import { is } from 'immutable'
import { scaleSize } from '../../../../utils'

const onlineAnalysisTypes = {
  DENSITY: 1,
  AGGREGATE_POINTS_ANALYSIS: 2,
}

export default class AnalystListEntry extends Component {
  props: {
    navigation: Object,
    data: Array,
    setSettingData: () => {},
    settingData: any,
    device: Object,
    currentUser: Object,
    language: Object,
    isAnalyst: Object,
    setIsAnalyst: () => {},
    analystSuccess: Boolean,
    setAnalystSuccess: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = props.route
    this.cb = params && params.cb
    this.type =
      (params && params.type) || ConstToolType.SM_MAP_ANALYSIS_ONLINE_ANALYSIS
    // TODO 根据类型获取数据列表
    this.state = {
      title: (params && params.title) || '',
      data: this.getData(this.type),
      DENSITY: false,
      POINT: false,
      status: (new Map(): Map<string, Object>),
      canTouch: true,
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.language !== this.props.language) {
      this.setState({
        data: this.getData(this.type),
      })
    }
  }

  componentDidMount() {
    //在线分析显示转圈效果  add jiakai
    if (this.props.isAnalyst.type === getLanguage(language).Analyst_Methods.DENSITY
      ||
      this.props.isAnalyst.type === getLanguage(language).Analyst_Methods.AGGREGATE_POINTS_ANALYSIS) {
      const status = (new Map(): Map<string, Object>)
      status.set(this.props.isAnalyst.type, this.props.isAnalyst.type)
      this.setState({ status: status, canTouch: false })
    }
    if (this.props.analystSuccess) {
      this.AlertDialog.setDialogVisible(true, {
        title: getLanguage(this.props.language).Analyst_Prompt.ANALYSIS_SUCCESS,
        confirmAction: () => { NavigationService.goBack('AnalystListEntry'), this.props.setAnalystSuccess(false) },
        cancelAction: () => { this.props.setAnalystSuccess(false) },
        value: getLanguage(this.props.language).Analyst_Prompt.ANALYSIS_SUCCESS_TOWATCH,
        contentHeight: scaleSize(200),
      })
    }
  }

  getData = type => {
    let data = []
    switch (type) {
      case ConstToolType.SM_MAP_ANALYSIS_OPTIMAL_PATH:
        data =
          AnalystEntryData.getLocalAnalystEntryData(
            this.props.language,
            ConstToolType.SM_MAP_ANALYSIS_OPTIMAL_PATH,
          ) || []
        break
      case ConstToolType.SM_MAP_ANALYSIS_CONNECTIVITY_ANALYSIS:
        data =
          AnalystEntryData.getLocalAnalystEntryData(
            this.props.language,
            ConstToolType.SM_MAP_ANALYSIS_CONNECTIVITY_ANALYSIS,
          ) || []
        break
      case ConstToolType.SM_MAP_ANALYSIS_FIND_TSP_PATH:
        data =
          AnalystEntryData.getLocalAnalystEntryData(
            this.props.language,
            ConstToolType.SM_MAP_ANALYSIS_FIND_TSP_PATH,
          ) || []
        break
      case ConstToolType.SM_MAP_ANALYSIS_ONLINE_ANALYSIS:
        data = this.getOnlineAnalystData(this.props.language) || []
        break
      case ConstToolType.SM_MAP_ANALYSIS_OVERLAY_ANALYSIS:
      default:
        data = AnalystEntryData.getOverlayAnalystData(this.props.language) || []
        break
    }

    return data || []
  }


  /**
   * 在线分析方式列表
   * @param language
   * @returns {[*,*]}
   */
  getOnlineAnalystData(language) {
    const data = [
      {
        key: getLanguage(language).Analyst_Methods.DENSITY,
        title: getLanguage(language).Analyst_Methods.DENSITY,
        action: (cb = (result) => { this.analystChange(result) }) =>
          this.onlineCallback(
            getLanguage(language).Analyst_Methods.DENSITY,
            onlineAnalysisTypes.DENSITY,
            cb,
          ),
        image: getThemeAssets().analyst.analysis_online_density,
      },
      {
        key: getLanguage(language).Analyst_Methods.AGGREGATE_POINTS_ANALYSIS,
        title: getLanguage(language).Analyst_Methods.AGGREGATE_POINTS_ANALYSIS,
        action: (cb = (result) => { this.analystChange(result) }) =>
          this.onlineCallback(
            getLanguage(language).Analyst_Methods.AGGREGATE_POINTS_ANALYSIS,
            onlineAnalysisTypes.AGGREGATE_POINTS_ANALYSIS,
            cb,
          ),
        image: getThemeAssets().analyst.analysis_online_aggregate,
      },
    ]
    return data
  }


  /**
   * 在线分析结果回调方法
   * @param language
   * @returns {[*,*]}
   */
  analystChange = (result) => {
    this.props.setIsAnalyst({ type: result })
    const status = (new Map(): Map<string, Object>)
    status.set(result, result)
    if (result === getLanguage(language).Analyst_Methods.DENSITY
      ||
      result === getLanguage(language).Analyst_Methods.AGGREGATE_POINTS_ANALYSIS) {
      this.setState({ status: status, canTouch: false })
    } else {
      this.setState({ status: status, canTouch: true })
    }
    if (result === 'true') {
      this.props.setAnalystSuccess(true)
      this.AlertDialog.setDialogVisible(true, {
        title: getLanguage(this.props.language).Analyst_Prompt.ANALYSIS_SUCCESS,
        confirmAction: () => { NavigationService.goBack('AnalystListEntry'), this.props.setAnalystSuccess(false) },
        cancelAction: () => { this.props.setAnalystSuccess(false) },
        value: getLanguage(this.props.language).Analyst_Prompt.ANALYSIS_SUCCESS_TOWATCH,
        contentHeight: scaleSize(200),
      })
    }
  }

  /**
   * 在线分析列表回调
   * @param title
   * @param type
   * @param cb
   */
  onlineCallback(title, type, cb) {
    NavigationService.navigate('OnlineAnalystView', {
      title,
      type,
      cb,
    })
  }

  back = () => {
    NavigationService.goBack()
  }

  _action = item => {
    if (this.state.canTouch) {
      if (item && item.action && typeof item.action === 'function') {
        item.action(this.cb)
      }
    } else {
      Toast.show(
        getLanguage(this.props.language).Analyst_Prompt.ANALYSING
      )
    }
  }

  _renderItem = ({ item }) => {
    let isanalyst = this.state.status.get(item.title) == item.title
    return (
      <AnalystListItem
        title={item.title}
        icon={item.image}
        isAnalyst={isanalyst}
        onPress={() => this._action(item)}
      />
    )
  }

  /**
 * 用户自定义信息弹窗
 * @returns {*}
 */
  renderCustomAlertDialog = () => {
    return (
      <CustomAlertDialog
        ref={ref => (this.AlertDialog = ref)}
      />)

  }

  _keyExtractor = (item, index) => item.title + '_' + index

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.state.title,
          navigation: this.props.navigation,
          backAction: this.back,
        }}
      >
        <FlatList
          initialNumToRender={20}
          ref={ref => (this.ref = ref)}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          data={this.state.data}
          extraData={this.state}
        />
        {this.renderCustomAlertDialog()}
      </Container>
    )
  }
}
