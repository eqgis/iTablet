import * as React from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native'
import { TableList } from '../../../../../../../components'
import { color } from '../../../../../../../styles'
import { scaleSize, setSpText } from '../../../../../../../utils'
import { getLanguage } from '../../../../../../../language'
import { getThemeAssets } from '../../../../../../../assets'
import { ConstToolType } from '../../../../../../../constants'

import NavigationService from '../../../../../../../containers/NavigationService'

export default class AnalysisMenuListView extends React.Component {
  props: {
    layerName: string,
    userName: string,
    geoId: number,
    device: Object,
    saveAndContinue: () => {},
    savePlotAnimationNode: () => {},
    showToolbar: () => {},
  }

  constructor(props) {
    super(props)
    this.userName = this.props.userName

    let toolData = this.getToolData()
    let tempAnalysData = this.getData(global.language)
    this.state = {
      //   data: props.data,
      animationMode: -1,
      startTime: 0 + '',
      durationTime: 5 + '',
      startMode: 1,
      data: toolData,
      analysData: tempAnalysData,
      wayPoints: [],

      types: [],
    }
  }

  /** 工具栏数据 * */
  getToolData() {
    let data = []
    data.push({
      key: getLanguage(global.language).Analyst_Modules.REGISTRATION_CREATE,
      title: getLanguage(global.language).Analyst_Modules.REGISTRATION_CREATE,
      action: () => {
        NavigationService.navigate('RegistrationDatasetPage', {})
      },
      size: 'large',
      image: getThemeAssets().analyst.analysis_new_registration_light,
    })
    data.push({
      key: getLanguage(global.language).Analyst_Modules.REGISTRATION_SPEEDINESS,
      title: getLanguage(global.language).Analyst_Modules
        .REGISTRATION_SPEEDINESS,
      action: () => {
        NavigationService.navigate('RegistrationDatasetPage', {
          pageType: 1,
          userName: this.userName,
        })
      },
      size: 'large',
      image: getThemeAssets().analyst.analysis_rapid_registration_light,
    })
    data.push({
      key: getLanguage(global.language).Analyst_Modules
        .PROJECTION_TRANSFORMATION,
      title: getLanguage(global.language).Analyst_Modules
        .PROJECTION_TRANSFORMATION,
      action: () => {
        NavigationService.navigate('ProjectionTransformationPage', {})
      },
      size: 'large',
      image: getThemeAssets().analyst.analysis_converter,
    })
    // data.push({
    //     key: getLanguage(global.language).Analyst_Modules.REGISTRATION_SPEEDINESS,
    //     title: getLanguage(global.language).Analyst_Modules.REGISTRATION_SPEEDINESS,
    //     size: 'large',
    //     // action: (params = {}) => {
    //     //   NavigationService.navigate('LocalAnalystView', {
    //     //     ...params,
    //     //     type: ConstToolType.MAP_ANALYSIS_CONNECTIVITY_ANALYSIS,
    //     //   })
    //     // },
    //     image: getThemeAssets().analyst.analysis_connectivity,
    //   })

    return data
  }

  getData(language) {
    const data = [
      {
        key: getLanguage(language).Analyst_Modules.OPTIMAL_PATH,
        title: getLanguage(language).Analyst_Modules.OPTIMAL_PATH,
        action: (params = {}) => {
          NavigationService.navigate('LocalAnalystView', {
            ...params,
            type: ConstToolType.MAP_ANALYSIS_OPTIMAL_PATH,
            // cb: cb,
          })
        },
        size: 'large',
        image: getThemeAssets().analyst.analysis_shortestpath,
      },
      {
        key: getLanguage(language).Analyst_Modules.CONNECTIVITY_ANALYSIS,
        title: getLanguage(language).Analyst_Modules.CONNECTIVITY_ANALYSIS,
        size: 'large',
        action: (params = {}) => {
          NavigationService.navigate('LocalAnalystView', {
            ...params,
            type: ConstToolType.MAP_ANALYSIS_CONNECTIVITY_ANALYSIS,
          })
        },
        image: getThemeAssets().analyst.analysis_connectivity,
      },
      {
        key: getLanguage(language).Analyst_Modules.FIND_TSP_PATH,
        title: getLanguage(language).Analyst_Modules.FIND_TSP_PATH,
        size: 'large',
        action: (params = {}) => {
          NavigationService.navigate('LocalAnalystView', {
            ...params,
            type: ConstToolType.MAP_ANALYSIS_FIND_TSP_PATH,
          })
        },
        image: getThemeAssets().analyst.analysis_traveling,
      },
      {
        key: getLanguage(language).Analyst_Modules.BUFFER_ANALYST_SINGLE,
        title: getLanguage(language).Analyst_Modules.BUFFER_ANALYST_SINGLE,
        action: (params = {}) => {
          NavigationService.navigate('BufferAnalystView', {
            ...params,
            type: 'single',
          })
        },
        size: 'large',
        image: getThemeAssets().analyst.analysis_buffer,
      },
      {
        key: getLanguage(language).Analyst_Modules.BUFFER_ANALYST_MULTIPLE,
        title: getLanguage(language).Analyst_Modules.BUFFER_ANALYST_MULTIPLE,
        action: (params = {}) => {
          NavigationService.navigate('BufferAnalystView', {
            ...params,
            type: 'multiple',
          })
        },
        size: 'large',
        image: getThemeAssets().analyst.analysis_multibuffer,
      },
      {
        key: getLanguage(language).Analyst_Modules.OVERLAY_ANALYSIS,
        title: getLanguage(language).Analyst_Modules.OVERLAY_ANALYSIS,
        size: 'large',
        action: (params = {}) => {
          NavigationService.navigate('AnalystListEntry', {
            ...params,
            type: ConstToolType.MAP_ANALYSIS_OVERLAY_ANALYSIS,
            title: getLanguage(language).Analyst_Modules.OVERLAY_ANALYSIS,
          })
        },
        image: getThemeAssets().analyst.analysis_overlay,
      },
      {
        key: getLanguage(language).Analyst_Modules.THIESSEN_POLYGON,
        title: getLanguage(language).Analyst_Modules.THIESSEN_POLYGON,
        size: 'large',
        action: (params = {}) => {
          NavigationService.navigate('ReferenceAnalystView', {
            ...params,
            type: ConstToolType.MAP_ANALYSIS_THIESSEN_POLYGON,
            title: getLanguage(language).Analyst_Modules.THIESSEN_POLYGON,
          })
        },
        image: getThemeAssets().analyst.analysis_thiessen,
      },
      {
        key: getLanguage(language).Analyst_Modules.INTERPOLATION_ANALYSIS,
        title: getLanguage(language).Analyst_Modules.INTERPOLATION_ANALYSIS,
        size: 'large',
        action: (params = {}) => {
          NavigationService.navigate('InterpolationAnalystView', {
            ...params,
            type: ConstToolType.MAP_ANALYSIS_INTERPOLATION_ANALYSIS,
            title: getLanguage(language).Analyst_Modules.INTERPOLATION_ANALYSIS,
          })
        },
        image: getThemeAssets().analyst.analysis_interpolation,
      },
      {
        key: getLanguage(language).Analyst_Modules.ONLINE_ANALYSIS,
        title: getLanguage(language).Analyst_Modules.ONLINE_ANALYSIS,
        size: 'large',
        action: (params = {}) => {
          NavigationService.navigate('AnalystListEntry', {
            ...params,
            type: ConstToolType.MAP_ANALYSIS_ONLINE_ANALYSIS,
            title: getLanguage(language).Analyst_Modules.ONLINE_ANALYSIS,
          })
        },
        image: getThemeAssets().analyst.analysis_online,
      },
    ]

    return data
  }

  _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
        key={item.title}
        onPress={() => item.action()}
      >
        <View>
          <Image source={item.image} style={styles.tableItemImg} />
        </View>
        <View style={styles.listItemContent}>
          <Text style={styles.tableItemtext}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderView() {
    return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.textTitle}>
            {getLanguage(global.language).Map_Module.MAP_ANALYST}
          </Text>
        </View>

        <TableList
          style={styles.table}
          data={this.state.data}
          column={4}
          renderCell={this._renderItem}
        />
      </View>
    )
  }

  renderAnalysView() {
    return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.textTitle}>
            {getLanguage(global.language).Analyst_Labels.ANALYST}
          </Text>
        </View>

        <TableList
          style={styles.table}
          data={this.state.analysData}
          column={4}
          renderCell={this._renderItem}
        />
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          ref={ref => (this.scrollView = ref)}
        >
          {/* {this.renderAnalysView()} */}
          {this.renderView()}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgW,
  },
  table: {
    flex: 1,
    backgroundColor: color.bgW,
  },
  tableItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingVertical: scaleSize(20),
  },
  tableItemImg: {
    height: scaleSize(64),
    width: scaleSize(64),
  },
  tableItemtext: {
    width: scaleSize(120),
    fontSize: setSpText(18),
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },

  titleView: {
    alignContent: 'center',
    justifyContent: 'center',
    paddingLeft: scaleSize(20),
    height: scaleSize(60),
    backgroundColor: color.gray3,
  },
  textTitle: {
    fontSize: setSpText(24),
    textAlign: 'auto',
    color: color.themeText2,
  },

  startTimeView: {
    flexDirection: 'row',
    flex: 1,
    marginRight: scaleSize(20),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  lineStyle: {
    flex: 1,
    backgroundColor: color.bgG,
    height: scaleSize(1.5),
    marginLeft: scaleSize(40),
    marginRight: scaleSize(40),
  },
  startTime: {
    flexDirection: 'row',
    height: scaleSize(80),
    padding: scaleSize(40),
    alignItems: 'center',
    alignSelf: 'center',
  },
  startTimeText: {
    fontSize: setSpText(20),
    height: scaleSize(30),
    color: color.themeText2,
    textAlign: 'center',
    padding: scaleSize(3),
  },
  modifyTime: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
  inputTime: {
    height: scaleSize(80),
    width: scaleSize(60),
    fontSize: setSpText(20),
    textAlign: 'center',
  },
  startMode: {
    flexDirection: 'row',
    height: 100,
    flex: 1,
  },
  startModetext: {
    height: scaleSize(80),
    paddingLeft: scaleSize(20),
  },
  startModeImage: {
    height: scaleSize(46),
    width: scaleSize(46),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  endlineStyle: {
    flex: 1,
    backgroundColor: color.bgG,
    height: scaleSize(1.5),
  },
  saveAndContinueImage: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
  saveAndContinueView2: {
    flexDirection: 'row',
    height: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveAndContinueText: {
    fontSize: setSpText(24),
    textAlign: 'center',
    color: color.blue2,
  },
  headerItem: {
    flexDirection: 'row',
    height: scaleSize(60),
    padding: scaleSize(30),
    alignItems: 'center',
    alignSelf: 'center',
  },
})
