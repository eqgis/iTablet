import { connect } from 'react-redux'
import CustomModePage from './CustomModePage'
const mapStateToProps = state => ({
  device: state.device.toJS().device,
  currentLayer: state.layers.toJS().currentLayer,
})

export default connect(mapStateToProps)(CustomModePage)
