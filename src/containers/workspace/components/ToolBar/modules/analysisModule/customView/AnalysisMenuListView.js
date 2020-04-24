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

import NavigationService from '../../../../../../../containers/NavigationService'

export default class AnalysisMenuListView extends React.Component {
  props: {
    layerName: string,
    geoId: number,
    device: Object,
    saveAndContinue: () => {},
    savePlotAnimationNode: () => {},
    showToolbar: () => {},
  }

  constructor(props) {
    super(props)

    let toolData = this.getToolData()
    this.state = {
      //   data: props.data,
      animationMode: -1,
      startTime: 0 + '',
      durationTime: 5 + '',
      startMode: 1,
      data: toolData,
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
      image: getThemeAssets().analyst.analysis_shortestpath,
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
          <View
            style={{
              position: 'absolute',
              backgroundColor: 'red',
              height: scaleSize(15),
              width: scaleSize(15),
              borderRadius: scaleSize(15),
              right: scaleSize(0),
              top: scaleSize(2),
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: color.bgW,
                fontSize: setSpText(10),
              }}
            />
          </View>
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

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          ref={ref => (this.scrollView = ref)}
        >
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
    height: scaleSize(40),
    width: scaleSize(100),
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
