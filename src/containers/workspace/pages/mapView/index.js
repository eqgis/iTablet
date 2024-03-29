import { connect } from 'react-redux'
import MapView from './MapView'
import {
  setEditLayer,
  setSelection,
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
  getMapSetting,
  setMapLegend,
  setMapNavigation,
  setNavigationChangeAR,
  setNavigationPoiView,
  setOpenOnlineMap,
  setNavigationHistory,
  setNavBarDisplay,
  setDatumPoint,
  showAR,
  arPoiSearch,
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
import { downloadFile, deleteDownloadFile ,setSampleDataShow} from '../../../../redux/models/down'
import { setToolbarStatus } from '../../../../redux/models/toolbarStatus'
import { setCurrentARLayer, getARLayers } from '../../../../redux/models/arlayer'
import { createARMap, openARMap, saveARMap, closeARMap } from '../../../../redux/models/armap'
import { setCoworkService, clearCoworkService } from '../../../../redux/models/cowork'
import { setAIClassifyModel, setAIDetectModel } from '../../../../redux/models/setting'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  nav: state.nav.toJS(),
  editLayer: state.layers.toJS().editLayer,
  selection: state.layers.toJS().selection,
  latestMap: state.map.toJS().latestMap,
  map: state.map.toJS(),
  armap: state.armap.toJS(),
  arlayer: state.arlayer.toJS(),
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
  showDatumPoint: state.setting.toJS().showDatumPoint,
  poiSearch: state.setting.toJS().poiSearch,
  isAR: state.setting.toJS().isAR,
  backActions: state.backActions.toJS(),
  isClassifyView: state.ar.toJS().isClassifyView,
  mapArGuide: state.ar.toJS().mapArGuide,
  mapArMappingGuide: state.ar.toJS().mapArMappingGuide,
  mapAnalystGuide: state.home.toJS().mapAnalystGuide,
  coworkInfo: state.cowork.toJS().coworkInfo,
  currentTask: state.cowork.toJS().currentTask,
  coworkMessages: state.cowork.toJS().messages,
  themeGuide: state.home.toJS().themeGuide,
  collectGuide: state.home.toJS().collectGuide,
  mapEditGuide: state.home.toJS().mapEditGuide,
  currentGroup: state.cowork.toJS().currentGroup,
  currentTaskServices: state.cowork.toJS().services,
  showARSceneNotify: state.setting.toJS().showARSceneNotify,
  showSampleData: state.down.toJS().showSampleData,
  baseMaps: state.map.toJS().baseMaps,
  isShowCompass: state.setting.toJS().isShowCompass,
  aiDetectData: state.setting.toJS().aiDetectData,
  aiClassifyData: state.setting.toJS().aiClassifyData,
  peripheralDevice: state.setting.toJS().peripheralDevice,
  essentialInfo: state.location.toJS().essentialInfo,
  showARLabel: state.setting.toJS().showARLabel,
})

const mapDispatchToProps = {
  setEditLayer,
  setSelection,
  setLatestMap,
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
  setCurrentARLayer,
  getARLayers,
  createARMap,
  openARMap,
  saveARMap,
  closeARMap,
  setDatumPoint,
  showAR,
  setSampleDataShow,
  setCoworkService,
  clearCoworkService,
  arPoiSearch,
  setAIClassifyModel,
  setAIDetectModel,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapView)
