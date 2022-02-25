import { connect } from 'react-redux'
import MT_layerManager from './MT_layerManager'
import {
  setEditLayer,
  setCurrentLayer,
  getLayers,
  clearAttributeHistory,
} from '../../redux/models/layers'
import { setMapLegend } from '../../redux/models/setting'
import { closeMap, mapToXml, mapFromXml } from '../../redux/models/map'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  editLayer: state.layers.toJS().editLayer,
  layers: state.layers.toJS().layers,
  map: state.map.toJS(),
  device: state.device.toJS().device,
  collection: state.collection.toJS(),
  currentLayer: state.layers.toJS().currentLayer,
  user: state.user.toJS(),
  baseMaps: state.map.toJS().baseMaps,
  appConfig: state.appConfig.toJS(),
  mapModules: state.mapModules.toJS(),
  cowork: state.cowork.toJS(),
})

const mapDispatchToProps = {
  setEditLayer,
  setCurrentLayer,
  getLayers,
  closeMap,
  clearAttributeHistory,
  setMapLegend,
  mapToXml,
  mapFromXml,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MT_layerManager)
