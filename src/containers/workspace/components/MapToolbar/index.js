import { connect } from 'react-redux'
import MapToolbar from './MapToolbar'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  device: state.device.toJS().device,
  isAR: state.setting.toJS().isAR,
  user: state.user.toJS(),
})

const mapDispatchToProps = {}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapToolbar)
// export default MapToolbar
