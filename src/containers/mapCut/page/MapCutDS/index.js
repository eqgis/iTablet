import { connect } from 'react-redux'
import MapCutDS from './MapCutDS'
import { getLayers } from '../../../../redux/models/layers'

const mapStateToProps = state => ({
  layers: state.layers.toJS().layers,
})

const mapDispatchToProps = {
  getLayers,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapCutDS)
