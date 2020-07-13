import { connect } from 'react-redux'
import TemplateManager from './TemplateManager'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  nav: state.nav.toJS(),
  map: state.map.toJS(),
  layers: state.layers.toJS().layers,
  device: state.device.toJS().device,
  currentUser: state.user.toJS().currentUser,
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TemplateManager)
