import { connect } from 'react-redux'
import MapCut from './MapCut'
import { getLayers } from '../../../../redux/models/layers'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  nav: state.nav.toJS(),
  map: state.map.toJS(),
  layers: state.layers.toJS().layers,
  device: state.device.toJS().device,
  currentUser: state.user.toJS().currentUser,
})

const mapDispatchToProps = {
  getLayers,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapCut)
