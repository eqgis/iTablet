import { connect } from 'react-redux'
import LayerAttributeSearch from './LayerAttributeSearch'
import {
  setCurrentAttribute,
  setLayerAttributes,
  getLayers,
} from '../../../../redux/models/layers'
import { closeMap } from '../../../../redux/models/map'

const mapStateToProps = state => ({
  currentAttribute: state.layers.toJS().currentAttribute,
  selection: state.layers.toJS().selection,
  currentLayer: state.layers.toJS().currentLayer,
  attributes: state.layers.toJS().attributes,
  map: state.map.toJS(),
  nav: state.nav.toJS(),
  language: state.setting.toJS().language,
})

const mapDispatchToProps = {
  setCurrentAttribute,
  closeMap,
  setLayerAttributes,
  getLayers,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LayerAttributeSearch)
