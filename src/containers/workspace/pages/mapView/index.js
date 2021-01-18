import { connect } from 'react-redux'
import MapView from './MapView'
import {
  setEditLayer,
  setSelection,
  setAnalystLayer,
  getLayers,
  setCurrentAttribute,
  setCurrentLayer,
  clearAttributeHistory,
} from '../../../../redux/models/layers'
import {
  setLatestMap,
  setCurrentMap,
  getMaps,
  openWorkspace,
  closeWorkspace,
  exportWorkspace,
  openMap,
  closeMap,
  saveMap,
} from '../../../../redux/models/map'
import {
  // importTemplate,
  importWorkspace,
  setCurrentTemplateInfo,
  setCurrentPlotInfo,
  setTemplate,
  getSymbolTemplates,
  getSymbolPlots,
} from '../../../../redux/models/template'
import {
  setBufferSetting,
  setOverlaySetting,
  getMapSetting,
  setMapLegend,
  setMapNavigation,
  setNavigationChangeAR,
  setNavigationPoiView,
  setOpenOnlineMap,
  setNavigationHistory,
  setNavBarDisplay,
} from '../../../../redux/models/setting'
import { setMapSearchHistory } from '../../../../redux/models/histories'
import { setSharing } from '../../../../redux/models/online'
import {
  setCurrentSymbols,
  setCurrentSymbol,
} from '../../../../redux/models/symbol'
import { setCollectionInfo } from '../../../../redux/models/collection'
import {
  setBackAction,
  removeBackAction,
} from '../../../../redux/models/backActions'
import { setAnalystParams } from '../../../../redux/models/analyst'
import { downloadFile, deleteDownloadFile } from '../../../../redux/models/down'
import { setToolbarStatus } from '../../../../redux/models/toolbarStatus'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  nav: state.nav.toJS(),
  editLayer: state.layers.toJS().editLayer,
  analystLayer: state.layers.toJS().analystLayer,
  selection: state.layers.toJS().selection,
  latestMap: state.map.toJS().latestMap,
  map: state.map.toJS(),
  bufferSetting: state.setting.toJS().buffer,
  overlaySetting: state.setting.toJS().overlay,
  symbol: state.symbol.toJS(),
  user: state.user.toJS(),
  currentLayer: state.layers.toJS().currentLayer,
  layers: state.layers.toJS(),
  collection: state.collection.toJS(),
  template: state.template.toJS(),
  device: state.device.toJS().device,
  online: state.online.toJS(),
  mapLegend: state.setting.toJS().mapLegend,
  mapNavigation: state.setting.toJS().mapNavigation,
  navigationChangeAR: state.setting.toJS().navigationChangeAR,
  navigationPoiView: state.setting.toJS().navigationPoiView,
  mapScaleView: state.setting.toJS().mapScaleView,
  analyst: state.analyst.toJS(),
  downloads: state.down.toJS().downloads,
  mapSearchHistory: state.histories.toJS().mapSearchHistory,
  openOnlineMap: state.setting.toJS().openOnlineMap,
  navigationhistory: state.setting.toJS().navigationhistory,
  toolbarStatus: state.toolbarStatus.toJS(),
  appConfig: state.appConfig.toJS(),
  mapModules: state.mapModules.toJS(),
  mapColumnNavBar: state.setting.toJS().mapColumnNavBar,
  navBarDisplay: state.setting.toJS().navBarDisplay,
  laboratory: state.setting.toJS().laboratory,
  backActions: state.backActions.toJS(),
  isClassifyView: state.ar.toJS().isClassifyView,
  mapArGuide: state.ar.toJS().mapArGuide,
  mapArMappingGuide: state.ar.toJS().mapArMappingGuide,
})

const mapDispatchToProps = {
  setEditLayer,
  setSelection,
  setLatestMap,
  setBufferSetting,
  setOverlaySetting,
  setAnalystLayer,
  setCurrentMap,
  getLayers,
  setCollectionInfo,
  setCurrentLayer,
  setCurrentAttribute,
  clearAttributeHistory,
  // importTemplate,
  importWorkspace,
  setCurrentTemplateInfo,
  setCurrentPlotInfo,
  setTemplate,
  getMaps,
  exportWorkspace,
  openWorkspace,
  closeWorkspace,
  openMap,
  closeMap,
  getSymbolTemplates,
  getSymbolPlots,
  saveMap,
  getMapSetting,
  setSharing,
  setCurrentSymbol,
  setCurrentSymbols,
  setMapLegend,
  setBackAction,
  removeBackAction,
  setAnalystParams,
  setMapNavigation,
  setNavigationChangeAR,
  setNavigationPoiView,
  setMapSearchHistory,
  setNavigationHistory,
  setOpenOnlineMap,
  downloadFile,
  deleteDownloadFile,
  setToolbarStatus,
  setNavBarDisplay,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapView)
