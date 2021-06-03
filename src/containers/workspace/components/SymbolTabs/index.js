import { connect } from 'react-redux'
import * as React from 'react'
import { StyleSheet } from 'react-native'
import { color } from '../../../../styles'
import { scaleSize, setSpText, screen } from '../../../../utils'
import { ChunkType, Height } from '../../../../constants'
import DefaultTabBar from './DefaultTabBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import GroupTab from './GroupTab'
import SymbolTab from './SymbolTab'
import {
  setCurrentSymbol,
  setCurrentSymbols,
} from '../../../../redux/models/symbol'
import {
  setCurrentTemplateInfo,
  setCurrentPlotInfo,
  getSymbolTemplates,
  getSymbolPlots,
  setCurrentTemplateList,
  setCurrentPlotList,
} from '../../../../redux/models/template'
import { setEditLayer } from '../../../../redux/models/layers'
import TemplateList from './TemplateList'
import TemplateTab from './TemplateTab'
import { SMap } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language/index'
import PlotList from './PlotList'
import PlotTab from './PlotTab'
import PlotLibTab from './PlotLibTab'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  symbol: state.symbol.toJS(),
  user: state.user.toJS(),
  map: state.map.toJS(),
  template: state.template.toJS(),
  layers: state.layers.toJS().layers,
  currentMap: state.map.toJS().currentMap,
  device: state.device.toJS().device,
})

const mapDispatchToProps = {
  setCurrentSymbol,
  setCurrentSymbols,
  setCurrentTemplateInfo,
  setCurrentPlotInfo,
  setEditLayer,
  getSymbolTemplates,
  getSymbolPlots,
  setCurrentTemplateList,
  setCurrentPlotList,
}

class SymbolTabs extends React.Component {
  props: {
    language: string,
    style: Object,
    symbol: Object,
    template: Object,
    column: number,
    layers: Object,
    map: Object,
    user: Object,
    setCurrentSymbol: () => {},
    setCurrentSymbols: () => {},
    showToolbar: () => {},
    showBox: () => {},
    setCurrentTemplateInfo: () => {},
    setCurrentPlotInfo: () => {},
    setEditLayer: () => {},
    getSymbolTemplates: () => {},
    getSymbolPlots: () => {},
    setCurrentTemplateList: () => {},
    setCurrentPlotList: () => {},
    device: Object,
  }

  static defaultProps = {
    type: 'Normal', // Normal | TemplateList
  }

  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
    }
  }

  componentDidMount() {
    if (this.props.map.currentMap && this.props.map.currentMap.Template) {
      this.props.template.currentTemplateList.length === 0 &&
        this.initTemplate()
    } else {
      this.props.symbol.currentSymbols.length === 0 && this.initSymbols()
    }
    if (
      GLOBAL.Type === ChunkType.MAP_PLOTTING &&
      this.props.template.currentPlotList.length === 0
    ) {
      this.initPlotting()
    }
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.map.currentMap) !==
        JSON.stringify(this.props.map.currentMap) &&
      this.props.map.currentMap.name
    ) {
      if (this.props.map.currentMap && this.props.map.currentMap.Template) {
        this.initTemplate()
      } else {
        this.initSymbols()
      }
    }
  }

  initSymbols = () => {
    SMap.getSymbolGroups().then(result => {
      let symbols = []

      let initSymbols = async function(data) {
        SMap.findSymbolsByGroups(data[0].type, data[0].path).then(result => {
          symbols = result
          if (symbols && symbols.length > 0) {
            this.props.setCurrentSymbols &&
              this.props.setCurrentSymbols(symbols)
          } else {
            if (data[0].childGroups && data[0].childGroups.length > 0) {
              initSymbols(data[0].childGroups)
            }
          }
        })
      }.bind(this)

      if (result.length > 0) {
        initSymbols(result)
      }
    })
  }

  initPlotting = () => {
    if (
      this.props.template.template.symbols &&
      this.props.template.template.symbols.length > 0
    ) {
      this.props.setCurrentPlotList(this.props.template.template.symbols[0])
    }
  }

  initTemplate = () => {
    if (
      this.props.template.template.symbols &&
      this.props.template.template.symbols.length > 0
    ) {
      let dealData = function(list) {
        let mList = []
        for (let i = 0; i < list.length; i++) {
          if (list[i].feature && list[i].feature.length > 0) {
            list[i].id = list[i].code
            list[i].childGroups = []
            list[i].childGroups = dealData(list[i].feature)
            mList.push(list[i])
          }
        }
        return mList
      }
      let data = dealData(this.props.template.template.symbols)

      this.props.setCurrentTemplateList(data[0])
    }
  }

  goToPage = index => {
    // this.scrollTab.goToPage(index)
    this.state.currentPage !== index &&
      this.setState({
        currentPage: index,
      })
  }

  _getWidth = () => {
    let width = screen.getScreenWidth(this.props.device.orientation)
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      width = Height.TABLE_ROW_HEIGHT_2 * 8
    }
    return width
  }

  renderTabs = () => {
    return (
      <ScrollableTabView
        ref={ref => (this.scrollTab = ref)}
        style={[styles.container, this.props.style]}
        initialPage={1}
        page={this.state.currentPage}
        onChangeTab={({ i }) => this.goToPage(i)}
        renderTabBar={() => (
          <DefaultTabBar
            activeBackgroundColor={'transparent'}
            activeTextColor={color.themeText2}
            inactiveTextColor={color.white}
            textStyle={styles.tabTextStyle}
            tabStyle={styles.tabStyle}
          />
        )}
        tabBarUnderlineStyle={[
          styles.tabBarUnderlineStyle,
          {marginLeft: this._getWidth() / 3 / 2 - scaleSize(32)},
        ]}
      >
        <SymbolTab
          tabLabel={
            getLanguage(this.props.language).Map_Main_Menu.COLLECTION_RECENT
          }
          //"最近"
          data={this.props.symbol.latestSymbols}
          setCurrentSymbol={this.props.setCurrentSymbol}
          showToolbar={this.props.showToolbar}
          device={this.props.device}
          column={this.props.column}
        />
        <SymbolTab
          tabLabel={
            getLanguage(this.props.language).Map_Main_Menu.COLLECTION_SYMBOL
          }
          //"符号"
          data={this.props.symbol.currentSymbols}
          setCurrentSymbol={this.props.setCurrentSymbol}
          showToolbar={this.props.showToolbar}
          device={this.props.device}
          column={this.props.column}
        />
        <GroupTab
          tabLabel={
            getLanguage(this.props.language).Map_Main_Menu.COLLECTION_GROUP
          }
          //"分组"
          goToPage={this.goToPage}
          setCurrentSymbols={this.props.setCurrentSymbols}
        />
        {/*<TemplateTab tabLabel="模板" />*/}
      </ScrollableTabView>
    )
  }

  renderTempleTab = () => {
    return (
      <ScrollableTabView
        ref={ref => (this.scrollTab = ref)}
        style={[styles.container, this.props.style]}
        initialPage={1}
        page={this.state.currentPage}
        onChangeTab={({ i }) => this.goToPage(i)}
        renderTabBar={() => (
          <DefaultTabBar
            style={styles.tabs}
            activeBackgroundColor={color.white}
            activeTextColor={color.themeText2}
            inactiveTextColor={color.white}
            textStyle={styles.tabTextStyle}
            tabStyle={styles.tabStyle}
          />
        )}
        tabBarUnderlineStyle={[
          styles.tabBarUnderlineStyle,
          {marginLeft: this._getWidth() / 3 / 2 - scaleSize(32)},
        ]}
      >
        <TemplateTab
          tabLabel={
            getLanguage(this.props.language).Map_Main_Menu.COLLECTION_RECENT
          }
          //"最近"
          style={styles.temple}
          user={this.props.user}
          showToolbar={this.props.showToolbar}
          data={this.props.template.latestTemplateSymbols}
          layers={this.props.layers}
          setCurrentTemplateInfo={this.props.setCurrentTemplateInfo}
          setEditLayer={this.props.setEditLayer}
          getSymbolTemplates={this.props.getSymbolTemplates}
          setCurrentSymbol={this.props.setCurrentSymbol}
          device={this.props.device}
          column={this.props.column}
        />
        <TemplateTab
          tabLabel={
            getLanguage(this.props.language).Map_Main_Menu.COLLECTION_SYMBOL
          }
          //"符号"
          style={styles.temple}
          user={this.props.user}
          showToolbar={this.props.showToolbar}
          data={this.props.template.currentTemplateList}
          layers={this.props.layers}
          setCurrentTemplateInfo={this.props.setCurrentTemplateInfo}
          setEditLayer={this.props.setEditLayer}
          getSymbolTemplates={this.props.getSymbolTemplates}
          setCurrentSymbol={this.props.setCurrentSymbol}
          device={this.props.device}
          column={this.props.column}
        />
        <TemplateList
          tabLabel={
            getLanguage(this.props.language).Map_Main_Menu.COLLECTION_GROUP
          }
          //"分组"
          style={styles.temple}
          user={this.props.user}
          showToolbar={this.props.showToolbar}
          template={this.props.template}
          layers={this.props.layers}
          setCurrentTemplateInfo={this.props.setCurrentTemplateInfo}
          setEditLayer={this.props.setEditLayer}
          getSymbolTemplates={this.props.getSymbolTemplates}
          setCurrentTemplateList={this.props.setCurrentTemplateList}
          goToPage={this.goToPage}
        />
        {/*<TemplateTab tabLabel="模板" />*/}
      </ScrollableTabView>
    )
  }

  renderPlotTab = () => {
    return (
      <ScrollableTabView
        ref={ref => (this.scrollTab = ref)}
        style={[styles.container, this.props.style]}
        initialPage={1}
        page={this.state.currentPage}
        onChangeTab={({ i }) => this.goToPage(i)}
        renderTabBar={() => (
          <DefaultTabBar
            activeBackgroundColor={color.white}
            activeTextColor={color.themeText2}
            inactiveTextColor={color.white}
            textStyle={styles.tabTextStyle}
            tabStyle={styles.tabStyle}
          />
        )}
        tabBarUnderlineStyle={[
          styles.tabBarUnderlineStyle,
          {marginLeft: this._getWidth() / 4 / 2 - scaleSize(32)},
        ]}
      >
        <PlotTab
          tabLabel={
            getLanguage(this.props.language).Map_Main_Menu.COLLECTION_RECENT
          }
          //"最近"
          style={styles.temple}
          user={this.props.user}
          showToolbar={this.props.showToolbar}
          data={this.props.template.latestPlotSymbols}
          layers={this.props.layers}
          setCurrentPlotInfo={this.props.setCurrentPlotInfo}
          setEditLayer={this.props.setEditLayer}
          getSymbolPlots={this.props.getSymbolPlots}
          setCurrentSymbol={this.props.setCurrentSymbol}
          device={this.props.device}
        />
        <PlotTab
          tabLabel={
            getLanguage(this.props.language).Map_Main_Menu.COLLECTION_SYMBOL
          }
          //"符号"
          style={styles.temple}
          user={this.props.user}
          showToolbar={this.props.showToolbar}
          data={this.props.template.currentPlotList}
          layers={this.props.layers}
          setCurrentPlotInfo={this.props.setCurrentPlotInfo}
          setEditLayer={this.props.setEditLayer}
          getSymbolPlots={this.props.getSymbolPlots}
          setCurrentSymbol={this.props.setCurrentSymbol}
          device={this.props.device}
        />
        <PlotList
          tabLabel={
            getLanguage(this.props.language).Map_Main_Menu.COLLECTION_GROUP
          }
          //"分组"
          style={styles.temple}
          user={this.props.user}
          showToolbar={this.props.showToolbar}
          template={this.props.template}
          layers={this.props.layers}
          setCurrentPlotInfo={this.props.setCurrentPlotInfo}
          setEditLayer={this.props.setEditLayer}
          getSymbolPlots={this.props.getSymbolPlots}
          setCurrentPlotList={this.props.setCurrentPlotList}
          goToPage={this.goToPage}
        />
        <PlotLibTab
          tabLabel={getLanguage(this.props.language).Map_Main_Menu.PLOTTING_LIB}
          //"符号"
          style={styles.temple}
          user={this.props.user}
          showToolbar={this.props.showToolbar}
          template={this.props.template}
          data={this.props.template.plotLibPaths}
          layers={this.props.layers}
          setCurrentPlotInfo={this.props.setCurrentPlotInfo}
          setEditLayer={this.props.setEditLayer}
          getSymbolPlots={this.props.getSymbolPlots}
          setCurrentSymbol={this.props.setCurrentSymbol}
          setCurrentPlotList={this.props.setCurrentPlotList}
          device={this.props.device}
          goToPage={this.goToPage}
        />
        {/*<TemplateTab tabLabel="模板" />*/}
      </ScrollableTabView>
    )
  }

  render() {
    if (GLOBAL.Type === ChunkType.MAP_PLOTTING) {
      return this.renderPlotTab()
    }

    if (this.props.map.currentMap && this.props.map.currentMap.Template) {
      return this.renderTempleTab()
    } else {
      return this.renderTabs()
    }
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    backgroundColor: color.white,
    overflow: 'hidden',
  },
  temple: {
    paddingHorizontal: scaleSize(30),
  },
  tabs: {
    // marginHorizontal: scaleSize(80),
  },
  tabBarUnderlineStyle: {
    backgroundColor: color.black,
    height: scaleSize(4),
    width: scaleSize(64),
    borderRadius: scaleSize(2),
    marginBottom: scaleSize(12),
  },
  tabTextStyle: {
    fontSize: setSpText(22),
    backgroundColor: 'transparent',
    color: color.fontColorBlack,
  },
  tabStyle: {
    // backgroundColor: color.subTheme,
    backgroundColor: color.white,
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SymbolTabs)
