import { connect } from 'react-redux'
import MediaEdit from './MediaEdit'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  device: state.device.toJS().device,
})

export default connect(
  mapStateToProps,
  [],
)(MediaEdit)
