import { connect } from 'react-redux'
import LayerAttribute from './LayerAttribute'
import {
  setCurrentAttribute,
  // getAttributes,
  // setAttributes,
  setLayerAttributes,
  setAttributeHistory,
  clearAttributeHistory,
  getLayers,
} from '../../../../redux/models/layers'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  currentAttribute: state.layers.toJS().currentAttribute,
  selection: state.layers.toJS().selection,
  currentLayer: state.layers.toJS().currentLayer,
  attributesHistory: state.layers.toJS().attributesHistory,
  attributes: state.layers.toJS().attributes,
  map: state.map.toJS(),
  nav: state.nav.toJS(),
  appConfig: state.appConfig.toJS(),
  mapModules: state.mapModules.toJS(),
  device: state.device.toJS().device,
  currentTask: state.cowork.toJS().currentTask,
  currentUser: state.user.toJS().currentUser,
})

const mapDispatchToProps = {
  setCurrentAttribute,
  // getAttributes,
  // setAttributes,
  setLayerAttributes,
  setAttributeHistory,
  clearAttributeHistory,
  getLayers,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LayerAttribute)
