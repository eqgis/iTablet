import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { color } from '../../../../styles'
import { scaleSize, dataUtil } from '../../../../utils'
import {
  SMSymbolTable,
  SMap,
  SCartography,
  STheme,
  SData,
  GeoStyle,
} from 'imobile_for_reactnative'
import { ConstToolType, ChunkType } from '../../../../constants'
import ToolbarModule from '../ToolBar/modules/ToolbarModule'
import { Value } from 'react-native-reanimated'

export default class SymbolList extends React.Component {
  props: {
    setCurrentSymbol?: () => {},
    layerData: Object,
    device: Object,
    type: String,
    getToolbarModule: () => {},
  }

  static defaultProps = {
    getToolbarModule: () => ToolbarModule,
  }

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      column: props.device.orientation.indexOf('LANDSCAPE') === 0 ? 3 : 4,
      // column: 4,
    }
  }

  _onSymbolClick = data => {
    if (
      global.Type === ChunkType.MAP_THEME &&
      this.props.layerData.themeType > 0
    ) {
      const params = {
        SymbolID: data.id,
      }
      switch (this.props.type) {
        case ConstToolType.SM_MAP_THEME_PARAM_DOT_DENSITY_SYMBOLS:
          STheme.modifyThemeDotDensityLayer(this.props.layerData.name,params)
          break
        case ConstToolType.SM_MAP_THEME_PARAM_GRADUATED_SYMBOLS:
          STheme.modifyGraduatedSymbolThemeMap(params)
          break
      }
      return
    }
    let event = this.props.getToolbarModule().getData().event

    if (this.props.type === ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_LINE) {
      SMap.addDataToMapHistory(event.layerInfo.path,[event.id],1).then((res)=>{
        if(res){
          const geoStyle = new GeoStyle()
          geoStyle.setMarkerSize(6)
          geoStyle.setMarkerStyle(data.id)
          geoStyle.setLineStyle(data.id)
          geoStyle.setFillStyle(data.id)
          SData.setGeometryStyle(
            {datasetName:event.layerInfo.datasetName||"",datasourceName:event.layerInfo.datasourceAlias||""},
            event.id,
            geoStyle,
          ).then((res)=>{
            if(res){
              SMap.refreshMap()
            }
          })
        }
        // SMap.setTaggingSymbolID(data.id, event.layerInfo.path, event.id)
      })
    } else if (this.props.layerData.type === 3) {
      // SCartography.setLineSymbolID(data.id, this.props.layerData.name)
      SMap.addMapHistory().then(()=>{
        SMap.setLayerStyle(this.props.layerData.name, {
          LineSymbolID: data.id,
        })
      })
    }

    if (this.props.type === ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_POINT) {
      SMap.addDataToMapHistory(event.layerInfo.path,[event.id],1).then((res)=>{
        if(res){
          const geoStyle = new GeoStyle()
          geoStyle.setMarkerSize(6)
          geoStyle.setMarkerStyle(data.id)
          geoStyle.setLineStyle(data.id)
          geoStyle.setFillStyle(data.id)
          SData.setGeometryStyle(
            {datasetName:event.layerInfo.datasetName||"",datasourceName:event.layerInfo.datasourceAlias||""},
            event.id,
            geoStyle,
          ).then((res)=>{
            if(res){
              SMap.refreshMap()
            }
          })
        }
        // SMap.setTaggingSymbolID(data.id, event.layerInfo.path, event.id)
      })
      // SMap.setTaggingSymbolID(data.id, event.layerInfo.path, event.id)
    } else if (this.props.layerData.type === 1) {
      // SCartography.setMakerSymbolID(data.id, this.props.layerData.name)
      SMap.addMapHistory().then(()=>{
        SMap.setLayerStyle(this.props.layerData.name, {
          MarkerSymbolID: data.id,
        })
      })
    }

    if (this.props.type === ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_REGION) {
      SMap.addDataToMapHistory(event.layerInfo.path,[event.id],1).then((res)=>{
        if(res){
          const geoStyle = new GeoStyle()
          geoStyle.setMarkerSize(6)
          geoStyle.setMarkerStyle(data.id)
          geoStyle.setLineStyle(data.id)
          geoStyle.setFillStyle(data.id)
          SData.setGeometryStyle(
            {datasetName:event.layerInfo.datasetName||"",datasourceName:event.layerInfo.datasourceAlias||""},
            event.id,
            geoStyle,
          ).then((res)=>{
            if(res){
              SMap.refreshMap()
            }
          })
        }
        // SMap.setTaggingSymbolID(data.id, event.layerInfo.path, event.id)
      })
      // SMap.setTaggingSymbolID(data.id, event.layerInfo.path, event.id)
    } else if (this.props.layerData.type === 5) {
      // SCartography.setFillSymbolID(data.id, this.props.layerData.name)
      SMap.addMapHistory().then(()=>{
        SMap.setLayerStyle(this.props.layerData.name, {
          FillSymbolID: data.id,
        })
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.device.orientation !== prevProps.device.orientation) {
      this.setState({
        column:
          this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? 3 : 4,
        // column: 4,
      })
    }
    if (
      JSON.stringify(prevProps.layerData.type) !==
        JSON.stringify(this.props.layerData.type) ||
      this.props.type !== prevProps.type
    ) {
      this.renderLibrary()
    }
  }

  componentDidMount() {
    this.renderLibrary()
  }

  renderLibrary = () => {
    let symbols = []
    if (global.Type === ChunkType.MAP_THEME) {
      switch (this.props.type) {
        case ConstToolType.SM_MAP_THEME_PARAM_DOT_DENSITY_SYMBOLS:
        case ConstToolType.SM_MAP_THEME_PARAM_GRADUATED_SYMBOLS:
          SData.getSymbolsByGroups('point', '').then(result => {
            result.forEach(item => {
              symbols.push(item)
            })
            this.setState({ layerData: this.props.layerData, data: symbols })
          })
          break
      }
      if (symbols.length > 0) return
    }
    let symbolType = this.props.layerData.type
    switch (this.props.type) {
      case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_POINT:
        symbolType = 1
        break
      case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_LINE:
        symbolType = 3
        break
      case ConstToolType.SM_MAP_MARKS_TAGGING_STYLE_REGION:
        symbolType = 5
        break
    }
    switch (symbolType) {
      case 3:
        SData.getSymbolsByGroups('line', '').then(result => {
          result.forEach(item => {
            symbols.push(item)
          })
          this.setState({ layerData: this.props.layerData, data: symbols })
        })
        break
      case 1:
        SData.getSymbolsByGroups('point', '').then(result => {
          result.forEach(item => {
            symbols.push(item)
          })
          this.setState({ layerData: this.props.layerData, data: symbols })
        })
        break
      case 5:
        SData.getSymbolsByGroups('fill', '').then(result => {
          result.forEach(item => {
            symbols.push(item)
          })
          this.setState({ layerData: this.props.layerData, data: symbols })
        })
        break
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ backgroundColor: '#rgba(0, 0, 0, 0)', height: 1 }} />
        <SMSymbolTable
          style={styles.table}
          data={this.state.data}
          tableStyle={{
            orientation: 1,
            // imageSize: Platform.OS === 'ios' ? scaleSize(60) : scaleSize(150),
            // count: Platform.OS === 'ios' ? 5 : 4,
            imageSize: 50,
            count: this.state.column,
            legendBackgroundColor: dataUtil.colorRgba(color.bgW),
            textColor: dataUtil.colorRgba(color.font_color_white),
          }}
          onSymbolClick={this._onSymbolClick}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: color.white,
  },
  table: {
    flex: 1,
    paddingHorizontal: scaleSize(30),
    alignItems: 'center',
    backgroundColor: color.white,
  },
})
