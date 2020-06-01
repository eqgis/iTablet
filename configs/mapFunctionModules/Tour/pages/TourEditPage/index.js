import { connect } from 'react-redux'
import TourEditPage from './TourEditPage'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  language: state.setting.toJS().language,
  device: state.device.toJS().device,
})

export default connect(
  mapStateToProps,
  [],
)(TourEditPage)
