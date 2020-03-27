import { connect } from 'react-redux'
import ARMap from './ARMap'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
})
const mapDispatchToProps = {}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ARMap)
