import { connect } from 'react-redux'
import LayerAttributeTabs from './LayerAttributeTabs'
import {
  setCurrentAttribute,
  setLayerAttributes,
  setAttributeHistory,
  clearAttributeHistory,
} from '../../../../redux/models/layers'
import {
  setBackAction,
  removeBackAction,
} from '../../../../redux/models/backActions'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  currentAttribute: state.layers.toJS().currentAttribute,
  attributes: state.layers.toJS().attributes,
  selection: state.layers.toJS().selection,
  currentLayer: state.layers.toJS().currentLayer,
  attributesHistory: state.layers.toJS().attributesHistory,
  map: state.map.toJS(),
  device: state.device.toJS().device,
})

const mapDispatchToProps = {
  setCurrentAttribute,
  setLayerAttributes,
  setAttributeHistory,
  clearAttributeHistory,
  setBackAction,
  removeBackAction,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LayerAttributeTabs)
