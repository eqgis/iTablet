import { connect } from 'react-redux'
import CustomModePage from './CustomModePage'
const mapStateToProps = state => ({
  device: state.device.toJS().device,
})

export default connect(mapStateToProps)(CustomModePage)
