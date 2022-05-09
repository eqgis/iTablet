import { connect } from 'react-redux'
import LayerAttributeTabs from './LayerAttributeTabs'
import {
  setCurrentAttribute,
  setLayerAttributes,
  setDataAttributes,
  setNaviAttributes,
  setAttributeHistory,
  clearAttributeHistory,
  setSelection,
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
  currentTask: state.cowork.toJS().currentTask,
  currentUser: state.user.toJS().currentUser,
})

const mapDispatchToProps = {
  setCurrentAttribute,
  setLayerAttributes,
  setDataAttributes,
  setNaviAttributes,
  setAttributeHistory,
  clearAttributeHistory,
  setBackAction,
  removeBackAction,
  setSelection,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LayerAttributeTabs)
